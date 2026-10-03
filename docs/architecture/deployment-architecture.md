# Pulse deployment architecture

Updated 2026-09-29. Deploy this tester release as one Node web service plus PostgreSQL and an encrypted persistent disk. The existing private-file adapter does not support ephemeral serverless filesystems or multiple independent app instances.

Next.js produces standalone output. The non-root Docker recipe excludes local data/environment files and packages the app, static assets, compiled operator scripts and SQL migrations. Docker itself is unverified locally because no Docker/Podman executable is available.

Run migrations as a controlled release command, seed fictional data explicitly, and configure Google OAuth for the exact HTTPS origin. Host secrets contain database credentials, the auth secret and Google OAuth credentials. `PRIVATE_STORAGE_DIR` must point to the mounted durable volume outside public assets. `/api/health` checks database/schema availability; it does not certify OAuth or disk health.

The owner has no Google Cloud or hosting account configured yet. No public URL, push or deployment exists. [The setup guide](../deploy-tester.md) includes local Google callbacks, staff provisioning, a Render Node-service recipe and Docker alternatives.

CI runs lint, frontend tests/build and isolated PostgreSQL tests. Remote CI, live Google consent, browser acceptance, a hosted restart/persistence check and backup restore evidence remain unverified. Keep prior artifacts and compatible forward-only schema migrations for rollback; do not delete data as a rollback mechanism.


## Implementation update — 2026-10-03

Netlify is now an alternative target through root netlify.toml. Use hosted PostgreSQL with verified TLS and REPORT_STORAGE=netlify. Do not deploy local-disk storage on ephemeral functions. The source package is not a static drag-and-drop export. See ../netlify-deployment.md for exact configuration, chunking, hosted streaming validation and separate preview storage.

This update supersedes conflicting earlier tester-deployment descriptions, without approving unresolved real-patient production policies. Validation and limits: [release evidence](../release-readiness.md).
