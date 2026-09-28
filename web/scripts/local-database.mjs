import path from "node:path";
import { spawnSync } from "node:child_process";
import { startPostgres, postgresBinaries } from "./postgres-process.mjs";

if (process.env.NODE_ENV === "production") throw new Error("Local database tooling is for synthetic development only.");
const root = path.resolve(".local/postgres");
if (process.argv[2] === "start") {
  const cluster = await startPostgres(root, "pulse_dev", "pulse_development");
  console.log("Isolated development database is running (Unix socket only).");
  console.log(`Set this non-secret development connection in web/.env.local:\nDATABASE_URL=${cluster.url}`);
} else if (["stop", "status"].includes(process.argv[2])) {
  const args = ["-D", path.join(root, "data"), ...(process.argv[2] === "stop" ? ["-m", "fast", "-w", "stop"] : ["status"])];
  const result = spawnSync(path.join(postgresBinaries(), "pg_ctl"), args, { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
} else throw new Error("Expected start, stop or status.");
