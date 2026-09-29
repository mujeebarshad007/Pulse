# Backend foundation and learning checkpoint

Historical infrastructure/scheduling checkpoint. The 2026-09-29 connected delivery supersedes the pending identity/profile/content/report work described below. See [current tester status](tester-mvp.md) and [connected file guide](connected-app-guide.md). This file preserves the earlier learning/evidence record.

Date: 2026-09-28. Status: database infrastructure and internal appointment services implemented and tested; connected backend incomplete.

## Scope and actual result

The user requested building the backend/database before authentication and authorization, with a future production release. This changes the sequence: implement and test internal database/services first; integrate identity and permissions before exposing protected HTTP operations. It does not authorize unauthenticated medical-data endpoints.

This checkpoint contains a server-only PostgreSQL connection pool, transaction helper, safe error categories, checksummed forward-only SQL migrations, an isolated persistent local development database, and an independent temporary-database integration test runner. It creates the `pulse` schema, migration ledger, availability and appointment tables. Patient/doctor profiles, reports, accounts and disease-content tables remain unimplemented. The frontend still uses its in-memory demo.

There are no product HTTP endpoints, account credentials, authentication providers, role assignment or live deployment in this checkpoint. No real patient data is used. The existing system PostgreSQL cluster was left unchanged: the project runs its own instance using a Unix socket inside a directory restricted to the current OS user. TCP is disabled. The development instance is an infrastructure convenience, not a production database configuration.

## Recorded decisions and remaining questions

- **Current requested endpoint:** the owner now wants a connected tester MVP through private file storage, rather than a production launch. Authentication and authorization are dependencies of that endpoint. Protected routes must remain unavailable until both are implemented. The proposed tester account/report policy is awaiting confirmation; see [tester MVP plan](tester-mvp.md).
- **Booking policy selection delegated:** in response to the booking question, the user said “Use the best approach you can.” Selected policy: one patient per slot; Requested → Confirmed or Declined; Confirmed → Completed; non-declined appointments cannot overlap for either doctor or patient. Cancellation and rescheduling remain excluded. The internal schema/services now implement this policy with timezone-aware instants. Slot creation/booking require future times; no fixed duration or recurrence is imposed. The UI will display Asia/Karachi when connected.
- **Final release intent:** a production version is desired after the MVP. Hosting, jurisdiction, operational targets and real-patient release review remain unresolved.
- **Login breadth:** the user wants “all kinds of possible login.” Exact supported methods, account linking, recovery and provider selection remain [NEEDS CLARIFICATION] for the deferred auth phase. This is not a finite implementation specification.
- **Report/content rules:** the proposed private PDF ≤10 MB, existing patient ID, inspection before release, and sourced draft/published disease entries remain awaiting an answer (Q-014/Q-016/Q-019/Q-020).
- **Initial profile/account model:** existing demo fields, four roles, one role per account and owner-provisioned staff remain awaiting an answer (Q-004/Q-006/Q-019). The booking answer is not treated as an answer to these separate questions.

The user's requirement to ask about unresolved policies remains applicable. These pending answers block account/report-dependent work. Scheduling is independently implemented under the previously delegated booking policy; it does not decide account or report policies implicitly.

## Why these tools

`pg` is the PostgreSQL driver. SQL migrations make keys, constraints and transaction behavior visible, which supports this project's learning goals. `server-only` prevents accidental imports into Next.js browser components; it is not a substitute for permission checks. `@types/pg` provides editor/compiler types. Existing TypeScript and Node's built-in test runner provide tests without another test framework. An initially considered validation dependency was removed because the infrastructure does not need it yet.

No connection is opened during an ordinary frontend build. Backend configuration is loaded only when a backend command or server function requests it. Each process has a bounded pool; connection and query timeouts bound resource use. Production connections require `sslmode=verify-full`. Pool limits are configuration defaults, not throughput guarantees. Size the total pool budget across deployed instances once the host and database capacity are known.

Transactions use one checked-out connection from BEGIN through COMMIT/ROLLBACK. Connections are released even after failure. Migrations are serialized with a PostgreSQL advisory lock, stored with SHA-256 checksums, and applied in a transaction. Editing, deleting or inserting before an already-applied migration is rejected. Add a new migration rather than modifying history. Run migrations as a controlled release command, not per web request.

## Run locally

From the repository root:

```bash
npm run setup
npm run db:local:start
```

This requires PostgreSQL server tools (`initdb`, `pg_ctl`, `createdb`, `pg_config`) and a non-root OS user. The script prints a non-secret Unix-socket connection. Put that value in an ignored `web/.env.local` as `DATABASE_URL`. This machine's connection was configured during implementation; no password was created. The committed `.env.example` contains placeholders only.

```bash
npm run db:check
npm run db:migrate
npm run db:local:status
npm run db:local:stop
```

