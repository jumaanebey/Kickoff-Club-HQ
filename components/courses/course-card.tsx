import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Course } from "@/types/database.types"
import { formatDuration } from "@/lib/utils"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-400 border border-green-500/30",
    intermediate: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    advanced: "bg-red-500/20 text-red-400 border border-red-500/30"
  }

  const tierColors = {
    free: "bg-white/10 text-white/80 border border-white/20",
    basic: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    premium: "bg-purple-500/20 text-purple-400 border border-purple-500/30"
  }

  return (
    <Card className="flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
      {/* Thumbnail */}
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

      <CardHeader>
        <div className="text-sm text-white/50 mb-1 uppercase tracking-wider">
          {course.category.replace(/_/g, ' ')}
        </div>
        <CardTitle className="line-clamp-2 text-white">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-white/60">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{course.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{course.enrolled_count} enrolled</span>
          </div>
        </div>

        {course.instructor_name && (
          <div className="mt-3 pt-3 border-t border-white/10">
            {course.instructor_slug ? (
              <Link href={`/instructors/${course.instructor_slug}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {course.instructor_avatar ? (
                  <img
                    src={course.instructor_avatar}
                    alt={course.instructor_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-medium border border-white/20">
                    {course.instructor_name[0]}
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-orange-400">{course.instructor_name}</div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {course.instructor_avatar ? (
                  <img
                    src={course.instructor_avatar}
                    alt={course.instructor_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-medium border border-white/20">
                    {course.instructor_name[0]}
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-white">{course.instructor_name}</div>
                </div>
              </div>
            )}
          </div>
        )}
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
}
