# PULSE — Delivery roadmap

**Current checkpoint, 2026-09-29:** Big Pulse now has the connected tester implementation for P-09–P-20: Google auth integration, server permissions, saved profiles/appointments/content and private PDFs. Live OAuth and hosting are not configured. Next: follow [Google/hosting setup](deploy-tester.md), verify the full multi-account browser journeys, then share the tester link. No production healthcare launch or marketing publication is complete. The detailed phase table below preserves earlier planning statuses; [tester-mvp.md](tester-mvp.md) is the authoritative current delivery record.

Prepared: 2026-09-27. This is a plan for future user-invoked work, not authorization to execute every task now.

Read alongside [learning-plan.md](learning-plan.md), [MVP-freeze.md](requirements/MVP-freeze.md), and [prompt-pack.md](prompt-pack.md).

## Current checkpoint — use this first

The complete **fictional-data frontend implementation** now exists: landing/account forms, patient, doctor, laboratory and content workspaces, connected demo journeys, shared controls, guided walkthrough, domain tests and repository CI configuration. The selected direction develops Air into a readable glassmorphism UI. Original design samples remain at `/design-preview`.

This corresponds to the frontend foundation, design and feature-screen phases in the pasted plan (Phases 13–15); it does not complete backend-dependent production acceptance. Read [frontend delivery](frontend-delivery.md) for the exact boundary and remaining browser checks, and [the frontend learning guide](frontend-learning-guide.md) to understand each file. UI-02 has been implemented as a bounded demo; no further visual-selection approval is needed to explain the current result.

The one-app Next.js architecture remains selected; P-00 is complete. P-05 now includes runnable frontend code, local tests and CI configuration, while hosting/production-policy prerequisites remain unresolved. Product P-09–P-20 are still future real-data implementation tasks, even though their interfaces are present. No deployment or marketing publication has occurred.

Next: review/learn one demo journey, then run P-01 to settle release context and immediate production rules. The [prompt pack](prompt-pack.md) continues through persistence, real journeys, staging, deployment and marketing. Use one prompt at a time.

## Four delivery stages

1. **Learn and set up — P-00–P-08.** Reconcile architecture, answer immediate questions, practice essentials, create a minimal scaffold, deploy an early preview and establish persistence.
2. **Build complete journeys — P-09–P-21.** Establish identity/permissions, deliver physical appointment workflow, lab upload-to-patient access, and disease maintenance-to-reader access. Then polish existing behavior.
3. **Prove and release — P-22–P-23 and P-26–P-27.** Verify security/integrity, staging operations, recovery and an exact production release.
4. **Prepare and launch marketing — P-24–P-25 and P-28–P-29.** Create truthful positioning/page/video assets once working UI exists, publish to explicitly selected destinations, then review results.

Marketing preparation can overlap release hardening when its dependencies are met. It does not justify publishing an unfinished capability. Video tooling is separate from application dependencies. A synthetic-data deployed demo and a real-patient commercial release have different acceptance requirements; decide the intended release context first.

## Task sequence and exit evidence

