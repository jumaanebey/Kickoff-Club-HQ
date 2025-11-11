import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import EnhancedVideoPlayer from '@/components/video/enhanced-video-player'
import { getLessonById, getNextLesson, getPreviousLesson, getUserLessonProgress } from '@/database/queries/lessons'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/social/share-buttons'

export const dynamic = 'force-dynamic'

interface LessonPageProps {
  params: {
    slug: string
    lessonId: string
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })

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
  const supabase = createServerComponentClient({ cookies })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

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

  // Check if user has access (free lesson or has subscription)
  let hasAccess = lesson.is_free

  if (!hasAccess && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single()

    hasAccess = profile?.subscription_status === 'active' && profile?.subscription_tier !== 'free'
  }

  // Get user progress
  const progress = user ? await getUserLessonProgress(user.id, lesson.id) : null

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/courses/${params.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {course.title}
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-gray-600 text-lg">{lesson.description}</p>
              )}
            </div>

            {progress?.watched && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Social Sharing */}
          <div className="mt-4">
            <ShareButtons
              url={`https://kickoffclubhq.com/courses/${params.slug}/lessons/${params.lessonId}`}
              title={`${lesson.title} - ${course.title}`}
              description={lesson.description || `Learn ${lesson.title.toLowerCase()} in this comprehensive football training lesson.`}
            />
          </div>
        </div>

        {/* Access Control */}
        {!hasAccess ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Lesson</h2>
              <p className="text-gray-600 mb-6">
                This lesson requires a premium subscription. Upgrade to access all course content.
              </p>
              <Button asChild size="lg">
                <Link href="/pricing">
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Player */}
            <EnhancedVideoPlayer lesson={lessonForPlayer} />

            {/* Lesson Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {previousLesson ? (
                <Button asChild variant="outline" size="lg">
                  <Link href={`/courses/${params.slug}/lessons/${previousLesson.id}`}>
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous: {previousLesson.title}
                  </Link>
                </Button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Button asChild size="lg">
                  <Link href={`/courses/${params.slug}/lessons/${nextLesson.id}`}>
                    Next: {nextLesson.title}
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline">
                  <Link href={`/courses/${params.slug}`}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Course
                  </Link>
                </Button>
              )}
            </div>

            {/* Additional Lesson Info */}
            {lesson.duration_seconds && (
              <div className="mt-8 bg-white rounded-lg border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Lesson Details</h3>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Duration:</span>
                    <span>
                      {Math.floor(lesson.duration_seconds / 60)}:{String(lesson.duration_seconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sections:</span>
                    <span>{lesson.script_sections?.length || 0}</span>
                  </div>
                  {lesson.quiz && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Quiz:</span>
                      <span>Yes</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
