'use client'

import { motion } from 'framer-motion'
import { useGameStore, NFL_TEAMS } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Star,
  RefreshCcw,
  Share2,
  Home,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

// QB Rating component (simplified NFL passer rating)
function QBRating({ completions, attempts, yards, touchdowns, interceptions }: {
  completions: number
  attempts: number
  yards: number
  touchdowns: number
  interceptions: number
}) {
  // Simplified QB rating calculation
  if (attempts === 0) return null

  const compPct = (completions / attempts) * 100
  const yardsPerAtt = yards / attempts
  const tdPct = (touchdowns / attempts) * 100
  const intPct = (interceptions / attempts) * 100

  // Scale to 0-158.3 range (NFL style)
  let rating = 0
  rating += Math.min(2.375, Math.max(0, (compPct - 30) / 20)) * 25
  rating += Math.min(2.375, Math.max(0, (yardsPerAtt - 3) / 4)) * 25
  rating += Math.min(2.375, Math.max(0, tdPct / 5)) * 25
  rating += Math.min(2.375, Math.max(0, (9.5 - intPct) / 4)) * 25

  const ratingValue = Math.round(rating)

  // Grade
  let grade = 'F'
  let gradeColor = 'text-red-400'
  if (ratingValue >= 100) { grade = 'A+'; gradeColor = 'text-green-400' }
  else if (ratingValue >= 90) { grade = 'A'; gradeColor = 'text-green-400' }
  else if (ratingValue >= 80) { grade = 'B+'; gradeColor = 'text-blue-400' }
  else if (ratingValue >= 70) { grade = 'B'; gradeColor = 'text-blue-400' }
  else if (ratingValue >= 60) { grade = 'C+'; gradeColor = 'text-yellow-400' }
  else if (ratingValue >= 50) { grade = 'C'; gradeColor = 'text-yellow-400' }
  else if (ratingValue >= 40) { grade = 'D'; gradeColor = 'text-orange-400' }

  return (
    <div className="text-center">
      <div className="text-white/50 text-xs uppercase mb-1">QB Rating</div>
      <div className="text-4xl font-black text-white">{ratingValue}</div>
      <div className={`text-lg font-bold ${gradeColor}`}>Grade: {grade}</div>
    </div>
  )
}

export function GameOver() {
  const {
    phase,
    playerScore,
    opponentScore,
    playerTeam,
    opponentTeam,
    stats,
    highScore,
    resetGame,
    startGame
  } = useGameStore()

  if (phase !== 'game-over') return null

  const isWin = playerScore > opponentScore
  const isTie = playerScore === opponentScore
  const isNewHighScore = playerScore > 0 && playerScore >= highScore

  const playerTeamData = NFL_TEAMS.find(t => t.id === playerTeam)
  const opponentTeamData = NFL_TEAMS.find(t => t.id === opponentTeam)

  const compPct = stats.attempts > 0
    ? Math.round((stats.completions / stats.attempts) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md my-auto"
      >
        {/* Result header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          {isWin && (
            <>
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              <h2 className="text-4xl font-black text-white">VICTORY!</h2>
            </>
          )}
          {isTie && (
            <>
              <Target className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-4xl font-black text-white">TIE GAME</h2>
            </>
          )}
          {!isWin && !isTie && (
            <>
              <Zap className="w-16 h-16 text-slate-400 mx-auto mb-3" />
              <h2 className="text-4xl font-black text-white">GAME OVER</h2>
            </>
          )}
        </motion.div>

        {/* Final score */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-center gap-6">
            {/* Player team */}
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 mx-auto mb-2"
                style={{
                  backgroundColor: playerTeamData?.color,
                  borderColor: playerTeamData?.secondary
                }}
              >
                {playerTeamData?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-5xl font-black text-white">{playerScore}</div>
            </div>

            <div className="text-white/30 text-2xl font-bold">-</div>

            {/* Opponent */}
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 mx-auto mb-2"
                style={{
                  backgroundColor: opponentTeamData?.color,
                  borderColor: opponentTeamData?.secondary
                }}
              >
                {opponentTeamData?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-5xl font-black text-white">{opponentScore}</div>
            </div>
          </div>

          {/* New high score badge */}
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">NEW HIGH SCORE!</span>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Stats breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-slate-800/50 rounded-xl p-4 text-center col-span-2">
            <QBRating
              completions={stats.completions}
              attempts={stats.attempts}
              yards={stats.yards}
              touchdowns={stats.touchdowns}
              interceptions={stats.interceptions}
            />
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-white">
              {stats.completions}/{stats.attempts}
            </div>
            <div className="text-white/50 text-xs uppercase">Completions</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-white">{compPct}%</div>
            <div className="text-white/50 text-xs uppercase">Comp %</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-green-400">{stats.yards}</div>
            <div className="text-white/50 text-xs uppercase">Total Yards</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-yellow-400">{stats.touchdowns}</div>
            <div className="text-white/50 text-xs uppercase">Touchdowns</div>
          </div>
          {stats.interceptions > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-red-400">{stats.interceptions}</div>
              <div className="text-white/50 text-xs uppercase">Interceptions</div>
            </div>
          )}
          {stats.longestPlay > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-blue-400">{stats.longestPlay}</div>
              <div className="text-white/50 text-xs uppercase">Longest Play</div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={startGame}
            className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            PLAY AGAIN
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: 'Gridiron IQ',
                    text: `I scored ${playerScore} points with a ${compPct}% completion rate! Can you beat my QB rating?`,
                    url: window.location.href,
                  })
                }
              }}
              variant="outline"
              className="py-4 border-white/20 hover:bg-white/10 text-white font-bold rounded-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              SHARE
            </Button>

            <Link href="/games" className="w-full">
              <Button
                variant="outline"
                className="w-full py-4 border-white/20 hover:bg-white/10 text-white font-bold rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                HOME
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
