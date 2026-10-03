import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { beginUpload } from "@/server/report-uploads";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    const body = await boundedBody(request, 2048);
    let input: unknown;
    try {
      input = JSON.parse(body.toString());
    } catch {
      throw new ServiceError("INVALID_INPUT", "Invalid upload request.");
    }
    return json(await beginUpload(getDatabase(), actor, input), 201);
  } catch (error) {
    return failure(error);
  }
}
