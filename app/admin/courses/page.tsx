import { createServerClient } from '@/database/supabase/server'
import { AdminCoursesClient } from './admin-courses-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Courses - Admin',
  description: 'Manage all courses on the platform'
}

export default async function AdminCoursesPage() {
  const supabase = await createServerClient()

  // Get all courses with lesson count
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (id)
    `)
    .order('created_at', { ascending: false })

  return <AdminCoursesClient courses={courses || []} />
}
