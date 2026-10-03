import { loadEnvFile } from "node:process";
import {
  createDatabase,
  databaseConfig,
} from "../.backend-build/src/server/database.js";
try {
  loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const missing = [];
for (const name of [
  "DATABASE_URL",
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
]) {
  const value = process.env[name];
  if (!value || value.includes("REPLACE") || value.startsWith("<"))
    missing.push(name);
}
if (missing.length) {
  console.error(`Configure privately before release: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  console.error("BETTER_AUTH_SECRET must have at least 32 random characters.");
  process.exit(1);
}
if (new URL(process.env.BETTER_AUTH_URL).protocol !== "https:") {
  console.error("The hosted authentication origin must use HTTPS.");
  process.exit(1);
}
const pool = createDatabase(
  databaseConfig({ ...process.env, NODE_ENV: "production" }),
);
try {
  await pool.query("SELECT storage_driver FROM pulse.reports LIMIT 0");
  await pool.query("SELECT id FROM pulse.report_uploads LIMIT 0");
  await pool.query("SELECT key FROM pulse.request_limits LIMIT 0");
  console.log(
    "Required configuration and database schema checks passed. This does not verify live OAuth, AI, storage, backups or browser journeys.",
  );
} catch {
  console.error(
    "Database/schema check failed. Verify the connection and run migrations; connection details are not logged.",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
