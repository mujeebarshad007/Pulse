import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { loadReport } from "@/server/reports";
import { failure, privateHeaders } from "@/server/http";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireActor(request.headers);
    const report = await loadReport(getDatabase(), actor, (await params).id);
    // Streaming avoids the host's buffered-response limit for 10 MB PDFs.
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for(let offset=0;offset<report.bytes.length;offset+=65536)
          controller.enqueue(new Uint8Array(report.bytes.subarray(offset,offset+65536)));
        controller.close();
      },
    });
    return new Response(body, {
      headers: {
        ...privateHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.fileName}"`,
        "Content-Security-Policy": "sandbox; default-src 'none'",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
