# PULSE — Version 1 MVP freeze

2026-09-29 delivery note: the brand is **Pulse**. Google signup and fictional Pakistani profiles were selected for the connected tester release. [Current implementation and limits](../tester-mvp.md) include saved appointments/content and private fictional PDFs. This does not enlarge the frozen product feature set or accept real-patient production use.

Version: 1.0 scope boundary · Date: 2026-09-26 · Phase: MVP definition

## Decision and authority

This document defines the version 1 delivery boundary in response to the Phase 3 request to prioritize the existing requirements. It is a scope decision, not an implementation, a claim of completed acceptance, or approval of unanswered business rules. Only existing capabilities are selected. No new product feature, administrator role, technology, or integration is introduced.

For version 1 inclusion and priority, this document supersedes the previously undecided scope in [MVP-scope.md](MVP-scope.md) and the Phase 2 findings about the absence of a scope selection. [SRS.md](SRS.md), [functional-requirements.md](functional-requirements.md), [non-functional-requirements.md](non-functional-requirements.md), [business-rules.md](business-rules.md), [use-cases.md](use-cases.md), [acceptance-criteria.md](acceptance-criteria.md), and [use-case-validation.md](use-case-validation.md) were reviewed. The catalogs continue to describe the broader product; excluding a capability from V1 does not delete its requirement.

**V1 will deliver physical appointment discovery/booking/doctor management and laboratory-result upload/patient access. Disease-information maintenance and browsing are included as a secondary-priority complete journey.**

**V1 will not deliver online appointment types, remote consultations, online diagnosis, electronic prescriptions, payments, lab-test booking or catalog search, or doctor access to a patient’s broader history.**

The source’s explicit emphasis on doctor discovery, appointments, and laboratory-result access supports the two core journeys. Pairing content maintenance with browsing preserves the information part of PULSE without requiring consultation or payment integrations. These are prioritization decisions made for this freeze; they are not represented as earlier stakeholder answers.

## Priority labels and release membership

| Classification | Meaning in this freeze | Built in frozen V1? |
|---|---|---|
| MUST HAVE | Essential to the two core journeys or their security, integrity, and deployability | Yes |
| SHOULD HAVE | Secondary-priority disease-information journey; implement after the core journeys | Yes; part of this release commitment |
| COULD HAVE | Existing product capability retained as a lower-priority future candidate | No |
| OUT OF SCOPE | Explicit exclusion from V1; no commitment to a later release | No |

There is no “if time permits” feature set. MUST HAVE and SHOULD HAVE comprise the fixed V1 delivery list. Dropping a SHOULD HAVE requires an explicit scope revision; it is not an automatic fallback. COULD HAVE is not permission to add work during implementation. The two disease features move together in any future scope revision.

## Feature-by-feature classification and acceptance

Every functional requirement appears once in this table. APPT-001 is deliberately limited to its physical branch; its online branch is explicitly OUT OF SCOPE below. Other multi-domain requirements apply only to included operations. Referenced acceptance criteria are the existing criteria, applied to the stated V1 branch; full broader-product acceptance is not claimed.

“Cross-cutting” use-case mappings apply existing access/validation requirements to their relevant workflows, addressing Phase 2’s traceability gaps. They do not create new use cases. All dependencies labelled Q refer to existing unresolved decisions.

