import { redirect } from "next/navigation"
import Link from "next/link"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/lib/db/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SaveCourseButton } from "@/components/enrollment/save-course-button"

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Courses</h1>
        <p className="text-gray-600">Courses you've bookmarked for later</p>
      </div>

      {/* Saved Courses List */}
      {savedCourses && savedCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((saved: any) => {
            const course = saved.courses

            const difficultyColors = {
              beginner: "bg-green-100 text-green-800",
              intermediate: "bg-yellow-100 text-yellow-800",
              advanced: "bg-red-100 text-red-800"
            } as const

            const tierColors = {
              free: "bg-gray-100 text-gray-800",
              basic: "bg-blue-100 text-blue-800",
              premium: "bg-purple-100 text-purple-800"
            } as const

            return (
              <Card key={saved.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <Link href={`/courses/${course.slug}`}>
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-primary-100 rounded-t-lg flex items-center justify-center text-6xl">
                        🏈
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    {/* Badges */}
                    <div className="flex gap-2 mb-3">
                      <Badge className={tierColors[course.tier_required as keyof typeof tierColors]}>
                        {course.tier_required.toUpperCase()}
                      </Badge>
                      <Badge className={difficultyColors[course.difficulty_level as keyof typeof difficultyColors]}>
                        {course.difficulty_level}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary-600">
                        {course.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>⏱ {course.duration_minutes} min</span>
                      <span>👥 {course.enrolled_count}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/courses/${course.slug}`}>
                          View Course
                        </Link>
                      </Button>
                      <SaveCourseButton
                        courseId={course.id}
                        isSaved={true}
                        variant="outline"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">No saved courses yet</h3>
            <p className="text-gray-600 mb-6">
              Browse courses and save them for later
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
