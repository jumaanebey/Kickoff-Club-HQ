import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
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
