# Pulse backend architecture

Updated 2026-09-29. Server-only TypeScript modules run inside the single Next.js Node application. Route handlers authenticate, bound/parse the request, validate it and call capability services. PostgreSQL access uses `pg`; Zod validates untrusted command input.

- `auth.ts`: Better Auth Google configuration and database-derived role/doctor ownership.
- `workspace.ts`: coherent repeatable-read snapshots with minimal permitted records; validated profile/content/booking commands.
- `appointments.ts`: transactional requests and doctor-scoped status changes.
- `reports.ts`: private disk files, metadata, integrity hashes and access-controlled reads.
- `http.ts`: same-origin changes, bounded streaming bodies, safe error responses and no-cache headers.

Migrations create the application namespace, availability/appointments with overlap constraints, then auth/member/profile/content/report tables. Applied migrations are immutable. `btree_gist` allows the database to reject competing overlapping bookings across processes. Internal identities must come from server sessions.

Google accounts begin as patients. Staff grants are operator commands, not a public admin feature; grants revoke old sessions. A doctor can be linked to a fictional seed profile through its owner reference. Account email changes are not accepted through patient-profile commands.

Upload writes a random private file before inserting metadata and cleans up on an ordinary SQL failure. A process crash between those steps can leave an orphan file; automated reconciliation is not implemented. Files are not held inside long SQL transactions. Downloads check the current actor and file hash.

Snapshots have explicit tester-size bounds, not full large-dataset pagination. No second NestJS service is needed. See [current scope and limits](../tester-mvp.md) and [learning guide](../connected-app-guide.md).
