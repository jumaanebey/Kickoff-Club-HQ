'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface WeeklyActivity {
  day: string
  minutes: number
  lessons: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
  progress?: number
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  timeSpent: number
}

interface ProgressContentProps {
  stats: {
    totalWatchTime: number
    lessonsCompleted: number
    coursesCompleted: number
    currentStreak: number
    longestStreak: number
    averageSessionTime: number
  }
  weeklyActivity: WeeklyActivity[]
  achievements: Achievement[]
  courseProgress: CourseProgress[]
}

export function ProgressContent({ stats, weeklyActivity, achievements, courseProgress }: ProgressContentProps) {
  const { colors } = useTheme()
  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Your Progress</h1>
        <p className={colors.textSecondary}>Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Total Watch Time</CardDescription>
            <CardTitle className={cn("text-2xl", colors.text)}>
              {Math.floor(stats.totalWatchTime / 60)}h {stats.totalWatchTime % 60}m
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Lessons Completed</CardDescription>
            <CardTitle className={cn("text-2xl", colors.text)}>{stats.lessonsCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Courses Completed</CardDescription>
            <CardTitle className={cn("text-2xl", colors.text)}>{stats.coursesCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Current Streak</CardDescription>
            <CardTitle className={cn("text-2xl flex items-center gap-1", colors.text)}>
              <span>🔥</span>
              <span>{stats.currentStreak}</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Longest Streak</CardDescription>
            <CardTitle className={cn("text-2xl", colors.text)}>{stats.longestStreak} days</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Avg Session</CardDescription>
            <CardTitle className={cn("text-2xl", colors.text)}>{stats.averageSessionTime}m</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>This Week&apos;s Activity</CardTitle>
          <CardDescription className={colors.textMuted}>Your learning time over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyActivity.map((day) => (
              <div key={day.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-sm font-medium w-12", colors.text)}>{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className={cn("h-8 rounded-lg overflow-hidden", colors.bgTertiary)}>
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg transition-all"
                        style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-32">
                    <div className={cn("text-sm font-semibold", colors.text)}>{day.minutes} min</div>
                    <div className={cn("text-xs", colors.textMuted)}>{day.lessons} lessons</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm", colors.textSecondary)}>Weekly Total</p>
                <p className={cn("text-2xl font-bold", colors.text)}>
                  {weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} minutes
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-sm", colors.textSecondary)}>Lessons Completed</p>
                <p className={cn("text-2xl font-bold", colors.text)}>
                  {weeklyActivity.reduce((sum, day) => sum + day.lessons, 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-2xl font-bold", colors.text)}>Achievements</h2>
          <Badge variant="secondary" className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}>
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={achievement.unlocked ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30' : cn(colors.card, colors.cardBorder, 'opacity-60')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  {achievement.unlocked ? (
                    <Badge className="bg-green-500/20 border-green-500/30 text-green-400">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline" className={cn("bg-opacity-50", colors.badge, colors.badgeBorder, colors.textMuted)}>Locked</Badge>
                  )}
                </div>
                <CardTitle className={cn("text-lg", colors.text)}>{achievement.title}</CardTitle>
                <CardDescription className={colors.textMuted}>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {achievement.unlocked ? (
                  <p className={cn("text-xs", colors.textMuted)}>Unlocked {achievement.unlockedDate}</p>
                ) : (
                  <div>
                    <div className={cn("flex items-center justify-between text-xs mb-1", colors.textSecondary)}>
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className={cn("h-2", colors.bgTertiary)} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Course Progress Detail */}
      <div>
        <h2 className={cn("text-2xl font-bold mb-4", colors.text)}>Course Progress</h2>

        <div className="space-y-4">
          {courseProgress.map((course) => (
            <Card key={course.id} className={cn(colors.card, colors.cardBorder, colors.cardHover, "transition-colors")}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={cn("font-semibold text-lg mb-1", colors.text)}>{course.title}</h3>
                    <p className={cn("text-sm", colors.textSecondary)}>
                      {course.lessonsCompleted} of {course.totalLessons} lessons • {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m spent
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}>{course.progress}%</Badge>
                </div>

                <Progress value={course.progress} className={colors.bgTertiary} />

                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{course.lessonsCompleted}</p>
                    <p className={cn("text-xs", colors.textMuted)}>Completed</p>
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold", colors.textMuted)}>
                      {course.totalLessons - course.lessonsCompleted}
                    </p>
                    <p className={cn("text-xs", colors.textMuted)}>Remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-400">
                      {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m
                    </p>
                    <p className={cn("text-xs", colors.textMuted)}>Time Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Streak Info */}
      <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔥</div>
            <div>
              <CardTitle className={colors.text}>Keep Your Streak Going!</CardTitle>
              <CardDescription className={colors.textSecondary}>
                You&apos;re on a {stats.currentStreak}-day streak. Learn today to keep it alive!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  i < stats.currentStreak
                    ? 'bg-orange-500 text-white'
                    : cn(colors.bgTertiary, colors.textMuted)
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className={cn("text-xs mt-3", colors.textSecondary)}>
            {14 - stats.currentStreak} more days to unlock the &quot;Dedicated Student&quot; achievement!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
