import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { transaction, type Database } from "./database.ts";
import { ServiceError } from "./errors.ts";
import { takeLimit } from "./rate-limit.ts";
import type { Actor } from "../features/pulse/model.ts";

const text = (max: number) => z.string().trim().min(1).max(max);
const commandSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("offering"),
      id: z.uuid().optional(),
      name: text(100),
      category: text(60),
      labName: text(100),
      city: text(80),
      address: text(200),
      preparation: text(1500),
      fee: z.number().int().min(0).max(1000000),
      published: z.boolean(),
      active: z.boolean(),
    })
    .strict(),
  z
    .object({
      type: z.literal("slot"),
      testId: z.uuid(),
      start: z.iso.datetime({ offset: true }),
      end: z.iso.datetime({ offset: true }),
    })
    .strict(),
  z
    .object({
      type: z.literal("request"),
      slotId: z.uuid(),
      requestKey: z.uuid(),
    })
    .strict(),
  z
    .object({
      type: z.literal("transition"),
      id: z.uuid(),
      status: z.enum(["Confirmed", "Declined", "Cancelled", "Completed"]),
      reason: z.string().trim().max(300).default(""),
    })
    .strict(),
  z
    .object({ type: z.literal("linkReport"), id: z.uuid(), reportId: z.uuid() })
    .strict(),
]);
function allowed(actor: Actor, role: "patient" | "lab") {
  if (actor.role !== role)
    throw new ServiceError(
      "FORBIDDEN",
      `This action requires a ${role} account.`,
    );
}
export async function labCommand(pool: Database, actor: Actor, raw: unknown) {
  const parsed = commandSchema.safeParse(raw);
  if (!parsed.success)
    throw new ServiceError(
      "INVALID_INPUT",
      "Check the lab form fields, amount and dates.",
    );
  const cmd = parsed.data;
  return transaction(pool, async (client) => {
    await takeLimit(
      client,
      `lab-command:${actor.accountId ?? actor.id}`,
      60,
      60,
    );
    await client.query(
      "UPDATE pulse.lab_bookings SET status='Expired' WHERE status='Requested' AND starts_at<=now()",
    );
    if (cmd.type === "offering") {
      allowed(actor, "lab");
      const id = cmd.id ?? randomUUID();
      const result = await client.query(
        `INSERT INTO pulse.lab_tests(id,lab_id,name,category,lab_name,city,address,preparation,fee,published,active)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,category=EXCLUDED.category,lab_name=EXCLUDED.lab_name,city=EXCLUDED.city,address=EXCLUDED.address,preparation=EXCLUDED.preparation,fee=EXCLUDED.fee,published=EXCLUDED.published,active=EXCLUDED.active WHERE lab_tests.lab_id=$2 RETURNING id`,
        [
          id,
          actor.id,
          cmd.name,
          cmd.category,
          cmd.labName,
          cmd.city,
          cmd.address,
          cmd.preparation,
          cmd.fee,
          cmd.published,
          cmd.active,
        ],
      );
      if (!result.rowCount)
        throw new ServiceError(
          "FORBIDDEN",
          "This test belongs to another laboratory.",
        );
      return { id, message: "Test offering saved." };
    }
    if (cmd.type === "slot") {
      allowed(actor, "lab");
      const start = new Date(cmd.start),
        end = new Date(cmd.end);
      if (
        start <= new Date() ||
        end <= start ||
        end.getTime() - start.getTime() > 14400000
      )
        throw new ServiceError(
          "INVALID_INPUT",
          "Choose a future slot of up to four hours.",
        );
      const id = randomUUID();
      const result = await client.query(
        "INSERT INTO pulse.lab_slots(id,test_id,lab_id,starts_at,ends_at) SELECT $1,id,lab_id,$4,$5 FROM pulse.lab_tests WHERE id=$2 AND lab_id=$3 RETURNING id",
        [id, cmd.testId, actor.id, start, end],
      );
      if (!result.rowCount)
        throw new ServiceError(
          "NOT_FOUND",
          "Your test offering was not found.",
        );
      return { id, message: "Availability added." };
    }
    if (cmd.type === "request") {
      allowed(actor, "patient");
      await client.query(
        "SELECT pg_advisory_xact_lock(hashtextextended($1,734825009))",
        [actor.id],
      );
      const previous = await client.query(
        "SELECT id,slot_id FROM pulse.lab_bookings WHERE patient_id=$1 AND request_key=$2",
        [actor.id, cmd.requestKey],
      );
      if (previous.rowCount) {
        if (previous.rows[0].slot_id !== cmd.slotId)
          throw new ServiceError(
            "CONFLICT",
            "This request already belongs to a different slot.",
          );
        return {
          id: previous.rows[0].id as string,
          message: "Your existing request is saved.",
        };
      }
      const profile = await client.query(
        "SELECT 1 FROM pulse.patients WHERE id=$1 AND length(trim(name))>=2 AND length(trim(city))>0",
        [actor.id],
      );
      if (!profile.rowCount)
        throw new ServiceError(
          "INVALID_INPUT",
          "Complete your patient profile before requesting a lab visit.",
        );
      const slot = await client.query(
        "SELECT s.*,t.fee FROM pulse.lab_slots s JOIN pulse.lab_tests t ON t.id=s.test_id JOIN pulse.members m ON m.id=t.lab_id WHERE s.id=$1 AND s.starts_at>now() AND t.published AND t.active AND m.enabled AND m.role='lab' FOR UPDATE OF s,t,m",
        [cmd.slotId],
      );
      if (!slot.rowCount)
        throw new ServiceError(
          "CONFLICT",
          "This test or time is no longer available. Refresh and choose another slot.",
        );
      const s = slot.rows[0],
        id = randomUUID();
      await client.query(
        "INSERT INTO pulse.lab_bookings(id,patient_id,slot_id,test_id,lab_id,starts_at,ends_at,price,request_key,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'Requested')",
        [
          id,
          actor.id,
          s.id,
          s.test_id,
          s.lab_id,
          s.starts_at,
          s.ends_at,
          s.fee,
          cmd.requestKey,
        ],
      );
      return {
        id,
        message:
          "Request saved. Waiting for the laboratory to confirm; no payment was taken.",
      };
    }
    const result = await client.query(
      "SELECT * FROM pulse.lab_bookings WHERE id=$1 AND ((patient_id=$2 AND $3='patient') OR (lab_id=$2 AND $3='lab')) FOR UPDATE",
      [cmd.id, actor.id, actor.role],
    );
    if (!result.rowCount)
      throw new ServiceError("NOT_FOUND", "Lab booking not found.");
    const booking = result.rows[0];
    if (cmd.type === "linkReport") {
      allowed(actor, "lab");
      if (!["Confirmed", "Completed"].includes(booking.status))
        throw new ServiceError(
          "CONFLICT",
          "Reports can be linked to confirmed or completed visits only.",
        );
      const report = await client.query(
        "SELECT 1 FROM pulse.reports WHERE id=$1 AND lab_id=$2 AND patient_id=$3",
        [cmd.reportId, actor.id, booking.patient_id],
      );
      if (!report.rowCount)
        throw new ServiceError(
          "NOT_FOUND",
          "A matching private report was not found.",
        );
      await client.query(
        "INSERT INTO pulse.lab_booking_reports(booking_id,report_id) VALUES($1,$2) ON CONFLICT(booking_id,report_id) DO NOTHING",
        [cmd.id, cmd.reportId],
      );
      return { id: cmd.id, message: "Private report linked." };
    }
    if (booking.status === cmd.status)
      return { id: cmd.id, message: "This status is already saved." };
    const before = new Date(booking.starts_at) > new Date();
    const permitted =
      cmd.status === "Cancelled"
        ? before && ["Requested", "Confirmed"].includes(booking.status)
        : actor.role === "lab" &&
          (cmd.status === "Completed"
            ? !before && booking.status === "Confirmed"
            : before && booking.status === "Requested");
    if (!permitted)
      throw new ServiceError(
        "CONFLICT",
        "This status change is no longer allowed. Refresh the booking.",
      );
    if (cmd.status === "Cancelled" && actor.role === "lab" && !cmd.reason)
      throw new ServiceError(
        "INVALID_INPUT",
        "Enter the laboratory cancellation reason.",
      );
    await client.query(
      "UPDATE pulse.lab_bookings SET status=$2,reason=$3 WHERE id=$1",
      [cmd.id, cmd.status, cmd.reason],
    );
    return { id: cmd.id, message: `Lab visit ${cmd.status.toLowerCase()}.` };
  });
}

