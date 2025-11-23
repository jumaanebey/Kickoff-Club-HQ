import CoursesClient from './courses-client'
import { createServerClient } from '@/database/supabase/server'

// Force dynamic rendering because we access user cookies
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh data

// Updated: 2025-11-21 - Course thumbnails now showing
export default async function CoursesPage() {
  // Create a direct Supabase client
  const supabase = await createServerClient()

  // Fetch courses on the server
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, is_published, instructor_name, instructor_bio, created_at, updated_at')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  console.log('Courses query result:', { count: courses?.length, error: error?.message })

  if (error) {
    console.error('Error fetching courses:', error)
  }

  // Debug: Log first course to see if thumbnail_url is present
  if (courses && courses.length > 0) {
    console.log('First course data:', {
      title: courses[0].title,
      thumbnail_url: courses[0].thumbnail_url,
      slug: courses[0].slug,
      hasThumb: !!courses[0].thumbnail_url
    })
  }

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

  const coursesArray = courses || []

  return <CoursesClient courses={coursesArray} enrollments={enrollments} />
}
