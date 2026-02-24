'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Star, Lock, Flame, ChevronRight, Sparkles } from 'lucide-react'
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  RARITY_COLORS,
  TOTAL_ACHIEVEMENTS,
  type AchievementCategory,
  type AchievementDef,
} from '../data/achievements'

interface ProgressionPanelProps {
  onClose: () => void
  xp: number
  level: number
  title: string
  levelProgress: number
  nextLevelXP: number
  currentLevelXP: number
  unlockedAchievementIds: Set<string>
  gamesPlayed: number
  currentStreak: number
  longestStreak: number
  isStreakActive: boolean
}

function AchievementCard({ def, unlocked }: { def: AchievementDef; unlocked: boolean }) {
  const rarity = RARITY_COLORS[def.rarity]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-3 rounded-xl border transition-colors ${
        unlocked
          ? `${rarity.bg} ${rarity.border}`
          : 'bg-slate-800/30 border-slate-700/30 opacity-60'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`text-2xl flex-shrink-0 ${unlocked ? '' : 'grayscale opacity-40'}`}>
          {unlocked ? def.icon : '🔒'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold truncate ${unlocked ? rarity.text : 'text-white/40'}`}>
              {def.name}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
              unlocked ? `${rarity.bg} ${rarity.text}` : 'bg-slate-700/50 text-white/30'
            }`}>
              {def.rarity}
            </span>
          </div>
          <p className={`text-[10px] mt-0.5 leading-tight ${unlocked ? 'text-white/50' : 'text-white/25'}`}>
            {unlocked ? def.description : def.hint}
          </p>
          {unlocked && (
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
              <span className="text-[9px] text-yellow-400 font-bold">+{def.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ProgressionPanel({
  onClose,
  xp,
  level,
  title,
  levelProgress,
  nextLevelXP,
  currentLevelXP,
  unlockedAchievementIds,
  gamesPlayed,
  currentStreak,
  longestStreak,
  isStreakActive,
}: ProgressionPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview')
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all')

  const filteredAchievements = activeCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory)

  const unlockedCount = unlockedAchievementIds.size

  // Group achievements by category for overview
  const categoryProgress = ACHIEVEMENT_CATEGORIES.map(cat => {
    const total = ACHIEVEMENTS.filter(a => a.category === cat.key).length
    let unlocked = 0
    ACHIEVEMENTS.filter(a => a.category === cat.key).forEach(a => {
      if (unlockedAchievementIds.has(a.id)) unlocked++
    })
    return { ...cat, total, unlocked }
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border-2 border-indigo-500/30 rounded-2xl w-full max-w-md max-h-[90%] flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                Progression
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Level & XP Bar */}
          <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-lg font-black text-indigo-400">{level}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{title}</div>
                  <div className="text-[10px] text-white/40">{xp.toLocaleString()} XP total</div>
                </div>
              </div>
              {nextLevelXP !== Infinity && (
                <div className="text-right">
                  <div className="text-[10px] text-white/40">Next level</div>
                  <div className="text-xs font-bold text-indigo-400">{nextLevelXP.toLocaleString()} XP</div>
                </div>
              )}
            </div>
            {nextLevelXP !== Infinity && (
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/30 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-white">{gamesPlayed}</div>
              <div className="text-[9px] text-white/40 uppercase font-bold">Games</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className={`w-3.5 h-3.5 ${isStreakActive ? 'text-orange-400' : 'text-white/30'}`} />
                <span className="text-sm font-bold text-white">{currentStreak}</span>
              </div>
              <div className="text-[9px] text-white/40 uppercase font-bold">Streak</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-sm font-bold text-white">{unlockedCount}/{TOTAL_ACHIEVEMENTS}</span>
              </div>
              <div className="text-[9px] text-white/40 uppercase font-bold">Badges</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 bg-slate-800/50 rounded-lg p-1 mt-3">
            {(['overview', 'achievements'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-xs font-bold py-2 rounded-md transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-2"
              >
                {/* Streak info */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white">Daily Streak</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-orange-400">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</div>
                      <div className="text-[10px] text-white/40">Best: {longestStreak} days</div>
                    </div>
                    <div className="flex gap-1">
                      {[3, 7, 14, 30].map(milestone => (
                        <div
                          key={milestone}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border ${
                            currentStreak >= milestone
                              ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                              : 'bg-slate-800/50 border-slate-700/30 text-white/20'
                          }`}
                        >
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category progress */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-white/60 uppercase px-1">Achievement Progress</div>
                  {categoryProgress.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => { setActiveTab('achievements'); setActiveCategory(cat.key) }}
                      className="w-full flex items-center gap-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl p-3 transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-bold text-white">{cat.label}</div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${cat.total > 0 ? (cat.unlocked / cat.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-white/40">{cat.unlocked}/{cat.total}</div>
                      <ChevronRight className="w-3 h-3 text-white/20" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {/* Category filter */}
                <div className="flex gap-1 flex-wrap mb-3">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    All ({TOTAL_ACHIEVEMENTS})
                  </button>
                  {ACHIEVEMENT_CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                        activeCategory === cat.key
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Achievement grid */}
                <div className="space-y-2">
                  {filteredAchievements.map(def => (
                    <AchievementCard
                      key={def.id}
                      def={def}
                      unlocked={unlockedAchievementIds.has(def.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
