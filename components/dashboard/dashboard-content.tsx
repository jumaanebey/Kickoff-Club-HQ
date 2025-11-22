'use client'

import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface DashboardContentProps {
  stats: {
    coursesEnrolled: number
    lessonsCompleted: number
    watchTime: number
    currentStreak: number
  }
  recentCourses: Array<{
    id: string
    title: string
    progress: number
    lastWatched: string
    nextLesson: string
  }>
  gameStats?: {
    coins: number
    totalScore: number
  }
  achievements?: Array<{
    id: string
    name: string
    description: string
    badge_icon: string | null
    earned_at: string
  }>
}

export const DashboardContent = memo(function DashboardContent({ stats, recentCourses, gameStats, achievements }: DashboardContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Welcome back!</h1>
        <p className={colors.textMuted}>Here&apos;s what&apos;s happening with your learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Courses Enrolled</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>{stats.coursesEnrolled}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Lessons Completed</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>{stats.lessonsCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Total Coins</CardDescription>
            <CardTitle className={cn("text-3xl text-yellow-500")}>{gameStats?.coins || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Arcade Score</CardDescription>
            <CardTitle className={cn("text-3xl text-orange-500")}>{(gameStats?.totalScore || 0).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Trophy Room */}
      {achievements && achievements.length > 0 && (
        <div>
          <h2 className={cn("text-2xl font-bold mb-4", colors.text)}>Trophy Room</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={cn(colors.card, "border-yellow-500/20 bg-gradient-to-b from-yellow-500/5 to-transparent")}>
                <CardHeader className="p-4 text-center">
                  <div className="mx-auto bg-yellow-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <CardTitle className={cn("text-sm font-bold", colors.text)}>{achievement.name}</CardTitle>
                  <CardDescription className="text-xs">{achievement.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-2xl font-bold", colors.text)}>Continue Learning</h2>
          <Link href="/dashboard/my-courses" className={cn("text-sm", colors.link, colors.linkHover)}>
            View all courses
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentCourses.map((course) => (
            <Card key={course.id} className={cn(colors.card, colors.cardBorder, colors.cardHover, "transition-colors")}>
              <CardHeader>
                <CardTitle className={colors.text}>{course.title}</CardTitle>
                <CardDescription className={colors.textMuted}>Last watched {course.lastWatched}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={colors.textSecondary}>Progress</span>
                    <span className={cn("font-medium", colors.text)}>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className={colors.bgTertiary} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", colors.textSecondary)}>
                    Next: {course.nextLesson}
                  </span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">Continue</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
})
