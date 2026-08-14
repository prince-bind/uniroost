import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Every API route returns one of these two shapes. Consistent envelopes
 * mean the frontend never has to guess whether `error` is a string,
 * an object, or missing entirely.
 */
type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; error: string; details?: unknown };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function fail(error: string, status = 400, details?: unknown) {
  return NextResponse.json<ApiFailure>({ success: false, error, details }, { status });
}

/** Custom error class for expected, "business logic" failures (404, 409, etc). */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Wraps a route handler so every thrown error becomes a well-formed
 * JSON response instead of an unhandled 500 with a leaked stack trace.
 * Usage: export const POST = withErrorHandling(async (req) => { ... return ok(data) })
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ZodError) {
        return fail("Validation failed", 422, err.flatten());
      }
      if (err instanceof ApiError) {
        return fail(err.message, err.status, err.details);
      }
      // Prisma known-error codes worth surfacing distinctly.
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code?: string }).code;
        if (code === "P2002") return fail("A record with these details already exists.", 409);
        if (code === "P2025") return fail("Record not found.", 404);
      }
      console.error("[api_error]", err);
      return fail("Internal server error", 500);
    }
  };
}
