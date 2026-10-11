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

**Latest repair supersedes earlier Google readiness assumptions:** `GOOGLE_CLIENT_SECRET` contains placeholder text. `auth:check` now detects it; `release:check` stops for `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY` and `OPENAI_MODEL`. No credential values were printed or changed. Port 3000 is the configured OAuth origin; the second local development server on port 3001 is not an authorized substitute.

After the repair, `npm run check:all` passed lint, optimized build, 16 frontend/domain tests and 33 backend tests (49 total). Added tests verify placeholder/URL rejection, local production OAuth cookie attributes, callback error routing and safe error messages. They do not prove a live Google token exchange. See [recovery steps](login-recovery.md).

`npm run check:all` passed: ESLint, TypeScript/optimized Next.js build, 15 frontend domain tests and 31 PostgreSQL/backend tests (46 total). New tests cover concurrent shared limits, 10 MiB chunk assembly, retry conflicts, upload ownership/expiry, local Netlify Blobs emulator storage and mocked AI configuration/consent/provider failures. They do not contact Google or OpenAI, and the emulator does not prove Netlify's hosted adapter behavior.

Local migration `0005_netlify_uploads_and_limits.sql` and repeatable fictional seed passed. The root release check currently fails because OPENAI_API_KEY and OPENAI_MODEL are absent. Google variables are present locally, but their validity and a hosted HTTPS callback remain unverified; do not fill those fields with fake credentials to make a check green.

