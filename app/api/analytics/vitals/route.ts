import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const limit = checkRateLimit(`analytics-vitals:${ip}`, { maxRequests: 60, windowMs: 60000 })
  if (!limit.success) return rateLimitResponse(limit)

  try {
    const body = await request.json()

    // Log Web Vitals metrics
    // In production, you would send this to your analytics service
    // Examples: Vercel Analytics, Datadog, Google Analytics, etc.
    console.log('[Web Vitals]', {
      name: body.name,
      value: body.value,
      rating: body.rating,
      timestamp: new Date().toISOString(),
    })

    // You can send to external services here:
    // - Vercel Analytics (already included via @vercel/analytics)
    // - Google Analytics
    // - Datadog
    // - Sentry
    // - Custom analytics endpoint

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Web Vitals] Error:', error)
    return NextResponse.json({ error: 'Failed to log vitals' }, { status: 500 })
  }
}
