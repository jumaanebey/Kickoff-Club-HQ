'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Coins, Clock, CheckCircle, Gift, Star, Zap, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMissions, useMissionsStore } from '../hooks/useMissions'
import { getTimeUntilReset, ALL_MISSIONS_BONUS, MissionDifficulty } from '../data/missions'
import { cn } from '@/shared/utils'

interface MissionsProps {
  isOpen: boolean
  onClose: () => void
}

const DIFFICULTY_COLORS: Record<MissionDifficulty, { bg: string; border: string; text: string }> = {
  easy: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  hard: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
}

const DIFFICULTY_ICONS: Record<MissionDifficulty, React.ReactNode> = {
  easy: <Star className="w-3 h-3" />,
  medium: <Zap className="w-3 h-3" />,
  hard: <Trophy className="w-3 h-3" />,
}

export function Missions({ isOpen, onClose }: MissionsProps) {
  useMissions() // Initialize missions
  const { missions, allCompletedBonusClaimed, claimMissionReward, claimAllCompletedBonus } = useMissionsStore()
  const [countdown, setCountdown] = useState(getTimeUntilReset())

  // Update countdown every second
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setCountdown(getTimeUntilReset())
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  const allCompleted = missions.length > 0 && missions.every(m => m.completed)
  const completedCount = missions.filter(m => m.completed).length

  if (!isOpen) return null

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
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Daily Missions
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Reset Timer */}
            <div className="mt-3 flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                New missions in{' '}
                <span className="text-white font-bold">
                  {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </span>
              </span>
            </div>

            {/* Progress */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / Math.max(missions.length, 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold text-slate-400">
                {completedCount}/{missions.length}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 space-y-3 max-h-[400px] overflow-y-auto">
            {missions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>Loading missions...</p>
              </div>
            ) : (
              missions.map((mission) => {
                const colors = DIFFICULTY_COLORS[mission.difficulty]
                const progress = Math.min((mission.progress / mission.target) * 100, 100)

                return (
                  <motion.div
                    key={mission.id}
                    layout
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all",
                      mission.completed
                        ? "bg-green-500/10 border-green-500/30"
                        : `${colors.bg} ${colors.border}`
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Difficulty Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        mission.completed
                          ? "bg-green-500/20 text-green-400"
                          : `${colors.bg} ${colors.text}`
                      )}>
                        {mission.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          DIFFICULTY_ICONS[mission.difficulty]
                        )}
                      </div>

                      {/* Mission Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-xs font-bold uppercase",
                            mission.completed ? "text-green-400" : colors.text
                          )}>
                            {mission.difficulty}
                          </span>
                        </div>
                        <p className="text-white font-bold text-sm truncate">
                          {mission.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={cn(
                                "h-full rounded-full",
                                mission.completed
                                  ? "bg-green-400"
                                  : "bg-gradient-to-r from-purple-500 to-blue-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-mono min-w-[60px] text-right">
                            {mission.progress}/{mission.target}
                          </span>
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                          <Coins className="w-4 h-4" />
                          {mission.reward}
                        </div>
                        {mission.completed && (
                          <Button
                            size="sm"
                            onClick={() => claimMissionReward(mission.id)}
                            className="bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-3 py-1 h-auto"
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}

            {/* All Completed Bonus */}
            {allCompleted && !allCompletedBonusClaimed && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold text-sm uppercase">
                      All Missions Complete!
                    </p>
                    <p className="text-white/60 text-xs">
                      Claim your bonus reward
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Coins className="w-5 h-5" />
                      +{ALL_MISSIONS_BONUS}
                    </div>
                    <Button
                      onClick={() => claimAllCompletedBonus()}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Mini missions widget for start screen
export function MissionsWidget({ onClick }: { onClick: () => void }) {
  useMissions() // Initialize
  const { missions } = useMissionsStore()
  const completedCount = missions.filter(m => m.completed).length
  const hasUnclaimedRewards = missions.some(m => m.completed)

  return (
    <button
      onClick={onClick}
      className="relative bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-2xl p-3 transition-all group"
    >
      {/* Notification dot */}
      {hasUnclaimedRewards && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      )}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
          <Star className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-left">
          <p className="text-white font-bold text-sm">Daily Missions</p>
          <p className="text-slate-400 text-xs">
            {completedCount}/{missions.length} completed
          </p>
        </div>
      </div>
    </button>
  )
}
