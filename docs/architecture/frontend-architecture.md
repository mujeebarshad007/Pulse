# Frontend architecture

Status: frontend demo implemented, updated 2026-09-28. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. Prototype rules are recorded separately in [frontend delivery](../frontend-delivery.md); production policy questions remain open.

## Current implementation

One Next.js App Router application lives in `web/`. The root route renders the landing page. Thin route files compose feature modules for patient, doctor, laboratory and content workspaces. The `(product)` route-group layout shares navigation, notices and demo controls. Dynamic route params are awaited; record-specific forms are keyed so state cannot accidentally follow a different record.

`features/pulse/model.ts` holds fictional fixtures, typed records, selectors and pure demo command validation. `provider.tsx` shares these records and the selected persona through React context. Local form/filter/dialog state stays in feature components. All records reset on a reload; they persist across client navigation and persona changes solely to demonstrate connected journeys. No product API, durable session or browser persistence is implemented.

Shared workspace components live in `components/pulse/`; generic buttons, fields, badges and local SVG icons live in `components/ui/`. Product styling is in `features/pulse/pulse.css`, supported by existing `app/globals.css`. The Air direction provides readable glass surfaces and responsive layouts. Native controls and dialogs are used without another dependency. shadcn/ui remains optional/uninstalled; Redux and GSAP remain deferred.

`/design-preview` preserves the original three visual samples. `/design-system` retains the control reference. `/journey` is a guided demo presentation aid requested with this frontend delivery, not a new healthcare capability. [The learning guide](../frontend-learning-guide.md) maps every file and traces data flow.

## State and rendering boundaries

Route wrappers are Server Components; interactive feature screens are Client Components. The root provider enables continuity in this prototype, which intentionally bundles fictional records. Production must use server-selected, authorized projections rather than shipping a complete multi-user data store. Keep local interactivity small when moving actual records to server data loading.

| UI area | Requirement references |
|---|---|
| Account entry / session presentation | AUTH-001–AUTH-003 |
| Patient profile and records | USER-001 |
| Doctor profiles, search, availability | DOC-001–DOC-002; SEARCH-001; SCHED-001 |
| Physical booking / doctor management | APPT-001 physical; APPT-002 |
| Lab preparation / intended-patient report access | LAB-003–LAB-004 |
| Disease maintenance / browsing | DISEASE-001–DISEASE-002 |

## Future real-data integration

Server-rendered pages should call server-side services directly. Server actions or route handlers must use the same authoritative authentication, resource permission and runtime validation layer. UI checks provide feedback only. Replace the demo provider/persona switcher rather than treating it as a security implementation.

Do not place sensitive patient/search/report data in URLs, persistent browser storage or global cross-account caches. After real logout or identity change, clear private state and recheck server identity. Protected responses need a deliberate private caching strategy. Booking conflicts require database integrity under concurrency, not merely frontend slot filtering.

## Validation and accessibility

`npm run check` from the root runs ESLint, 15 pure domain tests and the optimized build with type checking. `npm run typecheck` runs the type check separately. Browser tests are currently manual; [delivery evidence](../frontend-delivery.md) distinguishes completed checks and pending checks.

UI foundations include semantic controls, labels, native modal focus behavior, status text, form errors, a skip link, responsive layout and reduced-glass/contrast fallbacks. These are not a WCAG certification or a measured performance guarantee. Complete the recorded mobile, browser and keyboard matrix before accepting the public demo; production quality targets remain Q-021/Q-023.
