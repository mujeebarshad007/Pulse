# Release evidence and open gates

Updated 2026-10-03. Deliverable: connected fictional-data tester plus Netlify source package. A successful build is not acceptance for real-patient production. The owner's AI scope decision approves directory/booking help, not clinical advice.

| Requirement | Implemented/evidence | Remaining acceptance |
| --- | --- | --- |
| SEC-001 confidentiality | Server identity/role/owner checks; private PDF metadata/bytes; no private records in AI payload; isolated cross-account tests | Real-data access/consent policy, retention/deletion, audit design and independent security review |
| SEC-002 controls | Same-origin writes, schema/size validation, database-backed AI/upload limits, secret exclusion, HTTPS/TLS configuration checks | Live OAuth validation, scanner/quarantine, operational secrets rotation, dependency advisory below |
| UX-001 usability | Refreshed responsive glass UI, keyboard controls, labelled consent/errors, progress/retry, reduced-motion/transparency CSS | Authenticated phone/keyboard journeys and representative user acceptance |
| COMPAT-001 compatibility | Next.js optimized build and Chromium guest checks | Owner-approved browser/device support matrix; Safari/Firefox and assistive-technology checks |
| PERF-001 performance | Bounded current snapshots; native CSS animation; per-process connection pools; no animation SDK; bounded AI/upload requests | Dataset/concurrency/latency targets remain undefined; no scale or load-test certification |
| REL-001 recovery | PostgreSQL transactions, booking race constraints, upload retries/idempotency, private durable storage adapter | Approved RPO/RTO, scheduled backup/restore drill for database and objects, orphan/staging maintenance |
| ERR-001 error handling | Safe error categories, unavailable configuration feedback, provider timeouts, quota feedback, no arbitrary model text/URLs | Hosted integration failure drills and operational alerting |
| DEPLOY-001 deployment | Netlify config, source packager, migrations, release preflight, standalone alternative | Owner accounts/secrets, hosted database, live Google/AI/storage acceptance, monitoring and rollback rehearsal |

## Recorded automated evidence

`npm run check:all` passed: ESLint, TypeScript/optimized Next.js build, 15 frontend domain tests and 31 PostgreSQL/backend tests (46 total). New tests cover concurrent shared limits, 10 MiB chunk assembly, retry conflicts, upload ownership/expiry, local Netlify Blobs emulator storage and mocked AI configuration/consent/provider failures. They do not contact Google or OpenAI, and the emulator does not prove Netlify's hosted adapter behavior.

Local migration `0005_netlify_uploads_and_limits.sql` and repeatable fictional seed passed. The root release check currently fails because OPENAI_API_KEY and OPENAI_MODEL are absent. Google variables are present locally, but their validity and a hosted HTTPS callback remain unverified; do not fill those fields with fake credentials to make a check green.

Dependency audit: `npm audit --omit=dev` reported zero runtime vulnerabilities during this delivery. Full audit reported five high-severity dependency entries along the development lint chain (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`, GHSA-vfj7-8cjw-p6xm). Published `braces` latest was still 3.0.3; the suggested force fix would downgrade framework lint tooling to an incompatible older major. No forced downgrade was applied. Recheck the advisory and update compatible tooling when available; avoid feeding untrusted glob patterns to development tooling. This is an unresolved release finding, not five independent runtime flaws.

The Better Auth schema compatibility test passes but reports its existing `lastRequest` int8/type expectation warning. PostgreSQL stores the required millisecond timestamp without narrowing it; no destructive type change was made merely to hide the warning.

## Browser and deployment checks

Chromium guest checks passed for the refreshed homepage and assistant. Enter activated the booking quick guide and produced labelled guidance; the missing-provider state kept AI sending disabled. A homepage search for Dermatology + Karachi carried both filters into the directory and returned the single matching fictional profile. Phone-width checks at 390 px (assistant/directory) and 320 px (homepage/directory) showed no horizontal document overflow; focus styling and single-column layout were inspected. The temporary viewport override was reset. Authenticated uploads, full keyboard traversal, screen readers, Safari/Firefox and real Google journeys remain unverified.

`netlify build --offline` read the root configuration and successfully ran the optimized build. Without a linked site, that run did not demonstrate the hosted OpenNext adapter or deployment. The local Blobs emulator tests and offline build do not replace a hosted 10 MiB streaming download test. No deployment or external publication was performed.

`npm run release:check` stopped with the names of two missing variables only: `OPENAI_API_KEY`, `OPENAI_MODEL`. This preflight stops early; HTTPS and database checks must be rerun after configuration. No credential values were printed.

## Remaining product work

Google/AI accounts and hosting still need owner setup. Real Pakistani provider onboarding and permission to publish their details are not supplied. Messaging lifecycle/retention, cancellation/rescheduling, phone OTP, lab booking, payments/refunds, video, prescriptions, notification policies and clinical governance remain unresolved in [production expansion](requirements/production-expansion.md). No claim of complete Oladoc parity or a bug-free production system is made.

Validation commands:

```bash
npm run check:all
npm run db:check
npm run release:check
npm --prefix web audit --omit=dev
git diff --check
npm run package:netlify
```
