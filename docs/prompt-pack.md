# PULSE — Prompt pack from architecture alignment to launch

Prepared: 2026-09-27. These prompts are future instructions, not commands executed by this document. Use one numbered prompt at a time, after its prerequisites are satisfied. See [delivery-roadmap.md](delivery-roadmap.md) for sequence and [learning-plan.md](learning-plan.md) for teaching expectations.

## Shared task protocol

Every prompt below incorporates this protocol:

- Inspect the repository, applicable project instructions and relevant current docs before changing anything; preserve unrelated work.
- Use the frozen MVP for product scope. P-00 explicitly authorizes architecture alignment only when invoked. Marketing tasks authorize their stated external-facing artifacts, not new healthcare capabilities.
- Explain the concept, data flow and proposed files before significant implementation. When the invoked prompt explicitly authorizes implementation, proceed within its scope without asking for redundant confirmation.
- Reuse recorded user decisions. Ask about genuinely missing requirements before dependent work; mark them [NEEDS CLARIFICATION]. No elapsed time or silence counts as a policy answer.
- Keep dependencies minimal and secrets private. Verify current official documentation for versions/providers rather than relying on stale recipes.
- End with what changed, why, actual validation commands/results, limitations and one small learning exercise when appropriate. Synchronize only affected documentation. Do not commit/push, publish, message others, purchase services or create recurring automation unless the invoked task/user instruction authorizes that action.
- Stop when that one task is complete. Do not automatically execute the next numbered prompt.

Copy the text block for the desired task. In this repository, the first sentence directs the assistant to this shared protocol, so you do not need to paste it repeatedly. In a different environment, supply the repository/docs or paste the protocol as well.

## Current design checkpoint — UI-01 / UI-02

These prompts adapt the pasted frontend phases to the actual one-app repository. They do not execute the pasted NestJS/monorepo plan. UI-01 is the current sample review; UI-02 follows a visual choice. Production P-01 onward remains necessary after an explicitly bounded demo.

### UI-01 — Review and refine the three samples

```text
Read docs/frontend-design-review.md and inspect the actual preview. Refine only the design direction I select: [Air / Nocturne / Studio / my changes]. Explain proposed changes, then implement the requested visual revision. Keep fictional data labelled and preserve the other samples for comparison. Check desktop/mobile, keyboard use, contrast and reduced effects. Explain changed files, actual checks and one learning exercise. Do not claim the entire frontend or backend is complete. Stop at the design checkpoint.
```

### UI-02 — Complete the chosen frontend

```text
Use the shared task protocol. Read docs/frontend-design-review.md, the MVP freeze and frontend architecture. My chosen design is [DIRECTION + CHANGES]. Build the complete frontend for the frozen MVP in that direction. Start by listing the exact routes/screens and a requirement-to-screen checklist for patient, doctor, laboratory and disease-content workflows. Explain each screen’s input, state, success/error/empty/loading behavior and backend dependency.

Use only recorded business decisions. Ask concise questions for missing rules before implementing dependent behavior. If I explicitly authorize a fictional-data prototype, record its proposed fields/transitions separately from approved requirements, visibly label it, keep all data synthetic and never call it real authentication or persistence. No fake production API responses. Do not invent an administrator, billing, payments, telemedicine or subscriptions.

Implement all agreed screens using small shared components and feature modules. Keep the sample comparison separate from the finished frontend. Test complete agreed frontend journeys, mobile sizes, keyboard navigation, validation, back navigation and failure states. Verify lint, types and production build. Update the existing walkthrough with every changed file’s role, data flow, actual evidence and remaining backend work. Mark only demonstrated checklist items complete. Do not deploy automatically. Stop when this bounded frontend task is complete.
```

### After frontend review — next prompts in order

1. P-01: decide release context, accounts and permissions; a prototype does not answer these.
2. P-04, P-07–P-10: select minimal backend libraries, design/implement persistence, authentication and server authorization.
3. P-11–P-16: replace doctor/appointment fixtures with the real complete journey.
4. P-17–P-20: build safe report workflows and maintained disease content.
5. P-21–P-23: test, refine, secure and prove staging recovery.
6. P-24–P-25: prepare truthful marketing and an animated demo using stable synthetic data.
7. P-26–P-29: release preparation, authorized deployment, authorized marketing publication and review.

