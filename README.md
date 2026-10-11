# Pulse

**Care, with clarity.** A responsive healthcare web app for testing doctor discovery, appointments, private fictional PDF reports and sourced health information.

Connected implementation: Next.js, TypeScript, PostgreSQL and Better Auth with Google sign-in. Pakistani providers are **fictional**. Google settings are present locally but live OAuth and hosted deployment are unverified; this is not a live real-patient service.

## Run locally

Google returning to login? Start with [login recovery](docs/login-recovery.md) and `npm run auth:check`. Google configuration syntax passed on 2026-10-08; a live Google sign-in is still unverified. Earlier placeholder findings are historical.

Use Node 22 and PostgreSQL server tools. From the repository root:

```bash
npm run setup
npm run db:local:start
npm run db:migrate
npm run db:seed
npm run dev
```

On a new machine, put the database URL printed by `db:local:start` in ignored `web/.env.local` before migrating. This workspace already has that local connection.

Open [localhost:3000](http://localhost:3000). The fictional directory and library work before Google is configured. Follow [Google and hosting setup](docs/deploy-tester.md) to enable sign-in and share a hosted link.

## Implemented

- Lab-test search and lab-managed visits: requests, confirmation/decline, cancellation, expiry, completion, saved prices and private report links.
- Sourced condition education (high blood pressure and atopic eczema), with clinician navigation. No diagnosis or test recommendations.

See [lab and education delivery/learning guide](docs/labs-and-education-guide.md).

- Original glass homepage, self-hosted Manrope typography, animated heart, optional click sounds and motion controls. See [motion and sound learning guide](docs/motion-and-sound.md).
- Google authentication integration, server sessions, sign-out and owner-assigned staff roles.
- Saved patient/doctor profiles, fictional Pakistani directory and combined search filters.
- Saved slots and bookings, overlap protection, doctor confirmation/decline/completion.
- Refresh after changes, on focus and every 15 seconds while visible.
- Private PDFs up to 10 MB, exact patient-reference matching, recipient review and authorized downloads.
- Saved sourced health-library drafts/publication.
- Migrations, repeatable seeds, automated tests, CI and a Docker/standalone deployment recipe.

The original cream/sage glass design is restored across the homepage and workspaces, with animated heart, floating care cards and reduced-motion support. `/assistant` supplies public quick guides and an authenticated Gemini/OpenAI directory, booking and bounded condition-education integration, with explicit consent and shared request limits. AI requires owner configuration; it does not diagnose or access private records.

For Netlify, private reports use authenticated chunked uploads and a Netlify Blobs adapter. Local/standalone storage still requires a durable disk. File signature checks are not malware scanning; only fictional test documents are supported. Payments, prescriptions, video consultations, messaging, notifications and native mobile apps remain outside the implemented tester.

## Netlify source package

Netlify now defaults to AI off (`AI_PROVIDER=none`) and validates hosted configuration/database tables before building. No Gemini key is needed. Read [deployment hardening and validation](docs/deployment-hardening.md).

Start with [the single deployment checklist](START-HERE.md).

```bash
npm run package:netlify
```

This produces a clean `artifacts/pulse-netlify-*` source folder with `netlify.toml`. A server-backed Next.js app needs a Netlify build, hosted PostgreSQL and private Google configuration; AI is optional. It is not a static drag-and-drop export. Follow [Netlify setup and sharing](docs/netlify-deployment.md), [this delivery's file guide](docs/netlify-learning-guide.md) and [release evidence](docs/release-readiness.md). No live service has been deployed.

Gemini key setup: [private configuration guide](docs/gemini-setup.md). Real users: [account creation and production onboarding plan](docs/real-user-onboarding.md).

## Validate and learn

```bash
npm run check:all
npm run db:check
git diff --check
```

[Connected file guide and exercises](docs/connected-app-guide.md) · [Current status and limits](docs/tester-mvp.md) · [Frontend guide](docs/frontend-learning-guide.md) · [Security](SECURITY.md)

The old memory-only prototype is explicitly available with `APP_MODE=demo` before starting/building. Connected mode is the default and never accepts a browser persona as authentication. No credentials, real patient records, commits, pushes or public deployments were created in this delivery.
