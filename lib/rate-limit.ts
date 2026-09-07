/**
 * Rate limiting for API routes.
 *
 * Counts in Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, so the
 * limit holds across Vercel instances and cold starts. Falls back to a per-instance in-memory
 * window when Redis is not configured or is unreachable — a Redis outage degrades the limiter,
 * it does not 500 the site. Uses the REST API directly, so no extra dependency.
 */

type RateLimitRecord = { count: number; resetTime: number }
const rateLimitStore = new Map<string, RateLimitRecord>()

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    rateLimitStore.forEach((record, key) => { if (now > record.resetTime) rateLimitStore.delete(key) })
  }, 5 * 60 * 1000)
}

export interface RateLimitConfig { windowMs?: number; maxRequests?: number }
export interface RateLimitResult { success: boolean; remaining: number; resetTime: number; retryAfter?: number }

const REDIS_TIMEOUT_MS = 1000

async function redisCheck(key: string, windowMs: number, maxRequests: number): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  const now = Date.now()
  const bucket = Math.floor(now / windowMs)
  const redisKey = `rl:${key}:${bucket}`
  const resetTime = (bucket + 1) * windowMs
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), REDIS_TIMEOUT_MS)
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['INCR', redisKey], ['PEXPIRE', redisKey, String(windowMs)]]),
      signal: ctrl.signal,
    })
    clearTimeout(t)
    if (!res.ok) return null
    const body = (await res.json()) as Array<{ result?: unknown }>
    const count = Number(body?.[0]?.result)
    if (!Number.isFinite(count)) return null
    if (count > maxRequests) {
      return { success: false, remaining: 0, resetTime, retryAfter: Math.max(1, Math.ceil((resetTime - now) / 1000)) }
    }
    return { success: true, remaining: maxRequests - count, resetTime }
  } catch {
    return null
  }
}

function memoryCheck(key: string, windowMs: number, maxRequests: number): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime, retryAfter: Math.ceil((record.resetTime - now) / 1000) }
  }
  record.count++
  rateLimitStore.set(key, record)
  return { success: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

/** Check the rate limit for an identifier (IP or user id). Must be awaited. */
export async function checkRateLimit(identifier: string, config: RateLimitConfig = {}): Promise<RateLimitResult> {
  const { windowMs = 60000, maxRequests = 10 } = config
  return (await redisCheck(identifier, windowMs, maxRequests)) ?? memoryCheck(identifier, windowMs, maxRequests)
}

/** Best-effort client IP from proxy headers. */
export function getClientIP(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/** 429 response with standard headers. */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.', retryAfter: result.retryAfter }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(result.retryAfter ?? 60),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
    },
  })
}
