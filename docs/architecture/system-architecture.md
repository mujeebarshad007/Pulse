# Pulse system architecture

Updated 2026-09-29. One Next.js application serves the responsive UI and Node route handlers. PostgreSQL is the shared source of truth. Better Auth supplies Google authentication and server sessions. A private durable filesystem volume stores fictional PDFs outside web assets.

Connected flow: page → provider → authenticated API → validated capability service → PostgreSQL/private files → authorized snapshot. The browser cannot choose its server identity or staff role. The owner assigns staff through a server command.

Implemented journeys match the [MVP freeze](../requirements/MVP-freeze.md): physical appointments, lab reports and sourced information. Public directory/library projections are separate from private records. Snapshots refresh after writes, on focus and every 15 seconds while visible.

The existing memory-only prototype is explicitly selectable with `APP_MODE=demo`. It is not authentication. Connected mode is the default.

This release targets fictional-data testers, one app instance and a durable disk. Real Google consent, hosting, browser acceptance and operational recovery remain external/release work. No native mobile app, clinical production acceptance or unlimited scale is claimed. See [delivery status](../tester-mvp.md), [setup](../deploy-tester.md) and [file guide](../connected-app-guide.md).
