import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { saveReport, MAX_REPORT_BYTES } from "@/server/reports";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    if (actor.role !== "lab")
      throw new ServiceError(
        "FORBIDDEN",
        "Only laboratory accounts can upload reports.",
      );
    const body = await boundedBody(request, MAX_REPORT_BYTES + 65536);
    const form = await new Response(new Uint8Array(body), {
      headers: { "Content-Type": request.headers.get("content-type") ?? "" },
    })
      .formData()
      .catch(() => {
        throw new ServiceError(
          "INVALID_INPUT",
          "Use a valid multipart PDF upload.",
        );
      });
    const file = form.get("file");
    if (!(file instanceof File))
      throw new ServiceError("INVALID_INPUT", "Select a PDF file.");
    const id = await saveReport(getDatabase(), actor, {
      patientId: String(form.get("patientId") ?? ""),
      title: String(form.get("title") ?? ""),
      fileName: file.name,
      bytes: Buffer.from(await file.arrayBuffer()),
    });
    return json({ id }, 201);
  } catch (error) {
    return failure(error);
  }
}
