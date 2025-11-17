'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, BookOpen, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/shared/utils"

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  rating: number
  reviewCount: number
  lessons: number
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  enrolled: number
  category: string
}

const featuredCourses: Course[] = [
  {
    id: "qb-fundamentals",
    title: "QB Fundamentals: Reading Defenses",
    description: "Master pre-snap reads, progressions, and decision-making that separates good QBs from great ones.",
    instructor: "Coach Mike Patterson",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800",
    rating: 4.8,
    reviewCount: 124,
    lessons: 15,
    duration: "2.5 hours",
    difficulty: "Beginner",
    enrolled: 1247,
    category: "Quarterback"
  },
  {
    id: "wr-route-running",
    title: "WR Route Running: Mastering Separation",
    description: "Learn pro-level route techniques, releases, and body control to consistently beat coverage.",
    instructor: "Coach Sarah Williams",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    rating: 4.9,
    reviewCount: 98,
    lessons: 12,
    duration: "2 hours",
    difficulty: "Intermediate",
    enrolled: 892,
    category: "Wide Receiver"
  },
  {
    id: "defensive-basics",
    title: "Defensive Basics: Tackling Techniques",
    description: "Perfect your tackling form, angles, and finishing to become a reliable defender who makes plays.",
    instructor: "Coach David Thompson",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800",
    rating: 4.7,
    reviewCount: 156,
    lessons: 18,
    duration: "3 hours",
    difficulty: "Beginner",
    enrolled: 1533,
    category: "Defense"
  },
  {
    id: "rb-vision",
    title: "RB Vision & Patience: Reading the Field",
    description: "Develop elite vision to find holes, make defenders miss, and maximize every carry.",
    instructor: "Coach James Rodriguez",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
    rating: 4.9,
    reviewCount: 87,
    lessons: 14,
    duration: "2.3 hours",
    difficulty: "Intermediate",
    enrolled: 743,
    category: "Running Back"
  }
]

const CourseCard = memo(function CourseCard({ course }: { course: Course }) {
  const { colors } = useTheme()

  // Memoize difficulty colors object
  const difficultyColors = useMemo(() => ({
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    Intermediate: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400"
  }), [])

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border",
      colors.bgSecondary,
      colors.cardBorder
    )}>
      {/* Thumbnail */}
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={difficultyColors[course.difficulty]}>
            {course.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            {course.category}
          </Badge>
        </div>
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
            <Image
              src={course.instructorAvatar}
              alt={course.instructor}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className={cn("text-sm font-medium", colors.text)}>{course.instructor}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(course.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className={cn("text-sm font-semibold", colors.text)}>{course.rating}</span>
          <span className={cn("text-sm", colors.textMuted)}>
            ({course.reviewCount} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={cn("flex items-center gap-2", colors.textMuted)}>
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className={cn("flex items-center gap-2", colors.textMuted)}>
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Enrolled count */}
        <div className={cn("flex items-center gap-2 text-sm mt-3", colors.textMuted)}>
          <Users className="w-4 h-4" />
          <span>{course.enrolled.toLocaleString()} enrolled</span>
        </div>
      </CardContent>

      <CardFooter className={cn("pt-4 border-t", colors.cardBorder)}>
        <Button asChild className="w-full" size="lg">
          <Link href={`/courses/${course.id}`}>
            Preview Free →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
})

export const FeaturedCoursesSection = memo(function FeaturedCoursesSection() {
  const { colors } = useTheme()

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
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="text-lg px-8">
            <Link href="/courses">
              View All 50+ Courses →
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
})
