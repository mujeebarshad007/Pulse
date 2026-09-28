# Security architecture

Status: production security design; frontend demo boundary, updated 2026-09-28. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. This design records the simplified stack for the current scaffold; unanswered business and security policies remain [NEEDS CLARIFICATION].

## Authentication and authorization

Choose one maintained authentication integration compatible with Next.js and the selected host. It must support the approved account lifecycle, secure server-side sessions or equivalent revocation, protected cookies, CSRF defenses where needed, and controlled logout/expiry. The exact library, credential type and timeouts await Q-005/Q-020; no homemade password or token scheme.

Check permissions on the server for every sensitive operation. Identity answers **who is signed in**; authorization answers **whether that identity may perform this action on this particular record**. A patient may read only permitted own reports; a lab user may upload only under the approved lab policy; a doctor may manage only authorized appointments and profiles. The actual role-granting and patient-matching process remains Q-004/Q-006/Q-016. Do not invent an admin dashboard to fill the gap.

A browser may hide an unavailable action for clarity but is not a security boundary. Validate direct requests and submitted identifiers. Never allow registration input to self-assign privileged roles. If an identity or role changes, protected cached data must be cleared and access rechecked.

## Sensitive data boundaries

The browser never receives database credentials, storage keys, password hashes or server secrets. Report bytes remain in private storage, are checked for allowed size/type and required inspection, and are served only after a fresh server-side permission check. The exact upload limits and inspection policy remain Q-016/Q-020. No report URL should bypass ownership checks.

Deploy through HTTPS; set secure cookie and response-cache policies according to the selected auth integration. Sensitive responses must not be publicly cached or preserved across account changes. Protect state-changing cookie-based operations against CSRF. Log no passwords, cookies, report content, patient names or symptom values. All tests use synthetic data. Real-patient deployment requires the agreed legal/privacy and operational decisions under Q-003/Q-020.

Security test scenarios: invalid/expired session, patient A reading patient B's report, forged role/owner fields, unauthorized lab upload, malformed file, over-capacity concurrent booking and sensitive data in logs or client artifacts. These are tests of existing AUTHZ-001/SEC-001/SEC-002/DATA-001 requirements, not new clinical features. No authentication or private data functionality has been built yet.

## Implemented demo boundary

The current frontend uses public fictional fixtures and an explicit persona switcher. Login/registration forms demonstrate input handling; they never store or verify passwords. Client command checks and own-report selectors are tested for consistent UI behavior, not resistance to an attacker. Every fixture is available in the browser bundle. Never use real patient data here.

Fictional text files are read locally (at most 65,536 bytes), rendered as text, and never uploaded to a server. Browser memory is cleared by refresh; persona switching intentionally retains the shared demo records. There is no localStorage, remote tracking or product request logging. These are prototype boundaries, not a selected production file policy. Remove demo controls/store before connecting real records. See [delivery and pending validation](../frontend-delivery.md) and [SECURITY.md](../../SECURITY.md).
