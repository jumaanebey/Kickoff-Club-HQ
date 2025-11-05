'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/db/supabase-server'

/**
 * Server action to save a course for later
 * Note: This requires a saved_courses table in the database
 */
export async function saveCourse(formData: FormData) {
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

    // Save course (will create table if needed via RLS policies)
    const { error } = await supabase
      .from('saved_courses')
      .insert({
        user_id: user.id,
        course_id: courseId
      })

    if (error) {
      // If already saved, return success
      if (error.code === '23505') {
        return {
          success: true,
          message: 'Course already saved'
        }
      }
      throw error
    }

    revalidatePath('/dashboard/saved')
    revalidatePath('/courses')

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

/**
 * Server action to unsave a course
 */
export async function unsaveCourse(formData: FormData) {
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

    // Remove saved course
    const { error } = await supabase
      .from('saved_courses')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId)

    if (error) {
      throw error
    }

    revalidatePath('/dashboard/saved')
    revalidatePath('/courses')

    return {
      success: true,
      message: 'Course removed from saved'
    }
  } catch (error) {
    console.error('Unsave course error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Check if a course is saved by the user
 */
export async function isCourseSaved(userId: string, courseId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('saved_courses')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - that's fine
      console.error('Check saved error:', error)
    }

    return !!data
  } catch (error) {
    console.error('Check saved error:', error)
    return false
  }
}
