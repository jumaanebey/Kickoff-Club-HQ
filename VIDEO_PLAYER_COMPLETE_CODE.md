# Complete Video Player Integration Code

All files needed for the video player integration.

---

## 1. Environment Variables (.env.local)

Add these to your existing `.env.local`:

```env
# Cloudflare R2 Configuration (Video Storage)
R2_ACCOUNT_ID=823743a9ea649b7611fbc9b83a1de4c1
R2_ACCESS_KEY_ID=3570f7697bff4d45926f8677113058c0
R2_SECRET_ACCESS_KEY=88e048e3a1815c1e9ae1e754576a07b1e63c662066f22b3a8b8653df96c1b7db
R2_BUCKET_NAME=kickoff-club-videos
R2_ENDPOINT=https://823743a9ea649b7611fbc9b83a1de4c1.r2.cloudflarestorage.com
VIDEO_URL_EXPIRATION=7200
```

---

## 2. API Route: app/api/video-url/route.ts

```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Configure R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// Free lessons that don't require premium subscription
const FREE_LESSONS = [
  'how-downs-work',
  'scoring-touchdowns',
  'field-layout-basics'
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Check if lesson is premium
    const isPremium = !FREE_LESSONS.includes(videoId)

    // If premium, verify user has access
    if (isPremium) {
      const supabase = createRouteHandlerClient({ cookies })

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check if user has active subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single()

      if (!profile || profile.subscription_status !== 'active' || profile.subscription_tier === 'free') {
        return NextResponse.json(
          { error: 'Premium subscription required' },
          { status: 403 }
        )
      }
    }

    // Generate signed URL for the video
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: `${videoId}.mp4`,
    })

    // URL expires in 2 hours (7200 seconds)
    const expiresIn = parseInt(process.env.VIDEO_URL_EXPIRATION || '7200')
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })

    return NextResponse.json({
      url: signedUrl,
      expiresIn,
      videoId,
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate video URL' },
      { status: 500 }
    )
  }
}
```

---

## 3. Video Player Component: components/video/enhanced-video-player.tsx

