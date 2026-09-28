import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { startPostgres } from "./postgres-process.mjs";

// Never uses DATABASE_URL from the operator: tests own a fresh temporary cluster.
const root = await mkdtemp(path.join(os.tmpdir(), "pulse-db-test-"));
let cluster;
try {
  cluster = await startPostgres(root, "pulse_test", "pulse_test");
  const directory = path.resolve(".backend-build/tests/backend");
  const tests = (await readdir(directory)).filter((name) => name.endsWith(".test.js")).map((name) => path.join(directory, name));
  if (!tests.length) throw new Error("No compiled backend tests found.");
  process.exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--conditions=react-server", "--test", "--test-concurrency=1", ...tests], {
      stdio: "inherit", env: { ...process.env, NODE_ENV: "test", DATABASE_URL: cluster.url },
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  // Remove only the fresh directory this invocation created, after shutdown.
  if (cluster) { cluster.stop(); await rm(root, { recursive: true }); }
}