Use the full corresponding prompts below. There is no need to recreate the project or run every prompt at once. Learning is part of each implementation step; P-02 is an optional focused explanation whenever needed.

## P-00 — Align architecture with the simpler stack

- **Type:** Planning.
- **Prerequisites:** Existing requirements and learning plan.
- **Expected result:** Consistent Next.js-only architecture; no code.
- **Learning focus:** Browser versus server versus database.

```text
Run P-00 using the shared task protocol in docs/prompt-pack.md.

Read docs/learning-plan.md, all architecture documents, and the MVP freeze. Adopt Next.js, TypeScript, PostgreSQL, Tailwind and shadcn/ui as the initial stack; defer NestJS, Redux and GSAP. Revise the six architecture documents consistently: one server-side authority, service/data-access layers, maintained authentication, authorization, API or Server Action boundaries, private caching, report storage, testing and deployment. Explain the tradeoffs and remove contradictory Nest-owned assumptions. Keep product scope unchanged. Do not choose unspecified business policies or install anything. Stop after documentation and consistency checks.
```

## P-01 — Resolve first-release context and immediate blockers

- **Type:** Planning.
- **Prerequisites:** P-00.
- **Expected result:** Recorded answers or clearly blocked decisions.
- **Learning focus:** Scope versus policy; user versus buyer.

```text
Run P-01 using the shared task protocol in docs/prompt-pack.md.

Read the SRS open questions and current architecture. Ask me a short prioritized set of questions about demo versus real-patient release, first intended audience, account/role onboarding, profile ownership, login/account lifecycle, hosting budget and weekly availability. Reuse answers already given. Explain the consequences in beginner-friendly terms and offer recommendations without treating them as answers. Record my actual answers in the relevant existing docs. Do not invent a payer, administrator role, subscription model, permission, deadline or feature. Defer later-domain questions until their task. No application code.
```

## P-02 — Learn the foundations needed for the first slice

- **Type:** Learning.
- **Prerequisites:** P-01; may accompany later work.
- **Expected result:** Small exercises understood; no full app generated.
- **Learning focus:** HTML/CSS, JavaScript, Git, React and TypeScript.

```text
Run P-02 using the shared task protocol in docs/prompt-pack.md.

Assess my familiarity with HTML forms, CSS layout, JavaScript functions/arrays/async-await, HTTP, Git, React props/state and TypeScript. Teach the next missing concept with a small example and one exercise, using a synthetic doctor list or form where helpful. Explain browser and server responsibilities. Keep this session focused; do not dump an entire course or scaffold PULSE. Use chat exercises unless I explicitly ask to save them. Check my explanation and give constructive feedback before continuing to the next concept.
```

## P-03 — Map complete screens and journeys

- **Type:** Planning.
- **Prerequisites:** P-00, P-01.
- **Expected result:** Small screen/flow plan matching frozen journeys.
- **Learning focus:** UI states, navigation and user outcomes.

```text
Run P-03 using the shared task protocol in docs/prompt-pack.md.

Read the MVP freeze and use cases. Document lightweight screen flows for patient discovery/physical booking, doctor profile/availability/appointment management, laboratory upload/patient result access, and disease maintenance/browsing. Include loading, empty, invalid-input, forbidden, expired-session and relevant failure states. Map screens to existing requirements; distinguish a UI screen from a new product feature. Keep names and visual direction provisional where unspecified. Do not add an admin product, subscription pages or deferred services. No application code.
```

## P-04 — Choose compatible implementation libraries and hosting approach

- **Type:** Planning.
- **Prerequisites:** P-00, P-01.
- **Expected result:** Recorded minimal dependency choices and deployment fit.
- **Learning focus:** Library versus framework; runtime versus development dependency.

```text
Run P-04 using the shared task protocol in docs/prompt-pack.md.

Using current official documentation, evaluate compatible stable versions, one PostgreSQL data-access/migration tool, one established authentication integration, validation tooling, essential test tools and private report storage. Recommend the smallest coherent set for the Next.js-only design. Check hosting support for sessions, database connections, streaming/file limits and any required inspection. Explain costs and alternatives without buying or provisioning anything. Do not install unselected libraries. Record decisions and unresolved provider/budget questions. Stop after selection planning; require answers where the choice materially depends on them.
```

## P-05 — Create the minimal application scaffold