| Requirement ID | Feature | Classification | Use cases | Dependencies / open decisions | Expected V1 result or exclusion | Acceptance criteria |
|---|---|---|---|---|---|---|
| AUTH-001 | Registration | MUST HAVE | UC-001 | AUTHZ-001; USER-001 where patient data is required; Q-004, Q-005, Q-019 | Eligible users can register under the agreed account policy. | AC-001: accepted registration creates an account usable under that policy. |
| AUTH-002 | Authentication | MUST HAVE | UC-001 | AUTH-001; Q-005, Q-020 | Registered users can authenticate for their permitted work. | AC-002: valid authentication succeeds; invalid authentication does not grant access. |
| AUTH-003 | Protection of included operations | MUST HAVE | UC-001, UC-005, UC-010 (cross-cutting) | AUTH-002; Q-005 | Booking and lab-report viewing require authentication. Payment and prescription clauses are dormant in V1. | AC-003, AC-033: direct and interface unauthenticated attempts cannot perform included protected operations. |
| AUTHZ-001 | Role and record access | MUST HAVE | UC-002, UC-003, UC-005, UC-008, UC-010 (cross-cutting) | Authenticated identity; Q-004, Q-006, Q-014, Q-016, Q-020 | Each V1 actor can perform only permitted operations on permitted records. | AC-004: agreed allowed requests succeed; denied requests neither disclose protected information nor modify it. |
| USER-001 | Patient information and appointment records | MUST HAVE | UC-002; UC-005 consumes records | AUTHZ-001; DATA-001; Q-004, Q-019 | Authorized maintenance supplies patient information needed for bookings and report ownership. | AC-005: accepted data is stored/retrievable, with appointment records linked to the correct patient. |
| DOC-001 | Doctor profile maintenance | MUST HAVE | UC-003 | AUTHZ-001; DATA-001; Q-006 | Authorized maintainers create and update doctor profiles used by discovery. | AC-006: authorized create/update persists and can be retrieved. |
| DOC-002 | Doctor details | MUST HAVE | UC-003, UC-004 | DOC-001; SCHED-001; Q-006, Q-009 | Patients can inspect the agreed doctor details and availability before booking. A displayed fee does not imply online payment. | AC-007: displayed public fields agree with stored profile and availability. |
| SEARCH-001 | Search by specialization, symptoms, and location | MUST HAVE | UC-004 | DOC-001; DOC-002; Q-008 | Users can find doctors using all three documented criteria. Symptom matching is discovery, not diagnosis. | AC-008: agreed fixtures return expected matches for each supported criterion; matching rules remain unresolved. |
| SCHED-001 | Doctor availability maintenance | MUST HAVE | UC-003, UC-005 | DOC-001; AUTHZ-001; DATA-001; Q-009, Q-010 | Authorized schedule changes drive displayed availability and booking eligibility. | AC-009: stored schedule changes affect availability; AC-037: booking respects agreed conflict rules. |
| APPT-001 | Physical appointment booking only | MUST HAVE | UC-005 — physical branch | AUTH-003; AUTHZ-001; USER-001; DOC-002; SCHED-001; DATA-001; Q-009, Q-010 | An eligible patient books a physical appointment with a registered doctor. The same record is available to the authorized doctor-management workflow. | AC-010 physical branch: correct patient, doctor, time and type; AC-003 and AC-037: authentication and agreed conflict behavior. |
| APPT-002 | Doctor appointment management | MUST HAVE | UC-005 — doctor branch | APPT-001; AUTHZ-001; Q-010 | Doctors manage their authorized physical appointments through the agreed lifecycle; booking is not an isolated form. | AC-011: each approved action produces the agreed transition and is restricted to authorized appointments. |
| CONS-001 | Online consultation | OUT OF SCOPE | UC-006 | Would require online APPT-001 eligibility, participation rules and mechanism (Q-011) | No remote-consultation workflow is built for V1. | AC-012 is not a V1 acceptance obligation. |
| DIAG-001 | Online diagnosis | OUT OF SCOPE | UC-013 | Meaning and actor unresolved (Q-012) | No online-diagnosis capability is built for V1. | AC-013 remains a blocked placeholder outside V1. |
| RX-001 | Electronic prescription issuance | OUT OF SCOPE | UC-007 — doctor branch | Would require verification and prescription policy (Q-007, Q-013) | No electronic prescription issuance is built for V1. | AC-014, AC-034 are not V1 acceptance obligations. |
| RX-002 | Electronic prescription viewing | OUT OF SCOPE | UC-007 — patient branch | RX-001; Q-013 | No prescription viewing is built independently of issuance. | AC-015 and the prescription portion of AC-035 are outside V1. |
| DISEASE-001 | Disease information browsing | SHOULD HAVE | UC-008 — reader branch | DISEASE-002; Q-008, Q-014 | Eligible users can read maintained disease information and common symptoms. Included in the frozen V1 delivery scope. | AC-016: eligible users can view stored disease information and associated symptoms. |
| DISEASE-002 | Disease information maintenance | SHOULD HAVE | UC-008 — maintainer branch | AUTHZ-001; Q-004, Q-014 | An authorized maintainer can maintain the information consumed by browsing. Included with DISEASE-001 as one journey. | AC-017, AC-039: permitted maintenance works; unauthorized maintenance is denied. |
| LAB-001 | Laboratory test catalog/search | COULD HAVE | UC-009 — search branch | Future catalog and matching rules (Q-015) | Deferred beyond V1. Report retrieval searches a patient’s existing results, not a catalog of purchasable tests. | AC-018 is deferred, not removed from the product catalog. |
| LAB-002 | Laboratory test appointments | OUT OF SCOPE | UC-009 — booking branch | Unconfirmed workflow and laboratory booking rules (Q-015) | No lab-test booking is built for V1. Testing occurs outside PULSE. | AC-019 remains outside V1. |
| LAB-003 | Authorized laboratory result upload | MUST HAVE | UC-010 — laboratory branch | AUTHZ-001; USER-001; DATA-001; Q-016, Q-019, Q-020 | Authorized laboratory personnel can associate an accepted result with its intended patient. | AC-020, AC-024, AC-036: accepted submissions are correctly linked; unauthorized uploads and invalid data are rejected under agreed rules. |
| LAB-004 | Patient result search and viewing | MUST HAVE | UC-010 — patient branch | LAB-003; AUTH-003; AUTHZ-001; Q-016 | An authenticated patient can find and read their own available results. Upload and retrieval ship together. | AC-021, AC-003, AC-035 lab branch: intended patient can retrieve results; another patient or unauthenticated requester cannot. |
| HIST-001 | Doctor access to past patient records | COULD HAVE | UC-011 | Future patient-specific access policy (Q-017); USER-001; LAB-003 | Deferred beyond V1. Managing a doctor’s own appointments does not grant broad access to past patient records or lab reports. | AC-022 and AC-038 are deferred. |
| PAY-001 | Online payments | OUT OF SCOPE | UC-012 | Would require gateway/service/payment policy (Q-018) | No payment collection, gateway integration, or payment prerequisite is built into V1. External settlement is outside the application boundary, not a new workflow. | AC-023 and payment portions of AC-003/AC-033 are outside V1. |
| DATA-001 | Input validation | MUST HAVE | UC-002, UC-003, UC-005, UC-010 (cross-cutting) | Q-019, Q-024; relevant domain rules | Patient, doctor, appointment, and laboratory data accepted by V1 meets agreed field and relationship rules. | AC-024: valid data accepted; rule-violating input rejected without storing the invalid record. |

