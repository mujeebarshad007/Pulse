# Connected tester MVP

Date: 2026-09-28. Requested goal: complete the existing journeys through private report storage so invited people can test them. This is a tester release, not a real-patient production launch.

## Current state

The glass frontend works with fictional in-memory records. PostgreSQL foundation and internal appointment services exist. The frontend is not connected to them. Authentication, account provisioning, persistent profiles/content and private reports are not implemented. No preview has been deployed.

Scheduling was implemented under the owner's prior delegated booking decision. No new account/report rules have been silently approved.

## One pending tester policy decision

The owner has been asked to approve the following package, or specify a different policy:

- Invite-only testing with fictional patient/report data.
- Email/password entry; owner-provisioned doctor, laboratory and content-editor accounts.
- Doctors maintain their own profiles.
- Labs associate a private PDF, at most 10 MB, with an existing patient.
- Access is limited to that patient and the uploading lab.

Status: **[NEEDS CLARIFICATION]**. Google/phone login needs provider configuration; no credentials or provider accounts have been created. Report inspection/publication behavior and the deployment host must be resolved before those integrations. A maintained authentication library is being evaluated; Better Auth has compatible PostgreSQL and Next.js integrations, but is not installed or selected yet.

## Completion sequence after the policy decision

1. Add account/session persistence, controlled tester provisioning, server identity and resource permissions.
2. Persist patient and doctor profiles; connect profile forms and the existing directory with appropriate public data projections.
3. Connect existing availability, booking and appointment screens to the tested services. Replace client personas with authenticated identity.
4. Persist sourced health-information drafts and publication through the existing editor.
5. Store report metadata in PostgreSQL and bytes outside public assets, with authorized upload/download, size/type checks, agreed inspection and failure cleanup.
6. Verify independent accounts, refresh persistence, unauthorized direct requests, concurrent bookings, private downloads and complete UI journeys.
7. Choose a host/account, configure its secrets privately and prepare a concrete preview release. A local URL is not a shareable hosted application.

These steps implement the existing MVP journeys. Payments, video consultations, prescriptions, diagnoses, pharmacy, lab-test booking and invented AI clinical features remain outside this delivery.

## Doctor details and Pakistan-focused content

The existing doctor profile form already has name, specialty, qualifications, experience, clinic, city, fee, biography and manually assigned symptom tags. Its current records are fictional and edits last only for the browser session. Once connected, the doctor account will maintain its own saved profile under the approved provisioning policy.

For real providers later, collect accurate information directly from the doctor/clinic with permission to publish. Check registration/licence and registered qualifications through the [PM&DC practitioner register](https://www.pmdc.pk/). A profile entry alone is not proof of verification. A formal verification state/process is not implemented and must be specified before displaying a verification badge. Do not scrape or copy Oladoc's profiles, reviews or photographs.

The information editor supports a category, symptoms, summary and source link. Pakistan-focused information should be maintained from authoritative sources such as [NIH Pakistan advisories](https://www.nih.org.pk/advisories), with clinical review before use as real patient-facing content. Categories and symptoms are browsing aids, not diagnosis. No disease prevalence ranking, automatic symptom-to-diagnosis mapping or claim that an entry is medically reviewed has been introduced.

Use [Oladoc](https://oladoc.com/) as a workflow reference. “Better” needs tester evidence: successful discovery, clear booking status, understandable error recovery and correct report access. No claim of market superiority or unprecedented features is made.

## Validation and learning

Run from the repository root:

```bash
npm run check:all
npm run db:migrate
npm run db:check
git diff --check
```

Validation: `npm run check:all` passed ESLint, all 15 frontend domain tests, the Next.js build/type check and all 14 PostgreSQL integration tests. Migration 0002 was applied to the isolated local development database. No UI files changed in this scheduling slice; earlier frontend browser limitations remain in `frontend-delivery.md`. No end-to-end account/storage verification is claimed.

Read `web/src/server/appointments.ts` alongside `web/database/migrations/0002_appointments.sql`. The service handles user intent and transactions; database constraints arbitrate competing writes. `web/tests/backend/appointments.test.ts` demonstrates both. Explain why a server-derived identity is still required even when database constraints prevent double booking.
