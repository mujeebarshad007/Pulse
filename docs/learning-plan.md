# PULSE — Learn, build, deploy and launch

Prepared: 2026-09-27. Status: practical learning plan and simplified stack recommendation; no application implementation authorized by this document.

## What we are trying to achieve

Build a working PULSE application while learning enough to explain, debug and maintain its important parts. AI helps with implementation, review and explanation; progress is measured by working user journeys and the developer’s understanding, not the volume of generated code or documents.

The user clarified that the earlier stack was tentative and that they are unfamiliar with its technologies. This changes the basis for recommending a separate backend. The [architecture decisions](architecture/decisions.md) now record the simplified one-app direction. The complete fictional-data Next.js frontend now exists in `web/`; start with the [frontend learning guide](frontend-learning-guide.md). The [MVP freeze](requirements/MVP-freeze.md) remains the product boundary.

## My stack recommendation

The user has clarified that this is self-directed work and the university only provides a React course; there is no stated separate-backend requirement. Prefer **Next.js + TypeScript + PostgreSQL + Tailwind CSS + shadcn/ui**, using Next.js for presentation and the application’s server-side operations. Retain clear service/data-access boundaries even though there is one application deployment. Learn React fundamentals before introducing Next.js server concepts.

This is a recommendation for this learner and MVP, not a universal “best stack.” It removes a deployment/API coordination burden without removing the need to understand backend engineering. Next.js server features do not solve permissions, transactions, file handling or operations automatically.

| Area | Beginner explanation | Recommendation and reason |
|---|---|---|
| HTML and CSS | The structure and presentation of a page | Learn the essentials before relying on component generators. |
| JavaScript | The language used for application behavior | Learn objects, arrays, functions, modules, promises and async/await first. |
| TypeScript | JavaScript with compile-time checks about data shapes | Keep; use straightforward types and learn that they do not validate external input. |
| React / Next.js | React builds interactive interfaces; Next supplies routing and server-side application capabilities | Recommended single-application route if no separate-backend constraint exists. |
| Tailwind CSS | Styling utilities applied to elements | Keep, after basic CSS layout is understood. |
| shadcn/ui | Reusable interface component source maintained inside the project | Keep selectively; understand and test forms, keyboard behavior and accessibility. |
| PostgreSQL | Durable relational data storage | Keep; learn tables, keys, joins, constraints and transactions alongside its use. |
| Data-access library | Helps application code query the database | Prisma remains a candidate. Select one maintained compatible tool after reviewing its migration workflow; do not use it to skip SQL learning. |
| Authentication | Identifying the signed-in account securely | Use an established authentication library/service compatible with the chosen topology; review it before selection. Do not invent password or session cryptography. |
| NestJS | A separate structured backend framework | Defer if unconstrained. Keep the existing Next/Nest design if the course requires it or separate API learning is an explicit priority. |
| Redux Toolkit | Shared client state and client API-cache tooling | Defer in the simplified route until a real shared-state problem exists. Use local state and the selected Next data flow first. |
| GSAP | Coordinated animation for a live interface | Defer until the app works and a concrete interaction needs it. It is not required to make a promotional video. |
| Private object storage | Durable storage for uploaded report files | Keep as necessary infrastructure for the lab-result journey, with backend access checks. |
| Testing | Repeatable evidence that behavior works | Use a small set of unit/integration tests and browser journey tests; choose exact tools with the implementation scaffold. |

**Tradeoff:** the Next-only route has fewer moving parts, but frontend/server boundaries still demand discipline, and some hosting limits matter for file upload/inspection. The Next/Nest route gives a clearer independent API and backend framework curriculum, but adds service configuration, contracts, routing and deployment work. Neither requires microservices.

The simplified route has been selected for the current foundation: Next.js, TypeScript and Tailwind are scaffolded in `web/`. PostgreSQL, authentication, shadcn/ui, report storage and deployment remain future work. The architecture documents have been aligned with one application. NestJS, Redux and GSAP remain deferred; no account, booking or report feature exists yet.

Live official-documentation retrieval failed during this planning turn. No current-version, price, licensing or hosting-plan claim is made. Check current official documentation and compatibility when choosing concrete packages/providers.

## How we will work together on every feature

1. **Explain the user outcome.** Name the requirement and use case, what the user does, and what success means.
2. **Teach the next concepts.** Explain only what this task needs, with a small example or request/data-flow sketch. Distinguish browser, server and database responsibilities.
3. **Describe the proposed change.** List the files/layers affected, dependencies, and why this is the smallest useful step. Stop for missing business rules.
4. **Implement when explicitly asked.** One reviewable task at a time; avoid generating an entire system in one pass.
5. **Walk through the important code.** Follow a real action from input to validation, authorization, query/transaction and response. Explain unfamiliar terms in place.
6. **Validate it.** Give actual commands that exist in the repository, expected results, and a manual scenario, including a relevant failure case.
7. **Check understanding.** Ask the learner to explain a boundary or predict an outcome, then make a small supervised change. This is practice, not a gatekeeping exam.
8. **Record and stop.** Update the affected docs, summarize the diff and remaining limitations, and stop at the requested task boundary. Commit only when authorized.

