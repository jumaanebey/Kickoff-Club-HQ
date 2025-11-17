'use client'

import { lazy, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/social/share-buttons'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

// Lazy load the heavy video player component
const EnhancedVideoPlayer = lazy(() => import('@/components/video/enhanced-video-player'))

interface LessonClientProps {
  lesson: any
  course: any
  hasAccess: boolean
  progress: any
  nextLesson: any
  previousLesson: any
  lessonForPlayer: any
  params: {
    slug: string
    lessonId: string
  }
}

export function LessonClient({
  lesson,
  course,
  hasAccess,
  progress,
  nextLesson,
  previousLesson,
  lessonForPlayer,
  params
}: LessonClientProps) {
  const { colors } = useTheme()

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/courses/${params.slug}`}
            className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {course.title}
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>{lesson.title}</h1>
              {lesson.description && (
                <p className={cn("text-lg", colors.textSecondary)}>{lesson.description}</p>
              )}
            </div>

            {progress?.watched && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full">
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
          <div className={cn("rounded-lg border p-8 text-center", colors.bgSecondary, colors.cardBorder)}>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>Premium Lesson</h2>
              <p className={cn("mb-6", colors.textSecondary)}>
                This lesson requires a premium subscription. Upgrade to access all course content.
              </p>
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/pricing">
                  Upgrade to Premium
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Player */}
            <Suspense
              fallback={
                <div className={cn("rounded-lg border p-12 text-center", colors.bgSecondary, colors.cardBorder)}>
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
                  <p className={cn("text-lg", colors.textSecondary)}>Loading video player...</p>
                </div>
              }
            >
              <EnhancedVideoPlayer lesson={lessonForPlayer} />
            </Suspense>

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
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
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
              <div className={cn("mt-8 rounded-lg border p-6", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold mb-4", colors.text)}>Lesson Details</h3>
                <div className={cn("flex flex-wrap gap-6 text-sm", colors.textSecondary)}>
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
