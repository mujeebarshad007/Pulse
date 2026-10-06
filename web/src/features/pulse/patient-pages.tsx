"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDemo } from "./provider";
import {
  availableSlots,
  dateLabel,
  findDoctors,
  ownReports,
  DEMO_DATES,
  type Doctor,
} from "./model";
import {
  Avatar,
  EmptyState,
  FormNote,
  Modal,
  PageTitle,
  Panel,
  SectionTitle,
  Status,
} from "@/components/pulse/primitives";
import { Gate } from "@/components/pulse/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { state } = useDemo();
  const count = availableSlots(state, doctor.id).length;
  return (
    <article className="p-doctor-card">
      <div className="p-doctor-card-top">
        <Avatar name={doctor.name} color={doctor.color} />
        <span className="p-subtle-chip">Fictional profile</span>
      </div>
      <h3>{doctor.name}</h3>
      <p className="p-specialty">{doctor.specialty}</p>
      <p className="p-muted">{doctor.experience} years of experience</p>
      <p className="p-icon-line">
        <Icon name="pin" size={15} />
        {doctor.clinic} · {doctor.city}
      </p>
      <div className="p-doctor-meta">
        <span>
          PKR {doctor.fee.toLocaleString("en-US")}
          <small>Sample consultation fee</small>
        </span>
        <span className={count ? "p-availability" : "p-muted"}>
          {count ? "Sample slots available" : "No availability"}
        </span>
      </div>
      <Link href={`/doctors/${doctor.id}`} className="p-card-link">
        View profile & availability <Icon name="arrow" size={17} />
      </Link>
    </article>
  );
}
export function PatientDashboard() {
  const { state, actor } = useDemo();
  const patient = state.patients.find((p) => p.id === actor?.id);
  const appointments = state.appointments.filter(
    (a) =>
      a.patientId === actor?.id &&
      ["Confirmed", "Requested"].includes(a.status),
  );
  const next = appointments[0];
  const doctor = state.doctors.find((d) => d.id === next?.doctorId);
  const slot = state.slots.find((s) => s.id === next?.slotId);
  const reports = ownReports(state, actor);
  return (
    <Gate role="patient">
      <PageTitle
        eyebrow="YOUR HEALTH, WITHIN REACH"
        title={`A little clarity, ${patient?.name.split(" ")[0] ?? "Jamie"}.`}
        description="Your care, organized. Take the next step at your own pace."
        action={
          <Link href="/doctors" className="p-link-button">
            <Icon name="search" size={17} />
            Find a doctor
          </Link>
        }
      />
      <div className="p-dashboard-top">
        <section className="p-care-banner">
          <span className="p-eyebrow">A CLEARER PATH TO CARE</span>
          <h2>
            Good care starts with
            <br />
            the right connection.
          </h2>
          <p>Explore doctors and plan your next physical visit.</p>
          <Link href="/doctors" className="p-link-button secondary">
            Explore doctors <Icon name="arrow" size={17} />
          </Link>
          <div className="p-care-art" aria-hidden="true">
            <span />
            <div>
              <Icon name="cross" size={68} />
            </div>
            <i>
              <Icon name="heart" size={24} />
            </i>
          </div>
        </section>
        <Panel className="p-next-visit">
          <SectionTitle
            title="Your next appointment"
            action={next ? <Status>{next.status}</Status> : undefined}
          />
          {next && doctor && slot ? (
            <>
              <div className="p-person-row">
                <Avatar name={doctor.name} color={doctor.color} />
                <div>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty} · Physical visit</p>
                </div>
              </div>
              <div className="p-visit-time">
                <span>
                  <Icon name="calendar" size={17} />
                  {dateLabel(slot.date)}
                </span>
                <span>
                  <Icon name="clock" size={17} />
                  {slot.time}
                </span>
              </div>
              <Link className="p-text-link" href="/patient/appointments">
                View appointment <Icon name="arrow" size={16} />
              </Link>
            </>
          ) : (
            <EmptyState
              icon="calendar"
              title="A fresh start"
              action={
                <Link href="/doctors" className="p-text-link">
                  Explore availability <Icon name="arrow" size={16} />
                </Link>
              }
            >
              Your next appointment will appear here.
            </EmptyState>
          )}
        </Panel>
      </div>
      <section className="p-section">
        <SectionTitle
          title="Explore your care options"
          action={
            <Link className="p-text-link" href="/doctors">
              All doctors <Icon name="arrow" size={16} />
            </Link>
          }
        />
        <div className="p-doctor-grid">
          {state.doctors.slice(0, 3).map((d) => (
            <DoctorCard doctor={d} key={d.id} />
          ))}
        </div>
      </section>
      <div className="p-dashboard-bottom">
        <Panel>
          <SectionTitle
            title="Recent lab reports"
            action={
              <Link className="p-text-link" href="/patient/reports">
                View all <Icon name="arrow" size={16} />
              </Link>
            }
          />
          {reports.length ? (
            reports.slice(0, 2).map((r) => (
              <Link className="p-report-row" key={r.id} href="/patient/reports">
                <span className="p-report-icon">
                  <Icon name="file" />
                </span>
                <div>
                  <strong>{r.title}</strong>
                  <small>
                    {dateLabel(r.date)} · {r.laboratory}
                  </small>
                </div>
                <Icon name="chevron" size={17} />
              </Link>
            ))
          ) : (
            <p className="p-muted p-spaced">
              No demo reports yet. Try the laboratory journey.
            </p>
          )}
        </Panel>
        <Panel className="p-library-promo">
          <span className="p-feature-icon">
            <Icon name="book" size={24} />
          </span>
          <div>
            <span className="p-eyebrow">UNDERSTANDING STARTS HERE</span>
            <h2>
              A little knowledge.
              <br />A clearer perspective.
            </h2>
            <Link href="/library" className="p-text-link">
              Explore the health library <Icon name="arrow" size={16} />
            </Link>
          </div>
        </Panel>
      </div>
      <Link className="p-compass-banner" href="/journey">
        <Icon name="sparkle" />
        <div>
          <strong>Follow a complete care journey</strong>
          <span>
            See a patient request become a doctor-managed appointment.
          </span>
        </div>
        <Icon name="arrow" />
      </Link>
    </Gate>
  );
}
export function Directory({
  initialFilters = {},
}: {
  initialFilters?: { query?: string; city?: string; specialty?: string };
}) {
  const { state } = useDemo();
  const [filters, setFilters] = useState({
    query: initialFilters.query ?? "",
    specialty: initialFilters.specialty ?? "",
    city: initialFilters.city ?? "",
    symptom: "",
  });
  const [sort, setSort] = useState("name");
  const [minFee, setMinFee] = useState(""),
    [maxFee, setMaxFee] = useState(""),
    [availableOnly, setAvailableOnly] = useState(false);
  const invalidFee =
    (minFee !== "" &&
      (!Number.isFinite(Number(minFee)) || Number(minFee) < 0)) ||
    (maxFee !== "" &&
      (!Number.isFinite(Number(maxFee)) || Number(maxFee) < 0)) ||
    (minFee !== "" && maxFee !== "" && Number(minFee) > Number(maxFee));
  const results = (
    invalidFee
      ? []
      : findDoctors(state.doctors, {
          ...filters,
          minFee: minFee === "" ? undefined : Number(minFee),
          maxFee: maxFee === "" ? undefined : Number(maxFee),
        })
  )
    .filter((d) => !availableOnly || availableSlots(state, d.id).length > 0)
    .sort((a, b) =>
      sort === "fee"
        ? a.fee - b.fee
        : sort === "experience"
          ? b.experience - a.experience
          : a.name.localeCompare(b.name),
    );
  function update(key: keyof typeof filters, value: string) {
    setFilters({ ...filters, [key]: value });
  }
  return (
    <>
      <PageTitle
        eyebrow="FIND YOUR STARTING POINT"
        title="Care begins with a connection."
        description="Explore fictional doctors by specialty, location, and demonstration symptom tags."
      />
      <Panel className="p-search-panel">
        <div className="p-search-line">
          <Icon name="search" />
          <label className="sr-only" htmlFor="doctor-search">
            Search doctors
          </label>
          <input
            id="doctor-search"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="Doctor name, specialty, or clinic"
          />
          <span>{state.doctors.length} sample profiles</span>
        </div>
        <div className="p-filter-grid">
          <Field id="specialty" label="Specialty">
            <select
              id="specialty"
              className="ui-input"
              value={filters.specialty}
              onChange={(e) => update("specialty", e.target.value)}
            >
              <option value="">All specialties</option>
              {[...new Set(state.doctors.map((d) => d.specialty))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field id="location" label="Location">
            <select
              id="location"
              className="ui-input"
              value={filters.city}
              onChange={(e) => update("city", e.target.value)}
            >
              <option value="">All demo cities</option>
              {[...new Set(state.doctors.map((d) => d.city))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field id="symptom" label="Symptom tag · demo matching">
            <select
              id="symptom"
              className="ui-input"
              value={filters.symptom}
              onChange={(e) => update("symptom", e.target.value)}
            >
              <option value="">Any tag</option>
              {[...new Set(state.doctors.flatMap((d) => d.symptoms))].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
          </Field>
        </div>
        <div className="p-filter-grid">
          <Field id="min-fee" label="Minimum fee (PKR)">
            <input
              id="min-fee"
              className="ui-input"
              type="number"
              min={0}
              value={minFee}
              onChange={(e) => setMinFee(e.target.value)}
              aria-invalid={invalidFee}
            />
          </Field>
          <Field id="max-fee" label="Maximum fee (PKR)">
            <input
              id="max-fee"
              className="ui-input"
              type="number"
              min={0}
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              aria-invalid={invalidFee}
            />
          </Field>
          <label className="p-chat-consent">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />{" "}
            Only doctors with available slots
          </label>
        </div>
        {invalidFee && (
          <p role="alert">
            Enter non-negative fees with the minimum no greater than the
            maximum.
          </p>
        )}
        <p className="p-caption">
          Symptom tags demonstrate filtering, not diagnosis, triage, or a
          clinical recommendation. Final matching rules are not approved.
        </p>
      </Panel>
      <div className="p-results-heading" aria-live="polite">
        <p>
          <strong>{results.length}</strong>{" "}
          {results.length === 1 ? "doctor" : "doctors"} found
        </p>
        <div>
          <Button
            variant="quiet"
            onClick={() => {
              setFilters({ query: "", specialty: "", city: "", symptom: "" });
              setMinFee("");
              setMaxFee("");
              setAvailableOnly(false);
            }}
          >
            Clear filters
          </Button>
          <label className="sr-only" htmlFor="sort">
            Sort doctors
          </label>
          <select
            id="sort"
            className="ui-input p-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Name A–Z</option>
            <option value="fee">Sample fee: low to high</option>
            <option value="experience">Most experience</option>
          </select>
        </div>
      </div>
      {results.length ? (
        <div className="p-doctor-grid">
          {results.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      ) : (
        <Panel>
          <EmptyState
            title="No profiles match these filters"
            action={
              <Button
                variant="secondary"
                onClick={() =>
                  setFilters({
                    query: "",
                    specialty: "",
                    city: "",
                    symptom: "",
                  })
                }
              >
                Reset filters
              </Button>
            }
          >
            Try another specialty or remove a filter. Search results never imply
            a diagnosis.
          </EmptyState>
        </Panel>
      )}
    </>
  );
}
export function DoctorDetail({ id }: { id: string }) {
  const { state, actor, run, connected } = useDemo();
  const [pickedDay, setDay] = useState("");
  const [selected, setSelected] = useState("");
  const [review, setReview] = useState(false);
  const [booked, setBooked] = useState(false);
  const doctor = state.doctors.find((d) => d.id === id);
  const slots = availableSlots(state, id);
  const dates = connected
    ? [...new Set(slots.map((s) => s.date))].sort()
    : DEMO_DATES;
  const day = dates.includes(pickedDay) ? pickedDay : dates[0];
  const chosen = slots.find((s) => s.id === selected);
  if (!doctor)
    return (
      <EmptyState
        title="Doctor profile not found"
        action={
          <Link className="p-link-button" href="/doctors">
            Back to doctors
          </Link>
        }
      >
        The profile is not available. Return to the directory to choose another
        provider.
      </EmptyState>
    );
  async function book() {
    if (await run({ type: "book", doctorId: id, slotId: selected })) {
      setReview(false);
      setSelected("");
      setBooked(true);
    } else setReview(false);
  }
  return (
    <>
      <Link className="p-back-link" href="/doctors">
        ← Back to doctors
      </Link>
      <PageTitle
        eyebrow="FICTIONAL DOCTOR PROFILE"
        title={doctor.name}
        description={`${doctor.specialty} · ${doctor.clinic}, ${doctor.city}`}
      />
      <div className="p-detail-layout">
        <div>
          <Panel className="p-profile-panel">
            <div className="p-profile-summary">
              <Avatar name={doctor.name} color={doctor.color} large />
              <div>
                <span className="p-specialty">{doctor.specialty}</span>
                <h2>{doctor.name}</h2>
                <p>{doctor.qualifications}</p>
              </div>
            </div>
            <div className="p-profile-facts">
              <div>
                <strong>{doctor.experience} years</strong>
                <span>Sample experience</span>
              </div>
              <div>
                <strong>PKR {doctor.fee.toLocaleString("en-US")}</strong>
                <span>Sample visit fee</span>
              </div>
              <div>
                <strong>In person</strong>
                <span>Physical appointments</span>
              </div>
            </div>
            <h3>About this doctor</h3>
            <p className="p-prose">{doctor.about}</p>
            <h3>Visit information</h3>
            <p className="p-icon-line">
              <Icon name="pin" />
              {doctor.clinic}, {doctor.city}
            </p>
            <p className="p-prose">
              Contact: clinic@example.test · Fictional clinic contact
            </p>
            <FormNote>
              All providers, qualifications, fees and schedules are fictional.
              No payment or real appointment is created.
            </FormNote>
          </Panel>
          <Panel className="p-profile-note">
            <Icon name="shield" />
            <div>
              <h3>A clear next step</h3>
              <p>
                Choose a sample slot and review the details. In this prototype,
                a request waits for the doctor’s confirmation.
              </p>
            </div>
          </Panel>
        </div>
        <Panel className="p-booking-panel">
          <span className="p-eyebrow">PLAN A PHYSICAL VISIT</span>
          <h2>Find a time that fits.</h2>
          <p className="p-muted">
            Sample week · 5–9 October 2026
            <br />
            All times: Asia/Karachi · 30-minute slots
          </p>
          {booked ? (
            <div className="p-booking-success" role="status">
              <Icon name="check" size={32} />
              <h3>Your demo request is in.</h3>
              <p>
                {connected
                  ? "Your request is saved. The assigned doctor tester can confirm it from their account."
                  : "Track its status in appointments, then switch to the doctor demo to confirm it."}
              </p>
              <Link className="p-link-button" href="/patient/appointments">
                View my appointments <Icon name="arrow" size={15} />
              </Link>
              <Button variant="quiet" onClick={() => setBooked(false)}>
                Explore another time
              </Button>
            </div>
          ) : (
            <>
              <fieldset className="p-date-picker">
                <legend>Choose a date</legend>
                {dates.map((date) => (
                  <label key={date} className={day === date ? "selected" : ""}>
                    <input
                      type="radio"
                      name="day"
                      value={date}
                      checked={day === date}
                      onChange={() => {
                        setDay(date);
                        setSelected("");
                      }}
                    />
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        weekday: "short",
                        timeZone: "UTC",
                      }).format(new Date(`${date}T12:00:00Z`))}
                    </span>
                    <strong>{Number(date.slice(-2))}</strong>
                  </label>
                ))}
              </fieldset>
              <fieldset className="p-slot-picker">
                <legend>Available sample times</legend>
                {slots.filter((s) => s.date === day).length ? (
                  slots
                    .filter((s) => s.date === day)
                    .map((s) => (
                      <label
                        key={s.id}
                        className={selected === s.id ? "selected" : ""}
                      >
                        <input
                          type="radio"
                          name="slot"
                          checked={selected === s.id}
                          value={s.id}
                          onChange={() => setSelected(s.id)}
                        />
                        {s.time}
                      </label>
                    ))
                ) : (
                  <p className="p-muted">
                    No slots for this day. Try another date.
                  </p>
                )}
              </fieldset>
              {actor?.role === "patient" ? (
                <Button disabled={!chosen} onClick={() => setReview(true)}>
                  Review demo request <Icon name="arrow" size={16} />
                </Button>
              ) : (
                <Link className="p-link-button" href="/login">
                  {connected
                    ? "Sign in to request a test visit"
                    : "Enter patient demo to request"}
                </Link>
              )}
              <p className="p-caption">
                {connected
                  ? "Requests are saved and wait for the assigned doctor tester’s confirmation."
                  : "Requesting a slot here changes only this browser session."}
              </p>
            </>
          )}
        </Panel>
      </div>
      <Modal
        open={review}
        title="Review your demo request"
        onClose={() => setReview(false)}
      >
        <dl className="p-detail-list">
          <div>
            <dt>Doctor</dt>
            <dd>{doctor.name}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              {doctor.clinic}, {doctor.city}
            </dd>
          </div>
          <div>
            <dt>Date & time</dt>
            <dd>
              {chosen
                ? `${dateLabel(chosen.date)} · ${chosen.time}`
                : "Select an available slot"}
            </dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>Physical visit · Asia/Karachi</dd>
          </div>
          <div>
            <dt>Sample fee</dt>
            <dd>PKR {doctor.fee.toLocaleString("en-US")} · No payment</dd>
          </div>
        </dl>
        <FormNote>
          This is a fictional test request. The doctor can confirm or decline
          it.
        </FormNote>
        <div className="p-form-actions">
          <Button variant="secondary" onClick={() => setReview(false)}>
            Change time
          </Button>
          <Button disabled={!chosen} onClick={book}>
            Request demo appointment
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function PatientProfile() {
  const { actor, state, run, connected } = useDemo();
  const patient = state.patients.find((p) => p.id === actor?.id);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!patient) return;
    const data = new FormData(e.currentTarget);
    run({
      type: "profile",
      patient: {
        id: patient.id,
        name: String(data.get("name")),
        email: String(data.get("email")),
        city: String(data.get("city")),
        phone: String(data.get("phone")),
      },
    });
  }
  return (
    <Gate role="patient">
      <PageTitle
        eyebrow="YOUR DETAILS"
        title="A profile that feels like you."
        description="Keep your fictional patient information consistent across this demo."
      />
      <div className="p-settings-layout">
        <Panel>
          <h2>Personal information</h2>
          <p className="p-muted">
            {connected
              ? "Your test profile is saved to your account. Your sign-in email comes from Google."
              : "This demo profile resets on refresh."}
          </p>
          <FormNote>
            Use fictional details only. Real patient-data requirements are still
            being defined.
          </FormNote>
          {connected && (
            <p className="p-form-note">
              Patient reference:{" "}
              <strong style={{ overflowWrap: "anywhere" }}>
                {patient?.id}
              </strong>
              . Share this with your laboratory tester to receive a fictional
              PDF.
            </p>
          )}
        </Panel>
        <Panel>
          <form className="p-form" onSubmit={submit} key={patient?.id}>
            <Field id="profile-name" label="Fictional full name">
              <input
                className="ui-input"
                id="profile-name"
                name="name"
                defaultValue={patient?.name}
                required
                minLength={2}
                maxLength={80}
              />
            </Field>
            <Field
              id="profile-email"
              label={connected ? "Google account email" : "Fictional email"}
            >
              <input
                className="ui-input"
                id="profile-email"
                name="email"
                type="email"
                defaultValue={patient?.email}
                readOnly={connected}
                required
                maxLength={120}
              />
            </Field>
            <div className="p-form-grid">
              <Field id="profile-city" label="City">
                <input
                  className="ui-input"
                  id="profile-city"
                  name="city"
                  defaultValue={patient?.city}
                  required
                  maxLength={60}
                />
              </Field>
              <Field id="profile-phone" label="Fictional phone (optional)">
                <input
                  className="ui-input"
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  defaultValue={patient?.phone}
                  maxLength={30}
                />
              </Field>
            </div>
            <div className="p-form-actions">
              <Button type="submit">Save demo profile</Button>
            </div>
          </form>
        </Panel>
      </div>
    </Gate>
  );
}
