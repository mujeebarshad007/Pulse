# Lab visits and condition education — 2026-10-06


**2026-10-08 update:** Google configuration syntax now passes `npm run auth:check`. Earlier placeholder findings below are historical. Live OAuth is still unverified. Release preflight currently stops for `OPENAI_API_KEY` and `OPENAI_MODEL`.

The owner approved [LABPOL-001–010](requirements/lab-booking-policy.md) and general condition education. These extend the connected fictional tester; real-patient production acceptance remains separate.

## Complete lab journey

1. Complete [Google setup](login-recovery.md). Patient and lab testers sign in once. The owner grants the lab role with `npm run staff -- lab-tester@example.com lab`, substituting that tester's account privately. They sign in again after the grant.
2. The lab opens **Lab tests & visits**, creates a fictional offering, supplies its lab name/city/address, category, preparation text and PKR price, publishes it and adds a future slot in Pakistan time.
3. A patient completes their profile, searches `/labs`, reads details, selects a slot and reviews the request before submitting. The status is **Requested**, not confirmed.
4. The owning lab confirms or declines. Patients can cancel before the start; labs can cancel before the start with a reason. Cancellation/decline releases capacity. A new request is separate from a cancellation; there is no atomic reschedule action.
5. A confirmed visit can be marked Completed by its lab after its start. Unanswered requests expire at the slot start during booking/status operations. History remains. There is no notification service or background expiry timer guarantee.
6. Upload a trusted fictional PDF through the existing lab report flow using the exact patient reference. Select it on the Confirmed/Completed lab booking to link it. Only the patient and uploading lab can download it. Completion does not imply that results are ready.

The catalog begins empty until staff publish offerings. No real partners, prices or clinical instructions are invented. Price edits apply to new requests; existing visits retain the saved price. One patient per slot and no overlapping active patient lab visits are enforced in PostgreSQL. Duplicate submission retries return the original booking.

The attached lab task was treated as reference material, not as instructions overriding the frozen scope. Its immediate-confirmation wording was resolved by owner approval: doctor and laboratory visits need staff approval. Distance search, home collection and online payments remain excluded. Empty lab filters browse published offerings; unmatched filters offer clearing, without recommending medically interchangeable tests. Punctuation in ordinary names is accepted as text, never SQL.

Doctor search also now supports minimum/maximum PKR fees and an available-slot filter, combined with existing filters. An invalid fee range produces an explanation.

## Assistant scope

**EXP-AI-002 (approved):** general education about a condition explicitly named by the user, plus clinician navigation. No diagnosis, prescriptions, test recommendations, report interpretation or automatic clinical actions.

Initial coverage is high blood pressure and atopic eczema. **Sourced education** buttons work locally without Google or an AI key. AI questions need a session, API configuration and explicit consent that includes any condition name entered. The app stores neither conversation history in its database nor report content in browser storage. Provider retention remains governed by provider terms; `store:false` is not a zero-retention guarantee.

The model selects an intent and a restricted condition ID. The server requires that the user actually named the selected condition, then returns fixed source-based educational text. Unsupported topics ask which condition the user means and offer the library/directory; the app does not invent medical answers. It never infers a condition from symptoms or selects a doctor as a clinical recommendation.

Sources checked 2026-10-06: [NHS high blood pressure](https://www.nhs.uk/conditions/high-blood-pressure/) and [NHS atopic eczema](https://www.nhs.uk/conditions/atopic-eczema/). These general sources do not establish a person's diagnosis or Pakistani healthcare availability. Provider response formatting follows [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## File responsibilities

All code paths below are under `web/`.

| File | Responsibility |
| --- | --- |
| `database/migrations/0006_lab_bookings.sql` | Lab offerings, slots, bookings and report links, with concurrency/overlap constraints |
| `src/server/labs.ts` | Validated commands, roles, ownership, transactions, price snapshots and approved transitions |
| `src/app/api/labs/route.ts` | Bounded same-origin authenticated writes; public catalog and owner-scoped private reads |
| `src/features/pulse/labs-model.ts` | UI types, combined filters and Pakistan-time formatting |
| `src/features/pulse/labs-page.tsx`, lab page route | Search/details, request review, patient/lab status controls, catalog forms and linked reports |
| `src/features/pulse/condition-education.ts` | Small sourced knowledge set and deterministic explanations/clarifications |
| `src/server/assistant.ts`, assistant page | Strict education intent, condition-name check, consent and sourced buttons |
| `src/features/pulse/model.ts`, patient pages | Combined doctor fee/availability filters |
| Shell, landing and journey components | Discoverable lab navigation |
| `scripts/release-check.mjs` | Preflight verifies lab migration tables |
| Lab, assistant and search tests | Concurrency, privacy, retries, expiry, price retention, filtering and safe educational replies |

No runtime dependencies were added. Current implementation bounds: lab slots up to four hours, amounts up to PKR 1,000,000, 60 lab commands/account/minute, snapshots of at most 500 offerings, 2,000 future slots and 1,000 private bookings. These bounds do not establish production scale targets.

Learning exercise: follow request review → `/api/labs` → transaction → database constraint. Explain why a disabled button cannot prevent double booking. Then trace a model-selected condition through explicit-name validation to sourced text.

## Validate and deploy

```bash
npm run db:local:start
npm run db:migrate
npm run db:seed
npm run check:all
npm run auth:check
npm run release:check
npm run package:netlify
npm run start
```

Google still has a placeholder client secret in the inspected local setup. Real Google/AI configuration, hosted PostgreSQL/Netlify, live cross-account acceptance, partner onboarding, controlled preparation information, retention/deletion, malware handling, backup restoration and security review remain production gates. Do not remove fictional labels instead of completing these steps. Follow [Netlify setup](netlify-deployment.md).
