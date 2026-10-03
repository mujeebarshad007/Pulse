import "server-only";
import { createHash, randomUUID } from "node:crypto";
import {
  mkdir,
  writeFile,
  readFile,
  unlink,
  realpath,
  chmod,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { Actor } from "../features/pulse/model.ts";
import type { Database } from "./database.ts";
import { ServiceError, safely } from "./errors.ts";
import { reportBlobs } from "./blob-storage.ts";

export const MAX_REPORT_BYTES = 10 * 1024 * 1024;
export async function storageRoot(directory = process.env.PRIVATE_STORAGE_DIR) {
  const candidate = directory ?? path.resolve(".local/private-reports");
  if (!path.isAbsolute(candidate))
    throw new ServiceError(
      "DEPENDENCY_UNAVAILABLE",
      "Private storage requires an absolute path.",
    );
  const validateDirectory = (resolved: string) => {
    if (
      resolved === path.parse(resolved).root ||
      resolved === os.homedir() ||
      resolved === process.cwd() ||
      process.cwd().startsWith(resolved + path.sep)
    )
      throw new ServiceError(
        "DEPENDENCY_UNAVAILABLE",
        "Use a dedicated private storage directory.",
      );
    for (const publicRoot of [
      path.resolve("public"),
      path.resolve("web/public"),
      path.resolve(".next"),
      path.resolve("web/.next"),
    ]) {
      if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep))
        throw new ServiceError(
          "DEPENDENCY_UNAVAILABLE",
          "Private storage cannot be inside public application assets.",
        );
    }
  };
  validateDirectory(path.resolve(/* turbopackIgnore: true */ candidate));
  await mkdir(candidate, { recursive: true, mode: 0o700 });
  // Runtime volume, never a build asset. Do not trace its contents into deployments.
  const resolved = await realpath(/* turbopackIgnore: true */ candidate);
  validateDirectory(resolved);
  await chmod(resolved, 0o700);
  return resolved;
}
export async function saveReport(
  pool: Pick<Database, "query">,
  actor: Actor,
  data: { patientId: string; title: string; fileName: string; bytes: Buffer },
  directory?: string,
) {
  if (actor.role !== "lab")
    throw new ServiceError(
      "FORBIDDEN",
      "Only laboratory accounts can upload reports.",
    );
  const { patientId, bytes } = data,
    title = data.title.trim();
  if (
    !patientId ||
    patientId.length > 128 ||
    !title ||
    title.length > 100 ||
    !/\.pdf$/i.test(data.fileName) ||
    data.fileName.length > 160 ||
    bytes.length > MAX_REPORT_BYTES ||
    bytes.length < 12 ||
    !bytes.subarray(0, 5).equals(Buffer.from("%PDF-")) ||
    !bytes.subarray(-1024).includes(Buffer.from("%%EOF"))
  ) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Use a nonempty PDF up to 10 MB, a title and an existing patient reference.",
    );
  }
  // A file signature check is not malware scanning. This release accepts fictional test documents only.
  const patient = await pool.query("SELECT 1 FROM pulse.patients WHERE id=$1", [
    patientId,
  ]);
  if (!patient.rowCount)
    throw new ServiceError("NOT_FOUND", "Patient reference not found.");
  const driver = directory ? "local" : (process.env.REPORT_STORAGE ?? (process.env.NETLIFY ? "netlify" : "local"));
  if (!["local", "netlify"].includes(driver) || (process.env.NETLIFY && driver === "local"))
    throw new ServiceError("DEPENDENCY_UNAVAILABLE", "Durable private report storage is not configured.");
  const id = randomUUID();
  const file = driver === "local" ? path.join(await storageRoot(directory), id + ".pdf") : null;
  if (file) await writeFile(file, bytes, { mode: 0o600, flag: "wx" });
  else await reportBlobs().set(id, new Uint8Array(bytes).buffer);
  try {
    await safely(() =>
      pool.query(
        `INSERT INTO pulse.reports(id,patient_id,lab_id,title,file_name,byte_size,sha256,storage_driver) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          id,
          patientId,
          actor.id,
          title,
          data.fileName.replace(/[^a-zA-Z0-9._-]/g, "-"),
          bytes.length,
          createHash("sha256").update(bytes).digest("hex"),
          driver,
        ],
      ),
    );
  } catch (error) {
    await (file ? unlink(file) : reportBlobs().delete(id)).catch(() =>
      console.error(JSON.stringify({ event: "report_cleanup_failed" })),
    );
    throw error;
  }
  return id;
}
export async function loadReport(
  pool: Database,
  actor: Actor,
  id: string,
  directory?: string,
) {
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id))
    throw new ServiceError("NOT_FOUND", "Report not found.");
  const result = await pool.query<{ file_name: string; sha256: string; storage_driver: string }>(
    `SELECT file_name,sha256,storage_driver FROM pulse.reports
    WHERE id=$1 AND (($3='patient' AND patient_id=$2) OR ($3='lab' AND lab_id=$2))`,
    [id, actor.id, actor.role],
  );
  if (!result.rows[0]) throw new ServiceError("NOT_FOUND", "Report not found.");
  let bytes: Buffer;
  try {
    if (result.rows[0].storage_driver === "netlify") {
      const stored = await reportBlobs().get(id, { type: "arrayBuffer" });
      if (!stored) throw new Error("Missing private object");
      bytes = Buffer.from(stored);
    } else bytes = await readFile(
      /* turbopackIgnore: true */ path.join(
        await storageRoot(directory),
        id + ".pdf",
      ),
    );
  } catch {
    throw new ServiceError(
      "DEPENDENCY_UNAVAILABLE",
      "This report is temporarily unavailable.",
    );
  }
  if (
    createHash("sha256").update(bytes).digest("hex") !== result.rows[0].sha256
  )
    throw new ServiceError(
      "DEPENDENCY_UNAVAILABLE",
      "Report integrity could not be verified.",
    );
  return { bytes, fileName: result.rows[0].file_name };
}
