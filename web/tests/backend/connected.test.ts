import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { randomUUID, randomBytes } from "node:crypto";
import { mkdtemp, rm, readdir, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getMigrations } from "better-auth/db/migration";
import { createDatabase, databaseConfig } from "../../src/server/database.ts";
import { migrate } from "../../src/server/migrations.ts";
import { createAuth, memberForUser } from "../../src/server/auth.ts";
import { snapshot, executeCommand } from "../../src/server/workspace.ts";
import {
  saveReport,
  loadReport,
  storageRoot,
} from "../../src/server/reports.ts";
import { boundedBody, sameOrigin } from "../../src/server/http.ts";
import { fixtureActor } from "./fixtures.ts";
import { seedFictional } from "../../src/server/seed.ts";

const pool = createDatabase(databaseConfig());
let directory: string;
const auth = createAuth(pool, {
  NODE_ENV: "test",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
});
before(async () => {
  await migrate(pool, path.resolve("database/migrations"));
  directory = await mkdtemp(path.join(os.tmpdir(), "big-pulse-report-test-"));
});
after(async () => {
  await pool.end();
  await rm(directory, { recursive: true });
});

test("maintained auth schema is compatible and sign-in sessions survive separate requests", async () => {
  const plan = await getMigrations(auth.options);
  assert.deepEqual(plan.toBeCreated, []);
  assert.deepEqual(plan.toBeAdded, []);
  assert.deepEqual(plan.schemaProblems, []);
  const email = `${randomUUID()}@example.test`,
    password = randomBytes(24).toString("hex");
  const response = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        name: "Fictional tester",
        email,
        password,
        role: "doctor",
      }),
    }),
  );
  assert.equal(response.status, 200);
  const cookies = response.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.ok(cookies.includes("session_token"));
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: cookies }),
  });
  assert.ok(session);
  assert.equal(session.user.email, email);
  const actor = await memberForUser(pool, session.user);
  assert.equal(actor.role, "patient");
  assert.equal(
    await auth.api.getSession({
      headers: new Headers({ cookie: "better-auth.session_token=forged" }),
    }),
    null,
  );
  const signOut = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-out", {
      method: "POST",
      headers: {
        cookie: cookies,
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: "{}",
    }),
  );
  assert.equal(signOut.status, 200);
  assert.equal(
    await auth.api.getSession({ headers: new Headers({ cookie: cookies }) }),
    null,
  );
});

test("patient profile edits persist, cannot change another profile or Google email", async () => {
  const first = await fixtureActor(pool, "patient"),
    second = await fixtureActor(pool, "patient");
  const data = {
    id: first.id,
    name: "Fictional patient",
    email: "different@example.test",
    phone: "",
    city: "Lahore",
  };
  await executeCommand(pool, first, { type: "profile", patient: data });
  const saved = (await snapshot(pool, first)).patients.find(
    (p) => p.id === first.id,
  )!;
  assert.equal(saved.city, "Lahore");
  assert.notEqual(saved.email, data.email);
  await assert.rejects(
    executeCommand(pool, second, { type: "profile", patient: data }),
    { code: "FORBIDDEN" },
  );
  assert.equal(
    (await snapshot(pool, second)).patients.some((p) => p.id === first.id),
    false,
  );
});

test("Google entry generates the configured callback and password signup stays disabled outside tests", async () => {
  const google = createAuth(pool, {
    NODE_ENV: "production",
    BETTER_AUTH_URL: "https://big-pulse.example.test",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "fictional-client-id",
    GOOGLE_CLIENT_SECRET: "fictional-test-provider-secret",
  });
  const response = await google.handler(
    new Request("https://big-pulse.example.test/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://big-pulse.example.test",
      },
      body: JSON.stringify({ provider: "google", callbackURL: "/account" }),
    }),
  );
  assert.equal(response.status, 200);
  const payload = await response.json(),
    url = new URL(payload.url);
  assert.equal(url.hostname, "accounts.google.com");
  assert.equal(
    url.searchParams.get("redirect_uri"),
    "https://big-pulse.example.test/api/auth/callback/google",
  );
  assert.ok(url.searchParams.get("state"));
  assert.ok(
    !JSON.stringify(payload).includes("fictional-test-provider-secret"),
  );
  const password = await google.handler(
    new Request("https://big-pulse.example.test/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://big-pulse.example.test",
      },
      body: JSON.stringify({
        name: "Fictional test",
        email: "unused@example.test",
        password: randomBytes(24).toString("hex"),
      }),
    }),
  );
  assert.notEqual(password.status, 200);
});

