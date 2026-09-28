import path from "node:path";
import { createDatabase, databaseConfig } from "../.backend-build/src/server/database.js";
import { migrate } from "../.backend-build/src/server/migrations.js";

let pool;
try {
  pool = createDatabase(databaseConfig());
  if (process.argv[2] === "migrate") {
    const applied = await migrate(pool, path.resolve("database/migrations"));
    console.log(applied.length ? `Applied: ${applied.join(", ")}` : "Database migrations are up to date.");
  } else if (process.argv[2] === "check") {
    await pool.query("SELECT 1");
    console.log("Database connection succeeded.");
  } else {
    throw new Error("Expected migrate or check.");
  }
} catch {
  console.error("Database command failed. Check connection configuration, permissions and migration history; no credentials or SQL values are logged.");
  process.exitCode = 1;
} finally {
  await pool?.end();
}
