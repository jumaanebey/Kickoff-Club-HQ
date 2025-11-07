import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/lib/db/supabase-server"

export const dynamic = 'force-dynamic'

export default async function MyCoursesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()

  // Get user's enrollments with course details and progress
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (
        *,
        lessons (id, slug, title, order_index, is_published)
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  // For each enrollment, calculate progress
  const coursesWithProgress = await Promise.all(
    (enrollments || []).map(async (enrollment: any) => {
      const course = enrollment.courses
      const lessons = course.lessons.filter((l: any) => l.is_published)

      // Get user's progress for all lessons in this course
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lesson_id', lessons.map((l: any) => l.id))

      const completedCount = progressData?.filter(p => p.completed).length || 0
      const totalLessons = lessons.length
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      // Find next lesson to watch
      const sortedLessons = [...lessons].sort((a: any, b: any) => a.order_index - b.order_index)
      const nextLesson = sortedLessons.find((lesson: any) => {
        const lessonProgress = progressData?.find((p: any) => p.lesson_id === lesson.id)
        return !lessonProgress?.completed
      }) || sortedLessons[0]

      return {
        ...enrollment,
        course,
        lessons,
        completedCount,
        totalLessons,
        progress,
        nextLesson,
        isCompleted: enrollment.completed_at !== null
      }
    })
  )

  const inProgressCourses = coursesWithProgress.filter(c => !c.isCompleted && c.progress > 0)
  const notStartedCourses = coursesWithProgress.filter(c => c.progress === 0)
  const completedCourses = coursesWithProgress.filter(c => c.isCompleted)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">My Courses</h1>
        <p className="text-white/70">Track your learning progress and continue where you left off</p>
      </div>

      {/* In Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">In Progress ({inProgressCourses.length})</h2>
        </div>

        {inProgressCourses.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-12 text-center">
              <p className="text-white/70 mb-4">You haven't started any courses yet</p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inProgressCourses.map((enrollment: any) => {
              const course = enrollment.course
              return (
                <Card key={enrollment.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center text-5xl">
                            🏈
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1 text-white">{course.title}</h3>
                            <p className="text-sm text-white/70">
                              Instructor: {course.instructor_name}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">{enrollment.progress}%</Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-white/70">
                              {enrollment.completedCount} of {enrollment.totalLessons} lessons completed
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="bg-white/10" />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {enrollment.nextLesson && (
                            <div className="text-sm text-white/70">
                              <span className="font-medium text-white">Next:</span> {enrollment.nextLesson.title}
                            </div>
                          )}
                          <div className="flex gap-2">
                            {enrollment.nextLesson && (
                              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                                <Link href={`/courses/${course.slug}/lessons/${enrollment.nextLesson.slug}`}>
                                  Continue Learning
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Link href={`/courses/${course.slug}`}>
                                View Course
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

      </div>

      {/* Empty State (shown when no courses) */}
      {coursesWithProgress.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2 text-white">No courses yet</h3>
            <p className="text-white/70 mb-6">
              Start learning by browsing our course catalog
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