### Explicit branch boundaries

- **APPT-001 physical appointment branch: MUST HAVE. Online appointment branch: OUT OF SCOPE.** UC-005 and AC-010 are evaluated only for physical appointments. A selectable online appointment type without a supported consultation journey is not part of V1.
- **AUTH-003 and BR-001:** authentication applies to booking and lab-report access. Dormant payment/prescription clauses do not require adding those capabilities.
- **BR-003:** own-patient record protection applies to lab results. The prescription branch remains excluded.
- **SEC-001:** confidentiality remains mandatory for included patient and doctor information. V1 has no online payment records to protect.
- **DOC-002:** doctor fee information remains in the source-defined profile scope, subject to field-visibility clarification. It is informational; it does not introduce checkout.
- **SEARCH-001:** specialization, symptom, and location search all remain included. Excluding disease diagnosis does not remove symptom-based doctor discovery. Matching logic is unresolved, not automatically a machine-learning or diagnostic feature.
- **APPT-002 versus HIST-001:** authorized management of V1 appointments is included; general browsing of a patient’s historical appointments/lab records is excluded.
- **LAB-004 versus LAB-001:** searching a patient’s uploaded results is included; searching a catalog to choose a lab test is deferred. Report metadata does not authorize a new test-catalog management product feature.

## Complete journeys and dependency closure

The journeys below define the end-to-end release outcomes. Their policy details still need clarification before implementation. A set of disconnected pages or a demo with hard-coded business outcomes does not satisfy the linked acceptance criteria.

### Journey A — Doctor availability to a managed physical appointment

1. Eligible users obtain registered accounts and authenticate under the agreed account/role policy (UC-001).
2. Authorized maintenance supplies patient information and doctor profiles; the doctor/authorized schedule maintainer defines availability (UC-002, UC-003).
3. The patient searches by the documented criteria, reviews doctor details and availability, and selects a physical appointment (UC-004, UC-005).
4. The system applies the agreed availability/conflict rules and records the accepted appointment for the correct patient and doctor (UC-005).
5. The authorized doctor can access that appointment within the management workflow and perform the agreed lifecycle actions (UC-005).

