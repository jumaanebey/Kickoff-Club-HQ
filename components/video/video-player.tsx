'use client'

import { useEffect, useRef, useState } from 'react'
import { updateVideoProgress } from '@/app/actions/progress'

interface VideoPlayerProps {
  videoUrl: string
  lessonId: string
  userId?: string
  initialProgress?: number // seconds watched
  duration: number // total video duration in seconds
  onProgressUpdate?: (seconds: number) => void
}

export function VideoPlayer({
  videoUrl,
  lessonId,
  userId,
  initialProgress = 0,
  duration,
  onProgressUpdate
}: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(initialProgress)
  const [isPlaying, setIsPlaying] = useState(false)
  const lastSavedTime = useRef(initialProgress)
  const saveInterval = useRef<NodeJS.Timeout | null>(null)

  // Save progress every 10 seconds while playing
  useEffect(() => {
    if (isPlaying) {
      saveInterval.current = setInterval(() => {
        saveProgress(currentTime)
      }, 10000) // Save every 10 seconds
    } else {
      if (saveInterval.current) {
        clearInterval(saveInterval.current)
      }
    }

    return () => {
      if (saveInterval.current) {
        clearInterval(saveInterval.current)
      }
    }
  }, [isPlaying, currentTime])

  // Save progress on unmount (user navigates away)
  useEffect(() => {
    return () => {
      if (currentTime > lastSavedTime.current) {
        saveProgress(currentTime)
      }
    }
  }, [currentTime])

  const saveProgress = async (seconds: number) => {
    // Only save if progress has advanced
    if (seconds <= lastSavedTime.current) {
      return
    }

    const formData = new FormData()
    formData.append('lessonId', lessonId)
    formData.append('watchedSeconds', seconds.toString())

    // Mark as complete if watched 90% or more
    const percentWatched = (seconds / duration) * 100
    const completed = percentWatched >= 90
    formData.append('completed', completed.toString())

    await updateVideoProgress(formData)

    lastSavedTime.current = seconds

    if (onProgressUpdate) {
      onProgressUpdate(seconds)
    }
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Set initial playback position
  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = initialProgress
    }
  }, [initialProgress])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          isPlaying ? videoRef.current.pause() : videoRef.current.play()
          break
        case 'ArrowLeft':
          e.preventDefault()
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
          break
        case 'ArrowRight':
          e.preventDefault()
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          setIsMuted(!isMuted)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, duration, isMuted])

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackSpeed = rate
      setPlaybackRate(rate)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group">
      {videoUrl.startsWith('http') ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            controls
            controlsList="nodownload"
            onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(e) => {
              setVolume(e.currentTarget.volume)
              setIsMuted(e.currentTarget.muted)
            }}
          />

          {/* Custom controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                </span>
                <span>/</span>
                <span className="font-mono">
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Playback speed */}
              <div className="flex items-center gap-2">
                <span className="text-xs">Speed:</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`text-xs px-2 py-1 rounded ${
                      playbackRate === rate ? 'bg-primary-500' : 'bg-white/20'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
            <div>Space: Play/Pause</div>
            <div>← →: Skip 10s</div>
            <div>F: Fullscreen</div>
            <div>M: Mute</div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-4">🎥</div>
          <p className="text-lg mb-2">Video Player</p>
          <p className="text-sm text-gray-400">No video URL provided</p>
        </div>
      )}
    </div>
  )
}
