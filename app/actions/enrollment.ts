'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/database/supabase/server'

/**
 * Server action to enroll a user in a course
 */
export async function enrollInCourse(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const courseId = formData.get('courseId') as string

    if (!courseId) {
      return {
        success: false,
        error: 'Missing course ID'
      }
    }

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error in enrollInCourse:', authError)
      return {
        success: false,
        error: 'You must be signed in to enroll in courses'
      }
    }

    console.log('Enrolling user:', user.id, 'in course:', courseId)

    // Get course details to check tier requirement
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, tier_required, title')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return {
        success: false,
        error: 'Course not found'
      }
    }

    // Get user's profile to check subscription tier
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        error: 'User profile not found'
      }
    }

    // Check if user's subscription tier allows access to this course
    const { hasAccessToTier, getAccessDeniedMessage } = await import('@/features/courses/access-control')

    if (!hasAccessToTier(profile.subscription_tier, course.tier_required)) {
      return {
        success: false,
        error: `Access denied. ${getAccessDeniedMessage(course.tier_required)}`,
        requiresUpgrade: true,
        requiredTier: course.tier_required
      }
    }

    // Check subscription status (optional - only for paid tiers)
    if (profile.subscription_tier !== 'free' && profile.subscription_status !== 'active') {
      return {
        success: false,
        error: 'Your subscription is not active. Please update your payment method to continue.'
      }
    }

    // Enroll user in course
    const { data: result, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress_percentage: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Enrollment database error:', error)
      throw error
    }

    if (!result) {
      return {
        success: false,
        error: 'Failed to enroll in course'
      }
    }

    // Revalidate relevant pages to show updated enrollment status
    revalidatePath('/dashboard/my-courses')
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return {
      success: true,
      message: 'Successfully enrolled in course!'
    }
  } catch (error) {
    console.error('Enrollment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Server action to unenroll a user from a course
 */
export async function unenrollFromCourse(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const courseId = formData.get('courseId') as string

    if (!courseId) {
      return {
        success: false,
        error: 'Missing course ID'
      }
    }

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Unenroll user from course
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId)

    if (error) {
      throw error
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/my-courses')
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return {
      success: true,
      message: 'Successfully unenrolled from course'
    }
  } catch (error) {
    console.error('Unenrollment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Server action to save a course for later
 */
export async function saveCourseForLater(formData: FormData) {
  try {
    const userId = formData.get('userId') as string
    const courseId = formData.get('courseId') as string

    if (!userId || !courseId) {
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    // TODO: Implement saved courses functionality
    // This would require a new table: saved_courses (user_id, course_id, saved_at)

    return {
      success: true,
      message: 'Course saved for later!'
    }
  } catch (error) {
    console.error('Save course error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
