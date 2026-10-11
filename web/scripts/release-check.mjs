import { loadEnvFile } from "node:process";
import { deploymentProblems } from "../.backend-build/src/server/configuration.js";
import {
  createDatabase,
  databaseConfig,
} from "../.backend-build/src/server/database.js";
try {
  loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const problems = deploymentProblems(process.env);
if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
let pool;
try {
  pool = createDatabase(databaseConfig({ ...process.env, NODE_ENV: "production" }));
  await pool.query('SELECT id FROM pulse_auth_user LIMIT 0');
  await pool.query('SELECT id FROM pulse_auth_session LIMIT 0');
  await pool.query('SELECT id FROM pulse_auth_account LIMIT 0');
  await pool.query('SELECT id FROM pulse_auth_verification LIMIT 0');
  await pool.query('SELECT id FROM pulse_auth_rate_limit LIMIT 0');
  await pool.query("SELECT storage_driver FROM pulse.reports LIMIT 0");
  await pool.query("SELECT id FROM pulse.report_uploads LIMIT 0");
  await pool.query("SELECT key FROM pulse.request_limits LIMIT 0");
  await pool.query("SELECT id FROM pulse.lab_bookings LIMIT 0");
  await pool.query("SELECT booking_id FROM pulse.lab_booking_reports LIMIT 0");
  console.log(
    "Required configuration and database schema checks passed. This does not verify live OAuth, AI, storage, backups or browser journeys.",
  );
} catch {
  console.error(
    "Database/schema check failed. Verify the connection and run migrations; connection details are not logged.",
  );
  process.exitCode = 1;
} finally {
  await pool?.end();
}
