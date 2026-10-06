# Approved lab-booking policy

2026-10-06. The owner requested that full lab-booking and confirmation rules be defined before implementation. The owner **approved LABPOL-001–010** in the conversation on 2026-10-06. The attached lab assignment is reference material; it does not automatically override the frozen scope or supply real lab partners.

| ID | Approved rule | Acceptance |
| --- | --- | --- |
| LABPOL-001 | V1 supports visits to a laboratory location, one test per booking. No home collection, packages or payments. | A booking identifies one patient, offering, lab and slot; unsupported service types cannot be submitted. |
| LABPOL-002 | The owner assigns lab accounts; a lab maintains only its own offerings, PKR prices, location, source-approved preparation instructions and availability. | Other labs cannot edit its catalog or slots. Unpublished/inactive offerings cannot be booked. |
| LABPOL-003 | One patient per slot. Requested and Confirmed bookings reserve capacity. Existing active patient lab visits cannot overlap. | Concurrent requests for the same slot have one winner; overlapping patient requests fail safely. |
| LABPOL-004 | Patient submission creates Requested, never Confirmed. Owning lab confirms or declines before the slot starts. The assigned lab marks a confirmed visit Completed only after its start time. | UI explicitly says pending approval; invalid transitions and another lab's actions are rejected. |
| LABPOL-005 | Patients can cancel Requested/Confirmed lab visits before their start. Labs can cancel with a reason before the start. Cancellation/decline releases capacity. No rescheduling action; cancellation and a new request are separate actions. | Race between cancellation and confirmation preserves one valid state. No booking is silently transferred. |
| LABPOL-006 | Unanswered Requested bookings expire at the slot start. A persisted expiry transition runs in booking/status operations; no guaranteed notification service is implied. | An expired request cannot become Confirmed; history remains visible. |
| LABPOL-007 | Record a price snapshot when requested. A subsequent catalog price change does not silently change that request. Payment occurs outside Pulse. | Patient and lab see the same saved amount; no online charge is made. |
| LABPOL-008 | Optional report linkage to a lab booking must match its patient and lab. PDF access remains patient + uploading lab. Completing a visit does not imply a result is available. | Cross-patient/lab linking is denied; no report is fabricated to complete a visit. |
| LABPOL-009 | Blank filters browse all published offerings; search supports test, category, lab and city. “View past records” opens the patient's own reports; no inference that a report is for this test without a verified link. | Empty/error/unavailable states are explicit; unavailable booking buttons are disabled and server checks repeat validation. |
| LABPOL-010 | Doctor appointments retain the existing doctor-confirmation lifecycle. No clinical test recommendations from AI. | A search or AI response never orders a test or auto-confirms a visit. |

Before real users: partner permission, verified locations/fees/preparation text, retention, complaint handling and operational responsibilities remain necessary. Distance search also needs a location/geocoding policy; none is invented here.

Remaining release dependency: supply participating labs and controlled test information before real-data seeding. Existing fictional tester data is not real healthcare availability.
