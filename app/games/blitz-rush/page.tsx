'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { Leaderboard } from '@/components/games/leaderboard'
import { AchievementPopup } from '@/components/games/achievement-popup'
import { useGameProgress } from '@/hooks/use-game-progress'
import { motion, AnimatePresence } from 'framer-motion'

// Dynamic import to avoid SSR issues with Three.js
const BlitzRush3DGame = dynamic(
  () => import('@/components/games/blitz-rush-3d/BlitzRush3D'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading Blitz Rush 3D...</p>
        </div>
      </div>
    ),
  }
)

export default function BlitzRushPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const { unlockedAchievement, clearAchievement } = useGameProgress()

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
            <Link href="/games">
              <ArrowLeft className="mr-2 w-4 h-4" />
              All Games
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-white tracking-tight">
              Blitz Rush <span className="text-yellow-400">3D</span>
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
            Leaderboard
            {showLeaderboard ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>
      </header>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="container mx-auto px-4 py-6">
              <Leaderboard gameId="blitz-rush-3d" limit={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Container */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Game */}
          <BlitzRush3DGame />

          {/* Game Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mb-2">
                <Star className="w-4 h-4" />
                HOW TO PLAY
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Swipe left/right or use A/D keys to dodge</li>
                <li>• Swipe up or press Space to jump</li>
                <li>• Swipe down or press S to slide</li>
                <li>• Collect coins and powerups!</li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-2">
                <Trophy className="w-4 h-4" />
                POWERUPS
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>🛡️ Shield - Block one hit</li>
                <li>🧲 Magnet - Attract coins</li>
                <li>⚡ Speed - Move faster</li>
                <li>✨ Multiplier - 2x score</li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                <Star className="w-4 h-4" />
                FEATURES
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• 6 unique characters</li>
                <li>• Daily missions</li>
                <li>• Shop with upgrades</li>
                <li>• Global leaderboards</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Achievement Popup */}
      <AchievementPopup
        achievement={unlockedAchievement}
        onClose={clearAchievement}
      />
    </div>
  )
}
