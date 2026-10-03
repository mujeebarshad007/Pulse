import "server-only";

export type ErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DEPENDENCY_UNAVAILABLE"
  | "INTERNAL_ERROR"
  | "UNAUTHENTICATED"
  | "RATE_LIMITED"
  | "FORBIDDEN";
export class ServiceError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
/** Translate known PostgreSQL errors without exposing query values or internals. */
export function databaseError(error: unknown): ServiceError {
  if (error instanceof ServiceError) return error;
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";
  if (["23505", "23P01", "40001", "40P01", "55P03"].includes(code))
    return new ServiceError(
      "CONFLICT",
      "This operation conflicts with another change. Refresh and try again.",
    );
  if (["23503", "23514", "23502", "22P02", "22007", "22008"].includes(code))
    return new ServiceError(
      "INVALID_INPUT",
      "The supplied record or relationship is invalid.",
    );
  if (
    code.startsWith("08") ||
    ["ECONNREFUSED", "57P01", "53300", "57014"].includes(code)
  )
    return new ServiceError(
      "DEPENDENCY_UNAVAILABLE",
      "The service is temporarily unavailable. Try again later.",
    );
  return new ServiceError(
    "INTERNAL_ERROR",
    "The operation could not be completed.",
  );
}

export async function safely<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    throw databaseError(error);
  }
}
