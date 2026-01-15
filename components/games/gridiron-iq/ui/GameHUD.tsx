'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, NFL_TEAMS } from '../hooks/useGameStore'
import { Field } from '../components/Field'
import { Clock, Footprints, Zap, AlertCircle } from 'lucide-react'

// Scoreboard component
function Scoreboard() {
  const {
    playerTeam,
    opponentTeam,
    playerScore,
    opponentScore,
    quarter,
    timeRemaining
  } = useGameStore()

  const playerTeamData = NFL_TEAMS.find(t => t.id === playerTeam)
  const opponentTeamData = NFL_TEAMS.find(t => t.id === opponentTeam)

  // Format time
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/10">
      {/* Player team */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2"
          style={{
            backgroundColor: playerTeamData?.color,
            borderColor: playerTeamData?.secondary
          }}
        >
          {playerTeamData?.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white">{playerScore}</div>
      </div>

      {/* Clock */}
      <div className="flex flex-col items-center">
        <div className="text-white/60 text-xs font-bold">Q{quarter}</div>
        <div className="text-white font-mono font-bold text-lg sm:text-xl flex items-center gap-1">
          <Clock className="w-4 h-4 text-white/60" />
          {timeDisplay}
        </div>
      </div>

      {/* Opponent */}
      <div className="flex items-center gap-2">
        <div className="text-2xl sm:text-3xl font-black text-white">{opponentScore}</div>
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2"
          style={{
            backgroundColor: opponentTeamData?.color,
            borderColor: opponentTeamData?.secondary
          }}
        >
          {opponentTeamData?.name.substring(0, 2).toUpperCase()}
        </div>
      </div>
    </div>
  )
}

// Play clock / pressure indicator
function PlayClock() {
  const playClock = useGameStore(state => state.playClock)
  const phase = useGameStore(state => state.phase)

  if (phase !== 'playing') return null

  const percentage = (playClock / 8) * 100
  const isUrgent = playClock <= 3
  const isCritical = playClock <= 1.5

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
      <motion.div
        animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, repeat: isUrgent ? Infinity : 0 }}
        className={`
          px-4 py-2 rounded-full font-mono font-black text-lg
          ${isCritical ? 'bg-red-600 text-white' : isUrgent ? 'bg-yellow-500 text-black' : 'bg-slate-800/80 text-white'}
          border-2 ${isCritical ? 'border-red-400' : 'border-white/20'}
        `}
      >
        {playClock.toFixed(1)}s
      </motion.div>
    </div>
  )
}

