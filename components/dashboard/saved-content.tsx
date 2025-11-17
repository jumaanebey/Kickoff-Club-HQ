'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SaveCourseButton } from "@/components/enrollment/save-course-button"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface SavedCoursesContentProps {
  savedCourses: any[] | null
}

export function SavedCoursesContent({ savedCourses }: SavedCoursesContentProps) {
  const { colors } = useTheme()

  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30"
  } as const

  const tierColors = {
    free: cn(colors.badge, colors.badgeBorder, colors.badgeText),
    basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    premium: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  } as const

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Saved Courses</h1>
        <p className={colors.textSecondary}>Courses you've bookmarked for later</p>
      </div>

      {/* Saved Courses List */}
      {savedCourses && savedCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((saved: any) => {
            const course = saved.courses

            return (
              <Card key={saved.id} className={cn(colors.card, colors.cardBorder, colors.cardHover, "transition-colors")}>
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
                      <div className={cn("w-full h-48 rounded-t-lg flex items-center justify-center text-6xl", colors.bgTertiary)}>
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
                      <h3 className={cn("text-xl font-bold mb-2", colors.text, colors.linkHover)}>
                        {course.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className={cn("text-sm mb-4 line-clamp-2", colors.textSecondary)}>
                      {course.description}
                    </p>

                    {/* Meta Info */}
                    <div className={cn("flex items-center gap-4 text-sm mb-4", colors.textMuted)}>
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
        <Card className={cn(colors.card, colors.cardBorder, "text-center py-12")}>
          <CardContent>
            <div className="text-6xl mb-4">📚</div>
            <h3 className={cn("text-xl font-bold mb-2", colors.text)}>No saved courses yet</h3>
            <p className={cn("mb-6", colors.textSecondary)}>
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
