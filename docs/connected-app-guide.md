# Learn the connected Pulse app

Follow one booking: the page asks the provider to save a command; the provider sends it to the server; the server checks the session, derives the role, validates the input and calls the booking service; PostgreSQL enforces capacity; the browser reloads its authorized data.

## File responsibilities

| File | Responsibility |
|---|---|
| `web/src/app/layout.tsx` | Connected mode by default; `APP_MODE=demo` explicitly preserves the prototype. |
| `web/src/features/pulse/provider.tsx` | Fetches authorized data, sends commands, refreshes every 15 seconds while visible and handles sign-out/errors. |
| `web/src/features/pulse/auth-client.ts` | Maintained browser authentication client. |
| `web/src/features/pulse/google-entry.tsx` | Google entry UI and missing-configuration state. |
| `web/src/features/pulse/public-pages.tsx` | Public landing page and direct links to existing account features, with clear role requirements. |
| `web/src/app/account/page.tsx` | Redirects to the workspace for the server-provided role. |
| `web/src/components/pulse/shell.tsx` | Navigation, loading, notices, sign-out and presentation gates; server authorization still applies. |
| `web/src/features/pulse/patient-pages.tsx` | Directory/profile/booking forms, actual dates and patient reference for report matching. |
| `web/src/features/pulse/doctor-pages.tsx` | Doctor profile and future 30-minute slot forms. |
| `web/src/features/pulse/appointments.tsx` | Appointment lists and reviewed status changes. |
| `web/src/features/pulse/content-pages.tsx` | Library, drafts and publication forms. |
| `web/src/features/pulse/report-pages.tsx` | Metadata lists and authenticated downloads; legacy text reports remain demo-only. |
| `web/src/features/pulse/private-upload.tsx` | Exact patient-reference match, recipient review and PDF upload. |
| `web/src/features/pulse/journey.tsx` | Features & workspaces directory, missing-Google explanation and multi-account testing guide; connected mode cannot switch personas. |
| `web/src/server/auth.ts` | Google/Better Auth configuration and session-to-member mapping. Secrets stay server-side. |
| `web/src/server/input.ts` | Runtime Zod schemas; TypeScript alone cannot validate hostile HTTP input. |
| `web/src/server/workspace.ts` | Validated commands and minimal authorized snapshots. |
| `web/src/server/appointments.ts` | Slot ownership, transactions and lifecycle; database constraints resolve competing writes. |
| `web/src/server/reports.ts` | PDF limits/signature, private paths/permissions, metadata, ownership, integrity and failure cleanup. |
| `web/src/server/http.ts` | Same-origin checks, bounded request reads, safe errors and no-cache headers. |
| `web/src/server/database.ts` | Bounded pool, verified remote TLS and same-connection transactions. |
| `web/src/server/seed.ts` | Repeatable fictional Pakistani directory, future slots and sourced library. |
| `web/src/app/api/auth/[...all]/route.ts` | Delegates authentication to Better Auth. |
| `web/src/app/api/workspace/route.ts` | GET permitted state; POST authenticated commands. |
| `web/src/app/api/patients/lookup/route.ts` | Lab-only exact reference lookup returning only ID/name. |
| `web/src/app/api/reports/route.ts` | Bounded authenticated multipart upload. |
| `web/src/app/api/reports/[id]/route.ts` | Checks ownership again before returning a PDF attachment. |
| `web/src/app/api/health/route.ts` | Minimal database/schema availability without connection details. |
| `web/database/migrations/0003_accounts_profiles_content.sql` | Auth/member/profile/content/report tables and profile foreign keys. |
| `web/database/migrations/0004_pulse_fixture_brand.sql` | Corrects original fictional clinic branding while preserving tester edits. |
| `web/scripts/manage-app.mjs` | Operator seed/staff commands. Role changes revoke sessions and send no messages. |
| `web/scripts/start.mjs` | Copies public assets into the standalone build and starts its server with runtime configuration. |
| `web/tests/backend/fixtures.ts` | Synthetic accounts/profiles in isolated integration tests. |
| `web/tests/backend/connected.test.ts` | Session, permission, report, publication, seed and HTTP-boundary outcome tests. |
| `web/next.config.ts` | Standalone packaging, response headers and private-input tracing exclusions. |
| `web/Dockerfile`, `web/.dockerignore` | Non-root container recipe with secrets/local data excluded. |
| `web/.env.example` | Placeholder configuration names; real values belong in ignored local files or host secrets. |

Root/web package scripts expose setup, migrations, seed, staff assignment and checks. The lockfile pins Better Auth and Zod. These add maintained OAuth/session handling and runtime validation without introducing another backend framework or state library.

## Learn one slice at a time

1. Trace `DoctorDetail` → provider `run` → API → `executeCommand` → `requestAppointment` → SQL constraints. Explain what happens when two browsers request the same slot.
2. Trace a private PDF download. Explain why hiding a link is insufficient and why changing its URL still requires an ownership check.
3. Compare demo mode with connected mode. Explain why switching a browser persona cannot grant database access.

Predict one result, then run `npm run check:all` and inspect the relevant test. Learn the data flow before memorizing individual lines.
