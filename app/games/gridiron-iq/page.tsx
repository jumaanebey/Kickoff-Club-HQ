import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Brain, Target, Trophy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Gridiron IQ - Think Like a Quarterback | Kickoff Club',
  description: 'Master NFL plays and concepts in this quarterback simulation game. Read defenses, call plays, and score touchdowns while learning real football strategy.',
  openGraph: {
    title: 'Gridiron IQ - Think Like a Quarterback',
    description: 'Master NFL plays and concepts in this quarterback simulation game.',
    images: ['/images/games/gridiron-iq-og.png'],
  },
}

// Dynamic import to avoid SSR issues with game components
const GridironIQGame = dynamic(
  () => import('@/components/games/gridiron-iq/GridironIQ'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading Gridiron IQ...</p>
        </div>
      </div>
    ),
  }
)

export default function GridironIQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games">
              <Button variant="ghost" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Games
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-400" />
              <span className="font-black text-white text-lg">GRIDIRON IQ</span>
            </div>

            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game container */}
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={
            <div className="w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
            </div>
          }>
            <GridironIQGame />
          </Suspense>
        </div>

        {/* Game info */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* How to play */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-bold text-white">How to Play</h3>
              </div>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>1. Choose a team and call your play</li>
                <li>2. Study the routes before snapping</li>
                <li>3. Read the defense coverage</li>
                <li>4. Tap open receivers to throw</li>
                <li>5. Score touchdowns to win!</li>
              </ul>
            </div>

            {/* Learn real football */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white">Learn Real Football</h3>
              </div>
              <p className="text-white/60 text-sm">
                Every play teaches you real NFL concepts. Learn what slants, posts, and curls are.
                Understand man vs zone coverage. Become a smarter football fan!
              </p>
            </div>

            {/* Challenge yourself */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="font-bold text-white">Challenge Yourself</h3>
              </div>
              <p className="text-white/60 text-sm">
                Track your QB rating and completion percentage. Can you throw for 300+ yards?
                Beat your high score and climb the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          <p>Gridiron IQ is part of the Kickoff Club learning platform</p>
        </div>
      </footer>
    </div>
  )
}
