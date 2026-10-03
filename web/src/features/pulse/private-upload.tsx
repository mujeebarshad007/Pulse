"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "./provider";
import { Gate } from "@/components/pulse/shell";
import {
  PageTitle,
  Panel,
  FormNote,
  Modal,
  InputError,
} from "@/components/pulse/primitives";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function PrivateUpload() {
  const { refresh, notify } = useDemo(),
    router = useRouter();
  const [review, setReview] = useState<{
    form: FormData;
    name: string;
    id: string;
  } | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const uploadSession = useRef<{ id: string; partBytes: number } | null>(null);
  const [progress, setProgress] = useState(0);
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    uploadSession.current = null;
    const form = new FormData(event.currentTarget),
      file = form.get("file");
    try {
      if (
        !(file instanceof File) ||
        !/\.pdf$/i.test(file.name) ||
        file.size === 0 ||
        file.size > 10485760
      )
        throw new Error("Choose a fictional PDF up to 10 MB.");
      const response = await fetch("/api/patients/lookup", {
        method: "POST",
        body: String(form.get("patientId")),
        signal: AbortSignal.timeout(15000),
      });
      const patient = await response.json();
      if (!response.ok) throw new Error(patient.error);
      setReview({ form, name: patient.name, id: patient.id });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Patient lookup failed.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload() {
    if (!review || busy) return;
    setBusy(true);
    setError("");
    try {
      const file = review.form.get("file") as File;
      if (!uploadSession.current) {
        const response = await fetch("/api/report-uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: review.id,
            title: String(review.form.get("title")),
            fileName: file.name,
            byteSize: file.size,
          }),
          signal: AbortSignal.timeout(15000),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        uploadSession.current = result;
      }
      const session = uploadSession.current!;
      for (
        let start = 0, part = 0;
        start < file.size;
        start += session.partBytes, part++
      ) {
        const response = await fetch(
          `/api/report-uploads/${session.id}?part=${part}`,
          {
            method: "PUT",
            body: file.slice(start, start + session.partBytes),
            signal: AbortSignal.timeout(30000),
          },
        );
        if (!response.ok) throw new Error((await response.json()).error);
        setProgress(
          Math.min(
            100,
            Math.round(((start + session.partBytes) / file.size) * 100),
          ),
        );
      }
      const response = await fetch(`/api/report-uploads/${session.id}`, {
        method: "POST",
        signal: AbortSignal.timeout(45000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      await refresh();
      notify("Private test report saved for the selected patient.");
      router.push("/laboratory");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Check the report list before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Gate role="lab">
      <PageTitle
        eyebrow="PRIVATE REPORTS"
        title="The right report. The right patient."
        description="Match a tester’s patient reference, review the recipient, then upload a fictional PDF."
      />
      <Panel>
        <form className="p-form" onSubmit={prepare}>
          <Field
            id="patientId"
            label="Patient reference"
            hint="Ask the tester to copy this from My profile."
          >
            <input
              className="ui-input"
              id="patientId"
              name="patientId"
              required
              maxLength={128}
            />
          </Field>
          <Field id="report-title" label="Report title">
            <input
              className="ui-input"
              id="report-title"
              name="title"
              required
              maxLength={100}
            />
          </Field>
          <Field id="report-file" label="Fictional PDF (up to 10 MB)">
            <input
              className="ui-input"
              id="report-file"
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              required
            />
          </Field>
          <FormNote>
            Testing only: upload fictional documents without clinical or
            personal information. Files are private and downloaded only after an
            account access check. File signature checks are not a malware scan.
          </FormNote>
          <InputError>{error}</InputError>
          <Button type="submit" disabled={busy}>
            {busy ? "Checking…" : "Review recipient"}
          </Button>
        </form>
      </Panel>
      <Modal
        open={!!review}
        title="Confirm the patient match"
        onClose={() => {
          if (!busy) setReview(null);
        }}
      >
        <p>
          Recipient: <strong>{review?.name}</strong>
        </p>
        <p className="p-form-note">Reference: {review?.id}</p>
        <p>
          Only this patient and your laboratory account will be able to download
          this PDF.
        </p>
        <div className="p-form-actions">
          <InputError>{error}</InputError>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => setReview(null)}
          >
            Check details
          </Button>
          <Button disabled={busy} onClick={upload}>
            {busy ? `Uploading… ${progress}%` : "Save private report"}
          </Button>
        </div>
      </Modal>
    </Gate>
  );
}