A useful task prompt: “Implement only this requirement after explaining its flow and files. Tell me what each layer does, how to test it, and give me one small exercise. Stop after that task.”

The learner need not understand every framework internal before shipping. They should understand who can access data, why a write is valid, where state lives, how failures behave, and how to verify changes.

## Learning and implementation sequence

These are learning milestones, not replacements for the completed requirements/architecture phases. They have exit criteria rather than invented delivery dates. Weekly availability and course deadlines are still needed for a calendar.

| Milestone | Learn | Build when authorized | Evidence before moving on |
|---|---|---|---|
| 0. Resolve the immediate decisions | Product scope versus implementation detail; frontend/server/database responsibilities | No app code: record the clarified self-directed context, decide stack adoption, initial release audience and critical next-task rules | Learner can draw one booking request and identify missing permissions/booking rules. Architecture reflects one chosen stack. |
| 1. Web and Git essentials | HTML forms, CSS box model/flex/grid, JS values/functions/arrays, promises, HTTP requests, terminal paths, Git diff/status | Small clearly separated learning exercises; they do not count as the application | Learner can modify a form, explain a click handler, inspect a request and read a diff. |
| 2. React and TypeScript essentials | Components, props, state, events, effects, typed objects, loading and error states | A doctor-list/form exercise using visibly synthetic fixtures | Learner can add a field/filter, explain rerenders and distinguish compile-time errors from runtime validation. |
| 3. Project skeleton and early deployment | Routing, project structure, environment configuration, development versus production, build artifacts | Minimal chosen-stack scaffold and non-sensitive deployment smoke page; no simulated complete healthcare app | Clean setup/build works; deployed page loads; no secret appears in the bundle. Record actual setup commands. |
| 4. SQL and persistent data | Primary/foreign keys, joins, indexes, migrations, parameterized queries, transactions | Agreed initial account/profile data model and repeatable migration workflow | Learner can explain an entity relationship, read the generated migration and retrieve a synthetic record. Tests reject invalid relationships. |
| 5. Identity and permissions | Authentication versus authorization; cookie/session flow; resource ownership; safe credential handling | Registration/login and the approved role/ownership foundations | Valid/invalid sessions tested; one user cannot access another’s protected data; learner explains why hiding a button is insufficient. |
| 6. Doctor discovery and maintenance | Form-to-server flow, response DTOs, validation, query filters, empty states | Authorized profiles and availability; search by specialization, symptoms and location; details | Agreed matching fixtures pass for all required criteria. Unauthorized changes fail. No diagnosis logic is invented. |
| 7. Complete physical appointment journey | State transitions, database transactions, concurrent requests, stale data, duplicate submissions | Booking and doctor management together | Patient can book and doctor can access/manage the same persisted appointment. Conflicting concurrent requests obey approved rules. |
| 8. Complete lab-result journey | File versus metadata storage, streaming/limits, ownership checks, partial failures | Authorized upload and own-patient result search/viewing together | Intended patient reads the report; another patient cannot retrieve metadata or bytes; invalid/incomplete uploads never become readable. |
| 9. Complete disease-information journey | Content validation, permitted maintenance, reader projection | Disease maintenance and browsing together | Authorized edits and eligible reads work; unauthorized changes fail. This remains part of V1, despite its secondary priority. |
| 10. Release hardening | Integration/E2E tests, private caching, error handling, logs, dependency review, backup/restore and migrations | Fixes needed for the selected release and deployable operational setup | All agreed journey/security/quality checks pass in staging, including restore/persistence checks. Numerical targets must be agreed, not guessed. |
| 11. Product demonstration and feedback | Product positioning, user interviews, honest claims, usability observation | Synthetic-data demo, screenshots and launch materials when requested | An unfamiliar viewer understands the value and can follow a core journey. Feedback becomes reviewed requests, not automatic scope growth. |
| 12. Launch video and presentation | Storyboarding, screen capture, pacing, captions, motion and music rights | Short videos based on functioning UI when requested | Every demonstrated claim is supported; synthetic data is used; export plays correctly and has readable captions. |

Learn HTML/CSS/JavaScript before React-heavy work, but do not wait to finish a huge unrelated course. Use focused lessons attached to the next milestone. SQL and debugging are as important as visual design. Return to foundations whenever the learner cannot explain an important change.

## Learning resources

Official starting points below are reference links, not a claim of successful live verification in this turn:

