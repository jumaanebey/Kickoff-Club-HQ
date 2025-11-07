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
        <h1 className="text-3xl font-bold mb-2 text-white">Saved Courses</h1>
        <p className="text-white/70">Courses you've bookmarked for later</p>
      </div>

      {/* Saved Courses List */}
      {savedCourses && savedCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((saved: any) => {
            const course = saved.courses

            const difficultyColors = {
              beginner: "bg-green-500/20 text-green-400 border-green-500/30",
              intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              advanced: "bg-red-500/20 text-red-400 border-red-500/30"
            } as const

            const tierColors = {
              free: "bg-white/10 text-white/70 border-white/20",
              basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
              premium: "bg-purple-500/20 text-purple-400 border-purple-500/30"
            } as const

            return (
              <Card key={saved.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
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
                      <div className="w-full h-48 bg-white/10 rounded-t-lg flex items-center justify-center text-6xl">
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
                      <h3 className="text-xl font-bold mb-2 text-white hover:text-orange-400">
                        {course.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-white/70 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                      <span>⏱ {course.duration_minutes} min</span>
                      <span>👥 {course.enrolled_count}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
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
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2 text-white">No saved courses yet</h3>
            <p className="text-white/70 mb-6">
              Browse courses and save them for later
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
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
