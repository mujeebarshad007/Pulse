import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createDatabase, databaseConfig } from "../../src/server/database.ts";
import { migrate } from "../../src/server/migrations.ts";
import { labCommand, labSnapshot } from "../../src/server/labs.ts";
import { fixtureActor } from "./fixtures.ts";
const pool = createDatabase(databaseConfig());
before(async () => {
  await migrate(pool, path.resolve("database/migrations"));
});
after(async () => {
  await pool.end();
});
const offering = {
  type: "offering",
  name: "Fictional test",
  category: "Sample category",
  labName: "Fictional Lahore laboratory",
  city: "Lahore",
  address: "Fictional test location",
  preparation: "Contact the lab. Fictional testing only.",
  fee: 2000,
  published: true,
  active: true,
};
async function setup() {
  const lab = await fixtureActor(pool, "lab"),
    patient = await fixtureActor(pool, "patient"),
    other = await fixtureActor(pool, "patient"),
    foreign = await fixtureActor(pool, "lab");
  const t = await labCommand(pool, lab, offering),
    start = new Date(Date.now() + 86400000),
    end = new Date(start.getTime() + 1800000);
  const s = await labCommand(pool, lab, {
    type: "slot",
    testId: t.id,
    start: start.toISOString(),
    end: end.toISOString(),
  });
  return {
    lab,
    patient,
    other,
    foreign,
    testId: t.id,
    slotId: s.id,
    start,
    end,
  };
}
test("lab catalog privacy and ownership survive direct server calls", async () => {
  const a = await setup();
  await assert.rejects(labCommand(pool, a.patient, offering), {
    code: "FORBIDDEN",
  });
  await assert.rejects(
    labCommand(pool, a.foreign, { ...offering, id: a.testId }),
    { code: "FORBIDDEN" },
  );
  await labCommand(pool, a.lab, {
    ...offering,
    id: a.testId,
    published: false,
  });
  assert.ok(
    !(await labSnapshot(pool, null)).offerings.some((t) => t.id === a.testId),
  );
  assert.ok(
    (await labSnapshot(pool, a.lab)).offerings.some((t) => t.id === a.testId),
  );
  await assert.rejects(
    labCommand(pool, a.patient, {
      type: "request",
      slotId: a.slotId,
      requestKey: randomUUID(),
    }),
    { code: "CONFLICT" },
  );
  assert.equal((await labSnapshot(pool, null)).bookings.length, 0);
});
test("concurrent lab bookings reserve one slot, retry is idempotent and the saved price survives catalog edits", async () => {
  const a = await setup(),
    key = randomUUID();
  const attempts = await Promise.allSettled([
    labCommand(pool, a.patient, {
      type: "request",
      slotId: a.slotId,
      requestKey: key,
    }),
    labCommand(pool, a.other, {
      type: "request",
      slotId: a.slotId,
      requestKey: randomUUID(),
    }),
  ]);
  assert.equal(attempts.filter((r) => r.status === "fulfilled").length, 1);
  const rows = await pool.query(
    "SELECT * FROM pulse.lab_bookings WHERE slot_id=$1",
    [a.slotId],
  );
  const b = rows.rows[0],
    actor = b.patient_id === a.patient.id ? a.patient : a.other;
  const retry = await labCommand(pool, actor, {
    type: "request",
    slotId: a.slotId,
    requestKey: b.request_key,
  });
  assert.equal(retry.id, b.id);
  await labCommand(pool, a.lab, { ...offering, id: a.testId, fee: 4000 });
  assert.equal(
    (await labSnapshot(pool, actor)).bookings.find((x) => x.id === b.id)?.price,
    2000,
  );
  await assert.rejects(
    labCommand(pool, a.foreign, {
      type: "transition",
      id: b.id,
      status: "Confirmed",
    }),
    { code: "NOT_FOUND" },
  );
  await labCommand(pool, a.lab, {
    type: "transition",
    id: b.id,
    status: "Confirmed",
  });
  await assert.rejects(
    labCommand(pool, actor, {
      type: "transition",
      id: b.id,
      status: "Completed",
    }),
    { code: "CONFLICT" },
  );
  await labCommand(pool, actor, {
    type: "transition",
    id: b.id,
    status: "Cancelled",
  });
  assert.ok(
    (await labSnapshot(pool, null)).slots.some((s) => s.id === a.slotId),
  );
});
test("patient cannot overlap lab visits and lab cancellation requires a reason", async () => {
  const a = await setup();
  const t = await labCommand(pool, a.lab, {
    ...offering,
    name: "Another fictional test",
  });
  const s = await labCommand(pool, a.lab, {
    type: "slot",
    testId: t.id,
    start: a.start.toISOString(),
    end: a.end.toISOString(),
  });
  const b = await labCommand(pool, a.patient, {
    type: "request",
    slotId: a.slotId,
    requestKey: randomUUID(),
  });
  await assert.rejects(
    labCommand(pool, a.patient, {
      type: "request",
      slotId: s.id,
      requestKey: randomUUID(),
    }),
  );
  await assert.rejects(
    labCommand(pool, a.lab, {
      type: "transition",
      id: b.id,
      status: "Cancelled",
    }),
    { code: "INVALID_INPUT" },
  );
  await labCommand(pool, a.lab, {
    type: "transition",
    id: b.id,
    status: "Cancelled",
    reason: "Fictional closure",
  });
  await labCommand(pool, a.patient, {
    type: "request",
    slotId: s.id,
    requestKey: randomUUID(),
  });
});
test("expired requests stay in history and private reports cannot be linked to another patient or lab", async () => {
  const a = await setup(),
    b = await labCommand(pool, a.patient, {
      type: "request",
      slotId: a.slotId,
      requestKey: randomUUID(),
    });
  await labCommand(pool, a.lab, {
    type: "transition",
    id: b.id,
    status: "Confirmed",
  });
  const report = randomUUID();
  await pool.query(
    "INSERT INTO pulse.reports(id,patient_id,lab_id,title,file_name,byte_size,sha256) VALUES($1,$2,$3,'Fictional','test.pdf',12,$4)",
    [report, a.other.id, a.lab.id, "a".repeat(64)],
  );
  await assert.rejects(
    labCommand(pool, a.lab, { type: "linkReport", id: b.id, reportId: report }),
    { code: "NOT_FOUND" },
  );
  await pool.query("UPDATE pulse.reports SET patient_id=$2 WHERE id=$1", [
    report,
    a.patient.id,
  ]);
  await assert.rejects(
    labCommand(pool, a.foreign, {
      type: "linkReport",
      id: b.id,
      reportId: report,
    }),
    { code: "NOT_FOUND" },
  );
  await labCommand(pool, a.lab, {
    type: "linkReport",
    id: b.id,
    reportId: report,
  });
  assert.equal(
    (await labSnapshot(pool, a.patient)).bookings.find((x) => x.id === b.id)
      ?.reports[0].id,
    report,
  );
  assert.ok(
    !(await labSnapshot(pool, a.other)).bookings.some((x) => x.id === b.id),
  );
  const slot = randomUUID(),
    expired = randomUUID(),
    start = new Date(Date.now() - 7200000),
    end = new Date(Date.now() - 5400000);
  await pool.query(
    "INSERT INTO pulse.lab_slots(id,test_id,lab_id,starts_at,ends_at) VALUES($1,$2,$3,$4,$5)",
    [slot, a.testId, a.lab.id, start, end],
  );
  await pool.query(
    "INSERT INTO pulse.lab_bookings(id,patient_id,slot_id,test_id,lab_id,starts_at,ends_at,price,request_key,status) VALUES($1,$2,$3,$4,$5,$6,$7,2000,$8,'Requested')",
    [expired, a.patient.id, slot, a.testId, a.lab.id, start, end, randomUUID()],
  );
  assert.equal(
    (await labSnapshot(pool, a.patient)).bookings.find((x) => x.id === expired)
      ?.status,
    "Expired",
  );
  await assert.rejects(
    labCommand(pool, a.lab, {
      type: "transition",
      id: expired,
      status: "Confirmed",
    }),
    { code: "CONFLICT" },
  );
});

