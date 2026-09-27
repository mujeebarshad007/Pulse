# Frontend architecture

Status: Phase 1 foundation architecture, updated 2026-09-27. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. This design records the simplified stack for the current scaffold; unanswered business and security policies remain [NEEDS CLARIFICATION].

## Current frontend checkpoint

The root route now serves `features/design-preview/design-preview.tsx`, a Client Component for comparing three design directions with clearly fictional records. Its local state drives the chosen theme, sample section, local filter and native detail dialog. No API, session, browser persistence or role authorization exists. The `/design-system` Server Component presents basic reusable button, badge and labelled-field controls. `layout.tsx` provides shared HTML and metadata; global CSS holds common control styling. Sample-specific layout/material rules live with the feature.

The user asked for samples before completing the frontend. Air is a glassmorphism proposal, revised after feedback that the first version was too opaque; Nocturne and Studio are alternatives. Final selection is pending. See [the design checkpoint](../frontend-design-review.md) for file explanations and evidence. Current fixture interactions do not satisfy production requirement acceptance criteria.

The production direction remains one Next.js application. A chosen sample will inform real feature routes; the sample comparison component is not the production feature architecture.

## Future UI boundaries

Use Next.js App Router pages for journeys and small Client Components only where interaction is needed. Server-rendered pages should request data through server-side services rather than making an extra HTTP call to the application's own route handlers. Forms can use server actions or route handlers as appropriate to the approved flow; whichever is used must call the same authorization/business service and validate input.

| UI area | Source requirements |
|---|---|
| Account entry and session presentation | AUTH-001–AUTH-003 |
| Patient information | USER-001 |
| Doctor profiles, search and availability | DOC-001–DOC-002; SEARCH-001; SCHED-001 |
| Physical booking and doctor management | APPT-001 physical branch; APPT-002 |
| Lab upload and own-result access | LAB-003–LAB-004 |
| Disease maintenance and browsing | DISEASE-001–DISEASE-002 |

Use URL/local state for ordinary non-sensitive UI state. Avoid placing patient/search/report data in URLs, persistent browser storage or a shared Redux cache. Redux Toolkit and GSAP are deferred until a demonstrated need. Add individual shadcn/ui components for actual forms/dialogs later; do not install a whole library of unused components.

The pending visual direction prioritizes readable content with optional glass surfaces: high contrast, responsive layout, clear status/error messages, accessible labels and restrained motion. A later design pass should test keyboard navigation and supported devices under Q-023. Public browsing, role-specific navigation, form fields and search matching remain open questions and are not decided by the preview.

After logout or account change, clear private in-memory data and recheck server identity before showing protected content. Frontend checks help users, while server authorization remains authoritative. The first page can be statically built; protected future pages need a deliberately private caching strategy.

## Frontend validation

For this phase, run `npm run lint` and `npm run build` inside `web/`, then view the page at narrow and wide sizes. Later tests should cover forms, loading/empty/error states and cross-account cache safety. Do not claim these later tests exist yet.
