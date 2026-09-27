# PULSE — frontend design checkpoint

Updated 2026-09-27. Current delivery: **interactive design samples**, not the complete frontend or a production healthcare application. The user asked to see samples before the full frontend is built. Visual selection remains pending; the first Air sample was revised after feedback that the glass effect was too subtle.

## Where we are in your pasted plan

The earlier chat's “Phase 0 / Phase 1” labels described small coding steps, not your original numbered project plan. Use this mapping to avoid treating planning as implementation:

| Your phase | Actual state |
|---|---|
| 1–3: requirements, use-case validation, MVP freeze | Documents exist. Unanswered policy questions still block affected implementation. |
| 4: architecture | One Next.js application is the current documented direction. PostgreSQL and private report storage remain planned. |
| 5: database design | Not completed. |
| 6–7: repository / agent rules | Partial foundation in `web/`; framework-generated `web/AGENTS.md` exists. No separate API or completed repository-wide rules phase. |
| 8–12: persistence, backend, authentication, backend testing | Not implemented. |
| 13: frontend foundation | Runnable Next.js/TypeScript/Tailwind project; preview and design-system routes. Production frontend infrastructure is still partial. |
| 14: design system | In progress. Three interactive visual samples and basic reusable controls; final direction pending. |
| 15: frontend features | Not complete. Local preview interactions are not accepted product features. |
| 16–23: integration through deployment/documentation | Not complete. No live backend integration or deployment. |

The pasted `apps/web + apps/api` and NestJS instructions are an older alternative. Follow the existing one-app architecture unless explicitly revised. A frontend preview does not require completing a database first. Production booking and private report access do.

## Current sample boundary

- `/`: compare Air (light glass), Nocturne (dark glass), and Studio (crisp white) on the same fictional patient screen.
- Sidebar switches between overview, local fictional doctor filtering, a fictional appointment, fictional report metadata, and an unpopulated health library.
- Doctor, appointment and report detail dialogs are examples only. No real booking, account, lab values, uploads or downloads occur.
- All state exists in React memory and resets on reload. No API, cookies, local storage, patient database or role permissions are involved.
- `/design-system`: inspect palette, reusable button/badge/field examples and focus/error treatments. Reference buttons deliberately perform no domain action.
- No new runtime dependency, paid template, remote image, MCP installation or animation library was added.

The sample doctor's text filter is **not** SEARCH-001 implementation. It matches fixture name/specialty/clinic text, not the approved future specialization/symptom/location rules. Fixture names, qualifications, clinics and appointment status are visual proposals, not new requirements. No medical article content or clinical guidance is fabricated.

## Design direction and references

References reviewed:

