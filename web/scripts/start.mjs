import { access, cp } from "node:fs/promises";
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";
import path from "node:path";

const { values } = parseArgs({
  options: {
    port: { type: "string", short: "p" },
    hostname: { type: "string", short: "H" },
  },
});
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".next/standalone");
try {
  await access(path.join(output, "server.js"));
  // Next's standalone output needs only these public assets copied alongside it.
  await cp(path.join(root, "public"), path.join(output, "public"), {
    recursive: true,
  });
  await cp(path.join(root, ".next/static"), path.join(output, ".next/static"), {
    recursive: true,
  });
} catch {
  console.error("Production assets are unavailable. Run npm run build first.");
  process.exit(1);
}
const server = spawn(process.execPath, [path.join(output, "server.js")], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: values.port ?? process.env.PORT ?? "3000",
    HOSTNAME: values.hostname ?? "0.0.0.0",
    PRIVATE_STORAGE_DIR:
      process.env.PRIVATE_STORAGE_DIR ??
      path.join(root, ".local/private-reports"),
  },
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}
server.on("error", () => {
  console.error("The production server could not start.");
  process.exitCode = 1;
});
server.on("exit", (code, signal) => {
  process.exitCode =
    code ?? (signal === "SIGINT" || signal === "SIGTERM" ? 0 : 1);
});
