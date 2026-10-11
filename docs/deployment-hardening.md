# Deployment hardening — 2026-10-10

The original glass interface is preserved. This delivery hardens the existing connected app; it does not claim acceptance for real patient care or add unapproved provider policies.

## Changes

- `AI_PROVIDER=none` explicitly disables model calls even if old credentials exist. No Gemini/OpenAI key is needed in this mode. Public quick guides and sourced education remain available.
- `netlify.toml` supplies connected mode, AI off, Netlify private report storage and a bounded database pool of three connections per process. Netlify environment settings can override these defaults.
- Netlify runs `release:check` before the optimized build. It checks Google settings, HTTPS origin, primary production site origin consistency, connected mode, durable report storage, selected AI settings and database schema. It reports setting names without credentials.
- Database configuration failures during preflight are caught without raw connection details or stack traces. Auth tables are included in schema checks.
- Deployment instructions no longer tell the owner to seed fictional providers into the new database.

## What hosting still must supply

The host needs DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET privately in its environment. The repository does not contain these values. Make them available for builds and functions. The supplied non-secret defaults cover AI/storage/pool settings.

Use the same primary HTTPS address for Netlify, BETTER_AUTH_URL and the Google callback origin. The exact callback suffix is `/api/auth/callback/google`. Review a preview before public promotion; real Google consent/callback, Netlify Blobs persistence and separate patient/staff journeys must be exercised on the actual host.

The local auth origin must remain localhost while developing. Do not substitute an invented website URL merely to make the hosted preflight pass. The no-AI hosted preflight correctly rejects a local origin until a real hosting address exists.

## Learn this slice

`configuration.ts` describes safe readiness checks. `release-check.mjs` uses them and checks database tables. `netlify.toml` runs that check before the build. Changing one hosting value can affect login callbacks, cookie delivery and the server's allowed origin; all must refer to the same site.

Exercise: explain why a passing configuration check cannot prove Google accepted the credentials, and why a successful database connection cannot prove every required table exists.

Validation commands from the repository root:

```bash
npm run check:all
npm run auth:check
npm run db:check
AI_PROVIDER=none npm run release:check
git diff --check
npm run package:netlify
```

The backend test runner creates an isolated temporary PostgreSQL cluster; it does not use the hosted database. The connectivity check only runs SELECT 1 against the configured database. No real provider or patient records are created by these checks.

## Recorded results

`npm run check:all` passed: ESLint, 19 frontend/domain tests, optimized production build and 47 backend tests (66 total). Google configuration syntax and Neon connectivity passed. A read-only check verified six applied migrations and the hosted login/booking/report tables using certificate-verifying TLS. The built server returned HTTP 200 for home, login, assistant metadata and the anonymous workspace against Neon. With AI_PROVIDER=none, assistant metadata reported configured=false/provider=null and the public workspace still loaded.

The hosted release check intentionally failed on the local HTTP authentication origin. No real Netlify address has been provided/configured, so live hosted Google login and Netlify storage are still unverified. The local runtime checks are not a successful Netlify deployment. No external AI call or database write was needed for them.
