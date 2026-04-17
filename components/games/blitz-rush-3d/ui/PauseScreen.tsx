'use client'

import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { Play, Home, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAudio } from '../hooks/useAudio'

export function PauseScreen() {
  const { phase, resumeGame, score, coins, distance, combo, startGame } = useGameStore()
  const { isMuted, toggleMute } = useAudio()
  const [showConfirmRestart, setShowConfirmRestart] = useState(false)

  if (phase !== 'paused') return null

  const handleRestart = () => {
    setShowConfirmRestart(false)
    startGame()
  }

  const handleQuit = () => {
    useGameStore.setState({ phase: 'menu' })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-6 w-full max-w-sm mx-4"
        >
          <h2 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-wide">
            Paused
          </h2>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs uppercase font-bold">Score</p>
              <p className="text-white text-xl font-black">{Math.floor(score).toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs uppercase font-bold">Coins</p>
              <p className="text-yellow-400 text-xl font-black">{coins}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs uppercase font-bold">Distance</p>
              <p className="text-green-400 text-xl font-black">{Math.floor(distance)}m</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs uppercase font-bold">Combo</p>
              <p className="text-purple-400 text-xl font-black">x{combo}</p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={resumeGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black text-lg py-6 rounded-2xl"
            >
              <Play className="w-6 h-6 mr-2 fill-white" />
              RESUME
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                onClick={toggleMute}
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800 py-5"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-slate-400" />
                )}
              </Button>

              <Button
                onClick={() => setShowConfirmRestart(true)}
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800 py-5"
              >
                <RotateCcw className="w-5 h-5 text-slate-400" />
              </Button>

              <Button
                onClick={handleQuit}
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800 py-5"
              >
                <Home className="w-5 h-5 text-slate-400" />
              </Button>
            </div>
          </div>

          {/* Confirm Restart Dialog */}
          <AnimatePresence>
            {showConfirmRestart && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center p-6"
              >
                <div className="text-center">
                  <p className="text-white font-bold mb-4">Restart this run?</p>
                  <p className="text-slate-400 text-sm mb-6">Your current progress will be lost.</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowConfirmRestart(false)}
                      variant="outline"
                      className="flex-1 border-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRestart}
                      className="flex-1 bg-red-500 hover:bg-red-400"
                    >
                      Restart
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tap to Resume hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-white/40 text-sm"
        >
          Press ESC or tap outside to resume
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
