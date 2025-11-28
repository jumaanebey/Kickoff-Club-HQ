import CoursesClient from './courses-client'
import { createServerClient } from '@/database/supabase/server'

// Force dynamic rendering because we access user cookies
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh data

// Updated: 2025-11-28 - Optimized query to fetch only published lessons
export default async function CoursesPage() {
  // Create a direct Supabase client
  const supabase = await createServerClient()

  // Optimized: Fetch only published lessons with their course slug
  // This is more efficient than fetching all courses with all their lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      duration_seconds,
      is_free,
      order_index,
      courses!inner (
        slug,
        is_published
      )
    `)
    .eq('is_published', true)
    .eq('courses.is_published', true)
    .order('order_index', { ascending: true })

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
  }

  // Transform lessons to include courseSlug at the top level
  const lessonsWithSlug = (lessons || []).map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    duration_seconds: lesson.duration_seconds,
    is_free: lesson.is_free,
    order_index: lesson.order_index,
    courseSlug: lesson.courses?.slug || ''
  }))

  // Create a minimal courses array for backward compatibility
  // Group lessons by course slug
  const courseMap = new Map()
  lessonsWithSlug.forEach((lesson: any) => {
    if (!courseMap.has(lesson.courseSlug)) {
      courseMap.set(lesson.courseSlug, {
        slug: lesson.courseSlug,
        lessons: []
      })
    }
    courseMap.get(lesson.courseSlug).lessons.push(lesson)
  })
  const courses = Array.from(courseMap.values())

  // Fetch user enrollments if logged in
  const { data: { user } } = await supabase.auth.getUser()
  let enrollments: any[] = []

  if (user) {
    const { data, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id, user_id, course_id, enrolled_at, progress_percentage, last_accessed_at, completed_at,
        courses (id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
    } else {
      enrollments = data || []
    }
  }

  return <CoursesClient courses={courses} enrollments={enrollments} />
}
