'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home, Share2, Trophy, Coins, Target, Skull } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameProgress } from '@/hooks/use-game-progress'

export function GameOverScreen() {
  const { phase, score, coins, distance, highScore, startGame, reset } = useGameStore()
  const { markGameCompleted } = useGameProgress()
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  // Save progress when game ends
  useEffect(() => {
    if (phase === 'gameover' && score > 0) {
      markGameCompleted('blitz-rush-3d', score, coins)
      setIsNewHighScore(score > highScore)
    }
  }, [phase, score, coins, highScore, markGameCompleted])

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
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-red-950/90 via-black/90 to-black/95 backdrop-blur-md"
      >
        {/* Tackled header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Skull className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            TACKLED!
          </h2>
        </motion.div>

        {/* New high score celebration */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full animate-pulse">
              <span className="text-black font-black text-xl flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                NEW HIGH SCORE!
              </span>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 md:gap-6 mb-10 w-full max-w-md px-4"
        >
          {/* Score */}
          <div className="bg-black/50 p-4 md:p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Score</p>
            </div>
            <p className="text-4xl md:text-5xl font-black text-white tabular-nums">
              {Math.floor(score).toLocaleString()}
            </p>
          </div>

          {/* Coins */}
          <div className="bg-black/50 p-4 md:p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Coins</p>
            </div>
            <p className="text-4xl md:text-5xl font-black text-yellow-400 tabular-nums">
              {coins}
            </p>
          </div>

          {/* Distance */}
          <div className="bg-black/50 p-4 rounded-2xl border border-white/10 col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Distance</p>
                <p className="text-2xl font-bold text-white">{Math.floor(distance)}m</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Best</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.floor(Math.max(score, highScore)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={startGame}
            size="lg"
            className="bg-white hover:bg-gray-100 text-black font-black text-xl px-10 py-7 rounded-full shadow-2xl transform hover:scale-105 transition-all"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            TRY AGAIN
          </Button>

          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-7 rounded-full"
          >
            <Share2 className="w-5 h-5 mr-2" />
            SHARE
          </Button>
        </motion.div>

        {/* Home link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <Link
            href="/games"
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Back to Games</span>
          </Link>
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-white/30 text-xs text-center max-w-sm px-4"
        >
          Tip: Collect magnet powerups to auto-grab coins, and use shields to survive one hit!
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
