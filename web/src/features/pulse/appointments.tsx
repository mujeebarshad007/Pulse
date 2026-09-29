"use client";
import Link from "next/link";
import { useState } from "react";
import { useDemo } from "./provider";
import { dateLabel, type Appointment } from "./model";
import {
  Avatar,
  EmptyState,
  FormNote,
  Modal,
  PageTitle,
  Panel,
  Status,
} from "@/components/pulse/primitives";
import { Gate } from "@/components/pulse/shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function Appointments({ doctorMode = false }: { doctorMode?: boolean }) {
  const { state, actor, run } = useDemo();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    status: "Confirmed" | "Declined" | "Completed";
  } | null>(null);
  const items = state.appointments.filter((a) =>
    doctorMode ? a.doctorId === actor?.id : a.patientId === actor?.id,
  );
  const shown = items.filter((a) => filter === "All" || a.status === filter);
  const detail = items.find((a) => a.id === selected);
  function row(a: Appointment) {
    const doctor = state.doctors.find((d) => d.id === a.doctorId);
    const patient = state.patients.find((p) => p.id === a.patientId);
    const slot = state.slots.find((s) => s.id === a.slotId);
    return (
      <article className="p-appointment-row" key={a.id}>
        <div className="p-person-row">
          <Avatar
            name={
              doctorMode
                ? (patient?.name ?? "Patient")
                : (doctor?.name ?? "Doctor")
            }
            color={doctor?.color}
          />
          <div>
            <h3>{doctorMode ? patient?.name : doctor?.name}</h3>
            <p>{doctorMode ? a.id : doctor?.specialty}</p>
          </div>
        </div>
        <div className="p-appointment-date">
          <strong>{slot ? dateLabel(slot.date) : "Unavailable"}</strong>
          <span>{slot?.time} · Physical visit</span>
        </div>
        <Status>{a.status}</Status>
        <button className="p-text-link" onClick={() => setSelected(a.id)}>
          Details <Icon name="arrow" size={16} />
        </button>
      </article>
    );
  }
  return (
    <Gate role={doctorMode ? "doctor" : "patient"}>
      <PageTitle
        eyebrow={doctorMode ? "YOUR PRACTICE" : "YOUR VISITS"}
        title={
          doctorMode
            ? "Every appointment, in view."
            : "Your next steps in care."
        }
        description={
          doctorMode
            ? "Manage fictional requests and see the status reflected in the patient workspace."
            : "Follow your physical appointment requests from start to finish."
        }
        action={
          !doctorMode ? (
            <Link href="/doctors" className="p-link-button">
              <Icon name="plus" size={17} />
              Find a doctor
            </Link>
          ) : undefined
        }
      />
      <div
        className="p-filter-tabs"
        role="group"
        aria-label="Filter appointments"
      >
        {["All", "Requested", "Confirmed", "Completed", "Declined"].map(
          (status) => (
            <button
              aria-pressed={filter === status}
              key={status}
              onClick={() => setFilter(status)}
            >
              {status}
              <span>
                {status === "All"
                  ? items.length
                  : items.filter((a) => a.status === status).length}
              </span>
            </button>
          ),
        )}
      </div>
      <Panel className="p-list-panel">
        {shown.length ? (
          shown.map(row)
        ) : (
          <EmptyState
            icon="calendar"
            title={`No ${filter === "All" ? "" : filter.toLowerCase() + " "}appointments yet`}
            action={
              doctorMode ? (
                <Link href="/journey" className="p-text-link">
                  Create a request in the patient journey{" "}
                  <Icon name="arrow" size={16} />
                </Link>
              ) : (
                <Link href="/doctors" className="p-link-button">
                  Explore doctors
                </Link>
              )
            }
          >
            New requests will appear here. Change the filter to see other
            statuses.
          </EmptyState>
        )}
      </Panel>
      <FormNote>
        Prototype lifecycle: Requested → Confirmed or Declined; Confirmed →
        Completed. These transitions need approval before production.
      </FormNote>
      <Modal
        open={!!detail}
        title="Appointment details"
        onClose={() => setSelected(null)}
      >
        {detail && (
          <>
            <dl className="p-detail-list">
              <div>
                <dt>Reference</dt>
                <dd>{detail.id}</dd>
              </div>
              <div>
                <dt>Doctor</dt>
                <dd>
                  {state.doctors.find((d) => d.id === detail.doctorId)?.name}
                </dd>
              </div>
              <div>
                <dt>Patient</dt>
                <dd>
                  {state.patients.find((p) => p.id === detail.patientId)?.name}
                </dd>
              </div>
              <div>
                <dt>Sample slot</dt>
                <dd>
                  {(() => {
                    const s = state.slots.find((s) => s.id === detail.slotId);
                    return s
                      ? `${dateLabel(s.date)} · ${s.time} · Asia/Karachi`
                      : "Unavailable";
                  })()}
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <Status>{detail.status}</Status>
                </dd>
              </div>
            </dl>
            {doctorMode && (
              <div className="p-form-actions">
                {detail.status === "Requested" && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelected(null);
                        setPendingAction({ id: detail.id, status: "Declined" });
                      }}
                    >
                      Decline request
                    </Button>
                    <Button
                      onClick={() => {
                        setSelected(null);
                        setPendingAction({
                          id: detail.id,
                          status: "Confirmed",
                        });
                      }}
                    >
                      Confirm appointment
                    </Button>
                  </>
                )}
                {detail.status === "Confirmed" && (
                  <Button
                    onClick={() => {
                      setSelected(null);
                      setPendingAction({ id: detail.id, status: "Completed" });
                    }}
                  >
                    Mark completed
                  </Button>
                )}
              </div>
            )}
            <FormNote>
              No real provider is notified. These are changes to fictional
              records.
            </FormNote>
          </>
        )}
      </Modal>
      <Modal
        open={!!pendingAction}
        title="Update this demo appointment?"
        onClose={() => setPendingAction(null)}
      >
        <p>
          The appointment will become{" "}
          <strong>{pendingAction?.status.toLowerCase()}</strong> in both the
          doctor and patient demo workspaces.
        </p>
        <div className="p-form-actions">
          <Button variant="secondary" onClick={() => setPendingAction(null)}>
            Go back
          </Button>
          <Button
            onClick={async () => {
              if (
                pendingAction &&
                (await run({ type: "appointment", ...pendingAction }))
              )
                setPendingAction(null);
            }}
          >
            Apply demo status
          </Button>
        </div>
      </Modal>
    </Gate>
  );
}
