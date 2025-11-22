import { NextResponse } from 'next/server'
import { getCourseBySlug } from "@/database/queries/courses"
import { getUser } from "@/app/actions/auth"
import { getCourseReviews, getCourseRating } from "@/app/actions/reviews"
import { createServerClient } from '@/database/supabase/server'
import { getUserSubscription } from '@/payments/subscriptions/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'how-downs-work'

  const results: any = {
    slug,
    steps: [],
    errors: []
  }

  try {
    // Step 1: Fetch course
    results.steps.push('Fetching course...')
    const course = await getCourseBySlug(slug)
    results.course = course ? { id: course.id, title: course.title } : null
    results.steps.push('Course fetched successfully')
  } catch (error: any) {
    results.errors.push({ step: 'getCourseBySlug', message: error.message, stack: error.stack })
    return NextResponse.json(results, { status: 500 })
  }

  try {
    // Step 2: Fetch user
    results.steps.push('Fetching user...')
    const user = await getUser()
    results.user = user ? { id: user.id, email: user.email } : null
    results.steps.push('User fetched successfully')
  } catch (error: any) {
    results.errors.push({ step: 'getUser', message: error.message, stack: error.stack })
  }

  try {
    // Step 3: Fetch reviews
    results.steps.push('Fetching reviews...')
    const reviews = await getCourseReviews(results.course?.id || '')
    results.reviewCount = reviews?.length || 0
    results.steps.push('Reviews fetched successfully')
  } catch (error: any) {
    results.errors.push({ step: 'getCourseReviews', message: error.message, stack: error.stack })
  }

  try {
    // Step 4: Fetch rating
    results.steps.push('Fetching rating...')
    const rating = await getCourseRating(results.course?.id || '')
    results.rating = rating
    results.steps.push('Rating fetched successfully')
  } catch (error: any) {
    results.errors.push({ step: 'getCourseRating', message: error.message, stack: error.stack })
  }

  // Step 5: If user exists, fetch enrollment and subscription
  if (results.user) {
    try {
      results.steps.push('Creating Supabase client...')
      const supabase = await createServerClient()
      results.steps.push('Supabase client created')

      results.steps.push('Fetching enrollment...')
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, completed_at')
        .eq('user_id', results.user.id)
        .eq('course_id', results.course?.id || '')
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        results.errors.push({ step: 'enrollment', message: enrollmentError.message })
      }
      results.enrollment = enrollment
      results.steps.push('Enrollment fetched')

      results.steps.push('Fetching subscription...')
      const subscription = await getUserSubscription(results.user.id)
      results.subscription = subscription ? { tier: subscription.tier } : null
      results.steps.push('Subscription fetched')
    } catch (error: any) {
      results.errors.push({ step: 'user-data', message: error.message, stack: error.stack })
    }
  }

  results.success = results.errors.length === 0

  return NextResponse.json(results)
}
