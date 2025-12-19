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
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
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
      <div className="flex-1 px-2 pb-2 min-h-0">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 h-full">
          <iframe
            id="game-frame"
            src="/games/blitz-rush/index.html"
            className="w-full h-full"
            style={{ border: 'none' }}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  )
}
