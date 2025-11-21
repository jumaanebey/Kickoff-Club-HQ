// @ts-nocheck - TypeScript doesn't understand notFound() never returns
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnrollButton } from "@/components/enrollment/enroll-button"
import { SaveCourseButton } from "@/components/enrollment/save-course-button"
import { ReviewForm } from "@/components/reviews/review-form"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { ThemedHeader } from '@/components/layout/themed-header'
import { CourseStructuredData } from "@/components/seo/structured-data"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { SeasonMode } from '@/components/gamification/season-mode'
import { motion } from 'framer-motion'
import { Play, Clock, Users, BookOpen, Star, CheckCircle, Trophy, ArrowRight, Lock } from 'lucide-react'

interface CourseDetailClientProps {
  course: any
  user: any
  reviews: any[]
  rating: any
  isEnrolled: boolean
  userSubscription: any
  hasAccess: boolean
  hasCompleted: boolean
  searchParams: {
    access?: string
    message?: string
  }
}

export default function CourseDetailClient({
  course,
  user,
  reviews,
  rating,
  isEnrolled,
  userSubscription,
  hasAccess,
  hasCompleted,
  searchParams
}: CourseDetailClientProps) {
  const { colors } = useTheme()

  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    intermediate: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    advanced: "bg-red-500/10 text-red-500 border-red-500/20"
  } as const

  const firstLesson = course.lessons && course.lessons.length > 0 ? course.lessons[0] : null

  return (
    <div className={cn('min-h-screen bg-background transition-colors duration-300', colors.bg)}>
      <CourseStructuredData course={course} rating={rating} />
      <ThemedHeader activePage="courses" />

      {/* Access Denied Alert */}
      {searchParams.access === 'denied' && searchParams.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border-b border-red-500/20 backdrop-blur-sm sticky top-[72px] z-40"
        >
          <div className="container px-4 py-4 flex items-center gap-3 text-red-500">
            <Lock className="w-5 h-5" />
            <p className="font-medium">{decodeURIComponent(searchParams.message)}</p>
          </div>
        </motion.div>
      )}

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-mono uppercase tracking-wider">
              <Link href="/courses" className="hover:text-orange-500 transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-foreground font-bold">{course.title}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="outline" className={cn("uppercase tracking-wider px-3 py-1", difficultyColors[course.difficulty_level as keyof typeof difficultyColors])}>
                {course.difficulty_level}
              </Badge>
              {course.category && (
                <Badge variant="secondary" className="uppercase tracking-wider px-3 py-1">
                  {course.category.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>

            <h1 className={cn("text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight", colors.text)}>
              {course.title}
            </h1>
            <p className={cn("text-xl md:text-2xl leading-relaxed mb-8", colors.textSecondary)}>
              {course.description}
            </p>

            <div className="flex flex-wrap gap-8 p-6 rounded-2xl bg-card border border-border mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Duration</div>
                  <div className="font-bold">{course.duration_minutes} Minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Lessons</div>
                  <div className="font-bold">{course.lessons?.length || 0} Lessons</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Enrolled</div>
                  <div className="font-bold">{course.enrolled_count || 0} Students</div>
                </div>
              </div>
            </div>

            {/* Primary CTA - Direct to Lesson */}
            <div className="flex flex-col sm:flex-row gap-4">
              {firstLesson && (
                <Button asChild size="lg" className="h-14 text-lg px-8 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20">
                  <Link href={`/courses/${course.slug}/lessons/${firstLesson.id}`}>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Watching Now
                  </Link>
                </Button>
              )}
              {!isEnrolled && (
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  size="lg"
                  className="h-14 text-lg px-8"
                  variant="outline"
                />
              )}
            </div>
          </motion.div>

          {/* Sidebar / Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Video Preview Card */}
            <div className="relative group rounded-3xl overflow-hidden border-2 border-border bg-card shadow-2xl">
              {firstLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${firstLesson.id}`} className="block relative aspect-video bg-muted">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-orange-600 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-green-500 text-white border-0 mb-2">FREE PREVIEW</Badge>
                    <p className="text-white font-bold text-sm truncate">{firstLesson.title}</p>
                  </div>
                </Link>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop"
                    alt={course.title}
                    className="w-full h-full object-cover opacity-50 grayscale"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  What You'll Learn
                </h3>
                <ul className="space-y-3 mb-6">
                  {[
                    'Master fundamental techniques',
                    'Expert coaching drills',
                    'Game-situation analysis',
                    'Pro-level strategies'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {!isEnrolled && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      {course.tier_required === 'free' ? 'Free for everyone' : `Requires ${course.tier_required} plan`}
                    </p>
                    <Button asChild className="w-full" variant="secondary">
                      <Link href="/pricing">View Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Curriculum Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Course Curriculum</h2>
            <span className="text-muted-foreground font-mono text-sm">{course.lessons?.length || 0} LESSONS</span>
          </div>

          <div className="space-y-4">
            {course.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                  <div className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-orange-500 transition-colors">{lesson.title}</h3>
                        {lesson.is_free && <Badge variant="secondary" className="text-[10px] h-5">FREE</Badge>}
                        {lesson.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <span className="text-sm font-mono text-muted-foreground">{Math.floor(lesson.duration_seconds / 60)}:00</span>
                      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">Student Reviews</h2>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold">{rating?.average || 0}</span>
              <span className="text-sm opacity-80">({rating?.count || 0} reviews)</span>
            </div>
          </div>

          {user && isEnrolled && (
            <Card className="mb-12 border-dashed">
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>Help other students by rating this course</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm courseId={course.id} hasCompleted={hasCompleted} />
              </CardContent>
            </Card>
          )}

          <ReviewsList reviews={reviews} />
        </section>

      </main>
    </div>
  )
}
