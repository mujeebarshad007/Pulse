CREATE TABLE pulse.lab_tests (
 id uuid PRIMARY KEY, lab_id text NOT NULL REFERENCES pulse.members(id),
 name text NOT NULL, category text NOT NULL, lab_name text NOT NULL,
 city text NOT NULL, address text NOT NULL, preparation text NOT NULL,
 fee integer NOT NULL CHECK(fee>=0), published boolean NOT NULL DEFAULT false,
 active boolean NOT NULL DEFAULT true, UNIQUE(id,lab_id)
);
CREATE TABLE pulse.lab_slots (
 id uuid PRIMARY KEY, test_id uuid NOT NULL, lab_id text NOT NULL,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 CHECK(ends_at>starts_at), FOREIGN KEY(test_id,lab_id) REFERENCES pulse.lab_tests(id,lab_id),
 UNIQUE(test_id,starts_at), UNIQUE(id,test_id,lab_id,starts_at,ends_at)
);
CREATE TABLE pulse.lab_bookings (
 id uuid PRIMARY KEY, patient_id text NOT NULL REFERENCES pulse.patients(id),
 slot_id uuid NOT NULL, test_id uuid NOT NULL, lab_id text NOT NULL,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 price integer NOT NULL CHECK(price>=0), request_key uuid NOT NULL,
 status text NOT NULL CHECK(status IN ('Requested','Confirmed','Declined','Cancelled','Expired','Completed')),
 reason text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(slot_id,test_id,lab_id,starts_at,ends_at) REFERENCES pulse.lab_slots(id,test_id,lab_id,starts_at,ends_at),
 UNIQUE(patient_id,request_key),
 EXCLUDE USING gist (patient_id WITH =, tstzrange(starts_at,ends_at,'[)') WITH &&)
 WHERE(status IN ('Requested','Confirmed'))
);
CREATE UNIQUE INDEX lab_slot_occupied ON pulse.lab_bookings(slot_id) WHERE(status IN ('Requested','Confirmed'));
CREATE INDEX lab_bookings_owner ON pulse.lab_bookings(lab_id,starts_at);
CREATE INDEX lab_bookings_patient ON pulse.lab_bookings(patient_id,starts_at);
CREATE INDEX lab_slots_future ON pulse.lab_slots(starts_at);
CREATE TABLE pulse.lab_booking_reports (
 booking_id uuid NOT NULL REFERENCES pulse.lab_bookings(id),
 report_id uuid NOT NULL UNIQUE REFERENCES pulse.reports(id),
 PRIMARY KEY(booking_id,report_id)
);
