ALTER TABLE pulse.reports ADD COLUMN storage_driver text NOT NULL DEFAULT 'local'
  CHECK (storage_driver IN ('local','netlify'));

CREATE TABLE pulse.report_uploads (
  id uuid PRIMARY KEY,
  lab_id text NOT NULL REFERENCES pulse.members(id),
  patient_id text NOT NULL REFERENCES pulse.patients(id),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
  file_name text NOT NULL CHECK (length(file_name) BETWEEN 1 AND 160),
  byte_size integer NOT NULL CHECK (byte_size BETWEEN 12 AND 10485760),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '15 minutes',
  report_id uuid REFERENCES pulse.reports(id)
);
CREATE INDEX report_uploads_expiry ON pulse.report_uploads(expires_at);
CREATE INDEX report_uploads_lab ON pulse.report_uploads(lab_id);
CREATE TABLE pulse.report_upload_parts (
  upload_id uuid NOT NULL REFERENCES pulse.report_uploads(id) ON DELETE CASCADE,
  part integer NOT NULL CHECK (part BETWEEN 0 AND 4),
  bytes bytea NOT NULL CHECK (octet_length(bytes) BETWEEN 1 AND 2097152),
  PRIMARY KEY(upload_id, part)
);
CREATE TABLE pulse.request_limits (
  key text PRIMARY KEY,
  bucket bigint NOT NULL,
  hits integer NOT NULL CHECK (hits > 0)
);
