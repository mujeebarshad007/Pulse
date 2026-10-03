import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  createDatabase,
  databaseConfig,
  transaction,
} from "../../src/server/database.ts";
import { migrate } from "../../src/server/migrations.ts";
import { fixtureActor } from "./fixtures.ts";
import {
  beginUpload,
  putUploadPart,
  finishUpload,
  REPORT_PART_BYTES,
} from "../../src/server/report-uploads.ts";
import { loadReport } from "../../src/server/reports.ts";
import { askAssistant } from "../../src/server/assistant.ts";
import { takeLimit } from "../../src/server/rate-limit.ts";
import { seedFictional } from "../../src/server/seed.ts";
import { BlobsServer } from "@netlify/blobs/server";
import { setEnvironmentContext } from "@netlify/blobs";
import { saveReport } from "../../src/server/reports.ts";

const pool = createDatabase(databaseConfig());
let directory: string;
before(async () => {
  await migrate(pool, path.resolve("database/migrations"));
  directory = await mkdtemp(path.join(os.tmpdir(), "pulse-netlify-test-"));
});
after(async () => {
  await pool.end();
  await rm(directory, { recursive: true });
});
test("chunked uploads preserve a 10 MB PDF, isolate labs, reject missing/tampered parts and finalize once", async () => {
  const patient = await fixtureActor(pool, "patient"),
    lab = await fixtureActor(pool, "lab"),
    otherLab = await fixtureActor(pool, "lab");
  const bytes = Buffer.alloc(10 * 1024 * 1024, 32);
  bytes.write("%PDF-1.4\n");
  bytes.write("\n%%EOF", bytes.length - 6);
  const input = {
    patientId: patient.id,
    title: "Fictional transport test",
    fileName: "synthetic.pdf",
    byteSize: bytes.length,
  };
  await assert.rejects(beginUpload(pool, patient, input), {
    code: "FORBIDDEN",
  });
  const session = await beginUpload(pool, lab, input);
  await assert.rejects(finishUpload(pool, lab, session.id, directory), {
    code: "INVALID_INPUT",
  });
  await assert.rejects(
    putUploadPart(
      pool,
      otherLab,
      session.id,
      0,
      bytes.subarray(0, REPORT_PART_BYTES),
    ),
    { code: "NOT_FOUND" },
  );
  for (let part = 0; part < 5; part++)
    await putUploadPart(
      pool,
      lab,
      session.id,
      part,
      bytes.subarray(part * REPORT_PART_BYTES, (part + 1) * REPORT_PART_BYTES),
    );
  await putUploadPart(
    pool,
    lab,
    session.id,
    0,
    bytes.subarray(0, REPORT_PART_BYTES),
  );
  await assert.rejects(
    putUploadPart(pool, lab, session.id, 0, Buffer.alloc(REPORT_PART_BYTES)),
    { code: "CONFLICT" },
  );
  const results = await Promise.all([
    finishUpload(pool, lab, session.id, directory),
    finishUpload(pool, lab, session.id, directory),
  ]);
  assert.equal(results[0], results[1]);
  assert.deepEqual(
    (await loadReport(pool, patient, results[0], directory)).bytes,
    bytes,
  );
  assert.equal(
    (
      await pool.query(
        "SELECT 1 FROM pulse.report_upload_parts WHERE upload_id=$1",
        [session.id],
      )
    ).rowCount,
    0,
  );
  await assert.rejects(loadReport(pool, otherLab, results[0], directory), {
    code: "NOT_FOUND",
  });
});
test("expired and invalid upload sessions do not publish files", async () => {
  const patient = await fixtureActor(pool, "patient"),
    lab = await fixtureActor(pool, "lab");
  const files = (await readdir(directory)).length;
  const session = await beginUpload(pool, lab, {
    patientId: patient.id,
    title: "Invalid",
    fileName: "sample.pdf",
    byteSize: 12,
  });
  await putUploadPart(pool, lab, session.id, 0, Buffer.alloc(12));
  await assert.rejects(finishUpload(pool, lab, session.id, directory), {
    code: "INVALID_INPUT",
  });
  assert.equal((await readdir(directory)).length, files);
  await pool.query(
    "UPDATE pulse.report_uploads SET expires_at=now()-interval '1 minute' WHERE id=$1",
    [session.id],
  );
  await assert.rejects(
    putUploadPart(pool, lab, session.id, 0, Buffer.alloc(12)),
    { code: "NOT_FOUND" },
  );
});
test("Netlify private blob adapter persists bytes across reads and enforces report ownership", async () => {
  const server = new BlobsServer({
    directory: path.join(directory, "blobs"),
    token: "isolated-test-token",
  });
  const prior = process.env.REPORT_STORAGE;
  try {
    const { port } = await server.start();
    setEnvironmentContext({
      siteID: "isolated-test-site",
      token: "isolated-test-token",
      apiURL: `http://localhost:${port}`,
      edgeURL: `http://localhost:${port}`,
      uncachedEdgeURL: `http://localhost:${port}`,
    });
    process.env.REPORT_STORAGE = "netlify";
    const lab = await fixtureActor(pool, "lab"),
      patient = await fixtureActor(pool, "patient"),
      other = await fixtureActor(pool, "patient");
    const bytes = Buffer.from("%PDF-1.4\nFictional blob fixture\n%%EOF");
    const id = await saveReport(pool, lab, {
      patientId: patient.id,
      title: "Private blob",
      fileName: "fixture.pdf",
      bytes,
    });
    assert.equal(
      (
        await pool.query(
          "SELECT storage_driver FROM pulse.reports WHERE id=$1",
          [id],
        )
      ).rows[0].storage_driver,
      "netlify",
    );
    assert.deepEqual((await loadReport(pool, patient, id)).bytes, bytes);
    assert.deepEqual((await loadReport(pool, lab, id)).bytes, bytes);
    await assert.rejects(loadReport(pool, other, id), { code: "NOT_FOUND" });
  } finally {
    if (prior === undefined) delete process.env.REPORT_STORAGE;
    else process.env.REPORT_STORAGE = prior;
    setEnvironmentContext({});
    await server.stop();
  }
});
test("shared request limits enforce concurrent capacity and reset expired windows", async () => {
  const key = `test:${randomUUID()}`;
  const attempts = await Promise.allSettled(
    Array.from({ length: 6 }, () =>
      transaction(pool, (client) => takeLimit(client, key, 3, 60)),
    ),
  );
  assert.equal(attempts.filter((a) => a.status === "fulfilled").length, 3);
  await pool.query("UPDATE pulse.request_limits SET bucket=0 WHERE key=$1", [
    key,
  ]);
  await transaction(pool, (client) => takeLimit(client, key, 3, 60));
});
const env = {
  OPENAI_API_KEY: "test-placeholder-never-a-real-key",
  OPENAI_MODEL: "test-model",
  AI_DAILY_REQUEST_LIMIT: "10000",
};
function responseFor(value: unknown) {
  return Response.json({
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(value) }],
      },
    ],
  });
}
test("AI uses only public directory fields and filters invented profiles and arbitrary advice", async () => {
  await seedFictional(pool);
  const actor = await fixtureActor(pool, "patient");
  let sent = "";
  const request: typeof fetch = async (_url, init) => {
    sent = String(init?.body);
    return responseFor({
      intent: "directory",
      doctorIds: ["doctor-maya", "invented-doctor"],
    });
  };
  const reply = await askAssistant(
    pool,
    actor,
    { message: "Find general medicine in Karachi", consent: true },
    { env, request },
  );
  assert.equal(reply.doctors.length, 1);
  assert.equal(reply.doctors[0].id, "doctor-maya");
  assert.ok(!sent.includes(actor.id));
  assert.ok(!sent.includes("patient_id"));
  assert.equal(JSON.parse(sent).store, false);
  assert.equal(reply.links[0].href, "/doctors");
  const clinical = await askAssistant(
    pool,
    actor,
    { message: "Diagnose my symptoms", consent: true },
    {
      env,
      request: async () =>
        responseFor({ intent: "out_of_scope", doctorIds: ["doctor-maya"] }),
    },
  );
  assert.equal(clinical.doctors.length, 0);
  assert.match(clinical.message, /cannot assess symptoms/);
});
test("AI refuses missing consent/configuration and handles provider failures without exposing details", async () => {
  const actor = await fixtureActor(pool, "patient");
  let calls = 0;
  const request: typeof fetch = async () => {
    calls++;
    return new Response("private provider diagnostics", { status: 429 });
  };
  await assert.rejects(
    askAssistant(
      pool,
      actor,
      { message: "Hello", consent: false },
      { env, request },
    ),
    { code: "INVALID_INPUT" },
  );
  await assert.rejects(
    askAssistant(
      pool,
      actor,
      { message: "Hello", consent: true },
      { env: {}, request },
    ),
    { code: "DEPENDENCY_UNAVAILABLE" },
  );
  assert.equal(calls, 0);
  await assert.rejects(
    askAssistant(
      pool,
      actor,
      { message: "Hello", consent: true },
      { env, request },
    ),
    (error) => {
      assert.ok(error instanceof Error);
      assert.ok(!error.message.includes("diagnostics"));
      return true;
    },
  );
  await assert.rejects(
    askAssistant(
      pool,
      actor,
      { message: "Hello", consent: true },
      {
        env,
        request: async () => Response.json({ status: "completed", output: [] }),
      },
    ),
    { code: "DEPENDENCY_UNAVAILABLE" },
  );
});
