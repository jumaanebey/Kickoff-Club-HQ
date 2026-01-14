'use client'

import { lazy, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Loader2, PlayCircle, Clock, FileText } from 'lucide-react'
import { ShareButtons } from '@/components/social/share-buttons'

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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/courses/${params.slug}`}
            className="inline-flex items-center text-sm font-bold uppercase text-gray-500 hover:text-orange-500 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to {course.title}
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading uppercase mb-3 text-gray-900">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-lg max-w-3xl text-gray-600 leading-relaxed">{lesson.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {progress?.watched && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">Completed</span>
                </div>
              )}
              <ShareButtons
                url={`https://kickoffclubhq.com/courses/${params.slug}/lessons/${params.lessonId}`}
                title={`${lesson.title} - ${course.title}`}
                description={lesson.description || `Learn ${lesson.title.toLowerCase()} in this comprehensive football training lesson.`}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Access Control */}
          {!hasAccess ? (
            <div className="relative bg-white border-2 border-gray-300 p-12 text-center flex-1 flex flex-col items-center justify-center">
              <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-gray-900 -z-10" />
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-500 text-white flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className="text-3xl font-heading uppercase mb-3 text-gray-900">Premium Lesson</h2>
                <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                  This lesson requires a premium subscription. Upgrade today to unlock this video and access all course content.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Video Player Container */}
              <div className="relative border-2 border-gray-300 overflow-hidden bg-black aspect-video">
                <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                      <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                      <p className="text-white/60 font-medium">Loading player...</p>
                    </div>
                  }
                >
                  <EnhancedVideoPlayer lesson={lessonForPlayer} />
                </Suspense>
              </div>

              {/* Lesson Meta & Navigation */}
              <div className="mt-8 grid lg:grid-cols-3 gap-8">
                {/* Meta Info */}
                <div className="lg:col-span-1 relative bg-white border-2 border-gray-300 p-6 h-fit">
                  <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10" />
                  <h3 className="font-heading text-lg uppercase text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Lesson Details
                  </h3>
                  <div className="space-y-4">
                    {lesson.duration_seconds && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 uppercase font-bold text-xs">Duration</span>
                        <span className="font-heading text-gray-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          {Math.floor(lesson.duration_seconds / 60)}:{String(lesson.duration_seconds % 60).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 uppercase font-bold text-xs">Sections</span>
                      <span className="font-heading text-gray-900">{lesson.script_sections?.length || 0}</span>
                    </div>
                    {lesson.quiz && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 uppercase font-bold text-xs">Quiz</span>
                        <span className="text-emerald-500 font-bold">Available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-4">
                  <div className="flex items-center justify-between gap-4">
                    {previousLesson ? (
                      <Link
                        href={`/courses/${params.slug}/lessons/${previousLesson.id}`}
                        className="flex-1 flex items-center bg-white border-2 border-gray-300 px-4 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-900 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <div className="text-left">
                          <div className="text-xs text-gray-500 uppercase font-bold">Previous</div>
                          <div className="font-heading text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{previousLesson.title}</div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {nextLesson ? (
                      <Link
                        href={`/courses/${params.slug}/lessons/${nextLesson.id}`}
                        className="flex-1 flex items-center justify-end bg-orange-500 text-white px-4 py-4 hover:bg-orange-600 transition-colors group"
                      >
                        <div className="text-right">
                          <div className="text-xs text-white/80 uppercase font-bold">Next Lesson</div>
                          <div className="font-heading truncate max-w-[120px] sm:max-w-[200px]">{nextLesson.title}</div>
                        </div>
                        <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <Link
                        href={`/courses/${params.slug}`}
                        className="flex-1 flex items-center justify-center bg-emerald-500 text-white px-4 py-4 hover:bg-emerald-500/80 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-bold uppercase">Complete Course</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