**Terminal result:** a persisted, correctly associated physical appointment usable by the doctor-management workflow. The physical clinical encounter occurs outside PULSE. No payment, online consultation, or prescription is a software prerequisite.

**Dependencies:** AUTH-001–AUTH-003, AUTHZ-001, USER-001, DOC-001–DOC-002, SEARCH-001, SCHED-001, APPT-001 physical branch, APPT-002, DATA-001; applicable quality gates below.

**Acceptance:** AC-001–AC-011, AC-024, AC-033, AC-037, AC-039 for doctor maintenance, plus applicable quality criteria. AC-010 alone is insufficient: schedule conflicts and authorized management must also pass. Exact booking confirmation and lifecycle transitions remain Q-009/Q-010; this freeze does not invent cancellation or rescheduling behavior.

### Journey B — Laboratory submission to private patient result access

1. The account/role policy establishes an authorized laboratory user and the intended patient identity (UC-001, UC-002; role assignment mechanism remains Q-004/Q-016).
2. Testing occurs outside the application; no in-app test purchase or lab appointment is required.
3. The authorized laboratory user submits a result associated with its intended patient. The system validates it using agreed data/file rules and applies the agreed availability/publication rules (UC-010).
4. The authenticated patient searches their own available results and views the submitted report (UC-010).
5. Requests by another patient or unauthorized uploader are denied without disclosure or an unauthorized write.

**Terminal result:** the correct patient can access an accepted result uploaded through the authorized workflow. A standalone upload or an unpopulated report viewer is insufficient.

**Dependencies:** AUTH-001–AUTH-003, AUTHZ-001, USER-001, LAB-003, LAB-004, DATA-001; no dependency on LAB-001, LAB-002, HIST-001, RX-001, or PAY-001.

**Acceptance:** AC-001–AC-005, AC-020–AC-021, AC-024, AC-033, AC-035 lab branch, AC-036, AC-039 for lab maintenance, plus applicable quality criteria. Patient matching, publication, file limits, and permitted corrections remain Q-016/Q-019.

### Journey C — Maintained disease information to user browsing

1. The agreed role policy identifies an authorized content maintainer (UC-008; concrete role and any review responsibility remain Q-004/Q-014).
2. That maintainer performs permitted disease-information maintenance.
3. Eligible readers browse the resulting disease information and common symptoms; later reads do not require repeating maintenance.
4. Unauthorized content changes are denied.

**Terminal result:** maintained information is available to eligible readers. Browsing and maintenance are delivered together. A new administrative application or separate review/approval workflow is not implied.

**Dependencies:** DISEASE-001, DISEASE-002, AUTHZ-001, applicable account authentication, Q-008/Q-014 and quality gates. This is a separate informational journey; it is not a diagnosis service and is not assumed to supply doctor-search matching logic.

**Acceptance:** AC-016–AC-017, AC-004, AC-039 for content maintenance, plus applicable quality criteria. Public browsing and the content governance process remain unresolved.

### Dependency audit

No included journey requires an excluded product capability. The remaining dependencies are included capabilities or unanswered policy/data decisions. Account provisioning, patient-data maintenance rights, content-maintainer rights, and lab authorization are genuine blockers; they must not be replaced with an invented administrator dashboard. Those decisions may establish a process within existing capabilities, but any additional product feature requires a scope change.

## Mandatory quality and deployment obligations

All eight existing non-functional requirements are **MUST HAVE** for the selected V1 workflows. Placeholder requirements must be made measurable before acceptance; their inclusion does not invent thresholds, controls, platforms, or service promises. These are release-wide obligations rather than additional user features.

