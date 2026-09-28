-- Better Auth core tables use explicit names to avoid reserved SQL identifiers.
CREATE TABLE pulse_auth_user (
  id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false, image text,
  "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE pulse_auth_session (
  id text PRIMARY KEY, "expiresAt" timestamptz NOT NULL, token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "ipAddress" text, "userAgent" text,
  "userId" text NOT NULL REFERENCES pulse_auth_user(id) ON DELETE CASCADE
);
CREATE INDEX auth_session_user ON pulse_auth_session("userId");
CREATE TABLE pulse_auth_account (
  id text PRIMARY KEY, "accountId" text NOT NULL, "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES pulse_auth_user(id) ON DELETE CASCADE,
  "accessToken" text, "refreshToken" text, "idToken" text,
  "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz,
  scope text, password text,
  "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("providerId", "accountId")
);
CREATE INDEX auth_account_user ON pulse_auth_account("userId");
CREATE TABLE pulse_auth_verification (
  id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_verification_identifier ON pulse_auth_verification(identifier);
CREATE TABLE pulse_auth_rate_limit (
  id text PRIMARY KEY, key text NOT NULL UNIQUE, count integer NOT NULL,
  "lastRequest" bigint NOT NULL
);

CREATE TABLE pulse.members (
  id text PRIMARY KEY REFERENCES pulse_auth_user(id) ON DELETE RESTRICT,
  role text NOT NULL DEFAULT 'patient' CHECK(role IN ('patient','doctor','lab','editor')),
  display_name text NOT NULL CHECK(length(display_name) BETWEEN 2 AND 80),
  enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE pulse.patients (
  id text PRIMARY KEY REFERENCES pulse.members(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
  email text NOT NULL CHECK(length(email) <= 254),
  phone text NOT NULL DEFAULT '' CHECK(length(phone) <= 30),
  city text NOT NULL DEFAULT '' CHECK(length(city) <= 60)
);
CREATE TABLE pulse.doctors (
  id text PRIMARY KEY,
  owner_id text UNIQUE REFERENCES pulse.members(id) ON DELETE RESTRICT,
  profile jsonb NOT NULL CHECK(jsonb_typeof(profile) = 'object'),
  fictional boolean NOT NULL DEFAULT true,
  CHECK(profile->>'id' = id)
);
CREATE INDEX doctor_city ON pulse.doctors((profile->>'city'));
CREATE INDEX doctor_specialty ON pulse.doctors((profile->>'specialty'));
ALTER TABLE pulse.availability ADD CONSTRAINT availability_doctor
  FOREIGN KEY(doctor_id) REFERENCES pulse.doctors(id);
ALTER TABLE pulse.appointments ADD CONSTRAINT appointment_patient
  FOREIGN KEY(patient_id) REFERENCES pulse.patients(id);
CREATE TABLE pulse.articles (
  id text PRIMARY KEY, document jsonb NOT NULL CHECK(jsonb_typeof(document) = 'object'),
  updated_by text REFERENCES pulse.members(id), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK(document->>'id' = id)
);
CREATE TABLE pulse.reports (
  id uuid PRIMARY KEY, patient_id text NOT NULL REFERENCES pulse.patients(id),
  lab_id text NOT NULL REFERENCES pulse.members(id),
  title text NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
  file_name text NOT NULL CHECK(length(file_name) BETWEEN 1 AND 160),
  byte_size integer NOT NULL CHECK(byte_size BETWEEN 1 AND 10485760),
  sha256 text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reports_patient_date ON pulse.reports(patient_id, created_at DESC);
CREATE INDEX reports_lab_date ON pulse.reports(lab_id, created_at DESC);
