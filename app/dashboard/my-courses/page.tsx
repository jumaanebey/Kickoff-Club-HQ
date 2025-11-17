import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/database/supabase/server"
import { MyCoursesContent } from "@/components/dashboard/my-courses-content"

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

  return (
    <MyCoursesContent
      inProgressCourses={inProgressCourses}
      coursesWithProgress={coursesWithProgress}
    />
  )
}
