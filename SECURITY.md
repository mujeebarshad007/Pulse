# Pulse security boundary

Connected mode uses server-validated Better Auth sessions and database-derived roles. New Google accounts receive patient access. The owner assigns staff roles using an operator command that revokes old sessions. Browser personas exist only in the explicit memory-only demo.

Every mutation and private report download derives identity on the server. Report access is restricted to its patient and uploading lab. Doctors receive their own appointments and minimal related patient identity, not broader patient history. Public snapshots exclude private patients, appointments, reports and unpublished articles.

PDF bytes stay outside public assets, with random filenames, OS permissions, integrity hashes and authenticated attachment downloads. These controls do not provide malware scanning or storage encryption. Only fictional trusted documents are supported. The deployment host must supply TLS and an encrypted durable volume. Remote production database connections require certificate verification; OS-private Unix sockets are allowed locally.

No real-patient launch, clinical review, compliance certification, penetration test, operational backup restore test or unlimited scalability is claimed. Retention/correction/deletion, provider verification, malware inspection, monitoring and incident response remain real-release requirements. See [current limits](docs/tester-mvp.md).

Do not post secrets or private records in issues. The owner must establish a private disclosure contact before public production use.
