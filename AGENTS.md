# Working on Big Pulse

Read README.md and docs/tester-mvp.md first. The current deliverable is a connected fictional-data tester app, not the accepted real-patient production MVP. docs/frontend-delivery.md records the historical frontend prototype. Follow the frozen product scope and architecture. The owner prefers building a bounded slice, then learning its data flow and file responsibilities.

- Explain significant changes before implementation. Only implement the requested task; preserve unrelated work.
- Do not convert prototype proposals into approved business rules. Ask for unresolved production policies before dependent backend work.
- Keep the single Next.js app and minimal dependencies. Read web/AGENTS.md and installed framework docs before framework changes.
- All demo data must be fictional. Never add real credentials, patient records, server secrets or claimed medical verification.
- Client personas and selectors are demonstrative, never real authentication/authorization. Do not persist report content in browser storage.
- Synchronize affected docs and provide runnable validation commands plus a short learning exercise.
- From the repository root: npm run check. UI changes also require browser/keyboard/narrow-screen checks. Record actual results and limitations.
- No unsolicited commit, push, deployment, marketing publication, or external messages.
