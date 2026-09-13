import { NextResponse } from "next/server";
import { z } from "zod";
import { DomainError } from "@/lib/domain/errors";
import { requireAdminApi } from "@/lib/auth-guard";

/**
 * Standardizes API error responses across all Route Handlers.
 * Maps Zod validation issues, domain errors, and SQL constraints to appropriate HTTP status codes.
 */
export function handleApiError(error: unknown, fallbackMessage = "حدث خطأ غير متوقع أثناء معالجة الطلب"): NextResponse {
  // 1. Zod schema validation errors
  if (error instanceof z.ZodError) {
    const firstIssue = error.issues[0];
    return NextResponse.json(
      {
        error: firstIssue ? firstIssue.message : "بيانات الطلب غير صالحة",
        code: "VALIDATION_ERROR",
        details: error.issues,
      },
      { status: 400 }
    );
  }

  // 2. Domain-driven business errors
  if (error instanceof DomainError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // 3. PostgreSQL database constraints (e.g. unique violation)
  const isPostgresUniqueViolation =
    typeof error === "object" &&
    error !== null &&
    ("code" in error && (error as { code?: unknown }).code === "23505");

  if (isPostgresUniqueViolation) {
    return NextResponse.json(
      {
        error: "هذا السجل موجود بالفعل ومسجل مسبقاً في قاعدة البيانات.",
        code: "DUPLICATE_RESOURCE",
      },
      { status: 409 }
    );
  }

  // 4. Standard runtime errors
  if (error instanceof Error) {
    console.error("[API Error]:", error);
    return NextResponse.json(
      {
        error: error.message || fallbackMessage,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }

  console.error("[API Unknown Error]:", error);
  return NextResponse.json(
    {
      error: fallbackMessage,
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

type RouteHandler<TContext = unknown> = (
  request: Request,
  context: TContext
) => Promise<NextResponse | Response>;

/**
 * Higher-order Route Handler wrapper that enforces admin authorization
 * and catches uncaught exceptions with standardized formatting.
 */
export function withAdminAuth<TContext = unknown>(
  handler: RouteHandler<TContext>,
  fallbackErrorMessage?: string
): RouteHandler<TContext> {
  return async (request: Request, context: TContext) => {
    const authError = await requireAdminApi(request);
    if (authError) return authError;

    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, fallbackErrorMessage);
    }
  };
}

/**
 * Higher-order Route Handler wrapper for public endpoints that automatically
 * formats uncaught errors.
 */
export function withErrorHandler<TContext = unknown>(
  handler: RouteHandler<TContext>,
  fallbackErrorMessage?: string
): RouteHandler<TContext> {
  return async (request: Request, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, fallbackErrorMessage);
    }
  };
}