- **Type:** Build.
- **Prerequisites:** P-00 through P-04 resolved for scaffolding.
- **Expected result:** Runnable minimal app with verified setup.
- **Learning focus:** Project folders, components, scripts and environment variables.

```text
Run P-05 using the shared task protocol in docs/prompt-pack.md.

Create only the agreed Next.js/TypeScript scaffold, Tailwind setup and necessary shadcn/ui foundation. Follow the revised architecture. Add a useful README, safe ignore rules, placeholder-only environment documentation and the agreed minimal type/lint/test setup. Preserve existing docs and the Word file. Create a simple non-sensitive app shell, not mocked healthcare workflows. Do not install deferred packages or unused components. Verify clean install/build and the configured checks. Explain the directory structure, each added dependency and how to run the app. Stop before domain features.
```

## P-06 — Deploy an early non-sensitive preview

- **Type:** Deployment.
- **Prerequisites:** P-05; selected host/account/budget.
- **Expected result:** Verified preview or concrete ready-to-deploy package.
- **Learning focus:** Build versus deployment; secrets versus public configuration.

```text
Run P-06 using the shared task protocol in docs/prompt-pack.md.

Prepare and deploy the current non-sensitive scaffold to the selected preview environment within the agreed budget, using available authorized access. First finish local build checks and show the deployment configuration. If provider/account/domain/budget information is missing, prepare everything independent of it and ask only for the missing input. Do not purchase services or touch unrelated deployments. Use no patient data. Verify the live response, HTTPS and environment handling; record the URL, commands and rollback/removal procedure. This is a preview, not a claim that PULSE is complete.
```

## P-07 — Design the initial relational model

- **Type:** Planning.
- **Prerequisites:** P-01, P-04; identity/profile policies settled.
- **Expected result:** Reviewed initial entity relationships and migration plan.
- **Learning focus:** Keys, relationships, constraints and SQL.

```text
Run P-07 using the shared task protocol in docs/prompt-pack.md.

Design the initial PostgreSQL model for the selected authentication integration, agreed roles, patient information and doctor profiles. Explain every relationship, ownership rule, uniqueness constraint and what is deliberately not modeled yet. Treat library-owned identity tables according to its supported integration. Mark unresolved business fields and ask before finalizing them. Do not implement appointment/report lifecycle assumptions or deferred feature tables. Show a readable diagram and explain a sample query. Documentation only; no schema migration yet.
```

## P-08 — Implement initial persistence and migrations

- **Type:** Build.
- **Prerequisites:** P-07 settled; selected development database available.
- **Expected result:** Repeatable migrations and isolated synthetic fixtures.
- **Learning focus:** Schema changes, parameterized queries and isolation.

```text
Run P-08 using the shared task protocol in docs/prompt-pack.md.

Implement only the approved initial data model with the selected migration/data-access tool. Use server-only database access, safe validated configuration and a separate test database. Add synthetic fixture support without committing reusable login credentials or real records. Test migration on an empty database and the relevant relationships/constraints. Explain the migration and query flow. Do not connect tests to production or run destructive database actions against unknown data. Provide the actual migration, test and inspection commands, then stop.
```

## P-09 — Implement authentication

- **Type:** Build.
- **Prerequisites:** P-08; Q-005 and integration choices resolved.
- **Expected result:** Working approved account/session flow.
- **Learning focus:** Authentication, cookies, sessions and server trust.

```text
Run P-09 using the shared task protocol in docs/prompt-pack.md.

Implement AUTH-001 and AUTH-002 with the approved maintained authentication integration and resolved account policy. Include the agreed secure session lifecycle and anti-abuse/CSRF protections appropriate to the selected architecture. Do not hand-roll cryptography or add unapproved social login, MFA or recovery features. Prevent credential/session exposure in logs, client bundles and browser storage. Test valid/invalid authentication and session termination/expiry using isolated synthetic accounts. Explain the complete request/session flow, map evidence to acceptance criteria, and stop before unrelated product features.
```

## P-10 — Implement resource permissions and patient information

- **Type:** Build.
- **Prerequisites:** P-09; Q-004/Q-019 rights and onboarding settled.
- **Expected result:** Server-enforced policies and usable patient records.
- **Learning focus:** Role checks versus ownership checks.

