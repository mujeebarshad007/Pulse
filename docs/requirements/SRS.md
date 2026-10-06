# PULSE — Software Requirements Specification

Implementation clarification, 2026-09-29: the owner renamed the product **Pulse**, selected Google signup, and chose clearly labelled fictional Pakistani profiles for first testing. [Tester delivery](../tester-mvp.md) records the implemented defaults and limits; real-patient production policy questions below remain separate. This addition supersedes earlier claims that all backend implementation is unapproved.

Version: 0.3 draft · Updated: 2026-09-26 · Phase: Requirements engineering with V1 scope and intended stack recorded

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

## Document conventions and traceability

“Shall” restates an explicit source-backed capability or constraint; it does not imply stakeholder approval of this draft. **[NEEDS CLARIFICATION]** identifies unresolved behavior or a reserved requirement whose details are absent. All catalog rows have unique IDs. References to those IDs repeat the same requirement, not a new definition. UC, AC, and Q IDs identify use cases, acceptance criteria, and clarification issues respectively.

Canonical catalogs:

- [Functional requirements](functional-requirements.md)
- [Non-functional requirements](non-functional-requirements.md)
- [Business rules](business-rules.md)
- [Use cases and workflows](use-cases.md)
- [MVP scope](MVP-scope.md)
- [Version 1 MVP freeze](MVP-freeze.md) — authoritative V1 selection; behavioral clarifications remain open
- [Acceptance criteria](acceptance-criteria.md)

The clarification register in this SRS is the central list of open decisions. Source section numbers provide traceability to the Word document. This draft does not claim conformance to a requirements-document standard merely because the project plan cites a project-management standard.

## 1. Project overview

PULSE is a proposed web-based healthcare information and appointment system for a university Software Construction project. It brings doctor discovery, scheduling, consultations, prescriptions, payments, disease information, and laboratory-result access into one platform. The user also intends it to be a real deployable application and a serious learning project. The deployment audience and use of real records remain unresolved (Q-003).

## 2. Problem statement

The source describes a need for patients to find suitable doctors, arrange appointments, and access healthcare information and lab results through a convenient centralized service. It supplies no measured evidence about current waiting times, error rates, or existing service usage. No such baseline is assumed.

## 3. Goals

The stated goals are easier healthcare-service discovery, online appointment booking, convenient record access, and confidential management of patient and doctor information. Traceability: SEARCH-001, DOC-002, APPT-001, RX-002, LAB-004, USER-001, AUTHZ-001, and SEC-001. Learning and incremental development are project objectives; they are not additional end-user features. Quantitative success measures remain unresolved (Q-021, Q-023, Q-028).

## 4. Target users

Patients seeking doctors or healthcare records, doctors maintaining profiles and providing consultations, and laboratory personnel supplying test results. Guest access, supported geography, languages, and eligibility limits are unspecified (Q-003, Q-004, Q-008, Q-019).

## 5. Actors

| Actor | Source-supported interaction | Uncertainty |
|---|---|---|
| Patient | Search, book, receive consultation, view own prescriptions and reports | Exact eligibility and profile permissions |
| Doctor | Maintain profile, manage appointments, consult, prescribe, view authorized history | Verification and patient-specific access |
| Laboratory user / technician | Upload lab reports | Onboarding and authorization |
| User seeking information | Browse doctor or disease information | Whether guests are allowed |
| Third-party payment gateway | Process online payments | Provider and integration contract |

No administrator actor is confirmed. The person or organization responsible for verification and content governance remains unresolved. Students and supervisors are project stakeholders; they are not assumed to be application actors (Q-027).

## 6. User roles

Implementation update: the user requested backend/database work before authentication and authorization, and delegated the booking-policy choice. The selected booking policy and unanswered account/report/content questions are recorded in [the backend checkpoint](../backend-foundation.md). The requested eventual production release and broad login support do not settle exact providers, jurisdiction, account linking or operational targets.

AUTHZ-001 and BR-001–BR-007 govern access at a high level. The following is an incomplete source-derived permission outline, not a finalized role matrix.

| Role | Supported permissions | Unresolved permissions |
|---|---|---|
| Patient | Book doctor appointments; view own prescriptions and lab reports | Profile editing, lab booking, record sharing |
| Doctor | Manage profile and appointments; consult; view permitted patient history | Which profiles/appointments; history-access relationship |
| Verified registered doctor | Issue prescriptions | Verification authority and lifecycle |
| Authorized laboratory user | Upload results | Patient matching, publication, correction |
| Unspecified authorized maintainer | Manage disease information | Which role holds this permission |

Role assignment, multi-role accounts, guest access, and any administrative role are [NEEDS CLARIFICATION] (Q-004, Q-006, Q-007, Q-008, Q-014, Q-016, Q-017).

## 7. System boundaries

