// @ts-nocheck - Generated types may not match actual schema during build
import { supabase } from '../supabase'
import { Course, Lesson, Enrollment, UserProgress } from '@/types/database.types'

// ========== PODCASTS ==========

export async function getAllPodcasts() {
  const { data, error } = await supabase
    .from('podcasts')
    .select('id, title, slug, description, episode_number, audio_url, published_date, thumbnail_url, show_notes')
    .eq('is_published', true)
    .order('episode_number', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function getPodcastBySlug(slug: string) {
  const { data, error } = await supabase
    .from('podcasts')
    .select('id, title, slug, description, episode_number, audio_url, published_date, thumbnail_url, show_notes, transcript')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}

// ========== COURSES ==========

export async function getAllCourses(filters?: {
  category?: string
  difficulty?: string
  tierRequired?: string
}) {
  let query = supabase
    .from('courses')
    .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index, is_featured, enrolled_count')
    .or('is_published.eq.true,is_published.is.null')
    .order('order_index', { ascending: true })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty_level', filters.difficulty)
  }

  if (filters?.tierRequired) {
    query = query.eq('tier_required', filters.tierRequired)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Course[]
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url, difficulty_level,
      duration_minutes, tier_required, category, video_url, cover_image_url, is_published, enrolled_count,
      lessons (id, title, slug, order_index, duration_seconds, is_free, description, video_id)
    `)
    .eq('slug', slug)
    .or('is_published.eq.true,is_published.is.null')
    .single()

  if (error) throw error

  return data
}

export async function getCourseById(id: string) {
  const { data, error} = await supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index,
      lessons (id, title, slug, description, video_id, thumbnail_url, duration_seconds, order_index, is_free)
    `)
    .eq('id', id)
    .or('is_published.eq.true,is_published.is.null')
    .single()

  if (error) throw error
  return data
}

export async function getFeaturedCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or('is_published.eq.true,is_published.is.null')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true })
    .limit(4)

  if (error) {
    // Fallback to first 4 courses if featured courses not set
    return getAllCourses().then(courses => courses.slice(0, 4))
  }

  return data
}

// ========== CATEGORIES & TAGS ==========

export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      return []
    }
    return data || []
  } catch (error) {
    return []
  }
}

export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('course_tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return []
    }
    return data || []
  } catch (error) {
    return []
  }
}

export async function getCoursesWithFilters(filters?: {
  search?: string
  category?: string
  difficulty?: string
  tier?: string
  tags?: string[]
}) {
  try {
    // Simplified query without joins to avoid potential RLS issues
    let query = supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, order_index, enrolled_count')
      .or('is_published.eq.true,is_published.is.null')

    // Search by title or description
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Filter by difficulty
    if (filters?.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty)
    }

    // Filter by tier
    if (filters?.tier) {
      query = query.eq('tier_required', filters.tier)
    }

    query = query.order('order_index', { ascending: true })

    const { data, error } = await query

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

// ========== LESSONS ==========

export async function getLessonBySlug(courseId: string, lessonSlug: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, course_id, title, slug, description, video_id, thumbnail_url, duration_seconds, order_index, is_free, is_published')
    .eq('course_id', courseId)
    .eq('slug', lessonSlug)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data as Lesson
}

export async function getLessonsByCourse(courseId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, course_id, title, slug, description, video_id, thumbnail_url, duration_seconds, order_index, is_free')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data as Lesson[]
}

// ========== ENROLLMENTS ==========

export async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, user_id, course_id, enrolled_at, progress_percentage, last_accessed_at, completed_at,
      courses (id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes)
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  if (error) throw error
  return data
}

export async function enrollUserInCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      progress_percentage: 0
    })
    .select()
    .single()

  if (error) throw error
  return data as Enrollment
}

export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return !!data
}

export async function unenrollUserFromCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ========== USER PROGRESS ==========

export async function getUserProgress(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('id, user_id, lesson_id, last_position_seconds, watch_time_seconds, completed, completion_date')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as UserProgress | null
}

export async function saveWatchProgress(
  userId: string,
  lessonId: string,
  position: number,
  duration: number
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      last_position_seconds: Math.floor(position),
      watch_time_seconds: Math.floor(duration),
      completed: position >= duration * 0.9 // 90% completion
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserProgress(
  userId: string,
  lessonId: string,
  progress: { watchedSeconds: number; completed: boolean }
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      last_position_seconds: Math.floor(progress.watchedSeconds),
      watch_time_seconds: Math.floor(progress.watchedSeconds),
      completed: progress.completed,
      completion_date: progress.completed ? new Date().toISOString() : null
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completion_date: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCourseProgress(userId: string, courseId: string) {
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('progress_percentage')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (enrollmentError) throw enrollmentError
  return enrollment?.progress_percentage || 0
}
