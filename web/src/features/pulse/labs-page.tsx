"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useDemo } from "./provider";
import {
  PageTitle,
  Panel,
  Modal,
  InputError,
} from "@/components/pulse/primitives";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  emptyLabs,
  filterLabTests,
  labDate,
  type LabData,
  type LabOffering,
  type LabSlot,
} from "./labs-model";

export function LabsPage() {
  const { actor, connected, state } = useDemo();
  const owner = actor?.accountId ?? actor?.id ?? "guest";
  const [loaded, setLoaded] = useState({ owner: "", data: emptyLabs }),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    lab: "",
    city: "",
  });
  const [editing, setEditing] = useState<LabOffering | null>(null);
  const [review, setReview] = useState<{
    test: LabOffering;
    slot: LabSlot;
    key: string;
  } | null>(null);
  const data = loaded.owner === owner ? loaded.data : emptyLabs;
  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const r = await fetch("/api/labs", {
          cache: "no-store",
          signal: signal ?? AbortSignal.timeout(15000),
        });
        const payload = await r.json();
        if (!r.ok) throw new Error(payload.error);
        setLoaded({ owner, data: payload as LabData });
        setError("");
      } catch (e) {
        if (!signal?.aborted) {
          setLoaded({ owner, data: emptyLabs });
          setError(
            e instanceof Error
              ? e.message
              : "The laboratory service could not load.",
          );
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [owner],
  );
  useEffect(() => {
    const controller = new AbortController();
    const first = setTimeout(() => void refresh(controller.signal), 0);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        void refresh(controller.signal);
    }, 15000);
    return () => {
      controller.abort();
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);
  async function command(body: unknown) {
    if (busy) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      const payload = await r.json();
      if (!r.ok) throw new Error(payload.error);
      await refresh();
      setNotice(payload.message);
      return true;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Request failed. Refresh and retry.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function saveOffering(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const ok = await command({
      type: "offering",
      ...(editing ? { id: editing.id } : {}),
      name: f.get("name"),
      category: f.get("category"),
      labName: f.get("labName"),
      city: f.get("city"),
      address: f.get("address"),
      preparation: f.get("preparation"),
      fee: Number(f.get("fee")),
      published: f.has("published"),
      active: f.has("active"),
    });
    if (ok) setEditing(null);
  }
  const results = filterLabTests(data.offerings, filters);
  return (
    <>
      <PageTitle
        eyebrow="LABORATORY VISITS"
        title="A clearer path to your lab."
        description="Explore published test offerings and request an in-lab visit. The laboratory confirms each request. No online payment or home collection."
        action={
          <Button onClick={() => void refresh()} disabled={busy}>
            Refresh labs
          </Button>
        }
      />
      <p className="p-form-note">
        Fictional testing environment. This catalog does not recommend tests or
        provide medical advice. Discuss appropriate testing with a qualified
        clinician.
      </p>
      <InputError>{error}</InputError>
      {notice && <p role="status">{notice}</p>}
      {!connected && (
        <Panel>
          <p>
            Lab booking requires connected mode and a real server session. Demo
            personas cannot create lab records.
          </p>
        </Panel>
      )}
      <Panel>
        <h2>Find a lab test</h2>
        <div className="p-filter-grid">
          {(
            [
              ["name", "Test name"],
              ["category", "Category"],
              ["lab", "Laboratory name"],
              ["city", "City"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} id={`lab-${key}`} label={label}>
              <input
                id={`lab-${key}`}
                className="ui-input"
                value={filters[key]}
                maxLength={100}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
              />
            </Field>
          ))}
        </div>
        <Button
          variant="quiet"
          onClick={() =>
            setFilters({ name: "", category: "", lab: "", city: "" })
          }
        >
          Clear lab filters
        </Button>
      </Panel>
      <p role="status">
        {loading ? "Loading lab tests…" : `${results.length} lab tests found`}
      </p>
      {!loading && !results.length && (
        <Panel>
          <h2>No lab tests found matching your criteria.</h2>
          <p>
            Clear the filters to browse published tests. If the catalog is
            empty, an owner-assigned laboratory account must publish its
            offerings and availability first. We do not invent partner
            availability or recommend alternative tests.
          </p>
        </Panel>
      )}
      <div className="p-feature-grid">
        {results.map((test) => {
          const slots = data.slots.filter((s) => s.testId === test.id);
          return (
            <Panel key={test.id}>
              <span className="p-eyebrow">{test.category}</span>
              <h2>{test.name}</h2>
              <p>
                {test.labName} · {test.city}
              </p>
              <strong>PKR {test.fee.toLocaleString("en-US")}</strong>
              <details>
                <summary>View test details and availability</summary>
                <p>{test.address}</p>
                <h3>Laboratory preparation information</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{test.preparation}</p>
                <p>
                  Confirm preparation instructions with the laboratory. Pulse
                  does not generate or endorse clinical instructions.
                </p>
                {!test.active || !slots.length ? (
                  <p role="status">Currently unavailable — no bookable slot.</p>
                ) : (
                  <form
                    className="p-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const id = String(
                        new FormData(event.currentTarget).get("slot"),
                      );
                      const slot = slots.find((s) => s.id === id);
                      if (slot)
                        setReview({ test, slot, key: crypto.randomUUID() });
                    }}
                  >
                    <label htmlFor={`slot-${test.id}`}>
                      Choose a time (Pakistan time)
                    </label>
                    <select
                      id={`slot-${test.id}`}
                      name="slot"
                      className="ui-input"
                    >
                      {slots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {labDate(s.start)}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="submit"
                      disabled={busy || !connected || actor?.role !== "patient"}
                    >
                      Review visit request
                    </Button>
                  </form>
                )}
                {!actor && (
                  <Link className="p-text-link" href="/login">
                    Sign in to request a visit →
                  </Link>
                )}
                <p>
                  <Link href="/patient/reports">View my past reports →</Link>
                </p>
              </details>
            </Panel>
          );
        })}
      </div>
      {actor && ["patient", "lab"].includes(actor.role) && (
        <section className="p-section">
          <h2>
            {actor.role === "lab"
              ? "Your laboratory bookings"
              : "My lab visits"}
          </h2>
          {!data.bookings.length && (
            <Panel>
              <p>No lab bookings yet.</p>
            </Panel>
          )}
          {data.bookings.map((b) => (
            <Panel key={b.id}>
              <h3>
                {b.name} · {b.status}
              </h3>
              <p>
                {b.labName} · {labDate(b.start)}
              </p>
              <p>
                {b.address} · Saved price: PKR {b.price.toLocaleString("en-US")}
              </p>
              {actor.role === "lab" && (
                <p>
                  Patient: {b.patientName} · Reference: {b.patientId}
                </p>
              )}
              {b.reason && <p>Reason: {b.reason}</p>}
              <div className="p-form-actions">
                {actor.role === "lab" &&
                  b.status === "Requested" &&
                  new Date(b.start) > new Date() && (
                    <>
                      <Button
                        disabled={busy}
                        onClick={() =>
                          void command({
                            type: "transition",
                            id: b.id,
                            status: "Confirmed",
                          })
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={busy}
                        onClick={() =>
                          void command({
                            type: "transition",
                            id: b.id,
                            status: "Declined",
                          })
                        }
                      >
                        Decline
                      </Button>
                    </>
                  )}
                {actor.role === "lab" &&
                  b.status === "Confirmed" &&
                  new Date(b.start) <= new Date() && (
                    <Button
                      disabled={busy}
                      onClick={() =>
                        void command({
                          type: "transition",
                          id: b.id,
                          status: "Completed",
                        })
                      }
                    >
                      Mark completed
                    </Button>
                  )}
                {["Requested", "Confirmed"].includes(b.status) &&
                  new Date(b.start) > new Date() && (
                    <form
                      className="p-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void command({
                          type: "transition",
                          id: b.id,
                          status: "Cancelled",
                          reason: String(
                            new FormData(e.currentTarget).get("reason") ?? "",
                          ),
                        });
                      }}
                    >
                      <label htmlFor={`reason-${b.id}`}>
                        Cancellation reason{" "}
                        {actor.role === "lab" ? "(required)" : "(optional)"}
                      </label>
                      <input
                        id={`reason-${b.id}`}
                        name="reason"
                        className="ui-input"
                        required={actor.role === "lab"}
                        maxLength={300}
                      />
                      <Button type="submit" variant="secondary" disabled={busy}>
                        Cancel this visit
                      </Button>
                    </form>
                  )}
              </div>
              {b.reports.length ? (
                <ul>
                  {b.reports.map((r) => (
                    <li key={r.id}>
                      <a href={`/api/reports/${r.id}`}>Download {r.title}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No report linked. A completed visit does not mean a report is
                  ready.
                </p>
              )}
              {actor.role === "lab" &&
                ["Confirmed", "Completed"].includes(b.status) && (
                  <form
                    className="p-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void command({
                        type: "linkReport",
                        id: b.id,
                        reportId: String(
                          new FormData(e.currentTarget).get("reportId"),
                        ),
                      });
                    }}
                  >
                    <label htmlFor={`report-${b.id}`}>
                      Link an uploaded report for this patient
                    </label>
                    <select
                      className="ui-input"
                      id={`report-${b.id}`}
                      name="reportId"
                      required
                    >
                      <option value="">Select a report</option>
                      {state.reports
                        .filter((r) => r.patientId === b.patientId)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                    </select>
                    <Button type="submit" disabled={busy}>
                      Link private report
                    </Button>
                    <Link href="/laboratory/upload">
                      Upload a report first →
                    </Link>
                  </form>
                )}
            </Panel>
          ))}
        </section>
      )}
      {actor?.role === "lab" && connected && (
        <section className="p-section">
          <h2>Manage your laboratory catalog</h2>
          <Panel>
            <label htmlFor="edit-test">Edit an offering</label>
            <select
              id="edit-test"
              className="ui-input"
              value={editing?.id ?? ""}
              onChange={(e) =>
                setEditing(
                  data.offerings.find(
                    (t) => t.id === e.target.value && t.owned,
                  ) ?? null,
                )
              }
            >
              <option value="">Create a new test</option>
              {data.offerings
                .filter((t) => t.owned)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                    {t.published ? "" : " (draft)"}
                  </option>
                ))}
            </select>
            <form
              key={editing?.id ?? "new"}
              className="p-form"
              onSubmit={saveOffering}
            >
              {(
                [
                  ["name", "Test name", 100],
                  ["category", "Category", 60],
                  ["labName", "Laboratory name", 100],
                  ["city", "City", 80],
                  ["address", "Visit address", 200],
                ] as const
              ).map(([key, label, max]) => (
                <Field key={key} id={`offer-${key}`} label={label}>
                  <input
                    className="ui-input"
                    id={`offer-${key}`}
                    name={key}
                    defaultValue={editing?.[key] ?? ""}
                    required
                    maxLength={max}
                  />
                </Field>
              ))}
              <Field id="offer-fee" label="Price (PKR)">
                <input
                  id="offer-fee"
                  name="fee"
                  type="number"
                  min={0}
                  max={1000000}
                  step={1}
                  className="ui-input"
                  required
                  defaultValue={editing?.fee ?? 0}
                />
              </Field>
              <Field
                id="offer-prep"
                label="Preparation instructions supplied by your lab"
              >
                <textarea
                  id="offer-prep"
                  name="preparation"
                  className="ui-input"
                  maxLength={1500}
                  required
                  defaultValue={
                    editing?.preparation ??
                    "Fictional offering. Contact the laboratory for preparation instructions; do not change food or medicines based on this test data."
                  }
                />
              </Field>
              <label>
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={editing?.published ?? false}
                />{" "}
                Publish in directory
              </label>
              <label>
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={editing?.active ?? true}
                />{" "}
                Available for new requests
              </label>
              <Button type="submit" disabled={busy}>
                Save offering
              </Button>
            </form>
          </Panel>
          <Panel>
            <h3>Add a test slot</h3>
            <form
              className="p-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void command({
                  type: "slot",
                  testId: f.get("testId"),
                  start: `${f.get("start")}:00+05:00`,
                  end: `${f.get("end")}:00+05:00`,
                });
              }}
            >
              <label htmlFor="new-test-slot">Your offering</label>
              <select
                id="new-test-slot"
                name="testId"
                className="ui-input"
                required
              >
                <option value="">Choose test</option>
                {data.offerings
                  .filter((t) => t.owned)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
              <Field id="lab-start" label="Start (Pakistan time)">
                <input
                  id="lab-start"
                  type="datetime-local"
                  name="start"
                  className="ui-input"
                  required
                />
              </Field>
              <Field id="lab-end" label="End (Pakistan time)">
                <input
                  id="lab-end"
                  type="datetime-local"
                  name="end"
                  className="ui-input"
                  required
                />
              </Field>
              <Button type="submit" disabled={busy}>
                Add availability
              </Button>
            </form>
          </Panel>
        </section>
      )}
      <Modal
        open={!!review}
        title="Review your lab request"
        onClose={() => {
          if (!busy) setReview(null);
        }}
      >
        {review && (
          <>
            <h3>{review.test.name}</h3>
            <p>
              {review.test.labName} · {review.test.address}
            </p>
            <p>
              {labDate(review.slot.start)} · PKR{" "}
              {review.test.fee.toLocaleString("en-US")}
            </p>
            <p>
              This is a request, not a confirmed visit. The laboratory must
              approve it. No online payment. You may cancel before the start.
            </p>
            <InputError>{error}</InputError>
            <Button
              disabled={busy}
              onClick={async () => {
                if (
                  await command({
                    type: "request",
                    slotId: review.slot.id,
                    requestKey: review.key,
                  })
                )
                  setReview(null);
              }}
            >
              {busy ? "Saving…" : "Submit lab request"}
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