```typescript
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, MessageSquare } from 'lucide-react'

interface ScriptSection {
  title: string
  timestamp: string
  content: string
  onScreen?: string
}

interface Quiz {
  question: string
  options: string[]
  correctIndex: number
}

interface Lesson {
  id: string
  title: string
  videoId: string
  thumbnailUrl?: string
  script: {
    sections: ScriptSection[]
  }
  quiz?: Quiz
}

interface EnhancedVideoPlayerProps {
  lesson: Lesson
  onComplete?: () => void
  showInteractives?: boolean
}

export default function EnhancedVideoPlayer({
  lesson,
  onComplete,
  showInteractives = true
}: EnhancedVideoPlayerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showScript, setShowScript] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [showQuizOverlay, setShowQuizOverlay] = useState(false)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [signedVideoUrl, setSignedVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Fetch signed video URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setVideoLoading(true)
        setVideoError(null)

        const response = await fetch(`/api/video-url?videoId=${lesson.videoId}`)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to load video')
        }

        const data = await response.json()
        setSignedVideoUrl(data.url)
      } catch (error) {
        console.error('Error fetching video URL:', error)
        setVideoError(error instanceof Error ? error.message : 'Failed to load video')
      } finally {
        setVideoLoading(false)
      }
    }

    fetchVideoUrl()
  }, [lesson.videoId])

  // Convert timestamp to seconds
  const parseTimestamp = (timestamp: string) => {
    const [start] = timestamp.split('-')
    const [minutes, seconds] = start.split(':').map(Number)
    return minutes * 60 + seconds
  }

  // Get end time from timestamp
  const parseEndTimestamp = (timestamp: string) => {
    const [, end] = timestamp.split('-')
    if (!end) return 0
    const [minutes, seconds] = end.split(':').map(Number)
    return minutes * 60 + seconds
  }

  // Sync video with script sections
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      const time = video.currentTime
      setCurrentTime(time)

      // Find current section based on video time
      const sectionIndex = lesson.script.sections.findIndex((section, index) => {
        const startTime = parseTimestamp(section.timestamp)
        const endTime = index < lesson.script.sections.length - 1
          ? parseTimestamp(lesson.script.sections[index + 1].timestamp)
          : parseEndTimestamp(section.timestamp) || duration

        return time >= startTime && time < endTime
      })

      if (sectionIndex !== -1 && sectionIndex !== currentSection) {
        setCurrentSection(sectionIndex)
      }

      // Show quiz at end of lesson
      if (duration > 0 && time >= duration - 5 && !quizAnswered && lesson.quiz) {
        setShowQuizOverlay(true)
        video.pause()
        setIsPlaying(false)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [lesson, currentSection, duration, quizAnswered, onComplete])

  const togglePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const skipToSection = (sectionIndex: number) => {
    if (!videoRef.current) return
    const startTime = parseTimestamp(lesson.script.sections[sectionIndex].timestamp)
    videoRef.current.currentTime = startTime
    setCurrentSection(sectionIndex)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    if (isMuted) {
      videoRef.current.volume = volume
      setIsMuted(false)
    } else {
      videoRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const seekTo = (percentage: number) => {
    if (!videoRef.current || !duration) return
    const time = (percentage / 100) * duration
    videoRef.current.currentTime = time
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleQuizAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === lesson.quiz?.correctIndex
    setQuizAnswered(true)
    setShowQuizOverlay(false)

    // Resume video
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const currentSectionData = lesson.script.sections[currentSection]
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="relative bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl">
        {/* Loading State */}
        {(videoLoading || !signedVideoUrl) && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 aspect-video">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 aspect-video">
            <div className="text-center text-white p-6">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg mb-2">Failed to load video</p>
              <p className="text-sm text-gray-400 mb-4">{videoError}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Video Element */}
        {signedVideoUrl && !videoError && (
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            poster={lesson.thumbnailUrl}
            preload="metadata"
            onCanPlay={() => setVideoLoading(false)}
            onError={() => {
              setVideoError('Video playback failed')
              setVideoLoading(false)
            }}
          >
            <source src={signedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer group hover:h-3 transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percentage = ((e.clientX - rect.left) / rect.width) * 100
                seekTo(percentage)
              }}
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-200 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Section markers */}
              {lesson.script.sections.map((section, index) => {
                const startTime = parseTimestamp(section.timestamp)
                const markerPosition = duration ? (startTime / duration) * 100 : 0
                return (
                  <div
                    key={index}
                    className="absolute top-0 w-0.5 h-full bg-white/60 hover:bg-white transition-colors"
                    style={{ left: `${markerPosition}%` }}
                    title={section.title}
                  />
                )
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>

              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  showCaptions ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                CC
              </button>

              <button
                onClick={() => setShowScript(!showScript)}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                  showScript ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                Script
              </button>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Overlay */}
        {showQuizOverlay && lesson.quiz && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-20">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Check!</h3>
              <p className="text-gray-700 mb-4">{lesson.quiz.question}</p>
              <div className="space-y-2">
                {lesson.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Section Display */}
      {showScript && currentSectionData && (
        <div className="card mb-6 bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">{currentSection + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{currentSectionData.title}</h3>
                <p className="text-sm text-gray-500">{currentSectionData.timestamp}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {currentSectionData.content}
            </p>

            {currentSectionData.onScreen && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">On Screen:</p>
                <p className="text-gray-700 italic">{currentSectionData.onScreen}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Navigation */}
      <div className="card bg-white border rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Jump to Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.script.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => skipToSection(index)}
              className={`text-left p-4 rounded-xl transition-all duration-200 ${
                index === currentSection
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                  : index <= Math.floor(currentTime / (duration / lesson.script.sections.length))
                    ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-500 mr-3">{section.timestamp}</span>
                  <span className="font-semibold">{section.title}</span>
                </div>
                {index <= Math.floor(currentTime / (duration / lesson.script.sections.length)) && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 4. Database Queries: lib/db/lesson-queries.ts

```typescript
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
```

---

## 5. Lesson Page: app/courses/[slug]/lessons/[lessonId]/page.tsx

```typescript
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import EnhancedVideoPlayer from '@/components/video/enhanced-video-player'
import { getLessonBySlug, getNextLesson, getPreviousLesson, getUserLessonProgress } from '@/database/queries/lessons'
import { Button } from '@/components/ui/button'

interface LessonPageProps {
  params: {
    slug: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Get lesson with full details
  const lesson = await getLessonBySlug(params.slug, params.lessonId)

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
    videoId: lesson.video_id,
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
                  <Link href={`/courses/${params.slug}/lessons/${previousLesson.slug}`}>
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous: {previousLesson.title}
                  </Link>
                </Button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Button asChild size="lg">
                  <Link href={`/courses/${params.slug}/lessons/${nextLesson.slug}`}>
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
                    <span>{Math.floor(lesson.duration_seconds / 60)} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sections:</span>
                    <span>{lesson.script_sections?.length || 0}</span>
                  </div>
                  {lesson.quiz && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Quiz:</span>
                      <span>{lesson.quiz.options.length} questions</span>
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
```

---

## 6. Install Dependencies

Run this in your terminal:

```bash
cd ~/Downloads/kickoff-club-hq
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## 7. Database Migration Files

**Already created at:**
- `supabase/migrations/20250104_create_lessons_tables.sql`
- `supabase/migrations/20250104_add_sample_lesson_data.sql`

**To run:** Copy each file's SQL and paste into Supabase SQL Editor

---

## That's Everything!

All code is ready. Just:
1. Run the migrations in Supabase
2. Test at: `http://localhost:3000/courses/football-fundamentals/lessons/how-downs-work`
