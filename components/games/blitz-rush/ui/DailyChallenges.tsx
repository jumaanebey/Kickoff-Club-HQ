'use client'

import { motion } from 'framer-motion'
import { Target, Coins, CheckCircle2, Clock } from 'lucide-react'
import { useDailyChallenge } from '../hooks/useDailyChallenge'

interface DailyChallengesProps {
  compact?: boolean // Compact mode for start screen widget
}

const TYPE_ICONS: Record<string, string> = {
  score: 'Trophy',
  distance: 'Map',
  coins: 'Coins',
  near_miss_chain: 'Zap',
  combo: 'Flame',
  fever_activations: 'Sparkles',
}

export function DailyChallenges({ compact = false }: DailyChallengesProps) {
  const { challenge, progress, isLoading, claimReward } = useDailyChallenge()

  if (isLoading || !challenge) {
    if (compact) return null
    return (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 animate-pulse">
        <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
        <div className="h-3 w-48 bg-slate-700 rounded" />
      </div>
    )
  }

  const progressValue = progress?.progress || 0
  const isCompleted = progress?.completed || false
  const isClaimed = progress?.reward_claimed || false
  const progressPercent = Math.min(100, (progressValue / challenge.target_value) * 100)

  const handleClaim = async () => {
    await claimReward()
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5 w-full"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-amber-400/60 font-bold uppercase">Daily Challenge</div>
              <div className="text-xs text-white/80 font-medium truncate">{challenge.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="text-[10px] text-amber-400 font-bold">
                {progressValue}/{challenge.target_value}
              </span>
            )}
            <div className="flex items-center gap-0.5 bg-yellow-500/20 px-1.5 py-0.5 rounded">
              <Coins className="w-2.5 h-2.5 text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-bold">{challenge.reward_coins}</span>
            </div>
          </div>
        </div>

        {/* Mini progress bar */}
        {!isCompleted && (
          <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </motion.div>
    )
  }

  // Full display
  return (
    <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-amber-500/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400/60 font-bold uppercase flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Daily Challenge
            </div>
            <div className="text-sm font-bold text-white">{challenge.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
          <Coins className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-yellow-400 font-bold">{challenge.reward_coins}</span>
        </div>
      </div>

      <p className="text-xs text-white/50 mb-3">{challenge.description}</p>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/40">Progress</span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
            {progressValue}/{challenge.target_value}
          </span>
        </div>
        <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
          />
        </div>
      </div>

      {/* Claim button */}
      {isCompleted && !isClaimed && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleClaim}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-sm py-2.5 rounded-xl mt-2 transition-all flex items-center justify-center gap-2"
        >
          <Coins className="w-4 h-4" /> CLAIM {challenge.reward_coins} COINS
        </motion.button>
      )}

      {isClaimed && (
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold mt-2">
          <CheckCircle2 className="w-4 h-4" /> Completed & Claimed!
        </div>
      )}
    </div>
  )
}
