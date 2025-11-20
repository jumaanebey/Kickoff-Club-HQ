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
    .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index, enrolled_count')
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
  }

  const coursesArray = courses || []

  return <CoursesClient courses={coursesArray} />
}
