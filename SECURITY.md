# Pulse security boundary

Connected mode uses server-validated Better Auth sessions and database-derived roles. New Google accounts receive patient access. The owner assigns staff roles using an operator command that revokes old sessions. Browser personas exist only in the explicit memory-only demo.

Every mutation and private report download derives identity on the server. Report access is restricted to its patient and uploading lab. Doctors receive their own appointments and minimal related patient identity, not broader patient history. Public snapshots exclude private patients, appointments, reports and unpublished articles.

PDF bytes stay outside public assets, with random filenames, OS permissions, integrity hashes and authenticated attachment downloads. These controls do not provide malware scanning or storage encryption. Only fictional trusted documents are supported. The deployment host must supply TLS and an encrypted durable volume. Remote production database connections require certificate verification; OS-private Unix sockets are allowed locally.

No real-patient launch, clinical review, compliance certification, penetration test, operational backup restore test or unlimited scalability is claimed. Retention/correction/deletion, provider verification, malware inspection, monitoring and incident response remain real-release requirements. See [current limits](docs/tester-mvp.md).

Do not post secrets or private records in issues. The owner must establish a private disclosure contact before public production use.
# Netlify and AI update — 2026-10-03

Netlify deployments use a private Blobs adapter, authenticated 2 MiB upload pieces and streamed authorized downloads. File type/signature/integrity checks do not constitute malware scanning. Use trusted fictional PDFs. Local report objects are not automatically transferred to Netlify. See [deployment/storage limits](docs/netlify-deployment.md).

The optional AI assistant requires a server session, explicit transmission consent and database-backed request limits. It transmits the user's question and public directory fields to OpenAI with `store:false`. It never queries private reports or patient records. Users must not put private information in questions; this is not a clinical assistant or a promise of zero provider retention. Model responses are schema-checked, doctor IDs are verified and app-authored text/links replace arbitrary model prose.

See [release findings](docs/release-readiness.md), including the unresolved development dependency advisory and operational security gates. Never use the fictional tester as an accepted real-patient production service.
