# Server, database and API architecture

Status: Phase 1 foundation architecture, updated 2026-09-27. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. This design records the simplified stack for the current scaffold; unanswered business and security policies remain [NEEDS CLARIFICATION].

## One application's server side

Next.js is the server runtime. Keep route handlers/server actions thin: parse the request, establish the account, validate input, call a capability service and return a safe result. Services own business rules; data-access functions own database queries. Neither page components nor client code may import database, credential or storage modules. No separate NestJS server or duplicate API contract is included in this route.

Proposed capability boundaries are identity, patient information, doctor profiles/search, scheduling/physical appointments, lab reports and disease content. Implement each only when its relevant requirements and policies are resolved. No placeholder modules for excluded features.

## PostgreSQL plan

Conceptual records are account/session, patient, doctor, availability, physical appointment, lab-report metadata and disease information. Exact fields, role cardinality, appointment states and retention remain Q-004/Q-009/Q-010/Q-016/Q-019. Choose one data-access and migration tool after checking current compatibility; Prisma is a candidate, not installed. Learn and test SQL constraints even if an ORM is used.

Foreign keys, unique identifiers and relevant checks protect structural integrity. Booking availability must be reread and enforced in one transaction with a coordinated lock/constraint fitting the approved capacity model. Competing requests must not both succeed beyond capacity. Do not assume slot duration, recurrence, cancellation or online visit states. PostgreSQL is the source of truth; UI state cannot reserve an appointment.

Store only report metadata and an internal private-object reference in PostgreSQL. Store bytes in durable private object storage selected after hosting, format, limit and security decisions. Upload should validate authority, patient association, size/type and required inspection, then publish only under the agreed rule. Storage/SQL partial failures require reconciliation; do not keep a large SQL transaction open while receiving a file. A server read checks ownership before returning metadata or bytes. This implements LAB-003/004 without adding test booking/catalog features.

## Contracts, validation and errors

For browser-to-server operations, use a clear TypeScript request/response shape plus runtime validation at entry. Compile-time types do not sanitize malicious network input. Enforce role and resource checks within server operations, especially for direct requests and forged owner IDs. Keep public projections separate from stored doctor/patient fields. Do not mass-assign request objects to database updates.

Only add `/api` route handlers when a real browser/upload/external contract needs them. Internal page reads can use server-side services directly. If an external API is later requested, document and version it then; do not build one solely because the earlier Nest architecture had `/api/v1`.

Map failures to distinct safe categories: invalid request, unauthenticated, forbidden/missing, booking conflict, unsupported/too-large upload and dependency failure. Exact behavior/code names remain Q-024. Do not return SQL errors, file keys, stack traces or private data to the browser. Redacted structured logs can include route template, request ID, duration and error class; retention/access remain Q-019/Q-020.

## Testing

Unit-test approved business rules. Integration-test actual authorization, session behavior, validation and constraints using isolated PostgreSQL. Use browser journey tests for patient booking → doctor management, lab upload → correct-patient read, and disease maintenance → reader. Test concurrent booking and cross-patient report access. Select and install concrete testing tools when these features are implemented. No backend or database currently exists.
