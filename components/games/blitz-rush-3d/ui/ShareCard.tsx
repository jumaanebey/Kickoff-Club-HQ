'use client'

import { motion } from 'framer-motion'
import { Trophy, Coins, MapPin, Sparkles, Star } from 'lucide-react'

export interface ShareCardProps {
  score: number
  distance: number
  coins: number
  footballFact: string
  isNewHighScore: boolean
}

type FootballIQLevel = 'Rookie' | 'Starter' | 'Pro' | 'All-Star' | 'MVP'

interface LevelConfig {
  label: FootballIQLevel
  color: string
  bgColor: string
  stars: number
}

function getFootballIQLevel(score: number): LevelConfig {
  if (score >= 10000) {
    return { label: 'MVP', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', stars: 5 }
  } else if (score >= 5000) {
    return { label: 'All-Star', color: 'text-purple-400', bgColor: 'bg-purple-400/20', stars: 4 }
  } else if (score >= 2000) {
    return { label: 'Pro', color: 'text-orange-400', bgColor: 'bg-orange-400/20', stars: 3 }
  } else if (score >= 500) {
    return { label: 'Starter', color: 'text-blue-400', bgColor: 'bg-blue-400/20', stars: 2 }
  } else {
    return { label: 'Rookie', color: 'text-slate-400', bgColor: 'bg-slate-400/20', stars: 1 }
  }
}

export function ShareCard({ score, distance, coins, footballFact, isNewHighScore }: ShareCardProps) {
  const level = getFootballIQLevel(score)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700"
      style={{ aspectRatio: '4/5' }}
    >
      {/* Top accent bar */}
      <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500" />

      <div className="p-6 flex flex-col h-full">
        {/* Header - Branding */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
              🏈
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight uppercase">
                Kickoff Club
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Blitz Rush 3D
              </p>
            </div>
          </div>
          {isNewHighScore && (
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              NEW RECORD!
            </motion.div>
          )}
        </div>

        {/* Score Section */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-2">
          {/* Football IQ Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${level.bgColor} border ${level.color.replace('text-', 'border-')} rounded-full px-4 py-1.5 mb-3`}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < level.stars ? level.color : 'text-slate-600'}`}
                    fill={i < level.stars ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className={`font-black text-xs uppercase tracking-wide ${level.color}`}>
                {level.label}
              </span>
            </div>
          </motion.div>

          {/* Main Score */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="text-center mb-4"
          >
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
              Final Score
            </p>
            <div className="relative">
              <p className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 tracking-tighter">
                {Math.floor(score).toLocaleString()}
              </p>
              {/* Glow effect */}
              <div className="absolute inset-0 text-6xl sm:text-7xl font-black text-orange-500/20 blur-xl tracking-tighter">
                {Math.floor(score).toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-6 mb-6"
          >
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <MapPin className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Distance</p>
                <p className="text-white font-black text-sm">{Math.floor(distance)}m</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <Coins className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Coins</p>
                <p className="text-yellow-400 font-black text-sm">{coins}</p>
              </div>
            </div>
          </motion.div>

          {/* Football Fact */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-gradient-to-r from-orange-500/10 via-orange-400/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-4"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-orange-400 text-[10px] font-black uppercase tracking-wider mb-1">
                  Today I Learned
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {footballFact}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer - CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-slate-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">
                Can you beat my score?
              </p>
              <p className="text-orange-400 font-black text-xs tracking-wide">
                kickoffclub.com/play
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-slate-500 text-[10px] font-bold">#BlitzRush3D</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ShareCard
