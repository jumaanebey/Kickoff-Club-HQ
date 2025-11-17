import { notFound } from "next/navigation"
import { getCourseBySlug } from "@/database/queries/courses"
import { getUser } from "@/app/actions/auth"
import { getCourseReviews, getCourseRating } from "@/app/actions/reviews"
import { createServerClient } from '@/database/supabase/server'
import { getUserSubscription } from '@/payments/subscriptions/server'
import CourseDetailClient from './course-detail-client'

// Revalidate every hour
export const revalidate = 3600

interface CoursePageProps {
  params: {
    slug: string
  }
  searchParams: {
    access?: string
    message?: string
  }
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  // Fetch course data
  const course = await getCourseBySlug(params.slug).catch(() => null)

  if (!course) {
    notFound()
  }

  // Fetch user data
  const user = await getUser()

  // Fetch reviews and rating in parallel
  const [reviews, rating] = await Promise.all([
    getCourseReviews(course.id),
    getCourseRating(course.id)
  ])

  // Initialize default values for authenticated user data
  let isEnrolled = false
  let hasCompleted = false
  let userSubscription = null
  let hasAccess = false

  // If user is authenticated, fetch enrollment and subscription data
  if (user) {
    const supabase = await createServerClient()

    const [enrollmentResult, userSub] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, completed_at')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single(),
      getUserSubscription(user.id)
    ])

    const enrollment = enrollmentResult.data
    isEnrolled = !!enrollment
    hasCompleted = !!enrollment?.completed_at
    userSubscription = userSub

    if (userSub) {
      hasAccess = userSub.canAccessCourse(course.tier_required)
    }
  }

  return (
    <CourseDetailClient
      course={course}
      user={user}
      reviews={reviews}
      rating={rating}
      isEnrolled={isEnrolled}
      userSubscription={userSubscription}
      hasAccess={hasAccess}
      hasCompleted={hasCompleted}
      searchParams={searchParams}
    />
  )
}
