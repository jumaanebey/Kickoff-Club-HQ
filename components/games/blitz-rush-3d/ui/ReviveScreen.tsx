'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Coins, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '../hooks/useGameStore'
import { useShopStore } from '../hooks/useShopStore'
import { triggerHaptic } from '../hooks/useControls'

const REVIVE_COST_BASE = 50
const REVIVE_COST_INCREMENT = 50
const REVIVE_COUNTDOWN = 5 // seconds

interface ReviveScreenProps {
  onRevive: () => void
  onDecline: () => void
  reviveCount: number
}

export function ReviveScreen({ onRevive, onDecline, reviveCount }: ReviveScreenProps) {
  const [countdown, setCountdown] = useState(REVIVE_COUNTDOWN)
  const { totalCoins, spendCoins } = useShopStore()
  const { score, distance, coins } = useGameStore()

  const reviveCost = REVIVE_COST_BASE + (reviveCount * REVIVE_COST_INCREMENT)
  const canAfford = totalCoins >= reviveCost

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  const handleRevive = useCallback(() => {
    if (canAfford) {
      const success = spendCoins(reviveCost)
      if (success) {
        triggerHaptic('medium')
        onRevive()
      }
    }
  }, [canAfford, spendCoins, reviveCost, onRevive])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm mx-4"
      >
        {/* Countdown Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={364}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 364 }}
              transition={{ duration: REVIVE_COUNTDOWN, ease: 'linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Heart className="w-10 h-10 text-red-500 animate-pulse" />
            <span className="text-3xl font-black text-white mt-1">{countdown}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center uppercase tracking-tight mb-2">
          Continue?
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          You made it {Math.floor(distance)}m with {Math.floor(score).toLocaleString()} points!
        </p>

        {/* Revive Button */}
        <motion.div
          animate={{ scale: canAfford ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Button
            onClick={handleRevive}
            disabled={!canAfford}
            className={`
              w-full py-8 text-xl font-black rounded-2xl mb-3
              ${canAfford
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center justify-center gap-3">
              <Heart className="w-6 h-6" />
              <span>REVIVE</span>
              <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{reviveCost}</span>
              </div>
            </div>
          </Button>
        </motion.div>

        {!canAfford && (
          <p className="text-red-400 text-center text-sm mb-3">
            Not enough coins! (You have {totalCoins})
          </p>
        )}

        {/* Decline Button */}
        <Button
          onClick={onDecline}
          variant="ghost"
          className="w-full py-4 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4 mr-2" />
          End Run
        </Button>

        {/* Current Stats */}
        <div className="mt-6 flex justify-center gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-white">{Math.floor(score).toLocaleString()}</div>
            <div className="text-xs text-slate-500 uppercase">Score</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400">+{coins}</div>
            <div className="text-xs text-slate-500 uppercase">Coins</div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-400">{Math.floor(distance)}m</div>
            <div className="text-xs text-slate-500 uppercase">Distance</div>
          </div>
        </div>

        {reviveCount > 0 && (
          <p className="text-slate-500 text-center text-xs mt-4">
            Revive #{reviveCount + 1} • Cost increases each time
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
