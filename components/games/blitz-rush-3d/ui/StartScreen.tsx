'use client'

import { useState } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { useAudio } from '../hooks/useAudio'
import { Button } from '@/components/ui/button'
import { Play, Trophy, HelpCircle, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howler } from 'howler'

export function StartScreen({ onShowTutorial }: { onShowTutorial: () => void }) {
  const { phase, highScore, startGame } = useGameStore()
  const { toggleMute } = useAudio()
  const [muted, setMuted] = useState(true) // Start muted

  const handleMuteToggle = () => {
    const newMuted = toggleMute()
    setMuted(newMuted)
  }

  const handleStart = () => {
    // Unlock audio context on first user gesture
    if (typeof window !== 'undefined' && Howler.ctx) {
      if (Howler.ctx.state === 'suspended') {
        Howler.ctx.resume()
      }
    }
    startGame()
  }

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
          className="relative mb-4 sm:mb-6 md:mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />

          <div className="relative text-center">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-yellow-400 mx-auto mb-2 sm:mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
              Blitz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Rush
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-blue-300 font-bold tracking-widest uppercase mt-1 sm:mt-2">
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
            className="mb-4 sm:mb-6 md:mb-8 bg-yellow-500/20 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-yellow-500/50"
          >
            <span className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg">
              High Score: {Math.floor(highScore).toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 sm:gap-4 items-center w-full max-w-xs sm:max-w-none px-4 sm:px-0"
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-xl sm:text-2xl md:text-3xl px-8 sm:px-12 md:px-16 py-6 sm:py-8 md:py-10 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 fill-black" />
            KICKOFF
          </Button>

          <Button
            onClick={onShowTutorial}
            variant="outline"
            className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white font-bold px-6 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-base"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            HOW TO PLAY
          </Button>
        </motion.div>

        {/* Mobile hint - different message for touch vs desktop */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 sm:mt-6 md:mt-8 text-white/40 text-xs sm:text-sm text-center px-4"
        >
          <span className="sm:hidden">Tap to start • Swipe to move</span>
          <span className="hidden sm:inline">Tap or press Space to start • Swipe or use arrow keys to play</span>
        </motion.p>

        {/* Mute Button - Top right corner */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleMuteToggle}
          className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
          ) : (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}
