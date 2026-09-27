# Non-functional requirements

Status: Draft for stakeholder review — not an approved implementation baseline.

Source: `Pulse Documentation version 1.docx`, the existing project plan, and the user’s instructions for a deployable learning project. Source section references below refer to the Word document. Only its text was reviewed; embedded diagrams have not been visually verified. No application code or technology selection is authorized by these documents.

No numerical targets, certifications, accessibility standard, or security mechanism has been invented. Unresolved rows reserve IDs for decisions rather than imposing defaults.

| ID | Category | Requirement or unresolved specification | Source | Open decisions |
|---|---|---|---|---|
| SEC-001 | Confidentiality | The system shall protect patient, doctor, and payment information against unauthorized disclosure. | 1.3; 6.1.1 | Q-017, Q-020 |
| SEC-002 | Protection mechanisms | [NEEDS CLARIFICATION] Concrete requirements for credentials, sessions, network transport, stored data, uploads, and payment handling are unspecified. | Gap beneath 1.3 confidentiality constraint | Q-020 |
| UX-001 | Usability and responsiveness | The system shall provide a simple, responsive interface for doctor search and healthcare-service access. | 1.2.3 | Q-023 |
| COMPAT-001 | Web compatibility | The system shall operate as a web-based application. Supported browsers and devices are [NEEDS CLARIFICATION]. | 1.1; 1.3 | Q-023 |
| PERF-001 | Performance | [NEEDS CLARIFICATION] No numerical response-time, throughput, concurrency, dataset, or upload-performance requirements are supplied. | Not specified | Q-021 |
| REL-001 | Availability and recovery | [NEEDS CLARIFICATION] Service availability, backup, recovery time, and acceptable data loss are unspecified. | Not specified; internet dependency in 1.3 | Q-022 |
| ERR-001 | Error handling | [NEEDS CLARIFICATION] Error presentation, recoverability, and retry behavior are unspecified beyond the input-validation intent in section 6.2. | 6.2; otherwise not specified | Q-024 |
| DEPLOY-001 | Deployability | The application shall be deployable as a web application. The target environment and release conditions are [NEEDS CLARIFICATION]. | User instruction; 4.1 increment 6 | Q-003, Q-025 |

Performance verification must use stakeholder-agreed measurement conditions. Internet availability is a source assumption, not a promised uptime target. Online consultation quality depends on the chosen mechanism and network conditions (Q-011, Q-021).
