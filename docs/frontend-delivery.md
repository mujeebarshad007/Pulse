# PULSE — Frontend delivery

Historical frontend-only checkpoint. As of 2026-09-29 the brand is Big Pulse and connected mode adds authenticated APIs, persistence and private fictional PDFs. The implementation and validation below describe the original `APP_MODE=demo` prototype. Use [current tester delivery](tester-mvp.md) for current status.

Date: 2026-09-28. Status: implemented fictional-data frontend MVP; production acceptance remains pending.

## What this delivery means

The user authorized completing the frontend with a professional glassmorphism direction, a learning guide and an additional useful UX idea. The Air direction now informs a full set of connected screens. The original comparison remains at `/design-preview`.

This is an interactive, in-memory demonstration of all three frozen MVP journeys. It does not turn unresolved production rules into decisions. No API, authentication service, database, private object storage, deployment or real healthcare transaction was implemented. Reloading restores fixtures and ends the demo session; client navigation and persona changes preserve fictional records so the journeys can be reviewed.

## Requirement-to-screen checklist

“Implemented” here describes the frontend demonstration only. References to production acceptance criteria identify later integration obligations; they are not claims that those criteria have passed.

| Frontend area | Routes | Requirement / use case / acceptance links | Implemented demo outcome | Backend dependency |
|---|---|---|---|---|
| Entry and onboarding | `/login`, `/register` | AUTH-001–003; UC-001; AC-001–003 | Fictional patient registration and entry, form errors, persona entry and leave action | Account policy, maintained authentication, server sessions |
| Role workspaces | Product layout and all protected screens | AUTHZ-001; UC-002/003/005/008/010; AC-004 | Persona-specific navigation, route presentation and command checks | Server identity, resource ownership and role provisioning |
| Patient information | `/patient`, `/patient/profile` | USER-001; UC-002; AC-005 | Edit local profile; overview derives appointments and reports | Approved fields, validation, persistence and access rights |
| Doctor maintenance | `/doctor`, `/doctor/profile` | DOC-001–002; UC-003; AC-006–007 | Create/edit a fictional profile; directory reads the changed record | Doctor onboarding, ownership, eligibility and public-field policy |
| Discovery and details | `/doctors`, `/doctors/[id]` | SEARCH-001, DOC-002; UC-004; AC-007–008 | Combined query/specialty/symptom/city filters, sort, empty reset, details | Approved matching, safe public projections and indexed queries |
| Availability | `/doctor/availability` | SCHED-001; UC-003/005; AC-009/037 | Add/remove sample slots; refuse duplicates and referenced slot removal | Approved schedule/capacity/timezone rules and durable integrity |
| Physical appointment | `/doctors/[id]`, `/patient/appointments`, `/doctor/appointments` | APPT-001 physical, APPT-002; UC-005; AC-010–011/037 | Review/request a slot, view shared records, doctor confirm/decline/complete | Approved lifecycle, transactions, authorization and concurrency |
| Laboratory preparation | `/laboratory`, `/laboratory/upload` | LAB-003; UC-010 lab branch; AC-020/024/036 | Select fictional patient, local text/generated sample, review match, add | Real lab permissions, patient matching, inspection, private durable upload |
| Patient reports | `/patient/reports` | LAB-004; UC-010 patient branch; AC-021/035 | Search intended patient's sample reports, reader and text-download control | Authenticated private retrieval and record-level server checks |
| Information reader | `/library`, `/library/[id]` | DISEASE-001; UC-008 reader; AC-016 | Search/read published entries and linked sources | Reader eligibility and maintained approved content |
| Content maintenance | `/content`, `/content/new`, `/content/[id]` | DISEASE-002; UC-008 maintainer; AC-017/039 | Create/edit/draft/publish local entries, clearly unreviewed edits | Approved content authority, governance and persistence |
| Validation and recovery | Forms, dialogs, route boundaries, demo controls | DATA-001, ERR-001, UX-001; relevant cases; AC-024/027/031 | Native constraints, command errors, review dialogs, empty/loading/error states and retry | Server validation, real failure contracts and measurable quality targets |

The landing page introduces these existing journeys. There is no invented admin console, billing, subscriptions, telemedicine, prescription, diagnosis, lab booking or broad doctor access to patient history.

## Additional UX idea

`/journey` is a guided cross-role walkthrough. It opens the appropriate persona and screen, and derives selected completion marks from record changes. This directly supports the user's request for an additional useful idea and a learnable demo. It is a presentation aid, not a new clinical capability. No claim is made that this interaction has never existed elsewhere.

## Prototype proposals — not approved product rules

| Proposal | Actual demo behavior | Unresolved production question |
|---|---|---|
| Persona entry | Anyone can choose a fictional role. Registration adds only a local patient; `.test` email and made-up password fields demonstrate form handling. Passwords are neither stored nor verified. | Q-004/Q-005/Q-020 |
| Patient fields | Name, email and city; local validation. | Q-019 |
| Doctor fields | Fictional name, specialty, city, clinic, experience, fee, qualifications, biography and symptom tags. Contact is a clearly fictional display placeholder. | Q-006/Q-008/Q-019 |
| Discovery | Case-insensitive query plus exact selected tag/city/specialty intersection. Symptom tags are manually assigned fixtures, not diagnosis or triage. | Q-008 |
| Time and money | Fixed 5–9 October 2026 sample week; Asia/Karachi; 30-minute example slots; PKR display only. | Q-003/Q-009 |
| Slot occupancy | A non-declined appointment consumes its specific sample slot. Referenced slots remain for history. No production patient-overlap policy is inferred. | Q-009/Q-010 |
| Lifecycle | Requested → Confirmed or Declined; Confirmed → Completed. No cancellation/rescheduling invented. | Q-010 |
| Reports | Fictional `.txt` files only, nonempty and at most 65,536 bytes; generated sample option; immediately visible to selected patient in the local store. | Q-016/Q-019/Q-020 |
| Information | Guests can browse sample entries. Maintainer can create/edit and choose local visibility. Edited entries remain unreviewed. | Q-004/Q-008/Q-014 |
| Persistence | Memory only, reset on refresh. Leaving a persona preserves fictional records so other roles can inspect the same journey. This is unsuitable for real identity/logout behavior. | Q-005/Q-019/Q-020 |

