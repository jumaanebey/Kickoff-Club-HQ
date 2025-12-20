'use client'

import { BlitzRushGame } from '@/components/games/blitz-rush'

export default function BlitzRushPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center py-8">
      <BlitzRushGame />
    </div>
  )
}