- [MDN web development curriculum](https://developer.mozilla.org/en-US/curriculum/): HTML, CSS, JavaScript and browser fundamentals.
- [React Learn](https://react.dev/learn): components, state and event handling.
- [TypeScript for new programmers](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html): where TypeScript fits after JavaScript basics.
- [Next.js Learn](https://nextjs.org/learn): framework practice after the React foundation.
- [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html): tables and SQL.
- [NestJS documentation](https://docs.nestjs.com/): use if the separate-backend path is selected.

Pick the relevant lesson rather than opening all resources at once. Read a short section, apply it, explain the result, and inspect one failure case.

## Are Markdown files a good idea?

Yes. Markdown files are documents, and for developer-facing requirements/architecture they are a good default: readable in an editor, versionable with code, and easy to review as changes. Word/PDF is useful for a formal university submission or presentation; it need not become a second independently maintained requirements source.

The existing documentation is a useful baseline. We should now avoid producing more large speculative documents. Keep the feature boundary and key decisions current; expand details only when they unblock the next implementation task.

| Artifact | Job |
|---|---|
| requirements/MVP-freeze.md | What V1 includes and excludes |
| requirements/SRS.md and supporting catalogs | Required behavior, rules, IDs and unresolved questions |
| architecture/decisions.md and architecture documents | Why the chosen implementation is structured as it is |
| This learning plan | Sequence, teaching agreement and launch preparation |
| Future README, when setup exists | Verified install/run/test/deploy instructions |
| Optional personal learning notes | The learner’s own explanations, mistakes and questions; not mandatory paperwork |

When code changes behavior, update the corresponding requirement/decision and tests. Do not write documentation claiming an unimplemented feature exists. Export submission documents from the maintained material if the course requires them, and retain the original Word plan as source history.

## Marketing and the meaning of SaaS

A polished healthcare web app and a subscription SaaS business are different delivery decisions. The current MVP has no subscription billing, multi-clinic tenancy or clinic-owner administration. Calling a promotional video “SaaS style” does not add those features.

Before choosing commercial features, establish: who experiences the problem, who would use PULSE, who would pay, and what existing workflow it replaces. Patient, independent doctor, laboratory and clinic are different audiences. Choose the first audience through actual conversations rather than promising all of them a complete healthcare platform.

Suggested validation work, not automatic outreach: interview a small number of intended users, show the synthetic-data booking/report journey, observe confusion, and record evidence for changes. Do not send messages, create public accounts, buy services, publish claims or collect real records without a later concrete task and appropriate decisions.

Prepare marketing in parallel with delivery: maintain a one-sentence value proposition, capture real milestones and note user objections. Build a landing page only when its audience and claims are clear and the user asks for it. No new website, analytics collection, waiting list or email campaign is introduced into V1 by this plan.

A deployable demonstration is a useful first milestone. Commercial use with real patient data requires resolving the existing privacy, security, operations and release-context questions; a nice UI or video does not resolve them.

## Animated launch-video plan

The application UI and the video are separate outputs. GSAP controls motion inside a website. A promotional MP4 can instead be made from screen recordings and a video editor, or from a programmatic video tool such as Remotion if repeatable branded variants justify learning another tool. Keep video tooling outside the product runtime. Check current pricing/licensing and music rights before selecting tools/assets.

Start with real screen capture and a simple editor. Consider code-generated videos later, after one working journey exists; do not add a second React/video project before the healthcare application works.

| Deliverable | Story | Materials needed |
|---|---|---|
| Short teaser, roughly 15–20 seconds | Show the problem, one clean interaction, and the resulting benefit | Working synthetic-data screen capture and concise truthful copy |
| Product walkthrough, roughly 45–60 seconds | Find doctor → physical booking → doctor view; show private lab-result access as a separate journey | Working patient/doctor/lab views; clear transitions and captions |
| Longer learning/portfolio demo, roughly 2–3 minutes | Problem, architecture sketch, live journey, what was learned, and current limits | Deployed demo, readable diagram, verified features and limitations |

These durations are creative starting points, not deadlines or requirements. Use cursor highlights, deliberate zooms and readable captions; avoid effects that obscure the interaction. Never show patient data, credentials, unsupported online consultation/payment features, fabricated testimonials or unmeasured performance claims. Clearly label prototype footage if a feature is not implemented. Publishing and distribution require a later explicit request.

## Immediate next step

The university constraint is clarified: this is self-directed work with a React course available. Weekly availability remains unanswered. The simplified stack and architecture foundation are now in place. The next phase should choose one real user journey slice and resolve only the business rules blocking that slice; do not generate all of PULSE at once.

The recommended route is one Next.js application; a separate NestJS backend is no longer recommended merely for this learning goal. No time budget or deadline is assumed. This plan does not alter the frozen product scope or automatically approve unresolved features. The architecture has been updated separately for the one-app direction.

## Current validation and commands

This deliverable is documentation only. The `web/` package manifest now provides `npm run dev`, `npm run lint` and `npm run build`. There is no application test runner or database yet; do not report unexecuted tests as passed.

Read-only inspection from the repository root:

```bash
git status --short
rg -n '^##|^\| [0-9]+\.' docs/learning-plan.md
```

Each implementation task includes actual run/test commands, results and a manual check. This remains the broader learning/launch plan. The frontend now demonstrates all three journeys with fictional shared state; it does not provide production authentication, persistence or a published release. See [delivery evidence](frontend-delivery.md).
