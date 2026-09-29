import { authConfigured, currentActor, requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { snapshot, executeCommand } from "@/server/workspace";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const actor = await currentActor(request.headers);
    return json({
      actor,
      state: await snapshot(getDatabase(), actor),
      googleReady: authConfigured(),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    let input: unknown;
    try {
      input = JSON.parse((await boundedBody(request, 16384)).toString("utf8"));
    } catch {
      throw new ServiceError("INVALID_INPUT", "Invalid or oversized request.");
    }
    const message = await executeCommand(getDatabase(), actor, input);
    return json({ message });
  } catch (error) {
    return failure(error);
  }
}
