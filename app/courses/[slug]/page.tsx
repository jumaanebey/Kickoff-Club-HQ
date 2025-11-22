import { notFound } from "next/navigation"
import type { Metadata } from "next"
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

// Generate metadata for SEO
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug).catch(() => null)

  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  const rating = await getCourseRating(course.id).catch(() => ({ average: 0, count: 0 }))

  return {
    title: `${course.title} - Football Course`,
    description: course.description || `Learn ${course.title.toLowerCase()} with step-by-step video lessons. Perfect for beginners learning football basics.`,
    openGraph: {
      title: course.title,
      description: course.description || `Learn ${course.title.toLowerCase()} with step-by-step video lessons.`,
      type: 'website',
      url: `https://kickoffclubhq.com/courses/${course.slug}`,
      images: course.thumbnail_url ? [
        {
          url: course.thumbnail_url,
          width: 1200,
          height: 630,
          alt: course.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description || `Learn ${course.title.toLowerCase()} with step-by-step video lessons.`,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
    alternates: {
      canonical: `https://kickoffclubhq.com/courses/${course.slug}`,
    },
    other: {
      'course:rating': rating.average?.toFixed(1) || '0',
      'course:rating_count': rating.count?.toString() || '0',
      'course:difficulty': course.difficulty_level || 'beginner',
    },
  }
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  try {
    // Fetch course data
    const course = await getCourseBySlug(params.slug).catch(() => null)

    if (!course) {
      notFound()
    }

    // Fetch user data
    const user = await getUser().catch(() => null)

    // Fetch reviews and rating in parallel with error handling
    const [reviews, rating] = await Promise.all([
      getCourseReviews(course.id).catch(() => []),
      getCourseRating(course.id).catch(() => ({ average: 0, count: 0 }))
    ])

    // Initialize default values for authenticated user data
    let isEnrolled = false
    let hasCompleted = false
    let userSubscription = null
    let hasAccess = false

    // If user is authenticated, fetch enrollment and subscription data
    if (user) {
      try {
        const supabase = await createServerClient()

        const [enrollmentResult, userSub] = await Promise.all([
          supabase
            .from('enrollments')
            .select('id, completed_at')
            .eq('user_id', user.id)
            .eq('course_id', course.id)
            .single()
            .then(res => res)
            .catch(() => ({ data: null })),
          getUserSubscription(user.id).catch(() => null)
        ])

        const enrollment = enrollmentResult.data
        isEnrolled = !!enrollment
        hasCompleted = !!enrollment?.completed_at

        // Only pass serializable properties to client component (no functions)
        if (userSub) {
          userSubscription = { tier: userSub.tier, status: userSub.status }
          if (userSub.canAccessCourse) {
            hasAccess = userSub.canAccessCourse(course.tier_required)
          }
        }
      } catch (error) {
        // Silently handle user data fetch errors
        console.error('Error fetching user data:', error)
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
  } catch (error) {
    console.error('Course page error:', error)
    throw error
  }
}
