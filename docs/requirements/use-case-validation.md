# Phase 2 — Use-case validation and actor matrix

Status: Review findings only. Prepared: 2026-09-26. No existing requirement, use case, acceptance criterion, or MVP decision has been changed. This report does not approve implementation.

Reviewed: [SRS](SRS.md), [use cases](use-cases.md), [functional requirements](functional-requirements.md), and [MVP scope](MVP-scope.md). Supporting checks used [acceptance criteria](acceptance-criteria.md), [business rules](business-rules.md), and [non-functional requirements](non-functional-requirements.md). The original Word document’s embedded diagrams were not reviewed in this phase.

## Problems first

Finding identifiers V-01–V-12 and security-review identifiers SC-01–SC-09 are review labels, not new requirement IDs. All decisions below remain **[NEEDS CLARIFICATION]** where the source is incomplete.

| Finding | Priority | Evidence and problem | Impact / decision needed |
|---|---|---|---|
| V-01 | Blocks release scoping | MVP-scope.md assigns no feature to an approved MVP. | Cannot judge whether any documented feature is mandatory or unnecessary for the first release. Resolve Q-002 and Q-003. |
| V-02 | Blocks affected use cases | DIAG-001 / UC-013 / AC-013 have no defined actor, behavior, or executable outcome. LAB-002 / booking portion of UC-009 / AC-019 are conditional placeholders. | Traceability exists but behavioral coverage does not. Resolve Q-012 and Q-015; do not implement placeholders. |
| V-03 | Blocks access design | UC-002 has an unnamed patient-data maintainer; UC-003 profile ownership is uncertain; UC-008 content-maintainer role is unnamed; UC-010 uploader authorization is undefined. | Cannot build a permission matrix from role labels alone. Q-004, Q-006, Q-014, Q-016. No administrator role can be assumed. |
| V-04 | Blocks affected security decisions | UC-007 requires a verified doctor, but no actor/process establishes that state. UC-011 requires patient-specific permission, but no process grants or withdraws it. | Preconditions are not operationally defined. They could be external processes, but that boundary must be decided. Q-007, Q-017. |
| V-05 | Blocks booking behavior | APPT-001 / APPT-002 and UC-005 do not define confirmation, capacity, conflicts, concurrent booking, or allowed management transitions. AC-010 only checks recorded booking details. AC-037 is blocked. | A recorded appointment could satisfy the basic criterion while still violating the intended conflict policy. Q-009, Q-010, Q-018. |
| V-06 | Blocks affected integrations | UC-006 does not specify a consultation mechanism or participation rules. UC-012 does not specify payment confirmation, uncertain outcomes, or duplicate processing. | AC-012 and AC-023 do not provide executable integration/failure specifications. Q-011, Q-018, Q-024. |
| V-07 | Validation gap | Every use case links to AC IDs indirectly through requirement IDs, but the source use-case file has no explicit AC links. UC-001, UC-003, UC-005, UC-007, UC-008, UC-009, and UC-010 combine distinct goals or actors. | The matrix below supplies traceability without changing source documents. Combined flows need independently assessable outcomes; registration must not be interpreted as a prerequisite for every login, nor content creation for every browse. |
| V-08 | Validation gap | Source use cases combine “Alternative/error paths”; most exceptions have no specified result or recovery. All existing AC rows have unresolved dependencies. | Requirement-to-AC mapping is not complete branch coverage. Finalize normal alternatives separately from failures, including expected stored state. Q-024 plus domain issues. |
| V-09 | Cross-cutting coverage gap | AUTH-003 is not explicitly linked by UC-010 despite protected report viewing. AUTHZ-001 is explicitly linked only by UC-002 and UC-011. DATA-001 is explicitly linked only by UC-002 and UC-010, although doctor and appointment data are covered by the requirement. | Security/validation intent is broader than declared use-case links. Add or confirm traceability after review; this report does not amend those links. |
| V-10 | Potential interpretation conflicts | Q-006 preserves ordinary-user versus doctor-only profile ownership. AC-007 limits displayed fields to “agreed public fields,” while DOC-002 enumerates contact/details without classifying visibility. UC-008 describes “approved” disease information without a defined approval process. | These are unresolved interpretations, not proven logical contradictions. Decide ownership, field visibility, and whether approval is an external or in-system process. Q-006, Q-014. |
| V-11 | Blocks measurable release acceptance | Performance, availability, security controls, compatibility/usability measures, and error outcomes lack thresholds or concrete checks. Acceptance authority is unknown. | No release-readiness conclusion is possible from traceability counts. Q-020–Q-024, Q-028. |
| V-12 | Planning inconsistency | SRS Q-026 records four weeks of development versus four two-week sprints, plus inconsistent years. Q-027 preserves possible template features. | Delivery feasibility cannot be established, and template fragments must not become product scope automatically. Q-026, Q-027. |

