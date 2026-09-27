# Architecture decisions and stack evaluation

Status: Phase 1 foundation architecture, updated 2026-09-27. The [MVP freeze](../requirements/MVP-freeze.md) controls product scope. This design records the simplified stack for the current scaffold; unanswered business and security policies remain [NEEDS CLARIFICATION].

## Why the direction changed

The original Phase 4 design assumed the user wanted Next.js and NestJS as separate services, plus Redux Toolkit and GSAP. The user later clarified they are learning independently, the university only offers a React course, and they want to build a real app while learning each slice. For this MVP, one Next.js application is the simpler learning and deployment choice. This change concerns implementation structure, not the frozen product requirements.

| Choice | Current status | Reason and tradeoff |
|---|---|---|
| Next.js + TypeScript | Selected and scaffolded in `web/` | React UI and server-side work in one application. Still requires explicit service/data and security boundaries. |
| Tailwind CSS | Selected and scaffolded | Responsive styling without a separate CSS framework. Learn basic CSS alongside it. |
| shadcn/ui | Planned; not installed | Add only components a real workflow needs. It provides owned component source, which the project must maintain. |
| PostgreSQL | Selected for later persistence; not installed or hosted | Relational integrity/transactions fit bookings. Operations and backups add work. |
| Data-access tool | Pending | Prisma is one candidate; select one compatible tool after inspecting its migration/transaction behavior. |
| Authentication integration | Pending | Choose a maintained solution after Q-005/Q-020 and hosting choice; avoid custom credential cryptography. |
| Private object storage | Planned; provider pending | Needed for durable private lab-report bytes; storage policy remains Q-016/Q-020. |
| NestJS | Deferred; not part of current scaffold | A separate API can teach backend structure but adds a second service and contract. Revisit only for a concrete later need. |
| Redux Toolkit | Deferred; not installed | Local state and framework data flow cover the initial journeys; introduce only for demonstrated shared client-state complexity. |
| GSAP | Deferred; not installed | No V1 acceptance criterion requires complex in-app animation. Promotional videos are separate deliverables. |
| Hosting, tests, versions | Partial/pending | Current scaffold records its installed versions in `web/package.json` and lockfile; deployment provider and domain-specific test tools are chosen later. |

## Boundaries and source of truth

The current stack and phase-1 files are in `web/`. The [system design](system-architecture.md) explains planned server/database/storage boundaries. [Security design](security-architecture.md) keeps authorization server-side. [Deployment design](deployment-architecture.md) distinguishes a built preview from an actually deployed product. The [MVP freeze](../requirements/MVP-freeze.md) remains authoritative for features and exclusions.

No current document claims authentication, PostgreSQL tables, report storage or an API already exists. No extra user-facing feature is introduced by simplifying the stack. Business decisions about roles, account policy, slot capacity, report handling, disease governance and real-patient use remain unresolved. Their dependent implementation must wait for answers.
