# Big Pulse — connected tester delivery

Updated: 2026-09-29. Scope: a deployable responsive web app with fictional Pakistani providers and documents. Real-patient production acceptance remains separate.

## Recorded direction

The owner requested Big Pulse branding, Google signup and explicitly fictional Pakistani profiles for first testing. The previously delegated booking lifecycle remains Requested → Confirmed/Declined; Confirmed → Completed, with one patient per slot and no overlapping non-declined visits.

Implementation defaults explained before work: Google users start as patients; the owner grants one staff role per account; doctors manage their own profiles/slots; PDFs are at most 10 MB and available only to the patient and uploading lab. These are tester implementation defaults, not clinical production policies.

The owner has neither Google OAuth nor hosting configured and requested setup guidance. The login screen displays this missing setup honestly.

## Implemented journeys

| Journey | Implementation | Existing requirements |
|---|---|---|
| Account → workspace | Better Auth Google integration, PostgreSQL sessions, server role, sign-out, owner CLI | AUTH-001–003, AUTHZ-001 |
| Profile → discovery | Saved profile, public fictional directory, combined filters and current slots | USER-001, DOC-001–002, SEARCH-001 |
| Request → response | Saved availability/bookings, overlap constraints, owner-scoped lifecycle, periodic refresh | SCHED-001, APPT-001 physical, APPT-002 |
| Lab → patient report | Exact reference match, recipient review, private PDF storage, authorized attachment download | LAB-003–004 |
| Editor → reader | Saved drafts/publication and source links; unpublished entries excluded publicly | DISEASE-001–002 |

## Limits

- Live Google consent/callback and a hosted multi-account journey still require external configuration and validation.
- Responsive web app only; no native Android/iOS app.
- Refresh after writes, on focus and every 15 seconds while visible. No WebSocket push, SMS or email notifications.
- Private disk storage requires one app instance and a durable volume. No object-storage adapter, malware scanner or operational backup/restore automation is implemented.
- PDF size, extension and signature checks do not prove safety. Use fictional, trusted documents.
- Snapshots are bounded to 500 doctors/articles, 5,000 visible slots and 1,000 related private records. Larger scale needs pagination.
- No real verification badge, medical review, diagnosis, payments, prescriptions, video or lab-test booking.
- Google manages account recovery. Password/phone/Apple login are not shipped. Email/password is enabled only in isolated automated tests.

## Pakistani data

`db:seed` adds five clearly labelled fictional providers in Karachi, Lahore and Islamabad, PKR sample fees, seven days of Asia/Karachi slots, three existing sourced entries and an NIH Pakistan source link. It does not overwrite edited profiles or bookings.

The owner can associate a Google tester with a seeded doctor using the staff command. Real providers must supply accurate details and publication permission later. The [PM&DC register](https://www.pmdc.pk/) supports registration checks, but no verification workflow is implemented. [NIH Pakistan advisories](https://www.nih.org.pk/advisories) supply relevant source material. Symptom tags are browsing aids, not diagnosis.

## Validation

Final results are recorded after delivery checks finish. Tests own an isolated PostgreSQL cluster with fictional records. They do not contact Google or modify the application database. No remote CI run is claimed.

The browser tool rejected the localhost tab under its URL policy. No workaround was attempted. Visual, keyboard, mobile and live Google-to-UI journeys remain unverified; HTTP checks do not replace them.

Run `npm run check:all`, `npm run db:check` and `git diff --check`. Read [deployment steps](deploy-tester.md) and [file responsibilities](connected-app-guide.md).
