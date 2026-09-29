# Pulse — requested production expansion

Status: requested expansion; detailed policies and release acceptance remain pending. This is not a production-readiness claim.

The owner requested Oladoc-style feature coverage, messaging, an AI assistant and a market release. This expands the previously frozen V1 intent. Existing implementation remains a fictional-data tester. Unanswered policies below are not silently resolved by the expansion request.

## Share the current tester

`localhost:3000` addresses the viewer's own computer. Sending it to another person does not share this running app. A persistent shared test needs an HTTPS host, hosted PostgreSQL, private durable file storage and configured Google callbacks. Follow [the deployment guide](../deploy-tester.md). No host account, live URL or Google client has been provisioned.

Sign in with separate patient, doctor, lab and editor accounts, then exercise booking → doctor response and lab upload → patient download. Use fictional profile details and trusted fictional PDFs. Verify restart persistence and denied cross-account access before inviting a broader group. The built app does not contain a public role-switching bypass.

## Why guest mode seemed limited

The guest navigation showed doctor discovery, the library and sign-in. Appointments, profiles, private reports and staff screens already exist but require a server session and appropriate role. Google configuration is missing. The new Features & workspaces link points to `/journey`, which exposes all existing journeys and explicitly explains access requirements. Home cards also link directly to the relevant workspaces. These links do not grant permissions.

## Public reference and gaps

Reference: [Oladoc public home page](https://oladoc.com/), inspected during this review. Publicly advertised capability is evidence of the product surface, not access to its internal business rules, implementation or an exhaustive account-only inventory. No profiles, reviews or medical content were copied.

| Capability | Pulse status | Decision or dependency before delivery |
| --- | --- | --- |
| Doctor discovery, profiles, physical booking | Implemented for fictional testing; live role journeys pending | AUTH-001–003, AUTHZ-001, DOC-001–002, SEARCH-001, SCHED-001, APPT-001–002: Google configuration, real provider onboarding and acceptance testing |
| Private reports and health information | Implemented for fictional testing | LAB-003–004, DISEASE-001–002: upload safety, retention, corrections, content governance for real use |
| Phone login/OTP | Oladoc publicly exposes phone authentication; Pulse uses Google integration | [NEEDS CLARIFICATION] Required login methods, SMS provider, recovery and abuse limits; provider credentials and cost |
| Cancellation/rescheduling | Not implemented | [NEEDS CLARIFICATION] Eligibility, time cutoff, doctor changes, refunds, race conditions and notifications; do not copy a competitor's policy automatically |
| Video consultations | Publicly advertised by Oladoc; Pulse CONS-001 deferred | [NEEDS CLARIFICATION] Provider, participant access, consent, recording policy, no-show rules and connection failures |
| Lab catalog, booking and home collection | Publicly advertised by Oladoc; Pulse LAB-001–002 deferred | [NEEDS CLARIFICATION] Participating labs, catalog/price ownership, capacity, collection geography, booking lifecycle and cancellation |
| Payments | Pulse PAY-001 deferred | [NEEDS CLARIFICATION] Gateway, merchant account, charge timing, refunds, reconciliation and failed/duplicate webhook outcomes |
| Electronic prescriptions | Pulse RX-001–002 deferred | [NEEDS CLARIFICATION] Verified clinician authority, required content, signing, corrections, patient access and operational review |
| Doctor access to broader history | Pulse HIST-001 deferred | [NEEDS CLARIFICATION] Patient consent, record scope, expiration, revocation and audit |
| Medicine information, procedures, hospital services and wellness | Advertised on Oladoc; not specified in Pulse's frozen release | [NEEDS CLARIFICATION] Which complete journeys belong in Pulse, authoritative content/data and service operators |
| Notifications | Not implemented; Pulse currently refreshes visible workspaces every 15 seconds | [NEEDS CLARIFICATION] Events, channels, preferences, delivery retries and providers |
| Patient–doctor messaging | Newly requested | EXP-MSG-001 below; participant/lifecycle/retention decisions pending |
| AI assistant | Newly requested | EXP-AI-001 below; scope, provider, budget and data handling pending |

## New requirement placeholders

- **EXP-MSG-001:** Provide messaging. [NEEDS CLARIFICATION] Proposed first slice: private text conversations between a patient and their confirmed appointment's doctor, without attachments. Owner must decide access after completion/cancellation, retention/deletion and abuse handling. Proposed acceptance: only the two permitted members read/send; unrelated accounts cannot enumerate conversations; duplicate retries do not duplicate messages; failed sends remain recoverable. Not implemented or accepted.
- **EXP-AI-001:** Provide an AI assistant. [NEEDS CLARIFICATION] Proposed first slice: public-directory search, booking guidance and Pulse feature help; no diagnosis/prescribing and no private report submission. Owner must confirm scope and choose/provision an AI provider with an operating budget. Proposed acceptance: recommendations reference existing directory records; availability is rechecked before booking; no invented appointments; no automatic clinical decisions; provider timeout, quota and unavailable configuration have clear outcomes. Not implemented or accepted.

Medical diagnosis in DIAG-001 remains undefined. An AI label does not resolve that requirement. A maintained clinical workflow needs appropriate professional oversight before real use.

## Non-functional release gates

| Existing requirement | Evidence already available | Remaining release evidence/decision |
| --- | --- | --- |
| SEC-001 confidentiality | Ownership checks and isolated backend tests | Real-data access/consent policy, review of all added endpoints, audit strategy and cross-account browser tests |
| SEC-002 security controls | Session integration, same-origin writes, bounded uploads, validated commands | Live OAuth validation, operational secrets, abuse protection, malware handling, retention/deletion and security review |
| UX-001 usability | Shared responsive controls and workflow UI | Complete patient/staff tasks with keyboard and phone layouts; resolve usability failures |
| COMPAT-001 browser/device support | Web application built | [NEEDS CLARIFICATION] Supported browsers/devices and recorded tests on that matrix |
| PERF-001 performance | Successful build; bounded current queries | [NEEDS CLARIFICATION] Dataset size, concurrent users and response/upload targets; load tests against those targets |
| REL-001 recovery | Database transactions and persistence | [NEEDS CLARIFICATION] Availability, acceptable data loss and recovery time; scheduled backups and demonstrated restore of database plus files |
| ERR-001 failure recovery | Structured errors, conflict protection and retries | Failure cases for each new integration; approved user outcomes and operational alerts |
| DEPLOY-001 deployment | Standalone server and deployment recipe | Hosting account, budget, HTTPS deployment, live smoke tests, monitoring and compatible rollback |

## Delivery sequence

1. Expose existing journeys clearly and configure Google; test all existing roles.
2. Deploy a fictional-data tester and collect observed failures.
3. Resolve messaging/AI policy and add each as a separately tested complete journey.
4. Resolve partner/payment/video/lab/prescription policies and deliver the selected marketplace journeys with their required integrations.
5. Pass measurable quality gates, security and real-provider operational review before accepting real patients.

The owner can change priorities; this sequence is a proposed implementation order, not a claim that an entire competitor platform is already specified. No new paid service or external publication is authorized by this document itself.

## Learn and validate

Run `npm run check` from the repository root. For backend changes also run `npm run test:backend`. UI validation: follow Features & workspaces as a guest, check that protected links show sign-in, and confirm that a staff link never grants that role. Repeat at a narrow viewport and using Tab/Enter.

Learning exercise: follow a workspace link from `public-pages.tsx` or `journey.tsx` into `Gate` in `shell.tsx`, then locate the independent server authorization. Explain why a visible link and permission to access data are different.
