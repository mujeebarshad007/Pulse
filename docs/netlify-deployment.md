# Deploy the Pulse fictional-data tester to Netlify

Updated 2026-10-03. This is a Next.js server application, not a static HTML export. The prepared folder is a **source package**. Netlify must build it with its Next.js adapter; dragging `.next` onto a static-site uploader will not create authentication, API routes or a database.

## What you need

1. A Netlify account/site and its HTTPS URL. No site has been published by this delivery.
2. Hosted PostgreSQL with a trusted TLS certificate. Prefer the provider's pooled connection endpoint, compatible with PostgreSQL transactions and advisory locks. Keep application and test databases separate.
3. A Google Cloud OAuth web client. Follow the consent-screen and tester setup in [the existing Google guide](deploy-tester.md). Use `https://YOUR-SITE.netlify.app/api/auth/callback/google` as the exact authorized redirect URI. Changing domains requires updating Google and `BETTER_AUTH_URL` together.
4. An OpenAI project API key and a Responses API model supporting strict JSON structured outputs. AI is optional for browsing/booking, but required to enable AI questions. Set a provider-side spending limit as well as the app limit.

Create secrets in the services' dashboards. Do not paste them into chat, Git, frontend variables, documentation or the source package.

## Build and host

From the original repository:

```bash
npm run check:all
npm run package:netlify
```

The command prints a new `artifacts/pulse-netlify-*` folder. It contains source, lockfile, migrations, documentation and `netlify.toml`; it excludes local credentials, database files, reports, dependencies and build output. Use that folder as the repository root when importing a private Git repository into Netlify. Publishing a repository is your own separate action; this command does not push anything.

Netlify settings are already in `netlify.toml`: base `web`, build `npm run build`, publish `.next`, Node 22. Netlify automatically installs the Next.js adapter. Do not configure a static catch-all redirect or pin a second legacy Next plugin.

Alternatively, from the package root, after installing dependencies, use the official Netlify CLI to link your own site, then `netlify build` and `netlify deploy --build`. Review the draft URL before choosing a production deployment. These commands require your account and may create billable resources; none have been run to publish this project.

## Private environment configuration

Set these in Netlify's environment dashboard for the application functions; configuration needed at build time must also be available to builds. Avoid sharing production credentials with untrusted branch previews.

| Variable | Value/purpose |
| --- | --- |
| `APP_MODE` | `connected` (also the default); never `demo` for connected testing |
| `DATABASE_URL` | Hosted PostgreSQL URL with `sslmode=verify-full`; never disable certificate validation |
| `DATABASE_POOL_MAX` | Start with `3` per function instance; tune against your provider's connection budget |
| `BETTER_AUTH_URL` | Exact HTTPS site origin, without `/api` |
| `BETTER_AUTH_SECRET` | Privately generated random secret of at least 32 characters |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | The Google web client's credentials |
| `REPORT_STORAGE` | `netlify`; local filesystem storage is rejected when `NETLIFY` is set |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Server-only provider key and structured-output-compatible model ID |
| `AI_DAILY_REQUEST_LIMIT` | Defaults to `100` across the app per UTC day; permitted range 1–10000 |

Netlify supplies Blobs runtime credentials. Do not invent or expose a Blobs token in client code. Hosted environments should not set `PRIVATE_STORAGE_DIR`.

Run migrations **before inviting users**, from a trusted machine with the hosted database variable set privately. Back up an existing database before upgrading it. Do not run migrations automatically on every preview build.

```bash
npm run setup
npm run db:migrate
npm run db:seed
npm run db:check
npm run release:check
```

`release:check` verifies required configuration and new schema, not live service behavior. It deliberately fails until Google, AI and hosted HTTPS settings exist. The local `.env.local` connection is not a hosted database; use an isolated copy/package and the intended environment. Provision staff with `npm run staff -- --help`, following [the owner guide](deploy-tester.md). Never grant staff access from browser input.

## File storage and limits

Netlify has a 6 MB buffered function payload limit. Pulse preserves its 10 MiB PDF allowance by sending at most five 2 MiB pieces through authenticated, same-origin routes. PostgreSQL temporarily holds pieces for a 15-minute upload session (expired bytes remain until cleanup). Finalization validates the assembled PDF and saves it to the private `pulse-private-reports` Blobs store; PostgreSQL stores ownership and SHA-256 metadata. Downloads authenticate before reading bytes and stream the verified PDF as an attachment.

Limits: three unfinished uploads per lab, 20 new upload sessions per lab/hour. Retrying an identical piece is safe; changing it is rejected. Finalizing twice returns the same report. Expired staging is cleaned when the next upload starts; no scheduled janitor is supplied. A process crash between blob write and database commit can leave an orphan blob; reconciliation remains an operational task.

Existing local-disk reports are **not automatically migrated** to Blobs. Start this fictional tester with fresh reports or retain the old disk deployment until a deliberate migration is tested. Do not expose report objects through public asset URLs. Use separate Netlify sites/stores and databases for production versus untrusted previews: site-wide stores are shared between a site's deploys.

## Before sharing the link

- Sign in with separate patient and staff Google test accounts. Confirm sign-out, denied staff access and correct role assignment.
- Patient completes a fictional profile → requests a slot → assigned doctor confirms → patient sees the update.
- Lab uploads a trusted fictional 10 MiB PDF → recipient downloads it → another patient and lab are denied. Verify this on the hosted adapter, including streaming and persistence across a new deployment.
- Ask a directory question after explicitly consenting to send it to OpenAI; verify real matches, no clinical advice, timeout feedback and rate limits. Questions and public directory fields are transmitted; no private records are read by the assistant. `store:false` is not a promise of zero provider retention—review the provider's current data terms.
- Exercise phone layout and keyboard navigation. Check host logs without exposing personal records or secrets.
- Back up database **and** Blobs; demonstrate restoration before accepting meaningful data. Configure service alerts and spending limits.

Share the HTTPS site URL, not `localhost`. Invite fictional-data testers first. This package does not establish real-provider verification, clinical governance, payments, video consultations, messaging policies, malware scanning, retention or a production recovery service.

Official references: [Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [function limits](https://docs.netlify.com/build/functions/configuration/), [Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