test("disabled members cannot acquire an application identity; doctor ownership is derived from the database", async () => {
  const actor = await fixtureActor(pool, "patient");
  await pool.query("UPDATE pulse.members SET enabled=false WHERE id=$1", [
    actor.id,
  ]);
  await assert.rejects(
    memberForUser(pool, { ...actor, email: `${actor.id}@example.test` }),
    { code: "FORBIDDEN" },
  );
  const doctor = await fixtureActor(pool, "doctor");
  const account = await memberForUser(pool, {
    ...doctor,
    email: `${doctor.id}@example.test`,
  });
  assert.equal(account.role, "doctor");
  assert.equal(account.accountId, doctor.id);
});

test("doctor receives only related patients; guest never receives appointment identities", async () => {
  const doctor = await fixtureActor(pool, "doctor"),
    patient = await fixtureActor(pool, "patient");
  const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  await executeCommand(pool, doctor, { type: "slot-add", date, time: "09:00" });
  const slot = (await snapshot(pool, doctor)).slots.find(
    (s) => s.doctorId === doctor.id,
  )!;
  await executeCommand(pool, patient, {
    type: "book",
    doctorId: doctor.id,
    slotId: slot.id,
  });
  const request = (await snapshot(pool, doctor)).appointments[0];
  assert.ok(request);
  await executeCommand(pool, doctor, {
    type: "appointment",
    id: request.id,
    status: "Confirmed",
  });
  assert.equal(
    (await snapshot(pool, patient)).appointments[0].status,
    "Confirmed",
  );
  const contact = (await snapshot(pool, doctor)).patients.find(
    (p) => p.id === patient.id,
  )!;
  assert.equal(contact.email, "");
  assert.equal(contact.phone, "");
  const guest = await snapshot(pool, null);
  assert.deepEqual(guest.patients, []);
  assert.deepEqual(guest.appointments, []);
  assert.deepEqual(guest.reports, []);
  assert.equal(
    guest.slots.some((s) => s.id === slot.id),
    false,
  );
});

test("drafts remain private and patient cannot publish or grant themselves staff access", async () => {
  const editor = await fixtureActor(pool, "editor"),
    patient = await fixtureActor(pool, "patient");
  const article = {
    id: randomUUID(),
    title: "Fictional draft",
    category: "Test",
    summary: "Sample content",
    symptoms: "Not diagnostic",
    source: "https://www.nih.org.pk/advisories",
    published: false,
    edited: true,
  };
  await executeCommand(pool, editor, { type: "article", article });
  assert.equal(
    (await snapshot(pool, null)).articles.some((a) => a.id === article.id),
    false,
  );
  await assert.rejects(
    executeCommand(pool, patient, { type: "article", article }),
    { code: "FORBIDDEN" },
  );
  await assert.rejects(
    executeCommand(pool, patient, { type: "grant", role: "doctor" }),
    { code: "INVALID_INPUT" },
  );
  await executeCommand(pool, editor, {
    type: "article",
    article: { ...article, published: true },
  });
  assert.equal(
    (await snapshot(pool, null)).articles.some((a) => a.id === article.id),
    true,
  );
});

