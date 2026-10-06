# Functional requirements

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

Each requirement is defined once here. “Source-backed” means the capability appears in the plan; it does not mean its details or release priority are approved. Every row has unresolved details. References to these IDs elsewhere do not create additional requirements.

| ID | Capability | Requirement | Source sections | Open decisions |
|---|---|---|---|---|
| AUTH-001 | Registration | The system shall support user registration. | 1.2.2; 4.1 | Q-004, Q-005 |
| AUTH-002 | Authentication | The system shall authenticate registered users for protected functions. | 1.2.2; 1.3 | Q-005 |
| AUTH-003 | Protected operations | The system shall require authenticated registered users for appointment booking, payments, prescription viewing, and lab-report viewing. | 1.3 | Q-005 |
| AUTHZ-001 | Role-based access | The system shall restrict functions and records according to the user’s authorized role and access rights. | 1.2.3; 6.2 | Q-004, Q-017, Q-020 |
| USER-001 | Patient information | The system shall store and manage patient personal information and appointment records. | 1.2.2; 1.2.3 | Q-004, Q-019 |
| DOC-001 | Doctor profiles | The system shall support creating and managing doctor profiles. | 1.1; 3 | Q-006 |
| DOC-002 | Doctor details | The system shall present doctor details including specialization, experience, qualifications, location, availability, contact information, and fee. | 1.2.3; 1.3; 3 | Q-006, Q-009 |
| SEARCH-001 | Doctor search | The system shall allow users to search for doctors by specialization, symptoms, and location. | 1.2.3; 5.1 | Q-008 |
| SCHED-001 | Doctor schedules | The system shall support defining and updating doctor availability and schedules. | 1.2.2; 1.2.3 | Q-009 |
| APPT-001 | Appointment booking | The system shall allow registered patients to book physical or online appointments with registered doctors. | 1.2.3; 1.2.1; 3 | Q-009, Q-010, Q-018 |
| APPT-002 | Appointment management | The system shall allow doctors to manage appointments. | 3 | Q-010 |
| CONS-001 | Online consultations | The system shall support remote consultations between patients and doctors. | 1.1; 3; 4.1 | Q-011 |
| DIAG-001 | Online diagnosis | [NEEDS CLARIFICATION] The scope lists online diagnosis; its actor, meaning, and behavior are undefined. | 1.2.2; Changes Made | Q-012 |
| RX-001 | Prescription issuance | The system shall allow verified registered doctors to issue electronic prescriptions. | 1.3; 3 | Q-007, Q-013 |
| RX-002 | Prescription access | The system shall allow patients to view their electronic prescriptions. | 1.3; 3 | Q-013, Q-019 |
| DISEASE-001 | Disease browsing | The system shall allow users to browse disease information and common symptoms. | 1.2.3; 5.1 | Q-008, Q-014 |
| DISEASE-002 | Disease management | The system shall support management of disease information by authorized users. | 1.2.2; 1.3 | Q-004, Q-014 |
| LAB-001 | Lab-test search | The system shall support searching for laboratory tests. | 1.2.2; 1.3 | Q-015 |
| LAB-002 | Lab-test appointments | [NEEDS CLARIFICATION] Section 1.3 assumes users can make lab-test appointments, but no booking workflow or confirmed delivery scope is specified. | 1.3 | Q-002, Q-015 |
| LAB-003 | Report upload | The system shall allow authorized laboratory users to upload lab-test results. | 1.2.2; 3 | Q-016, Q-019 |
| LAB-004 | Patient report access | The system shall allow patients to search for and view their laboratory results online. | 1.2.1; 1.2.3; 3 | Q-016 |
| HIST-001 | Doctor access to patient history | The system shall allow authorized doctors to view a patient’s past laboratory results and appointment history. | 5.1; 6.2 | Q-017 |
| PAY-001 | Online payment | The system shall support online payments through a third-party payment gateway. | 1.1; 1.3; 3 | Q-018 |
| DATA-001 | Input validation | The system shall validate entered patient, doctor, appointment, and laboratory data to reduce incorrect or incomplete records. | 6.2 | Q-019, Q-024 |

No administrator functionality, recovery mechanism, communication channel, or payment provider is inferred. DIAG-001 and LAB-002 are unresolved capability placeholders, not implementable specifications.


## Approved expansion — 2026-10-06

Owner approved LABPOL-001–010 in [lab booking policy](lab-booking-policy.md), extending the earlier laboratory search/booking exclusions. The policy table contains rules and acceptance outcomes for discovery → request → lab response → cancellation/expiry/completion → private report linkage. Doctor confirmation remains unchanged. EXP-AI-002 adds sourced education for a named condition and clinician navigation, without diagnosis, prescribing or test recommendations. Implementation and limitations: [lab and education guide](../labs-and-education-guide.md). Real-patient operational acceptance remains outstanding.
