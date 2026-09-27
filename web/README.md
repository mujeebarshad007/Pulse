# PULSE frontend

Next.js App Router + TypeScript + Tailwind. The current application is a **design comparison**, not the full product frontend.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run start -- --port 3001
```

Development runs on port 3000; the last command serves the production build on port 3001. Run one server command at a time in a terminal. No secrets or database are required.

## Code map

- `src/app/page.tsx`: root design studio route.
- `src/app/layout.tsx`: common document and metadata.
- `src/app/globals.css`: shared control styling and design catalog layout.
- `src/app/design-system/page.tsx`: reusable controls reference.
- `src/components/ui/`: button, badge, field and local SVG icons.
- `src/features/design-preview/`: interactive visual samples, fictional fixtures and theme/layout CSS.

Read [the file-by-file walkthrough](../docs/frontend-design-review.md) and [future prompts](../docs/prompt-pack.md). No authentication, API, database, private file storage or automated application tests have been implemented. Preview state is kept in memory only.
