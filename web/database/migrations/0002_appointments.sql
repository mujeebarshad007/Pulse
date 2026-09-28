-- Identity/profile foreign keys follow once account provisioning is approved.
-- These tables are internal only; no unauthenticated HTTP access is provided.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE pulse.availability (
  id uuid PRIMARY KEY,
  doctor_id text NOT NULL CHECK (length(doctor_id) BETWEEN 1 AND 128),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  CHECK (isfinite(starts_at) AND isfinite(ends_at) AND ends_at > starts_at),
  UNIQUE (id, doctor_id, starts_at, ends_at),
  EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
);

CREATE TABLE pulse.appointments (
  id uuid PRIMARY KEY,
  patient_id text NOT NULL CHECK (length(patient_id) BETWEEN 1 AND 128),
  doctor_id text NOT NULL,
  slot_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Requested'
    CHECK (status IN ('Requested', 'Confirmed', 'Declined', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (slot_id, doctor_id, starts_at, ends_at)
    REFERENCES pulse.availability(id, doctor_id, starts_at, ends_at) ON DELETE RESTRICT,
  EXCLUDE USING gist (patient_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
    WHERE (status <> 'Declined'),
  EXCLUDE USING gist (doctor_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
    WHERE (status <> 'Declined')
);

CREATE UNIQUE INDEX appointments_one_occupant ON pulse.appointments(slot_id)
  WHERE status <> 'Declined';
CREATE INDEX appointments_patient_date ON pulse.appointments(patient_id, starts_at DESC);
CREATE INDEX appointments_doctor_date ON pulse.appointments(doctor_id, starts_at DESC);

-- Also enforce the selected lifecycle for direct database writes.
CREATE FUNCTION pulse.check_appointment_transition() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.id, NEW.patient_id, NEW.doctor_id, NEW.slot_id, NEW.starts_at, NEW.ends_at, NEW.created_at)
     IS DISTINCT FROM
     ROW(OLD.id, OLD.patient_id, OLD.doctor_id, OLD.slot_id, OLD.starts_at, OLD.ends_at, OLD.created_at) THEN
    RAISE EXCEPTION 'Appointment identity and schedule are immutable' USING ERRCODE = '23514';
  END IF;
  IF NEW.status <> OLD.status AND NOT (
    (OLD.status = 'Requested' AND NEW.status IN ('Confirmed', 'Declined')) OR
    (OLD.status = 'Confirmed' AND NEW.status = 'Completed')
  ) THEN
    RAISE EXCEPTION 'Invalid appointment transition' USING ERRCODE = '23514';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER appointment_transition BEFORE UPDATE ON pulse.appointments
  FOR EACH ROW EXECUTE FUNCTION pulse.check_appointment_transition();
