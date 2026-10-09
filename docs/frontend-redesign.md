# Pulse frontend redesign

> Historical design experiment: reverted at the owner’s request on 2026-10-09. The original glass homepage and workspace styling are active. The experiment CSS files remain unimported for reference.

Updated 2026-10-09. This changes presentation and mobile navigation across the existing tester app. It does not add product capabilities or imply real-patient production acceptance.

## Design

Navy (#102641) establishes navigation and hierarchy, cobalt (#275de5) identifies primary actions, white and pale paper separate surfaces, and lime (#dff298) marks active navigation and selected highlights. Semantic appointment/status colors remain distinct. Manrope remains self-hosted.

The homepage now uses an asymmetric services grid, contrasting assistant section and clearer workspace links. Discovery has redesigned doctor identities, credentials, fee rows and filters. Shared buttons, forms, tables, dialogs, empty states, library cards and assistant panels use the same visual rules. The shell styles apply to patient, doctor, lab and editor pages as well as public browsing. Connected Google sign-in inherits the shared controls; the historical demo login also inherits the theme.

Below 700 px, workspace navigation becomes a button-controlled disclosure. Its expanded state is exposed to assistive technology, and selecting a destination closes it. Authorization is still enforced by existing server/session logic.

## Motion and performance

Hero elements and route content enter using finite opacity/transform animations. Cards have restrained hover and selection feedback. Animation fill is backwards, avoiding permanent transform stacking contexts and allowing hover transforms after entrance. Existing decorative heart and opt-in sounds remain. The animation toggle and OS reduced-motion preference suppress effects.

No dependency, animation library, remote image or font request was added. Shared surfaces no longer use background blur. New theme source: 19,197 bytes; gzip: 4,762 bytes measured locally. This is a source-size measurement, not an HTTP transfer measurement or proof of faster Core Web Vitals. Lighthouse, real-device frame rate and traffic/load performance were not measured.

The final theme is a dedicated appearance layer after the existing layout styles. This preserves established screen geometry and behavior. A future maintenance task can consolidate superseded appearance declarations once signed-in visual acceptance is complete; no unrelated CSS was deleted here.

## File responsibilities

| File | Responsibility |
| --- | --- |
| `web/src/features/pulse/design-system.css` | Palette, shared component appearance, responsive navigation and finite entrance motion |
| `web/src/components/pulse/shell.tsx` | Mobile menu state, accessibility attributes, closing on navigation, route entrance wrapper |
| `web/src/features/pulse/patient-pages.tsx` | Doctor-card information hierarchy and directory introduction; existing filtering retained |
| `web/src/features/pulse/landing.tsx` | Homepage service labels and section messaging; existing search and links retained |
| `web/src/app/layout.tsx` | Loads the final shared theme after layout and accessibility styles |
| `web/src/features/pulse/appointment-hero.css` | Existing appointment-first hero geometry; theme refines its appearance |

## Validation actually performed

- `npm run check`: ESLint, 19 frontend/domain tests and optimized production build passed.
- `git diff --check`: passed.
- Browser: desktop homepage including lower service grid, directory, assistant, lab empty catalog and connected login reviewed.
- Dermatology + Karachi yielded the single matching fictional profile. Enter on Clear filters restored all five profiles.
- At 390 px, workspace menu opened by keyboard, closed after selecting assistant and navigated successfully.
- No document horizontal overflow measured for directory at 390 px or home/lab/library/login at 320 px. Browser client widths exclude a 15 px scrollbar.
- Assistant booking quick guide displayed its answer and directory link.
- Motion toggle set the hero animation to `none`; original preference was restored. Sound preference was preserved.
- Temporary viewport overrides were reset. Production server restarted on localhost:3000.

Limitations: no live Google sign-in or authenticated staff walkthrough in this pass; shared styling is implemented but those screens still need signed-in visual acceptance. Mobile screenshots sometimes lagged viewport resets, so width measurements do not replace physical-device review. No backend code changed; backend tests were not rerun for this visual slice. The lab catalog was empty locally and was displayed honestly. Existing Gemini/hosting and production-policy gates remain.

## Learn this slice

1. Open `/doctors`, select a specialty and city, and identify the resulting profile.
2. Read `DoctorCard` in `patient-pages.tsx`: explain which values are data and which are layout.
3. Find the corresponding `.p-doctor-identity` and `.p-doctor-meta` rules in `design-system.css`.
4. Narrow the window and trace `menuOpen` in `shell.tsx`: button → state → class/aria-expanded → navigation → close.
5. Turn animations off and explain why search, navigation and booking rules still work.

Validation commands from repository root:

```bash
npm run check
git diff --check
npm run package:netlify
```

For a full backend release check, separately run `npm run check:all`. Packaging creates buildable source, not a static drag-and-drop website.
