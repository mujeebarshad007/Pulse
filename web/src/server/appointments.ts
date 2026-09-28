import "server-only";
import { randomUUID } from "node:crypto";
import { transaction, type Database } from "./database.ts";
import { ServiceError, safely } from "./errors.ts";

/** Internal service identities MUST come from server authentication, never request bodies. */
export type BookingPrincipal = { id: string; role: "patient" | "doctor" | "lab" | "editor" };
type Status = "Requested" | "Confirmed" | "Declined" | "Completed";
export type SavedAppointment = {
  id: string; patient_id: string; doctor_id: string; slot_id: string;
  starts_at: Date; ends_at: Date; status: Status;
};
function requireRole(actor: BookingPrincipal, role: BookingPrincipal["role"]) {
  if (actor.role !== role || typeof actor.id !== "string" || !actor.id.trim() || actor.id.length > 128) {
    throw new ServiceError("INVALID_INPUT", "This operation is not available to this account.");
  }
}
function requireUUID(id: string) {
  if (typeof id !== "string" || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
    throw new ServiceError("INVALID_INPUT", "Select a valid record.");
  }
}
function instant(value: string) {
  // Require an explicit offset, preventing server-local timezone interpretation.
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value)) {
    throw new ServiceError("INVALID_INPUT", "Provide a date and time with its timezone offset.");
  }
  const date = new Date(value);
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || calendar.getUTCFullYear() !== year || calendar.getUTCMonth() + 1 !== month || calendar.getUTCDate() !== day || Number(value.slice(11, 13)) > 23) {
    throw new ServiceError("INVALID_INPUT", "Provide a valid date and time.");
  }
  return date;
}

export async function addAvailability(pool: Database, actor: BookingPrincipal, start: string, end: string) {
  requireRole(actor, "doctor");
  const starts = instant(start), ends = instant(end);
  if (ends <= starts) throw new ServiceError("INVALID_INPUT", "The end must follow the start.");
  return safely(async () => {
    const result = await pool.query<{ id: string }>(
      `INSERT INTO pulse.availability(id, doctor_id, starts_at, ends_at)
       SELECT $1, $2, $3::timestamptz, $4::timestamptz WHERE $3::timestamptz > now() RETURNING id`,
      [randomUUID(), actor.id, starts, ends],
    );
    if (!result.rows[0]) throw new ServiceError("INVALID_INPUT", "Choose a future appointment time.");
    return result.rows[0].id;
  });
}

export async function removeAvailability(pool: Database, actor: BookingPrincipal, slotId: string) {
  requireRole(actor, "doctor"); requireUUID(slotId);
  return safely(() => transaction(pool, async (client) => {
    const slot = await client.query("SELECT id FROM pulse.availability WHERE id=$1 AND doctor_id=$2 FOR UPDATE", [slotId, actor.id]);
    if (!slot.rowCount) throw new ServiceError("NOT_FOUND", "Availability not found.");
    const referenced = await client.query("SELECT 1 FROM pulse.appointments WHERE slot_id=$1 LIMIT 1", [slotId]);
    if (referenced.rowCount) throw new ServiceError("CONFLICT", "Availability with appointment history cannot be removed.");
    await client.query("DELETE FROM pulse.availability WHERE id=$1", [slotId]);
  }));
}

export async function requestAppointment(pool: Database, actor: BookingPrincipal, slotId: string): Promise<SavedAppointment> {
  requireRole(actor, "patient"); requireUUID(slotId);
  return safely(() => transaction(pool, async (client) => {
    // Lock the slot so a concurrent deletion cannot race the request.
    const slot = await client.query("SELECT id FROM pulse.availability WHERE id=$1 AND starts_at > now() FOR UPDATE", [slotId]);
    if (!slot.rowCount) throw new ServiceError("NOT_FOUND", "This appointment time is no longer available.");
    // The database constraints arbitrate concurrent requests across ALL server instances.
    const result = await client.query<SavedAppointment>(
      `INSERT INTO pulse.appointments(id, patient_id, doctor_id, slot_id, starts_at, ends_at)
       SELECT $1, $2, doctor_id, id, starts_at, ends_at FROM pulse.availability WHERE id=$3 RETURNING *`,
      [randomUUID(), actor.id, slotId],
    );
    return result.rows[0];
  }));
}

export async function changeAppointment(pool: Database, actor: BookingPrincipal, id: string, next: Exclude<Status, "Requested">) {
  requireRole(actor, "doctor"); requireUUID(id);
  if (!["Confirmed", "Declined", "Completed"].includes(next)) throw new ServiceError("INVALID_INPUT", "Choose a supported appointment status.");
  return safely(() => transaction(pool, async (client) => {
    const result = await client.query<SavedAppointment>("SELECT * FROM pulse.appointments WHERE id=$1 AND doctor_id=$2 FOR UPDATE", [id, actor.id]);
    const record = result.rows[0];
    if (!record) throw new ServiceError("NOT_FOUND", "Appointment not found.");
    if (record.status === next) return record; // Retried actions have the same outcome.
    const allowed = record.status === "Requested" ? next === "Confirmed" || next === "Declined" : record.status === "Confirmed" && next === "Completed";
    if (!allowed) throw new ServiceError("CONFLICT", "The appointment status has changed. Refresh the list.");
    const updated = await client.query<SavedAppointment>("UPDATE pulse.appointments SET status=$2 WHERE id=$1 RETURNING *", [id, next]);
    return updated.rows[0];
  }));
}

export async function listAppointments(pool: Database, actor: BookingPrincipal, limit = 50, offset = 0) {
  if (actor.role !== "patient" && actor.role !== "doctor") throw new ServiceError("INVALID_INPUT", "This account cannot view appointments.");
  requireRole(actor, actor.role);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) throw new ServiceError("INVALID_INPUT", "Invalid page.");
  return safely(async () => {
    const column = actor.role === "patient" ? "patient_id" : "doctor_id";
    return (await pool.query<SavedAppointment>(`SELECT * FROM pulse.appointments WHERE ${column}=$1 ORDER BY starts_at DESC, id LIMIT $2 OFFSET $3`, [actor.id, limit, offset])).rows;
  });
}
