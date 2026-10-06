import { currentActor, requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { labCommand, labSnapshot } from "@/server/labs";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return json(
      await labSnapshot(getDatabase(), await currentActor(request.headers)),
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    let body: unknown;
    try {
      body = JSON.parse((await boundedBody(request, 8192)).toString());
    } catch {
      throw new ServiceError("INVALID_INPUT", "Invalid lab request.");
    }
    return json(await labCommand(getDatabase(), actor, body));
  } catch (error) {
    return failure(error);
  }
}
