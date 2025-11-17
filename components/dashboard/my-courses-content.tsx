'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface CourseWithProgress {
  id: string
  course: any
  lessons: any[]
  completedCount: number
  totalLessons: number
  progress: number
  nextLesson: any
  isCompleted: boolean
}

interface MyCoursesContentProps {
  inProgressCourses: CourseWithProgress[]
  coursesWithProgress: CourseWithProgress[]
}

export function MyCoursesContent({ inProgressCourses, coursesWithProgress }: MyCoursesContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>My Courses</h1>
        <p className={colors.textSecondary}>Track your learning progress and continue where you left off</p>
      </div>

      {/* In Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-2xl font-bold", colors.text)}>In Progress ({inProgressCourses.length})</h2>
        </div>

        {inProgressCourses.length === 0 ? (
          <Card className={cn(colors.card, colors.cardBorder)}>
            <CardContent className="p-12 text-center">
              <p className={cn("mb-4", colors.textSecondary)}>You haven't started any courses yet</p>
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
                <Card key={enrollment.id} className={cn(colors.card, colors.cardBorder, colors.cardHover, "transition-colors")}>
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
                          <div className={cn("w-32 h-32 rounded-lg flex items-center justify-center text-5xl", colors.bgTertiary)}>
                            🏈
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className={cn("text-xl font-bold mb-1", colors.text)}>{course.title}</h3>
                            <p className={cn("text-sm", colors.textSecondary)}>
                              Instructor: {course.instructor_name}
                            </p>
                          </div>
                          <Badge variant="secondary" className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}>{enrollment.progress}%</Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className={colors.textSecondary}>
                              {enrollment.completedCount} of {enrollment.totalLessons} lessons completed
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className={colors.bgTertiary} />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {enrollment.nextLesson && (
                            <div className={cn("text-sm", colors.textSecondary)}>
                              <span className={cn("font-medium", colors.text)}>Next:</span> {enrollment.nextLesson.title}
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
                            <Button variant="outline" asChild className={cn(colors.badge, colors.badgeBorder, colors.badgeText, "hover:bg-opacity-80")}>
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
        <Card className={cn(colors.card, colors.cardBorder, "text-center py-12")}>
          <CardContent>
            <div className="text-6xl mb-4">📚</div>
            <h3 className={cn("text-xl font-bold mb-2", colors.text)}>No courses yet</h3>
            <p className={cn("mb-6", colors.textSecondary)}>
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
