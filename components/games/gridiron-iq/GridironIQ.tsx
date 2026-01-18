'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, DefensiveFormation, Play, SimulationSpeed, Position } from './hooks/useGameStore'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Zap,
  BookOpen,
  ChevronRight,
  Check,
  X,
  Target,
  Brain,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Flame,
  Play as PlayIcon,
  FastForward,
  SkipForward
} from 'lucide-react'

// Menu Screen
function MenuScreen() {
  const { startGame, showTutorial, highScore, gamesPlayed } = useGameStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/30">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            GRIDIRON <span className="text-green-400">IQ</span>
          </h1>
          <p className="text-slate-400">
            Think like a coach. Beat the defense.
          </p>
        </motion.div>

        {/* Stats */}
        {gamesPlayed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-6"
          >
            <div className="bg-slate-800/50 rounded-xl px-5 py-2">
              <div className="text-xl font-black text-yellow-400">{highScore}</div>
              <div className="text-slate-500 text-xs">High Score</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl px-5 py-2">
              <div className="text-xl font-black text-slate-300">{gamesPlayed}</div>
              <div className="text-slate-500 text-xs">Games</div>
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={startGame}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl shadow-lg shadow-green-500/30"
          >
            START GAME
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            onClick={showTutorial}
            variant="outline"
            className="w-full py-4 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            How to Play
          </Button>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-slate-500 text-sm max-w-sm mx-auto"
        >
          Read the defense and call the perfect play. Learn real NFL concepts while testing your football IQ.
        </motion.p>
      </div>
    </motion.div>
  )
}

// Tutorial Screen
function TutorialScreen() {
  const { skipTutorial } = useGameStore()

  const steps = [
    {
      icon: Target,
      title: 'Read the Defense',
      description: 'Look at the defensive formation. Each coverage has weaknesses you can exploit.'
    },
    {
      icon: BookOpen,
      title: 'Pick the Right Play',
      description: 'Choose from 4 plays. Slants beat man coverage, posts beat Cover 2, etc.'
    },
    {
      icon: Zap,
      title: 'Build Your Streak',
      description: 'Correct = 100 pts. Streak bonus = +25 per consecutive answer!'
    },
    {
      icon: Trophy,
      title: 'Beat Your High Score',
      description: '10 questions per game. Go for the perfect score!'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="w-full max-w-lg py-4">
        <h2 className="text-2xl font-black text-white text-center mb-6">
          HOW TO PLAY
        </h2>

        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">{step.title}</h3>
                <p className="text-slate-400 text-xs">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={skipTutorial}
          className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
        >
          GOT IT - LET'S PLAY
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

// Defensive Formation Display
function DefenseDisplay({ defense }: { defense: DefensiveFormation }) {
  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-t from-green-800 via-green-700 to-green-600 rounded-xl overflow-hidden shadow-inner">
      {/* Field texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)`
        }}
      />

      {/* Yard lines */}
      {[20, 40, 60, 80].map(y => {
        const top = 15 + (y / 100) * 70
        return (
          <div
            key={y}
            className="absolute left-[10%] right-[10%] h-[1px] bg-white/30"
            style={{ top: `${top}%` }}
          />
        )
      })}

      {/* Line of scrimmage */}
      <div
        className="absolute left-[5%] right-[5%] h-1 bg-yellow-400 shadow-lg"
        style={{ top: '80%' }}
      />

      {/* Coverage label */}
      <div className="absolute top-2 left-2 right-2">
        <div className="bg-red-600/90 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
          <div className="text-white font-black text-xs sm:text-sm">{defense.name}</div>
        </div>
      </div>

      {/* Defensive players */}
      {defense.positions.map((player, i) => {
        const screenX = player.position.x
        const screenY = 15 + (player.position.y / 100) * 65

        const colors: { [key: string]: string } = {
          CB: 'bg-red-500',
          S: 'bg-red-600',
          LB: 'bg-red-700',
          DL: 'bg-red-800'
        }

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${screenX}%`, top: `${screenY}%` }}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${colors[player.role]} border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-lg`}
            >
              {player.role}
            </div>
          </motion.div>
        )
      })}

      {/* Offense placeholder (line of scrimmage) */}
      <div className="absolute left-[30%] right-[30%] flex justify-around" style={{ top: '82%' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-500/60 border border-white/40"
          />
        ))}
      </div>
    </div>
  )
}

