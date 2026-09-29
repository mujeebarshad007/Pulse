import "server-only";
import { randomUUID } from "node:crypto";
import type {
  Actor,
  DemoState,
  Doctor,
  Article,
  Patient,
  Report,
  Slot,
  Appointment,
} from "../features/pulse/model.ts";
import { type Database, transaction } from "./database.ts";
import { commandInput } from "./input.ts";
import { ServiceError, safely } from "./errors.ts";
import {
  addAvailability,
  removeAvailability,
  requestAppointment,
  changeAppointment,
} from "./appointments.ts";

function role(actor: Actor, expected: Actor["role"]) {
  if (actor.role !== expected)
    throw new ServiceError(
      "FORBIDDEN",
      "This account cannot perform this action.",
    );
}
export async function snapshot(
  pool: Database,
  actor: Actor | null,
): Promise<DemoState> {
  return safely(() =>
    transaction(pool, async (client) => {
      // One coherent snapshot; never serialize another patient's private records.
      await client.query(
        "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY",
      );
      const doctors = (
        await client.query<{ profile: Doctor }>(
          "SELECT profile FROM pulse.doctors ORDER BY profile->>'name' LIMIT 500",
        )
      ).rows.map((r) => r.profile);
      const articles = (
        await client.query<{ document: Article }>(
          "SELECT document FROM pulse.articles WHERE $1 OR document->>'published'='true' ORDER BY document->>'title' LIMIT 500",
          [actor?.role === "editor"],
        )
      ).rows.map((r) => r.document);
      const slots = (
        await client.query<Slot>(
          `SELECT s.id, s.doctor_id AS "doctorId", to_char(s.starts_at AT TIME ZONE 'Asia/Karachi','YYYY-MM-DD') AS date,
      to_char(s.starts_at AT TIME ZONE 'Asia/Karachi','HH24:MI') AS time
      FROM pulse.availability s WHERE s.doctor_id=$1
      OR EXISTS(SELECT 1 FROM pulse.appointments a WHERE a.slot_id=s.id AND a.patient_id=$1)
      OR (s.starts_at > now() AND NOT EXISTS(SELECT 1 FROM pulse.appointments a WHERE a.slot_id=s.id AND a.status <> 'Declined'))
      ORDER BY s.starts_at LIMIT 5000`,
          [actor?.id ?? ""],
        )
      ).rows;
      let patients: Patient[] = [],
        appointments: Appointment[] = [],
        reports: Report[] = [];
      if (actor) {
        patients = (
          await client.query<Patient>(
            `SELECT p.id,p.name,
        CASE WHEN p.id=$1 THEN p.email ELSE '' END AS email,
        CASE WHEN p.id=$1 THEN p.phone ELSE '' END AS phone,
        CASE WHEN p.id=$1 THEN p.city ELSE '' END AS city
        FROM pulse.patients p WHERE p.id=$1
        OR ($2='doctor' AND EXISTS(SELECT 1 FROM pulse.appointments a WHERE a.patient_id=p.id AND a.doctor_id=$1))
        OR ($2='lab' AND EXISTS(SELECT 1 FROM pulse.reports r WHERE r.patient_id=p.id AND r.lab_id=$1)) LIMIT 1000`,
            [actor.id, actor.role],
          )
        ).rows;
        appointments = (
          await client.query<Appointment>(
            `SELECT id,patient_id AS "patientId",doctor_id AS "doctorId",slot_id AS "slotId",status
        FROM pulse.appointments WHERE ($2='patient' AND patient_id=$1) OR ($2='doctor' AND doctor_id=$1)
        ORDER BY starts_at DESC LIMIT 1000`,
            [actor.id, actor.role],
          )
        ).rows;
        reports = (
          await client.query<Report>(
            `SELECT r.id,r.patient_id AS "patientId",r.title,m.display_name AS laboratory,
        to_char(r.created_at AT TIME ZONE 'Asia/Karachi','YYYY-MM-DD') AS date,r.file_name AS "fileName",'' AS content
        FROM pulse.reports r JOIN pulse.members m ON m.id=r.lab_id
        WHERE ($2='patient' AND r.patient_id=$1) OR ($2='lab' AND r.lab_id=$1)
        ORDER BY r.created_at DESC LIMIT 1000`,
            [actor.id, actor.role],
          )
        ).rows;
      }
      return {
        doctors,
        articles,
        slots,
        patients,
        appointments,
        reports,
        nextId: 0,
      };
    }),
  );
}
export async function executeCommand(
  pool: Database,
  actor: Actor,
  input: unknown,
) {
  const parsed = commandInput.safeParse(input);
  if (!parsed.success)
    throw new ServiceError(
      "INVALID_INPUT",
      "Check the form fields and their limits.",
    );
  const command = parsed.data;
  return safely(async () => {
    switch (command.type) {
      case "profile": {
        role(actor, "patient");
        if (command.patient.id !== actor.id)
          throw new ServiceError(
            "FORBIDDEN",
            "You can only edit your own profile.",
          );
        const p = command.patient;
        await transaction(pool, async (client) => {
          await client.query(
            "UPDATE pulse.patients SET name=$2,phone=$3,city=$4 WHERE id=$1",
            [actor.id, p.name, p.phone, p.city],
          );
          await client.query(
            "UPDATE pulse.members SET display_name=$2 WHERE id=$1",
            [actor.id, p.name],
          );
        });
        break; // Google owns the sign-in email; the client cannot change it here.
      }
      case "doctor": {
        role(actor, "doctor");
        if (command.doctor.id !== actor.id)
          throw new ServiceError(
            "FORBIDDEN",
            "You can only edit your own profile.",
          );
        await pool.query(
          `INSERT INTO pulse.doctors(id,owner_id,profile) VALUES($1,$3,$2)
          ON CONFLICT(id) DO UPDATE SET profile=excluded.profile WHERE pulse.doctors.owner_id=$3`,
          [actor.id, command.doctor, actor.accountId ?? actor.id],
        );
        break;
      }
      case "slot-add": {
        role(actor, "doctor");
        const start = new Date(`${command.date}T${command.time}:00+05:00`);
        await addAvailability(
          pool,
          actor,
          start.toISOString(),
          new Date(start.getTime() + 30 * 60000).toISOString(),
        );
        break;
      }
      case "slot-remove":
        await removeAvailability(pool, actor, command.id);
        break;
      case "book": {
        role(actor, "patient");
        const p = await pool.query(
          "SELECT 1 FROM pulse.patients WHERE id=$1 AND city<>''",
          [actor.id],
        );
        if (!p.rowCount)
          throw new ServiceError(
            "INVALID_INPUT",
            "Complete your profile and city before requesting a visit.",
          );
        const s = await pool.query(
          "SELECT 1 FROM pulse.availability WHERE id=$1 AND doctor_id=$2",
          [command.slotId, command.doctorId],
        );
        if (!s.rowCount)
          throw new ServiceError(
            "NOT_FOUND",
            "That doctor and appointment time do not match.",
          );
        await requestAppointment(pool, actor, command.slotId);
        break;
      }
      case "appointment":
        await changeAppointment(pool, actor, command.id, command.status);
        break;
      case "article": {
        role(actor, "editor");
        const article = {
          ...command.article,
          id: command.article.id === "new" ? randomUUID() : command.article.id,
          edited: true,
        };
        await pool.query(
          `INSERT INTO pulse.articles(id,document,updated_by) VALUES($1,$2,$3)
          ON CONFLICT(id) DO UPDATE SET document=excluded.document,updated_by=excluded.updated_by,updated_at=now()`,
          [article.id, article, actor.id],
        );
        break;
      }
    }
    return "Saved. Your workspace is up to date.";
  });
}
