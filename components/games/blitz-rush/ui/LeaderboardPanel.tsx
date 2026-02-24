'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Crown, Medal, Award, ChevronUp } from 'lucide-react'
import { useLeaderboard, type LeaderboardPeriod } from '../hooks/useLeaderboard'

interface LeaderboardPanelProps {
  onClose: () => void
  currentScore?: number
}

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  daily: 'Today',
  weekly: 'This Week',
  alltime: 'All Time',
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />
  if (rank === 3) return <Award className="w-4 h-4 text-orange-400" />
  return <span className="text-xs font-bold text-white/40 w-4 text-center">{rank}</span>
}

export function LeaderboardPanel({ onClose, currentScore }: LeaderboardPanelProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>('alltime')
  const { leaderboard, myRank, isLoading } = useLeaderboard(period)

  // Find the "ghost score" — next score above current
  const ghostScore = currentScore
    ? leaderboard.find(e => e.score > currentScore)?.score
    : null

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
        className="bg-slate-900 border-2 border-yellow-500/30 rounded-2xl w-full max-w-md max-h-[85%] flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                Leaderboard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Period tabs */}
          <div className="flex gap-1.5 bg-slate-800/50 rounded-lg p-1">
            {(['daily', 'weekly', 'alltime'] as LeaderboardPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${
                  period === p
                    ? 'bg-yellow-500/20 text-yellow-400 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>

          {/* My rank + ghost score */}
          <div className="flex items-center gap-2 mt-3">
            {myRank && (
              <div className="flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1 rounded-lg">
                <ChevronUp className="w-3 h-3 text-indigo-400" />
                <span className="text-indigo-400 text-xs font-bold">Your Rank: #{myRank}</span>
              </div>
            )}
            {ghostScore && (
              <div className="text-[10px] text-white/30">
                Beat <span className="text-yellow-400 font-bold">{ghostScore.toLocaleString()}</span> to rank up
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              No scores yet for this period. Be the first!
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {leaderboard.map((entry, i) => {
                const isTop3 = entry.rank <= 3
                const isCurrentUser = myRank === entry.rank

                return (
                  <motion.div
                    key={`${entry.userId}-${entry.rank}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isCurrentUser
                        ? 'bg-indigo-500/15 border border-indigo-500/30'
                        : isTop3
                        ? 'bg-yellow-500/5 border border-yellow-500/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-6 flex items-center justify-center flex-shrink-0">
                      <RankIcon rank={entry.rank} />
                    </div>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      isTop3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-white/40'
                    }`}>
                      {entry.displayName.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold truncate ${isCurrentUser ? 'text-indigo-300' : 'text-white/80'}`}>
                        {entry.displayName}
                        {isCurrentUser && <span className="text-indigo-400 text-[10px] ml-1">(You)</span>}
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`text-sm font-black flex-shrink-0 ${
                      isTop3 ? 'text-yellow-400' : 'text-white/60'
                    }`}>
                      {entry.score.toLocaleString()}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
