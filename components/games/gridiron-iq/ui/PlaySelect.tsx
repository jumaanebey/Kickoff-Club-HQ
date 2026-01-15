'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, NFL_TEAMS, Play } from '../hooks/useGameStore'
import { getPlaySelection } from '../data/playbook'
import { BookOpen, ArrowRight, Zap, Target, Shield } from 'lucide-react'

function PlayCard({
  play,
  index,
  onSelect,
  teamColor
}: {
  play: Play
  index: number
  onSelect: (play: Play) => void
  teamColor: string
}) {
  const [showInfo, setShowInfo] = useState(false)

  const difficultyColors = {
    1: 'bg-green-500',
    2: 'bg-yellow-500',
    3: 'bg-red-500',
  }

  const difficultyLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Advanced',
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <button
        onClick={() => onSelect(play)}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className="w-full text-left p-4 rounded-xl border-2 border-white/10 hover:border-white/30 transition-all bg-slate-800/50 hover:bg-slate-700/50 group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${difficultyColors[play.difficulty]}`}
              >
                {difficultyLabels[play.difficulty]}
              </span>
              <span className="text-white/40 text-xs uppercase">{play.formation}</span>
            </div>

            <h3 className="text-white font-bold text-lg group-hover:text-green-400 transition-colors">
              {play.name}
            </h3>

            <p className="text-white/50 text-sm mt-1">
              {play.description}
            </p>
          </div>

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: teamColor + '40' }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Info button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowInfo(!showInfo)
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/40 transition-colors"
        >
          <BookOpen className="w-3 h-3" />
        </button>
      </button>

      {/* Info popup */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 p-4 bg-slate-900 border border-green-500/30 rounded-xl shadow-xl z-10"
          >
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold mb-2">
              <BookOpen className="w-4 h-4" />
              FOOTBALL 101
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {play.footballLesson}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
              <Shield className="w-3 h-3" />
              Best against: {play.idealCoverage.join(', ')} coverage
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function PlaySelect() {
  const { phase, quarter, down, yardsToGo, ballPosition, selectPlay, playerTeam } = useGameStore()
  const [availablePlays, setAvailablePlays] = useState<Play[]>([])

  const team = NFL_TEAMS.find(t => t.id === playerTeam)
  const teamColor = team?.color || '#22c55e'

  // Get play selection when entering this phase
  useEffect(() => {
    if (phase === 'play-select') {
      const plays = getPlaySelection(quarter, down, yardsToGo)
      setAvailablePlays(plays)
    }
  }, [phase, quarter, down, yardsToGo])

  if (phase !== 'play-select') return null

  // Format down display
  const downSuffix = ['st', 'nd', 'rd', 'th'][Math.min(down - 1, 3)]
  const downDisplay = `${down}${downSuffix} & ${yardsToGo}`

  // Field position display
  const fieldPosition = ballPosition <= 50
    ? `Own ${ballPosition}`
    : ballPosition < 100
      ? `OPP ${100 - ballPosition}`
      : 'Goal Line'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Game info bar */}
      <div className="flex items-center justify-between p-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-4">
          {/* Down and distance */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-black font-black text-sm">{down}</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">{downDisplay}</div>
              <div className="text-white/50 text-xs">{fieldPosition}</div>
            </div>
          </div>
        </div>

        {/* Quarter indicator */}
        <div className="text-right">
          <div className="text-white/50 text-xs uppercase">Quarter</div>
          <div className="text-white font-bold">Q{quarter}</div>
        </div>
      </div>

      {/* Header */}
      <div className="p-4 text-center">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          CALL YOUR PLAY
        </h2>
        <p className="text-white/50 text-sm mt-1">
          Tap a play to see the route diagram, then tap again to run it
        </p>
      </div>

      {/* Play options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {availablePlays.map((play, index) => (
          <PlayCard
            key={play.id}
            play={play}
            index={index}
            onSelect={selectPlay}
            teamColor={teamColor}
          />
        ))}
      </div>

      {/* Hint */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <Zap className="w-4 h-4" />
          <span>Tip: Match your play to beat the defense's coverage</span>
        </div>
      </div>
    </motion.div>
  )
}
