import "server-only";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { transaction, type Database } from "./database.ts";

/** Forward-only, checksummed SQL migrations serialized across deploy processes. */
export async function migrate(pool: Database, directory: string): Promise<string[]> {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();
  if (names.some((name) => !/^\d{4}_[a-z0-9_]+\.sql$/.test(name))) {
    throw new Error("SQL migration filenames must use NNNN_lowercase_name.sql.");
  }
  const migrations = await Promise.all(names.map(async (name) => {
    const sql = await readFile(path.join(directory, name), "utf8");
    return { name, sql, checksum: createHash("sha256").update(sql).digest("hex") };
  }));
  return transaction(pool, async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(734825001)");
    await client.query(`CREATE TABLE IF NOT EXISTS pulse_migrations (
      name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const applied = await client.query<{ name: string; checksum: string }>("SELECT name, checksum FROM pulse_migrations ORDER BY name");
    for (const [index, row] of applied.rows.entries()) {
      const file = migrations[index];
      if (!file || file.name !== row.name || file.checksum !== row.checksum) {
        throw new Error("Migration history differs from local files. Restore applied files and add a new migration.");
      }
    }
    const added: string[] = [];
    for (const file of migrations.slice(applied.rowCount ?? 0)) {
      await client.query(file.sql);
      await client.query("INSERT INTO pulse_migrations(name, checksum) VALUES ($1, $2)", [file.name, file.checksum]);
      added.push(file.name);
    }
    return added;
  });
}
