import { test } from "node:test";
import assert from "node:assert/strict";
import { assistantConfiguration, deploymentProblems } from "../../src/server/configuration.ts";

test("explicitly disabled AI ignores existing credentials and needs no API keys", () => {
  const result = assistantConfiguration({ AI_PROVIDER: "none", GEMINI_API_KEY: "fictional-unused-key" });
  assert.equal(result.ready, false);
  assert.equal(result.provider, null);
  assert.deepEqual(result.missing, []);
});

test("hosted preflight catches OAuth origin mismatch and temporary report storage without disclosing secrets", () => {
  const env = {
    AI_PROVIDER: "none", APP_MODE: "connected", NETLIFY: "true", CONTEXT: "production",
    URL: "https://pulse.example.test", BETTER_AUTH_URL: "https://pulse.example.test",
    BETTER_AUTH_SECRET: "fictional-session-secret-for-tests-only-123",
    GOOGLE_CLIENT_ID: "fictional-id", GOOGLE_CLIENT_SECRET: "fictional-google-secret",
    DATABASE_URL: "postgresql://fictional:private@db.example.test/pulse?sslmode=verify-full",
    REPORT_STORAGE: "netlify",
  };
  assert.deepEqual(deploymentProblems(env), []);
  assert.ok(deploymentProblems({ ...env, BETTER_AUTH_URL: "https://other.example.test" }).some(p => p.includes("match")));
  assert.ok(deploymentProblems({ ...env, REPORT_STORAGE: "local" }).some(p => p.includes("durable")));
  assert.ok(deploymentProblems({ ...env, APP_MODE: "demo" }).some(p => p.includes("connected")));
  assert.ok(deploymentProblems({ ...env, BETTER_AUTH_URL: "http://localhost:3000" }).some(p => p.includes("public HTTPS")));
  assert.ok(!JSON.stringify(deploymentProblems({ ...env, AI_PROVIDER: "gemini" })).includes("fictional-google-secret"));
});

test("provider readiness reports only selected-provider missing names and no secrets", () => {
  const openai = { OPENAI_API_KEY: "fictional-openai-key", OPENAI_MODEL: "test-model" };
  assert.equal(assistantConfiguration(openai).ready, true);
  const result = assistantConfiguration({ ...openai, AI_PROVIDER: "gemini" });
  assert.equal(result.ready, false);
  assert.deepEqual(result.missing, ["GEMINI_API_KEY", "GEMINI_MODEL"]);
  const gemini = assistantConfiguration({ AI_PROVIDER: "gemini", GEMINI_API_KEY: "fictional-key", GEMINI_MODEL: "gemini-3.5-flash-lite" });
  assert.equal(gemini.ready, true);
  assert.equal(gemini.label, "Google Gemini");
  assert.ok(!JSON.stringify(gemini).includes("fictional-key"));
  assert.equal(assistantConfiguration({ AI_PROVIDER: "unapproved-provider" }).ready, false);
  assert.equal(assistantConfiguration({ AI_PROVIDER: "gemini", GEMINI_API_KEY: "REPLACE_WITH_KEY", GEMINI_MODEL: "gemini-3.5-flash-lite" }).ready, false);
});
