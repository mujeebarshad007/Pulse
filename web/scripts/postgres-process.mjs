import { spawnSync } from "node:child_process";
import { chmod, mkdir, access } from "node:fs/promises";
import path from "node:path";

function command(binary, args, accepted = [0]) {
  const result = spawnSync(binary, args, { encoding: "utf8", timeout: 30_000 });
  if (result.error || !accepted.includes(result.status)) {
    throw new Error(`PostgreSQL tool ${path.basename(binary)} failed. Check its installation and the local cluster log.`);
  }
  return result;
}
export function postgresBinaries() {
  if (process.env.PG_BINDIR) return process.env.PG_BINDIR;
  const found = spawnSync("pg_config", ["--bindir"], { encoding: "utf8" });
  if (found.status !== 0) throw new Error("Install PostgreSQL server tools or set PG_BINDIR to their directory.");
  return found.stdout.trim();
}
const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;

export async function startPostgres(root, user, database) {
  const binaries = postgresBinaries();
  const data = path.join(root, "data");
  const socket = path.join(root, "socket");
  // The Unix socket is restricted by a directory accessible only to this OS user.
  // TCP connections are disabled; no reusable password is generated.
  await mkdir(root, { recursive: true, mode: 0o700 });
  await chmod(root, 0o700);
  await mkdir(socket, { recursive: true, mode: 0o700 });
  let exists = true;
  try { await access(path.join(data, "PG_VERSION")); } catch { exists = false; }
  if (!exists) command(path.join(binaries, "initdb"), ["-D", data, "--username", user, "--auth-local=trust", "--auth-host=reject", "--encoding=UTF8", "--locale=C"]);
  const status = command(path.join(binaries, "pg_ctl"), ["-D", data, "status"], [0, 3]);
  if (status.status !== 0) command(path.join(binaries, "pg_ctl"), ["-D", data, "-l", path.join(root, "server.log"), "-o", `-h '' -k ${quote(socket)} -p 55439`, "-w", "start"]);
  if (!exists) {
    try {
      command(path.join(binaries, "createdb"), ["-h", socket, "-p", "55439", "-U", user, database]);
    } catch (error) {
      command(path.join(binaries, "pg_ctl"), ["-D", data, "-m", "fast", "-w", "stop"]);
      throw error;
    }
  }
  const url = new URL(`postgresql://${user}@localhost/${database}`);
  url.searchParams.set("host", socket);
  url.searchParams.set("port", "55439");
  return {
    url: url.toString(),
    stop() { command(path.join(binaries, "pg_ctl"), ["-D", data, "-m", "fast", "-w", "stop"]); },
  };
}