test("disabled laboratory offerings cannot accept requests, and past confirmed visits can complete only once",async()=>{
 const a=await setup();
 await pool.query("UPDATE pulse.members SET enabled=false WHERE id=$1",[a.lab.id]);
 assert.ok(!(await labSnapshot(pool,null)).offerings.some(t=>t.id===a.testId));
 await assert.rejects(labCommand(pool,a.patient,{type:"request",slotId:a.slotId,requestKey:randomUUID()}),{code:"CONFLICT"});
 await pool.query("UPDATE pulse.members SET enabled=true WHERE id=$1",[a.lab.id]);
 const slot=randomUUID(),id=randomUUID(),start=new Date(Date.now()-7200000),end=new Date(Date.now()-5400000);
 await pool.query("INSERT INTO pulse.lab_slots(id,test_id,lab_id,starts_at,ends_at) VALUES($1,$2,$3,$4,$5)",[slot,a.testId,a.lab.id,start,end]);
 await pool.query("INSERT INTO pulse.lab_bookings(id,patient_id,slot_id,test_id,lab_id,starts_at,ends_at,price,request_key,status) VALUES($1,$2,$3,$4,$5,$6,$7,2000,$8,'Confirmed')",[id,a.patient.id,slot,a.testId,a.lab.id,start,end,randomUUID()]);
 await labCommand(pool,a.lab,{type:"transition",id,status:"Completed"});
 await labCommand(pool,a.lab,{type:"transition",id,status:"Completed"});
 assert.equal((await labSnapshot(pool,a.patient)).bookings.find(b=>b.id===id)?.status,"Completed");
 await assert.rejects(labCommand(pool,a.patient,{type:"transition",id,status:"Cancelled"}),{code:"CONFLICT"});
});
