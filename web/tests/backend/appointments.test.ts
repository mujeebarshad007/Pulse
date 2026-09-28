import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createDatabase, databaseConfig } from "../../src/server/database.ts";
import { migrate } from "../../src/server/migrations.ts";
import { ServiceError } from "../../src/server/errors.ts";
import { addAvailability, removeAvailability, requestAppointment, changeAppointment, listAppointments, type BookingPrincipal } from "../../src/server/appointments.ts";

const pool = createDatabase(databaseConfig());
const doctor = (): BookingPrincipal => ({ id: randomUUID(), role: "doctor" });
const patient = (): BookingPrincipal => ({ id: randomUUID(), role: "patient" });
const time = (minutes: number) => new Date(Date.now() + 86400000 + minutes * 60000).toISOString();
const code = (expected: string) => (error: unknown) => error instanceof ServiceError && error.code === expected;
before(async () => { await migrate(pool, path.resolve("database/migrations")); });
after(async () => { await pool.end(); });

test("simultaneous patients cannot occupy the same slot", async () => {
  const owner = doctor();
  const slot = await addAvailability(pool, owner, time(0), time(30));
  const outcomes = await Promise.allSettled(Array.from({ length: 6 }, () => requestAppointment(pool, patient(), slot)));
  assert.equal(outcomes.filter(r => r.status === "fulfilled").length, 1);
  for (const result of outcomes) if (result.status === "rejected") assert.ok(code("CONFLICT")(result.reason));
  assert.equal((await listAppointments(pool, owner)).length, 1);
});

test("simultaneous requests cannot book overlapping visits for one patient", async () => {
  const first = await addAvailability(pool, doctor(), time(0), time(30));
  const second = await addAvailability(pool, doctor(), time(15), time(45));
  const actor = patient();
  const outcomes = await Promise.allSettled([requestAppointment(pool, actor, first), requestAppointment(pool, actor, second)]);
  assert.equal(outcomes.filter(r => r.status === "fulfilled").length, 1);
  assert.equal((await listAppointments(pool, actor)).length, 1);
});

test("overlapping availability is refused, adjacent instants and timezone offsets work", async () => {
  const owner = doctor();
  const start = new Date(Date.now() + 86400000); start.setUTCSeconds(0, 0);
  const end = new Date(start.getTime() + 1800000);
  await addAvailability(pool, owner, start.toISOString(), end.toISOString());
  await assert.rejects(addAvailability(pool, owner, start.toISOString(), end.toISOString()), code("CONFLICT"));
  const endPakistan = new Date(end.getTime() + 5 * 3600000).toISOString().replace("Z", "+05:00");
  await addAvailability(pool, owner, endPakistan, new Date(end.getTime() + 1800000).toISOString());
});

test("declining releases capacity while preserving original history", async () => {
  const owner = doctor(), original = patient(), replacement = patient();
  const slot = await addAvailability(pool, owner, time(0), time(30));
  const request = await requestAppointment(pool, original, slot);
  await changeAppointment(pool, owner, request.id, "Declined");
  await requestAppointment(pool, replacement, slot);
  assert.equal((await listAppointments(pool, original))[0].status, "Declined");
  assert.equal((await listAppointments(pool, owner)).length, 2);
  await assert.rejects(removeAvailability(pool, owner, slot), code("CONFLICT"));
});

test("only the owning doctor can transition; invalid transitions and reassignment fail", async () => {
  const owner = doctor(), actor = patient();
  const slot = await addAvailability(pool, owner, time(0), time(30));
  const request = await requestAppointment(pool, actor, slot);
  await assert.rejects(changeAppointment(pool, doctor(), request.id, "Confirmed"), code("NOT_FOUND"));
  await assert.rejects(changeAppointment(pool, actor, request.id, "Confirmed"), code("INVALID_INPUT"));
  await assert.rejects(changeAppointment(pool, owner, request.id, "Completed"), code("CONFLICT"));
  await changeAppointment(pool, owner, request.id, "Confirmed");
  await changeAppointment(pool, owner, request.id, "Confirmed");
  await changeAppointment(pool, owner, request.id, "Completed");
  await assert.rejects(changeAppointment(pool, owner, request.id, "Declined"), code("CONFLICT"));
  await assert.rejects(pool.query("UPDATE pulse.appointments SET status='Requested' WHERE id=$1", [request.id]), { code: "23514" });
  await assert.rejects(pool.query("UPDATE pulse.appointments SET patient_id=$2 WHERE id=$1", [request.id, randomUUID()]), { code: "23514" });
  assert.equal((await listAppointments(pool, patient())).length, 0);
  assert.equal((await listAppointments(pool, doctor())).length, 0);
});

test("validation rejects ambiguous times and past slots; removal is owner scoped", async () => {
  const owner = doctor();
  await assert.rejects(addAvailability(pool, owner, "2030-01-01T10:00", "2030-01-01T10:30"), code("INVALID_INPUT"));
  await assert.rejects(addAvailability(pool, owner, "2030-02-30T10:00:00Z", "2030-03-02T10:30:00Z"), code("INVALID_INPUT"));
  await assert.rejects(addAvailability(pool, owner, "2020-01-01T10:00:00Z", "2020-01-01T10:30:00Z"), code("INVALID_INPUT"));
  await assert.rejects(addAvailability(pool, patient(), time(0), time(30)), code("INVALID_INPUT"));
  await assert.rejects(requestAppointment(pool, patient(), "not-a-uuid"), code("INVALID_INPUT"));
  const slot = await addAvailability(pool, owner, time(0), time(30));
  await assert.rejects(removeAvailability(pool, doctor(), slot), code("NOT_FOUND"));
  await removeAvailability(pool, owner, slot);
  await assert.rejects(requestAppointment(pool, patient(), slot), code("NOT_FOUND"));
});

test("database prevents appointments whose doctor or times differ from the selected slot", async () => {
  const owner = doctor();
  const slot = await addAvailability(pool, owner, time(0), time(30));
  await assert.rejects(pool.query(`INSERT INTO pulse.appointments(id, patient_id, doctor_id, slot_id, starts_at, ends_at)
    SELECT $1, $2, $3, id, starts_at, ends_at FROM pulse.availability WHERE id=$4`,
  [randomUUID(), patient().id, doctor().id, slot]), { code: "23503" });
});
