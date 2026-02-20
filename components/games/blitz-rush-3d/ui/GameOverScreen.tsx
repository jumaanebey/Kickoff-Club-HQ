'use client'

import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { useShopStore } from '../hooks/useShopStore'
import { useMissionsStore } from '../hooks/useMissions'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home, Share2, Trophy, Coins, Target, Skull, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameProgress } from '@/hooks/use-game-progress'
import { useAudio } from '../hooks/useAudio'

export function GameOverScreen() {
  const { phase, score, coins, distance, highScore, combo, startGame } = useGameStore()
  const { addCoins, totalCoins } = useShopStore()
  const { trackGameEnd } = useMissionsStore()
  const { markGameCompleted } = useGameProgress()
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const { play } = useAudio()
  const processedRef = useRef(false)

  // Save progress and play sound when game ends
  useEffect(() => {
    if (phase === 'gameover') {
      play('gameOver')
      if (score > 0 && !processedRef.current) {
        markGameCompleted('blitz-rush-3d', score, coins)
        setIsNewHighScore(score > highScore)

        // Add coins to shop store
        if (coins > 0) {
          addCoins(coins)
        }

        // Track mission progress
        trackGameEnd({
          coinsCollected: coins,
          distance: Math.floor(distance),
          score: Math.floor(score),
          maxCombo: combo,
          feverTimeSeconds: 0, // TODO: Track actual fever time
          powerupsCollected: 0, // TODO: Track powerups collected
          hitsTaken: 1, // Game ended, so at least 1 hit
        })

        processedRef.current = true
      }
    } else {
      // Reset ref when not in gameover phase
      processedRef.current = false
    }
  }, [phase, score, coins, distance, combo, highScore, markGameCompleted, play, addCoins, trackGameEnd])

  if (phase !== 'gameover') return null

  const handleShare = () => {
    const text = `I scored ${Math.floor(score).toLocaleString()} in Blitz Rush 3D! Can you beat it? 🏈`
    const url = window.location.href

    if (navigator.share) {
      navigator.share({ title: 'Blitz Rush 3D', text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Score copied to clipboard!')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900 border-2 border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
              <Skull className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                Game Over
              </h2>
              {isNewHighScore && (
                <div className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full inline-block animate-bounce">
                  NEW HIGH SCORE!
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                  <Trophy className="w-3 h-3" /> Score
                </div>
                <div className="text-2xl font-black text-white">{Math.floor(score).toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                  <Coins className="w-3 h-3" /> Coins Earned
                </div>
                <div className="text-2xl font-black text-yellow-400 flex items-center gap-1">
                  <Plus className="w-4 h-4" />{coins}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Total: {totalCoins.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 col-span-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                  <Target className="w-3 h-3" /> Distance
                </div>
                <div className="text-xl font-bold text-slate-200">{Math.floor(distance)}m</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <Button
                onClick={startGame}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black py-6 rounded-2xl text-lg shadow-[0_4px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> REPLAY
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 text-slate-200 py-6 rounded-2xl font-bold"
                >
                  <Share2 className="w-4 h-4 mr-2" /> SHARE
                </Button>
                <Link href="/games/blitz-rush" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 py-6 rounded-2xl font-bold"
                  >
                    <Home className="w-4 h-4 mr-2" /> MENU
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
