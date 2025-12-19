'use client'

import Link from 'next/link'
import { ArrowLeft, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function BlitzRushPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-frame') as HTMLIFrameElement
    if (iframe) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        iframe.requestFullscreen()
        setIsFullscreen(true)
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        overflow: 'hidden'
      }}
    >
      {/* Compact Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          flexShrink: 0
        }}
      >
        <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
          <Link href="/games">
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 h-8 w-8"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-bold text-white">Blitz Rush 3D</h1>
        </div>
      </div>

      {/* Game Container - Takes remaining space */}
      <div
        style={{
          flex: 1,
          padding: '0 8px 8px 8px',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <iframe
          id="game-frame"
          src="/games/blitz-rush/index.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px',
            display: 'block'
          }}
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
