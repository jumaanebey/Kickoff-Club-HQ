'use client'

import { useState, useEffect } from 'react'
import { Play, Trophy, HelpCircle, Volume2, VolumeX, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, BookOpen, Brain, BarChart3, Flame, Star } from 'lucide-react'
import type { IQLevel } from '../hooks/useFootballIQ'
import { motion, AnimatePresence } from 'framer-motion'
import { Howler } from 'howler'
import { DailyChallenges } from './DailyChallenges'

const FIRST_RUN_KEY = 'blitz-rush-first-run'

function useIsFirstRun() {
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsFirstRun(localStorage.getItem(FIRST_RUN_KEY) !== 'completed')
    }
  }, [])
  return isFirstRun
}

export function markFirstRunComplete() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FIRST_RUN_KEY, 'completed')
  }
}

function ControlHint({ icon: Icon, label, delay }: { icon: typeof ArrowLeft; label: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="flex flex-col items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.15, 1], backgroundColor: ['rgba(250,204,21,0.2)', 'rgba(250,204,21,0.4)', 'rgba(250,204,21,0.2)'] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-yellow-400/50 flex items-center justify-center"
      >
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
      </motion.div>
      <span className="text-xs sm:text-sm text-white/70 font-medium">{label}</span>
    </motion.div>
  )
}

interface StartScreenProps {
  onStart: (firstRunMode?: boolean) => void
  highScore: number
  onMuteToggle: () => boolean
  footballIQ?: number
  iqLevel?: IQLevel
  discoveredCount?: number
  onOpenTerminology?: () => void
  onOpenLeaderboard?: () => void
  onOpenProgression?: () => void
  playerLevel?: number
  playerTitle?: string
  currentStreak?: number
  isStreakActive?: boolean
}

export function StartScreen({ onStart, highScore, onMuteToggle, footballIQ = 0, iqLevel = 'Rookie', discoveredCount = 0, onOpenTerminology, onOpenLeaderboard, onOpenProgression, playerLevel = 1, playerTitle = 'Rookie', currentStreak = 0, isStreakActive = false }: StartScreenProps) {
  const [muted, setMuted] = useState(true)
  const isFirstRun = useIsFirstRun()

  const handleMuteToggle = () => {
    const newMuted = onMuteToggle()
    setMuted(newMuted)
  }

  if (isFirstRun === null) return null

  if (isFirstRun) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black/85 via-black/75 to-black/85 backdrop-blur-sm px-4">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-6 sm:mb-8">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Blitz Rush!</span>
          </h1>
          <p className="text-white/60 mt-2 text-sm sm:text-base">Learn by playing - you'll get the hang of it fast</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <ControlHint icon={ArrowLeft} label="Left" delay={0.6} />
            <ControlHint icon={ArrowRight} label="Right" delay={0.7} />
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <ControlHint icon={ArrowUp} label="Jump" delay={0.8} />
            <ControlHint icon={ArrowDown} label="Slide" delay={0.9} />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="text-center text-white/40 text-xs mt-4 sm:hidden">Or swipe to move</motion.p>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}>
          <button onClick={() => onStart(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-xl sm:text-2xl px-10 sm:px-14 py-4 sm:py-6 rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20 flex items-center gap-2">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black" />
            TAP TO START
          </button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-6 text-white/50 text-xs sm:text-sm text-center max-w-xs">
          We'll start slow so you can practice dodging and collecting coins
        </motion.p>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={handleMuteToggle}
          className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/10 transition-colors">
          {muted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </motion.button>
      </motion.div>
    )
  }

  // Returning player screen
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative mb-4 sm:mb-6 md:mb-8">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
        <div className="relative text-center">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-yellow-400 mx-auto mb-2 sm:mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
            Blitz <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Rush</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-blue-300 font-bold tracking-widest uppercase mt-1 sm:mt-2">3D Edition</p>
        </div>
      </motion.div>

      {/* Player Level + Streak + High Score badges */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
        className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap justify-center">
        {/* Level badge */}
        <button onClick={onOpenProgression}
          className="flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
          <Star className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-400 font-bold text-xs sm:text-sm">Lv.{playerLevel}</span>
          <span className="text-indigo-400/50 text-[10px]">{playerTitle}</span>
        </button>

        {/* Streak badge */}
        {currentStreak > 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            isStreakActive
              ? 'bg-orange-500/20 border-orange-500/30'
              : 'bg-orange-500/10 border-orange-500/20'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${isStreakActive ? 'text-orange-400' : 'text-orange-400/50'}`} />
            <span className={`font-bold text-xs sm:text-sm ${isStreakActive ? 'text-orange-400' : 'text-orange-400/50'}`}>
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* High score */}
        {highScore > 0 && (
          <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-xs sm:text-sm">{Math.floor(highScore).toLocaleString()}</span>
          </div>
        )}
      </motion.div>

      {/* Football IQ Badge */}
      {footballIQ > 0 && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }}
          className="mb-3 sm:mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-400 font-bold text-xs sm:text-sm">{footballIQ} IQ</span>
            <span className="text-indigo-400/50 text-[10px]">({iqLevel})</span>
          </div>
        </motion.div>
      )}

      {/* Daily Challenge Widget */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.38 }}
        className="mb-3 sm:mb-4 w-full max-w-xs sm:max-w-sm px-4 sm:px-0">
        <DailyChallenges compact />
      </motion.div>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 sm:gap-4 items-center w-full max-w-xs sm:max-w-none px-4 sm:px-0">
        <button onClick={() => onStart(false)}
          className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-xl sm:text-2xl md:text-3xl px-8 sm:px-12 md:px-16 py-5 sm:py-7 md:py-9 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20 flex items-center justify-center gap-2 sm:gap-3">
          <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-black" />
          KICKOFF
        </button>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => onStart(true)}
            className="flex-1 sm:flex-initial border-2 border-white/20 hover:bg-white/10 text-white font-bold px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-colors flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            HOW TO PLAY
          </button>

          {onOpenTerminology && (
            <button onClick={onOpenTerminology}
              className="flex-1 sm:flex-initial border-2 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-bold px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-colors flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">DICTIONARY</span>
              <span className="sm:hidden">DICT</span>
              {discoveredCount > 0 && (
                <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.5 rounded-full">{discoveredCount}</span>
              )}
            </button>
          )}
        </div>

        {onOpenLeaderboard && (
          <button onClick={onOpenLeaderboard}
            className="w-full sm:w-auto border-2 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 font-bold px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-colors flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            LEADERBOARD
          </button>
        )}
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-4 sm:mt-6 md:mt-8 text-white/40 text-xs sm:text-sm text-center px-4">
        <span className="sm:hidden">Tap to start - Swipe to move</span>
        <span className="hidden sm:inline">Tap or press Space to start - Swipe or use arrow keys to play</span>
      </motion.p>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={handleMuteToggle}
        className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/10 transition-colors">
        {muted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
      </motion.button>
    </motion.div>
  )
}
