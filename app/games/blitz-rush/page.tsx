'use client'

import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BlitzRushPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link href="/games">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Games
            </Link>
          </Button>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800">
          <Construction className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Blitz Rush 3D</h1>
          <p className="text-xl text-white/60 mb-2">Coming Soon</p>
          <p className="text-white/40 max-w-md mx-auto">
            We're building an epic 3D endless runner experience.
            Check back soon for the full game!
          </p>

          <div className="mt-8">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/games">
                Explore Other Games
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