```text
Run P-10 using the shared task protocol in docs/prompt-pack.md.

Implement AUTH-003, AUTHZ-001 and USER-001 for the agreed V1 actors and patient-record responsibilities. Enforce permission checks in server operations and scoped database access. Do not trust submitted role or owner fields, invent an administrator dashboard, or grant general doctor history access. Implement only the approved way to establish privileged actor accounts. Test unauthenticated access, same-role cross-user access and forbidden writes through direct requests as well as the UI. Explain why client-side hiding is insufficient and stop after this access foundation.
```

## P-11 — Build doctor profile maintenance and details

- **Type:** Build.
- **Prerequisites:** P-10; Q-006 public fields/ownership settled.
- **Expected result:** Authorized maintained profiles and safe details.
- **Learning focus:** Forms, validation, projections and persistence.

```text
Run P-11 using the shared task protocol in docs/prompt-pack.md.

Implement DOC-001 and DOC-002 to the resolved profile ownership and field rules. Connect real persistence, authorized maintenance forms and safe detail views; expose only approved fields. Do not invent verification badges or an approval workflow. Keep availability presentation limited to what exists until its later task. Test valid updates, rejected data and unauthorized changes with synthetic profiles. Explain input-to-database-to-response flow and provide the relevant validation commands. Stop before search or scheduling implementation.
```

## P-12 — Implement all required doctor search criteria

- **Type:** Build.
- **Prerequisites:** P-11; Q-008 matching/access rules settled.
- **Expected result:** Verified specialization, symptom and location discovery.
- **Learning focus:** Filtering, queries, indexes and sensitive inputs.

```text
Run P-12 using the shared task protocol in docs/prompt-pack.md.

Implement SEARCH-001 with the agreed specialization, symptom and location matching rules, safe doctor detail navigation, bounded results and defined empty/error states. Ask first if symptom mapping or guest access is still unclear; do not replace it with diagnosis or an invented AI feature. Avoid exposing sensitive searches in logs/URLs where the architecture prohibits it. Test each criterion against agreed fixtures and combined behavior only if specified. Explain the query and indexes, and stop once discovery acceptance criteria pass.
```

## P-13 — Resolve schedule and booking policy; design its data model

- **Type:** Planning.
- **Prerequisites:** P-10, P-11; current Q-009/Q-010 reviewed.
- **Expected result:** Approved policy and transaction design.
- **Learning focus:** Availability, state transitions and concurrent requests.

```text
Run P-13 using the shared task protocol in docs/prompt-pack.md.

Resolve the remaining availability and physical-appointment rules before coding: schedule owner, timezone, duration, capacity, confirmation, doctor-management actions and duplicate/conflicting requests. Ask focused questions instead of assuming cancellation or rescheduling is required. Document only actual answers, the resulting schema/state transitions and a transaction/constraint approach. Explain what happens when two users attempt the same capacity. Preserve the physical-only V1 boundary and exclude payment prerequisites. No application code in this task.
```

## P-14 — Build authorized availability management

- **Type:** Build.
- **Prerequisites:** P-13 resolved.
- **Expected result:** Persistent availability used by discovery.
- **Learning focus:** Time representation and schedule validation.

```text
Run P-14 using the shared task protocol in docs/prompt-pack.md.

Implement SCHED-001 using the approved schedule model and permissions. Include the migration, server validation, authorized UI and eligible availability reads, with correct timezone presentation. Apply the agreed rules for changes that affect existing appointments, using the same concurrency coordination intended for booking. Test unauthorized edits, invalid times and relevant timezone cases. Do not invent recurrence/exceptions beyond the approved policy. Explain the time/data flow and stop after availability acceptance.
```

## P-15 — Build physical appointment booking

- **Type:** Build.
- **Prerequisites:** P-12, P-14; transaction/state rules settled.
- **Expected result:** Persisted authorized booking that respects capacity.
- **Learning focus:** Transactions, conflicts and safe retries.

```text
Run P-15 using the shared task protocol in docs/prompt-pack.md.

Implement the physical branch of APPT-001 with real server-side validation, ownership and the approved PostgreSQL concurrency constraints/transaction. Connect patient selection to persisted booking and an honest success/conflict result. Test simultaneous requests with real PostgreSQL and test duplicate submission under the approved retry policy. Do not rely on a disabled button as concurrency control or add online appointments/payments. Explain the transaction boundaries and failure handling. Stop after booking acceptance, leaving doctor management to its named next task.
```