The planned application manages the source-listed information and digital workflows. Payment processing depends on an external gateway; physical consultations and laboratory testing occur outside the web application. The application supports their appointment or reporting workflows where specified. The online consultation delivery boundary is unresolved (Q-011), as is the meaning of online diagnosis (Q-012).

Internet access is an explicit assumption. In Phase 4, the user supplied the intended stack: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit and GSAP for the frontend; NestJS and TypeScript for the backend; PostgreSQL for the database; and production-appropriate secure authentication. PostgreSQL supersedes the older plan’s MySQL mention as current user intent. [Architecture decisions](../architecture/decisions.md) evaluate this stack without automatically changing it. Hosting, concrete authentication integration, detailed schema and remaining course/budget constraints are still unresolved under Q-005/Q-019/Q-025.

## 8. Functional requirements

The canonical [functional requirements catalog](functional-requirements.md) defines AUTH, AUTHZ, USER, DOC, SEARCH, SCHED, APPT, CONS, DIAG, RX, DISEASE, LAB, HIST, PAY, and DATA requirements. Every capability includes its source and unresolved dependencies. DIAG-001 and LAB-002 explicitly retain unclear source scope without defining unsupported behavior.

## 9. Non-functional requirements

The canonical [non-functional requirements catalog](non-functional-requirements.md) defines SEC-001–SEC-002, UX-001, COMPAT-001, PERF-001, REL-001, ERR-001, and DEPLOY-001. Numeric thresholds and technical controls remain [NEEDS CLARIFICATION]; this draft deliberately supplies no invented defaults.

## 10. Use cases

[Use cases](use-cases.md) UC-001–UC-013 cover registration/authentication, patient data, profiles/schedules, discovery, appointments, consultations, prescriptions, disease information, laboratory services, history, payments, and the unresolved diagnosis capability. Each lists actors, preconditions, main flow, outcome, alternatives, linked requirements, and open decisions.

## 11. User workflows

The same [workflow document](use-cases.md) describes patient, doctor, laboratory, and history-access journeys. Payment timing, booking confirmation, consultation participation, and report publication are unresolved; the listed journey order does not silently establish these business rules.

## 12. Business rules

[Business rules](business-rules.md) BR-001–BR-007 define authentication restrictions, verified-doctor prescribing, patient record access, authorized lab uploads, availability-aware booking, controlled history access, and authorized information maintenance. Exact scheduling, verification, and access policies remain open.

## 13. Authentication requirements

AUTH-001 requires registration; AUTH-002 requires authentication; AUTH-003 and BR-001 protect the explicitly listed operations. The source does not specify authentication methods, account verification, recovery, logout, session expiry, or account suspension/deletion. These are unresolved decisions under Q-005, not newly approved features.

## 14. Authorization requirements

AUTHZ-001 provides role-based restrictions, supplemented by BR-002–BR-004, BR-006, and BR-007. Patient ownership is supported for prescriptions and reports. A doctor’s role alone does not define permission to any patient’s history. Exact role assignment, profile ownership, record-level access, and verification responsibility remain unresolved (Q-004, Q-006, Q-007, Q-013, Q-016, Q-017).

## 15. Data requirements

USER-001, DOC-001–DOC-002, SCHED-001, APPT-001–APPT-002, RX-001–RX-002, DISEASE-001–DISEASE-002, LAB-001–LAB-004, HIST-001, PAY-001, and DATA-001 define the data-related capabilities. The following is a conceptual inventory, not a physical schema or additional requirements.

| Information | Source-supported contents or associations | Missing definition |
|---|---|---|
| Account and role | Registered identity; authorized role | Identifier, fields, credentials, lifecycle |
| Patient | Personal information; appointments | Required fields and editing rights |
| Doctor | Specialization, experience, qualifications, location, fee, contact, availability | Required/public fields and profile ownership |
| Availability and appointment | Patient, doctor, scheduled time, physical/online type | Timezone, duration, capacity, states |
| Prescription | Verified issuing doctor; intended patient; electronic prescription | Clinical fields, corrections, appointment linkage |
| Disease information | Disease and common symptoms; definitions mention causes/treatments | Content scope, provenance, review |
| Laboratory test/result | Test information; report provided by laboratory for a patient | Catalog, formats, patient matching, publication |
| Payment | Service payment and gateway outcome | Stored transaction fields, service linkage, status model |
| Consultation/diagnosis | Remote consultation; undefined diagnosis capability | Whether anything is stored and what it contains |

Required fields, field types, identifiers, relationships, retention, deletion, and validation rules are [NEEDS CLARIFICATION] (Q-019 and domain-specific issues). DATA-001 captures the source’s validation requirement; no detailed schema or retention period is assumed.

## 16. Security requirements

