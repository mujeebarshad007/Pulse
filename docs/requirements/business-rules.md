# Business rules

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

Business rules describe domain restrictions. Functional requirements describe the capabilities that enforce them. Neither a staff verification screen nor a new actor is implied by an unresolved process.

| ID | Rule | Source sections | Open decisions |
|---|---|---|---|
| BR-001 | Only authenticated registered users may book appointments, make payments, or view prescriptions and lab reports. | 1.3 | Q-005 |
| BR-002 | Electronic prescriptions may be issued only by verified doctors registered on the platform. | 1.3 | Q-007, Q-013 |
| BR-003 | Patients may access their own prescriptions and lab results. Additional sharing permissions are [NEEDS CLARIFICATION]. | 3; 6.2 | Q-013, Q-016, Q-017 |
| BR-004 | Only authorized laboratory users may upload laboratory results. The authorization process is [NEEDS CLARIFICATION]. | 3; 1.3 | Q-004, Q-016 |
| BR-005 | Doctor availability shall inform appointment booking to reduce scheduling conflicts. Exact conflict and capacity rules are [NEEDS CLARIFICATION]. | 1.2.3 | Q-009, Q-010 |
| BR-006 | Doctors may access patient history only under the applicable authorization rules. The meaning of “when needed” is [NEEDS CLARIFICATION]. | 5.1; 6.2 | Q-017 |
| BR-007 | Healthcare information shall be supplied and maintained by authorized users or healthcare providers. Responsibility for validating accuracy is [NEEDS CLARIFICATION]. | 1.3 | Q-006, Q-014, Q-016 |

Coverage: BR-001 → AUTH-003; BR-002 → RX-001; BR-003 → RX-002 and LAB-004; BR-004 → LAB-003; BR-005 → SCHED-001 and APPT-001; BR-006 → HIST-001; BR-007 → DOC-001, DISEASE-002, and LAB-003.

No cancellation fee, refund policy, age threshold, retention period, or clinical decision rule has been assumed. See the clarification register in [SRS.md](SRS.md).
