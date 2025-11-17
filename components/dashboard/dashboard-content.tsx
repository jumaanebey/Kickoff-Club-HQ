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
}

export const DashboardContent = memo(function DashboardContent({ stats, recentCourses }: DashboardContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-6">
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
            <CardDescription className={colors.textMuted}>Watch Time</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>{stats.watchTime}m</CardTitle>
          </CardHeader>
        </Card>

        <Card className={cn(colors.card, colors.cardHover, "transition-colors")}>
          <CardHeader className="pb-2">
            <CardDescription className={colors.textMuted}>Current Streak</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>{stats.currentStreak} days</CardTitle>
          </CardHeader>
        </Card>
      </div>

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

      {/* Recommended Courses */}
      <div>
        <h2 className={cn("text-2xl font-bold mb-4", colors.text)}>Recommended For You</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className={cn(colors.card, colors.cardBorder, colors.cardHover, "transition-colors")}>
              <CardHeader>
                <div className={cn("h-32 rounded-lg mb-3 flex items-center justify-center text-4xl", colors.bgTertiary)}>
                  🏈
                </div>
                <CardTitle className={cn("text-lg", colors.text)}>Sample Course {i}</CardTitle>
                <CardDescription className={colors.textMuted}>Learn the fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className={cn("w-full", colors.badge, colors.badgeBorder, colors.badgeText, "hover:bg-opacity-80")}>View Course</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
})
