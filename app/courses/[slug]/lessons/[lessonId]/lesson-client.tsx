'use client'

import { lazy, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Loader2, PlayCircle, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/social/share-buttons'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'

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
    <div className={cn('min-h-screen flex flex-col', colors.bg)}>
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href={`/courses/${params.slug}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-orange-500 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to {course.title}
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className={cn("text-3xl md:text-4xl font-black mb-3 tracking-tight", colors.text)}>{lesson.title}</h1>
              {lesson.description && (
                <p className={cn("text-lg max-w-3xl leading-relaxed", colors.textSecondary)}>{lesson.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {progress?.watched && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-bold">Completed</span>
                </div>
              )}
              <ShareButtons
                url={`https://kickoffclubhq.com/courses/${params.slug}/lessons/${params.lessonId}`}
                title={`${lesson.title} - ${course.title}`}
                description={lesson.description || `Learn ${lesson.title.toLowerCase()} in this comprehensive football training lesson.`}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {/* Access Control */}
          {!hasAccess ? (
            <div className={cn("rounded-2xl border p-12 text-center backdrop-blur-xl flex-1 flex flex-col items-center justify-center", colors.bgSecondary, colors.cardBorder)}>
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className={cn("text-3xl font-bold mb-3", colors.text)}>Premium Lesson</h2>
                <p className={cn("mb-8 text-lg leading-relaxed", colors.textSecondary)}>
                  This lesson requires a premium subscription. Upgrade today to unlock this video and access all course content.
                </p>
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                  <Link href="/pricing">
                    Upgrade to Premium
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Video Player Container */}
              <div className={cn("rounded-2xl overflow-hidden shadow-2xl border bg-black aspect-video relative group", colors.cardBorder)}>
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white">
                      <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                      <p className="text-zinc-400 font-medium">Loading player...</p>
                    </div>
                  }
                >
                  <EnhancedVideoPlayer lesson={lessonForPlayer} />
                </Suspense>
              </div>

              {/* Lesson Meta & Navigation */}
              <div className="mt-8 grid lg:grid-cols-3 gap-8">
                {/* Meta Info */}
                <div className={cn("lg:col-span-1 p-6 rounded-xl border backdrop-blur-sm h-fit", colors.bgSecondary, colors.cardBorder)}>
                  <h3 className={cn("font-bold mb-4 flex items-center gap-2", colors.text)}>
                    <FileText className="w-5 h-5 text-orange-500" />
                    Lesson Details
                  </h3>
                  <div className="space-y-4">
                    {lesson.duration_seconds && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={colors.textMuted}>Duration</span>
                        <span className={cn("font-medium flex items-center gap-1.5", colors.text)}>
                          <Clock className="w-4 h-4 text-orange-500" />
                          {Math.floor(lesson.duration_seconds / 60)}:{String(lesson.duration_seconds % 60).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className={colors.textMuted}>Sections</span>
                      <span className={cn("font-medium", colors.text)}>{lesson.script_sections?.length || 0}</span>
                    </div>
                    {lesson.quiz && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={colors.textMuted}>Quiz Available</span>
                        <span className="text-green-500 font-medium">Yes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-4">
                  <div className="flex items-center justify-between gap-4">
                    {previousLesson ? (
                      <Button asChild variant="outline" size="lg" className="flex-1 h-14 border-2 hover:bg-muted/50">
                        <Link href={`/courses/${params.slug}/lessons/${previousLesson.id}`}>
                          <ChevronLeft className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="text-xs text-muted-foreground font-normal">Previous</div>
                            <div className="font-bold truncate max-w-[120px] sm:max-w-[200px]">{previousLesson.title}</div>
                          </div>
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {nextLesson ? (
                      <Button asChild size="lg" className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                        <Link href={`/courses/${params.slug}/lessons/${nextLesson.id}`}>
                          <div className="text-right">
                            <div className="text-xs text-white/80 font-normal">Next Lesson</div>
                            <div className="font-bold truncate max-w-[120px] sm:max-w-[200px]">{nextLesson.title}</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="lg" variant="outline" className="flex-1 h-14 border-2 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40 text-green-500">
                        <Link href={`/courses/${params.slug}`}>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Complete Course
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
