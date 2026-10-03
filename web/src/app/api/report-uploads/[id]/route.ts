import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import {
  finishUpload,
  putUploadPart,
  REPORT_PART_BYTES,
} from "@/server/report-uploads";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    if (actor.role !== "lab")
      throw new ServiceError("FORBIDDEN", "Laboratory access required.");
    const value = new URL(request.url).searchParams.get("part");
    if (value === null || !/^[0-4]$/.test(value))
      throw new ServiceError("INVALID_INPUT", "Invalid part number.");
    await putUploadPart(
      getDatabase(),
      actor,
      (await context.params).id,
      Number(value),
      await boundedBody(request, REPORT_PART_BYTES),
    );
    return json({ saved: true });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request, context: Context) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    return json({
      id: await finishUpload(getDatabase(), actor, (await context.params).id),
    });
  } catch (error) {
    return failure(error);
  }
}