// Down and distance display
function DownDisplay() {
  const { down, yardsToGo, ballPosition, defenseCoverage } = useGameStore()

  const downSuffix = ['st', 'nd', 'rd', 'th'][Math.min(down - 1, 3)]

  // Coverage hint
  const coverageHints: { [key: string]: string } = {
    man: 'Man Coverage - look for crossing routes',
    zone: 'Zone Coverage - find the gaps',
    blitz: 'Blitz! Quick pass or scramble',
    prevent: 'Prevent D - go deep!',
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Down */}
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-black font-black">{down}</span>
            </div>
            <div>
              <div className="text-white font-bold">
                {down}{downSuffix} & {yardsToGo}
              </div>
              <div className="text-white/50 text-xs">
                Ball on {ballPosition <= 50 ? `Own ${ballPosition}` : `OPP ${100 - ballPosition}`}
              </div>
            </div>
          </div>

          {/* Coverage hint */}
          <div className="text-right">
            <div className="text-orange-400 text-xs font-bold uppercase">
              {defenseCoverage}
            </div>
            <div className="text-white/40 text-xs max-w-[150px]">
              {coverageHints[defenseCoverage]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Pre-snap instructions
function PreSnapOverlay() {
  const { phase, snapBall, selectedPlay } = useGameStore()

  if (phase !== 'pre-snap') return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40"
    >
      {/* Play name */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4 text-center"
      >
        <div className="text-green-400 text-xs font-bold uppercase mb-1">
          {selectedPlay?.formation}
        </div>
        <h3 className="text-white font-black text-2xl sm:text-3xl">
          {selectedPlay?.name}
        </h3>
      </motion.div>

      {/* Snap button */}
      <motion.button
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={snapBall}
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-black text-white text-xl shadow-[0_0_30px_rgba(34,197,94,0.5)] border-2 border-white/20"
      >
        TAP TO SNAP
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white/50 text-sm"
      >
        Study the routes, then snap when ready
      </motion.p>
    </motion.div>
  )
}

// Scramble button during play
function ScrambleButton() {
  const { phase, scramble, throwInProgress } = useGameStore()

  if (phase !== 'playing' || throwInProgress) return null

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={scramble}
      className="absolute bottom-24 right-4 z-20 px-4 py-3 bg-orange-500/80 backdrop-blur-sm rounded-xl font-bold text-white text-sm border border-white/20 flex items-center gap-2 hover:bg-orange-600/80 transition-colors"
    >
      <Footprints className="w-4 h-4" />
      SCRAMBLE
    </motion.button>
  )
}

// Play instruction - different for pass vs run
function PlayInstruction() {
  const { phase, throwInProgress, selectedPlay } = useGameStore()

  if (phase !== 'playing' || throwInProgress) return null

  const isRunPlay = selectedPlay?.playType === 'run'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-36 left-1/2 -translate-x-1/2 z-20 text-center"
    >
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold">
        {isRunPlay ? 'TAP the RB to hand off' : 'TAP a receiver to throw'}
      </div>
    </motion.div>
  )
}

// Hand Off button for run plays
function HandOffButton() {
  const { phase, throwInProgress, selectedPlay, handOff } = useGameStore()

  if (phase !== 'playing' || throwInProgress) return null
  if (selectedPlay?.playType !== 'run') return null

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handOff}
      className="absolute bottom-24 left-4 z-20 px-6 py-4 bg-green-500/90 backdrop-blur-sm rounded-xl font-bold text-white text-lg border-2 border-white/30 flex items-center gap-2 hover:bg-green-600/90 transition-colors shadow-lg"
    >
      <Footprints className="w-5 h-5" />
      HAND OFF
    </motion.button>
  )
}

// Main Game HUD
export function GameHUD() {
  const { phase, throwBall, handOff, playerTeam, tick, selectedPlay } = useGameStore()

  const team = NFL_TEAMS.find(t => t.id === playerTeam)
  const teamColor = team?.color || '#22c55e'

  // Game tick loop
  useEffect(() => {
    if (phase !== 'playing') return

    let lastTime = performance.now()
    let animationId: number

    const gameLoop = (time: number) => {
      const delta = (time - lastTime) / 1000
      lastTime = time
      tick(delta)
      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [phase, tick])

  const isGameActive = phase === 'pre-snap' || phase === 'playing'

  if (!isGameActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40"
    >
      {/* Scoreboard - top */}
      <div className="absolute top-3 left-3 right-3 z-20">
        <Scoreboard />
      </div>

      {/* Field */}
      <div className="absolute inset-0 pt-20 pb-24 px-2 sm:px-4">
        <Field
          teamColor={teamColor}
          onReceiverClick={throwBall}
          onRBClick={selectedPlay?.playType === 'run' ? handOff : undefined}
          showRoutes={phase === 'pre-snap'}
        />
      </div>

      {/* Play clock */}
      <PlayClock />

      {/* Pre-snap overlay */}
      <PreSnapOverlay />

      {/* Play instruction */}
      <PlayInstruction />

      {/* Hand off button for run plays */}
      <HandOffButton />

      {/* Scramble button (only for pass plays) */}
      {selectedPlay?.playType !== 'run' && <ScrambleButton />}

      {/* Down display */}
      <DownDisplay />
    </motion.div>
  )
}