// Play Option Card
function PlayOptionCard({ play, onClick, disabled }: { play: Play, onClick: () => void, disabled: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
        disabled
          ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
          : 'border-slate-600 bg-slate-800/80 hover:border-green-500 hover:bg-slate-700/80 cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-white text-sm">{play.name}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          play.playType === 'run' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {play.playType.toUpperCase()}
        </span>
      </div>
      <p className="text-slate-400 text-xs">{play.description}</p>
    </motion.button>
  )
}

// Game Screen (Quiz)
function GameScreen() {
  const {
    currentQuestion,
    totalQuestions,
    currentDefense,
    playOptions,
    selectPlay,
    score,
    streak,
    down,
    yardsToGo,
    fieldPosition,
    timeRemaining,
    phase
  } = useGameStore()

  if (phase !== 'playing' || !currentDefense) return null

  const downSuffix = ['st', 'nd', 'rd', 'th'][Math.min(down - 1, 3)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 p-3 sm:p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-slate-400 text-xs sm:text-sm">
            Q <span className="text-white font-bold">{currentQuestion}</span>/{totalQuestions}
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-sm">{streak}</span>
              </div>
            )}
            <div className="text-green-400 font-bold text-sm">{score} pts</div>
          </div>
        </div>

        {/* Situation */}
        <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-white font-bold">
                {down}{downSuffix} & {yardsToGo}
              </div>
              <div className="text-slate-400 text-xs">
                Ball on {fieldPosition < 50 ? `OWN ${fieldPosition}` : `OPP ${100 - fieldPosition}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-xs">{timeRemaining}</div>
            </div>
          </div>
        </div>

        {/* Defense Display */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <h2 className="text-white font-bold text-sm">The defense is showing...</h2>
          </div>
          <DefenseDisplay defense={currentDefense} />

          {/* Defense info */}
          <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
            <div className="text-slate-400 text-xs">{currentDefense.description}</div>
          </div>
        </div>

        {/* Play Options */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-sm text-center">What play do you call?</h3>
          {playOptions.map((play, i) => (
            <motion.div
              key={play.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayOptionCard
                play={play}
                onClick={() => selectPlay(play)}
                disabled={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Simulation Field - Shows the play being run
function SimulationField({
  defense,
  play,
  progress
}: {
  defense: DefensiveFormation
  play: Play
  progress: number
}) {
  // Get route points for animation
  const getRouteProgress = (points: Position[], t: number) => {
    if (points.length < 2) return points[0]

    const totalSegments = points.length - 1
    const segmentLength = 1 / totalSegments
    const currentSegment = Math.min(Math.floor(t / segmentLength), totalSegments - 1)
    const segmentT = (t - currentSegment * segmentLength) / segmentLength

    const start = points[currentSegment]
    const end = points[currentSegment + 1]

    return {
      x: start.x + (end.x - start.x) * segmentT,
      y: start.y + (end.y - start.y) * segmentT,
    }
  }

  // Convert field coordinates to screen position
  const toScreen = (x: number, y: number) => ({
    left: `${x}%`,
    top: `${15 + (y / 100) * 70}%`,
  })

  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-t from-green-800 via-green-700 to-green-600 rounded-xl overflow-hidden shadow-inner">
      {/* Field texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)`
        }}
      />

      {/* Yard lines */}
      {[20, 40, 60, 80].map(y => {
        const top = 15 + (y / 100) * 70
        return (
          <div
            key={y}
            className="absolute left-[10%] right-[10%] h-[1px] bg-white/30"
            style={{ top: `${top}%` }}
          />
        )
      })}

      {/* Line of scrimmage */}
      <div
        className="absolute left-[5%] right-[5%] h-1 bg-yellow-400 shadow-lg"
        style={{ top: '80%' }}
      />

      {/* Routes - Draw the paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Object.entries(play.routes || {}).map(([key, route]) => {
          if (!route.points || route.points.length < 2) return null

          const pathPoints = route.points.map((p, i) => {
            const screen = toScreen(p.x, p.y)
            const x = parseFloat(screen.left)
            const y = parseFloat(screen.top)
            return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`
          }).join(' ')

          return (
            <motion.path
              key={key}
              d={pathPoints.replace(/%/g, '')}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 0.5 }}
              style={{
                vectorEffect: 'non-scaling-stroke',
              }}
            />
          )
        })}
      </svg>

      {/* Offensive players running routes */}
      {Object.entries(play.routes || {}).map(([key, route]) => {
        if (!route.points || route.points.length === 0) return null

        const currentPos = getRouteProgress(route.points, progress)
        const screenPos = toScreen(currentPos.x, currentPos.y)

        const isQB = key === 'QB'
        const isRB = key === 'RB'
        const isBallCarrier = play.playType === 'run' && isRB && progress > 0.2

        return (
          <motion.div
            key={key}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={screenPos}
            animate={screenPos}
            transition={{ duration: 0.1 }}
          >
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold shadow-lg border-2 ${
                isBallCarrier
                  ? 'bg-yellow-500 border-yellow-300'
                  : 'bg-blue-500 border-white'
              }`}
            >
              {key}
            </div>
            {/* Motion trail */}
            {progress > 0.1 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        )
      })}

      {/* QB in pocket */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '88%' }}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
          QB
        </div>
      </motion.div>

      {/* O-Line */}
      <div className="absolute left-[30%] right-[30%] flex justify-around" style={{ top: '82%' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-500/80 border border-white/60"
          />
        ))}
      </div>

      {/* Defensive players - react to the play */}
      {defense.positions.map((player, i) => {
        // Defenders move based on coverage and play progress
        let targetX = player.position.x
        let targetY = player.position.y

        // Get the nearest route to react to
        const routes = Object.values(play.routes || {})
        if (routes.length > 0 && progress > 0.3) {
          const nearestRoute = routes.reduce((nearest, route) => {
            if (!route.points || route.points.length === 0) return nearest
            const routeEnd = route.points[route.points.length - 1]
            const dist = Math.abs(routeEnd.x - player.position.x) + Math.abs(routeEnd.y - player.position.y)
            if (!nearest || dist < nearest.dist) {
              return { route, dist }
            }
            return nearest
          }, null as { route: any, dist: number } | null)

          if (nearestRoute && nearestRoute.dist < 40) {
            const routePos = getRouteProgress(nearestRoute.route.points, Math.min(progress * 0.8, 0.9))
            targetX = player.position.x + (routePos.x - player.position.x) * 0.3 * progress
            targetY = player.position.y + (routePos.y - player.position.y) * 0.3 * progress
          }
        }

        const screenX = targetX
        const screenY = 15 + (targetY / 100) * 65

        const colors: { [key: string]: string } = {
          CB: 'bg-red-500',
          S: 'bg-red-600',
          LB: 'bg-red-700',
          DL: 'bg-red-800'
        }

        return (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            animate={{ left: `${screenX}%`, top: `${screenY}%` }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${colors[player.role]} border-2 border-white flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold shadow-lg`}
            >
              {player.role}
            </div>
          </motion.div>
        )
      })}

      {/* Ball flight (for pass plays) */}
      {play.playType === 'pass' && progress > 0.6 && progress < 0.95 && (
        <motion.div
          className="absolute w-3 h-2 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full shadow-lg"
          style={{ left: '50%', top: '88%' }}
          animate={{
            left: ['50%', '30%'],
            top: ['88%', '50%'],
            rotate: [0, 720],
          }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  )
}

// Simulation Screen
function SimulationScreen() {
  const {
    currentDefense,
    selectedPlay,
    simulationSpeed,
    simulationResult,
    setSimulationSpeed,
    finishSimulation,
    phase
  } = useGameStore()

  const [progress, setProgress] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)

  // Get speed multiplier
  const getSpeedMultiplier = useCallback(() => {
    switch (simulationSpeed) {
      case 'fast': return 2
      case 'skip': return 10
      default: return 1
    }
  }, [simulationSpeed])

  // Run simulation
  useEffect(() => {
    if (phase !== 'simulating') return

    const speedMultiplier = getSpeedMultiplier()
    const interval = setInterval(() => {
      setProgress(p => {
        const newProgress = p + (0.02 * speedMultiplier)
        if (newProgress >= 1) {
          clearInterval(interval)
          setShowOutcome(true)
          return 1
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [phase, getSpeedMultiplier])

  // Auto-advance after showing outcome
  useEffect(() => {
    if (showOutcome) {
      const timer = setTimeout(() => {
        finishSimulation()
      }, simulationSpeed === 'skip' ? 500 : 2000)
      return () => clearTimeout(timer)
    }
  }, [showOutcome, finishSimulation, simulationSpeed])

  if (phase !== 'simulating' || !currentDefense || !selectedPlay) return null

  const outcomeColors: { [key: string]: string } = {
    touchdown: 'from-yellow-500 to-orange-500',
    completion: 'from-green-500 to-emerald-600',
    'run-gain': 'from-green-500 to-emerald-600',
    incomplete: 'from-slate-500 to-slate-600',
    interception: 'from-red-500 to-red-700',
    sack: 'from-red-500 to-red-700',
    'run-loss': 'from-orange-500 to-red-600',
  }

  const outcomeText: { [key: string]: string } = {
    touchdown: 'TOUCHDOWN!',
    completion: 'COMPLETE!',
    'run-gain': 'FIRST DOWN!',
    incomplete: 'INCOMPLETE',
    interception: 'INTERCEPTED!',
    sack: 'SACKED!',
    'run-loss': 'STUFFED!',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 p-3 sm:p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      <div className="max-w-lg mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-bold text-sm">
            {selectedPlay.name}
          </div>
          <div className="text-slate-400 text-xs">
            vs {currentDefense.name}
          </div>
        </div>

        {/* Field */}
        <div className="flex-1 min-h-0 mb-3">
          <SimulationField
            defense={currentDefense}
            play={selectedPlay}
            progress={progress}
          />
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-slate-500 text-xs mr-2">Speed:</span>
          {[
            { speed: 'normal' as SimulationSpeed, icon: PlayIcon, label: '1x' },
            { speed: 'fast' as SimulationSpeed, icon: FastForward, label: '2x' },
            { speed: 'skip' as SimulationSpeed, icon: SkipForward, label: 'Skip' },
          ].map(({ speed, icon: Icon, label }) => (
            <Button
              key={speed}
              size="sm"
              variant={simulationSpeed === speed ? 'default' : 'outline'}
              className={`px-3 py-1 ${
                simulationSpeed === speed
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'border-slate-600 text-slate-400 hover:bg-slate-800'
              }`}
              onClick={() => setSimulationSpeed(speed)}
            >
              <Icon className="w-3 h-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Outcome Overlay */}
        <AnimatePresence>
          {showOutcome && simulationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className={`px-8 py-6 rounded-2xl bg-gradient-to-r ${outcomeColors[simulationResult.outcome]} text-center`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl font-black text-white mb-2"
                >
                  {outcomeText[simulationResult.outcome]}
                </motion.div>
                <p className="text-white/80 text-sm">
                  {simulationResult.description}
                </p>
                {typeof simulationResult.yards === 'number' && simulationResult.yards !== 0 && (
                  <div className="mt-2 text-white font-bold">
                    {simulationResult.yards > 0 ? '+' : ''}{simulationResult.yards} yards
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Result Screen
function ResultScreen() {
  const {
    selectedPlay,
    correctPlay,
    currentDefense,
    simulationResult,
    nextQuestion,
    currentQuestion,
    totalQuestions,
    score,
    streak,
    phase
  } = useGameStore()

  if (phase !== 'result' || !selectedPlay || !correctPlay || !currentDefense) return null

  const isCorrect = selectedPlay.id === correctPlay.id
  const isTouchdown = simulationResult?.outcome === 'touchdown'
  const isTurnover = simulationResult?.outcome === 'interception'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="w-full max-w-lg py-4">
        {/* Result Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {isCorrect ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <X className="w-8 h-8 text-white" />
            )}
          </motion.div>

          <h2 className={`text-2xl font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'GREAT CALL!' : 'WRONG READ'}
          </h2>

          {/* Play result badge */}
          {simulationResult && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mt-2 text-xs font-bold ${
                isTouchdown
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : isTurnover
                    ? 'bg-red-500/20 text-red-400'
                    : isCorrect
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-500/20 text-slate-400'
              }`}
            >
              {isTouchdown && <Trophy className="w-3 h-3" />}
              {simulationResult.description}
            </motion.div>
          )}

          {isCorrect && streak > 1 && (
            <div className="flex items-center justify-center gap-2 text-orange-400 mt-1">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">{streak} streak!</span>
            </div>
          )}
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
        >
          <div className="mb-2">
            <div className="text-slate-400 text-xs mb-0.5">You selected:</div>
            <div className="text-white font-bold text-sm">{selectedPlay.name}</div>
          </div>

          {!isCorrect && (
            <div className="mb-2">
              <div className="text-slate-400 text-xs mb-0.5">Better choice:</div>
              <div className="text-green-400 font-bold text-sm">{correctPlay.name}</div>
            </div>
          )}

          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-yellow-400 font-bold text-xs mb-0.5">Why?</div>
                <p className="text-slate-300 text-xs">
                  Against <span className="text-red-400 font-semibold">{currentDefense.name}</span>:
                  {' '}{currentDefense.weaknesses}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  <span className="text-green-400">{correctPlay.name}</span> exploits this weakness.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-4"
        >
          <div className="text-slate-400 text-xs">Score</div>
          <div className="text-2xl font-black text-white">{score}</div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={nextQuestion}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            {currentQuestion >= totalQuestions ? 'SEE RESULTS' : 'NEXT QUESTION'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Game Over Screen
function GameOverScreen() {
  const { score, highScore, correctAnswers, totalQuestions, bestStreak, resetGame, phase } = useGameStore()

  if (phase !== 'game-over') return null

  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const isNewHighScore = score === highScore && score > 0

  let grade = 'F'
  let gradeColor = 'text-red-400'
  if (percentage >= 90) { grade = 'A+'; gradeColor = 'text-green-400' }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-green-400' }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-yellow-400' }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-orange-400' }
  else if (percentage >= 50) { grade = 'D'; gradeColor = 'text-orange-400' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="w-full max-w-lg text-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="mb-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-black text-white mb-1">GAME OVER</h2>

        {isNewHighScore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-400 font-bold text-sm mb-3"
          >
            NEW HIGH SCORE!
          </motion.div>
        )}

        {/* Grade */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className={`text-6xl font-black ${gradeColor}`}>{grade}</div>
          <div className="text-slate-400 text-sm">Coach Rating</div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-white">{score}</div>
            <div className="text-slate-500 text-xs">Score</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-green-400">{correctAnswers}/{totalQuestions}</div>
            <div className="text-slate-500 text-xs">Correct</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-orange-400">{bestStreak}</div>
            <div className="text-slate-500 text-xs">Streak</div>
          </div>
        </motion.div>

        {/* Play Again */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={resetGame}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            PLAY AGAIN
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main Game Component
export function GridironIQGame() {
  const { phase } = useGameStore()

  return (
    <div className="relative w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {phase === 'menu' && <MenuScreen key="menu" />}
        {phase === 'tutorial' && <TutorialScreen key="tutorial" />}
        {phase === 'playing' && <GameScreen key="playing" />}
        {phase === 'simulating' && <SimulationScreen key="simulating" />}
        {phase === 'result' && <ResultScreen key="result" />}
        {phase === 'game-over' && <GameOverScreen key="game-over" />}
      </AnimatePresence>

      {/* Version indicator */}
      <div className="absolute bottom-2 left-2 text-white/20 text-xs font-mono pointer-events-none z-10">
        Gridiron IQ v3.0
      </div>
    </div>
  )
}

export default GridironIQGame
