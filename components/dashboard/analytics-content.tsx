'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface AnalyticsContentProps {
  totalEnrollments: number
  completedCourses: number
  inProgressCourses: number
  completionRate: number
  totalWatchTimeHours: number
  totalWatchTimeMinutes: number
  categoryStats: Record<string, { count: number; completed: number }>
  difficultyStats: Record<string, { count: number; completed: number }>
  recentProgress: any[]
  enrollments: any[]
}

export function AnalyticsContent({
  totalEnrollments,
  completedCourses,
  inProgressCourses,
  completionRate,
  totalWatchTimeHours,
  totalWatchTimeMinutes,
  categoryStats,
  difficultyStats,
  recentProgress,
  enrollments
}: AnalyticsContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8">
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Analytics & Progress</h1>
        <p className={colors.textSecondary}>Track your learning journey and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Total Courses</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{totalEnrollments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm", colors.textSecondary)}>
              {completedCourses} completed, {inProgressCourses} in progress
            </p>
          </CardContent>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Completion Rate</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className={cn("h-2", colors.bgTertiary)} />
          </CardContent>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Watch Time</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{totalWatchTimeHours}h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm", colors.textSecondary)}>
              {totalWatchTimeMinutes % 60} minutes additional
            </p>
          </CardContent>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Certificates Earned</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{completedCourses}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/certificates" className={cn("text-sm", colors.link, colors.linkHover)}>
              View certificates →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Learning by Category</CardTitle>
          <CardDescription className={colors.textMuted}>Your courses grouped by football position/category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = Math.round((stats.completed / stats.count) * 100)
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium capitalize", colors.text)}>
                        {category.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="outline" className={cn("text-xs", colors.badge, colors.badgeBorder, colors.badgeText)}>
                        {stats.count} {stats.count === 1 ? 'course' : 'courses'}
                      </Badge>
                    </div>
                    <span className={cn("text-sm", colors.textSecondary)}>
                      {stats.completed} / {stats.count} completed ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className={cn("h-2", colors.bgTertiary)} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Learning by Difficulty</CardTitle>
          <CardDescription className={colors.textMuted}>Your progress across different skill levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(difficultyStats).map(([difficulty, stats]) => {
              const percentage = Math.round((stats.completed / stats.count) * 100)
              const colors_difficulty = {
                beginner: 'bg-green-500/20 border-green-500/30',
                intermediate: 'bg-yellow-500/20 border-yellow-500/30',
                advanced: 'bg-red-500/20 border-red-500/30'
              }
              return (
                <Card key={difficulty} className={cn("border-2", colors_difficulty[difficulty as keyof typeof colors_difficulty] || cn(colors.card, colors.cardBorder))}>
                  <CardHeader>
                    <CardTitle className={cn("capitalize", colors.text)}>{difficulty}</CardTitle>
                    <CardDescription className={colors.textMuted}>{stats.count} courses enrolled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={cn("text-2xl font-bold mb-2", colors.text)}>{percentage}%</div>
                    <Progress value={percentage} className={cn("h-2", colors.bgTertiary)} />
                    <p className={cn("text-sm mt-2", colors.textSecondary)}>
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
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Recent Activity</CardTitle>
          <CardDescription className={colors.textMuted}>Your learning activity from the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProgress && recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress: any) => (
                <div key={progress.id} className={cn("flex items-start gap-4 pb-4 border-b last:border-0", colors.cardBorder)}>
                  <div className="flex-1">
                    <Link
                      href={`/courses/${progress.lessons?.courses?.slug}/lessons/${progress.lesson_id}`}
                      className={cn("font-medium", colors.text, colors.linkHover)}
                    >
                      {progress.lessons?.title}
                    </Link>
                    <p className={cn("text-sm", colors.textSecondary)}>
                      {progress.lessons?.courses?.title}
                    </p>
                    <p className={cn("text-xs mt-1", colors.textMuted)}>
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
                      <Badge className="bg-green-500/20 border-green-500/30 text-green-400">Completed</Badge>
                    ) : (
                      <Badge variant="outline" className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}>In Progress</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn("text-center py-8", colors.textSecondary)}>
              <p>No recent activity in the last 7 days</p>
              <Link href="/courses" className={cn("text-sm mt-2 inline-block", colors.link, colors.linkHover)}>
                Browse courses to get started
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Progress Details */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>All Courses Progress</CardTitle>
          <CardDescription className={colors.textMuted}>Detailed breakdown of your enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.courses?.slug}`}
                  className={cn("block p-4 rounded-lg border transition-colors", colors.cardBorder, colors.cardHover)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={cn("font-semibold mb-1", colors.text)}>{enrollment.courses?.title}</h3>
                      <div className={cn("flex items-center gap-3 text-sm mb-2", colors.textSecondary)}>
                        <Badge variant="outline" className={cn("text-xs", colors.badge, colors.badgeBorder, colors.badgeText)}>
                          {enrollment.courses?.category.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs", colors.badge, colors.badgeBorder, colors.badgeText)}>
                          {enrollment.courses?.difficulty_level}
                        </Badge>
                        <span>⏱️ {enrollment.courses?.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={enrollment.progress_percentage || 0} className={cn("h-2 flex-1", colors.bgTertiary)} />
                        <span className={cn("text-sm font-medium min-w-[45px]", colors.text)}>
                          {enrollment.progress_percentage || 0}%
                        </span>
                      </div>
                    </div>
                    {enrollment.completed_at && (
                      <Badge className="bg-green-500/20 border-green-500/30 text-green-400">✓ Completed</Badge>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className={cn("text-center py-8", colors.textSecondary)}>
                <p>No courses enrolled yet</p>
                <Link href="/courses" className={cn("text-sm mt-2 inline-block", colors.link, colors.linkHover)}>
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