SEC-001, AUTH-003, AUTHZ-001, and the access-related business rules establish confidentiality and access intent. SEC-002 reserves the unspecified protection details. Credential/session controls, transport/storage protections, upload controls, payment-data handling, privacy obligations, and verification evidence remain unresolved (Q-020). This draft neither claims regulatory compliance nor chooses security mechanisms.

## 17. Performance requirements

PERF-001 is [NEEDS CLARIFICATION]. No response-time percentile, concurrent-user count, dataset size, upload limit, or consultation-quality target is given. Targets require a defined measurement environment and workload before acceptance can be assessed (Q-021).

## 18. Error handling requirements

DATA-001 requires validation, but ERR-001 remains [NEEDS CLARIFICATION] for detailed error behavior. Authentication/authorization failures, invalid inputs, missing records, schedule conflicts, payment uncertainty, file rejection, and interrupted consultations need agreed user outcomes and resulting data states (Q-024). Their enumeration identifies gaps; it does not define retry policies or error codes.

## 19. MVP scope

[MVP-freeze.md](MVP-freeze.md) defines V1 selection under the Phase 3 request: physical appointment discovery/booking/doctor management and laboratory-result upload/patient access are MUST HAVE; disease-information maintenance/browsing are SHOULD HAVE and included. The freeze classifies every capability and limits APPT-001 to its physical branch. Q-002 is resolved for this V1 boundary; behavioral and acceptance questions remain open. [MVP-scope.md](MVP-scope.md) provides the summary and source-increment mapping.

## 20. Out-of-scope features

V1 excludes online appointments/consultations, diagnosis, prescriptions, payments, lab-test booking, and unaccepted project-tracking/submission/feedback fragments. Lab-test catalog/search and doctor history access are COULD HAVE candidates outside V1. The full classification is in [MVP-freeze.md](MVP-freeze.md); exclusions do not delete broader-product requirements. Application implementation remains outside this documentation phase.

## 21. Future improvements

LAB-001 and HIST-001 are COULD HAVE candidates beyond V1 under [MVP-freeze.md](MVP-freeze.md). Other excluded capabilities carry no later-release commitment. No new product feature has been introduced.

## 22. Acceptance criteria

[Acceptance criteria](acceptance-criteria.md) assigns one AC ID to every canonical functional requirement, non-functional requirement, and business rule. Criteria link to unresolved decisions and are all unexecuted. Several cannot become executable until the missing policy or metric is agreed. Acceptance authority and evidence requirements are unresolved (Q-028).

## Complete unresolved-decision register

Q-002 is resolved for V1 selection by [MVP-freeze.md](MVP-freeze.md). Other unanswered items retain **[NEEDS CLARIFICATION]**; the freeze distinguishes V1 blockers from deferred-feature questions. Resolve them by recording the answer, affected requirement IDs, and approval; do not substitute implementation assumptions. Requirement catalogs and acceptance criteria link back to these issues.

