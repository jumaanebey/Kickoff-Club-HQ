'use client'

import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { Play, Trophy, Settings, ArrowUp, ArrowDown, ArrowLeftRight, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function StartScreen({ onShowTutorial }: { onShowTutorial: () => void }) {
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

          <div className="relative text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />

            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
              Blitz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Rush
              </span>
            </h1>

            <p className="text-xl text-blue-300 font-bold tracking-widest uppercase mt-2">
              3D Edition
            </p>
          </div>
        </motion.div>

        {/* High score */}
        {highScore > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-yellow-500/20 px-6 py-2 rounded-full border border-yellow-500/50"
          >
            <span className="text-yellow-400 font-bold text-lg">
              High Score: {Math.floor(highScore).toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 items-center"
        >
          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-2xl md:text-3xl px-12 md:px-16 py-8 md:py-10 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 mr-3 fill-black" />
            KICKOFF
          </Button>

          <Button
            onClick={onShowTutorial}
            variant="outline"
            className="border-white/20 hover:bg-white/10 text-white font-bold px-8 py-6 rounded-2xl"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            HOW TO PLAY
          </Button>
        </motion.div>

        {/* Mobile hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-white/40 text-sm"
        >
          Tap or press Space to start • Swipe or use arrow keys to play
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
