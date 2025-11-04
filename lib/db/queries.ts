import { supabase } from './supabase'
import { Course, Lesson, Enrollment, UserProgress } from '@/types/database.types'

// ========== COURSES ==========

export async function getAllCourses(filters?: {
  category?: string
  difficulty?: string
  tierRequired?: string
}) {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
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
      *,
      lessons (*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (*)
    `)
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}

// ========== LESSONS ==========

export async function getLessonBySlug(courseId: string, lessonSlug: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
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
    .select('*')
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
      *,
      courses (*)
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

// ========== USER PROGRESS ==========

export async function getUserProgress(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
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
