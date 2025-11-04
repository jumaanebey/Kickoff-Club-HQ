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
    beginner: "bg-success-100 text-success-700",
    intermediate: "bg-warning-100 text-warning-700",
    advanced: "bg-destructive text-white"
  }

  const tierColors = {
    free: "bg-gray-100 text-gray-700",
    basic: "bg-primary-100 text-primary-700",
    premium: "bg-secondary-100 text-secondary-700"
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
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
        <div className="text-sm text-gray-500 mb-1">
          {course.category.replace(/_/g, ' ').toUpperCase()}
        </div>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 text-sm text-gray-600">
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
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              {course.instructor_avatar ? (
                <img
                  src={course.instructor_avatar}
                  alt={course.instructor_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                  {course.instructor_name[0]}
                </div>
              )}
              <div className="text-sm">
                <div className="font-medium">{course.instructor_name}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${course.slug}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
