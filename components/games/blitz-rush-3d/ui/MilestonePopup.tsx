'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import { triggerHaptic } from '../hooks/useControls'
import { Flag, Zap, Star, Trophy, Crown, Target, Flame, Award } from 'lucide-react'

const MILESTONE_DATA: Record<number, { icon: React.ReactNode; message: string; color: string }> = {
  100: { icon: <Flag className="w-6 h-6" />, message: 'First 100m!', color: 'from-green-400 to-emerald-500' },
  250: { icon: <Zap className="w-6 h-6" />, message: 'Quarter Way!', color: 'from-blue-400 to-cyan-500' },
  500: { icon: <Star className="w-6 h-6" />, message: 'Halfway Hero!', color: 'from-yellow-400 to-amber-500' },
  1000: { icon: <Trophy className="w-6 h-6" />, message: '1 KILOMETER!', color: 'from-orange-400 to-red-500' },
  1500: { icon: <Target className="w-6 h-6" />, message: 'Endurance!', color: 'from-purple-400 to-pink-500' },
  2000: { icon: <Crown className="w-6 h-6" />, message: 'UNSTOPPABLE!', color: 'from-yellow-300 to-yellow-500' },
  3000: { icon: <Flame className="w-6 h-6" />, message: 'ON FIRE!', color: 'from-red-500 to-orange-600' },
  5000: { icon: <Award className="w-6 h-6" />, message: 'LEGENDARY!', color: 'from-purple-600 to-blue-600' },
}

export function MilestonePopup() {
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null)
  const { phase, checkMilestone } = useGameStore()

  useEffect(() => {
    if (phase !== 'playing') return

    const interval = setInterval(() => {
      const milestone = checkMilestone()
      if (milestone) {
        setCurrentMilestone(milestone)
        triggerHaptic('medium')

        // Auto-dismiss after 2 seconds
        setTimeout(() => {
          setCurrentMilestone(null)
        }, 2000)
      }
    }, 100) // Check every 100ms

    return () => clearInterval(interval)
  }, [phase, checkMilestone])

  const data = currentMilestone ? MILESTONE_DATA[currentMilestone] : null

  return (
    <AnimatePresence>
      {currentMilestone && data && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className={`
            px-6 py-3 rounded-2xl
            bg-gradient-to-r ${data.color}
            shadow-[0_0_30px_rgba(255,255,255,0.3)]
            border-2 border-white/30
            flex items-center gap-3
          `}>
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white"
            >
              {data.icon}
            </motion.div>
            <div className="text-center">
              <div className="text-white font-black text-lg uppercase tracking-wide">
                {currentMilestone}m
              </div>
              <div className="text-white/80 text-xs font-bold uppercase">
                {data.message}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Fever mode indicator
export function FeverIndicator() {
  const { isFeverMode, combo, phase } = useGameStore()

  if (phase !== 'playing' || !isFeverMode) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -2, 2, 0],
        }}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
      >
        <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
          <Flame className="w-4 h-4" />
          FEVER MODE x{combo >= 10 ? 3 : 2}
          <Flame className="w-4 h-4" />
        </div>
      </motion.div>
    </motion.div>
  )
}
