import Link from "next/link"
import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/types/database.types"
import { cn } from "@/shared/utils"
import { useTheme } from "@/components/theme/theme-provider"

interface CourseCardProps {
  course: Course & {
    lessons?: Array<{
      id: string
      title: string
      description?: string
      duration_seconds: number
      is_free: boolean
    }>
  }
}

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400 border border-green-500/30",
  intermediate: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  advanced: "bg-red-500/20 text-red-400 border border-red-500/30"
} as const

const tierColors = {
  free: "bg-white/10 text-white/80 border border-white/20",
  basic: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  premium: "bg-purple-500/20 text-purple-400 border border-purple-500/30"
} as const

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  const { colors } = useTheme()
  const firstLesson = useMemo(() => course.lessons?.[0], [course.lessons])

  return (
    <Card className={cn("flex flex-col h-full backdrop-blur-xl border transition-all", colors.bgSecondary, colors.cardBorder, "hover:opacity-90")}>
      {/* Video Preview - Clickable Thumbnail */}
      {firstLesson ? (
        <Link href={`/courses/${course.slug}/lessons/${firstLesson.id}`} className="block relative h-48 bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-lg overflow-hidden group cursor-pointer">
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>

          {/* Lesson Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              {firstLesson.is_free && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">FREE</Badge>
              )}
              <span className="text-white/60 text-xs">{Math.floor(firstLesson.duration_seconds / 60)} min</span>
            </div>
            <h3 className="text-white font-bold text-sm line-clamp-1">{firstLesson.title}</h3>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty_level]}`}>
              {course.difficulty_level}
            </span>
            {course.tier_required !== 'free' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[course.tier_required]}`}>
                {course.tier_required}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-lg overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🏈
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty_level]}`}>
              {course.difficulty_level}
            </span>
            {course.tier_required !== 'free' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[course.tier_required]}`}>
                {course.tier_required}
              </span>
            )}
          </div>
        </div>
      )}

      <CardHeader>
        <div className={cn("text-sm mb-1 uppercase tracking-wider", colors.textMuted)}>
          {course.category.replace(/_/g, ' ')}
        </div>
        <CardTitle className={cn("line-clamp-2", colors.text)}>
          {course.title}
        </CardTitle>
        <CardDescription className={cn("line-clamp-2", colors.textSecondary)}>
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className={cn("flex items-center gap-4 text-sm", colors.textSecondary)}>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{course.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{course.enrolled_count} enrolled</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Link href={`/courses/${course.slug}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
})
