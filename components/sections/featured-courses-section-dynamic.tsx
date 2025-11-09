'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, BookOpen, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"
import { getFeaturedCourses } from "@/lib/db/queries"

interface Course {
  id: string
  title: string
  description: string
  slug: string
  instructor_name?: string
  instructor_avatar?: string
  thumbnail_url?: string
  difficulty_level: "beginner" | "intermediate" | "advanced"
  category?: string
}

function CourseCard({ course }: { course: Course }) {
  const { colors } = useTheme()

  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    intermediate: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    advanced: "bg-red-500/10 text-red-700 dark:text-red-400"
  }

  // Fallback thumbnail if none exists
  const thumbnailUrl = course.thumbnail_url || "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800"
  const instructorAvatar = course.instructor_avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border",
      colors.bgSecondary,
      colors.cardBorder
    )}>
      {/* Thumbnail */}
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={difficultyColors[course.difficulty_level]}>
            {course.difficulty_level}
          </Badge>
        </div>
        {course.category && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              {course.category}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <h3 className={cn("text-xl font-bold line-clamp-2 leading-tight", colors.text)}>
          {course.title}
        </h3>
        <p className={cn("text-sm line-clamp-2 mt-2", colors.textMuted)}>
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="pb-3 flex-grow">
        {/* Instructor */}
        {course.instructor_name && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
              <Image
                src={instructorAvatar}
                alt={course.instructor_name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className={cn("text-sm font-medium", colors.text)}>{course.instructor_name}</p>
            </div>
          </div>
        )}

        {/* Rating - You can add this to your DB later */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className={cn("text-sm font-semibold", colors.text)}>4.8</span>
          <span className={cn("text-sm", colors.textMuted)}>
            (124 reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={cn("flex items-center gap-2", colors.textMuted)}>
            <BookOpen className="w-4 h-4" />
            <span>15 lessons</span>
          </div>
          <div className={cn("flex items-center gap-2", colors.textMuted)}>
            <Clock className="w-4 h-4" />
            <span>2.5 hours</span>
          </div>
        </div>

        {/* Enrolled count */}
        <div className={cn("flex items-center gap-2 text-sm mt-3", colors.textMuted)}>
          <Users className="w-4 h-4" />
          <span>1,247 enrolled</span>
        </div>
      </CardContent>

      <CardFooter className={cn("pt-4 border-t", colors.cardBorder)}>
        <Button asChild className="w-full" size="lg">
          <Link href={`/courses/${course.slug}`}>
            Preview Free →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function FeaturedCoursesSection() {
  const { colors } = useTheme()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedCourses() {
      try {
        // Get featured courses (sorted by featured_order)
        // Falls back to first 4 courses if no featured courses are set
        const featured = await getFeaturedCourses()

        setCourses(featured)
      } catch (error) {
        console.error('Error loading featured courses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedCourses()
  }, [])

  if (loading) {
    return (
      <section className={cn("py-24", colors.bg)}>
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
              Featured Courses
            </h2>
            <p className={cn("text-xl", colors.textMuted)}>
              Loading...
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-24", colors.bg)}>
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
            Featured Courses
          </h2>
          <p className={cn("text-xl", colors.textMuted)}>
            Start with these fan-favorite courses from our championship coaches.
            Master the fundamentals and elevate your game.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="text-lg px-8">
            <Link href="/courses">
              View All Courses →
            </Link>
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className={cn("text-center p-6 rounded-lg", colors.bgSecondary)}>
            <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
            <div className={cn("text-sm", colors.textMuted)}>Video Courses</div>
          </div>
          <div className={cn("text-center p-6 rounded-lg", colors.bgSecondary)}>
            <div className="text-3xl font-bold text-orange-500 mb-2">10,000+</div>
            <div className={cn("text-sm", colors.textMuted)}>Active Students</div>
          </div>
          <div className={cn("text-center p-6 rounded-lg", colors.bgSecondary)}>
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
            <div className={cn("text-sm", colors.textMuted)}>Average Rating</div>
          </div>
          <div className={cn("text-center p-6 rounded-lg", colors.bgSecondary)}>
            <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
            <div className={cn("text-sm", colors.textMuted)}>Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
