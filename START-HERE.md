# Deploy Pulse: start here

Pulse is a connected fictional-data tester with doctor discovery/appointments, lab-test bookings, private PDF reports, a sourced library and a bounded condition-education assistant. It is not accepted for real patient care or complete Oladoc feature parity.

## What this folder is

This is the complete application **source**, ready for a Netlify build after configuration. It is not a static drag-and-drop website. Google login, database writes and private downloads execute on servers. Your local database and secrets are deliberately excluded.

## Deployment order

1. Create your Netlify site and a hosted PostgreSQL database. Import this folder through a private Git repository, or use the Netlify CLI described in [the deployment guide](docs/netlify-deployment.md). Do not upload only `web/.next`.
2. Keep the supplied `netlify.toml`: base `web`, build `npm run build`, publish `.next`, Node 22. Netlify supplies the Next.js adapter.
3. Copy the site's stable HTTPS origin into `BETTER_AUTH_URL`. Configure the server environment variables listed below in Netlify, never in source code.
4. Create a Google OAuth **Web application** client. Its exact redirect URI is `https://YOUR-SITE.netlify.app/api/auth/callback/google`. Add invited Google test accounts while the consent app is in testing. Follow [Google setup and login recovery](docs/login-recovery.md).
5. From this package on a trusted machine, install dependencies and migrate the **hosted** database using the commands below. Set variables privately in your shell or an ignored `web/.env.local`; do not accidentally use the original app's local database. Back up any existing database before migrating.
6. Run the preflight. Fix the named missing settings; never use dummy secrets to make it pass. Rebuild/deploy after configuration. Review the draft deployment before promoting it.
7. Run the hosted tester checklist in [the deployment guide](docs/netlify-deployment.md). Share the HTTPS URL only after it passes. A successful build alone does not test Google, private storage or AI.

## Settings you must provide privately

| Setting | Purpose |
| --- | --- |
| `APP_MODE=connected` | Connected accounts and database |
| `DATABASE_URL` | Hosted PostgreSQL; certificate validation enabled (`sslmode=verify-full`) |
| `DATABASE_POOL_MAX=3` | Initial connection budget per function instance |
| `BETTER_AUTH_URL` | Stable HTTPS site origin |
| `BETTER_AUTH_SECRET` | A privately generated random secret, at least 32 characters |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Matching real Google web-client credentials |
| `REPORT_STORAGE=netlify` | Private Netlify Blobs storage |
| `AI_PROVIDER=gemini` | Select Google Gemini (or `openai` for the existing alternative) |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Gemini server key/model; use the matching OpenAI variables only if that provider is selected |
| `AI_DAILY_REQUEST_LIMIT=100` | App-wide daily AI request allowance; also set provider spending limits |

Make settings available to application functions and, where needed, builds. Do not give production credentials to untrusted previews. Netlify supplies its own Blobs runtime credentials. No real credentials are included in this package.

## Commands from this folder

```bash
npm run setup
npm run db:migrate
npm run db:seed
npm run db:check
npm run auth:check
npm run release:check
npm run build
```

`db:seed` adds fictional doctors, never real healthcare partners. The lab catalog starts empty: a lab tester signs in, the owner grants its role, and that lab creates clearly fictional offerings and slots. See [the complete lab journey](docs/labs-and-education-guide.md). Staff roles cannot be self-selected in the browser.

Developer validation, requiring local PostgreSQL server tools for isolated tests:

```bash
npm run check:all
npm --prefix web audit --omit=dev
```

## Before you call this production

Live Google sign-in, hosted report persistence/downloads, real AI responses and separate patient/staff journeys still require hosted validation. Real provider permissions, approved clinical content, retention/deletion policies, malware handling, backups/restore, monitoring and security review remain separate acceptance work. Payments, messaging, video consultations, prescriptions and native mobile apps are not included.

For current evidence and known findings, read [release readiness](docs/release-readiness.md). For learning, trace one lab booking from `web/src/features/pulse/labs-page.tsx` to `web/src/app/api/labs/route.ts`, then `web/src/server/labs.ts` and migration `0006_lab_bookings.sql`. Explain why both the interface and database must reject an occupied slot.

Gemini setup and privacy: [guide](docs/gemini-setup.md). Real-user rollout requires the [onboarding decisions and implementation](docs/real-user-onboarding.md), not merely removing fictional labels.
