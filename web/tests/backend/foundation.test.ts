import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createDatabase, databaseConfig, transaction } from "../../src/server/database.ts";
import { databaseError } from "../../src/server/errors.ts";
import { migrate } from "../../src/server/migrations.ts";

const pool = createDatabase(databaseConfig());
let fixture: string;
before(async () => {
  fixture = await mkdtemp(path.join(os.tmpdir(), "pulse-migration-fixture-"));
  await migrate(pool, path.resolve("database/migrations"));
});
after(async () => { await pool.end(); if (fixture) await rm(fixture, { recursive: true }); });

test("database configuration rejects missing and malformed connections without exposing input", () => {
  assert.throws(() => databaseConfig({}), /required/);
  assert.throws(() => databaseConfig({ DATABASE_URL: "not-a-url" }), /PostgreSQL URL/);
  assert.throws(() => databaseConfig({ DATABASE_URL: "https://example.test" }), /PostgreSQL URL/);
  assert.throws(() => databaseConfig({ DATABASE_URL: process.env.DATABASE_URL, DATABASE_POOL_MAX: "0" }), /DATABASE_POOL_MAX/);
  assert.throws(() => databaseConfig({ DATABASE_URL: "postgresql://example.test/pulse", NODE_ENV: "production" }), /verify-full/);
  const config = databaseConfig({ DATABASE_URL: "postgresql://example.test/pulse?sslmode=verify-full", NODE_ENV: "production" });
  assert.equal(config.max, 10);
});

test("real PostgreSQL commits successful transactions", async () => {
  await pool.query("CREATE TABLE pulse.transaction_fixture(id integer PRIMARY KEY)");
  await transaction(pool, async (client) => { await client.query("INSERT INTO pulse.transaction_fixture(id) VALUES ($1)", [1]); });
  const result = await pool.query("SELECT id FROM pulse.transaction_fixture");
  assert.deepEqual(result.rows, [{ id: 1 }]);
});

test("failed transactions roll back every write and release the connection", async () => {
  await assert.rejects(transaction(pool, async (client) => {
    await client.query("INSERT INTO pulse.transaction_fixture(id) VALUES ($1)", [2]);
    await client.query("INSERT INTO pulse.transaction_fixture(id) VALUES ($1)", [1]);
  }));
  const result = await pool.query("SELECT id FROM pulse.transaction_fixture ORDER BY id");
  assert.deepEqual(result.rows, [{ id: 1 }]);
  assert.equal(pool.waitingCount, 0);
});

test("concurrent migrations serialize and re-running is a no-op", async () => {
  const results = await Promise.all([migrate(pool, path.resolve("database/migrations")), migrate(pool, path.resolve("database/migrations"))]);
  assert.deepEqual(results, [[], []]);
  const ledger = await pool.query("SELECT name FROM pulse_migrations");
  assert.equal(ledger.rowCount, (await readdir("database/migrations")).filter(name => name.endsWith(".sql")).length);
});

test("migration runner rejects changed or missing applied migration files", async () => {
  await writeFile(path.join(fixture, "0001_backend_namespace.sql"), "SELECT 1;");
  await assert.rejects(migrate(pool, fixture), /history differs/);
  const result = await pool.query("SELECT count(*)::integer AS count FROM pulse_migrations");
  assert.equal(result.rows[0].count, (await readdir("database/migrations")).filter(name => name.endsWith(".sql")).length);
});

test("migration failure rolls back DDL and its ledger entry", async () => {
  await pool.query("CREATE SCHEMA migration_failure_test");
  const isolated = createDatabase({ ...databaseConfig(), options: "-c search_path=migration_failure_test" });
  try {
    await writeFile(path.join(fixture, "0001_backend_namespace.sql"), "CREATE TABLE partial_write(id integer); SELECT missing_column FROM partial_write;");
    await assert.rejects(migrate(isolated, fixture));
    const result = await isolated.query("SELECT to_regclass('migration_failure_test.partial_write') AS relation");
    assert.equal(result.rows[0].relation, null);
    const ledger = await isolated.query("SELECT to_regclass('migration_failure_test.pulse_migrations') AS relation");
    assert.equal(ledger.rows[0].relation, null);
  } finally { await isolated.end(); }
});

test("database errors return safe categories, never SQL details", () => {
  const conflict = databaseError({ code: "23505", detail: "private-value", message: "private-query" });
  assert.equal(conflict.code, "CONFLICT");
  assert.ok(!conflict.message.includes("private"));
  assert.equal(databaseError({ code: "23P01" }).code, "CONFLICT");
  assert.equal(databaseError({ code: "23503" }).code, "INVALID_INPUT");
  assert.equal(databaseError({ code: "ECONNREFUSED" }).code, "DEPENDENCY_UNAVAILABLE");
  assert.equal(databaseError(new Error("private details")).code, "INTERNAL_ERROR");
});
