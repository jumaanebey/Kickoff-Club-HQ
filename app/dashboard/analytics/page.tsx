import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/database/supabase/server'
import { AnalyticsContent } from '@/components/dashboard/analytics-content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics & Progress',
  description: 'View your learning progress and statistics'
}

export default async function AnalyticsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/sign-in')

  const supabase = await createServerClient()

  // Get overall stats
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        duration_minutes,
        thumbnail_url,
        category,
        difficulty_level
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  // Get total watch time
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('watched_seconds')
    .eq('user_id', user.id)

  const totalWatchTimeSeconds = progressData?.reduce((sum, p) => sum + (p.watched_seconds || 0), 0) || 0
  const totalWatchTimeMinutes = Math.floor(totalWatchTimeSeconds / 60)
  const totalWatchTimeHours = Math.floor(totalWatchTimeMinutes / 60)

  // Calculate stats
  const totalEnrollments = enrollments?.length || 0
  const completedCourses = enrollments?.filter(e => e.completed_at)?.length || 0
  const inProgressCourses = enrollments?.filter(e => !e.completed_at)?.length || 0
  const completionRate = totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0

  // Get category breakdown
  const categoryStats = enrollments?.reduce((acc, e: any) => {
    const category = e.courses?.category || 'unknown'
    if (!acc[category]) {
      acc[category] = { count: 0, completed: 0 }
    }
    acc[category].count++
    if (e.completed_at) {
      acc[category].completed++
    }
    return acc
  }, {} as Record<string, { count: number; completed: number }>) || {}

  // Get difficulty breakdown
  const difficultyStats = enrollments?.reduce((acc, e: any) => {
    const difficulty = e.courses?.difficulty_level || 'unknown'
    if (!acc[difficulty]) {
      acc[difficulty] = { count: 0, completed: 0 }
    }
    acc[difficulty].count++
    if (e.completed_at) {
      acc[difficulty].completed++
    }
    return acc
  }, {} as Record<string, { count: number; completed: number }>) || {}

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentProgress } = await supabase
    .from('user_progress')
    .select(`
      *,
      lessons (
        title,
        courses (
          title,
          slug
        )
      )
    `)
    .eq('user_id', user.id)
    .gte('updated_at', sevenDaysAgo.toISOString())
    .order('updated_at', { ascending: false })
    .limit(10)

  return (
    <AnalyticsContent
      totalEnrollments={totalEnrollments}
      completedCourses={completedCourses}
      inProgressCourses={inProgressCourses}
      completionRate={completionRate}
      totalWatchTimeHours={totalWatchTimeHours}
      totalWatchTimeMinutes={totalWatchTimeMinutes}
      categoryStats={categoryStats}
      difficultyStats={difficultyStats}
      recentProgress={recentProgress || []}
      enrollments={enrollments || []}
    />
  )
}
