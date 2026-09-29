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
    return new Response(new Uint8Array(report.bytes), {
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
