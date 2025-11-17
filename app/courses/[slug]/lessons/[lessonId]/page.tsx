import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { getLessonById, getNextLesson, getPreviousLesson } from '@/database/queries/lessons'
import { LessonClient } from './lesson-client'

export const dynamic = 'force-dynamic'

// Create Supabase client for server component using anon key
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface LessonPageProps {
  params: {
    slug: string
    lessonId: string
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const supabase = getSupabase()

  const lesson = await getLessonById(params.lessonId)
  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('slug', params.slug)
    .single()

  if (!lesson || !course) {
    return {
      title: 'Lesson Not Found | Kickoff Club HQ',
    }
  }

  const title = `${lesson.title} - ${course.title} | Kickoff Club HQ`
  const description = lesson.description || `Learn ${lesson.title.toLowerCase()} in this comprehensive football training lesson.`
  const url = `https://kickoffclubhq.com/courses/${params.slug}/lessons/${params.lessonId}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'video.other',
      images: [
        {
          url: lesson.thumbnail_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: lesson.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [lesson.thumbnail_url || '/og-image.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = getSupabase()

  // Get lesson with full details
  const lesson = await getLessonById(params.lessonId)

  if (!lesson) {
    notFound()
  }

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', params.slug)
    .single()

  if (!course) {
    notFound()
  }

  // For now, allow access to all free lessons (authentication not set up yet)
  const hasAccess = lesson.is_free

  // User progress (disabled until auth is set up)
  const progress = null

  // Get next and previous lessons
  const nextLesson = await getNextLesson(course.id, lesson.order_index)
  const previousLesson = await getPreviousLesson(course.id, lesson.order_index)

  // Transform lesson data for video player
  const lessonForPlayer = {
    id: lesson.id,
    title: lesson.title,
    videoId: lesson.video_url || lesson.video_id, // Use video_url from database, fallback to video_id
    thumbnailUrl: lesson.thumbnail_url,
    script: {
      sections: lesson.script_sections?.map(s => ({
        title: s.title,
        timestamp: s.timestamp,
        content: s.content,
        onScreen: s.on_screen
      })) || []
    },
    quiz: lesson.quiz ? {
      question: lesson.quiz.question,
      options: lesson.quiz.options,
      correctIndex: lesson.quiz.correct_index
    } : undefined
  }

  return (
    <LessonClient
      lesson={lesson}
      course={course}
      hasAccess={hasAccess}
      progress={progress}
      nextLesson={nextLesson}
      previousLesson={previousLesson}
      lessonForPlayer={lessonForPlayer}
      params={params}
    />
  )
}
