# Use cases and user workflows

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

UC IDs identify scenarios, not additional capabilities. These are conceptual workflows; screen designs, provider protocols, and unspecified business transitions remain undecided. All unresolved branches link to the SRS clarification register.

## UC-001 — Register and authenticate

- **Actors:** Prospective or registered user.
- **Requirements:** AUTH-001, AUTH-002, AUTH-003.
- **Preconditions:** No account is needed to start registration; login requires an existing eligible account.
- **Main workflow:** User provides the agreed registration data; system validates it and creates the account. User submits authentication information; system authenticates the account under the agreed policy.
- **Success outcome:** An account exists and, after successful login, the user is authenticated.
- **Alternative/error paths:** Invalid data or authentication does not yield successful access. Duplicate-account and account-verification behavior are undefined.
- **Open decisions:** [NEEDS CLARIFICATION] Q-004, Q-005, Q-019, Q-024.

## UC-002 — Maintain patient information

- **Actors:** Authorized patient-information maintainer; exact role unresolved.
- **Requirements:** USER-001, DATA-001, AUTHZ-001.
- **Preconditions:** Actor has the agreed permission.
- **Main workflow:** Actor supplies or changes patient data; system validates it; authorized data is saved and can be retrieved.
- **Success outcome:** The patient record contains accepted information.
- **Alternative/error paths:** Invalid data and unauthorized edits do not produce an accepted update.
- **Open decisions:** [NEEDS CLARIFICATION] Q-004, Q-019, Q-024.

## UC-003 — Maintain a doctor profile and schedule

- **Actors:** Doctor or other authorized profile maintainer; ownership unresolved.
- **Requirements:** DOC-001, DOC-002, SCHED-001.
- **Preconditions:** Actor has the applicable profile and schedule permissions.
- **Main workflow:** Actor enters profile or availability details; system validates the input; accepted changes are stored and displayed to eligible users.
- **Success outcome:** Profile or availability reflects the accepted update.
- **Alternative/error paths:** Invalid data and unauthorized changes are rejected; interaction with existing bookings is unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-006, Q-009, Q-010, Q-024.

## UC-004 — Find a doctor

- **Actors:** User; guest access unresolved.
- **Requirements:** SEARCH-001, DOC-002.
- **Preconditions:** Doctor profiles exist; discovery access rules are satisfied.
- **Main workflow:** User supplies a supported search criterion; system returns doctors according to the agreed matching rules; user opens a doctor’s details and availability.
- **Success outcome:** User can identify a doctor and inspect available information.
- **Alternative/error paths:** No-match display and combined-filter behavior are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-006, Q-008, Q-024.

## UC-005 — Book and manage a doctor appointment

- **Actors:** Authenticated patient; doctor for management.
- **Requirements:** APPT-001, APPT-002, SCHED-001, AUTH-003.
- **Preconditions:** Patient and doctor are registered; relevant permissions and booking conditions apply.
- **Main workflow:** Patient selects a doctor, time, and physical or online type; system evaluates agreed availability rules and records an accepted booking. Doctor performs only agreed appointment-management actions.
- **Success outcome:** The appointment has the agreed participants, time, type, and state.
- **Alternative/error paths:** Conflict, concurrent request, cancellation, rescheduling, and payment interaction remain undefined.
- **Open decisions:** [NEEDS CLARIFICATION] Q-009, Q-010, Q-018, Q-024.

## UC-006 — Participate in an online consultation

- **Actors:** Patient and doctor.
- **Requirements:** CONS-001.
- **Preconditions:** Eligibility and any appointment linkage are unresolved.
- **Main workflow:** Patient and doctor enter the agreed consultation mechanism and conduct a remote consultation.
- **Success outcome:** A remote consultation has taken place; any stored consultation record is unresolved.
- **Alternative/error paths:** Connection failure and incomplete consultation handling are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-011, Q-024.

## UC-007 — Issue and view an electronic prescription

- **Actors:** Verified registered doctor; authenticated patient.
- **Requirements:** RX-001, RX-002, AUTH-003.
- **Preconditions:** Doctor is verified and registered; patient and prescription linkage satisfy the agreed rules.
- **Main workflow:** Doctor supplies required prescription details and issues it; the intended patient retrieves the electronic prescription.
- **Success outcome:** The prescription is available to the intended patient.
- **Alternative/error paths:** Unverified issuance and access by a different patient are denied; correction and revocation behavior are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-007, Q-013, Q-019, Q-024.

## UC-008 — Browse and maintain disease information

