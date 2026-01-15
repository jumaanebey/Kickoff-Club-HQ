'use client'

import { useGameStore, Position } from '../hooks/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'

// Field markings
function YardLines() {
  const lines = []

  // Yard lines every 10 yards
  for (let i = 0; i <= 100; i += 10) {
    const y = 5 + (i / 100) * 90 // Map to 5-95% of field height
    lines.push(
      <div
        key={`yard-${i}`}
        className="absolute left-0 right-0 h-[2px] bg-white/40"
        style={{ top: `${y}%` }}
      >
        {/* Yard numbers */}
        {i > 0 && i < 100 && (
          <>
            <span className="absolute left-2 -translate-y-1/2 text-white/30 font-bold text-xs">
              {i <= 50 ? i : 100 - i}
            </span>
            <span className="absolute right-2 -translate-y-1/2 text-white/30 font-bold text-xs">
              {i <= 50 ? i : 100 - i}
            </span>
          </>
        )}
      </div>
    )
  }

  // Hash marks every 5 yards
  for (let i = 5; i < 100; i += 10) {
    const y = 5 + (i / 100) * 90
    lines.push(
      <div
        key={`hash-${i}`}
        className="absolute left-1/3 right-1/3 h-[1px] bg-white/20"
        style={{ top: `${y}%` }}
      />
    )
  }

  return <>{lines}</>
}

// End zones
function EndZones({ playerTeamColor }: { playerTeamColor: string }) {
  return (
    <>
      {/* Own end zone (bottom) */}
      <div
        className="absolute left-0 right-0 top-0 h-[5%] flex items-center justify-center"
        style={{ backgroundColor: playerTeamColor + '40' }}
      >
        <span className="text-white/60 font-black text-xs tracking-[0.3em] uppercase">
          YOUR END ZONE
        </span>
      </div>

      {/* Opponent end zone (top) */}
      <div className="absolute left-0 right-0 bottom-0 h-[5%] bg-red-600/40 flex items-center justify-center">
        <span className="text-white/60 font-black text-xs tracking-[0.3em] uppercase">
          SCORE HERE
        </span>
      </div>
    </>
  )
}

// Line of scrimmage indicator
function LineOfScrimmage({ ballPosition }: { ballPosition: number }) {
  const y = 5 + (ballPosition / 100) * 90

  return (
    <motion.div
      className="absolute left-0 right-0 h-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
      style={{ top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Ball marker */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-2 bg-amber-800 rounded-full border border-white/50" />
    </motion.div>
  )
}

// First down line
function FirstDownLine({ ballPosition, yardsToGo }: { ballPosition: number; yardsToGo: number }) {
  const targetYard = Math.min(100, ballPosition + yardsToGo)
  const y = 5 + (targetYard / 100) * 90

  if (targetYard >= 100) return null // In the end zone, no line needed

  return (
    <motion.div
      className="absolute left-0 right-0 h-[3px] bg-yellow-500/60"
      style={{ top: `${y}%` }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
    >
      <span className="absolute right-2 -translate-y-full text-yellow-400 text-[10px] font-bold">
        1ST DOWN
      </span>
    </motion.div>
  )
}

// Player dot component
interface PlayerDotProps {
  position: Position
  color: string
  label?: string
  isOpen?: boolean
  isTargeted?: boolean
  onClick?: () => void
  isDefender?: boolean
}

export function PlayerDot({
  position,
  color,
  label,
  isOpen,
  isTargeted,
  onClick,
  isDefender
}: PlayerDotProps) {
  // Convert position (0-100) to CSS percentage
  const x = position.x
  const y = 5 + (position.y / 100) * 90 // Map to field area (5-95%)

  return (
    <motion.div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0 }}
      animate={{
        scale: isTargeted ? 1.5 : 1,
        transition: { type: 'spring', stiffness: 300 }
      }}
      onClick={onClick}
    >
      {/* Glow for open receivers */}
      {isOpen && !isDefender && (
        <motion.div
          className="absolute inset-0 -m-3 rounded-full bg-green-400/50"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      {/* Player dot */}
      <div
        className={`
          w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white
          flex items-center justify-center text-white font-bold text-[10px] sm:text-xs
          shadow-lg transition-transform
          ${isDefender ? 'opacity-80' : ''}
          ${onClick ? 'hover:scale-110 active:scale-95' : ''}
        `}
        style={{ backgroundColor: color }}
      >
        {label}
      </div>

      {/* "OPEN" indicator */}
      {isOpen && !isDefender && (
        <motion.span
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-green-400 text-[10px] font-black whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          OPEN!
        </motion.span>
      )}
    </motion.div>
  )
}

// Route visualization
interface RoutePathProps {
  points: Position[]
  color: string
}

export function RoutePath({ points, color }: RoutePathProps) {
  if (points.length < 2) return null

  // Convert points to SVG path
  const pathPoints = points.map(p => ({
    x: p.x,
    y: 5 + (p.y / 100) * 90
  }))

  const pathD = pathPoints.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    return `${acc} L ${point.x} ${point.y}`
  }, '')

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          vectorEffect: 'non-scaling-stroke'
        }}
      />
    </svg>
  )
}

