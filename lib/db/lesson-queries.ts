import { supabase } from './supabase'

export interface LessonScriptSection {
  id: string
  title: string
  timestamp: string
  content: string
  on_screen?: string
  order_index: number
}

export interface LessonQuiz {
  id: string
  question: string
  options: string[]
  correct_index: number
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  video_id: string
  thumbnail_url?: string
  duration_seconds?: number
  order_index: number
  is_free: boolean
  is_published: boolean
  script_sections?: LessonScriptSection[]
  quiz?: LessonQuiz
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  watched: boolean
  watch_time_seconds: number
  completed_at?: string
  quiz_answered: boolean
  quiz_correct: boolean
}

// Get all lessons for a course
export async function getLessonsByCourseId(courseId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }

  return data as Lesson[]
}

// Get a single lesson with full details
export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  // First get the course ID
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single()

  if (!course) return null

  // Get lesson
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .eq('is_published', true)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return null
  }

  // Get script sections
  const { data: scriptSections } = await supabase
    .from('lesson_script_sections')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('order_index', { ascending: true })

  // Get quiz
  const { data: quiz } = await supabase
    .from('lesson_quizzes')
    .select('*')
    .eq('lesson_id', lesson.id)
    .single()

  return {
    ...lesson,
    script_sections: scriptSections || [],
    quiz: quiz || null
  } as Lesson & { script_sections: LessonScriptSection[], quiz: LessonQuiz | null }
}

// Get lesson by ID
export async function getLessonById(lessonId: string) {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return null
  }

  // Get script sections
  const { data: scriptSections } = await supabase
    .from('lesson_script_sections')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('order_index', { ascending: true })

  // Get quiz
  const { data: quiz } = await supabase
    .from('lesson_quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single()

  return {
    ...lesson,
    script_sections: scriptSections || [],
    quiz: quiz || null
  } as Lesson & { script_sections: LessonScriptSection[], quiz: LessonQuiz | null }
}

// Get user's progress for a lesson
export async function getUserLessonProgress(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error fetching lesson progress:', error)
    return null
  }

  return data as LessonProgress | null
}

// Update or create lesson progress
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  progress: Partial<LessonProgress>
) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      ...progress,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,lesson_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error updating lesson progress:', error)
    return null
  }

  return data as LessonProgress
}

// Mark lesson as watched
export async function markLessonWatched(userId: string, lessonId: string) {
  return updateLessonProgress(userId, lessonId, {
    watched: true,
    completed_at: new Date().toISOString()
  })
}

// Record quiz answer
export async function recordQuizAnswer(
  userId: string,
  lessonId: string,
  isCorrect: boolean
) {
  return updateLessonProgress(userId, lessonId, {
    quiz_answered: true,
    quiz_correct: isCorrect
  })
}

// Get all lessons with user progress
export async function getLessonsWithProgress(courseId: string, userId?: string) {
  const lessons = await getLessonsByCourseId(courseId)

  if (!userId) {
    return lessons.map(lesson => ({ ...lesson, progress: null }))
  }

  const lessonsWithProgress = await Promise.all(
    lessons.map(async (lesson) => {
      const progress = await getUserLessonProgress(userId, lesson.id)
      return { ...lesson, progress }
    })
  )

  return lessonsWithProgress
}

// Get next lesson in course
export async function getNextLesson(courseId: string, currentOrderIndex: number) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .gt('order_index', currentOrderIndex)
    .order('order_index', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data as Lesson
}

// Get previous lesson in course
export async function getPreviousLesson(courseId: string, currentOrderIndex: number) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .lt('order_index', currentOrderIndex)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data as Lesson
}
