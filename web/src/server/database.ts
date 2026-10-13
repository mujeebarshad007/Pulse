import "server-only";
import pg, { type PoolClient, type PoolConfig } from "pg";

/** One bounded pool per application process; never import into browser code. */
export function databaseConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
): PoolConfig {
  const databaseURL = env.DATABASE_URL ?? env.NETLIFY_DB_URL ?? env.NETLIFY_DATABASE_URL;
  if (!databaseURL)
    throw new Error("DATABASE_URL is required for backend commands.");
  let url: URL;
  try {
    url = new URL(databaseURL);
  } catch {
    throw new Error("DATABASE_URL must be a PostgreSQL URL.");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new Error("DATABASE_URL must be a PostgreSQL URL.");
  const max = Number(env.DATABASE_POOL_MAX ?? 10);
  if (!Number.isInteger(max) || max < 1 || max > 100)
    throw new Error("DATABASE_POOL_MAX must be an integer from 1 to 100.");
  const unixSocket = url.searchParams.get("host")?.startsWith("/");
  if (
    env.NODE_ENV === "production" &&
    !unixSocket &&
    url.searchParams.get("sslmode") !== "verify-full"
  ) {
    throw new Error(
      "Production DATABASE_URL must use sslmode=verify-full with a trusted database certificate.",
    );
  }
  return {
    connectionString: databaseURL,
    max,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    statement_timeout: 10_000,
    application_name: "pulse-backend",
  };
}

export function createDatabase(config: PoolConfig) {
  const pool = new pg.Pool(config);
  // Never log raw database errors: they may contain SQL values or connection details.
  pool.on("error", () =>
    console.error(JSON.stringify({ event: "database_idle_connection_error" })),
  );
  return pool;
}

export type Database = ReturnType<typeof createDatabase>;
const processStore = globalThis as typeof globalThis & {
  pulseDatabase?: Database;
};
export function getDatabase(): Database {
  return (processStore.pulseDatabase ??= createDatabase(databaseConfig()));
}

export async function transaction<T>(
  pool: Database,
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  let destroy = false;
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL lock_timeout = '5s'");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      destroy = true;
    }
    throw error;
  } finally {
    client.release(destroy);
  }
}