- [Untitled UI application dashboard](https://www.untitledui.com/react/components/dashboards/dashboard-01): hierarchy, navigation, spacing and restrained controls.
- [Fragments components](https://www.usefragments.com/components): consistent component responsibilities and accessible interaction patterns.
- [Apple materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials): material hierarchy and the distinction between controls and content.
- [Apple's Liquid Glass introduction](https://developer.apple.com/videos/play/wwdc2025/219/): accessibility adaptations alongside transparency.

These are design references, not copied paid source code or a claim to implement Apple's native material renderer. Air uses CSS transparency, backdrop blur, bright borders, gradients and shadows. After feedback, its backdrop and panel transparency were made more visible. No “best UI”, scalability, performance or full accessibility certification is claimed.

A Reduce glass control removes backdrop blur and makes the major content surfaces solid. Reduced-motion, reduced-transparency and increased-contrast CSS preferences are included. They still require testing across the agreed browser/device matrix. There are no continuous animations. The app uses system fonts and local SVG icons to avoid remote font/image requests.

## Understand every source file changed in this checkpoint

| File | Abstract job | What to learn |
|---|---|---|
| `web/src/app/page.tsx` | The entry address `/`; puts the design preview on screen. | A route file chooses the screen. It should not hold every detail. |
| `web/src/app/layout.tsx` | Shared HTML wrapper and page metadata. | A layout surrounds pages; metadata describes the page in the browser. |
| `web/src/app/globals.css` | Shared colors, form/button styles, focus indicators and design catalog layout. | A visual rule is defined once, then reused. |
| `web/src/app/design-system/page.tsx` | Reference page assembling the reusable controls. | Component composition: small pieces create a complete screen. |
| `web/src/components/ui/button.tsx` | Standard button variants with normal HTML button properties. | Reuse appearance while letting each screen supply its action. |
| `web/src/components/ui/badge.tsx` | Short non-interactive status labels. | A visual label does not perform an action or grant a permission. |
| `web/src/components/ui/field.tsx` | Label, hint and error wrapper for an input. | Connect controls to readable labels and error descriptions. |
| `web/src/components/ui/icon.tsx` | A small local SVG icon vocabulary. | Decorative icons are hidden from assistive technology; button text supplies meaning. |
| `web/src/features/design-preview/sample-data.ts` | Clearly fictional doctor/report records and design names. | Separate data from the markup that displays it; types describe its shape. |
| `web/src/features/design-preview/design-preview.tsx` | Interactive sample composition, local state, filter and native detail dialog. | User action → state changes → React renders the updated screen. No server write occurs. |
| `web/src/features/design-preview/design-preview.css` | Sample-specific layout, themes, glass materials and responsive rules. | CSS variables change themes; media queries adapt the layout. |
| `docs/design-previews/*.png` | Captured browser screenshots for visual comparison. | A screenshot proves appearance at one size, not backend correctness. |

The preview component is intentionally a bounded design exploration. When a direction is chosen, separate real routed features by responsibility; do not turn this preview into an all-in-one production application. UI sample data must never become the production data source.

Other updated documents: root `README.md` and `web/README.md` explain how to run the current artifact; `frontend-architecture.md` describes the actual boundary; `delivery-roadmap.md` records phase mapping; `prompt-pack.md` supplies the design checkpoint and later prompts. This document holds the detailed learning walkthrough rather than adding a separate file for every screen.

Existing generated/configuration files were not rewritten for the design: `package.json` names commands/dependencies; `package-lock.json` pins the dependency tree; `tsconfig.json` configures type checking; ESLint config configures lint rules; PostCSS config connects Tailwind; Next config adjusts the framework; `next-env.d.ts` is generated type wiring; `.next/` is disposable generated build output; `node_modules/` holds installed packages; `.gitignore` excludes generated/private local files. These support the app but do not implement product behavior.

## A five-minute learning exercise

1. Open `sample-data.ts` and find the fictional doctor names.
2. Open `design-preview.tsx` and find `filteredDoctors`. The input changes `query`, then the array is filtered and rendered.
3. Open `design-preview.css` and find `--accent`. That one value influences multiple controls.
4. Predict which parts of the screen would change if a fictional doctor specialty changed. Then edit one fictional specialty and check the result.
5. Reload: theme/filter state resets because it is only in memory. Explain why this cannot replace a database or authentication.

## Validation

Run from `web/`:

```bash
npm run lint
npm run build
npm run dev
```

Use a production server after the build to check the production artifact:

```bash
npm run start -- --port 3001
```

Browser checks and final results will be recorded at the end of this checkpoint. No automated application test suite is claimed.

## Next checkpoint: finish the chosen frontend

Use `UI-02` in the prompt pack after choosing or revising a sample. First agree the finite list of screens and proposed demo behaviors; frontend completeness means that list is implemented and tested, not that a whole secure healthcare service exists. Any production-dependent rule remains [NEEDS CLARIFICATION].

A complete frontend target must cover patient accounts/profile, doctor discovery/details/physical booking, patient appointment presentation, doctor profile/availability/appointment management, laboratory report submission, patient report retrieval, disease-content maintenance and browsing, plus loading/empty/error/access states. This list maps to existing MVP journeys; fields, permissions and state transitions still need decisions. A content-maintenance screen does not establish an administrator role.
