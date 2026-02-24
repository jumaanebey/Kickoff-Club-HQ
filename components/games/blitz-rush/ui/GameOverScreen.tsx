'use client'

import { useEffect, useState, useMemo } from 'react'
import { RotateCcw, Home, Trophy, Coins, Target, Skull, Lightbulb, GraduationCap, Flame, Brain, BarChart3, Star, Sparkles } from 'lucide-react'
import type { IQLevel } from '../hooks/useFootballIQ'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameProgress } from '@/hooks/use-game-progress'
import type { GameSnapshot } from '../engine/core/EventBus'
import { markFirstRunComplete } from './StartScreen'
import { ShareCard } from './ShareCard'

const FOOTBALL_FACTS = [
  { term: 'Blitz', definition: 'When extra defenders rush the quarterback instead of covering receivers. High-risk, high-reward!' },
  { term: 'Safety', definition: 'Worth 2 points, it happens when the offense is tackled in their own end zone.' },
  { term: 'Touchdown', definition: 'Worth 6 points, scored when a player carries the ball into the opponent\'s end zone.' },
  { term: 'Field Goal', definition: 'Worth 3 points, scored by kicking the ball through the goalposts.' },
  { term: 'Quarterback', definition: 'The leader of the offense who throws passes and calls plays.' },
  { term: 'First Down', definition: 'The offense has 4 tries to move the ball 10 yards for a fresh set of downs!' },
  { term: 'Interception', definition: 'When a defender catches a pass meant for the offense — a turnover!' },
  { term: 'Fumble', definition: 'When a player drops the ball while running. Either team can recover it!' },
  { term: 'Huddle', definition: 'When players gather in a circle to discuss the next play secretly.' },
  { term: 'End Zone', definition: 'The 10-yard area at each end of the field. Score a touchdown by getting here!' },
  { term: 'Hail Mary', definition: 'A desperate long pass thrown at the end of a half, hoping for a miracle catch.' },
  { term: 'Sack', definition: 'When the quarterback is tackled behind the line of scrimmage.' },
  { term: 'Two-Point Conversion', definition: 'After a TD, teams can try for 2 extra points by running or passing into the end zone.' },
  { term: 'Snap', definition: 'The center passes the ball between their legs to the quarterback to start every play.' },
  { term: 'Red Zone', definition: 'The area between the 20-yard line and the goal line. Offenses must score here!' },
]

const DEATH_TIPS: Record<string, string> = {
  hurdle: 'Jump over hurdles with the up arrow or swipe up. Time it right!',
  defender: 'Defenders can be dodged by switching lanes early. Watch their movement!',
  barrier: 'Barriers block the whole lane - switch lanes quickly to avoid them!',
  tackledummy: 'Slide under tackle dummies with the down arrow or swipe down.',
  doublehurdle: 'Double hurdles need a perfectly timed jump at full height.',
  rollingbarrel: 'Rolling barrels move between lanes - read the pattern and jump over them!',
  twolanewall: 'Two-lane walls block most of the field. Find the one open lane quickly!',
  sprintzone: 'Sprint zones are narrow - stay centered in the lane to thread through safely!',
}

interface GameOverScreenProps {
  snapshot: GameSnapshot
  onRestart: () => void
  onMuteToggle: () => boolean
  footballIQ?: number
  iqLevel?: IQLevel
  onOpenLeaderboard?: () => void
  playerLevel?: number
  playerTitle?: string
  xpEarned?: number
}