## P-16 — Complete doctor appointment management

- **Type:** Build.
- **Prerequisites:** P-15; approved management actions.
- **Expected result:** Complete patient-to-doctor appointment journey.
- **Learning focus:** State transitions and end-to-end testing.

```text
Run P-16 using the shared task protocol in docs/prompt-pack.md.

Implement APPT-002 so authorized doctors can access and manage the same appointments created in the patient booking flow, using only the approved actions/states. Do not add broader patient history or lab access. Test valid/invalid transitions and another doctor attempting access. Run the complete journey from maintained profile/availability through patient booking to doctor management. Explain what makes this a complete user journey, update evidence and stop.
```

## P-17 — Resolve lab-report policy and storage design

- **Type:** Planning.
- **Prerequisites:** P-10; Q-016/Q-019/Q-020 reviewed.
- **Expected result:** Approved upload/access rules and failure plan.
- **Learning focus:** File bytes versus metadata; trust and storage.

```text
Run P-17 using the shared task protocol in docs/prompt-pack.md.

Before lab implementation, resolve uploader authorization, patient matching, allowed formats/sizes, inspection, publication/availability, correction policy and retention. Check the chosen host/storage limits and data-location requirements. Design metadata/storage relationships, private access and compensation for partially failed uploads without adding lab-test booking or a test catalog. Do not choose a third-party scanner that receives patient data without the relevant decision. Explain the upload/read sequence and failure cases. Documentation only; ask for unresolved policies.
```

## P-18 — Implement safe authorized report upload

- **Type:** Build.
- **Prerequisites:** P-17 settled; private development storage available.
- **Expected result:** Durable validated uploads with correct association.
- **Learning focus:** Streaming, validation and partial failure recovery.

```text
Run P-18 using the shared task protocol in docs/prompt-pack.md.

Implement LAB-003 and applicable DATA-001/authorization rules with the agreed private storage and inspection policy. Connect authorized UI and server handling; store metadata and file references safely. Files must not become readable before technical validation and publication policy allow it. Test unauthorized upload, patient association, invalid/oversized files, interruption and storage/database failure compensation. Use synthetic documents only. Explain why SQL and object storage need reconciliation. Stop before patient report viewing.
```

## P-19 — Complete private patient report access

- **Type:** Build.
- **Prerequisites:** P-18.
- **Expected result:** Complete laboratory-to-patient report journey.
- **Learning focus:** Resource authorization and private caching.

```text
Run P-19 using the shared task protocol in docs/prompt-pack.md.

Implement LAB-004: authenticated patients search and view their own available reports under the agreed format/display policy. Authorize both metadata and file transfer server-side. Do not create public file links, a lab-test catalog or doctor history access. Test patient A versus patient B, expired sessions, direct file requests, missing objects and account-switch/cache behavior. Demonstrate upload-to-intended-patient retrieval with synthetic data. Explain each permission boundary and stop after the complete journey passes.
```

## P-20 — Build maintained disease information

- **Type:** Build.
- **Prerequisites:** P-10; Q-014 and reader access settled.
- **Expected result:** Complete maintained-content-to-reader journey.
- **Learning focus:** Content validation and authorized maintenance.

```text
Run P-20 using the shared task protocol in docs/prompt-pack.md.

Implement DISEASE-001 and DISEASE-002 together using approved content fields, sources, ownership and reader rules. Provide authorized maintenance and eligible browsing, including safe text rendering and specified empty/error states. Do not invent clinical advice, diagnosis, a review workflow or administrator role. Use reviewed content or clearly labelled synthetic development fixtures. Test permitted reads/changes and unauthorized writes. This SHOULD HAVE journey remains included in V1. Stop when its acceptance criteria pass.
```

## P-21 — Polish the existing journeys

- **Type:** Build.
- **Prerequisites:** P-16, P-19, P-20.
- **Expected result:** Consistent usable interface without feature expansion.
- **Learning focus:** Responsive layouts, keyboard access and clear feedback.

