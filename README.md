# Big Pulse

**Care, with clarity.** A responsive healthcare frontend with professional glass surfaces and complete, connected demo journeys.

Current delivery: **frontend MVP demo**. Patient, doctor, laboratory and content workspaces share fictional records during one browser session. Real authentication, backend persistence and private medical storage are the next phase. Refreshing resets the demo.

**Backend progress:** PostgreSQL infrastructure and internal scheduling/appointment services now exist, with database-enforced overlap protection and 14 integration tests. Account/profile/content/report persistence and frontend integration are still pending. Read [the backend checkpoint](docs/backend-foundation.md) and [the tester MVP plan](docs/tester-mvp.md) before running database commands.

## Run

Use Node 22 (at least 22.6) and npm. From this folder:

```bash
npm run setup
npm run dev
```

Open [localhost:3000](http://localhost:3000) and choose **Explore patient demo**. The **Demo controls** menu switches roles. **Follow the journey** connects the full workflows. No secrets or accounts are needed. If dependencies already exist, run only `npm run dev`.

## What works in the demo

- Landing page, account-entry forms, patient onboarding and profile editing.
- Combined doctor search, details, sample availability, booking review and confirmation.
- Doctor profile creation/editing, availability and shared appointment lifecycle.
- Laboratory report preparation, recipient review, patient search and text report viewing.
- Disease-information library and create/edit/draft/publish frontend.
- Guided cross-role walkthrough, validation, empty/error/loading previews, reduced glass and responsive layouts.

[Delivery checklist and remaining boundaries](docs/frontend-delivery.md) · [Start learning here](docs/frontend-learning-guide.md) · [Future prompts](docs/prompt-pack.md)

## Validate

```bash
npm run check       # ESLint, 15 domain tests, TypeScript/production build
npm run typecheck   # optional separate type check
npm run test:backend # requires local PostgreSQL server tools; owns a fresh test database
```

To serve the production build locally after `npm run build`, stop the dev server and run `npm run start`. The GitHub Actions workflow runs checks; it does not deploy. CI is configured locally and has not been executed on GitHub.

## Repository map

```text
web/src/app/               URL routes and shared layouts
web/src/features/pulse/    Product screens, demo state and rules
web/src/components/        Reusable UI and workspace shell
web/tests/                 Outcome-focused domain tests
docs/requirements/        Scope and unresolved production policies
docs/architecture/        Current and planned boundaries
docs/frontend-*.md        Delivery report and build-then-learn guide
.github/                  CI and PR template
```

Stack: Next.js, React, TypeScript and CSS/Tailwind. Backend infrastructure uses PostgreSQL, `pg` and `server-only`. NestJS, Redux and GSAP remain deferred. The original design comparisons are preserved at `/design-preview`; shared controls at `/design-system`.

The app is locally runnable and builds for a Next.js host. No live deployment, GitHub push, real accounts, or healthcare-service launch is claimed. No license has yet been chosen. See [contributing](CONTRIBUTING.md) and [security](SECURITY.md).
