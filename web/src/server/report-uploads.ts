import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Actor } from "../features/pulse/model.ts";
import { transaction, type Database } from "./database.ts";
import { ServiceError } from "./errors.ts";
import { saveReport, MAX_REPORT_BYTES } from "./reports.ts";
import { takeLimit } from "./rate-limit.ts";

export const REPORT_PART_BYTES = 2 * 1024 * 1024;
const uploadInput = z
  .object({
    patientId: z.string().min(1).max(128),
    title: z.string().trim().min(1).max(100),
    fileName: z
      .string()
      .max(160)
      .regex(/\.pdf$/i),
    byteSize: z.number().int().min(12).max(MAX_REPORT_BYTES),
  })
  .strict();
function labOnly(actor: Actor) {
  if (actor.role !== "lab")
    throw new ServiceError(
      "FORBIDDEN",
      "Only laboratory accounts can upload reports.",
    );
}
function uploadId(id: string) {
  if (!z.uuid().safeParse(id).success)
    throw new ServiceError("NOT_FOUND", "Upload not found.");
}
export async function beginUpload(
  pool: Database,
  actor: Actor,
  input: unknown,
) {
  labOnly(actor);
  const parsed = uploadInput.safeParse(input);
  if (!parsed.success)
    throw new ServiceError(
      "INVALID_INPUT",
      "Use a PDF up to 10 MB, a title and a patient reference.",
    );
  return transaction(pool, async (client) => {
    await takeLimit(client, `upload:${actor.id}`, 20, 3600);
    // Only disposable staging data expires here; published reports are never removed.
    await client.query(
      "DELETE FROM pulse.report_uploads WHERE expires_at < now()",
    );
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1,734825002))",
      [actor.id],
    );
    const active = await client.query(
      "SELECT 1 FROM pulse.report_uploads WHERE lab_id=$1 AND report_id IS NULL",
      [actor.id],
    );
    if (active.rowCount! >= 3)
      throw new ServiceError(
        "CONFLICT",
        "Finish an existing upload or wait 15 minutes before starting another.",
      );
    const id = randomUUID(),
      data = parsed.data;
    const patient = await client.query(
      "SELECT 1 FROM pulse.patients WHERE id=$1",
      [data.patientId],
    );
    if (!patient.rowCount)
      throw new ServiceError("NOT_FOUND", "Patient reference not found.");
    await client.query(
      "INSERT INTO pulse.report_uploads(id,lab_id,patient_id,title,file_name,byte_size) VALUES($1,$2,$3,$4,$5,$6)",
      [id, actor.id, data.patientId, data.title, data.fileName, data.byteSize],
    );
    return { id, partBytes: REPORT_PART_BYTES };
  });
}
export async function putUploadPart(
  pool: Database,
  actor: Actor,
  id: string,
  part: number,
  bytes: Buffer,
) {
  labOnly(actor);
  uploadId(id);
  if (
    !Number.isInteger(part) ||
    part < 0 ||
    part > 4 ||
    !bytes.length ||
    bytes.length > REPORT_PART_BYTES
  )
    throw new ServiceError("INVALID_INPUT", "Invalid upload part.");
  await transaction(pool, async (client) => {
    const result = await client.query<{
      byte_size: number;
      report_id: string | null;
    }>(
      "SELECT byte_size,report_id FROM pulse.report_uploads WHERE id=$1 AND lab_id=$2 AND expires_at>now() FOR UPDATE",
      [id, actor.id],
    );
    const upload = result.rows[0];
    if (!upload)
      throw new ServiceError(
        "NOT_FOUND",
        "Upload expired or not found. Start again.",
      );
    if (upload.report_id) return;
    if (
      bytes.length !==
      Math.min(REPORT_PART_BYTES, upload.byte_size - part * REPORT_PART_BYTES)
    )
      throw new ServiceError(
        "INVALID_INPUT",
        "The upload part has an incorrect size.",
      );
    const existing = await client.query<{ bytes: Buffer }>(
      "SELECT bytes FROM pulse.report_upload_parts WHERE upload_id=$1 AND part=$2",
      [id, part],
    );
    if (existing.rows[0]) {
      if (!existing.rows[0].bytes.equals(bytes))
        throw new ServiceError(
          "CONFLICT",
          "This upload part already contains different data.",
        );
      return;
    }
    await client.query(
      "INSERT INTO pulse.report_upload_parts(upload_id,part,bytes) VALUES($1,$2,$3)",
      [id, part, bytes],
    );
  });
}
export async function finishUpload(
  pool: Database,
  actor: Actor,
  id: string,
  directory?: string,
) {
  labOnly(actor);
  uploadId(id);
  return transaction(pool, async (client) => {
    const result = await client.query<{
      patient_id: string;
      title: string;
      file_name: string;
      byte_size: number;
      report_id: string | null;
    }>(
      "SELECT * FROM pulse.report_uploads WHERE id=$1 AND lab_id=$2 AND expires_at>now() FOR UPDATE",
      [id, actor.id],
    );
    const upload = result.rows[0];
    if (!upload)
      throw new ServiceError(
        "NOT_FOUND",
        "Upload expired or not found. Start again.",
      );
    if (upload.report_id) return upload.report_id;
    const parts = await client.query<{ bytes: Buffer }>(
      "SELECT bytes FROM pulse.report_upload_parts WHERE upload_id=$1 ORDER BY part",
      [id],
    );
    const bytes = Buffer.concat(parts.rows.map((row) => row.bytes));
    if (bytes.length !== upload.byte_size)
      throw new ServiceError(
        "INVALID_INPUT",
        "Some upload parts are missing. Retry the upload.",
      );
    const reportId = await saveReport(
      client,
      actor,
      {
        patientId: upload.patient_id,
        title: upload.title,
        fileName: upload.file_name,
        bytes,
      },
      directory,
    );
    await client.query(
      "UPDATE pulse.report_uploads SET report_id=$2 WHERE id=$1",
      [id, reportId],
    );
    await client.query(
      "DELETE FROM pulse.report_upload_parts WHERE upload_id=$1",
      [id],
    );
    return reportId;
  });
}