These proposals are reviewable examples and must be resolved before they become production behavior. They do not modify canonical requirement IDs or acceptance outcomes.

## UI and performance choices

Glass surfaces use a blue/teal/lilac backdrop, translucent fills, subtle borders and shadows. Main text remains dark and clear. Shared controls and spacing support consistent hierarchy across roles. The workspace adapts to narrow screens; tables scroll inside their container. There are no remote font/image dependencies or continuous animation loops. System fonts and local SVG icons keep the asset footprint small.

The workspace has a Reduce glass option and CSS fallbacks for reduced transparency, higher contrast and forced colors. Native controls, labelled fields, visible focus, a skip link and native modal dialogs provide an accessibility foundation. This is not an accessibility certification. GPU blur cost and responsiveness must be measured on target devices; no unmeasured scalability or speed guarantee is made.

Demo records are bundled intentionally for a small reviewable prototype. A production build must replace the client fixture store with authenticated services, pagination, database queries and private storage. It must not ship all users' real records to the browser or reuse persona switching as authentication.

## Validation evidence

Automated checks use existing TypeScript and Node's test runner; no new runtime/test library was installed. Final verification passed `npm run check`: ESLint, all **15 domain tests**, and the optimized Next.js build with type checking. The separate `npm run typecheck` also passed. A production server on port 3001 returned HTTP 200 for 22 application route requests and HTTP 404 for an unknown route; this verifies server responses, not client interactions. `git diff --check` passed, changed documentation links resolved, and manifest/lockfile dependency metadata agreed.

The tests cover combined discovery, valid relationship creation, repeated slot requests, mismatched identifiers, guest/wrong-role commands, lifecycle transitions, another doctor's appointment, preserved schedule history, duplicate availability, patient edits, doctor creation, own-report selection, invalid report submissions and content/source behavior.

Browser checks completed during implementation:

- Patient entry and desktop dashboard render.
- Combined Maya/general-medicine/Karachi/headache filters produce one matching doctor.
- Keyboard slot selection opens an accurate review dialog and creates APT-1003.
- Doctor workspace sees APT-1003, confirms it through a second dialog, and the patient list shows the same 10:00 appointment as Confirmed.
- Laboratory generated-sample preparation and recipient review add a report; Jamie's report list and reader display it correctly.

The download event check timed out in the in-app browser. After a session interruption, the browser tool could not leave its internal connection-error page; remaining browser checks are not marked passed. The local server separately returned HTTP 200. The previous design-sample screenshots are historical, not evidence for every new product screen.

Before accepting a public demo, complete this remaining manual matrix in a normal browser:

1. Registration → profile edit → leave → fictional sign-in; duplicate email and invalid form fields.
2. New doctor → profile creation → add availability → discovery; occupied-slot removal and duplicate slots.
3. Report search and `.txt` download; Avery sees only Avery's reports; invalid extension, empty/oversized file and competing selections.
4. Create content draft → publish → reader → unpublish; invalid source and nonexistent ID.
5. Narrow 390px and 320px layouts, keyboard dialog escape/focus return, reduced effects and no page-level horizontal overflow.
6. Simulated loading/empty/error controls, retry, unknown URL, refresh reset and browser back/forward.

Current verification commands, from the root:

```bash
npm run check
npm run typecheck
git diff --check
npm run dev
```

CI is configured to run checks on GitHub, but no GitHub run, deployment, database test, penetration test, cross-browser suite or load test is claimed. [Official checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) action revisions are pinned in the workflow.

## Sources and content boundaries

The three initial educational entries use short paraphrases with links to NHS pages on [high blood pressure](https://www.nhs.uk/conditions/high-blood-pressure/), [atopic eczema](https://www.nhs.uk/conditions/atopic-eczema/) and [type 2 diabetes](https://www.nhs.uk/conditions/type-2-diabetes/). The UI directs readers to the original source. It does not diagnose, recommend personalized treatment, or claim professional review of subsequent edits. Fictional reports contain no clinical measurements.

Design research and earlier visual comparisons are recorded in [the historical design review](frontend-design-review.md). No paid template, copied component library or external design asset was installed.

## What is still unresolved

The remaining canonical questions are retained in [MVP-freeze.md](requirements/MVP-freeze.md): release audience/geography/data use (Q-003), role provisioning (Q-004), account/session lifecycle (Q-005), doctor fields/ownership (Q-006), search and reader access (Q-008), schedules/capacity/timezones (Q-009), booking transitions/concurrency (Q-010), content governance (Q-014), report matching/formats/publication/corrections (Q-016), field/data lifecycle rules (Q-019), security/privacy controls (Q-020), measurable performance/recovery/compatibility/error targets (Q-021–024), hosting/constraints (Q-025), delivery expectations (Q-026), and acceptance authority (Q-028). Source completeness (Q-001) remains as documented. Q-002 selects V1 scope; excluded-domain questions remain deferred.

Next: review this frontend and learn one workflow with [the file-by-file guide](frontend-learning-guide.md), then run P-01 in [the prompt pack](prompt-pack.md). Resolve policies before connecting a real backend. The frontend completion checkpoint does not mark the production MVP, deployment or marketing launch complete.