export async function labSnapshot(pool: Database, actor: Actor | null) {
  if (actor && ["lab", "patient"].includes(actor.role))
    await pool.query(
      "UPDATE pulse.lab_bookings SET status='Expired' WHERE status='Requested' AND starts_at<=now() AND (lab_id=$1 OR patient_id=$1)",
      [actor.id],
    );
  const offerings = await pool.query(
    `SELECT id,name,category,lab_name AS "labName",city,address,preparation,fee,published,active,($1::text=lab_id AND $2='lab') AS owned
 FROM pulse.lab_tests WHERE (published AND EXISTS(SELECT 1 FROM pulse.members m WHERE m.id=lab_tests.lab_id AND m.enabled AND m.role='lab')) OR (lab_id=$1 AND $2='lab') ORDER BY name LIMIT 500`,
    [actor?.id ?? null, actor?.role ?? null],
  );
  const slots =
    await pool.query(`SELECT s.id,s.test_id AS "testId",s.starts_at AS start,s.ends_at AS end FROM pulse.lab_slots s JOIN pulse.lab_tests t ON t.id=s.test_id
 WHERE t.published AND t.active AND EXISTS(SELECT 1 FROM pulse.members m WHERE m.id=t.lab_id AND m.enabled AND m.role='lab') AND s.starts_at>now() AND NOT EXISTS(SELECT 1 FROM pulse.lab_bookings b WHERE b.slot_id=s.id AND b.status IN ('Requested','Confirmed')) ORDER BY s.starts_at LIMIT 2000`);
  const bookings =
    actor && ["lab", "patient"].includes(actor.role)
      ? await pool.query(
          `SELECT b.id,b.test_id AS "testId",b.patient_id AS "patientId",p.name AS "patientName",t.name,t.lab_name AS "labName",t.address,b.starts_at AS start,b.ends_at AS end,b.price,b.status,b.reason,
 COALESCE((SELECT json_agg(json_build_object('id',r.id,'title',r.title)) FROM pulse.lab_booking_reports l JOIN pulse.reports r ON r.id=l.report_id WHERE l.booking_id=b.id),'[]') AS reports
 FROM pulse.lab_bookings b JOIN pulse.lab_tests t ON t.id=b.test_id JOIN pulse.patients p ON p.id=b.patient_id WHERE (b.patient_id=$1 AND $2='patient') OR (b.lab_id=$1 AND $2='lab') ORDER BY b.starts_at DESC LIMIT 1000`,
          [actor.id, actor.role],
        )
      : { rows: [] };
  return {
    offerings: offerings.rows,
    slots: slots.rows,
    bookings: bookings.rows,
  };
}
