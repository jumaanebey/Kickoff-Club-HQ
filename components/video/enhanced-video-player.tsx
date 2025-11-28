'use client'

import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react'
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

export default memo(function EnhancedVideoPlayer({
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
  const [videoType, setVideoType] = useState<'youtube' | 'direct' | 'r2'>('direct')

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
        setVideoType(data.type || 'direct')
      } catch (error) {
        console.error('Error fetching video URL:', error)
        setVideoError(error instanceof Error ? error.message : 'Failed to load video')
      } finally {
        setVideoLoading(false)
      }
    }

    fetchVideoUrl()
  }, [lesson.videoId])

  // Convert timestamp to seconds - memoized
  const parseTimestamp = useCallback((timestamp: string) => {
    const [start] = timestamp.split('-')
    const [minutes, seconds] = start.split(':').map(Number)
    return minutes * 60 + seconds
  }, [])

  // Get end time from timestamp - memoized
  const parseEndTimestamp = useCallback((timestamp: string) => {
    const [, end] = timestamp.split('-')
    if (!end) return 0
    const [minutes, seconds] = end.split(':').map(Number)
    return minutes * 60 + seconds
  }, [])

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

  // Memoize current section data
  const currentSectionData = useMemo(() =>
    lesson.script?.sections?.[currentSection],
    [lesson.script?.sections, currentSection]
  )

  // Memoize progress calculation
  const progress = useMemo(() =>
    duration ? (currentTime / duration) * 100 : 0,
    [currentTime, duration]
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg md:rounded-2xl overflow-hidden mb-6 shadow-2xl">
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
          <>
            {videoType === 'youtube' ? (
              <iframe
                className="w-full aspect-video"
<<<<<<< HEAD
                src={`${signedVideoUrl}${signedVideoUrl.includes('?') ? '&' : '?'}origin=${typeof window !== 'undefined' ? window.location.origin : ''}&enablejsapi=1&rel=0`}
=======
                src={`${signedVideoUrl}${signedVideoUrl.includes('?') ? '&' : '?'}autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&enablejsapi=1&rel=0`}
>>>>>>> origin/main
                title={lesson.title || "Video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
              />
            ) : (
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                poster={lesson.thumbnailUrl}
                preload="auto"
                playsInline
                autoPlay
                onCanPlay={() => {
                  setVideoLoading(false)
                  // Auto-play when ready
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {})
                  }
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget
                  setDuration(video.duration)
                  setVideoLoading(false)
                }}
                onError={() => {
                  setVideoError('Video playback failed')
                  setVideoLoading(false)
                }}
              >
                <source src={signedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Caption Overlay - only for non-YouTube videos */}
            {videoType !== 'youtube' && showCaptions && currentSectionData && isPlaying && (
              <div className="absolute bottom-16 md:bottom-20 left-0 right-0 flex justify-center px-2 md:px-4 z-10 pointer-events-none">
                <div className="bg-black/80 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg max-w-3xl text-center">
                  <p className="text-xs sm:text-sm md:text-base leading-tight">{currentSectionData.content}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Video Controls Overlay - only for non-YouTube videos */}
        {videoType !== 'youtube' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 md:p-4">
            {/* Progress Bar */}
            <div className="mb-2 md:mb-4">
              <div
                className="w-full h-3 md:h-2 bg-gray-600 rounded-full cursor-pointer group hover:h-4 md:hover:h-3 transition-all touch-none"
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
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 md:w-3 md:h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 md:w-10 md:h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors touch-manipulation"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-6 w-6 md:h-5 md:w-5" /> : <Play className="h-6 w-6 md:h-5 md:w-5 ml-0.5" />}
                </button>

                <div className="hidden md:flex items-center space-x-2">
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

                <span className="text-white text-xs md:text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-1 md:space-x-3">
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`px-2 py-1.5 md:px-3 md:py-1 rounded text-xs md:text-sm transition-colors touch-manipulation ${showCaptions ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500 active:bg-gray-700'
                    }`}
                >
                  CC
                </button>

                <button
                  onClick={() => setShowScript(!showScript)}
                  className={`hidden sm:flex px-2 py-1.5 md:px-3 md:py-1 rounded text-xs md:text-sm transition-colors items-center gap-1 touch-manipulation ${showScript ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500 active:bg-gray-700'
                    }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  <span className="hidden md:inline">Script</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 active:text-blue-500 transition-colors p-1.5 md:p-0 touch-manipulation"
                  aria-label="Fullscreen"
                >
                  <Maximize className="h-6 w-6 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

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

    </div>
  )
})
