'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Dynamic import to avoid SSR issues with Three.js
const BlitzRush3DGame = dynamic(
  () => import('@/components/games/blitz-rush-3d/BlitzRush3D'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    )
  }
)

export default function BlitzRushPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={
          <div className="w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        }>
          <BlitzRush3DGame />
        </Suspense>
      </div>
    </div>
  )
}
