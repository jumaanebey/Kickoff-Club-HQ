// @ts-nocheck - Generated types may not match actual schema during build
import { supabase } from '../supabase'

// ========== ACHIEVEMENTS ==========

export async function getAllAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('id, name, description, icon, category, points_reward, achievement_type, criteria')
    .eq('is_active', true)
    .order('points_reward', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (
        id,
        name,
        description,
        icon,
        category,
        points_reward
      )
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function checkAndAwardAchievement(
  userId: string,
  achievementType: string
) {
  // Get achievement definition
  const { data: achievement, error: achError } = await supabase
    .from('achievements')
    .select('id, name, achievement_type, criteria, is_active')
    .eq('achievement_type', achievementType)
    .eq('is_active', true)
    .single()

  if (achError || !achievement) return null

  // Check if user already has this achievement
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievement.id)
    .single()

  if (existing) return null

  // Check if user meets criteria
  const criteria = achievement.criteria as any
  const meetsRequirement = await checkAchievementCriteria(userId, criteria)

  if (!meetsRequirement) return null

  // Award achievement
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
      progress: 100
    })
    .select(`
      *,
      achievements (*)
    `)
    .single()

  if (error) throw error
  return data
}

async function checkAchievementCriteria(userId: string, criteria: any) {
  if (!criteria) return true

  if (criteria.courses_completed) {
    const { count } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null)

    return (count || 0) >= criteria.courses_completed
  }

  if (criteria.lessons_watched) {
    const { count } = await supabase
      .from('user_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)

    return (count || 0) >= criteria.lessons_watched
  }

  if (criteria.quiz_score_average) {
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('score, max_score')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)

    if (!attempts || attempts.length === 0) return false

    const averagePercentage = attempts.reduce((sum, a) => {
      const percentage = a.max_score > 0 ? (a.score / a.max_score) * 100 : 0
      return sum + percentage
    }, 0) / attempts.length

    return averagePercentage >= criteria.quiz_score_average
  }

  return true
}

// ========== STREAKS ==========

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('id, user_id, current_streak, longest_streak, last_activity_date')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserStreak(userId: string) {
  const streak = await getUserStreak(userId)
  const today = new Date().toISOString().split('T')[0]

  if (!streak) {
    // Create new streak
    const { data, error } = await supabase
      .from('user_streaks')
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const lastActivity = streak.last_activity_date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastActivity === today) {
    // Already logged today, no update needed
    return streak
  } else if (lastActivity === yesterdayStr) {
    // Continuing streak
    const newStreak = streak.current_streak + 1
    const { data, error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_activity_date: today
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    // Check for streak achievements
    if (newStreak === 7) {
      await checkAndAwardAchievement(userId, 'week_streak')
    } else if (newStreak === 30) {
      await checkAndAwardAchievement(userId, 'month_streak')
    }

    return data
  } else {
    // Streak broken, reset to 1
    const { data, error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: 1,
        last_activity_date: today
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ========== RECOMMENDATIONS ==========

export async function getCourseRecommendations(userId: string, limit = 5) {
  // Get user's completed courses and enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, courses(category_id, difficulty_level)')
    .eq('user_id', userId)

  if (!enrollments || enrollments.length === 0) {
    // New user - recommend beginner courses
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructors(name, slug),
        course_categories(name, slug, icon)
      `)
      .eq('is_published', true)
      .eq('difficulty_level', 'beginner')
      .order('enrolled_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Get user's preferred categories
  const enrolledCourseIds = enrollments.map(e => e.course_id)
  const categories = enrollments
    .map(e => e.courses?.category_id)
    .filter(Boolean)

  // Recommend courses in same categories user hasn't enrolled in
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructors(name, slug),
      course_categories(name, slug, icon)
    `)
    .eq('is_published', true)
    .in('category_id', categories)
    .not('id', 'in', `(${enrolledCourseIds.join(',')})`)
    .order('enrolled_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getTotalUserPoints(userId: string) {
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select(`
      achievements(points_reward)
    `)
    .eq('user_id', userId)

  if (!achievements) return 0

  return achievements.reduce(
    (sum, a) => sum + (a.achievements?.points_reward || 0),
    0
  )
}