```text
Run P-21 using the shared task protocol in docs/prompt-pack.md.

Review only the implemented V1 journeys for responsive layout, labels, keyboard/focus behavior, loading/empty/error states and consistent visual styling. Fix demonstrated usability defects and test the agreed browser/device/accessibility targets. Use modest CSS motion where useful; do not add GSAP, Redux or another UI framework merely for polish. Preserve reduced-motion behavior and never hide errors behind animation. Explain changed components and evidence. Stop without adding new product capabilities.
```

## P-22 — Validate security and full release behavior

- **Type:** Verification.
- **Prerequisites:** P-21; agreed security/quality criteria.
- **Expected result:** Traceable test results and fixed in-scope defects.
- **Learning focus:** Integration tests, threat cases and debugging.

```text
Run P-22 using the shared task protocol in docs/prompt-pack.md.

Run and complete meaningful tests for the frozen V1: all three journeys, cross-user/role access, sessions, CSRF where applicable, input handling, private caches, upload safety, booking concurrency, error handling and agreed performance targets. Inspect logs and built client artifacts for unintended exposure. Use real PostgreSQL for integrity tests and synthetic fixtures. Fix in-scope defects and keep tests tied to existing criteria. Do not assert healthcare compliance or invent numeric targets; report unresolved release blockers. Explain failures and fixes, then stop.
```

## P-23 — Prepare staging operations and prove recovery

- **Type:** Deployment.
- **Prerequisites:** P-22; host/storage/backups and recovery targets selected.
- **Expected result:** Production-like staging with proven migrations and restore.
- **Learning focus:** Configuration, CI/CD, monitoring and recovery.

```text
Run P-23 using the shared task protocol in docs/prompt-pack.md.

Implement the agreed deployment/CI configuration and run it in the selected staging environment within the approved budget. Separate secrets, database and storage from production; use synthetic data. Verify clean builds, migration upgrades, private upload/read through the actual host, session behavior, restart persistence and coordinated database/file restore. Document safe rollback, operational logs and failure handling. Do not run destructive tests on production. Explain each operational component and record actual commands and outcomes. Stop with any remaining production blockers.
```

## P-24 — Prepare positioning and a marketing page

- **Type:** Marketing preparation.
- **Prerequisites:** P-01 audience decision; P-16/P-19/P-20 real behavior; P-21 visual baseline.
- **Expected result:** Reviewable landing-page draft and truthful copy.
- **Learning focus:** Positioning, audience, evidence and calls to action.

```text
Run P-24 using the shared task protocol in docs/prompt-pack.md.

Prepare marketing for the agreed first audience using only verified V1 capabilities. Draft a clear value proposition, short product description and release-appropriate call to action, then build a lightweight marketing-page preview using the existing project conventions where suitable. Keep it separate from clinical workflows. Use synthetic-data screenshots; label demo limitations. Do not add subscriptions, multi-tenancy, waitlist/email collection, trackers, fabricated testimonials or outcome claims without a separate decision. Do not publish, send messages or buy assets. Explain the copy choices and stop with a reviewable preview.
```

## P-25 — Create animated product demo videos

- **Type:** Marketing preparation.
- **Prerequisites:** P-24; stable synthetic-data UI and approved story/assets.
- **Expected result:** Playable reviewed teaser and walkthrough.
- **Learning focus:** Storyboarding, capture, pacing, captions and exports.

```text
Run P-25 using the shared task protocol in docs/prompt-pack.md.

Create a short animated teaser and a product walkthrough from the working synthetic-data PULSE UI. First show a storyboard and accurate script; then capture/produce the videos using available suitable tools, keeping video dependencies outside the app runtime. Aim initially for a 15–20 second teaser and a 45–60 second walkthrough, adjusting for clarity. Use readable captions, restrained motion and only authorized/licensed assets or original audio. Do not expose credentials, real patient data or unimplemented features. Validate playback and text readability, provide the files and editable materials available, and stop before publishing.
```

## P-26 — Prepare the production release for review

- **Type:** Release preparation.
- **Prerequisites:** P-23; confirmed audience/data context; approved requirements.
- **Expected result:** Concrete release package and explicit go/no-go evidence.
- **Learning focus:** Release gates, migrations and rollback.

