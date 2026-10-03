# Pulse — connected tester delivery

Updated: 2026-10-03. Scope: a deployable responsive web app with fictional Pakistani providers and documents. Real-patient production acceptance remains separate.

## Recorded direction

**Latest login finding:** the Google client secret is a placeholder, despite all variable names being present. Live sign-in is blocked until the owner replaces it privately. Read [login recovery](login-recovery.md). Readiness checks now catch this; OAuth failures have safe explanations and workspace connection errors offer Retry instead of silently returning to login.

The owner requested Pulse branding, Google signup and explicitly fictional Pakistani profiles for first testing. The previously delegated booking lifecycle remains Requested → Confirmed/Declined; Confirmed → Completed, with one patient per slot and no overlapping non-declined visits.

Implementation defaults explained before work: Google users start as patients; the owner grants one staff role per account; doctors manage their own profiles/slots; PDFs are at most 10 MB and available only to the patient and uploading lab. These are tester implementation defaults, not clinical production policies.

The owner initially requested Google and hosting setup guidance. Google settings are now present locally; a real consent/callback journey and hosted deployment have not been verified. The login screen checks configuration availability.

## Implemented journeys

| Journey | Implementation | Existing requirements |
|---|---|---|
| Account → workspace | Better Auth Google integration, PostgreSQL sessions, server role, sign-out, owner CLI | AUTH-001–003, AUTHZ-001 |
| Profile → discovery | Saved profile, public fictional directory, combined filters and current slots | USER-001, DOC-001–002, SEARCH-001 |
| Request → response | Saved availability/bookings, overlap constraints, owner-scoped lifecycle, periodic refresh | SCHED-001, APPT-001 physical, APPT-002 |
| Lab → patient report | Exact reference match, recipient review, private PDF storage, authorized attachment download | LAB-003–004 |
| Editor → reader | Saved drafts/publication and source links; unpublished entries excluded publicly | DISEASE-001–002 |

## Limits

The owner has now requested a broader production marketplace, messaging and AI. [Production expansion and decisions](requirements/production-expansion.md) records that request without treating unanswered policies as accepted. The implementation below is still the tester baseline; production completion is not implied.

- Live Google consent/callback and a hosted multi-account journey still require external configuration and validation.
- Responsive web app only; no native Android/iOS app.
- Refresh after writes, on focus and every 15 seconds while visible. No WebSocket push, SMS or email notifications.
- Netlify Blobs storage and chunked uploads are now implemented; standalone local storage still needs a durable volume. No malware scanner or operational backup/restore automation is implemented. See [Netlify deployment](netlify-deployment.md).
- PDF size, extension and signature checks do not prove safety. Use fictional, trusted documents.
- Snapshots are bounded to 500 doctors/articles, 5,000 visible slots and 1,000 related private records. Larger scale needs pagination.
- No real verification badge, medical review, diagnosis, payments, prescriptions, video or lab-test booking.
- Google manages account recovery. Password/phone/Apple login are not shipped. Email/password is enabled only in isolated automated tests.

## Pakistani data

`db:seed` adds five clearly labelled fictional providers in Karachi, Lahore and Islamabad, PKR sample fees, seven days of Asia/Karachi slots, three existing sourced entries and an NIH Pakistan source link. It does not overwrite edited profiles or bookings.

The owner can associate a Google tester with a seeded doctor using the staff command. Real providers must supply accurate details and publication permission later. The [PM&DC register](https://www.pmdc.pk/) supports registration checks, but no verification workflow is implemented. [NIH Pakistan advisories](https://www.nih.org.pk/advisories) supply relevant source material. Symptom tags are browsing aids, not diagnosis.

## Historical validation (before the Netlify/AI update)

Validation passed: `npm run check:all` (ESLint, 15 frontend domain tests, optimized build/type checking and 25 PostgreSQL/backend tests). A subsequent build passed without tracing warnings after excluding dynamic private-directory paths from packaging. The local database migration, fictional seed and connection check passed. Tests own an isolated PostgreSQL cluster with fictional records; they do not contact Google or modify the application database. No remote CI run is claimed.

The standalone production server started on port 3000. HTTP checks returned 200 for the home page, login, directory, library, health and a JavaScript asset. The anonymous workspace has no patient, appointment or report records and uses `private, no-store`; an unauthenticated PDF request returns 401. The original clinic branding migration is applied locally, preserving edited profile fields. No Docker engine is available here, so the image recipe is not build-verified.

The browser tool rejected the localhost tab under its URL policy. No workaround was attempted. Visual, keyboard, mobile and live Google-to-UI journeys remain unverified; HTTP checks do not replace them.

Run `npm run check:all`, `npm run db:check` and `git diff --check`. Read [deployment steps](deploy-tester.md) and [file responsibilities](connected-app-guide.md).

## Feature discoverability update

The home page now links directly to appointments, reports, doctor and laboratory workspaces as well as discovery and the library. Guest navigation includes Features & workspaces (`/journey`), showing all six existing experiences and their account requirements. This page explains missing Google configuration. No authorization bypass, messaging or AI integration is included in this navigation update.

Validation for this update: `npm run check` passed (lint, 15 domain tests and optimized build/type checking); `git diff --check` passed. The local server/database were restarted after the directory showed a fetch failure. Browser access succeeded in the existing doctor tab: five fictional providers loaded, Features & workspaces opened with Enter, a doctor-workspace link presented the sign-in gate, and all home-page feature links were inspected. At 390px width the six workspace cards formed one column and the document did not overflow horizontally; Tab advanced from the patient link to the doctor link. Screenshot rendering during viewport changes was inconsistent, so full mobile visual acceptance is still pending. The temporary viewport override was reset. These checks supersede the earlier blanket browser-blocked status for these particular guest pages only; authenticated, cross-browser and full mobile journeys remain pending.

## Netlify, assistant and design update — 2026-10-03

The owner approved a directory/booking assistant with no diagnosis, prescriptions or private report access. `/assistant` now includes public quick guides plus authenticated, consent-based OpenAI integration. Missing configuration is shown explicitly; no live AI result is claimed. The homepage and shared visual theme now use cream/sage glass surfaces and restrained CSS animation with reduced-motion fallbacks. Homepage city/name/specialty searches flow into directory filters.

Private 10 MiB PDFs can be sent in 2 MiB pieces and persisted through a Netlify Blobs adapter. New PostgreSQL tables provide upload staging and shared request limits. Netlify source packaging excludes local state and secrets. Google authentication was already integrated; live Google consent/callback validation remains outstanding.

Current validation: `npm run check:all` passed 46 tests (15 frontend + 31 backend), lint and production build. New database migration and fictional seed passed locally. Read [release evidence and remaining gates](release-readiness.md), [Netlify setup](netlify-deployment.md) and [new file responsibilities/learning exercise](netlify-learning-guide.md). These updates supersede earlier statements that there was no object-storage or AI integration.
