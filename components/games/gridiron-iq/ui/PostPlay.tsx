'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, NFL_TEAMS } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Star,
  Sparkles
} from 'lucide-react'

// Confetti particle for touchdown celebration
function ConfettiParticle({ delay, x }: { delay: number, x: number }) {
  const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6']
  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        backgroundColor: color,
        left: `${x}%`,
        top: '-5%',
      }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: [0, 500],
        x: [0, (Math.random() - 0.5) * 100],
        rotate: [0, Math.random() * 720 - 360],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: [0.1, 0.8, 0.2, 1],
      }}
    />
  )
}

// Touchdown celebration overlay
function TouchdownCelebration() {
  const [particles, setParticles] = useState<{ id: number, delay: number, x: number }[]>([])

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      x: Math.random() * 100,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <>
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
        ))}
      </div>

      {/* Starburst background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.1] }}
        transition={{ duration: 1 }}
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(251,191,36,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Floating stars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${15 + i * 15}%`,
            top: '20%',
          }}
          initial={{ scale: 0, rotate: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            rotate: [0, 180],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.3 + i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Star className="w-6 h-6 fill-yellow-400" />
        </motion.div>
      ))}
    </>
  )
}

export function PostPlay() {
  const { phase, lastPlayResult, selectedPlay, nextPlay, defenseCoverage } = useGameStore()

  if (phase !== 'post-play' || !lastPlayResult) return null

  const isPositive = lastPlayResult.type === 'completion' || lastPlayResult.type === 'touchdown' || lastPlayResult.type === 'rush'
  const isTouchdown = lastPlayResult.type === 'touchdown'
  const isInterception = lastPlayResult.type === 'interception'
  const isSack = lastPlayResult.type === 'sack'
  const isFumble = lastPlayResult.type === 'fumble'
  const isRush = lastPlayResult.type === 'rush'

  // Get icon
  const Icon = isTouchdown
    ? Trophy
    : isInterception || isSack || isFumble
      ? AlertTriangle
      : isPositive
        ? CheckCircle
        : XCircle

  // Get colors
  const bgColor = isTouchdown
    ? 'from-yellow-600 to-orange-600'
    : isInterception || isSack || isFumble
      ? 'from-red-600 to-red-800'
      : isRush
        ? 'from-blue-600 to-blue-800'
        : isPositive
          ? 'from-green-600 to-emerald-700'
          : 'from-slate-600 to-slate-700'

  const iconColor = isTouchdown
    ? 'text-yellow-300'
    : isInterception || isSack || isFumble
      ? 'text-red-300'
      : isPositive
        ? 'text-green-300'
        : 'text-slate-300'

  // Did the play beat the coverage?
  const beatCoverage = selectedPlay?.idealCoverage.includes(defenseCoverage)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      {/* Touchdown celebration */}
      {isTouchdown && <TouchdownCelebration />}

      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b ${bgColor} relative z-10`}
      >
        {/* Result header */}
        <div className="p-6 text-center relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Icon className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-black text-white mb-2"
          >
            {isTouchdown && 'TOUCHDOWN!'}
            {isInterception && 'INTERCEPTED!'}
            {isSack && 'SACKED!'}
            {isFumble && 'FUMBLE!'}
            {isRush && 'RUN!'}
            {lastPlayResult.type === 'completion' && 'COMPLETE!'}
            {lastPlayResult.type === 'incomplete' && 'INCOMPLETE'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg"
          >
            {lastPlayResult.description}
          </motion.p>

          {/* Yards display */}
          {lastPlayResult.yards !== 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-4 inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full"
            >
              <span className="text-white/60">Yards:</span>
              <span className={`font-black text-xl ${lastPlayResult.yards > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {lastPlayResult.yards > 0 ? '+' : ''}{lastPlayResult.yards}
              </span>
            </motion.div>
          )}
        </div>

        {/* Learning moment */}
        {selectedPlay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 pb-4"
          >
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold mb-2">
                <BookOpen className="w-4 h-4" />
                WHAT HAPPENED
              </div>

              <p className="text-white/80 text-sm">
                The defense was in <span className="text-yellow-300 font-bold">{defenseCoverage.toUpperCase()}</span> coverage.
                {beatCoverage
                  ? ` "${selectedPlay.name}" is designed to beat that - great play call!`
                  : ` "${selectedPlay.name}" works better against ${selectedPlay.idealCoverage.join(' or ')} coverage.`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Continue button */}
        <div className="p-6 pt-2">
          <Button
            onClick={nextPlay}
            className="w-full py-6 bg-white/20 hover:bg-white/30 text-white font-black text-lg rounded-xl border border-white/20"
          >
            NEXT PLAY
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Halftime screen
export function HalftimeScreen() {
  const { phase, playerScore, opponentScore, stats, nextPlay } = useGameStore()

  if (phase !== 'halftime') return null

  const isWinning = playerScore > opponentScore
  const isTied = playerScore === opponentScore

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-white mb-2"
        >
          HALFTIME
        </motion.h2>

        {/* Score */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 rounded-2xl p-6 mb-6"
        >
          <div className="text-5xl sm:text-6xl font-black text-white mb-2">
            {playerScore} - {opponentScore}
          </div>
          <div className={`text-lg font-bold ${isWinning ? 'text-green-400' : isTied ? 'text-yellow-400' : 'text-red-400'}`}>
            {isWinning ? 'You\'re Winning!' : isTied ? 'Tied Game!' : 'You\'re Behind'}
          </div>
        </motion.div>

        {/* First half stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-2xl font-black text-white">
              {stats.completions}/{stats.attempts}
            </div>
            <div className="text-white/50 text-xs uppercase">Comp/Att</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-2xl font-black text-green-400">{stats.yards}</div>
            <div className="text-white/50 text-xs uppercase">Yards</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-2xl font-black text-yellow-400">{stats.touchdowns}</div>
            <div className="text-white/50 text-xs uppercase">TDs</div>
          </div>
        </motion.div>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={nextPlay}
            className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            START 2ND HALF
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
