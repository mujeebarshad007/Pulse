# Learn this delivery by following the data

Read [current delivery status](tester-mvp.md), then [deployment steps](netlify-deployment.md). The existing [frontend guide](frontend-learning-guide.md) and [connected app guide](connected-app-guide.md) cover the earlier app. This guide covers the new files and changed responsibilities.

## The three complete paths

**Search:** the homepage collects a name/specialty and city → URL query parameters → the doctors route → Directory's initial filters → current public profiles. URLs make searches shareable. Search is independent of AI.

**Ask Pulse:** browser consent and question → same-origin API → server session → PostgreSQL rate limits → OpenAI receives only the question and public directory → a strict intent/ID response → server verifies IDs and supplies fixed guidance → React displays plain text and internal links. It cannot book or access patient reports. A quick guide is local text, clearly distinguished from AI.

**Upload:** lab selects a PDF and reviews the recipient → authenticated upload session → bounded pieces → transaction assembles and validates content → private storage → report metadata → patient's authenticated download. Browser controls improve usability; server checks provide authorization. An HTTP request can bypass a disabled button, so authorization cannot live only in React.

## File responsibilities

| File/group | Why it exists |
| --- | --- |
| `web/src/features/pulse/landing.tsx` | Homepage, working search, feature/workspace links and CSS/SVG care illustration |
| `web/src/features/pulse/next-ui.css` | Sage/cream design, glass surfaces, responsive layout, short entrance/scroll animation and reduced-motion/transparency fallbacks |
| `web/src/app/page.tsx`, `layout.tsx` | Route entry and shared style inclusion |
| `web/src/app/(product)/doctors/page.tsx`, `public-pages.tsx` | Parse query parameters and initialize existing combined search filters; old homepage moved out |
| `web/src/components/pulse/shell.tsx`, `journey.tsx` | Assistant navigation and visible access requirements for every workspace |
| `web/src/features/pulse/assistant-page.tsx`, `app/(product)/assistant/page.tsx` | Chat-style UI, consent, quick guides, progress/errors and in-memory conversation; no browser persistence |
| `web/src/app/api/assistant/route.ts` | Configuration status and authenticated, bounded request boundary |
| `web/src/server/assistant.ts` | Provider call, strict response validation, public-data restriction and fixed safe navigation responses |
| `web/src/server/rate-limit.ts` | Transactional shared limits, so different server instances use one budget |
| `web/src/server/errors.ts`, `http.ts` | Consistent 429/error responses without leaking provider/SQL details |
| `web/src/server/blob-storage.ts`, `reports.ts` | Private Netlify/local storage adapter, ownership checks, metadata and integrity verification |
| `web/src/server/report-uploads.ts` | Lab-only staging, exact part sizes, retry safety, expiration and idempotent finalization |
| `web/src/app/api/report-uploads/**` | HTTP routes for starting, sending pieces and finishing an upload |
| `web/src/app/api/reports/[id]/route.ts` | Authorized streaming attachment response |
| `web/src/features/pulse/private-upload.tsx`, `patient-pages.tsx` | Chunk progress/retry UI and connected upload presentation |
| `web/src/server/auth.ts`, `features/pulse/provider.tsx` | Reject placeholder OAuth configuration and clear stale sign-in readiness on refresh failure |
| `web/database/migrations/0005_netlify_uploads_and_limits.sql` | Persistent upload sessions, pieces, report storage driver and request counters |
| `web/tests/backend/netlify-assistant.test.ts` | Integration tests with real isolated PostgreSQL, local Blobs emulator and mocked AI; no paid provider calls |
| `netlify.toml` | Hosting build settings for the single Next.js application |
| `scripts/package-netlify.mjs` | Allowlisted source packaging; secrets/local state never belong in deployment source |
| `web/scripts/release-check.mjs` | Missing configuration/schema detection; deliberately not a production certification |
| Root/web `package.json`, web lockfile | Commands, Node requirement and the one new runtime dependency (`@netlify/blobs`) |
| `.gitignore`, `web/.gitignore`, `.env.example` | Exclude generated/private files and describe required variable names using placeholders |
| README, SECURITY and affected `docs/**` | Keep operational limits and learning instructions aligned with implementation |

No Redux, animation runtime or AI SDK was necessary for these paths. React state, CSS and server-side `fetch` cover the current scope. PostgreSQL is durable application state; React state is temporary UI state.

## Exercise: explain before changing

Run `npm run check:all`. Open `/assistant`, activate “How do I book a visit?” using Tab/Enter, and explain why this works with no AI key. Then find the exact server check preventing an anonymous caller from sending an AI request. Follow the test that removes an invented doctor ID from a mocked provider result.

Next, change only one quick-guide sentence and its explanation. Verify the screen, run `npm run check`, and explain which files did **not** need to change. Finally, inspect the upload retry test: explain why the same part is accepted twice but different bytes with the same part number are rejected. Understanding those boundaries is more valuable than memorizing each line.


## Login recovery update

For the subsequent Google-login repair, see [login recovery](login-recovery.md): it explains configuration validation, callback messages, session boundaries, retry behavior and the added tests.
