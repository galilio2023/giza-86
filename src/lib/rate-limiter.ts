import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryCache = new Map<string, RateLimitRecord>();

// Prune expired memory entries periodically to prevent memory leaks in long-running processes
let lastPruned = Date.now();
const PRUNE_INTERVAL_MS = 60_000; // Every 1 minute

function pruneExpired(now: number) {
  if (now - lastPruned < PRUNE_INTERVAL_MS) return;
  lastPruned = now;
  for (const [key, record] of memoryCache.entries()) {
    if (record.resetAt <= now) {
      memoryCache.delete(key);
    }
  }
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  backend: "redis" | "memory";
}

/**
 * Local in-memory sliding-window counter.
 * Used for local development, test environments, and fail-open resilience.
 */
function checkRateLimitMemory(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const windowMs = options.windowSeconds * 1000;
  const existing = memoryCache.get(identifier);

  if (!existing || existing.resetAt <= now) {
    memoryCache.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + windowMs,
      backend: "memory",
    };
  }

  if (existing.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetAt,
      backend: "memory",
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - existing.count,
    resetTime: existing.resetAt,
    backend: "memory",
  };
}

/**
 * Distributed rate limiter with automatic Redis detection and memory fallback.
 * Uses atomic HTTP pipeline against Upstash Redis REST API when UPSTASH_REDIS_REST_URL
 * and UPSTASH_REDIS_REST_TOKEN environment variables are configured.
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return checkRateLimitMemory(identifier, options);
  }

  try {
    const key = `ratelimit:${identifier}`;
    const windowSeconds = options.windowSeconds;

    // Execute atomic pipelined increment and TTL setup via standard fetch
    const response = await fetch(`${redisUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
        ["PTTL", key],
      ]),
      // 1.5s timeout prevents blocking request execution during external network hiccups
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) {
      console.warn("[RateLimiter]: Redis pipeline returned non-200 status, failing open to memory fallback.");
      return checkRateLimitMemory(identifier, options);
    }

    const data = (await response.json()) as [
      { result: number },
      { result: number },
      { result: number }
    ];

    const currentCount = Number(data[0]?.result || 1);
    const pttlMs = Math.max(0, Number(data[2]?.result || options.windowSeconds * 1000));
    const resetTime = Date.now() + pttlMs;

    if (currentCount > options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        backend: "redis",
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, options.maxRequests - currentCount),
      resetTime,
      backend: "redis",
    };
  } catch (error) {
    // Fail-open to memory fallback ensures checkout and order lookups are never blocked
    console.warn("[RateLimiter]: Redis error occurred, gracefully using memory fallback:", error);
    return checkRateLimitMemory(identifier, options);
  }
}

/**
 * Extracts a client IP from Next.js / Vercel request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",");
    if (ips[0]?.trim()) return ips[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Helper guard that returns a 429 Too Many Requests response if limit is exceeded,
 * or null if allowed. Supports distributed Redis with resilient local memory fallback.
 */
export async function rateLimitGuard(
  request: Request,
  prefix: string,
  options: RateLimitOptions = { maxRequests: 10, windowSeconds: 60 }
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const result = await checkRateLimit(key, options);

  if (!result.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil((result.resetTime - Date.now()) / 1000));
    return NextResponse.json(
      {
        error: "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(options.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.resetTime),
          "X-RateLimit-Backend": result.backend,
        },
      }
    );
  }

  return null;
}
