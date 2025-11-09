// @ts-nocheck - Generated types may not match actual schema during build
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
      lessons (*),
      instructors (
        id,
        name,
        slug,
        bio,
        credentials,
        profile_image_url
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) throw error

  // Flatten instructor data for easier access
  if (data && data.instructors) {
    data.instructor_name = data.instructors.name
    data.instructor_avatar = data.instructors.profile_image_url
    data.instructor_bio = data.instructors.bio
    data.instructor_slug = data.instructors.slug
  }

  return data
}

export async function getCourseById(id: string) {
  const { data, error} = await supabase
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

export async function getFeaturedCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructors (
        id,
        name,
        slug,
        bio,
        credentials,
        profile_image_url
      )
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('featured_order', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Error fetching featured courses:', error)
    // Fallback to first 4 courses if featured courses not set
    return getAllCourses().then(courses => courses.slice(0, 4))
  }

  // Flatten instructor data for easier access
  const coursesWithInstructor = data.map(course => {
    if (course.instructors) {
      return {
        ...course,
        instructor_name: course.instructors.name,
        instructor_avatar: course.instructors.profile_image_url,
        instructor_bio: course.instructors.bio,
        instructor_slug: course.instructors.slug
      }
    }
    return course
  })

  return coursesWithInstructor
}

// ========== CATEGORIES & TAGS ==========

export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching categories:', error)
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
      console.error('Error fetching tags:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching tags:', error)
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
    let query = supabase
      .from('courses')
      .select(`
        *,
        course_categories(name, slug, icon),
        instructors(name, slug, profile_image_url),
        lessons(id, title, slug, description, duration_seconds, order_index, is_free)
      `)
      .eq('is_published', true)

    // Search by title or description
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Filter by category slug
    if (filters?.category) {
      const { data: cat } = await supabase
        .from('course_categories')
        .select('id')
        .eq('slug', filters.category)
        .single()

      if (cat) {
        query = query.eq('category_id', cat.id)
      }
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
      console.error('Error fetching courses:', error)
      return []
    }

    // Filter by tags if provided (done client-side due to junction table)
    let courses = data || []

    if (filters?.tags && filters.tags.length > 0) {
      const { data: tagData } = await supabase
        .from('course_tag_relationships')
        .select(`
          course_id,
          course_tags!inner(slug)
        `)
        .in('course_tags.slug', filters.tags)

      if (tagData) {
        const courseIds = tagData.map(t => t.course_id)
        courses = courses.filter(c => courseIds.includes(c.id))
      }
    }

    // Flatten instructor data for easier access in course cards
    courses = courses.map(course => {
      if (course.instructors) {
        course.instructor_name = course.instructors.name
        course.instructor_avatar = course.instructors.profile_image_url
        course.instructor_slug = course.instructors.slug
      }
      return course
    })

    return courses
  } catch (error) {
    console.error('Exception fetching courses with filters:', error)
    return []
  }
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
