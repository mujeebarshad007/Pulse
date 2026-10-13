import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import path from "node:path";
import {
  googleConfiguration,
  configuredValue,
} from "../../src/server/configuration.ts";
import { createAuth } from "../../src/server/auth.ts";
import { createDatabase, databaseConfig } from "../../src/server/database.ts";
import { migrate } from "../../src/server/migrations.ts";

test("Google readiness rejects placeholder secrets, invalid origins and short session secrets", () => {
  const env = {
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "fictional-client-id",
    GOOGLE_CLIENT_SECRET: "fictional-test-secret",
  };
  assert.equal(googleConfiguration(env).ready, true);
  for (const value of [
    "",
    "YOUR_GOOGLE_SECRET",
    "paste-your-secret-here",
    "REPLACE_WITH_SECRET",
    "<client-secret>",
  ]) {
    const result = googleConfiguration({ ...env, GOOGLE_CLIENT_SECRET: value });
    assert.equal(result.ready, false);
    assert.deepEqual(result.missing, ["GOOGLE_CLIENT_SECRET"]);
  }
  for (const value of [
    "bad url",
    "http://public.example.test",
    "https://pulse.example.test/api",
    "https://user:password@pulse.example.test",
    "https://pulse.example.test?token=value",
  ]) {
    assert.equal(
      googleConfiguration({ ...env, BETTER_AUTH_URL: value }).ready,
      false,
    );
  }
  assert.equal(
    googleConfiguration({ ...env, BETTER_AUTH_SECRET: "short" }).ready,
    false,
  );
  assert.equal(configuredValue("   "), false);
});

test("host-provided URL and Netlify database variable are accepted as deployment fallbacks", () => {
  const env = {
    URL: "https://pulse.example.test",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "fictional-client-id",
    GOOGLE_CLIENT_SECRET: "fictional-test-secret",
    NETLIFY_DB_URL: "postgresql://user:password@db.example.test/pulse?sslmode=verify-full",
  };
  assert.equal(googleConfiguration(env).ready, true);
  const config = databaseConfig(env);
  assert.equal(config.connectionString, env.NETLIFY_DB_URL);
});

const pool = createDatabase(databaseConfig());
before(async () => {
  await migrate(pool, path.resolve("database/migrations"));
});
after(async () => {
  await pool.end();
});

test("hosted OAuth uses the configured HTTPS callback and secure state cookie", async () => {
  const auth = createAuth(pool, {
    NODE_ENV: "production", BETTER_AUTH_URL: "https://pulse.example.test",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "fictional-client-id", GOOGLE_CLIENT_SECRET: "fictional-test-secret",
  });
  const response = await auth.handler(new Request("https://pulse.example.test/api/auth/sign-in/social", {
    method: "POST",
    headers: { Origin: "https://pulse.example.test", "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "google", callbackURL: "/account", errorCallbackURL: "/login" }),
  }));
  assert.equal(response.status, 200);
  const cookie = response.headers.getSetCookie().join("; ");
  assert.match(cookie, /; Secure/i);
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  assert.equal(new URL((await response.json()).url).searchParams.get("redirect_uri"), "https://pulse.example.test/api/auth/callback/google");
});

test("local production OAuth preserves state in a cookie and returns callback errors to the visible login screen", async () => {
  const auth = createAuth(pool, {
    NODE_ENV: "production",
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "fictional-client-id",
    GOOGLE_CLIENT_SECRET: "fictional-test-secret",
  });
  const start = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: "/account",
        errorCallbackURL: "/login",
      }),
    }),
  );
  assert.equal(start.status, 200);
  const cookie = start.headers.getSetCookie().join("; ");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  assert.doesNotMatch(cookie, /; Secure/i);
  const result = await start.json();
  assert.equal(
    new URL(result.url).searchParams.get("redirect_uri"),
    "http://localhost:3000/api/auth/callback/google",
  );
  const failed = await auth.handler(
    new Request(
      "http://localhost:3000/api/auth/callback/google?error=access_denied",
    ),
  );
  assert.equal(failed.status, 302);
  const location = new URL(
    failed.headers.get("location")!,
    "http://localhost:3000",
  );
  assert.equal(location.pathname, "/login");
  assert.ok(location.searchParams.has("error"));
});