## Answers to the six validation questions

1. **Every functional requirement has a use case?** Yes at the reference level: 24/24. No at the level of complete behavior: DIAG-001 and LAB-002 are placeholders, and other flows have unresolved rules. Cross-cutting coverage is incomplete (V-09).
2. **Every use case has acceptance criteria?** Yes indirectly: 13/13 map through requirements to existing AC IDs. No use case has a fully resolved acceptance baseline, and alternative/exception coverage is incomplete. The matrix makes the existing links explicit; it does not create new AC requirements.
3. **Conflicting requirements?** No confirmed pair of mutually exclusive functional requirements was found. There are unresolved ownership/visibility/approval interpretations (V-10) and a recorded schedule contradiction (V-12). Patient access to their own records does not conflict with separately authorized doctor access; those are different roles.
4. **Impossible or ambiguous requirements?** None can be shown technically impossible from these documents. DIAG-001 cannot be specified or assessed as written; LAB-002 is not confirmed scope. Role rights, matching, scheduling, consultations, prescriptions, laboratory data, payment rules, and quality targets remain ambiguous. Technical feasibility and semester feasibility require those decisions and constraints.
5. **Unnecessary MVP features?** Undecidable without an approved MVP goal and course obligations. Conditional deferral candidates are discussed below; nothing is removed.
6. **Important security cases missing?** Yes. Some prohibitions already exist, but detailed session, role-change, object-access, file, consultation, and payment misuse scenarios are absent or incomplete. See the security review below.

## Actor completeness

| Actor or actor category | Matrix coverage | Status |
|---|---|---|
| Prospective user | UC-001 registration | Supported; eligible role registration policies unresolved |
| Registered user | UC-001 login | Shared behavior; account policy unresolved |
| Patient | UC-004 discovery; UC-005 booking; UC-006 consultation; UC-007 prescription access; UC-010 report access; UC-012 service payment where eligible | Supported; exact eligibility unresolved |
| Doctor | UC-003 maintenance; UC-005 management; UC-006 consultation; UC-011 history | Supported; ownership and patient relationships unresolved |
| Verified registered doctor | UC-007 issuance | A doctor with a verification condition, not necessarily a separate assignable role |
| Laboratory user / technician | UC-010 upload | Supported; onboarding and authorization unresolved |
| User seeking information | UC-004 doctor discovery; UC-008 disease browsing; UC-009 test search | Includes patients; guest access remains undecided |
| Third-party payment gateway | UC-012 supporting interaction | External actor; protocol unresolved |
| Patient-information maintainer | UC-002 | Responsibility exists; concrete role unspecified |
| Other profile/schedule maintainer | UC-003 | Possible actor in current use case; authority not confirmed |
| Disease-content maintainer | UC-008 | Responsibility exists; concrete role unspecified |
| Lab-booking actor | UC-009 booking | Placeholder, not a confirmed additional role |
| Diagnosis actor | UC-013 | Placeholder |

No administrator, verifier, reviewer, or permission-granting actor is invented. Responsibilities for verification and granting access remain gaps (V-04). Project students and supervisors are stakeholders, not accepted application actors.

## Complete actor-by-goal use-case matrix