// QB marker
function Quarterback({ teamColor }: { teamColor: string }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-white flex items-center justify-center text-white font-black text-sm shadow-xl"
      style={{
        top: '45%',
        backgroundColor: teamColor,
        boxShadow: `0 0 20px ${teamColor}80`
      }}
    >
      QB
    </div>
  )
}

// Ball animation when thrown
function ThrownBall({ start, end }: { start: Position; end: Position }) {
  const startY = 5 + (start.y / 100) * 90
  const endY = 5 + (end.y / 100) * 90

  return (
    <motion.div
      className="absolute w-4 h-3 bg-amber-800 rounded-full border border-white shadow-lg z-50"
      initial={{
        left: `${start.x}%`,
        top: `${startY}%`,
        scale: 1,
      }}
      animate={{
        left: `${end.x}%`,
        top: `${endY}%`,
        scale: [1, 0.8, 1],
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  )
}

// Main Field Component
interface FieldProps {
  teamColor: string
  onReceiverClick?: (receiverId: string) => void
  showRoutes?: boolean
}

export function Field({ teamColor, onReceiverClick, showRoutes = false }: FieldProps) {
  const {
    phase,
    ballPosition,
    yardsToGo,
    receivers,
    defenders,
    throwInProgress,
    selectedPlay
  } = useGameStore()

  const isPlayActive = phase === 'playing' || phase === 'pre-snap'

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-green-800 to-green-700 overflow-hidden rounded-lg shadow-inner">
      {/* Field texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.1) 10px,
            rgba(0,0,0,0.1) 20px
          )`
        }}
      />

      {/* Field markings */}
      <YardLines />
      <EndZones playerTeamColor={teamColor} />

      {/* Game state indicators */}
      {isPlayActive && (
        <>
          <LineOfScrimmage ballPosition={ballPosition} />
          <FirstDownLine ballPosition={ballPosition} yardsToGo={yardsToGo} />
        </>
      )}

      {/* Route visualization (pre-snap) */}
      {showRoutes && selectedPlay && phase === 'pre-snap' && (
        <>
          {receivers.map(receiver => (
            <RoutePath
              key={`route-${receiver.id}`}
              points={receiver.route.points}
              color={teamColor + '80'}
            />
          ))}
        </>
      )}

      {/* Defenders */}
      <AnimatePresence>
        {isPlayActive && defenders.map(defender => (
          <PlayerDot
            key={defender.id}
            position={defender.currentPosition}
            color="#dc2626"
            label={defender.position.replace(/[0-9]/g, '')}
            isDefender
          />
        ))}
      </AnimatePresence>

      {/* Receivers */}
      <AnimatePresence>
        {isPlayActive && receivers.map(receiver => (
          <PlayerDot
            key={receiver.id}
            position={receiver.currentPosition}
            color={teamColor}
            label={receiver.position.replace(/[0-9]/g, '')}
            isOpen={receiver.isOpen}
            isTargeted={receiver.targeted}
            onClick={phase === 'playing' && onReceiverClick ? () => onReceiverClick(receiver.id) : undefined}
          />
        ))}
      </AnimatePresence>

      {/* Quarterback */}
      {isPlayActive && <Quarterback teamColor={teamColor} />}

      {/* Thrown ball animation */}
      {throwInProgress && receivers.find(r => r.targeted) && (
        <ThrownBall
          start={{ x: 50, y: 45 }}
          end={receivers.find(r => r.targeted)!.currentPosition}
        />
      )}

      {/* Play clock warning overlay */}
      {phase === 'playing' && (
        <PlayClockOverlay />
      )}
    </div>
  )
}

// Play clock warning
function PlayClockOverlay() {
  const playClock = useGameStore(state => state.playClock)

  if (playClock > 3) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0],
        backgroundColor: ['transparent', '#ef4444', 'transparent']
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  )
}

export default Field
