import "server-only";
import { betterAuth } from "better-auth";
import { getDatabase, type Database } from "./database.ts";
import { ServiceError } from "./errors.ts";
import type { Actor, Role } from "../features/pulse/model.ts";

export function authConfigured() {
  return [process.env.BETTER_AUTH_URL,process.env.BETTER_AUTH_SECRET,process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET]
    .every(value=>!!value&&!value.startsWith("REPLACE")&&!value.startsWith("<"));
}
export function createAuth(
  pool: Database,
  env: Readonly<Record<string, string | undefined>> = process.env,
) {
  const baseURL = env.BETTER_AUTH_URL;
  if (!baseURL || !env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32)
    throw new Error(
      "Configure the authentication URL and a secret of at least 32 characters.",
    );
  const url = new URL(baseURL);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Authentication requires an HTTP or HTTPS URL.");
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error("Authentication requires HTTPS outside localhost.");
  return betterAuth({
    appName: "Pulse",
    baseURL,
    secret: env.BETTER_AUTH_SECRET,
    database: pool,
    trustedOrigins: [url.origin],
    user: { modelName: "pulse_auth_user" },
    session: {
      modelName: "pulse_auth_session",
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    account: {
      modelName: "pulse_auth_account",
      accountLinking: { enabled: false },
      encryptOAuthTokens: true,
    },
    verification: { modelName: "pulse_auth_verification" },
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "pulse_auth_rate_limit",
      window: 60,
      max: 60,
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
              prompt: "select_account",
            },
          }
        : {},
    // Isolated automated tests exercise library sessions without contacting Google.
    emailAndPassword: {
      enabled: env.NODE_ENV === "test",
      minPasswordLength: 12,
    },
    advanced: { useSecureCookies: url.protocol === "https:" },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (instance ??= createAuth(getDatabase()));
}

export async function memberForUser(
  pool: Database,
  user: { id: string; name: string; email: string },
): Promise<Actor> {
  // Google users start as patients. Roles are never copied from a browser payload.
  await pool.query(
    "INSERT INTO pulse.members(id,display_name) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
    [user.id, user.name.trim().slice(0, 80).padEnd(2, " ")],
  );
  const result = await pool.query<{
    id: string;
    name: string;
    role: Role;
    enabled: boolean;
  }>(
    "SELECT id,display_name AS name,role,enabled FROM pulse.members WHERE id=$1",
    [user.id],
  );
  const member = result.rows[0];
  if (!member?.enabled)
    throw new ServiceError("FORBIDDEN", "This account is not enabled.");
  if (member.role === "patient")
    await pool.query(
      "INSERT INTO pulse.patients(id,name,email) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING",
      [user.id, member.name, user.email],
    );
  if (member.role === "doctor") {
    const profile = await pool.query<{ id: string; name: string }>(
      "SELECT id,profile->>'name' AS name FROM pulse.doctors WHERE owner_id=$1",
      [user.id],
    );
    if (profile.rows[0])
      return { ...profile.rows[0], role: "doctor", accountId: user.id };
  }
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    accountId: user.id,
  };
}
export async function currentActor(headers: Headers): Promise<Actor | null> {
  if (!authConfigured()) return null;
  const session = await getAuth().api.getSession({ headers });
  if (!session) return null;
  return memberForUser(getDatabase(), session.user);
}
export async function requireActor(headers: Headers) {
  const actor = await currentActor(headers);
  if (!actor) throw new ServiceError("UNAUTHENTICATED", "Sign in to continue.");
  return actor;
}
