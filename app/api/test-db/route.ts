import { NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test connection
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, is_published')
      .limit(5)

    const { data: instructors, error: instructorsError } = await supabase
      .from('instructors')
      .select('id, name')
      .limit(5)

    return NextResponse.json({
      success: true,
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
      },
      courses: {
        count: courses?.length || 0,
        data: courses,
        error: coursesError?.message
      },
      instructors: {
        count: instructors?.length || 0,
        data: instructors,
        error: instructorsError?.message
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
