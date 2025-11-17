import { NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    // Use the same simple query pattern that works in /api/test-db
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index, enrolled_count')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json(courses || [])
  } catch (error: any) {
    console.error('Exception:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
