import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    if (actor.role !== "lab")
      throw new ServiceError(
        "FORBIDDEN",
        "Only laboratory accounts can match a patient.",
      );
    const reference = (await boundedBody(request, 128)).toString("utf8").trim();
    const result = await getDatabase().query(
      "SELECT id,name FROM pulse.patients WHERE id=$1",
      [reference],
    );
    if (!result.rowCount)
      throw new ServiceError(
        "NOT_FOUND",
        "Patient reference not found. Ask the tester to copy it from their profile.",
      );
    return json(result.rows[0]);
  } catch (error) {
    return failure(error);
  }
}
