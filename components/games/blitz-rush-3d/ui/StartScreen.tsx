'use client'

import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { Play, Trophy, Settings, ArrowUp, ArrowDown, ArrowLeftRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function StartScreen() {
  const { phase, highScore, startGame } = useGameStore()

  if (phase !== 'menu') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />

          <div className="relative">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />

            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter text-center">
              BLITZ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                RUSH
              </span>
            </h1>

            <p className="text-xl text-blue-300 font-bold tracking-widest uppercase text-center mt-2">
              3D Edition
            </p>
          </div>
        </motion.div>

        {/* Controls tutorial */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 md:gap-12 mb-10"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowUp className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-sm text-white/80 tracking-wider">JUMP</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowDown className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-sm text-white/80 tracking-wider">SLIDE</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowLeftRight className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-sm text-white/80 tracking-wider">DODGE</span>
          </div>
        </motion.div>

        {/* High score */}
        {highScore > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 bg-yellow-500/20 px-6 py-2 rounded-full border border-yellow-500/50"
          >
            <span className="text-yellow-400 font-bold text-lg">
              High Score: {Math.floor(highScore).toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* Play button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-2xl md:text-3xl px-12 md:px-16 py-8 md:py-10 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 mr-3 fill-black" />
            KICKOFF
          </Button>
        </motion.div>

        {/* Mobile hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-white/40 text-sm"
        >
          Tap or press Space to start • Swipe or use arrow keys to play
        </motion.p>

        {/* Settings button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-4 right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <Settings className="w-6 h-6 text-white/60" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}
