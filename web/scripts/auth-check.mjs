import { loadEnvFile } from "node:process";
import { googleConfiguration } from "../.backend-build/src/server/configuration.js";
try {
  loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const result = googleConfiguration(process.env);
if (!result.ready) {
  console.error(
    result.missing.length
      ? `Missing or placeholder configuration: ${result.missing.join(", ")}`
      : "Check BETTER_AUTH_URL (origin only; HTTPS except localhost) and BETTER_AUTH_SECRET (at least 32 characters).",
  );
  console.error(
    "Edit the private environment locally, then restart the server. No secret values were printed.",
  );
  process.exitCode = 1;
} else {
  console.log(
    "Google configuration syntax passed. This does not verify credentials with Google or prove a completed login.",
  );
  console.log(
    "Use BETTER_AUTH_URL + /api/auth/callback/google as the exact Google redirect URI. Do not mix localhost and 127.0.0.1.",
  );
}
