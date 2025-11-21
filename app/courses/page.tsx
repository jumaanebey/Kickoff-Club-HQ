import CoursesClient from './courses-client'
import { createServerClient } from '@/database/supabase/server'

// Revalidate every 30 minutes - courses don't change frequently
export const revalidate = 1800

export default async function CoursesPage() {
  // Create a direct Supabase client
  const supabase = await createServerClient()

  // Fetch courses on the server
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
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
