// @ts-nocheck - TypeScript doesn't understand notFound() never returns
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getCourseBySlug } from "@/lib/db/queries"
import { getUser } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EnrollButton } from "@/components/enrollment/enroll-button"
import { SaveCourseButton } from "@/components/enrollment/save-course-button"
import { ReviewForm } from "@/components/reviews/review-form"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { getCourseReviews, getCourseRating } from "@/app/actions/reviews"
import { CourseStructuredData } from "@/components/seo/structured-data"

interface CoursePageProps {
  params: {
    slug: string
  }
  searchParams: {
    access?: string
    message?: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug).catch(() => null)

  if (!course) {
    return {
      title: "Course Not Found"
    }
  }

  const rating = await getCourseRating(course.id)

  return {
    title: course.title,
    description: course.description,
    keywords: [
      "football course",
      course.category.replace(/_/g, ' '),
      course.difficulty_level,
      course.tier_required,
      "online football training"
    ],
    openGraph: {
      title: course.title,
      description: course.description,
      type: "article",
      url: `https://kickoffclubhq.com/courses/${course.slug}`,
      images: [
        {
          url: course.thumbnail_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: course.title
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: [course.thumbnail_url || "/og-image.png"],
    },
    alternates: {
      canonical: `https://kickoffclubhq.com/courses/${course.slug}`
    }
  }
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const user = await getUser()
  const course = await getCourseBySlug(params.slug).catch(() => null)

  if (!course) notFound()

  // Check if user is enrolled and get subscription info
  let isEnrolled = false
  let userSubscription = null
  let hasAccess = false
  let hasCompleted = false

  if (user) {
    const { createServerClient } = await import('@/lib/db/supabase-server')
    const supabase = await createServerClient()

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, completed_at')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()

    isEnrolled = !!enrollment
    hasCompleted = !!enrollment?.completed_at

    // Get user's subscription info
    const { getUserSubscription } = await import('@/lib/subscription')
    userSubscription = await getUserSubscription(user.id)

    if (userSubscription) {
      hasAccess = userSubscription.canAccessCourse(course.tier_required)
    }
  }

  // Get reviews and ratings
  const reviews = await getCourseReviews(course.id)
  const rating = await getCourseRating(course.id)

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
    <div className="min-h-screen">
      <CourseStructuredData course={course} rating={rating} />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-500">Kickoff Club HQ</Link>
          <nav className="flex items-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/auth/sign-in">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Access Denied Alert */}
      {searchParams.access === 'denied' && searchParams.message && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container px-4 py-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
                <p className="text-sm text-yellow-700 mt-1">{decodeURIComponent(searchParams.message)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Hero */}
      <section className="relative py-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Link href="/courses" className="hover:text-primary-500">Courses</Link>
                <span>/</span>
                {/* @ts-ignore */}
                <span className="text-gray-900">{course.title}</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {/* @ts-ignore - TypeScript doesn't understand notFound() never returns */}
                <Badge variant={tierColors[course.tier_required]}>
                  {/* @ts-ignore */}
                  {course.tier_required.toUpperCase()}
                </Badge>
                {/* @ts-ignore - TypeScript doesn't understand notFound() never returns */}
                <Badge variant={difficultyColors[course.difficulty_level]}>
                  {/* @ts-ignore */}
                  {course.difficulty_level}
                </Badge>
                <Badge variant="outline">
                  {course.category.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{course.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{course.enrolled_count} students enrolled</span>
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

              {/* Instructor */}
              {course.instructor_name && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Instructor
                  </h3>
                  {course.instructor_slug ? (
                    <Link href={`/instructors/${course.instructor_slug}`} className="flex items-start gap-4 hover:opacity-90 transition-opacity group">
                      {course.instructor_avatar ? (
                        <img
                          src={course.instructor_avatar}
                          alt={course.instructor_name}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                          {course.instructor_name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-lg text-primary-600 group-hover:text-primary-700">
                          {course.instructor_name}
                        </div>
                        {course.instructor_bio && (
                          <p className="text-gray-600 mt-1">{course.instructor_bio}</p>
                        )}
                        <div className="text-sm text-primary-500 mt-2">View profile →</div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4">
                      {course.instructor_avatar ? (
                        <img
                          src={course.instructor_avatar}
                          alt={course.instructor_name}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                          {course.instructor_name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-lg">{course.instructor_name}</div>
                        {course.instructor_bio && (
                          <p className="text-gray-600 mt-1">{course.instructor_bio}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Enroll Card or Upgrade Prompt */}
            <div className="lg:col-span-1">
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
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Ready to Start?</CardTitle>
                    <CardDescription>
                      {course.tier_required === 'free'
                        ? 'This course is completely free!'
                        : `Requires ${course.tier_required} plan or higher`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!user ? (
                      <div className="space-y-2">
                        <Button asChild className="w-full" size="lg">
                          <Link href="/auth/sign-in">Sign in to enroll</Link>
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                          Don't have an account? <Link href="/auth/sign-up" className="text-primary-600 hover:underline">Sign up</Link>
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
                    <div className="space-y-2 text-sm text-gray-600 mt-4">
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
            <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>

            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((lesson, index) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                              </div>
                              <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            </div>
                            {lesson.description && (
                              <CardDescription className="ml-11">
                                {lesson.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>⏱️</span>
                            <span>{Math.floor(lesson.video_duration_seconds / 60)} min</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">Lessons Coming Soon</h3>
                  <p className="text-gray-600">
                    This course is being prepared. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">What You&apos;ll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-primary-500 text-xl">✓</span>
                <p>Master fundamental techniques and concepts</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 text-xl">✓</span>
                <p>Learn from expert coaches with years of experience</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 text-xl">✓</span>
                <p>Practice with real-world drills and exercises</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 text-xl">✓</span>
                <p>Track your progress and earn certificates</p>
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
              <h2 className="text-3xl font-bold mb-2">Reviews</h2>
              {rating.count > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl">
                        {i < Math.round(rating.average) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{rating.average}</span>
                  <span>({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</span>
                </div>
              )}
            </div>

            {/* Review Form */}
            {user && isEnrolled && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Leave a Review</CardTitle>
                  <CardDescription>
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
            <Card className="bg-primary-500 text-white border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                  Join {course.enrolled_count} other students learning {course.title}
                </p>
                <EnrollButton
                  courseId={course.id}
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
