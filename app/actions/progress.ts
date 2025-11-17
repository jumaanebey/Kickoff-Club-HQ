'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/database/supabase/server'

/**
 * Server action to update video progress
 */
export async function updateVideoProgress(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const lessonId = formData.get('lessonId') as string
    const watchedSeconds = parseInt(formData.get('watchedSeconds') as string)
    const completed = formData.get('completed') === 'true'

    if (!lessonId || isNaN(watchedSeconds)) {
      return {
        success: false,
        error: 'Missing required fields'
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

    // Update user progress
    const { data: result, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        last_position_seconds: Math.floor(watchedSeconds),
        watch_time_seconds: Math.floor(watchedSeconds),
        completed: completed,
        completion_date: completed ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!result) {
      return {
        success: false,
        error: 'Failed to update progress'
      }
    }

    // Check if course is now completed
    if (completed) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('id', lessonId)
        .single()

      if (lesson) {
        const { checkAndUpdateCourseCompletion } = await import('@/features/courses/completion')
        const courseCompletion = await checkAndUpdateCourseCompletion(user.id, lesson.course_id)

        if (courseCompletion.completed) {
          revalidatePath('/dashboard')
          revalidatePath('/dashboard/my-courses')
          revalidatePath('/dashboard/progress')

          return {
            success: true,
            message: 'Congratulations! You completed the course!',
            courseCompleted: true
          }
        }
      }

      revalidatePath('/dashboard')
      revalidatePath('/dashboard/my-courses')
      revalidatePath('/dashboard/progress')
    }

    return {
      success: true,
      message: 'Progress updated'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Server action to mark a lesson as complete
 */
export async function markComplete(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const lessonId = formData.get('lessonId') as string

    if (!lessonId) {
      return {
        success: false,
        error: 'Missing lesson ID'
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

    // Mark lesson as complete
    const { data: result, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completion_date: new Date().toISOString(),
        last_position_seconds: 0,
        watch_time_seconds: 0
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!result) {
      return {
        success: false,
        error: 'Failed to mark lesson complete'
      }
    }

    // Check if course is now completed
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', lessonId)
      .single()

    if (lesson) {
      const { checkAndUpdateCourseCompletion } = await import('@/features/courses/completion')
      const courseCompletion = await checkAndUpdateCourseCompletion(user.id, lesson.course_id)

      if (courseCompletion.completed) {
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/my-courses')
        revalidatePath('/dashboard/progress')

        return {
          success: true,
          message: 'Congratulations! You completed the course!',
          courseCompleted: true
        }
      }
    }

    // Revalidate to show updated progress
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/my-courses')
    revalidatePath('/dashboard/progress')

    return {
      success: true,
      message: 'Lesson marked complete!'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
