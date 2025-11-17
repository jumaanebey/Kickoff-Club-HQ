import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/database/supabase/server"
import { CertificatesContent } from "@/components/dashboard/certificates-content"

export const dynamic = 'force-dynamic'

export default async function CertificatesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()

  // Get completed courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        instructor_name,
        thumbnail_url,
        category,
        difficulty_level
      )
    `)
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })

  return <CertificatesContent enrollments={enrollments} />
}