| Requirement ID | Obligation | Classification | Use-case / release coverage | Dependencies | Expected result | Acceptance criteria |
|---|---|---|---|---|---|---|
| SEC-001 | Confidentiality | MUST HAVE | All V1 sensitive-data journeys | AUTH-003; AUTHZ-001; Q-020 | Unauthorized users cannot obtain protected patient/doctor information. Payment-data scope is dormant. | AC-025; existing clarification must be resolved for V1. |
| SEC-002 | Security controls | MUST HAVE | UC-001 and every protected V1 workflow | Q-005, Q-016, Q-020 | Agreed controls protect the selected workflows, including sessions and uploads; exact controls remain unresolved. | AC-026; existing clarification must be resolved for V1. |
| UX-001 | Responsive, usable interface | MUST HAVE | UC-001–UC-005; UC-008; UC-010 | Q-023 | Users can complete selected journeys under agreed usability and viewport criteria. | AC-027; existing clarification must be resolved for V1. |
| COMPAT-001 | Web compatibility | MUST HAVE | All included journeys | Q-023 | Included workflows operate on the agreed browser/device matrix. | AC-028; existing clarification must be resolved for V1. |
| PERF-001 | Performance | MUST HAVE | All included journeys | Q-021 | Included workflows meet agreed metrics under agreed loads; no targets invented. | AC-029; existing clarification must be resolved for V1. |
| REL-001 | Availability and recovery | MUST HAVE | Entire V1 deployment | Q-022 | The deployment meets agreed service and recovery targets; no targets invented. | AC-030; existing clarification must be resolved for V1. |
| ERR-001 | Error outcomes and recovery | MUST HAVE | All included journeys and their failure branches | Q-024; domain-specific failure rules | Invalid input, forbidden access, conflicts and failures have agreed user-visible outcomes and data states. | AC-031; existing clarification must be resolved for V1. |
| DEPLOY-001 | Deployable application | MUST HAVE | Entire V1 deployment and included journeys | Q-003, Q-025; all included feature groups | V1 can be deployed and its real application workflows exercised in the agreed environment. | AC-032; existing clarification must be resolved for V1. |

## Business-rule applicability

| Rule | V1 classification / applicability | Use cases | Acceptance |
|---|---|---|---|
| BR-001 | MUST HAVE for physical booking and lab-result access; other branches dormant | UC-005, UC-010 | AC-033, AC-003 |
| BR-002 | OUT OF SCOPE because electronic prescribing is excluded | UC-007 excluded | AC-034 deferred with prescribing |
| BR-003 | MUST HAVE for patient ownership of lab results; prescription branch dormant | UC-010 | AC-035 lab branch, AC-021 |
| BR-004 | MUST HAVE for authorized laboratory uploads | UC-010 | AC-036, AC-020 |
| BR-005 | MUST HAVE for availability and conflict rules | UC-003, UC-005 | AC-037, AC-009, AC-010 |
| BR-006 | COULD HAVE with deferred HIST-001; it does not grant V1 history access | UC-011 deferred | AC-038 deferred |
| BR-007 | MUST HAVE for authorized information maintenance wherever included, including SHOULD HAVE disease content | UC-003, UC-008, UC-010 | AC-039 and relevant domain criteria |

Security controls are not optional because a feature has lower priority. Phase 2 security findings about direct requests, record ownership, role changes, sessions, uploads, concurrency, and unintended disclosures remain applicable to V1 under existing AUTHZ-001, SEC-001, SEC-002, DATA-001, BR-005 and ERR-001. Consultation and payment-specific cases are deferred with their excluded capabilities. Concrete acceptance scenarios remain to be agreed, not silently added here.

## Explicit exclusions and future candidates

**COULD HAVE, not built in V1:** LAB-001 lab-test catalog/search and HIST-001 doctor history access. These remain candidates for a later release, with no implementation authorization or delivery date.

**OUT OF SCOPE for V1:** the online branch of APPT-001, CONS-001, DIAG-001, RX-001, RX-002, LAB-002, PAY-001. Physical healthcare delivery and laboratory testing are outside the software boundary. In-app payment settlement is excluded; no cash-payment tracking or replacement payment feature is introduced.

**Unaccepted source fragments — OUT OF SCOPE for V1:** project-progress tracking, submission pages, and patient feedback forms (Q-027). They have no accepted functional requirement IDs, use cases, or acceptance criteria; this freeze does not manufacture any. Their validity in the broader project remains unresolved.

**Unspecified mechanisms are not extra features by default:** no administrator product surface, doctor-verification workflow, or account-recovery feature is added by this freeze. Relevant identity/session/provisioning decisions must still be settled under existing questions. A newly requested product capability requires explicit requirements and a boundary revision.

Exclusion means no V1 implementation task or dependency for that feature, including no placeholder workflow offered as usable functionality. The broader requirement remains in the catalog for traceability. No statement here permanently removes a feature from the overall project.

## Remaining decisions — scope is fixed, behavior is not invented

[NEEDS CLARIFICATION] remains the status of unanswered questions below. Feature selection resolves Q-002 for V1; it does not answer the remaining questions. Stop before implementing behavior that depends on an unanswered decision.

