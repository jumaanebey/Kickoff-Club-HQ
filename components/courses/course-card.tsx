import Link from "next/link"
import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/types/database.types"
import { cn } from "@/shared/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { Play } from "lucide-react"

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
    <Card className={cn("flex flex-col h-full bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all group relative overflow-hidden", "hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xl hover:-translate-y-1")}>
      {/* "Ticket Stub" Cutouts */}
      <div className={cn("absolute top-1/2 -left-3 w-6 h-6 rounded-full z-10", colors.bg)}></div>
      <div className={cn("absolute top-1/2 -right-3 w-6 h-6 rounded-full z-10", colors.bg)}></div>

      {/* Video Preview - Clickable Thumbnail */}
      {firstLesson ? (
        <Link href={`/courses/${course.slug}/lessons/${firstLesson.id}`} className="block relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer">
          {/* Thumbnail Image or Placeholder */}
          {/* Thumbnail Image or Placeholder */}
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop"
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 grayscale group-hover:grayscale-0"
            />
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm">
              <Play className="w-6 h-6 text-orange-600 ml-1 fill-current" />
            </div>
          </div>

          {/* Lesson Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              {firstLesson.is_free && (
                <Badge className="bg-green-500 text-white border-0 text-[10px] font-bold px-1.5 py-0.5">FREE PREVIEW</Badge>
              )}
              <span className="text-white/80 text-xs font-mono">{Math.floor(firstLesson.duration_seconds / 60)}:00 MIN</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop"
            alt={course.title}
            className="w-full h-full object-cover opacity-50 grayscale"
          />
        </div>
      )}

      <CardHeader className="pb-2 relative">
        {/* Category Tag */}
        {course.category && (
          <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider transform rotate-2 shadow-sm border border-yellow-500">
            {course.category.replace(/_/g, ' ')}
          </div>
        )}

        <CardTitle className={cn("line-clamp-2 text-xl font-heading uppercase tracking-tight leading-none pt-2 group-hover:text-orange-600 transition-colors", colors.text)}>
          {course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-2 text-sm">
          {course.description}
        </CardDescription>

        {/* Difficulty & Tier Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider",
            course.difficulty_level === 'beginner' ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" :
              course.difficulty_level === 'intermediate' ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" :
                "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
          )}>
            {course.difficulty_level}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button asChild className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white transition-colors font-bold uppercase tracking-wide text-xs h-10">
          <Link href={firstLesson ? `/courses/${course.slug}/lessons/${firstLesson.id}` : `/courses/${course.slug}`}>
            {firstLesson ? 'Start Watching' : 'Open Playbook'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
})