export function GameOverScreen({ snapshot, onRestart, onMuteToggle, footballIQ = 0, iqLevel = 'Rookie', onOpenLeaderboard, playerLevel = 1, playerTitle = 'Rookie', xpEarned = 0 }: GameOverScreenProps) {
  const { markGameCompleted } = useGameProgress()
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const todaysFact = useMemo(() => {
    return FOOTBALL_FACTS[Math.floor(Math.random() * FOOTBALL_FACTS.length)]
  }, [])

  const nearMissStats = useMemo(() => {
    const stats: { message: string; icon: string }[] = []

    if (!isNewHighScore && snapshot.previousHighScore > 0) {
      const gap = snapshot.previousHighScore - snapshot.score
      if (gap > 0 && gap <= snapshot.previousHighScore * 0.2) {
        stats.push({ message: `You were ${Math.floor(gap).toLocaleString()} points from your high score!`, icon: 'distance' })
      }
    }

    const coinsToMilestone = 100 - (snapshot.coins % 100)
    if (coinsToMilestone <= 20 && coinsToMilestone > 0) {
      stats.push({ message: `${coinsToMilestone} more coins to reach ${Math.ceil(snapshot.coins / 100) * 100}!`, icon: 'coins' })
    }

    if (snapshot.feverMeter >= 70 && snapshot.feverMeter < 100) {
      stats.push({ message: `${Math.floor(100 - snapshot.feverMeter)}% more to activate Fever Mode!`, icon: 'fever' })
    }

    return stats
  }, [snapshot, isNewHighScore])

  useEffect(() => {
    if (snapshot.score > 0) {
      markGameCompleted('blitz-rush-3d', Math.floor(snapshot.score), snapshot.coins)
      setIsNewHighScore(snapshot.score > snapshot.previousHighScore)
    }
    if (snapshot.isFirstRunMode) {
      markFirstRunComplete()
    }
  }, [snapshot, markGameCompleted])

  const quickTip = snapshot.deathCause ? DEATH_TIPS[snapshot.deathCause] : null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl relative overflow-hidden my-auto">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative text-center flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
              <Skull className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-500" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">Game Over</h2>
              {isNewHighScore && (
                <div className="bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full inline-block animate-bounce">NEW HIGH SCORE!</div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full">
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Score
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-white">{Math.floor(snapshot.score).toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Coins
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-yellow-400">{snapshot.coins}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Distance
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-slate-200">{Math.floor(snapshot.distance)}m</div>
              </div>
              {footballIQ > 0 && (
                <div className="bg-indigo-500/10 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-indigo-500/20">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                    <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Football IQ
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-bold text-indigo-300">{footballIQ} <span className="text-xs text-indigo-400/50">({iqLevel})</span></div>
                </div>
              )}
            </div>

            {/* XP Earned */}
            {xpEarned > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="w-full flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="flex items-center gap-2 text-indigo-300 text-xs sm:text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>+{xpEarned} XP earned</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400 text-[10px] sm:text-xs font-bold">
                  <Star className="w-3 h-3" />
                  Lv.{playerLevel} {playerTitle}
                </div>
              </motion.div>
            )}

            {/* Near Miss Stats */}
            {nearMissStats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full space-y-1.5 sm:space-y-2">
                {nearMissStats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
                    <div className="flex items-center gap-2 text-orange-300 text-xs sm:text-sm font-medium">
                      {stat.icon === 'distance' && <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      {stat.icon === 'coins' && <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      {stat.icon === 'fever' && <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      <span>{stat.message}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quick Tip */}
            {quickTip && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="w-full bg-blue-500/15 border border-blue-500/30 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="flex items-start gap-2 text-blue-300">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold uppercase text-blue-400 mb-0.5">Quick Tip</div>
                    <div className="text-xs sm:text-sm">{quickTip}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Today You Learned */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-start gap-2 text-emerald-300">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs font-bold uppercase text-emerald-400 mb-1">Today You Learned</div>
                  <div className="text-sm sm:text-base font-bold text-white mb-0.5">{todaysFact.term}</div>
                  <div className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">{todaysFact.definition}</div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full mt-1 sm:mt-2">
              <button onClick={onRestart}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-[0_4px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> REPLAY
              </button>

              {/* Share Card */}
              <ShareCard snapshot={snapshot} footballIQ={footballIQ} iqLevel={iqLevel} />

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {onOpenLeaderboard && (
                  <button onClick={onOpenLeaderboard}
                    className="border-2 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> RANKS
                  </button>
                )}
                <Link href="/games/blitz-rush" className={onOpenLeaderboard ? 'w-full' : 'w-full col-span-2'}>
                  <button className="w-full border-2 border-slate-700 hover:bg-slate-800 text-slate-200 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> MENU
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
