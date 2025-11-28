import { createServerClient } from '@/database/supabase/server'

/**
 * Check if all lessons in a course are completed and update enrollment accordingly
 * @param userId - The user's ID
 * @param courseId - The course ID
 * @returns Whether the course was marked as completed
 */
export async function checkAndUpdateCourseCompletion(
  userId: string,
  courseId: string
): Promise<{ completed: boolean; message?: string }> {
  try {
    const supabase = await createServerClient()

    // Get all published lessons for the course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)
      .eq('is_published', true)

    if (lessonsError || !lessons || lessons.length === 0) {
      return { completed: false, message: 'No lessons found' }
    }

    // Get user's progress for all lessons
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .in('lesson_id', lessons.map(l => l.id))

    if (progressError) {
      return { completed: false, message: 'Error fetching progress' }
    }

    // Check if all lessons are completed
    const completedLessons = progress?.filter(p => p.completed) || []
    const allCompleted = completedLessons.length === lessons.length

    if (allCompleted) {
      // Mark course as completed
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({
          completed_at: new Date().toISOString(),
          progress_percentage: 100
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .is('completed_at', null) // Only update if not already completed

      if (updateError) {
        console.error('Error updating course completion:', updateError)
        return { completed: false, message: 'Error updating completion' }
      }

      // Award HQ Rewards
      try {
        let { data: hq } = await supabase
          .from('user_hq')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (!hq) {
          // Create default HQ if not exists
          const { data: newHq } = await supabase
            .from('user_hq')
            .insert({
              user_id: userId,
              coins: 2500,
              stadium_level: 1,
              film_room_level: 1,
              weight_room_level: 1,
              practice_field_level: 1,
              headquarters_level: 1
            })
            .select()
            .single()
          hq = newHq
        }

        if (hq) {
          const filmRoomLevel = hq.film_room_level || 1
          // Film Room gives XP multiplier: +5% per level above 1
          // Stadium gives Coin multiplier: +10% per level above 1 (implemented in games usually, but let's apply here too for fun)

          const xpMultiplier = 1 + ((filmRoomLevel - 1) * 0.05)
          const coinMultiplier = 1 + ((hq.stadium_level - 1) * 0.10)

          const baseCoins = 500
          const baseXp = 100

          const earnedCoins = Math.floor(baseCoins * coinMultiplier)
          const earnedXp = Math.floor(baseXp * xpMultiplier)

          await supabase
            .from('user_hq')
            .update({
              coins: (hq.coins || 0) + earnedCoins,
              xp: (hq.xp || 0) + earnedXp
            })
            .eq('user_id', userId)

          return { completed: true, message: `Course completed! +${earnedCoins} Coins, +${earnedXp} XP` }
        }
      } catch (rewardError) {
        console.error('Error awarding rewards:', rewardError)
        // Don't fail the completion if rewards fail
      }

      return { completed: true, message: 'Course completed!' }
    }

    // Update progress percentage
    const progressPercentage = Math.round((completedLessons.length / lessons.length) * 100)

    await supabase
      .from('enrollments')
      .update({ progress_percentage: progressPercentage })
      .eq('user_id', userId)
      .eq('course_id', courseId)

    return { completed: false }
  } catch (error) {
    console.error('Error checking course completion:', error)
    return { completed: false, message: 'Unexpected error' }
  }
}

/**
 * Get certificate data for a completed course
 * @param userId - The user's ID
 * @param courseId - The course ID
 * @returns Certificate data or null
 */
export async function getCertificateData(userId: string, courseId: string) {
  try {
    const supabase = await createServerClient()

    // Get enrollment with course details
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          title,
          instructor_name,
          category,
          difficulty_level
        ),
        profiles (
          name,
          email
        )
      `)
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .not('completed_at', 'is', null)
      .single()

    if (error || !enrollment) {
      return null
    }

    return {
      studentName: (enrollment as any).profiles.name || (enrollment as any).profiles.email,
      courseName: (enrollment as any).courses.title,
      instructor: (enrollment as any).courses.instructor_name,
      completionDate: new Date(enrollment.completed_at!).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      certificateId: `KCFC-${enrollment.id.split('-')[0].toUpperCase()}`,
      category: (enrollment as any).courses.category,
      level: (enrollment as any).courses.difficulty_level
    }
  } catch (error) {
    console.error('Error getting certificate data:', error)
    return null
  }
}
