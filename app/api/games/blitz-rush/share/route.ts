import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

// POST: Generate shareable score card data
// Returns structured data for client-side rendering (canvas-based)
// No server-side image generation to keep it simple and fast
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`blitz-rush-share:${ip}`, { windowMs: 60000, maxRequests: 10 })
    if (!rateCheck.success) return rateLimitResponse(rateCheck)

    const body = await request.json()
    const { score, coins, distance, footballIQ, iqLevel } = body

    if (typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid score data' }, { status: 400 })
    }

    // Generate share text
    const iqLine = footballIQ > 0 ? `Football IQ: ${footballIQ} (${iqLevel || 'Rookie'})` : ''
    const shareText = [
      `I scored ${Math.floor(score).toLocaleString()} in Blitz Rush 3D!`,
      `${Math.floor(distance || 0)}m | ${coins || 0} coins`,
      iqLine,
      '',
      'Think you can beat me?',
    ].filter(Boolean).join('\n')

    const shareUrl = 'https://kickoffclubhq.com/games/blitz-rush'

    return NextResponse.json({
      success: true,
      shareText,
      shareUrl,
      cardData: {
        score: Math.floor(score),
        coins: coins || 0,
        distance: Math.floor(distance || 0),
        footballIQ: footballIQ || 0,
        iqLevel: iqLevel || 'Rookie',
      },
    })
  } catch (error) {
    console.error('Share generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
