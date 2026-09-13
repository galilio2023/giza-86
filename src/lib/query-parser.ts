/**
 * GIZA 86 Reusable API Query Parameter Parser
 * Provides type-safe parameter extraction, coercion, and standardized pagination
 * across all Next.js Route Handlers.
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  withCount: boolean;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");
  const withCountParam = searchParams.get("withCount");

  const rawLimit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);

  const rawPage = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;
  const page = Math.max(1, rawPage);

  const offset = (page - 1) * limit;
  const withCount = withCountParam === "true";

  return { page, limit, offset, withCount };
}

export function parseStringParam(searchParams: URLSearchParams, key: string): string | undefined {
  const val = searchParams.get(key)?.trim();
  return val ? val : undefined;
}

export function parseNumberParam(searchParams: URLSearchParams, key: string): number | undefined {
  const val = searchParams.get(key);
  if (!val) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}

export function parseBooleanParam(searchParams: URLSearchParams, key: string): boolean {
  return searchParams.get(key) === "true";
}
