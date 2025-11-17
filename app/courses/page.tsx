import CoursesClient from './courses-client'
import { createClient } from '@supabase/supabase-js'

// Revalidate every 30 minutes - courses don't change frequently
export const revalidate = 1800

export default async function CoursesPage() {
  // Create a direct Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

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
