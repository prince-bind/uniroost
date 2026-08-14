/**
 * Simple in-memory fixed-window rate limiter.
 *
 * NOTE: this is process-local. It's correct for a single-instance
 * deployment (one Node process) but will NOT share state across
 * multiple serverless instances or horizontally-scaled containers.
 * For production on Vercel / multi-instance infra, swap this for
 * @upstash/ratelimit backed by Upstash Redis — same call signature,
 * durable and shared across instances. See SYSTEM_DESIGN.md.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the Map doesn't grow unbounded on a long-running process.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key unique identifier, e.g. `signup:${ip}`
 * @param limit max requests allowed within the window
 * @param windowMs window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

type HeaderSource = Headers | Record<string, string | string[] | undefined> | undefined | null;

function readHeader(headers: HeaderSource, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

/** Extracts a best-effort client IP from standard proxy headers. Works with
 * both a `Request` (route handlers) and plain header objects (NextAuth). */
export function getClientIp(source: Request | HeaderSource): string {
  const headers = source instanceof Request ? source.headers : source;
  const forwardedFor = readHeader(headers, "x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return readHeader(headers, "x-real-ip") ?? "unknown";
}