```text
Run P-26 using the shared task protocol in docs/prompt-pack.md.

Prepare a production release from the tested V1. Identify the exact revision/build, target environment/domain, configuration categories, migration plan, rollback/restore plan, backup evidence, operator responsibilities and known limits. Check relevant acceptance criteria and resolved privacy/security/operational requirements for the actual release context. If it is a synthetic-data demo, label it clearly; do not present it as ready for real patient operation. Finish all independent preparation before asking for any missing final authorization. No production deployment in this task. Stop with a concrete reviewable release report.
```

## P-27 — Deploy the agreed production release

- **Type:** Release execution.
- **Prerequisites:** P-26 passes; exact target/revision authorized.
- **Expected result:** Verified live application or documented rollback/failure.
- **Learning focus:** Deployment execution and smoke checks.

```text
Run P-27 using the shared task protocol in docs/prompt-pack.md.

Deploy the agreed release revision to the exact target documented in the release report, within the agreed budget and scope. This prompt authorizes that deployment, not unrelated account changes, purchases or destructive operations. If target/revision or necessary access is missing, ask specifically; never ask me to paste secrets into chat. Follow the migration/backup plan, verify readiness and run safe smoke checks for the included journeys. Do not use real patients as test fixtures. Verify the URL and environment behavior, report deployed evidence and remaining limits, and stop.
```

## P-28 — Publish the approved marketing materials

- **Type:** Launch execution.
- **Prerequisites:** P-24/P-25 approved; P-27 live; named channels/accounts supplied.
- **Expected result:** Verified approved launch assets at specified destinations.
- **Learning focus:** Publication and honest distribution.

```text
Run P-28 using the shared task protocol in docs/prompt-pack.md.

Publish only the approved marketing-page revision and selected video/copy assets to the exact destinations/accounts I identify for this launch. Verify the live app link and claims first. If destinations, account access, asset versions or posting text are unspecified, finish a publication-ready package and ask for those details before publishing. Do not send outreach messages, run paid ads, enroll subscribers or buy services unless I explicitly include those actions with recipients/budget. Verify published results, record links and stop.
```

## P-29 — Review the launch and prioritize maintenance

- **Type:** Post-launch.
- **Prerequisites:** P-27; P-28 if marketing launched.
- **Expected result:** One review with evidence-based next actions.
- **Learning focus:** Operations, feedback and controlled iteration.

```text
Run P-29 using the shared task protocol in docs/prompt-pack.md.

Perform one post-launch review using available authorized operational information and user feedback. Check application health, agreed backup/restore processes, aggregate errors, critical journeys and consistency of public claims. Avoid sensitive data in the report. Classify findings as defects, documentation fixes or new feature requests; fix only explicitly authorized scope. Propose a small next iteration tied to evidence, not new SaaS features by default. Do not create recurring monitoring, message users or change production without the relevant request. Stop after this review.
```

## Helper — Resume safely

```text
Read docs/delivery-roadmap.md and inspect the current repository. Tell me the last task with verified completion evidence, any uncommitted or unfinished work, and the next eligible prompt. Do not infer completion from file names or rewrite working code. If the recorded plan and repository disagree, explain the discrepancy before continuing. Do not implement the next task yet.
```

## Helper — Explain a change I do not understand

```text
Explain the current change as if I am learning this concept for the first time. Follow one user action through the relevant browser/server/database layers. Define unfamiliar terms, explain why each changed file exists, and distinguish essential logic from framework plumbing. Give me one small prediction or modification exercise. Do not change the code unless I ask.
```

## Helper — Debug one failure

```text
Investigate the specific error I provide. Reproduce it safely, explain the evidence and root cause, then make the smallest authorized fix for this task. Do not broadly rewrite working modules or expose secrets in diagnostics. Run the relevant checks, explain why the fix works and what would catch a regression, then stop. If you need missing reproduction information, ask precisely rather than guessing.
```

## Helper — Review before advancing

```text
Review the current task against its requirements, acceptance criteria and architecture. Report actionable correctness, authorization, data-integrity and maintainability findings with file references. Distinguish evidence from guesses and unexecuted checks. Do not edit files. Tell me whether this task meets its exit evidence, and identify the next prompt without executing it.
```

## Helper — Evaluate new feedback without scope creep

```text
Evaluate the feedback I provide against the frozen MVP. Separate a defect in existing behavior from a new feature or changed requirement. Explain user value, impact on permissions/data/operations, dependencies and a small implementation option. Do not add it to V1 or implement it automatically. Ask for a scope decision only if it changes the existing boundary.
```