Each row separates an existing actor’s goal within an existing UC; it does not add a use case or approve a new feature. “Not specified” is explicitly **[NEEDS CLARIFICATION]**. Alternative flows are legitimate variations, while exceptions are failures or denied actions. Neither an undefined alternative nor an undefined exception is approved by listing it. A missing-record result is a normal empty outcome unless a later requirement defines otherwise.

AC links reference the existing acceptance-criteria document. The full existing AC text is reproduced in the acceptance mapping after the matrix. Cross-cutting link suggestions are kept separate from existing source links.

| Use case | Actor | Goal | Preconditions | Main flow | Alternative flows | Exceptions | Related requirements | Acceptance criteria |
|---|---|---|---|---|---|---|---|---|
| UC-001 | Prospective user | Create an account | No account needed; eligible registration data/role policy unresolved. | Supply registration information → validate → create account. | [NEEDS CLARIFICATION] Role-specific registration and verification paths (Q-004, Q-005). | Invalid data does not yield successful registration/access; duplicate-account handling unresolved (Q-005, Q-019, Q-024). | AUTH-001 | AC-001 |
| UC-001 | Registered user (applicable human roles) | Authenticate | Existing eligible account. | Supply authentication information → authenticate account. | Existing users log in without repeating registration; exact account/session policy unresolved (Q-005). | Invalid authentication denies access; session expiry, logout, recovery, and disabled-account outcomes unresolved (Q-005). | AUTH-002, AUTH-003 | AC-002; AC-003 |
| UC-002 | Authorized patient-information maintainer; role unresolved | Maintain patient information | Agreed patient-record permission. | Enter or change data → validate → save → retrieve. | Create versus update existing information; who performs each is unresolved (Q-004, Q-019). | Invalid input or unauthorized edit does not yield an accepted update; failure/recovery details unresolved (Q-024). | USER-001, DATA-001, AUTHZ-001 | AC-005; AC-024; AC-004 |
| UC-003 | Doctor; or other authorized profile/schedule maintainer, authority unresolved | Maintain profile and availability | Applicable profile/schedule permissions. | Enter profile or schedule change → validate → save → show accepted change. | Profile creation/update or availability update; ownership and supported schedule forms unresolved (Q-006, Q-009). | Invalid/unauthorized changes rejected; existing-booking impact unresolved (Q-010, Q-024). | DOC-001, DOC-002, SCHED-001 | AC-006; AC-007; AC-009 |
| UC-004 | Patient or other information-seeking user; guests unresolved | Find a suitable doctor | Profiles available; discovery access rules satisfied. | Supply search criterion → view matching doctors → inspect details and availability. | Specialization, symptom, or location search; combinations/order and no-match presentation unresolved (Q-008). | Invalid filters or unavailable retrieval handling unresolved (Q-024). | SEARCH-001, DOC-002 | AC-008; AC-007 |
| UC-005 | Authenticated patient | Book doctor appointment | Patient/doctor registered; agreed availability and booking eligibility. | Select doctor/time/type → evaluate availability → record accepted booking. | Physical or online appointment; cancellation/rescheduling applicability unresolved (Q-010). | Conflicts, concurrent requests, payment interaction, and interrupted submission unresolved (Q-009, Q-010, Q-018, Q-024). | APPT-001, SCHED-001, AUTH-003 | AC-010; AC-009; AC-003 |
| UC-005 | Doctor | Manage appointments | Authorized appointment-management scope; details unresolved. | Select an authorized appointment → perform an approved management action. | Allowed actions and states unresolved (Q-010). | Unauthorized management must be restricted under AC-011; invalid state transition and failure outcomes unresolved. | APPT-002 | AC-011 |
| UC-006 | Patient | Receive remote consultation | Participation eligibility and appointment linkage unresolved. | Enter agreed mechanism with doctor → participate. | Channel and participation variations unresolved (Q-011). | Connection loss, incomplete session, and unauthorized participation handling unresolved (Q-011, Q-024). | CONS-001 | AC-012 |
| UC-006 | Doctor | Provide remote consultation | Participation eligibility and appointment linkage unresolved. | Enter agreed mechanism with patient → provide consultation. | Channel and participation variations unresolved (Q-011). | Connection loss, incomplete session, and unauthorized participation handling unresolved (Q-011, Q-024). | CONS-001 | AC-012 |
| UC-007 | Verified registered doctor | Issue prescription | Registered and verified; agreed patient/linkage rules. | Enter required details → issue prescription for intended patient. | Correction/revocation and appointment association unresolved (Q-013). | Unverified issuance denied; invalid details and changed verification status handling unresolved (Q-007, Q-013, Q-019). | RX-001 | AC-014 |
| UC-007 | Authenticated patient | Read own prescription | Authenticated; prescription issued to this patient. | Retrieve own electronic prescription. | Viewing an existing prescription need not repeat issuance; correction/revocation visibility unresolved (Q-013). | Different-patient access denied; missing-record and retrieval failure handling unresolved. | RX-002, AUTH-003 | AC-015; AC-003 |
| UC-008 | Patient or other information-seeking user; guests unresolved | Read disease information | Browsing eligibility; stored disease information. | Select disease → view information and symptoms. | Browse previously stored content without a new maintenance action; empty/missing-content presentation unresolved (Q-008, Q-014). | Retrieval failure behavior unresolved (Q-024). | DISEASE-001 | AC-016 |
| UC-008 | Authorized disease-content maintainer; role unresolved | Maintain disease information | Content-maintenance permission; meaning of approval unresolved. | Record permitted disease information → make it available under agreed content rules. | Supported content actions and review process unresolved (Q-014). | Unauthorized maintenance denied; invalid content/failure outcomes unresolved (Q-014, Q-024). | DISEASE-002 | AC-017 |
| UC-009 | User searching for tests; eligibility unresolved | Find laboratory test | Catalog/access rules unresolved. | Search agreed catalog → view matching tests. | Supported filters and no-match behavior unresolved (Q-015). | Invalid-search or catalog-failure handling unresolved (Q-024). | LAB-001 | AC-018 |
| UC-009 | Lab-booking actor [NEEDS CLARIFICATION] | Book laboratory test if scope approved | [NEEDS CLARIFICATION] Q-002, Q-015. | [NEEDS CLARIFICATION] No defined booking flow. | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | LAB-002 | AC-019 |
| UC-010 | Authorized laboratory user / technician | Upload patient result | Upload permission; intended patient identified. | Submit result → validate → associate with intended patient under publication rules. | Publication, replacement, correction, and withdrawal paths unresolved (Q-016). | Unauthorized upload denied; invalid-file, mismatched-patient, interrupted-upload handling unresolved (Q-016, Q-019, Q-024). | LAB-003, DATA-001 | AC-020; AC-024 |
| UC-010 | Authenticated patient | Find and read own lab results | Authenticated; own result available under publication rules. | Search own results → retrieve/view result. | Read existing result without a new upload; result-search fields and empty state unresolved (Q-016). | Cross-patient access denied; unavailable-file and retrieval-failure behavior unresolved (Q-024). | LAB-004 | AC-021 |
| UC-011 | Authorized doctor | Read patient history | Agreed patient-specific access permission. | Select authorized patient → view permitted past reports and appointments. | Permitted record categories and empty-history display unresolved (Q-017, Q-024). | Missing permission denies access; permission withdrawal during access and retrieval failures unresolved. | HIST-001, AUTHZ-001 | AC-022; AC-004 |
| UC-012 | Authenticated service-paying user; patient where eligible | Pay for healthcare service | Agreed service, amount, eligibility, and provider. | Initiate service payment → gateway processing → receive confirmed outcome. | Refund applicability and payable service variations unresolved (Q-018). | Decline, timeout, duplicate request, and uncertain outcome handling unresolved (Q-018, Q-024). | PAY-001, AUTH-003 | AC-023; AC-003 |
| UC-012 | External payment gateway | Process payment and supply outcome | Agreed integration and payment request; provider unresolved. | Process service payment → provide outcome through agreed integration. | Provider outcome and confirmation mechanisms unresolved (Q-018). | Provider outage, untrusted/repeated/out-of-order outcome handling not defined; review gap under Q-018, Q-020, Q-024. | PAY-001 | AC-023 |
| UC-013 | Diagnosis actor [NEEDS CLARIFICATION] | Provide online diagnosis; meaning unresolved | [NEEDS CLARIFICATION] Q-012. | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | DIAG-001 | AC-013 |

