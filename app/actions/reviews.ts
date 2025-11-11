'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/database/supabase/server'

/**
 * Server action to create a course review
 */
export async function createReview(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const courseId = formData.get('courseId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string

    if (!courseId || !rating) {
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5'
      }
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Check if user has completed the course
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (!enrollment?.completed_at) {
      return {
        success: false,
        error: 'You must complete the course before reviewing it'
      }
    }

    // Create review
    const { error } = await supabase
      .from('course_reviews')
      .insert({
        user_id: user.id,
        course_id: courseId,
        rating,
        comment: comment || null
      })

    if (error) {
      // Handle duplicate review
      if (error.code === '23505') {
        return {
          success: false,
          error: 'You have already reviewed this course'
        }
      }
      throw error
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/courses')

    return {
      success: true,
      message: 'Review submitted successfully!'
    }
  } catch (error) {
    console.error('Review error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Get reviews for a course
 */
export async function getCourseReviews(courseId: string) {
  try {
    const supabase = await createServerClient()

    const { data: reviews, error } = await supabase
      .from('course_reviews')
      .select(`
        *,
        profiles (
          name,
          email,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return reviews || []
  } catch (error) {
    console.error('Get reviews error:', error)
    return []
  }
}

/**
 * Get average rating for a course
 */
export async function getCourseRating(courseId: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('course_reviews')
      .select('rating')
      .eq('course_id', courseId)

    if (error) throw error

    if (!data || data.length === 0) {
      return { average: 0, count: 0 }
    }

    const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length

    return {
      average: Math.round(average * 10) / 10,
      count: data.length
    }
  } catch (error) {
    console.error('Get rating error:', error)
    return { average: 0, count: 0 }
  }
}
