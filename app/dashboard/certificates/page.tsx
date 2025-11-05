import { redirect } from "next/navigation"
import Link from "next/link"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/lib/db/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/certificates/certificate-card"

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-gray-600">View and download your course completion certificates</p>
      </div>

      {/* Certificates List */}
      {enrollments && enrollments.length > 0 ? (
        <div className="space-y-4">
          {enrollments.map((enrollment: any) => (
            <CertificateCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4"><Æ</div>
            <h3 className="text-xl font-bold mb-2">No certificates yet</h3>
            <p className="text-gray-600 mb-6">
              Complete a course to earn your first certificate
            </p>
            <Button asChild>
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
