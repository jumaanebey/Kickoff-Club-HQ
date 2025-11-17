import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/database/supabase/server"
import { SavedCoursesContent } from "@/components/dashboard/saved-content"

export const dynamic = 'force-dynamic'

export default async function SavedCoursesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()

  // Get saved courses
  const { data: savedCourses } = await supabase
    .from('saved_courses')
    .select(`
      id,
      created_at,
      courses (
        id,
        title,
        slug,
        description,
        thumbnail_url,
        instructor_name,
        category,
        difficulty_level,
        tier_required,
        duration_minutes,
        enrolled_count
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <SavedCoursesContent savedCourses={savedCourses} />
}
