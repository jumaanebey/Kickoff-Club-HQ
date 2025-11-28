'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Subtitles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils'

interface Caption {
  start: number
  end: number
  text: string
}

interface PodcastAudioPlayerProps {
  audioUrl: string
  title: string
  episodeNumber: number
  transcript?: string // VTT format
}

function parseVTT(vttContent: string): Caption[] {
  if (!vttContent || !vttContent.includes('WEBVTT')) {
    return []
  }

  const captions: Caption[] = []
  const lines = vttContent.split('\n')
  let i = 0

  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes('-->')) {
    i++
  }

  while (i < lines.length) {
    const line = lines[i].trim()

    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->').map(s => s.trim())
      const start = parseVTTTime(startStr)
      const end = parseVTTTime(endStr)

      // Collect caption text
      i++
      let text = ''
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        text += (text ? ' ' : '') + lines[i].trim()
        i++
      }

      if (text) {
        captions.push({ start, end, text })
      }
    } else {
      i++
    }
  }

  return captions
}

function parseVTTTime(timeStr: string): number {
  const parts = timeStr.split(':')
  if (parts.length === 3) {
    const [hours, minutes, secondsMs] = parts
    const [seconds, ms] = secondsMs.split('.')
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + (parseInt(ms) || 0) / 1000
  } else if (parts.length === 2) {
    const [minutes, secondsMs] = parts
    const [seconds, ms] = secondsMs.split('.')
    return parseInt(minutes) * 60 + parseInt(seconds) + (parseInt(ms) || 0) / 1000
  }
  return 0
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function PodcastAudioPlayer({ audioUrl, title, episodeNumber, transcript }: PodcastAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [currentCaption, setCurrentCaption] = useState<string>('')
  const [captions, setCaptions] = useState<Caption[]>([])

  // Parse VTT transcript
  useEffect(() => {
    if (transcript) {
      const parsed = parseVTT(transcript)
      setCaptions(parsed)
    }
  }, [transcript])

  // Update current caption based on playback time
  useEffect(() => {
    if (!showCaptions || captions.length === 0) {
      setCurrentCaption('')
      return
    }

    const caption = captions.find(c => currentTime >= c.start && currentTime <= c.end)
    setCurrentCaption(caption?.text || '')
  }, [currentTime, captions, showCaptions])

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [])

  const seekTo = useCallback((percentage: number) => {
    if (!audioRef.current || !duration) return
    const time = (percentage / 100) * duration
    audioRef.current.currentTime = time
  }, [duration])

  const skip = useCallback((seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }, [duration])

  const progress = duration ? (currentTime / duration) * 100 : 0
  const hasCaptions = captions.length > 10 // Only show CC button if we have real captions

  return (
    <div className="w-full">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Caption Display */}
      {showCaptions && currentCaption && (
        <div className="bg-black/90 text-white px-4 py-3 rounded-lg mb-4 text-center">
          <p className="text-sm md:text-base leading-relaxed">{currentCaption}</p>
        </div>
      )}

      {/* Player Controls */}
      <div className="bg-gradient-to-r from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4 md:p-6">
        {/* Track Info */}
        <div className="mb-4">
          <div className="text-sm mb-1 text-muted-foreground">Now Playing</div>
          <div className="font-semibold">Episode {episodeNumber}: {title}</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group hover:h-3 transition-all"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percentage = ((e.clientX - rect.left) / rect.width) * 100
              seekTo(percentage)
            }}
          >
            <div
              className="h-full bg-orange-500 rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Volume */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-orange-500 transition-colors">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-orange-500"
            />
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => skip(-15)}
              className="text-muted-foreground hover:text-orange-500 transition-colors p-2"
              title="Back 15 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={() => skip(15)}
              className="text-muted-foreground hover:text-orange-500 transition-colors p-2"
              title="Forward 15 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Right: CC Toggle */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {hasCaptions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCaptions(!showCaptions)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  showCaptions
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
                title={showCaptions ? "Hide captions" : "Show captions"}
              >
                <Subtitles className="h-4 w-4 mr-1" />
                CC
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
