import "server-only";
import { databaseError, ServiceError } from "./errors.ts";
export const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders });
}
export function failure(error: unknown) {
  const safe = databaseError(error);
  const status = {
    INVALID_INPUT: 400,
    UNAUTHENTICATED: 401,
    RATE_LIMITED: 429,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    DEPENDENCY_UNAVAILABLE: 503,
    INTERNAL_ERROR: 500,
  }[safe.code];
  if (status >= 500)
    console.error(JSON.stringify({ event: "request_failed", code: safe.code }));
  const response = json({ error: safe.message }, status);
  if (status === 429) response.headers.set("Retry-After", "60");
  return response;
}
export function sameOrigin(request: Request) {
  const expected = process.env.BETTER_AUTH_URL;
  if (!expected || request.headers.get("origin") !== new URL(expected).origin)
    throw new ServiceError("FORBIDDEN", "This request origin is not allowed.");
}
export async function boundedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit)
    throw new ServiceError("INVALID_INPUT", "The request is too large.");
  const reader = request.body?.getReader();
  if (!reader)
    throw new ServiceError("INVALID_INPUT", "A request body is required.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new ServiceError("INVALID_INPUT", "The request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
