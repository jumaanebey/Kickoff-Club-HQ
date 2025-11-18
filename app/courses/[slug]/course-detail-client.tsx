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
    beginner: "success",
    intermediate: "warning",
    advanced: "destructive"
  } as const

  const tierColors = {
    free: "outline",
    basic: "default",
    premium: "secondary"
  } as const

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <CourseStructuredData course={course} rating={rating} />
      {/* Header */}
      <ThemedHeader activePage="courses" />

      {/* Access Denied Alert */}
      {searchParams.access === 'denied' && searchParams.message && (
        <div className="bg-orange-500/10 border-b border-orange-500/20">
          <div className="container px-4 py-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-300">Access Restricted</h3>
                <p className="text-sm text-orange-400/80 mt-1">{decodeURIComponent(searchParams.message)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Hero */}
      <section className="relative py-12 bg-gradient-to-br from-white/5 to-white/10">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className={cn("flex items-center gap-2 text-sm mb-4", colors.textMuted)}>
                <Link href="/courses" className="hover:text-orange-400">Courses</Link>
                <span>/</span>
                {/* @ts-ignore */}
                <span className={colors.text}>{course.title}</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {course.tier_required && (
                  <Badge variant={tierColors[course.tier_required] || 'outline'}>
                    {course.tier_required.toUpperCase()}
                  </Badge>
                )}
                {course.difficulty_level && (
                  <Badge variant={difficultyColors[course.difficulty_level] || 'default'}>
                    {course.difficulty_level}
                  </Badge>
                )}
                {course.category && (
                  <Badge variant="outline">
                    {course.category.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
                {course.title}
              </h1>
              <p className={cn("text-lg mb-6", colors.textSecondary)}>
                {course.description}
              </p>

              {/* Stats */}
              <div className={cn("flex flex-wrap gap-6 text-sm", colors.textMuted)}>
                {course.duration_minutes && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{course.duration_minutes} minutes</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{course.enrolled_count || 0} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
                {rating.count > 0 && (
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>{rating.average} ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Video Preview & Enroll Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Preview Video */}
              {course.lessons && course.lessons.length > 0 && (
                <Link href={`/courses/${course.slug}/lessons/${course.lessons[0].id}`} className="block">
                  <div className={cn("relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-600/20 to-orange-800/20 border group cursor-pointer", colors.cardBorder)}>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all">
                      <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    {/* Lesson Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PREVIEW</Badge>
                        {course.lessons[0].duration_seconds && (
                          <span className={cn("text-sm", colors.textMuted)}>{Math.floor(course.lessons[0].duration_seconds / 60)} min</span>
                        )}
                      </div>
                      <h3 className={cn("font-bold text-xl", colors.text)}>{course.lessons[0].title}</h3>
                      <p className={cn("text-sm", colors.textMuted)}>{course.lessons[0].description || 'Click to watch the first lesson'}</p>
                    </div>
                  </div>
                </Link>
              )}

              {user && !hasAccess && userSubscription ? (
                // Show upgrade prompt if user doesn't have access
                <div className="sticky top-20">
                  {(() => {
                    const { UpgradePrompt } = require('@/components/subscription/upgrade-prompt')
                    return (
                      <UpgradePrompt
                        requiredTier={course.tier_required}
                        currentTier={userSubscription.tier}
                        courseName={course.title}
                      />
                    )
                  })()}
                </div>
              ) : (
                // Show enroll card if user has access or not logged in
                <Card className="sticky top-20 bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className={cn(colors.text)}>Ready to Start?</CardTitle>
                    <CardDescription className={cn(colors.textMuted)}>
                      {course.tier_required === 'free'
                        ? 'This course is completely free!'
                        : `Requires ${course.tier_required} plan or higher`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!user ? (
                      <div className="space-y-2">
                        <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                          <Link href="/auth/sign-in">Sign in to enroll</Link>
                        </Button>
                        <p className={cn("text-xs text-center", colors.textMuted)}>
                          Don't have an account? <Link href="/auth/sign-up" className="text-orange-400 hover:text-orange-500">Sign up</Link>
                        </p>
                      </div>
                    ) : (
                      <>
                        <EnrollButton
                          courseId={course.id}
                          isEnrolled={isEnrolled}
                          className="w-full mb-2"
                          size="lg"
                        />
                        <SaveCourseButton
                          courseId={course.id}
                          className="w-full mb-4"
                          size="default"
                        />
                      </>
                    )}
                    <div className={cn("space-y-2 text-sm mt-4", colors.textMuted)}>
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Watch on any device</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl">
            <h2 className={cn("text-3xl font-bold mb-6", colors.text)}>Course Curriculum</h2>

            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((lesson, index) => (
                    <Link key={lesson.id} href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                      <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-semibold text-sm border border-orange-500/30 group-hover:bg-orange-500/30 transition-all">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CardTitle className={cn("text-lg group-hover:text-orange-400 transition-colors", colors.text)}>{lesson.title}</CardTitle>
                                    {lesson.is_free && (
                                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">FREE</Badge>
                                    )}
                                  </div>
                                  {lesson.description && (
                                    <CardDescription className={cn("text-sm", colors.textMuted)}>
                                      {lesson.description}
                                    </CardDescription>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {lesson.duration_seconds && (
                                <div className={cn("flex items-center gap-2 text-sm", colors.textMuted)}>
                                  <span>⏱️</span>
                                  <span>{Math.floor(lesson.duration_seconds / 60)} min</span>
                                </div>
                              )}
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                Watch Now
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            ) : (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className={cn("text-xl font-semibold mb-2", colors.text)}>Lessons Coming Soon</h3>
                  <p className={cn(colors.textMuted)}>
                    This course is being prepared. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 bg-white/5">
        <div className="container px-4">
          <div className="max-w-4xl">
            <h2 className={cn("text-3xl font-bold mb-6", colors.text)}>What You&apos;ll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-orange-400 text-xl">✓</span>
                <p className={cn(colors.textSecondary)}>Master fundamental techniques and concepts</p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 text-xl">✓</span>
                <p className={cn(colors.textSecondary)}>Learn from expert coaches with years of experience</p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 text-xl">✓</span>
                <p className={cn(colors.textSecondary)}>Practice with real-world drills and exercises</p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 text-xl">✓</span>
                <p className={cn(colors.textSecondary)}>Track your progress and earn certificates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className={cn("text-3xl font-bold mb-2", colors.text)}>Reviews</h2>
              {rating.count > 0 && (
                <div className={cn("flex items-center gap-2", colors.textMuted)}>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl">
                        {i < Math.round(rating.average) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className={cn("text-lg font-semibold", colors.text)}>{rating.average}</span>
                  <span>({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</span>
                </div>
              )}
            </div>

            {/* Review Form */}
            {user && isEnrolled && (
              <Card className="mb-8 bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className={cn(colors.text)}>Leave a Review</CardTitle>
                  <CardDescription className={cn(colors.textMuted)}>
                    {hasCompleted
                      ? 'Share your experience with this course'
                      : 'Complete the course to leave a review'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewForm courseId={course.id} hasCompleted={hasCompleted} />
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <ReviewsList reviews={reviews} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl">
            <Card className="bg-orange-500 text-white border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Join {course.enrolled_count || 0} other students learning {course.title}
                </p>
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  variant="secondary"
                  size="lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