## Functional-requirement coverage matrix

These are existing explicit links in use-cases.md, not inferred links. Presence of an ID establishes traceability only.

| Functional requirement | Explicit use cases | Existing acceptance criterion | Assessment |
|---|---|---|---|
| AUTH-001 | UC-001 | AC-001 | Mapped; details unresolved |
| AUTH-002 | UC-001 | AC-002 | Mapped; details unresolved |
| AUTH-003 | UC-001, UC-005, UC-007, UC-012 | AC-003 | Mapped; incomplete cross-cutting links (V-09) |
| AUTHZ-001 | UC-002, UC-011 | AC-004 | Mapped; incomplete cross-cutting links (V-09) |
| USER-001 | UC-002 | AC-005 | Mapped; details unresolved |
| DOC-001 | UC-003 | AC-006 | Mapped; details unresolved |
| DOC-002 | UC-003, UC-004 | AC-007 | Mapped; details unresolved |
| SEARCH-001 | UC-004 | AC-008 | Mapped; details unresolved |
| SCHED-001 | UC-003, UC-005 | AC-009 | Mapped; details unresolved |
| APPT-001 | UC-005 | AC-010 | Mapped; details unresolved |
| APPT-002 | UC-005 | AC-011 | Mapped; details unresolved |
| CONS-001 | UC-006 | AC-012 | Mapped; details unresolved |
| DIAG-001 | UC-013 | AC-013 | Placeholder; no complete behavior |
| RX-001 | UC-007 | AC-014 | Mapped; details unresolved |
| RX-002 | UC-007 | AC-015 | Mapped; details unresolved |
| DISEASE-001 | UC-008 | AC-016 | Mapped; details unresolved |
| DISEASE-002 | UC-008 | AC-017 | Mapped; details unresolved |
| LAB-001 | UC-009 | AC-018 | Mapped; details unresolved |
| LAB-002 | UC-009 | AC-019 | Placeholder; no complete behavior |
| LAB-003 | UC-010 | AC-020 | Mapped; details unresolved |
| LAB-004 | UC-010 | AC-021 | Mapped; details unresolved |
| HIST-001 | UC-011 | AC-022 | Mapped; details unresolved |
| PAY-001 | UC-012 | AC-023 | Mapped; details unresolved |
| DATA-001 | UC-002, UC-010 | AC-024 | Mapped; incomplete cross-cutting links (V-09) |