- **Actors:** User; authorized content maintainer.
- **Requirements:** DISEASE-001, DISEASE-002.
- **Preconditions:** Browsing and maintenance access rules are satisfied.
- **Main workflow:** Authorized maintainer records approved disease information; eligible user selects a disease and views its information and common symptoms.
- **Success outcome:** Eligible users can access the recorded information.
- **Alternative/error paths:** Unauthorized maintenance is denied; content review and missing-content behavior are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-008, Q-014, Q-024.

## UC-009 — Find or book a laboratory test

- **Actors:** User; precise booking actor unresolved.
- **Requirements:** LAB-001, LAB-002.
- **Preconditions:** Catalog and access rules are unresolved.
- **Main workflow:** User searches the agreed test catalog. A lab-booking flow is [NEEDS CLARIFICATION] and is not defined by this draft.
- **Success outcome:** Search outcome follows agreed rules; booking outcome is not yet specified.
- **Alternative/error paths:** No-match and booking-failure outcomes are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-002, Q-015, Q-024.

## UC-010 — Upload and access lab results

- **Actors:** Authorized laboratory user; authenticated patient.
- **Requirements:** LAB-003, LAB-004, DATA-001.
- **Preconditions:** Uploader is authorized; intended patient is identified under agreed rules.
- **Main workflow:** Uploader submits a result for a patient; system validates the submission; once available under the agreed publication rules, that patient searches for and views it.
- **Success outcome:** An accepted result is associated with and accessible to its intended patient.
- **Alternative/error paths:** Unauthorized upload or cross-patient access is denied; invalid-file and replacement behavior are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-016, Q-019, Q-024.

## UC-011 — View patient history

- **Actors:** Authorized doctor.
- **Requirements:** HIST-001, AUTHZ-001.
- **Preconditions:** Doctor has the agreed patient-specific access permission.
- **Main workflow:** Doctor selects an authorized patient and retrieves permitted past lab reports and appointment records.
- **Success outcome:** The permitted history is displayed.
- **Alternative/error paths:** Missing permission denies access; empty-history behavior is unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-017, Q-024.

## UC-012 — Pay for a service

- **Actors:** Authenticated user; external payment gateway.
- **Requirements:** PAY-001, AUTH-003.
- **Preconditions:** Service, amount, provider, and payment eligibility follow the agreed payment rules.
- **Main workflow:** User initiates a service payment; the gateway processes it; the system handles the confirmed outcome using the agreed integration.
- **Success outcome:** The payment outcome is known according to the agreed confirmation policy.
- **Alternative/error paths:** Declines, timeouts, duplicate requests, refunds, and uncertain provider outcomes are unresolved.
- **Open decisions:** [NEEDS CLARIFICATION] Q-018, Q-024.

## UC-013 — Provide online diagnosis

- **Actors:** [NEEDS CLARIFICATION].
- **Requirements:** DIAG-001.
- **Preconditions:** [NEEDS CLARIFICATION]
- **Main workflow:** [NEEDS CLARIFICATION] No actor or clinical/automated workflow has been assumed.
- **Success outcome:** [NEEDS CLARIFICATION]
- **Alternative/error paths:** [NEEDS CLARIFICATION]
- **Open decisions:** [NEEDS CLARIFICATION] Q-012.

## Cross-use-case journeys

- **Patient:** registration/login (UC-001) → doctor discovery (UC-004) → booking (UC-005) → consultation when online (UC-006) → prescription access (UC-007). Payment timing is unresolved; this sequence does not mandate payment or prescription issuance for every appointment.
- **Doctor:** profile/schedule maintenance (UC-003) → appointment management (UC-005) → consultation (UC-006) → prescription issuance when applicable (UC-007). Verification precedes prescribing; how it occurs is unresolved.
- **Laboratory and patient:** authorized result upload → publication under an agreed policy → patient result access (UC-010). Lab booking is not assumed to be a prerequisite.
- **Patient history:** a doctor with an approved access relationship views prior records (UC-011). Merely being a doctor does not settle patient-specific permission.


## Approved expansion — 2026-10-06

Owner approved LABPOL-001–010 in [lab booking policy](lab-booking-policy.md), extending the earlier laboratory search/booking exclusions. The policy table contains rules and acceptance outcomes for discovery → request → lab response → cancellation/expiry/completion → private report linkage. Doctor confirmation remains unchanged. EXP-AI-002 adds sourced education for a named condition and clinician navigation, without diagnosis, prescribing or test recommendations. Implementation and limitations: [lab and education guide](../labs-and-education-guide.md). Real-patient operational acceptance remains outstanding.
