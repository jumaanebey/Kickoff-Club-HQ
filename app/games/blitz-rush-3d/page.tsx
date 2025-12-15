import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Dynamic import to avoid SSR issues with Three.js
const BlitzRush3DGame = dynamic(
  () => import('@/components/games/blitz-rush-3d').then(mod => mod.BlitzRush3DGame),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] bg-slate-900 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading 3D Engine...</p>
        </div>
      </div>
    ),
  }
)

export const metadata = {
  title: 'Blitz Rush 3D | Kickoff Club Games',
  description: 'Dodge defenders, collect coins, and run for the end zone in this 3D endless runner!',
}

export default function BlitzRush3DPage() {
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

          <div className="text-right">
            <h1 className="text-2xl font-bold text-white">Blitz Rush 3D</h1>
            <p className="text-sm text-white/60">Endless Runner</p>
          </div>
        </div>

        {/* Game container */}
        <BlitzRush3DGame />

        {/* Instructions */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">How to Play</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">←/→</span>
                <span>Swipe or arrow keys to change lanes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">↑</span>
                <span>Swipe up or Space to jump</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">↓</span>
                <span>Swipe down to slide</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">Power-ups</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded" />
                <span><strong>Magnet</strong> - Auto-collect nearby coins</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded" />
                <span><strong>Shield</strong> - Survive one collision</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded" />
                <span><strong>Speed</strong> - Temporary speed boost</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-purple-500 rounded" />
                <span><strong>Multiplier</strong> - 2x points</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
