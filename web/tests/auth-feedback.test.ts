import { test } from "node:test";
import assert from "node:assert/strict";
import { authErrorMessage } from "../src/features/pulse/auth-feedback.ts";

test("OAuth feedback distinguishes cancelled, expired and missing sessions without echoing arbitrary provider data", () => {
  assert.equal(authErrorMessage(undefined), "");
  assert.match(authErrorMessage("access_denied"), /cancelled/);
  assert.match(authErrorMessage("state_mismatch"), /cookie/);
  assert.match(authErrorMessage("session_missing"), /session/);
  assert.match(authErrorMessage("invalid_code"), /client secret/);
  const untrusted = "<script>secret-code-from-provider</script>";
  assert.ok(!authErrorMessage(untrusted).includes(untrusted));
});