test("PDF bytes are private, checked per owner, integrity checked and never included in snapshots", async () => {
  const patient = await fixtureActor(pool, "patient"),
    other = await fixtureActor(pool, "patient"),
    lab = await fixtureActor(pool, "lab"),
    otherLab = await fixtureActor(pool, "lab");
  const bytes = Buffer.from(
    "%PDF-1.4\nFictional test-only signature fixture\n%%EOF",
  );
  const id = await saveReport(
    pool,
    lab,
    {
      patientId: patient.id,
      title: "Fictional document",
      fileName: "test.pdf",
      bytes,
    },
    directory,
  );
  assert.deepEqual(
    (await loadReport(pool, patient, id, directory)).bytes,
    bytes,
  );
  assert.deepEqual((await loadReport(pool, lab, id, directory)).bytes, bytes);
  await assert.rejects(loadReport(pool, other, id, directory), {
    code: "NOT_FOUND",
  });
  await assert.rejects(loadReport(pool, otherLab, id, directory), {
    code: "NOT_FOUND",
  });
  await assert.rejects(
    loadReport(pool, await fixtureActor(pool, "doctor"), id, directory),
    { code: "NOT_FOUND" },
  );
  assert.equal(
    (await snapshot(pool, patient)).reports.find((r) => r.id === id)?.content,
    "",
  );
  assert.equal((await snapshot(pool, other)).reports.length, 0);
  assert.equal(
    (await stat(path.join(directory, id + ".pdf"))).mode & 0o777,
    0o600,
  );
  await writeFile(path.join(directory, id + ".pdf"), "changed fixture");
  await assert.rejects(loadReport(pool, patient, id, directory), {
    code: "DEPENDENCY_UNAVAILABLE",
  });
});

test("invalid report writes leave no files and no records", async () => {
  const lab = await fixtureActor(pool, "lab"),
    patient = await fixtureActor(pool, "patient");
  const count = (await readdir(directory)).length;
  const input = {
    patientId: patient.id,
    title: "Test",
    fileName: "test.pdf",
    bytes: Buffer.from("not a PDF"),
  };
  await assert.rejects(saveReport(pool, lab, input, directory), {
    code: "INVALID_INPUT",
  });
  await assert.rejects(saveReport(pool, patient, input, directory), {
    code: "FORBIDDEN",
  });
  await assert.rejects(loadReport(pool, patient, "../../secret", directory), {
    code: "NOT_FOUND",
  });
  assert.equal((await readdir(directory)).length, count);
});

test("private storage rejects public assets and broad directories without changing permissions", async () => {
  for (const candidate of [
    process.cwd(),
    path.parse(process.cwd()).root,
    os.homedir(),
    path.resolve("public"),
  ]) {
    const before = await stat(candidate).catch(() => null);
    await assert.rejects(storageRoot(candidate), {
      code: "DEPENDENCY_UNAVAILABLE",
    });
    const after = await stat(candidate).catch(() => null);
    assert.equal(after?.mode, before?.mode);
  }
});

test("request boundary rejects cross-origin changes and oversized streaming bodies", async () => {
  const old = process.env.BETTER_AUTH_URL;
  process.env.BETTER_AUTH_URL = "http://localhost:3000";
  try {
    assert.throws(
      () =>
        sameOrigin(
          new Request("http://localhost:3000/api/workspace", {
            headers: { origin: "https://example.test" },
          }),
        ),
      { code: "FORBIDDEN" },
    );
    sameOrigin(
      new Request("http://localhost:3000/api/workspace", {
        headers: { origin: "http://localhost:3000" },
      }),
    );
    await assert.rejects(
      boundedBody(
        new Request("http://localhost:3000", {
          method: "POST",
          body: "123456",
        }),
        5,
      ),
      { code: "INVALID_INPUT" },
    );
  } finally {
    if (old === undefined) delete process.env.BETTER_AUTH_URL;
    else process.env.BETTER_AUTH_URL = old;
  }
});

test("Pakistani seed is repeatable and never overwrites edited profiles", async () => {
  await seedFictional(pool);
  await pool.query(
    `UPDATE pulse.doctors SET profile=jsonb_set(profile,'{about}','"Tester edit"') WHERE id='doctor-maya'`,
  );
  const count = Number(
    (
      await pool.query(
        "SELECT count(*) AS count FROM pulse.availability WHERE doctor_id='doctor-maya'",
      )
    ).rows[0].count,
  );
  await seedFictional(pool);
  const doctor = (await snapshot(pool, null)).doctors.find(
    (d) => d.id === "doctor-maya",
  )!;
  assert.equal(doctor.about, "Tester edit");
  assert.ok(doctor.name.includes("fictional"));
  assert.equal(
    Number(
      (
        await pool.query(
          "SELECT count(*) AS count FROM pulse.availability WHERE doctor_id='doctor-maya'",
        )
      ).rows[0].count,
    ),
    count,
  );
});