| Prompt | Task | Prerequisites | Completion evidence | Status |
|---|---|---|---|---|
| P-00 | Align architecture with the simpler stack | Existing requirements and learning plan | Consistent Next.js-only architecture | COMPLETE (2026-09-27) |
| P-01 | Resolve first-release context and immediate blockers | P-00 | Recorded answers or clearly blocked decisions | IN PROGRESS: release context, account provisioning and sign-in questions sent; answers pending |
| P-02 | Learn the foundations needed for the first slice | P-01; may accompany later work | Small exercises understood; no full app generated | NOT STARTED |
| P-03 | Map complete screens and journeys | P-00, P-01 | Small screen/flow plan matching frozen journeys | NOT STARTED |
| P-04 | Choose compatible implementation libraries and hosting approach | P-00, P-01 | Recorded minimal dependency choices and deployment fit | NOT STARTED |
| P-05 | Create the minimal application scaffold | P-00 through P-04 resolved for full task | Runnable minimal app with verified setup | PARTIAL: frontend demo, 15 tests and CI config exist; production policy/hosting choices remain |
| P-06 | Deploy an early non-sensitive preview | P-05; selected host/account/budget | Verified preview or concrete ready-to-deploy package | NOT STARTED |
| P-07 | Design the initial relational model | P-01, P-04; identity/profile policies settled | Reviewed initial entity relationships and migration plan | NOT STARTED |
| P-08 | Implement initial persistence and migrations | P-07 settled; selected development database available | Repeatable migrations and isolated synthetic fixtures | PARTIAL: infrastructure and appointment schema/services tested; account/profile/content/report schema pending |
| P-09 | Implement authentication | P-08; Q-005 and integration choices resolved | Working approved account/session flow | NOT STARTED |
| P-10 | Implement resource permissions and patient information | P-09; Q-004/Q-019 rights and onboarding settled | Server-enforced policies and usable patient records | NOT STARTED |
| P-11 | Build doctor profile maintenance and details | P-10; Q-006 public fields/ownership settled | Authorized maintained profiles and safe details | NOT STARTED |
| P-12 | Implement all required doctor search criteria | P-11; Q-008 matching/access rules settled | Verified specialization, symptom and location discovery | NOT STARTED |
| P-13 | Resolve schedule and booking policy; design its data model | P-10, P-11; current Q-009/Q-010 reviewed | Approved policy and transaction design | PARTIAL: delegated lifecycle/concurrency policy implemented internally; identity/profile integration pending |
| P-14 | Build authorized availability management | P-13 resolved | Persistent availability used by discovery | PARTIAL: internal database service tested; authenticated UI pending |
| P-15 | Build physical appointment booking | P-12, P-14; transaction/state rules settled | Persisted authorized booking that respects capacity | PARTIAL: transactional service/concurrency constraints tested; authenticated UI pending |
| P-16 | Complete doctor appointment management | P-15; approved management actions | Complete patient-to-doctor appointment journey | PARTIAL: internal ownership/lifecycle service tested; authenticated UI pending |
| P-17 | Resolve lab-report policy and storage design | P-10; Q-016/Q-019/Q-020 reviewed | Approved upload/access rules and failure plan | NOT STARTED |
| P-18 | Implement safe authorized report upload | P-17 settled; private development storage available | Durable validated uploads with correct association | NOT STARTED |
| P-19 | Complete private patient report access | P-18 | Complete laboratory-to-patient report journey | NOT STARTED |
| P-20 | Build maintained disease information | P-10; Q-014 and reader access settled | Complete maintained-content-to-reader journey | NOT STARTED |
| P-21 | Polish the existing journeys | P-16, P-19, P-20 | Consistent usable interface without feature expansion | NOT STARTED |
| P-22 | Validate security and full release behavior | P-21; agreed security/quality criteria | Traceable test results and fixed in-scope defects | NOT STARTED |
| P-23 | Prepare staging operations and prove recovery | P-22; host/storage/backups and recovery targets selected | Production-like staging with proven migrations and restore | NOT STARTED |
| P-24 | Prepare positioning and a marketing page | P-01 audience decision; P-16/P-19/P-20 real behavior; P-21 visual baseline | Reviewable landing-page draft and truthful copy | NOT STARTED |
| P-25 | Create animated product demo videos | P-24; stable synthetic-data UI and approved story/assets | Playable reviewed teaser and walkthrough | NOT STARTED |
| P-26 | Prepare the production release for review | P-23; confirmed audience/data context; approved requirements | Concrete release package and explicit go/no-go evidence | NOT STARTED |
| P-27 | Deploy the agreed production release | P-26 passes; exact target/revision authorized | Verified live application or documented rollback/failure | NOT STARTED |
| P-28 | Publish the approved marketing materials | P-24/P-25 approved; P-27 live; named channels/accounts supplied | Verified approved launch assets at specified destinations | NOT STARTED |
| P-29 | Review the launch and prioritize maintenance | P-27; P-28 if marketing launched | One review with evidence-based next actions | NOT STARTED |

## Guardrails that keep this achievable

- Preserve the frozen product boundary. Disease information is included; online consultations, diagnosis, prescriptions, payments, lab-test catalog/booking and broad doctor history are not V1 tasks.
- Do not invent role onboarding, record permissions, slot capacity, appointment transitions, symptom matching, upload limits or publication rules. Resolve them at their prerequisite task and synchronize the existing documents.
- Implement the smallest useful slice, but do not call an isolated page a finished journey. P-16, P-19 and P-20 are end-to-end completion checkpoints.
- No billing, multi-clinic tenancy or subscription management is implied by marketing PULSE with a “SaaS-style” video. Those are separate product decisions.
- Keep credentials outside chat and source. Use protected configuration workflows. Never seed reusable real credentials or patient data into examples/tests/videos.
- Compare current official documentation before selecting volatile versions, providers, pricing or licenses. Do not install multiple competing tools for the same responsibility.
- Updating the roadmap to COMPLETE requires evidence; a generated file or claimed test without execution is not enough.

## Teaching contract

Every implementation task starts with a plain-language explanation of the requirement, concepts, data flow and proposed files. It ends with the actual changes, why they work, exact runnable checks, results/limitations, one small exercise and a stop. Explanations should accompany the work rather than postpone coding until an entire course is finished.

P-02 is reusable: if a later task reveals a missing foundation, teach that concept and return to the same task. Do not make the learner memorize the stack before beginning. The learner should progressively be able to trace a request, identify the permission check, explain a data constraint and diagnose a failure.

## How to use the prompts

Open [prompt-pack.md](prompt-pack.md), select the next task whose prerequisites are satisfied, and paste that prompt into this chat. Here, “Run P-00 from docs/prompt-pack.md” is also sufficient. The prompt pack is reference text; creating or reading it does not execute its instructions.

Use the resume/review helpers when returning after a break or when a change fails. Do not paste all prompts as one giant instruction. Keep implementation and publication tasks separate so the result remains reviewable.

## Validation of this plan

The pack contains 30 numbered tasks, P-00 through P-29, and optional learning/debug/review helpers. Each numbered task specifies dependencies, an expected result, learning focus and a bounded prompt. The architecture and app were later updated in the first coding slice; this table records the resulting status.

Current read-only checks:

```bash
rg '^## P-' docs/prompt-pack.md
rg '^\| P-' docs/delivery-roadmap.md
git status --short
```

The frontend has 15 domain tests. From the root, `npm run check` runs lint, tests and build. `npm run test:backend` runs 14 real PostgreSQL integration tests. Authentication and automated browser journey suites remain later tasks.