## Existing acceptance criteria linked by the matrix

These are existing draft outcomes, reproduced for readability. Every criterion still depends on open decisions in acceptance-criteria.md. None was executed or approved by this review. Gateway-specific reliability and authentication behavior cannot be claimed covered merely by AC-023.

| Criterion | Requirement | Existing acceptance outcome |
|---|---|---|
| AC-001 | AUTH-001 | Given valid registration data under the agreed policy, registration creates an account usable according to that policy. |
| AC-002 | AUTH-002 | Valid authentication establishes access for the identified account; invalid authentication does not establish that access. |
| AC-003 | AUTH-003 | An unauthenticated user cannot complete any of these operations through either the interface or a direct request. |
| AC-004 | AUTHZ-001 | For each approved role and record-access rule, allowed requests succeed and disallowed requests do not return protected data or modify it. |
| AC-005 | USER-001 | An authorized user can record and retrieve the agreed patient information; stored appointment records refer to the appropriate patient. |
| AC-006 | DOC-001 | An authorized profile owner or maintainer can create and update a profile and retrieve the saved information. |
| AC-007 | DOC-002 | A doctor-detail view presents the agreed public fields consistently with the stored profile and availability. |
| AC-008 | SEARCH-001 | Using agreed matching fixtures, each supported search criterion returns the expected matching doctors. |
| AC-009 | SCHED-001 | An authorized schedule update is reflected in the doctor’s displayed availability under the agreed schedule rules. |
| AC-010 | APPT-001 | Given an eligible patient, doctor, and time, a booking records the correct participants, time, and physical or online appointment type. |
| AC-011 | APPT-002 | Each approved doctor appointment-management action produces the agreed state transition and remains restricted to authorized appointments. |
| AC-012 | CONS-001 | An eligible patient and doctor can participate in a consultation through the agreed mechanism. |
| AC-013 | DIAG-001 | No executable acceptance scenario can be finalized until the meaning of online diagnosis is approved. |
| AC-014 | RX-001 | A verified registered doctor can issue a prescription under the agreed workflow; an unverified doctor cannot issue one. |
| AC-015 | RX-002 | An authenticated patient can retrieve a prescription issued to them; a different patient cannot retrieve that prescription. |
| AC-016 | DISEASE-001 | An eligible user can view stored disease information and its associated common symptoms. |
| AC-017 | DISEASE-002 | An authorized maintainer can perform the approved content-management actions; an unauthorized user cannot perform them. |
| AC-018 | LAB-001 | Using the agreed catalog and matching rules, a test search returns the expected available tests. |
| AC-019 | LAB-002 | Blocked until lab booking is confirmed; if included, an eligible booking must record the agreed patient, laboratory, test, and appointment details. |
| AC-020 | LAB-003 | An authorized uploader can submit an accepted report associated with the intended patient; an unauthorized user cannot upload it. |
| AC-021 | LAB-004 | An authenticated patient can find and view their published results; another patient cannot retrieve those results. |
| AC-022 | HIST-001 | A doctor with the agreed patient-access permission can view the permitted history; a doctor without it cannot. |
| AC-023 | PAY-001 | An authenticated eligible user can complete an agreed service-payment scenario and obtain a result consistent with the gateway’s confirmed outcome. |
| AC-024 | DATA-001 | Valid input is accepted; input violating an agreed field or relationship rule is rejected without storing the invalid record. |

