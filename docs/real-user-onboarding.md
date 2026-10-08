# From fictional testing to real users

2026-10-08. This is a rollout plan, not approval to collect real patient records. No records were deleted, real providers imported or production policies automatically changed.

## What already exists

| Person | Current account path | Current limitations |
| --- | --- | --- |
| Patient | Google sign-in → server-created patient account → complete name/city/profile → request a visit | Live hosted Google callback still needs acceptance; the displayed services are fictional |
| Doctor | Signs in and opens workspace once → owner assigns doctor role → signs in again → maintains profile and availability | No reviewed real-provider onboarding/publication workflow; new profiles still default to fictional |
| Laboratory | Signs in and opens workspace once → owner assigns lab role → signs in again → publishes offerings and slots → confirms visits/uploads private PDFs | Real partner/location/preparation approval, report operations and real-data acceptance remain unresolved |
| Editor | Existing account receives owner-assigned editor role → maintains sourced content | Clinical content review responsibilities must be agreed before public health publishing |

The owner command is `npm run staff -- ACCOUNT_EMAIL doctor` (or `lab` / `editor`). This grants privileged access and must be used only for a person the owner has approved. Existing sessions are revoked and the person signs in again. Do not use the optional fictional-doctor ID to disguise a seeded profile as a real clinician.

Patients do not need manual database entry: their Google account creates their member/patient record. Staff cannot self-promote from a browser control. A public signup is an account, not proof of a doctor's professional registration.

## How to replace dummy data safely

1. Keep the existing tester site/database for demonstrations. Create a separate production database and private storage with its own credentials and backups.
2. Run schema migrations against the new database. **Do not run `db:seed` there:** that command intentionally adds fictional doctors, slots and library entries. Do not delete test rows or flip every `fictional` flag in the existing database.
3. Agree the real-provider onboarding rules below, then implement a review/publication step. Provider names, qualifications, clinic details, fees and available times must come from participating providers with permission to publish.
4. Update the presentation and data model deliberately: real/fictional labeling, publication state and inactive providers must be consistent in search, assistant, booking and staff screens. Current labels/defaults are tester behavior; simply hiding the preview banner is not this implementation.
5. Validate the hosted Google callback, patient/staff isolation, concurrent bookings, cancellation, lab results and report downloads with separate approved test accounts before inviting a small real-user pilot.
6. Share the HTTPS URL. Users sign in themselves. Expand after operational acceptance and feedback; no automatic public launch is implied.

## Decisions still needed before that implementation

- Who checks each doctor's identity, registration, specialty and permission to publish, and how are renewals/suspensions handled?
- Who approves laboratory branches, test information, preparation instructions, prices and account access?
- Will the first real pilot support adults only? If minors/dependents are included, who may consent, book and see their information?
- Which notices/consents, retention/deletion rules and complaint/support process apply? Obtain relevant privacy/healthcare advice before collecting real records.
- Who handles incorrect uploads, wrong-patient reports, cancelled appointments and disputes? What are the support and incident response responsibilities?
- What are the backup/recovery targets, malware scanning/quarantine process, audit requirements and monitoring/alert ownership?
- Which AI use is permitted for real visitors, under what provider contract and data policy? Unpaid Gemini must not receive personal medical information; disabling AI questions for the real pilot is a valid option. Local sourced education does not need an external model.

Payments, messaging, video, prescriptions and phone OTP remain separate unimplemented features. They are not required to explain account creation and are not silently approved here.

## Suggested first pilot

After the above gates are settled and implemented, start with a small group of participating doctors/labs and invited adult patients, limited to discovery and appointment requests. Treat this as a proposal for owner approval, not an accepted age or service policy. Collect interface feedback separately from clinical records. Do not accept private real PDFs until report-security and operational acceptance are complete.

Learning exercise: trace Google session → `memberForUser` in `web/src/server/auth.ts` → `pulse.members`/`pulse.patients`. Compare that automatic patient creation with the owner-only staff command. Explain why authentication and professional verification are different steps.
