import { test } from "node:test";
import assert from "node:assert/strict";
import { assistantConfiguration } from "../../src/server/configuration.ts";

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
