import { NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'

// This endpoint should be disabled or protected in production
export async function GET() {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return NextResponse.json({
        success: false,
        error: 'Configuration error'
      })
    }

    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, is_published')
      .eq('is_published', true)

    if (error) {
      // Log full error server-side only
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Database query failed'
      })
    }

    return NextResponse.json({
      success: true,
      count: courses?.length || 0,
      courses: courses?.map(c => ({ title: c.title, slug: c.slug }))
    })
  } catch (error) {
    // Log full error server-side only
    console.error('Test DB error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    })
  }
}
