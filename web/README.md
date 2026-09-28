# PULSE web

The complete fictional-data frontend lives here. Read [the main README](../README.md), [delivery checklist](../docs/frontend-delivery.md), and [file-by-file learning guide](../docs/frontend-learning-guide.md).

```bash
npm ci
npm run dev
npm run check
npm run typecheck
```

Run checks in a second terminal while development runs. `npm run check` runs lint, compiles and executes 15 domain tests with Node's built-in test runner, and builds Next.js with type checking. Generated test output stays in ignored `.test-build/`.

To preview a production build: `npm run build`, then `npm run start -- --port 3001`. Open localhost:3001. No .env file, remote account, real password, database or connector is required.

The `/` route is the landing page. Feature screens live under `src/features/pulse/`; thin route files in `src/app/` compose them. `DemoProvider` preserves fictional records across client navigation. A reload ends the demo session and restores fixtures. There are no product APIs or real authentication in this delivery.
