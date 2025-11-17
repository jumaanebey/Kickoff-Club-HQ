import { NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'

export async function GET() {
  try {
    // Test connection
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        hasUrl: !!url,
        hasKey: !!key
      })
    }

    // Test query
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, is_published')
      .eq('is_published', true)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    }

    return NextResponse.json({
      success: true,
      count: courses?.length || 0,
      courses: courses?.map(c => ({ title: c.title, slug: c.slug }))
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
