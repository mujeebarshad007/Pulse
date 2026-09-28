# Server, database and API architecture

Status: database infrastructure and internal scheduling/appointment services implemented, updated 2026-09-28; connected identity/profile/content/report services remain pending. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. [The backend checkpoint](../backend-foundation.md) records actual files, tests, decisions and pending questions; older preparation notes below are historical. The current requested endpoint is a [connected tester MVP through private storage](../tester-mvp.md).

## One application's server side

Next.js is the server runtime. Keep route handlers/server actions thin: parse the request, establish the account, validate input, call a capability service and return a safe result. Services own business rules; data-access functions own database queries. Neither page components nor client code may import database, credential or storage modules. No separate NestJS server or duplicate API contract is included in this route.

Proposed capability boundaries are identity, patient information, doctor profiles/search, scheduling/physical appointments, lab reports and disease content. Implement each only when its relevant requirements and policies are resolved. No placeholder modules for excluded features.

## PostgreSQL plan

Conceptual records are account/session, patient, doctor, availability, physical appointment, lab-report metadata and disease information. `pg` and forward-only SQL migrations are selected. Availability and appointment tables now exist; other records and account/profile foreign keys remain pending. Booking policy was delegated and selected: Requested → Confirmed or Declined; Confirmed → Completed; no overlapping non-declined visits for a doctor or patient. Other fields, role cardinality and retention remain Q-004/Q-016/Q-019.

Foreign keys, unique identifiers and relevant checks protect structural integrity. Booking availability must be reread and enforced in one transaction with a coordinated lock/constraint fitting the approved capacity model. Competing requests must not both succeed beyond capacity. Do not assume slot duration, recurrence, cancellation or online visit states. PostgreSQL is the source of truth; UI state cannot reserve an appointment.

Store only report metadata and an internal private-object reference in PostgreSQL. Store bytes in durable private object storage selected after hosting, format, limit and security decisions. Upload should validate authority, patient association, size/type and required inspection, then publish only under the agreed rule. Storage/SQL partial failures require reconciliation; do not keep a large SQL transaction open while receiving a file. A server read checks ownership before returning metadata or bytes. This implements LAB-003/004 without adding test booking/catalog features.

## Contracts, validation and errors

For browser-to-server operations, use a clear TypeScript request/response shape plus runtime validation at entry. Compile-time types do not sanitize malicious network input. Enforce role and resource checks within server operations, especially for direct requests and forged owner IDs. Keep public projections separate from stored doctor/patient fields. Do not mass-assign request objects to database updates.

Only add `/api` route handlers when a real browser/upload/external contract needs them. Internal page reads can use server-side services directly. If an external API is later requested, document and version it then; do not build one solely because the earlier Nest architecture had `/api/v1`.

Map failures to distinct safe categories: invalid request, unauthenticated, forbidden/missing, booking conflict, unsupported/too-large upload and dependency failure. Exact behavior/code names remain Q-024. Do not return SQL errors, file keys, stack traces or private data to the browser. Redacted structured logs can include route template, request ID, duration and error class; retention/access remain Q-019/Q-020.

## Testing

Unit-test approved business rules. Integration-test actual authorization, session behavior, validation and constraints using isolated PostgreSQL. Use browser journey tests for patient booking → doctor management, lab upload → correct-patient read, and disease maintenance → reader. Fourteen backend tests now use real PostgreSQL, including concurrent bookings and internal owner-scoped operations. Authenticated sessions, HTTP permissions and private reports remain unimplemented and untested.

## Next implementation checkpoint — identity and persistence foundation

The user has requested moving beyond the frontend. Begin with account persistence, authentication and server-side identity/permission checks, then connect each existing frontend journey. This is a bounded first backend milestone, not authorization to interpret all prototype policies as requirements.

Three initial decisions have been requested and remain unanswered:

| Existing question | Decision needed | Recommendation / options, not an accepted answer |
|---|---|---|
| Q-003 | Initial release data and audience | Private testing with fictional records first, using actual server authentication and persistence; real-patient use needs its own release criteria. |
| Q-004 | Account provisioning and role cardinality | Patients self-register; the owner provisions staff through a controlled setup process; one role per account. No admin dashboard is implied. |
| Q-005 | Initial sign-in method | Choose email/password, Google-only, or email sign-in links before selecting the integration. |

Once these answers are recorded, evaluate the smallest compatible authentication/data-access tool set using official documentation, explain the proposed files, and implement the agreed foundation. Account/session settings, initial fields and verification/recovery behavior must also be made explicit for that method; do not invent them from a demo form. Booking and report policies remain deferred to their own implementation tasks.

Evidence sought for that foundation maps to AUTH-001–003, AUTHZ-001, DATA-001 and SEC-001–002: valid agreed account entry works; invalid entry does not establish identity; protected server operations reject missing/invalid sessions; submitted role fields cannot grant privileges; migrations work against an isolated test database. Exact cases follow the recorded account and session policy. The existing frontend tests alone cannot prove these outcomes.

Local read-only readiness inspection found Node 22.22.1, npm 9.2.0, PostgreSQL client 18.6 and an online local PostgreSQL 18 cluster on port 5432. Docker and Podman were not found on PATH. No database credentials were inspected, no database connection was made, and no existing cluster/database was altered. A running cluster is an available infrastructure option, not an application database or evidence of authorized access. Development/test isolation and connection setup remain to be established.

The installed Next.js authentication and data-security guides were reviewed. Keep authentication and record access in server-only services; return minimal authorized data to client components. Never connect the database from the demo provider or treat its persona selector as identity.
