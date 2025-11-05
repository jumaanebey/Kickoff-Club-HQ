import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/lib/db/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & Progress</h1>
        <p className="text-gray-600">Track your learning journey and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-4xl">{totalEnrollments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {completedCourses} completed, {inProgressCourses} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-4xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Watch Time</CardDescription>
            <CardTitle className="text-4xl">{totalWatchTimeHours}h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {totalWatchTimeMinutes % 60} minutes additional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Certificates Earned</CardDescription>
            <CardTitle className="text-4xl">{completedCourses}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/certificates" className="text-sm text-primary-600 hover:underline">
              View certificates →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Learning by Category</CardTitle>
          <CardDescription>Your courses grouped by football position/category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = Math.round((stats.completed / stats.count) * 100)
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {category.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {stats.count} {stats.count === 1 ? 'course' : 'courses'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">
                      {stats.completed} / {stats.count} completed ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Learning by Difficulty</CardTitle>
          <CardDescription>Your progress across different skill levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(difficultyStats).map(([difficulty, stats]) => {
              const percentage = Math.round((stats.completed / stats.count) * 100)
              const colors = {
                beginner: 'bg-green-100 text-green-700 border-green-300',
                intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                advanced: 'bg-red-100 text-red-700 border-red-300'
              }
              return (
                <Card key={difficulty} className={`border-2 ${colors[difficulty as keyof typeof colors] || ''}`}>
                  <CardHeader>
                    <CardTitle className="capitalize">{difficulty}</CardTitle>
                    <CardDescription>{stats.count} courses enrolled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">{percentage}%</div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-sm mt-2">
                      {stats.completed} / {stats.count} completed
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your learning activity from the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProgress && recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress: any) => (
                <div key={progress.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <Link
                      href={`/courses/${progress.lessons?.courses?.slug}/lessons/${progress.lesson_id}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {progress.lessons?.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {progress.lessons?.courses?.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(progress.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {progress.completed ? (
                      <Badge variant="default">Completed</Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity in the last 7 days</p>
              <Link href="/courses" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
                Browse courses to get started
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses Progress</CardTitle>
          <CardDescription>Detailed breakdown of your enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.courses?.slug}`}
                  className="block hover:bg-gray-50 p-4 rounded-lg border transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{enrollment.courses?.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {enrollment.courses?.category.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {enrollment.courses?.difficulty_level}
                        </Badge>
                        <span>⏱️ {enrollment.courses?.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={enrollment.progress_percentage || 0} className="h-2 flex-1" />
                        <span className="text-sm font-medium min-w-[45px]">
                          {enrollment.progress_percentage || 0}%
                        </span>
                      </div>
                    </div>
                    {enrollment.completed_at && (
                      <Badge variant="default">✓ Completed</Badge>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No courses enrolled yet</p>
                <Link href="/courses" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
                  Browse available courses
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
