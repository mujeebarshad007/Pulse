# Acceptance criteria

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

AC IDs identify verification criteria; each links to a canonical requirement or rule. These are draft observable outcomes, not executed tests. Every criterion remains pending the referenced decisions. A criterion marked blocked cannot be used to claim acceptance. No application exists to test.

| ID | Requirement/rule | Draft acceptance outcome | Unresolved dependencies |
|---|---|---|---|
| AC-001 | AUTH-001 | Given valid registration data under the agreed policy, registration creates an account usable according to that policy. | [NEEDS CLARIFICATION] Q-004, Q-005 |
| AC-002 | AUTH-002 | Valid authentication establishes access for the identified account; invalid authentication does not establish that access. | [NEEDS CLARIFICATION] Q-005 |
| AC-003 | AUTH-003 | An unauthenticated user cannot complete any of these operations through either the interface or a direct request. | [NEEDS CLARIFICATION] Q-005 |
| AC-004 | AUTHZ-001 | For each approved role and record-access rule, allowed requests succeed and disallowed requests do not return protected data or modify it. | [NEEDS CLARIFICATION] Q-004, Q-017, Q-020 |
| AC-005 | USER-001 | An authorized user can record and retrieve the agreed patient information; stored appointment records refer to the appropriate patient. | [NEEDS CLARIFICATION] Q-004, Q-019 |
| AC-006 | DOC-001 | An authorized profile owner or maintainer can create and update a profile and retrieve the saved information. | [NEEDS CLARIFICATION] Q-006 |
| AC-007 | DOC-002 | A doctor-detail view presents the agreed public fields consistently with the stored profile and availability. | [NEEDS CLARIFICATION] Q-006, Q-009 |
| AC-008 | SEARCH-001 | Using agreed matching fixtures, each supported search criterion returns the expected matching doctors. | [NEEDS CLARIFICATION] Q-008 |
| AC-009 | SCHED-001 | An authorized schedule update is reflected in the doctor’s displayed availability under the agreed schedule rules. | [NEEDS CLARIFICATION] Q-009 |
| AC-010 | APPT-001 | Given an eligible patient, doctor, and time, a booking records the correct participants, time, and physical or online appointment type. | [NEEDS CLARIFICATION] Q-009, Q-010, Q-018 |
| AC-011 | APPT-002 | Each approved doctor appointment-management action produces the agreed state transition and remains restricted to authorized appointments. | [NEEDS CLARIFICATION] Q-010 |
| AC-012 | CONS-001 | An eligible patient and doctor can participate in a consultation through the agreed mechanism. | [NEEDS CLARIFICATION] Q-011 |
| AC-013 | DIAG-001 | No executable acceptance scenario can be finalized until the meaning of online diagnosis is approved. | [NEEDS CLARIFICATION] Q-012 |
| AC-014 | RX-001 | A verified registered doctor can issue a prescription under the agreed workflow; an unverified doctor cannot issue one. | [NEEDS CLARIFICATION] Q-007, Q-013 |
| AC-015 | RX-002 | An authenticated patient can retrieve a prescription issued to them; a different patient cannot retrieve that prescription. | [NEEDS CLARIFICATION] Q-013, Q-019 |
| AC-016 | DISEASE-001 | An eligible user can view stored disease information and its associated common symptoms. | [NEEDS CLARIFICATION] Q-008, Q-014 |
| AC-017 | DISEASE-002 | An authorized maintainer can perform the approved content-management actions; an unauthorized user cannot perform them. | [NEEDS CLARIFICATION] Q-004, Q-014 |
| AC-018 | LAB-001 | Using the agreed catalog and matching rules, a test search returns the expected available tests. | [NEEDS CLARIFICATION] Q-015 |
| AC-019 | LAB-002 | Blocked until lab booking is confirmed; if included, an eligible booking must record the agreed patient, laboratory, test, and appointment details. | [NEEDS CLARIFICATION] Q-002, Q-015 |
| AC-020 | LAB-003 | An authorized uploader can submit an accepted report associated with the intended patient; an unauthorized user cannot upload it. | [NEEDS CLARIFICATION] Q-016, Q-019 |
| AC-021 | LAB-004 | An authenticated patient can find and view their published results; another patient cannot retrieve those results. | [NEEDS CLARIFICATION] Q-016 |
| AC-022 | HIST-001 | A doctor with the agreed patient-access permission can view the permitted history; a doctor without it cannot. | [NEEDS CLARIFICATION] Q-017 |
| AC-023 | PAY-001 | An authenticated eligible user can complete an agreed service-payment scenario and obtain a result consistent with the gateway’s confirmed outcome. | [NEEDS CLARIFICATION] Q-018 |
| AC-024 | DATA-001 | Valid input is accepted; input violating an agreed field or relationship rule is rejected without storing the invalid record. | [NEEDS CLARIFICATION] Q-019, Q-024 |
| AC-025 | SEC-001 | Approved unauthorized-access scenarios expose no protected information; other protection checks await an agreed security baseline. | [NEEDS CLARIFICATION] Q-017, Q-020 |
| AC-026 | SEC-002 | Blocked until protection controls and their verification criteria are approved. | [NEEDS CLARIFICATION] Q-020 |
| AC-027 | UX-001 | Blocked pending agreed tasks, success measures, and supported viewport sizes. | [NEEDS CLARIFICATION] Q-023 |
| AC-028 | COMPAT-001 | Approved core workflows complete on every browser/device combination in the agreed support matrix. | [NEEDS CLARIFICATION] Q-023 |
| AC-029 | PERF-001 | Blocked until workload, environment, metrics, and pass/fail thresholds are agreed. | [NEEDS CLARIFICATION] Q-021 |
| AC-030 | REL-001 | Blocked until availability and recovery targets and verification methods are agreed. | [NEEDS CLARIFICATION] Q-022 |
| AC-031 | ERR-001 | Blocked until each agreed error category has an expected visible outcome and resulting data state. | [NEEDS CLARIFICATION] Q-024 |
| AC-032 | DEPLOY-001 | An agreed release can be deployed to the agreed environment and its approved core workflows exercised successfully. | [NEEDS CLARIFICATION] Q-003, Q-025 |
| AC-033 | BR-001 | Unauthenticated attempts at each protected operation fail without protected-data disclosure or business-state changes. | [NEEDS CLARIFICATION] Q-005 |
| AC-034 | BR-002 | A registered but unverified doctor cannot issue a prescription; an eligible verified doctor can follow the approved issuance workflow. | [NEEDS CLARIFICATION] Q-007, Q-013 |
| AC-035 | BR-003 | A patient can access their own available records and cannot access another patient’s records through either direct or interface requests. | [NEEDS CLARIFICATION] Q-013, Q-016, Q-017 |
| AC-036 | BR-004 | An account without upload permission cannot submit a report. | [NEEDS CLARIFICATION] Q-004, Q-016 |
| AC-037 | BR-005 | Blocked until conflict rules are approved; then overlapping and concurrent requests must satisfy those rules. | [NEEDS CLARIFICATION] Q-009, Q-010 |
| AC-038 | BR-006 | A doctor without the approved patient-access relationship cannot retrieve the patient’s history. | [NEEDS CLARIFICATION] Q-017 |
| AC-039 | BR-007 | Updates from unauthorized users fail; content-review outcomes await an approved responsibility and review policy. | [NEEDS CLARIFICATION] Q-006, Q-014, Q-016 |

## Acceptance process

Q-028 must identify the approver and required evidence. Once scope and criteria are approved, evidence should identify the tested requirement, environment, input, expected outcome, observed outcome, and result. This is a proposed review format, not an additional application feature.

Test fixtures and workflows remain undecided where source data rules are missing. All criteria are currently **not executed**; no feature is accepted by this draft.