| ID | Topic | Unresolved question |
|---|---|---|
| Q-001 | Source authority | [NEEDS CLARIFICATION] Is the existing Word document the authoritative input, and is there additional rough information or diagram content that must be incorporated? |
| Q-002 | MVP and priorities | V1 selection defined in [MVP-freeze.md](MVP-freeze.md) under the Phase 3 request. MUST HAVE and SHOULD HAVE are included; COULD HAVE and OUT OF SCOPE are excluded. Behavioral questions remain open. |
| Q-003 | Release context | Tester release resolved: fictional Pakistani profiles, English responsive web UI. Real-patient production geography/language/privacy criteria remain [NEEDS CLARIFICATION]. |
| Q-004 | Roles and ownership | [NEEDS CLARIFICATION] Which roles exist, can an account have multiple roles, and who creates or assigns roles? Is any administrative role required? |
| Q-005 | Accounts and sessions | Google signup selected. Tester implementation uses Better Auth sessions, sign-out and Google-managed recovery. Google OAuth setup is pending; real-release account deletion/retention requirements remain [NEEDS CLARIFICATION]. |
| Q-006 | Doctor profiles | [NEEDS CLARIFICATION] May ordinary registered users create doctor profiles, as section 1.1 states, or only doctors? Who can edit which profiles, and which fields are mandatory or public? |
| Q-007 | Doctor verification | [NEEDS CLARIFICATION] Who verifies doctors, using what evidence and process, and what happens when verification is withdrawn? |
| Q-008 | Discovery access and matching | [NEEDS CLARIFICATION] Can guests browse doctors or diseases? How do symptoms map to doctors, how are location and specialization matched, and how do combined filters, ordering, and empty results work? |
| Q-009 | Availability | [NEEDS CLARIFICATION] Who maintains schedules, and what are the slot length, capacity, timezone, recurrence, and exception rules? |
| Q-010 | Appointment lifecycle | [NEEDS CLARIFICATION] What constitutes a confirmed booking, which conflicts are forbidden, and how are concurrent requests, cancellation, rescheduling, completion, and missed appointments handled? |
| Q-011 | Consultations | [NEEDS CLARIFICATION] Does an online consultation use video, audio, messaging, an external link, or another mechanism? What are the participation and connection-failure rules? |
| Q-012 | Online diagnosis | [NEEDS CLARIFICATION] Does this term mean a doctor-recorded diagnosis or an automated capability? No automated diagnosis is authorized by the current wording. |
| Q-013 | Prescriptions | [NEEDS CLARIFICATION] What fields and issuance workflow are required? Who may view, correct, or revoke a prescription, and must it relate to an appointment? |
| Q-014 | Disease content | [NEEDS CLARIFICATION] Who creates and reviews disease information, which fields are required, what sources are permitted, and are causes and treatments included alongside symptoms? |
| Q-015 | Lab-test discovery and booking | [NEEDS CLARIFICATION] Are test search and lab-test appointments required, as the scope and assumptions suggest? What laboratories, catalogs, and booking rules apply? |
| Q-016 | Lab reports | [NEEDS CLARIFICATION] Who qualifies as an authorized uploader, how is a report linked to a patient, and what formats, size limits, result-search fields, publication, correction, and withdrawal rules apply? |
| Q-017 | Doctor access to history | [NEEDS CLARIFICATION] Which patient relationship or permission lets a doctor view past appointments and lab reports? When does that access end? |
| Q-018 | Payments | [NEEDS CLARIFICATION] Which services are payable, which provider and currencies apply, and are payments simulated, sandbox, or live? What are the confirmation, failure, duplicate-payment, refund, and booking-payment rules? |
| Q-019 | Data definitions and lifecycle | [NEEDS CLARIFICATION] What exact fields, identifiers, required values, validation rules, retention periods, deletion rules, and record relationships apply? |
| Q-020 | Security and privacy | [NEEDS CLARIFICATION] What concrete protection and verification criteria apply to credentials, sessions, transport, stored records, uploads, and payment data? What jurisdiction or institutional privacy obligations apply? |
| Q-021 | Performance | [NEEDS CLARIFICATION] What response-time targets, concurrent-user levels, dataset sizes, and upload or consultation performance targets must be met, and under what measurement conditions? |
| Q-022 | Availability and recovery | [NEEDS CLARIFICATION] What service availability, backup, recovery-time, and acceptable-data-loss targets are required? |
| Q-023 | Usability and compatibility | [NEEDS CLARIFICATION] Which browsers, devices, viewport sizes, accessibility criteria, and usability measures must be supported? |
| Q-024 | Error handling | [NEEDS CLARIFICATION] How should validation, authentication, authorization, missing data, booking conflicts, provider failures, and connection failures be presented and recovered from? Which operations may be retried? |
| Q-025 | Technology and hosting constraints | The later architecture alignment selected one Next.js/TypeScript application with PostgreSQL planned; NestJS, Redux Toolkit and GSAP are deferred, and shadcn/ui remains optional/uninstalled. See [architecture decisions](../architecture/decisions.md) for the rationale and recorded installed versions. [NEEDS CLARIFICATION] Hosting environment, budget, backend libraries and any remaining course constraints. |
| Q-026 | Schedule | [NEEDS CLARIFICATION] Which dates and durations are authoritative? The four-week development phase conflicts with four two-week sprints, and change history includes a 2025 date among 2026 dates. |
| Q-027 | Possible template leftovers | [NEEDS CLARIFICATION] Are project tracking, submission pages, and feedback forms actual PULSE capabilities or leftover text? The source also mentions patient feedback as an assumption. |
| Q-028 | Acceptance authority | [NEEDS CLARIFICATION] Who approves requirements and release acceptance, and which acceptance evidence is mandatory? |

## Revision history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-26 | Initial source-derived requirements draft; all unresolved decisions retained explicitly. |
| 0.2 | 2026-09-26 | Linked Phase 3 V1 scope freeze; updated release inclusion/exclusion summary and Q-002 without changing canonical capability definitions. |
| 0.3 | 2026-09-26 | Recorded the Phase 4 intended stack and linked architecture decisions; updated Q-025 without changing product scope or unresolved business policies. |


## Approved expansion — 2026-10-06

Owner approved LABPOL-001–010 in [lab booking policy](lab-booking-policy.md), extending the earlier laboratory search/booking exclusions. The policy table contains rules and acceptance outcomes for discovery → request → lab response → cancellation/expiry/completion → private report linkage. Doctor confirmation remains unchanged. EXP-AI-002 adds sourced education for a named condition and clinician navigation, without diagnosis, prescribing or test recommendations. Implementation and limitations: [lab and education guide](../labs-and-education-guide.md). Real-patient operational acceptance remains outstanding.