Dependency audit: `npm audit --omit=dev` reported zero runtime vulnerabilities during this delivery. Full audit reported five high-severity dependency entries along the development lint chain (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`, GHSA-vfj7-8cjw-p6xm). Published `braces` latest was still 3.0.3; the suggested force fix would downgrade framework lint tooling to an incompatible older major. No forced downgrade was applied. Recheck the advisory and update compatible tooling when available; avoid feeding untrusted glob patterns to development tooling. This is an unresolved release finding, not five independent runtime flaws.

The Better Auth schema compatibility test passes but reports its existing `lastRequest` int8/type expectation warning. PostgreSQL stores the required millisecond timestamp without narrowing it; no destructive type change was made merely to hide the warning.

## Browser and deployment checks

Chromium guest checks passed for the refreshed homepage and assistant. Enter activated the booking quick guide and produced labelled guidance; the missing-provider state kept AI sending disabled. A homepage search for Dermatology + Karachi carried both filters into the directory and returned the single matching fictional profile. Phone-width checks at 390 px (assistant/directory) and 320 px (homepage/directory) showed no horizontal document overflow; focus styling and single-column layout were inspected. The temporary viewport override was reset. Authenticated uploads, full keyboard traversal, screen readers, Safari/Firefox and real Google journeys remain unverified.

`netlify build --offline` read the root configuration and successfully ran the optimized build. Without a linked site, that run did not demonstrate the hosted OpenNext adapter or deployment. The local Blobs emulator tests and offline build do not replace a hosted 10 MiB streaming download test. No deployment or external publication was performed.

`npm run release:check` stopped with the names of two missing variables only: `OPENAI_API_KEY`, `OPENAI_MODEL`. This preflight stops early; HTTPS and database checks must be rerun after configuration. No credential values were printed.

## Remaining product work

Google/AI accounts and hosting still need owner setup. Real Pakistani provider onboarding and permission to publish their details are not supplied. Messaging lifecycle/retention, doctor cancellation/rescheduling, phone OTP, payments/refunds, video, prescriptions, notification policies and clinical governance remain unresolved in [production expansion](requirements/production-expansion.md). No claim of complete Oladoc parity or a bug-free production system is made.

Validation commands:

```bash
npm run check:all
npm run db:check
npm run release:check
npm --prefix web audit --omit=dev
git diff --check
npm run package:netlify
```


## Lab and education expansion — 2026-10-06

Lab catalog, slots, booking lifecycle, price snapshots and private report linkage are implemented under owner-approved rules. The assistant now supports bounded sourced condition education with explicit transmission consent. Earlier statements excluding all lab booking/condition education are historical. See [delivery, data flow and limitations](labs-and-education-guide.md). Google credentials, hosted services and real-patient readiness are not implied by this expansion.


Latest validation: `npm run db:check` passed and migration `0006_lab_bookings.sql` is applied locally. Browser checks passed for keyboard activation of sourced eczema education, clearing lab filters, and combined doctor fee/availability filtering (one matching provider, then five after reset). At 390 px, lab and doctor pages had no horizontal document overflow. Authenticated patient/lab browser journeys remain pending valid Google configuration; automated backend tests do not replace that acceptance.

Dependency patch: `source-map-js` was updated from 1.2.1 to 1.2.2 for [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). No dependency was added. The fresh runtime audit reports zero findings; the full audit still reports the five development lint-chain entries described above. Do not interpret this as a security certification.

Current release preflight stops for `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY` and `OPENAI_MODEL`. Earlier records listing only two missing variables are historical. No external deployment, real Google token exchange or live AI call has been verified.


## Deployment package validation — 2026-10-08

`npm run check:all` passed lint, optimized production build and all 58 tests (19 frontend/domain, 39 backend). `auth:check` now passes configuration syntax; this supersedes the earlier Google placeholder finding but does not verify a live token exchange. `release:check` currently stops for `OPENAI_API_KEY` and `OPENAI_MODEL`, so later hosted checks have not run. No Google or AI credentials were exposed or created.

`START-HERE.md` provides one deployment entry point and is included by the source packager. The package requires a Netlify build, hosted PostgreSQL and private settings, not static drag-and-drop hosting. No deployment was performed. The earlier browser evidence remains applicable to unchanged UI; hosted account/storage/AI acceptance remains outstanding.


Security maintenance on 2026-10-08: Next.js and its matching lint configuration were patched to 16.3.8; the transitive `sharp` package was updated to 0.35.5. Runtime audit then reported zero known vulnerabilities. The five existing development lint-chain findings remain. These are compatible updates, not a stack change. See [Next.js advisory](https://github.com/advisories/GHSA-3w37-wq28-93x7) and [sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w).


After these patches, `npm run check:all` again passed all 58 tests, lint and the production build. `npm run db:check` passed. The local production server returned 200 for home, doctors, labs, assistant, login, health and lab catalog; an unauthenticated lab write returned 401. This is local evidence, not a hosted deployment result.


## Motion and sound delivery — 2026-10-08

Homepage SVG heartbeat, shared interaction feedback and opt-in synthesized click sounds are implemented without new dependencies. `npm run check` passed lint, 19 frontend/domain tests and the production build. Keyboard, preference persistence, mobile overflow, search and native slot selection checks passed; physical audio output and other browsers remain unverified. See [motion and sound guide](motion-and-sound.md).


## Gemini and appointment hero — 2026-10-09

`npm run check:all` passed lint, optimized build and 63 tests (19 frontend/domain + 44 backend). Added Gemini tests cover header-only keys, public-data payloads, provider-bound consent, invalid model configuration, blocked/truncated/malformed responses, quota errors and sourced education. These use mocked responses, not a live Google API call.

Desktop browser inspection confirmed self-hosted Manrope loaded and the new appointment-first hero rendered. Enter submitted Dermatology + Karachi search and returned the expected single profile; the preview profile link opened the matching doctor page. At 390 and 320 px there was no horizontal document overflow and mobile input text was 16 px. Browser console had no warnings/errors in the tested journey. Device screenshots during viewport overrides were scaled inconsistently, so full phone visual acceptance remains a manual step.

The assistant shows Google Gemini consent, unpaid-service data terms and a disabled send action while setup is missing. The local provider/model are configured, but the key has not been supplied privately; no live Gemini answer is claimed. Refer to [Gemini setup](gemini-setup.md), [homepage learning guide](homepage-design.md) and [real-user onboarding](real-user-onboarding.md). No real records were added and no deployment was performed.


## Shared frontend redesign — 2026-10-09

The current appearance is navy/cobalt/white with lime navigation accents, shared component styling and responsive workspace navigation. This supersedes earlier cream/sage/glass appearance descriptions. See [frontend redesign, file guide, validation and limitations](frontend-redesign.md). No product or production policy changed.


## Original glass design restored — 2026-10-09

At the owner’s request, the navy/cobalt redesign and appointment-first hero were reverted. The original cream/sage glass surfaces, large animated heart, floating care cards and original workspace navigation are restored. Manrope, optional sound/motion controls, lab booking, assistant and connected functionality remain. No new product feature is inferred by this visual restoration. Historical experiment CSS is no longer imported.

Learning exercise: trace `HeartVisual` from `landing.tsx` into `heart-visual.tsx`, then find its motion rules in `motion.css`. Use the animation toggle to verify the interface remains usable. Validate with `npm run check`.

Restoration validation: `npm run check` passed (lint, 19 frontend/domain tests, production build); `git diff --check` passed. Browser confirmed original glass hero/heart, keyboard anchor navigation to search, and no horizontal overflow at 390 px. Authenticated flows were not rerun for this presentation-only rollback.
# Current evidence — 2026-10-10

Deployment hardening passed 66 tests, lint and production build. Neon connectivity, six applied migrations and required login/booking/report tables passed read-only checks. Built home/login/assistant/workspace routes returned 200. AI can explicitly be disabled; Netlify defaults to `AI_PROVIDER=none`. Hosted preflight still correctly rejects the local authentication origin. Read [current evidence and exact limitations](deployment-hardening.md); older release findings below are historical.