## Cross-cutting links requiring review

| Existing requirement / rule | Underlinked use cases or coverage issue | Existing criteria to consider; not added to source |
|---|---|---|
| AUTH-003 / BR-001 | UC-010 patient report access omits explicit AUTH-003; UC-001 links it but does not exercise every protected operation | AC-003, AC-033 at booking, payment, prescription, and report entry points |
| AUTHZ-001 | UC-003, UC-005, UC-006, UC-007, UC-008 maintenance, UC-010, UC-012 need actor/record-specific interpretation | AC-004, AC-025 plus domain criteria; consultation/payment permissions still require definition |
| DATA-001 | UC-003 doctor data and UC-005 appointment data lack explicit links; UC-010 upload validation is present but file rules absent | AC-024 with domain-specific accepted/rejected inputs |
| BR-002 | UC-007 relies on verification, but establishment/withdrawal is absent | AC-014, AC-034 do not define the verification process |
| BR-005 | UC-003/UC-005 schedule and booking interaction | AC-037 is blocked until conflict policy exists |
| BR-003 / BR-004 / BR-006 / BR-007 | UC-007/UC-010 record ownership, UC-010 upload rights, UC-011 history permission, UC-003/UC-008/UC-010 authorized maintenance | AC-035, AC-036, AC-038, AC-039; link decisions remain pending |

## Security case review

The following are missing or incomplete validation scenarios, not automatically approved controls or new features. Existing authorization prohibitions already cover some outcomes at a high level; concrete identities, resources, state changes, and failures are still needed.

