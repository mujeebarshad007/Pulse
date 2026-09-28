"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDemo } from "./provider";
import {
  availableSlots,
  dateLabel,
  DEMO_DATES,
  DEMO_TIMES,
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

export function DoctorDashboard() {
  const { actor, state } = useDemo();
  const doctor = state.doctors.find((d) => d.id === actor?.id);
  const appointments = state.appointments.filter(
    (a) => a.doctorId === actor?.id,
  );
  const requested = appointments.filter((a) => a.status === "Requested");
  return (
    <Gate role="doctor">
      <PageTitle
        eyebrow="YOUR PRACTICE, IN FOCUS"
        title={
          doctor
            ? `Welcome back, ${doctor.name.replace("Dr. ", "").split(" ")[0]}.`
            : "A place for your practice."
        }
        description="Manage your fictional profile, availability, and physical appointments."
        action={
          <Link href="/doctor/availability" className="p-link-button">
            <Icon name="calendar" size={17} />
            Manage availability
          </Link>
        }
      />
      {!doctor ? (
        <Panel>
          <EmptyState
            icon="user"
            title="Introduce your demo practice"
            action={
              <Link className="p-link-button" href="/doctor/profile">
                Create doctor profile
              </Link>
            }
          >
            Create a fictional profile, add sample availability, then find it in
            the patient directory.
          </EmptyState>
        </Panel>
      ) : (
        <>
          <div className="p-stat-grid">
            {[
              {
                label: "Awaiting confirmation",
                value: requested.length,
                icon: "clock" as const,
              },
              {
                label: "Confirmed visits",
                value: appointments.filter((a) => a.status === "Confirmed")
                  .length,
                icon: "calendar" as const,
              },
              {
                label: "Available sample slots",
                value: availableSlots(state, doctor.id).length,
                icon: "grid" as const,
              },
            ].map((item) => (
              <Panel className="p-stat" key={item.label}>
                <span>
                  <Icon name={item.icon} />
                  {item.label}
                </span>
                <strong>{item.value}</strong>
                <small>From this demo session</small>
              </Panel>
            ))}
          </div>
          <div className="p-dashboard-bottom">
            <Panel>
              <SectionTitle
                title="Appointment requests"
                action={
                  <Link href="/doctor/appointments" className="p-text-link">
                    Manage all <Icon name="arrow" size={15} />
                  </Link>
                }
              />
              {requested.length ? (
                requested.map((a) => (
                  <Link
                    key={a.id}
                    className="p-report-row"
                    href="/doctor/appointments"
                  >
                    <Avatar
                      name={
                        state.patients.find((p) => p.id === a.patientId)
                          ?.name ?? "Patient"
                      }
                    />
                    <div>
                      <strong>
                        {state.patients.find((p) => p.id === a.patientId)?.name}
                      </strong>
                      <small>{a.id} · Physical appointment</small>
                    </div>
                    <Status>{a.status}</Status>
                  </Link>
                ))
              ) : (
                <EmptyState icon="calendar" title="You’re all caught up">
                  No pending demo requests. Try booking a visit from the patient
                  workspace.
                </EmptyState>
              )}
            </Panel>
            <Panel className="p-profile-panel">
              <Avatar name={doctor.name} color={doctor.color} large />
              <h2>{doctor.name}</h2>
              <p className="p-specialty">{doctor.specialty}</p>
              <p className="p-muted">
                {doctor.clinic} · {doctor.city}
              </p>
              <div className="p-form-actions">
                <Link
                  href="/doctor/profile"
                  className="p-link-button secondary"
                >
                  Edit profile
                </Link>
                <Link href={`/doctors/${doctor.id}`} className="p-text-link">
                  Preview public profile <Icon name="arrow" size={15} />
                </Link>
              </div>
            </Panel>
          </div>
        </>
      )}
    </Gate>
  );
}
export function DoctorProfile() {
  const { state, actor, run } = useDemo();
  const current = state.doctors.find((d) => d.id === actor?.id);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!actor) return;
    const f = new FormData(e.currentTarget);
    const doctor: Doctor = {
      id: actor.id,
      name: String(f.get("name")),
      specialty: String(f.get("specialty")),
      qualifications: String(f.get("qualifications")),
      experience: Number(f.get("experience")),
      clinic: String(f.get("clinic")),
      city: String(f.get("city")),
      fee: Number(f.get("fee")),
      about: String(f.get("about")),
      symptoms: f.getAll("symptoms").map(String),
      color: current?.color ?? "mint",
    };
    run({ type: "doctor", doctor });
  }
  return (
    <Gate role="doctor">
      <PageTitle
        eyebrow="YOUR PUBLIC PROFILE"
        title={
          current ? "A thoughtful introduction." : "Create your doctor profile."
        }
        description="These fictional details will appear in the patient’s doctor directory."
        action={
          current ? (
            <Link
              href={`/doctors/${current.id}`}
              className="p-link-button secondary"
            >
              Preview profile <Icon name="arrow" size={16} />
            </Link>
          ) : undefined
        }
      />
      <div className="p-settings-layout">
        <Panel>
          <h2>What patients will see</h2>
          <p className="p-prose">
            Your name, specialty, qualifications, experience, clinic, city,
            sample fee, and availability.
          </p>
          <FormNote>
            Fictional profiles only. Provider onboarding, verification, contact
            fields and publication permissions need a production policy.
          </FormNote>
        </Panel>
        <Panel>
          <form className="p-form" key={actor?.id} onSubmit={submit}>
            <div className="p-form-grid">
              <Field id="doctor-name" label="Fictional doctor name">
                <input
                  id="doctor-name"
                  name="name"
                  className="ui-input"
                  required
                  maxLength={80}
                  defaultValue={current?.name ?? "Dr. Taylor Demo"}
                />
              </Field>
              <Field id="doctor-specialty" label="Specialty">
                <select
                  className="ui-input"
                  id="doctor-specialty"
                  name="specialty"
                  defaultValue={current?.specialty ?? "General medicine"}
                >
                  <option>General medicine</option>
                  <option>Dermatology</option>
                  <option>Cardiology</option>
                </select>
              </Field>
            </div>
            <Field id="qualifications" label="Fictional qualifications">
              <input
                id="qualifications"
                name="qualifications"
                className="ui-input"
                required
                maxLength={120}
                defaultValue={current?.qualifications}
              />
            </Field>
            <div className="p-form-grid">
              <Field id="experience" label="Sample years of experience">
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min={0}
                  max={70}
                  step={1}
                  className="ui-input"
                  required
                  defaultValue={current?.experience ?? 0}
                />
              </Field>
              <Field id="fee" label="Sample consultation fee (PKR)">
                <input
                  id="fee"
                  name="fee"
                  type="number"
                  min={0}
                  max={100000}
                  step={1}
                  className="ui-input"
                  required
                  defaultValue={current?.fee ?? 0}
                />
              </Field>
              <Field id="clinic" label="Fictional clinic">
                <input
                  id="clinic"
                  name="clinic"
                  className="ui-input"
                  required
                  maxLength={100}
                  defaultValue={current?.clinic}
                />
              </Field>
              <Field id="doctor-city" label="City">
                <select
                  id="doctor-city"
                  name="city"
                  className="ui-input"
                  defaultValue={current?.city ?? "Karachi"}
                >
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                </select>
              </Field>
            </div>
            <Field id="about" label="About this fictional profile">
              <textarea
                id="about"
                name="about"
                rows={4}
                maxLength={1000}
                required
                className="ui-input"
                defaultValue={current?.about}
              />
            </Field>
            <fieldset className="p-checkbox-group">
              <legend>Demo symptom matching tags</legend>
              <p>
                Unreviewed tag mapping for interface testing; not a clinical
                recommendation.
              </p>
              {[
                "headache",
                "fatigue",
                "itchy skin",
                "rash",
                "palpitations",
              ].map((tag) => (
                <label className="p-check" key={tag}>
                  <input
                    type="checkbox"
                    name="symptoms"
                    value={tag}
                    defaultChecked={current?.symptoms.includes(tag)}
                  />
                  {tag}
                </label>
              ))}
            </fieldset>
            <div className="p-form-actions">
              <Button type="submit">
                {current ? "Save demo profile" : "Create demo profile"}
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </Gate>
  );
}
export function Availability() {
  const { state, actor, run } = useDemo();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const doctor = state.doctors.find((d) => d.id === actor?.id);
  const slots = state.slots.filter((s) => s.doctorId === actor?.id);
  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run({
      type: "slot-add",
      date: String(f.get("date")),
      time: String(f.get("time")),
    });
  }
  return (
    <Gate role="doctor">
      <PageTitle
        eyebrow="MAKE SPACE FOR CARE"
        title="Availability, made clear."
        description="Manage a sample week of 30-minute physical appointments. Times use Asia/Karachi."
      />
      {!doctor ? (
        <Panel>
          <EmptyState
            title="Start with your profile"
            action={
              <Link href="/doctor/profile" className="p-link-button">
                Create profile
              </Link>
            }
          >
            A doctor profile must exist before adding sample availability.
          </EmptyState>
        </Panel>
      ) : (
        <>
          <Panel>
            <form className="p-availability-form" onSubmit={add}>
              <Field id="slot-date" label="Sample date">
                <select id="slot-date" name="date" className="ui-input">
                  {DEMO_DATES.map((date) => (
                    <option key={date} value={date}>
                      {dateLabel(date)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="slot-time" label="Start time">
                <select id="slot-time" name="time" className="ui-input">
                  {DEMO_TIMES.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </Field>
              <Button type="submit">
                <Icon name="plus" size={17} />
                Add sample slot
              </Button>
            </form>
          </Panel>
          <div className="p-week-grid">
            {DEMO_DATES.map((date, i) => (
              <Panel key={date}>
                <header>
                  <span>
                    {
                      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][
                        i
                      ]
                    }
                  </span>
                  <h2>
                    {5 + i} <small>Oct</small>
                  </h2>
                </header>
                <div className="p-day-slots">
                  {slots
                    .filter((s) => s.date === date)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((slot) => {
                      const referenced = state.appointments.some(
                        (a) => a.slotId === slot.id,
                      );
                      const booked = state.appointments.some(
                        (a) => a.slotId === slot.id && a.status !== "Declined",
                      );
                      return (
                        <div
                          className={`p-schedule-slot ${booked ? "occupied" : ""}`}
                          key={slot.id}
                        >
                          <div>
                            <strong>{slot.time}</strong>
                            <small>
                              {booked
                                ? "Booked"
                                : referenced
                                  ? "Available · has history"
                                  : "Available"}
                            </small>
                          </div>
                          <button
                            className="p-icon-button"
                            disabled={referenced}
                            aria-label={`Remove ${date} ${slot.time}`}
                            title={
                              referenced
                                ? "Preserved because an appointment references this slot"
                                : "Remove slot"
                            }
                            onClick={() => setRemoveId(slot.id)}
                          >
                            <Icon
                              name={referenced ? "shield" : "close"}
                              size={15}
                            />
                          </button>
                        </div>
                      );
                    })}
                  {!slots.some((s) => s.date === date) && (
                    <p className="p-muted">No sample slots</p>
                  )}
                </div>
              </Panel>
            ))}
          </div>
          <FormNote>
            One appointment per slot in this prototype. Referenced slots are
            preserved to keep appointment history intact. The production
            schedule policy is not finalized.
          </FormNote>
        </>
      )}
      <Modal
        open={!!removeId}
        title="Remove this sample slot?"
        onClose={() => setRemoveId(null)}
      >
        <p>
          Patients will no longer see this time in the current demo. You can add
          it again using the form.
        </p>
        <div className="p-form-actions">
          <Button variant="secondary" onClick={() => setRemoveId(null)}>
            Keep slot
          </Button>
          <Button
            onClick={() => {
              if (removeId) run({ type: "slot-remove", id: removeId });
              setRemoveId(null);
            }}
          >
            Remove slot
          </Button>
        </div>
      </Modal>
    </Gate>
  );
}
