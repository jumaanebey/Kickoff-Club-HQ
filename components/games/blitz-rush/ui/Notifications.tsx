'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowUp, Flame } from 'lucide-react'
import type { LevelUpEvent, AchievementUnlock } from '../hooks/useProgression'

interface NotificationsProps {
  levelUp: LevelUpEvent | null
  achievement: AchievementUnlock | null
  streakMilestone: { days: number; coins: number } | null
  onDismissLevelUp: () => void
  onDismissAchievement: () => void
  onDismissStreak: () => void
}

export function Notifications({
  levelUp,
  achievement,
  streakMilestone,
  onDismissLevelUp,
  onDismissAchievement,
  onDismissStreak,
}: NotificationsProps) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (levelUp) {
      const t = setTimeout(onDismissLevelUp, 4000)
      return () => clearTimeout(t)
    }
  }, [levelUp, onDismissLevelUp])

  useEffect(() => {
    if (achievement) {
      const t = setTimeout(onDismissAchievement, 4000)
      return () => clearTimeout(t)
    }
  }, [achievement, onDismissAchievement])

  useEffect(() => {
    if (streakMilestone) {
      const t = setTimeout(onDismissStreak, 4000)
      return () => clearTimeout(t)
    }
  }, [streakMilestone, onDismissStreak])

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      <AnimatePresence>
        {levelUp && (
          <motion.div
            key="levelup"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={onDismissLevelUp}
            className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md rounded-xl p-3 border border-indigo-400/30 shadow-lg pointer-events-auto cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ArrowUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-200 uppercase">Level Up!</div>
                <div className="text-sm font-black text-white">
                  Level {levelUp.newLevel} — {levelUp.title}
                </div>
                {levelUp.coinsRewarded > 0 && (
                  <div className="text-[10px] text-indigo-200">+{levelUp.coinsRewarded} coins</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {achievement && (
          <motion.div
            key="achievement"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={onDismissAchievement}
            className="bg-gradient-to-r from-yellow-600/90 to-amber-600/90 backdrop-blur-md rounded-xl p-3 border border-yellow-400/30 shadow-lg pointer-events-auto cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl flex-shrink-0">{achievement.achievement.icon}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  <span className="text-xs font-bold text-yellow-200 uppercase">Achievement Unlocked!</span>
                </div>
                <div className="text-sm font-black text-white">{achievement.achievement.name}</div>
                <div className="text-[10px] text-yellow-200">+{achievement.xpAwarded} XP</div>
              </div>
            </div>
          </motion.div>
        )}

        {streakMilestone && (
          <motion.div
            key="streak"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={onDismissStreak}
            className="bg-gradient-to-r from-orange-600/90 to-red-600/90 backdrop-blur-md rounded-xl p-3 border border-orange-400/30 shadow-lg pointer-events-auto cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-orange-200" />
              </div>
              <div>
                <div className="text-xs font-bold text-orange-200 uppercase">Streak Milestone!</div>
                <div className="text-sm font-black text-white">{streakMilestone.days}-Day Streak</div>
                <div className="text-[10px] text-orange-200">+{streakMilestone.coins} coins</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
