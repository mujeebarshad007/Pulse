import { askAssistant } from "@/server/assistant";
import { assistantConfiguration } from "@/server/configuration";
import { requireActor } from "@/server/auth";
import { getDatabase } from "@/server/database";
import { boundedBody, failure, json, sameOrigin } from "@/server/http";
import { ServiceError } from "@/server/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() {
  const config = assistantConfiguration();
  return json({ configured: config.ready, provider: config.provider, providerLabel: config.label });
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await requireActor(request.headers);
    const body = await boundedBody(request, 4096);
    let input: unknown;
    try {
      input = JSON.parse(body.toString());
    } catch {
      throw new ServiceError("INVALID_INPUT", "Invalid assistant question.");
    }
    return json(await askAssistant(getDatabase(), actor, input));
  } catch (error) {
    return failure(error);
  }
}
