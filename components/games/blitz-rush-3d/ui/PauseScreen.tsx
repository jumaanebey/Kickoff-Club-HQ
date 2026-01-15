'use client'

import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { Play, Home, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function PauseScreen() {
  const { phase, score, coins, distance, resumeGame, startGame } = useGameStore()

  if (phase !== 'paused') return null

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
          className="bg-slate-900 border-2 border-slate-700 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative text-center flex flex-col items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black italic text-white uppercase tracking-tighter">
                Paused
              </h2>
              <p className="text-white/60 text-sm">Take a breather!</p>
            </div>

            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-white/50 text-xs font-bold uppercase mb-1">Score</div>
                <div className="text-lg font-black text-white">{Math.floor(score).toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-white/50 text-xs font-bold uppercase mb-1">Coins</div>
                <div className="text-lg font-black text-yellow-400">{coins}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-white/50 text-xs font-bold uppercase mb-1">Distance</div>
                <div className="text-lg font-black text-blue-400">{Math.floor(distance)}m</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={resumeGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-5 rounded-xl text-lg shadow-[0_4px_0_#166534] active:translate-y-1 active:shadow-none transition-all"
              >
                <Play className="w-5 h-5 mr-2 fill-white" /> RESUME
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={startGame}
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 text-slate-200 py-4 rounded-xl font-bold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> RESTART
                </Button>
                <Link href="/games" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 py-4 rounded-xl font-bold"
                  >
                    <Home className="w-4 h-4 mr-2" /> QUIT
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
