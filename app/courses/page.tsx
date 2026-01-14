import CoursesClient from './courses-client'
import { createServerClient } from '@/database/supabase/server'

// Force dynamic rendering because we access user cookies
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh data

// Mock data for demo mode
const mockCourses = [
  {
    id: '1',
    title: 'Getting Started',
    slug: 'getting-started',
    description: 'Learn the absolute basics of football - from the field to the rules.',
    thumbnail_url: null,
    difficulty_level: 'beginner',
    duration_minutes: 45,
    tier_required: 'free',
    category: 'fundamentals',
    lessons: [
      { id: '1', title: 'What is Football?', duration_seconds: 300, is_free: true, order_index: 1 },
      { id: '2', title: 'The Field Explained', duration_seconds: 420, is_free: true, order_index: 2 },
      { id: '3', title: 'How Downs Work', duration_seconds: 360, is_free: true, order_index: 3 },
    ]
  },
  {
    id: '2',
    title: 'Understanding Positions',
    slug: 'understanding-positions',
    description: 'Meet all 22 players on the field and learn what each position does.',
    thumbnail_url: null,
    difficulty_level: 'beginner',
    duration_minutes: 60,
    tier_required: 'free',
    category: 'positions',
    lessons: [
      { id: '4', title: 'Offense Overview', duration_seconds: 480, is_free: true, order_index: 1 },
      { id: '5', title: 'Defense Overview', duration_seconds: 480, is_free: false, order_index: 2 },
    ]
  },
  {
    id: '3',
    title: 'Scoring & Penalties',
    slug: 'scoring-penalties',
    description: 'Learn how points are scored and what all those yellow flags mean.',
    thumbnail_url: null,
    difficulty_level: 'intermediate',
    duration_minutes: 50,
    tier_required: 'basic',
    category: 'rules',
    lessons: [
      { id: '6', title: 'Ways to Score', duration_seconds: 360, is_free: true, order_index: 1 },
      { id: '7', title: 'Common Penalties', duration_seconds: 420, is_free: false, order_index: 2 },
    ]
  },
  {
    id: '4',
    title: 'Reading Plays',
    slug: 'reading-plays',
    description: 'Start recognizing offensive and defensive formations like a pro.',
    thumbnail_url: null,
    difficulty_level: 'intermediate',
    duration_minutes: 75,
    tier_required: 'basic',
    category: 'strategy',
    lessons: [
      { id: '8', title: 'Basic Formations', duration_seconds: 540, is_free: false, order_index: 1 },
      { id: '9', title: 'Play Types', duration_seconds: 480, is_free: false, order_index: 2 },
    ]
  },
  {
    id: '5',
    title: 'Advanced Strategy',
    slug: 'advanced-strategy',
    description: 'Dive deep into play calling, clock management, and game theory.',
    thumbnail_url: null,
    difficulty_level: 'advanced',
    duration_minutes: 90,
    tier_required: 'premium',
    category: 'strategy',
    lessons: [
      { id: '10', title: 'Clock Management', duration_seconds: 600, is_free: false, order_index: 1 },
      { id: '11', title: 'Game Theory', duration_seconds: 720, is_free: false, order_index: 2 },
    ]
  },
]

export default async function CoursesPage() {
  const supabase = await createServerClient()

  // Use mock data if Supabase isn't configured
  if (!supabase) {
    return <CoursesClient courses={mockCourses} enrollments={[]} />
  }

  // Fetch courses on the server
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes, tier_required, category, is_published, instructor_name, instructor_bio, created_at, updated_at,
      lessons (id, title, duration_seconds, is_free, order_index)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .order('order_index', { foreignTable: 'lessons', ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
  }

  // Fetch user enrollments if logged in
  const { data: { user } } = await supabase.auth.getUser()
  let enrollments: any[] = []

  if (user) {
    const { data, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id, user_id, course_id, enrolled_at, progress_percentage, last_accessed_at, completed_at,
        courses (id, title, slug, description, thumbnail_url, difficulty_level, duration_minutes)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
    } else {
      enrollments = data || []
    }
  }

  // Ensure lessons is always an array
  const coursesWithLessons = (courses || []).map((course: any) => ({
    ...course,
    lessons: course.lessons || []
  }))

  return <CoursesClient courses={coursesWithLessons.length > 0 ? coursesWithLessons : mockCourses} enrollments={enrollments} />
}