Stopping retains local data in ignored `web/.local/postgres`. Starting it again reuses that isolated database. Do not delete that directory to apply a schema change. Use a new migration. Other machines get their own local path from the start script.

No application data backup/restore process is implemented yet. Do not use this development cluster for production or real patient records. Real deployment requires private managed storage, least-privilege database access, backups, restore evidence, monitoring and the selected authentication/authorization integration. Migration 0002 requires the standard PostgreSQL `btree_gist` extension; the migration operator must be allowed to install it.

## Validation

```bash
npm run test:backend  # compile and run against a fresh temporary PostgreSQL instance
npm run check        # existing frontend lint, 15 demo tests and production build
npm run check:all    # both groups
git diff --check
```

The backend test runner never uses your configured application `DATABASE_URL`. It creates a new OS-private temporary cluster, runs its tests, stops it and removes only that test directory. No production database reset/truncate command exists. Test fixtures contain only synthetic integers and migration definitions.

The earlier foundation checkpoint passed `npm run check:all`: ESLint, 15 demo tests, build/type check and seven infrastructure tests. The new appointment suite adds seven real PostgreSQL integration tests: competing slot requests, patient overlaps across doctors, adjacent and timezone-equivalent slots, decline/rebooking/history, ownership and lifecycle, validation/removal, and slot relationship integrity. See the current validation outcome in [tester MVP plan](tester-mvp.md). These tests do not prove authentication, report ownership, private storage or a connected product journey. CI installs PostgreSQL tools and runs the suite; no remote CI run is claimed.

## Learn the actual files

| File | Responsibility |
|---|---|
| `web/src/server/database.ts` | Reads server configuration, creates the bounded pool and wraps a transaction on one connection. |
| `web/src/server/errors.ts` | Converts known database failure codes to safe categories without exposing SQL values. |
| `web/src/server/migrations.ts` | Reads trusted SQL files, validates naming/history, locks migration execution and records checksums atomically. |
| `web/database/migrations/0001_backend_namespace.sql` | Creates the empty application namespace. It does not invent domain tables. |
| `web/database/migrations/0002_appointments.sql` | Availability and appointment records, foreign key to the exact slot, overlap/occupancy constraints, immutable identity and lifecycle trigger. |
| `web/src/server/appointments.ts` | Internal future-slot creation/removal, transactional request, owner-scoped transitions and paginated appointment reads. Identity arguments must eventually come from authenticated server sessions. |
| `web/tests/backend/appointments.test.ts` | Verifies competing writes and ownership against PostgreSQL, using fictional opaque IDs. |
| `web/scripts/database.mjs` | CLI entry for connection check and migration commands; avoids printing connection secrets or raw failures. |
| `web/scripts/postgres-process.mjs` | Shared lifecycle for a private Unix-socket PostgreSQL process. |
| `web/scripts/local-database.mjs` | Persistent local development start/stop/status. |
| `web/scripts/test-backend.mjs` | Owns the temporary test database lifecycle and runs the compiled tests. |
| `web/tests/backend/foundation.test.ts` | Verifies actual PostgreSQL behavior, not just mocked responses. |
| `web/tsconfig.backend.json` | Compiles server code/tests to ignored `.backend-build` for Node CLI/testing. |
| `web/.env.example` | Documents placeholder-only configuration; `.env.local` is ignored. |
| Root and `web/package.json` | Expose the commands above; the application lockfile pins installed dependencies. |
| `.github/workflows/frontend.yml` | Runs application checks and backend foundation tests on CI; no deployment. |

Existing ignore/lint/TypeScript settings exclude local database bytes and generated backend output. Existing frontend tests are kept separate from the database suite so ordinary frontend development does not require a database server.

Learning exercise: trace `requestAppointment` into migration 0002, then read the simultaneous-patient test. Explain why hiding an occupied slot in React cannot prevent double booking, and why the database constraint still works when two separate servers receive requests. Run `npm run test:backend` to verify your prediction.

The booking principal is an internal trusted argument, not implemented authentication. No HTTP handler exposes these services yet. Profile/account foreign keys must be added in a later migration once those records exist. Completed appointments retain historical occupancy; declined appointments release capacity. Referenced slots cannot be deleted, even after decline. No real profiles or patient records were seeded.

## References

Oladoc was reviewed only as a functionality reference. Its visible page contains phone OTP and phone/password account-entry controls, plus doctor discovery and appointment information. Its public page does not reveal its internal database, authorization or concurrency implementation. PULSE's frozen scope remains authoritative; excluded consultations, pharmacy, payments and lab-test booking are not imported. [Oladoc](https://oladoc.com/)

Implementation references: [node-postgres transactions](https://node-postgres.com/features/transactions), [connection pooling](https://node-postgres.com/features/pooling), [PostgreSQL table constraints](https://www.postgresql.org/docs/current/sql-createtable.html), and the installed Next.js data-security documentation. No claim of zero bugs, unlimited scaling or production certification is made.
