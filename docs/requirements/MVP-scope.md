# MVP scope

Updated: 2026-09-26 · Phase 3 scope summary

The authoritative version 1 boundary is [MVP-freeze.md](MVP-freeze.md). This supersedes this document’s earlier “no MVP selected” status. Requirement behavior and acceptance details remain draft wherever marked [NEEDS CLARIFICATION] in the catalogs. No application implementation is authorized by this document.

## Fixed version 1 delivery

- **MUST HAVE:** accounts/authentication, applicable access control, patient information, doctor profiles/details, all three doctor-search criteria, availability, physical booking and doctor appointment management, authorized lab uploads, patient result search/viewing, data validation, and applicable security/quality/deployment obligations.
- **SHOULD HAVE, included in V1:** disease-information maintenance and browsing, delivered together after the core journeys. Removing this journey requires an explicit scope revision.
- **COULD HAVE, beyond V1:** laboratory test catalog/search (LAB-001) and doctor access to broader patient history (HIST-001).
- **OUT OF SCOPE for V1:** online appointment type, remote consultations, online diagnosis, prescriptions, payments, laboratory test booking, and unaccepted tracking/submission/feedback fragments.

The freeze contains requirement IDs, use cases, dependencies, expected results, acceptance criteria and branch-specific restrictions. Complete provider-to-patient journeys are the delivery unit. No “if time permits” additions or automatic removal of included features is allowed.

## Source increments mapped to the freeze

The original increment sequence remains historical planning information, not the release boundary.

| Source increment | Requirements | Version 1 decision |
|---|---|---|
| 1: Registration/login | AUTH-001–AUTH-003 | Included for V1 operations |
| 2: Profiles/disease information | DOC-001–DOC-002; DISEASE-001–DISEASE-002 | Profiles MUST HAVE; disease journey SHOULD HAVE and included |
| 3: Doctor search/booking | SEARCH-001; SCHED-001; APPT-001–APPT-002 | Included; APPT-001 physical branch only |
| 4: Consultations/prescriptions | CONS-001; RX-001–RX-002 | OUT OF SCOPE |
| 5: Payments/lab results | PAY-001; LAB-003–LAB-004 | Payments OUT OF SCOPE; both lab-result sides MUST HAVE |
| 6: Integration/testing/deployment | Existing acceptance criteria; DEPLOY-001 | Mandatory for included workflows |
| Not clearly assigned | USER-001; DATA-001; AUTHZ-001 | MUST HAVE |
| Not clearly assigned | LAB-001; HIST-001 | COULD HAVE; excluded from V1 |
| Not clearly assigned | LAB-002; DIAG-001 | OUT OF SCOPE |

## Remaining constraints

Q-002 now has a V1 selection in the freeze. Account and role policies, record fields, search matching, scheduling rules, lab publication, disease governance, security controls, measurable quality targets, release context, course/hosting constraints, schedule and acceptance authority remain [NEEDS CLARIFICATION]. Read the freeze’s question-impact table before implementing an affected workflow. Scope selection does not imply these questions were answered or that release acceptance has passed.

The broader requirement catalogs and Phase 2 validation report remain available for traceability. Their deferred capabilities do not automatically become V1 tasks. No new product feature has been added.
