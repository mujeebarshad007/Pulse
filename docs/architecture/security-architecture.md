# Pulse security architecture

Updated 2026-09-29. The connected tester app implements Better Auth Google OAuth/server sessions, database-derived roles and ownership checks. Google handles passwords/recovery. Password signup is disabled outside isolated tests. No credentials were generated or stored in the repository.

All mutations require a server session and same-origin request. Zod schemas reject unsupported command fields. New Google users cannot submit a staff role. Operator role grants revoke sessions. Disabled members are denied application access.

Patients receive only their profile, appointments and reports. Doctors receive their appointments and minimal related patient identity. Labs match an exact patient reference and access only their own uploads. Editors can maintain drafts; public reads return only published entries. Private responses use no-store.

PDFs are limited to 10 MB, extension/signature checked, stored using random UUID filenames outside public assets with restrictive filesystem permissions, and downloaded as attachments after an ownership/hash check. These are not malware-scan or clinical-use guarantees. Only fictional trusted reports are supported. A host must supply encrypted durable storage and TLS.

Remote production PostgreSQL requires verified TLS; local OS-private Unix sockets are permitted. Auth uses secure cookies on HTTPS, bounded sessions and database-backed auth rate limits. Account tokens use the authentication library's encryption option. The reverse proxy must correctly sanitize forwarded client-IP headers and bound request size/rate; general distributed API rate limiting is not implemented.

Retained-data deletion/correction, real provider verification, clinical governance, malware scanning, operational recovery and privacy-release review remain future real-patient requirements. No compliance or penetration-test claim is made. See [SECURITY.md](../../SECURITY.md) and [tester limits](../tester-mvp.md).


## Implementation update — 2026-10-03

The AI scope excludes clinical advice and private record access. Explicit consent precedes external question transmission. Private report downloads authenticate ownership before storage access; Netlify objects have no public app URL. Chunked uploads share lab quotas with the retained legacy multipart endpoint. Provider secrets remain server-only. See ../../SECURITY.md and ../release-readiness.md for remaining gates.

This update supersedes conflicting earlier tester-deployment descriptions, without approving unresolved real-patient production policies. Validation and limits: [release evidence](../release-readiness.md).


## Login recovery update

Google/AI readiness now rejects placeholder credentials. OAuth failures return to /login with allowlisted app-authored feedback. Library auth logs retain category/level only; raw provider arguments are excluded. The private auth:check command outputs variable names only.