| Existing question | V1 effect |
|---|---|
| Q-001 | Confirm source completeness and any unreviewed diagram/course constraints; conflicting new evidence requires explicit revision, not silent scope drift. |
| Q-002 | V1 selection is recorded by this freeze. No feature-level inclusion decision is left as “maybe.” |
| Q-003 | Release audience, real versus synthetic data, geography, and languages remain unresolved; deployment acceptance is blocked on the applicable answer. |
| Q-004 | Define existing actors’ role assignment and patient/content/lab maintenance permissions. No administrator role assumed. |
| Q-005 | Define account fields, authentication/session behavior, and account lifecycle needed for selected journeys. |
| Q-006 | Resolve profile ownership, editing rights, mandatory fields, and public visibility. |
| Q-007 | Prescribing verification workflow is deferred with RX-001. If doctor eligibility for booking has separate constraints, clarify under Q-004/Q-006; do not silently assume verification or invent it. |
| Q-008 | Define all three search criteria and guest/read-access rules; symptom matching remains included without a chosen algorithm. |
| Q-009 | Define schedules, slots, capacity, timezones, and exceptions. |
| Q-010 | Define physical booking confirmation, conflicts/concurrency, and doctor-management transitions. Cancellation and rescheduling remain policy questions, not automatically added features. |
| Q-011, Q-012, Q-013 | Consultation, diagnosis, and prescription details deferred with those excluded capabilities. |
| Q-014 | Define disease content fields, ownership and governance for the included secondary journey. |
| Q-015 | Test-catalog/search and booking details deferred; report metadata still needs definition under Q-016/Q-019. |
| Q-016 | Define upload authorization, patient matching, file limits/formats, publication and correction policy. |
| Q-017 | Broad doctor history sharing deferred; V1 appointment access and patient report ownership still need exact record rules under Q-004/Q-016/Q-020. |
| Q-018 | Gateway/payment details deferred. V1 has no in-app payment prerequisite. This does not assert that external healthcare services are free. |
| Q-019 | Define fields, validation, relationships and data lifecycle for included records. |
| Q-020 | Define applicable security/privacy controls for V1; do not presume this freeze certifies real-patient deployment. |
| Q-021, Q-022, Q-023, Q-024 | Define measurable performance, recovery, usability/compatibility, and failure behavior for included journeys. |
| Q-025, Q-026 | Confirm stack/hosting/course constraints and reconcile the delivery schedule; no feasibility guarantee is made. |
| Q-027 | Template fragments excluded from V1; broader validity remains unresolved. |
| Q-028 | Identify acceptance authority and required evidence before declaring the release accepted. |

## V1 completion criteria and change control

V1 is complete only when the included MUST HAVE and SHOULD HAVE features work together as Journeys A, B and C, the applicable existing business-rule and quality criteria pass, and the remaining V1 behavior/acceptance decisions have been resolved. There must be no dependency on an excluded capability to finish an included journey.

Acceptance evidence must cover the relevant successful flows, forbidden access, invalid data, appointment conflicts, report ownership and upload failures, with expected outcomes determined from resolved requirements. This restates the existing validation obligations; it does not select new controls or policies. Production acceptance remains unexecuted. The later fictional-data frontend has separate [demo validation evidence](../frontend-delivery.md), which does not resolve the policy questions or satisfy real-data release criteria.

Any addition, removal, or priority change requires an explicit user-directed revision recording affected existing requirement IDs, journeys, dependencies and acceptance criteria. A SHOULD HAVE feature cannot disappear silently, and a COULD HAVE cannot enter because time happens to be available. Course constraints that contradict this boundary must be raised before implementation.

## Documentation validation

Static checks verify all 24 functional requirement IDs are classified, all 8 non-functional IDs and 7 business rules have V1 applicability, every included feature has use-case coverage/dependencies/outcomes/acceptance references, and all referenced IDs and document links exist. APPT-001’s two branches are deliberately different; full-product satisfaction is not claimed for a partial V1 requirement.

Read-only checks from the repository root:

```bash
rg '^\| [A-Z]+-[0-9]{3} \|' docs/requirements/MVP-freeze.md
rg 'MUST HAVE|SHOULD HAVE|COULD HAVE|OUT OF SCOPE' docs/requirements/MVP-freeze.md
git status --short
```

Documentation only. No application code, dependencies, credentials, or deployment changes are part of this phase.
