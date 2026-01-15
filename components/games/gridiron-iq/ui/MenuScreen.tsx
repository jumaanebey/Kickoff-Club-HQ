'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { Play, Trophy, Brain, Target } from 'lucide-react'

export function MenuScreen() {
  const { phase, startGame, highScore, gamesPlayed, stats } = useGameStore()

  if (phase !== 'menu') return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4"
    >
      {/* Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="relative inline-block">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />

          <div className="relative">
            <Brain className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
              GRIDIRON{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                IQ
              </span>
            </h1>

            <p className="text-green-400/80 font-bold mt-2 tracking-widest uppercase text-sm">
              Think Like a Quarterback
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats card (if returning player) */}
      {gamesPlayed > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 w-full max-w-sm"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">Your Best</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-black text-white">{highScore}</div>
              <div className="text-white/50 text-xs uppercase">High Score</div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-black text-green-400">{gamesPlayed}</div>
              <div className="text-white/50 text-xs uppercase">Games</div>
            </div>
          </div>

          {stats.attempts > 0 && (
            <div className="mt-3 text-center text-white/40 text-xs">
              Career: {stats.completions}/{stats.attempts} ({Math.round((stats.completions / stats.attempts) * 100)}%) |{' '}
              {stats.touchdowns} TDs | {stats.yards} yards
            </div>
          )}
        </motion.div>
      )}

      {/* Play button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Button
          onClick={startGame}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl sm:text-2xl px-10 sm:px-14 py-6 sm:py-8 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.4)] transform hover:scale-105 transition-all border-2 border-white/20"
        >
          <Play className="w-6 h-6 sm:w-8 sm:h-8 mr-2 fill-white" />
          PLAY BALL
        </Button>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-white/60 text-xs">Pick a play</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-white/60 text-xs">Read defense</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-white/60 text-xs">Score TDs</span>
          </div>
        </div>

        <p className="text-white/40 text-xs">
          Learn real NFL plays and concepts while you play!
        </p>
      </motion.div>
    </motion.div>
  )
}
