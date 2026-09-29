"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useDemo } from "./provider";
import { dateLabel, ownReports, type Report } from "./model";
import {
  EmptyState,
  FormNote,
  InputError,
  Modal,
  PageTitle,
  Panel,
  SectionTitle,
} from "@/components/pulse/primitives";
import { Gate } from "@/components/pulse/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { PrivateUpload } from "./private-upload";

async function downloadReport(report: Report, connected: boolean) {
  let blob: Blob;
  if (connected) {
    const response = await fetch(
      `/api/reports/${encodeURIComponent(report.id)}`,
      { cache: "no-store" },
    );
    if (!response.ok)
      throw new Error(
        (await response.json()).error ?? "The report could not be downloaded.",
      );
    blob = await response.blob();
  } else
    blob = new Blob([report.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = report.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function ReportReader({
  report,
  onClose,
}: {
  report: Report | undefined;
  onClose: () => void;
}) {
  const { connected, notify } = useDemo();
  return (
    <Modal open={!!report} title={report?.title ?? "Report"} onClose={onClose}>
      {report && (
        <>
          <span className="p-demo-chip">FICTIONAL REPORT</span>
          <dl className="p-detail-list">
            <div>
              <dt>Laboratory</dt>
              <dd>{report.laboratory}</dd>
            </div>
            <div>
              <dt>Demo date</dt>
              <dd>{dateLabel(report.date)}</dd>
            </div>
            <div>
              <dt>File</dt>
              <dd>{report.fileName}</dd>
            </div>
          </dl>
          {!connected && (
            <pre className="p-report-content">{report.content}</pre>
          )}
          <FormNote>
            Sample content only. This viewer provides no medical interpretation.
          </FormNote>
          <div className="p-form-actions">
            <Button
              onClick={() => {
                void downloadReport(report, connected).catch((error) =>
                  notify(error.message, "error"),
                );
              }}
            >
              <Icon name="download" size={17} />
              {connected ? "Download private PDF" : "Download sample .txt"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
export function PatientReports() {
  const { state, actor, connected } = useDemo();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const reports = ownReports(state, actor);
  const shown = reports.filter((r) =>
    `${r.title} ${r.laboratory}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <Gate role="patient">
      <PageTitle
        eyebrow="YOUR RECORDS, WITHIN REACH"
        title="A clear place for your reports."
        description="Find and read the fictional reports associated with your demo profile."
      />
      <Panel>
        <div className="p-search-line">
          <Icon name="search" />
          <label className="sr-only" htmlFor="report-search">
            Search my reports
          </label>
          <input
            id="report-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by report title or laboratory"
          />
          <span>{shown.length} reports</span>
        </div>
      </Panel>
      <Panel className="p-section">
        {shown.length ? (
          shown.map((r) => (
            <button
              key={r.id}
              className="p-report-row"
              onClick={() => setSelected(r.id)}
            >
              <span className="p-report-icon">
                <Icon name="file" />
              </span>
              <div>
                <strong>{r.title}</strong>
                <small>
                  {dateLabel(r.date)} · {r.laboratory}
                </small>
              </div>
              <span className="p-report-type">
                {connected ? "PDF · Private" : "TXT · Demo"}
              </span>
              <Icon name="chevron" size={18} />
            </button>
          ))
        ) : (
          <EmptyState
            icon="file"
            title={
              query
                ? "No reports match your search"
                : "Your reports will appear here"
            }
            action={
              query ? (
                <Button variant="secondary" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              ) : (
                <Link href="/journey" className="p-text-link">
                  Explore the laboratory journey <Icon name="arrow" size={16} />
                </Link>
              )
            }
          >
            {query
              ? "Try a shorter title or another laboratory name."
              : "Use the laboratory demo to prepare a fictional report for this patient."}
          </EmptyState>
        )}
      </Panel>
      <FormNote>
        {connected
          ? "Only reports assigned to your account are returned by the server. Downloads require a fresh access check."
          : "Only this persona’s reports are displayed. Production access requires server checks."}
      </FormNote>
      <ReportReader
        report={reports.find((r) => r.id === selected)}
        onClose={() => setSelected(null)}
      />
    </Gate>
  );
}
export function Laboratory() {
  const { state, connected } = useDemo();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const reports = connected
    ? state.reports
    : state.reports.filter((r) => r.laboratory === "Northside Laboratory");
  const shown = reports.filter((r) =>
    `${r.title} ${state.patients.find((p) => p.id === r.patientId)?.name}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <Gate role="lab">
      <PageTitle
        eyebrow="LABORATORY · FICTIONAL TEST REPORTS"
        title="Clarity, from lab to patient."
        description="Prepare fictional reports and follow their availability in the patient workspace."
        action={
          <Link href="/laboratory/upload" className="p-link-button">
            <Icon name="upload" size={17} />
            Prepare demo report
          </Link>
        }
      />
      <div className="p-stat-grid">
        <Panel className="p-stat">
          <span>
            <Icon name="file" />
            Demo reports
          </span>
          <strong>{reports.length}</strong>
          <small>
            {connected
              ? "Saved by your laboratory account"
              : "Available in this session"}
          </small>
        </Panel>
        <Panel className="p-stat">
          <span>
            <Icon name="user" />
            Demo patients
          </span>
          <strong>{new Set(reports.map((r) => r.patientId)).size}</strong>
          <small>With a prepared report</small>
        </Panel>
        <Panel className="p-stat">
          <span>
            <Icon name="shield" />
            File handling
          </span>
          <strong className="p-stat-word">
            {connected ? "Private" : "In memory"}
          </strong>
          <small>
            {connected
              ? "PDF access checked by the server"
              : "No network upload or medical storage"}
          </small>
        </Panel>
      </div>
      <Panel>
        <SectionTitle title="Prepared reports" />
        <div className="p-search-line">
          <Icon name="search" />
          <label className="sr-only" htmlFor="lab-search">
            Search prepared reports
          </label>
          <input
            id="lab-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by report or fictional patient"
          />
        </div>
        {shown.length ? (
          <div className="p-table-wrap">
            <table className="p-table">
              <caption className="sr-only">
                Fictional reports prepared by this laboratory
              </caption>
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Patient</th>
                  <th>Demo date</th>
                  <th>
                    <span className="sr-only">Open report</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.title}</strong>
                      <small>{r.id}</small>
                    </td>
                    <td>
                      {state.patients.find((p) => p.id === r.patientId)?.name}
                      <small>{r.patientId}</small>
                    </td>
                    <td>{dateLabel(r.date)}</td>
                    <td>
                      <button
                        className="p-text-link"
                        onClick={() => setSelected(r.id)}
                      >
                        View <Icon name="arrow" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="file"
            title="No reports found"
            action={
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear filter
              </Button>
            }
          >
            Try another report title or fictional patient.
          </EmptyState>
        )}
      </Panel>
      <ReportReader
        report={reports.find((r) => r.id === selected)}
        onClose={() => setSelected(null)}
      />
    </Gate>
  );
}
export function ReportUpload() {
  const { connected } = useDemo();
  return connected ? <PrivateUpload /> : <DemoReportUpload />;
}
function DemoReportUpload() {
  const { state, run } = useDemo();
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<{ name: string; content: string } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [review, setReview] = useState(false);
  const readVersion = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  async function selectFile(e: ChangeEvent<HTMLInputElement>) {
    const version = ++readVersion.current;
    const selected = e.target.files?.[0];
    setFile(null);
    setError("");
    setReading(false);
    if (!selected) return;
    if (
      !/\.txt$/i.test(selected.name) ||
      selected.size > 65536 ||
      selected.size === 0
    ) {
      setError("Choose a nonempty fictional .txt file no larger than 64 KB.");
      return;
    }
    setReading(true);
    try {
      const content = await selected.text();
      if (version !== readVersion.current) return;
      if (content.includes("\0") || !content.trim()) {
        setError("Use a plain text sample with readable content.");
        return;
      }
      setFile({ name: selected.name, content });
    } catch {
      if (version !== readVersion.current) return;
      setError(
        "This file could not be read. Choose it again or use a generated sample.",
      );
    } finally {
      if (version === readVersion.current) setReading(false);
    }
  }
  function sample() {
    readVersion.current++;
    setReading(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    setFile({
      name: "big-pulse-fictional-report.txt",
      content:
        "Pulse — FICTIONAL REPORT\n\nThis generated sample exists to test the lab-to-patient interface.\nIt contains no clinical measurements, patient information, diagnosis or treatment advice.",
    });
    if (!title) setTitle("Sample laboratory report");
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Choose a fictional text file or use the generated sample.");
      return;
    }
    setError("");
    setReview(true);
  }
  return (
    <Gate role="lab">
      <Link className="p-back-link" href="/laboratory">
        ← Back to reports
      </Link>
      <PageTitle
        eyebrow="LABORATORY → PATIENT"
        title="Prepare a report with confidence."
        description="Match a fictional patient, review the details, then make the sample visible in their demo workspace."
      />
      <div className="p-upload-layout">
        <Panel>
          <form className="p-form" onSubmit={submit}>
            <Field id="report-patient" label="Intended demo patient">
              <select
                id="report-patient"
                className="ui-input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="">Select a fictional patient</option>
                {state.patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.id}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="report-title" label="Report title">
              <input
                id="report-title"
                className="ui-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                placeholder="e.g. Sample blood count report"
              />
            </Field>
            <div className="p-upload-zone">
              <Icon name="upload" size={28} />
              <h2>Choose a fictional report</h2>
              <p>
                Plain text (.txt), up to 64 KB. Read locally; never uploaded.
              </p>
              <label className="p-link-button secondary" htmlFor="report-file">
                Choose .txt file
              </label>
              <input
                ref={inputRef}
                id="report-file"
                type="file"
                accept=".txt,text/plain"
                className="p-file-input"
                onChange={selectFile}
              />
              <span>or</span>
              <Button variant="quiet" onClick={sample}>
                Use a generated sample
              </Button>
            </div>
            {reading && <p role="status">Reading the selected local file…</p>}
            {file && (
              <div className="p-selected-file">
                <Icon name="file" />
                <div>
                  <strong>{file.name}</strong>
                  <small>
                    {new TextEncoder().encode(file.content).byteLength} bytes ·
                    Ready to review
                  </small>
                </div>
                <button
                  type="button"
                  className="p-icon-button"
                  aria-label="Remove selected file"
                  onClick={() => {
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <Icon name="close" size={17} />
                </button>
              </div>
            )}
            <InputError>{error}</InputError>
            <div className="p-form-actions">
              <Button type="submit" disabled={reading}>
                Review demo report <Icon name="arrow" size={16} />
              </Button>
            </div>
          </form>
        </Panel>
        <Panel className="p-upload-help">
          <span className="p-feature-icon">
            <Icon name="shield" size={24} />
          </span>
          <h2>
            The right report.
            <br />
            The right person.
          </h2>
          <ol>
            <li>Choose the intended fictional patient.</li>
            <li>
              Use the generated sample or a file containing only fictional text.
            </li>
            <li>Review the match before adding it.</li>
            <li>Switch to that patient to see the report.</li>
          </ol>
          <FormNote>
            File format and size are frontend demonstration limits. Production
            uploads need private storage, file inspection, and approved access
            rules.
          </FormNote>
        </Panel>
      </div>
      <Modal
        open={review}
        title="Review the report match"
        onClose={() => setReview(false)}
      >
        <dl className="p-detail-list">
          <div>
            <dt>Patient</dt>
            <dd>{state.patients.find((p) => p.id === patientId)?.name}</dd>
          </div>
          <div>
            <dt>Patient reference</dt>
            <dd>{patientId}</dd>
          </div>
          <div>
            <dt>Report</dt>
            <dd>{title}</dd>
          </div>
          <div>
            <dt>File</dt>
            <dd>{file?.name}</dd>
          </div>
        </dl>
        <p>
          The fictional report will immediately appear for this demo patient.
          This does not upload or publish a real medical record.
        </p>
        <div className="p-form-actions">
          <Button variant="secondary" onClick={() => setReview(false)}>
            Check details
          </Button>
          <Button
            onClick={async () => {
              if (
                file &&
                (await run({
                  type: "report",
                  patientId,
                  title,
                  content: file.content,
                  fileName: file.name,
                }))
              ) {
                setReview(false);
                router.push("/laboratory");
              }
            }}
          >
            Add report to demo
          </Button>
        </div>
      </Modal>
    </Gate>
  );
}
