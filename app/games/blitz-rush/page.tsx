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
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link href="/games">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Games
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>

            <div className="text-right">
              <h1 className="text-2xl font-bold text-white">Blitz Rush 3D</h1>
              <p className="text-sm text-white/60">Endless Runner</p>
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe
            id="game-frame"
            src="/games/blitz-rush/index.html"
            className="w-full h-[600px] md:h-[700px] lg:h-[750px]"
            style={{ border: 'none' }}
            allow="fullscreen"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">Controls</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">←/→</span>
                <span>Change lanes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">↑/Space</span>
                <span>Jump</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">↓</span>
                <span>Slide</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">Mobile</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Swipe ←→</span>
                <span>Change lanes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Swipe ↑</span>
                <span>Jump</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Swipe ↓</span>
                <span>Slide</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">Obstacles</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-600 rounded" />
                <span>Defenders - dodge or jump!</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-2 bg-red-500 rounded" />
                <span>Low barriers - jump over</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded border-b-4 border-slate-600" />
                <span>High bars - slide under</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