| Review case | Existing coverage | Missing scenario or decision | Affected cases / questions |
|---|---|---|---|
| SC-01 — Unauthenticated direct requests | AUTH-003 / AC-003 explicitly prohibit protected operations | Explicitly exercise each protected operation, including UC-010; define expired-session and interrupted-operation outcomes | UC-001/005/007/010/012; Q-005, Q-024 |
| SC-02 — Access to another person’s records | AC-015, AC-021, AC-022, AC-035, AC-038 cover denial generally | Identify patient A/B and authorized/unauthorized doctors; test altered identifiers, result searches, file retrieval, and writes, with no protected-data disclosure | UC-002/005/007/010/011; Q-004, Q-017, Q-020 |
| SC-03 — Role or verification escalation | AUTHZ-001 and verified-doctor prescribing restrictions exist | Self-assignment of privileged roles, unauthorized profile ownership changes, unverified prescribing, and loss of verification/access during an operation | UC-001/003/007/010/011; Q-004, Q-006, Q-007, Q-017 |
| SC-04 — Account/session abuse | Invalid authentication covered by AC-002 | Repeated credential guessing, session theft/reuse, expiry, logout, and any recovery/verification flows need a defined policy; no method or threshold imposed | UC-001 and protected workflows; Q-005, Q-020 |
| SC-05 — Untrusted input and files | DATA-001 and authorized-upload rules exist | Malformed/oversized/unsafe files, manipulated patient references, and hostile input in stored/displayed fields; exact controls and limits not defined | UC-002/003/008/010; Q-016, Q-019, Q-020 |
| SC-06 — Consultation privacy | CONS-001 only defines participation generally | Unauthorized joining, participant identity, exposure of access links, and data/recording behavior if applicable | UC-006; Q-011, Q-020 |
| SC-07 — Payment integrity | AC-023 requires consistency with confirmed provider outcome | Altered amount/service/user, false success claims, forged or replayed provider outcomes, repeated submission, and uncertain outcomes; mechanism depends on provider | UC-012; Q-018, Q-020, Q-024 |
| SC-08 — Concurrent changes | Conflict intent in BR-005; AC-037 blocked | Two requests for the same capacity, changed availability, repeated booking submission, and permission changes between checking and saving | UC-003/005 and protected writes; Q-009, Q-010, Q-017, Q-024 |
| SC-09 — Confidentiality outside normal screens | SEC-001 exists; SEC-002 unspecified | Disclosure through errors, URLs, logs, caches, shared sessions, or stored/downloaded files; define protection and test boundaries | All sensitive-data cases; Q-020, Q-024 |

## MVP necessity assessment

No feature can be declared unnecessary without Q-002, course obligations, and the first-release objective. Conditional recommendation only: if the first-release goal is doctor discovery and physical appointment booking, review deferring integrated online consultations (CONS-001 and the online branch of APPT-001), diagnosis (DIAG-001), prescriptions (RX-001–RX-002), online payments (PAY-001), and lab-test booking (LAB-002). Those capabilities are not intrinsic to that hypothetical narrow goal, but may be mandatory for this project. No deferral is approved here.

Disease management, laboratory reports, and doctor history access also need a direct first-release goal or course requirement to justify priority. The source emphasizes lab-result access, so it must not be silently excluded. Project tracking, submission pages, and feedback forms remain unaccepted fragments under Q-027.

Authentication, applicable record permissions, validation, and confidentiality cannot be treated as optional merely to make the selected protected workflows smaller. Their exact implementation and acceptance rules still need decisions. No technology or dependency is recommended by this review.

## Validation evidence and review boundary

Static checks verified 24/24 functional requirements have explicit use-case references, 13/13 use cases map to existing acceptance IDs through requirements, all 21 actor-by-goal matrix rows reference existing requirements/criteria, and all seven pre-existing Markdown documents remained byte-for-byte unchanged. There are no application tests to run.

For a quick read-only inspection from the repository root:

```bash
rg '^## UC-' docs/requirements/use-cases.md
rg '^\| [A-Z]+-[0-9]{3} \|' docs/requirements/functional-requirements.md
rg '^\| AC-[0-9]{3} \|' docs/requirements/acceptance-criteria.md
git status --short
```

Review outcome: traceable draft, not an implementation-ready or accepted baseline. Resolve the affected decisions before approving the corresponding workflows. Stop at validation; no requirement corrections or scope changes have been applied.
