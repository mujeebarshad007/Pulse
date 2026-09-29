# Architecture decisions and stack evaluation

## Current connected delivery — 2026-09-29

- Better Auth 1.7.6 provides Google OAuth and database sessions; no custom password/auth protocol was built. Zod 4.6.5 validates API inputs. Both are pinned in the lockfile.
- The owner selected fictional Pakistani profiles for initial testing. Google users start as patients; owner CLI provisions staff, and doctors own their linked profiles.
- A private filesystem volume is the bounded tester storage adapter. This permits a single persistent-disk host and requires an object-storage change before multi-instance/serverless deployment. PDF inspection currently checks signature/size only; no malware scanning claim.
- API snapshots are authorized server-side and refreshed after changes/on focus/every 15 seconds. No WebSocket infrastructure is needed for this tester scope.
- A Docker/standalone package and setup guide exist. Google Cloud and hosting still need owner setup; no live deployment is claimed.

These decisions supersede the historical pending-backend statements below. See [current architecture](system-architecture.md).

Current backend addition (2026-09-28): appointment integrity uses PostgreSQL range exclusion constraints with the standard `btree_gist` extension, rather than an in-process lock. This coordinates concurrent writes across application instances. Migration 0002 and the server-only appointment service implement the previously delegated booking policy. They have no public HTTP endpoints or authenticated identity integration yet. See [tester MVP boundary](../tester-mvp.md).

Status: frontend implementation checkpoint, updated 2026-09-28. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. This design records the simplified stack for the current scaffold; unanswered business and security policies remain [NEEDS CLARIFICATION].

## Why the direction changed

The original Phase 4 design assumed the user wanted Next.js and NestJS as separate services, plus Redux Toolkit and GSAP. The user later clarified they are learning independently, the university only offers a React course, and they want to build a real app while learning each slice. For this MVP, one Next.js application is the simpler learning and deployment choice. This change concerns implementation structure, not the frozen product requirements.

| Choice | Current status | Reason and tradeoff |
|---|---|---|
| Next.js + TypeScript | Selected and scaffolded in `web/` | React UI and server-side work in one application. Still requires explicit service/data and security boundaries. |
| Tailwind CSS | Selected and scaffolded | Responsive styling without a separate CSS framework. Learn basic CSS alongside it. |
| shadcn/ui | Optional; not installed | Existing controls and native dialogs cover this demo without another package. Revisit if an interaction requires a maintained accessible primitive. |
| PostgreSQL | Selected for later persistence; not installed or hosted | Relational integrity/transactions fit bookings. Operations and backups add work. |
| Data-access tool | `pg` selected for backend infrastructure | Explicit SQL migrations and transaction control are visible and directly testable; the project maintains its query types and migration runner. No ORM installed. |
| Authentication integration | Pending | Choose a maintained solution after Q-005/Q-020 and hosting choice; avoid custom credential cryptography. |
| Private object storage | Planned; provider pending | Needed for durable private lab-report bytes; storage policy remains Q-016/Q-020. |
| NestJS | Deferred; not part of current scaffold | A separate API can teach backend structure but adds a second service and contract. Revisit only for a concrete later need. |
| Redux Toolkit | Deferred; not installed | Local state and framework data flow cover the initial journeys; introduce only for demonstrated shared client-state complexity. |
| GSAP | Deferred; not installed | No V1 acceptance criterion requires complex in-app animation. Promotional videos are separate deliverables. |
| Hosting, tests, versions | Local tests/build complete; host pending | Installed versions remain in the lockfile. TypeScript + Node built-in runner execute 15 domain tests; GitHub CI is configured but not run remotely. No new runtime dependencies were needed. |

## Boundaries and source of truth

The current stack and phase-1 files are in `web/`. The [system design](system-architecture.md) explains planned server/database/storage boundaries. [Security design](security-architecture.md) keeps authorization server-side. [Deployment design](deployment-architecture.md) distinguishes a built preview from an actually deployed product. The [MVP freeze](../requirements/MVP-freeze.md) remains authoritative for features and exclusions.

No current document claims authentication, PostgreSQL tables, report storage or an API already exists. No extra user-facing feature is introduced by simplifying the stack. Business decisions about roles, account policy, slot capacity, report handling, disease governance and real-patient use remain unresolved. Their dependent implementation must wait for answers.

## Frontend delivery decisions

The user requested the complete glassmorphism frontend after the samples. Air now informs the full product shell; original alternatives remain under `/design-preview`. React context + a pure demo model coordinate fictional records across roles, with no browser persistence. Proposed slot, lifecycle, report and content rules are explicitly documented in [frontend delivery](../frontend-delivery.md), not silently accepted as production requirements. A guided walkthrough is an additional demo UX feature. The repository now includes root commands, CI, contribution guidance and a file-by-file learning guide. These choices do not implement the planned backend or certify real-patient use.
