import { NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

export const runtime = 'edge'

export async function GET(request: Request) {
  const ip = getClientIP(request)
  const limit = checkRateLimit(`courses:${ip}`, { maxRequests: 30, windowMs: 60000 })
  if (!limit.success) return rateLimitResponse(limit)

  try {
    // Use the same simple query pattern that works in /api/test-db
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index, enrolled_count')
      .or('is_published.eq.true,is_published.is.null')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }

    return NextResponse.json(courses || [])
  } catch (error) {
    console.error('Exception:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
