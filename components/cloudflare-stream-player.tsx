// components/cloudflare-stream-player.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CloudflareStreamPlayerProps {
  videoId: string
  title: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  onProgress?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  onPlay?: () => void
  onPause?: () => void
}

export function CloudflareStreamPlayer({
  videoId,
  title,
  autoplay = false,
  muted = false,
  controls = true,
  onProgress,
  onComplete,
  onPlay,
  onPause,
}: CloudflareStreamPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for player events from Cloudflare Stream
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (!event.origin.includes('cloudflarestream.com')) return

      try {
        const data = event.data

        switch (data.event) {
          case 'ready':
            setIsLoading(false)
            break

          case 'play':
            onPlay?.()
            break

          case 'pause':
            onPause?.()
            break

          case 'timeupdate':
            if (onProgress && data.currentTime !== undefined && data.duration !== undefined) {
              onProgress(data.currentTime, data.duration)
            }
            break

          case 'ended':
            onComplete?.()
            break

          case 'error':
            setError(data.message || 'Error loading video')
            setIsLoading(false)
            break
        }
      } catch (err) {
        console.error('Error handling player message:', err)
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Set timeout for loading
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setError('Video is taking too long to load')
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(loadTimeout)
    }
  }, [videoId, onProgress, onComplete, onPlay, onPause, isLoading])

  // Build iframe URL with parameters
  const buildIframeUrl = () => {
    const params = new URLSearchParams({
      preload: 'auto',
      autoplay: autoplay ? 'true' : 'false',
      muted: muted ? 'true' : 'false',
      controls: controls ? 'true' : 'false',
      loop: 'false',
    })

    return `https://iframe.cloudflarestream.com/${videoId}?${params}`
  }

  if (error) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-destructive/10 flex items-center justify-center border border-destructive">
        <div className="text-center p-8">
          <div className="text-destructive font-semibold mb-2">
            Failed to load video
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Cloudflare Stream Iframe */}
      <iframe
        ref={iframeRef}
        src={buildIframeUrl()}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  )
}

// Wrapper with access control
interface SecureStreamPlayerProps extends CloudflareStreamPlayerProps {
  hasAccess: boolean
  onUpgradeClick?: () => void
}

export function SecureStreamPlayer({
  hasAccess,
  onUpgradeClick,
  ...playerProps
}: SecureStreamPlayerProps) {
  if (!hasAccess) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border-2 border-dashed border-primary/30">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
          <p className="text-muted-foreground mb-6">
            This lesson is available to paid subscribers only
          </p>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Upgrade to Access →
            </button>
          )}
        </div>
      </div>
    )
  }

  return <CloudflareStreamPlayer {...playerProps} />
}
