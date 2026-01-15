'use client'

import { useGameStore, Position } from '../hooks/useGameStore'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'

// Convert game position (0-100 x, 0-100 y where y=100 is endzone) to screen position
// with perspective (behind-QB view)
function toScreenPosition(pos: Position, fieldHeight: number): { x: number; y: number; scale: number } {
  // X stays roughly the same but compress toward center as y increases (perspective)
  const depth = pos.y / 100 // 0 = at QB, 1 = far endzone
  const perspectiveFactor = 0.3 + (1 - depth) * 0.7 // Objects further away are more centered

  // X position: 0-100 maps to field width, with perspective compression
  const centerX = 50
  const xOffset = (pos.x - centerX) * perspectiveFactor
  const screenX = centerX + xOffset

  // Y position: 0 = bottom (QB), 100 = top (endzone)
  // Map to screen where bottom 20% is behind LOS, top is the endzone
  const screenY = 85 - (depth * 70) // 85% at bottom to 15% at top

  // Scale: objects further away appear smaller
  const scale = 0.5 + (1 - depth) * 0.5 // 0.5 to 1.0 scale

  return { x: screenX, y: screenY, scale }
}

// Field markings - behind QB perspective
function FieldMarkings() {
  return (
    <>
      {/* Yard lines - perspective lines getting closer together toward top */}
      {[10, 20, 30, 40, 50, 60, 70, 80].map((yard, i) => {
        const depth = yard / 100
        const y = 85 - (depth * 70)
        const width = 100 - (depth * 40) // Lines get narrower with distance
        const left = (100 - width) / 2

        return (
          <div
            key={yard}
            className="absolute h-[2px] bg-white/30"
            style={{
              top: `${y}%`,
              left: `${left}%`,
              width: `${width}%`,
            }}
          >
            {/* Yard number */}
            {yard <= 50 && (
              <span
                className="absolute -left-8 top-1/2 -translate-y-1/2 text-white/20 font-bold text-xs"
                style={{ fontSize: `${12 - depth * 4}px` }}
              >
                {yard}
              </span>
            )}
          </div>
        )
      })}

      {/* Hash marks */}
      {[15, 25, 35, 45, 55, 65, 75].map((yard) => {
        const depth = yard / 100
        const y = 85 - (depth * 70)
        const width = 30 - (depth * 15)
        const left = (100 - width) / 2

        return (
          <div
            key={`hash-${yard}`}
            className="absolute h-[1px] bg-white/15"
            style={{
              top: `${y}%`,
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        )
      })}
    </>
  )
}

// End zone - at the top with perspective
function EndZone() {
  return (
    <div
      className="absolute top-0 left-[20%] right-[20%] h-[15%] bg-gradient-to-b from-red-600/40 to-red-600/20 flex items-center justify-center rounded-t-lg"
    >
      <span className="text-white/50 font-black text-sm tracking-[0.3em] uppercase">
        END ZONE
      </span>
    </div>
  )
}

// Line of scrimmage
function LineOfScrimmage() {
  return (
    <div
      className="absolute left-[10%] right-[10%] h-1 bg-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
      style={{ top: '75%' }}
    >
      <span className="absolute left-0 -top-5 text-yellow-400/60 text-xs font-bold">
        LINE OF SCRIMMAGE
      </span>
    </div>
  )
}

// First down marker
function FirstDownMarker({ yardsToGo }: { yardsToGo: number }) {
  // Convert yards to go to screen position
  const targetDepth = Math.min(yardsToGo * 2, 80) / 100 // Rough conversion
  const y = 85 - (targetDepth * 70)

  if (yardsToGo > 40) return null // Too far to show

  return (
    <div
      className="absolute left-[15%] right-[15%] h-[3px] bg-yellow-500/50 border-t-2 border-dashed border-yellow-400/70"
      style={{ top: `${y}%` }}
    >
      <span className="absolute right-0 -top-5 text-yellow-400/60 text-[10px] font-bold">
        1ST DOWN
      </span>
    </div>
  )
}

// Player dot with perspective scaling
interface PlayerDotProps {
  position: Position
  color: string
  label?: string
  isOpen?: boolean
  isTargeted?: boolean
  onClick?: () => void
  isDefender?: boolean
  isQB?: boolean
  isRB?: boolean
}

export function PlayerDot({
  position,
  color,
  label,
  isOpen,
  isTargeted,
  onClick,
  isDefender,
  isQB,
  isRB
}: PlayerDotProps) {
  const screen = toScreenPosition(position, 100)

  // Size based on scale and role
  const baseSize = isQB ? 44 : isRB ? 36 : 32
  const size = baseSize * screen.scale

  return (
    <motion.div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        left: `${screen.x}%`,
        top: `${screen.y}%`,
        zIndex: Math.round(100 - screen.y) // Closer = higher z-index
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isTargeted ? 1.3 : 1,
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      {/* Glow for open receivers */}
      {isOpen && !isDefender && (
        <motion.div
          className="absolute rounded-full bg-green-400/60"
          style={{
            width: size * 2,
            height: size * 2,
            left: -size / 2,
            top: -size / 2,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* Player dot */}
      <div
        className={`
          rounded-full border-2 border-white
          flex items-center justify-center text-white font-bold
          shadow-lg transition-transform
          ${isDefender ? 'opacity-80' : ''}
          ${onClick ? 'hover:scale-110 active:scale-95' : ''}
        `}
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          fontSize: Math.max(10, size * 0.35),
        }}
      >
        {label}
      </div>

      {/* "OPEN" indicator */}
      {isOpen && !isDefender && (
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 text-green-400 font-black whitespace-nowrap"
          style={{
            top: size + 4,
            fontSize: Math.max(9, size * 0.3),
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          OPEN!
        </motion.span>
      )}
    </motion.div>
  )
}

// Route path visualization with perspective
interface RoutePathProps {
  startPosition: Position
  points: Position[]
  color: string
  isRun?: boolean
}

export function RoutePath({ startPosition, points, color, isRun }: RoutePathProps) {
  if (points.length < 2) return null

  // Convert all points including start
  const allPoints = [startPosition, ...points]
  const screenPoints = allPoints.map(p => toScreenPosition(p, 100))

  // Create SVG path with smooth curves
  const pathD = screenPoints.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    // Use quadratic curves for smoother lines
    const prev = screenPoints[i - 1]
    const midX = (prev.x + point.x) / 2
    const midY = (prev.y + point.y) / 2
    if (i === 1) return `${acc} L ${point.x} ${point.y}`
    return `${acc} Q ${prev.x} ${prev.y} ${midX} ${midY}`
  }, '') + ` L ${screenPoints[screenPoints.length - 1].x} ${screenPoints[screenPoints.length - 1].y}`

  // Calculate arrow angle
  const lastPoint = screenPoints[screenPoints.length - 1]
  const prevPoint = screenPoints[screenPoints.length - 2]
  const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x) * (180 / Math.PI)

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Glow effect */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={isRun ? '#22c55e' : color}
        strokeWidth="2"
        strokeOpacity="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="blur(2px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Main path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={isRun ? '#22c55e' : color}
        strokeWidth="1"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Animated dash overlay */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.6"
        strokeDasharray="1 3"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeDashoffset: 0 }}
        animate={{ pathLength: 1, strokeDashoffset: -10 }}
        transition={{
          pathLength: { duration: 0.6, ease: 'easeOut' },
          strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* Arrow head at end */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.2 }}
      >
        <g transform={`translate(${lastPoint.x}, ${lastPoint.y}) rotate(${angle})`}>
          <polygon
            points="0,-1.5 3,0 0,1.5"
            fill={isRun ? '#22c55e' : color}
            opacity="0.9"
          />
        </g>
      </motion.g>

      {/* Pulsing endpoint */}
      <motion.circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="1"
        fill={isRun ? '#22c55e' : color}
        opacity="0.8"
        animate={{
          r: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  )
}

// Offensive line representation
function OffensiveLine({ teamColor }: { teamColor: string }) {
  const linePositions = [-15, -7, 0, 7, 15] // Spread across center

  return (
    <>
      {linePositions.map((offset, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + offset}%`,
            top: '78%',
            zIndex: 10,
          }}
        >
          <div
            className="w-6 h-6 rounded border-2 border-white/50 flex items-center justify-center"
            style={{ backgroundColor: teamColor + 'aa' }}
          >
            <span className="text-white/70 text-[8px] font-bold">OL</span>
          </div>
        </div>
      ))}
    </>
  )
}

// Defensive line representation
function DefensiveLine() {
  const linePositions = [-12, -4, 4, 12]

  return (
    <>
      {linePositions.map((offset, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + offset}%`,
            top: '72%',
            zIndex: 15,
          }}
        >
          <div className="w-5 h-5 rounded bg-red-600/80 border border-white/40" />
        </div>
      ))}
    </>
  )
}

// Play clock warning overlay
function PlayClockOverlay() {
  const playClock = useGameStore(state => state.playClock)
  const phase = useGameStore(state => state.phase)

  if (phase !== 'playing' || playClock > 3) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none border-4 border-red-500/50 rounded-lg"
      animate={{
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  )
}

// Flying football animation
interface FlyingBallProps {
  from: Position
  to: Position
  onComplete?: () => void
}

function FlyingBall({ from, to, onComplete }: FlyingBallProps) {
  const fromScreen = toScreenPosition(from, 100)
  const toScreen = toScreenPosition(to, 100)

  return (
    <motion.div
      className="absolute z-[100] pointer-events-none"
      initial={{
        left: `${fromScreen.x}%`,
        top: `${fromScreen.y}%`,
        scale: 1,
      }}
      animate={{
        left: `${toScreen.x}%`,
        top: `${toScreen.y}%`,
        scale: [1, 0.8, 0.6],
      }}
      transition={{
        duration: 0.6,
        ease: [0.2, 0.8, 0.3, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* Football */}
      <motion.div
        className="w-4 h-3 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [0, 360, 720],
        }}
        transition={{ duration: 0.6, ease: 'linear' }}
      >
        <div className="w-full h-full bg-amber-700 rounded-full shadow-lg border border-amber-900"
          style={{
            background: 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #451a03 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        />
      </motion.div>

      {/* Ball trail */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-gradient-to-r from-amber-500/60 to-transparent rounded-full blur-sm"
        style={{ transformOrigin: 'center' }}
        animate={{
          scaleX: [0, 1, 0.5],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}

// Impact burst effect
function ImpactBurst({ position, type }: { position: Position, type: 'catch' | 'drop' | 'tackle' }) {
  const screen = toScreenPosition(position, 100)

  const colors = {
    catch: 'bg-green-400',
    drop: 'bg-red-400',
    tackle: 'bg-orange-400',
  }

  return (
    <motion.div
      className="absolute z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${screen.x}%`, top: `${screen.y}%` }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 2, 3], opacity: [1, 0.5, 0] }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Burst rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 rounded-full ${colors[type]} -translate-x-1/2 -translate-y-1/2`}
          style={{ left: '50%', top: '50%' }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2 + i * 0.5, opacity: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        />
      ))}

      {/* Particle sparks */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <motion.div
            key={`spark-${i}`}
            className={`absolute w-2 h-2 rounded-full ${colors[type]}`}
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * 40,
              y: Math.sin(angle) * 40,
              opacity: 0,
              scale: [1, 0.5, 0],
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )
      })}
    </motion.div>
  )
}

// Player motion trail
function PlayerTrail({ position, color }: { position: Position, color: string }) {
  const screen = toScreenPosition(position, 100)

  return (
    <motion.div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${screen.x}%`,
        top: `${screen.y}%`,
        zIndex: Math.round(100 - screen.y) - 1,
      }}
      initial={{ opacity: 0.6, scale: 1 }}
      animate={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="w-6 h-6 rounded-full blur-sm"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  )
}

// Main Field Component - Behind QB perspective
interface FieldProps {
  teamColor: string
  onReceiverClick?: (receiverId: string) => void
  onRBClick?: () => void
  showRoutes?: boolean
}

export function Field({ teamColor, onReceiverClick, onRBClick, showRoutes = false }: FieldProps) {
  const {
    phase,
    yardsToGo,
    receivers,
    defenders,
    throwInProgress,
    selectedPlay,
    lastPlayResult
  } = useGameStore()

  // Animation states
  const [ballFlight, setBallFlight] = useState<{ from: Position, to: Position } | null>(null)
  const [impact, setImpact] = useState<{ position: Position, type: 'catch' | 'drop' | 'tackle' } | null>(null)
  const [trails, setTrails] = useState<{ id: string, position: Position, color: string }[]>([])

  // Track ball flight when throw is in progress
  const targetedReceiver = receivers.find(r => r.targeted)

  useEffect(() => {
    if (throwInProgress && targetedReceiver) {
      // Start ball flight animation
      setBallFlight({
        from: { x: 50, y: 5 }, // QB position
        to: targetedReceiver.currentPosition
      })
    }
  }, [throwInProgress, targetedReceiver?.id])

  // Show impact when play result comes in
  useEffect(() => {
    if (lastPlayResult && targetedReceiver) {
      const impactType = lastPlayResult.type === 'completion' || lastPlayResult.type === 'touchdown'
        ? 'catch'
        : lastPlayResult.type === 'interception' || lastPlayResult.type === 'sack'
          ? 'tackle'
          : 'drop'

      setImpact({
        position: targetedReceiver.currentPosition,
        type: impactType
      })

      // Clear impact after animation
      const timer = setTimeout(() => setImpact(null), 600)
      return () => clearTimeout(timer)
    }
  }, [lastPlayResult])

  // Generate motion trails for moving players
  useEffect(() => {
    if (phase !== 'playing') return

    const interval = setInterval(() => {
      const newTrails = receivers.map(r => ({
        id: `${r.id}-${Date.now()}`,
        position: { ...r.currentPosition },
        color: teamColor
      }))
      setTrails(prev => [...prev.slice(-20), ...newTrails])
    }, 150)

    return () => clearInterval(interval)
  }, [phase, receivers, teamColor])

  // Clear trails when play ends
  useEffect(() => {
    if (phase !== 'playing') {
      setTrails([])
      setBallFlight(null)
    }
  }, [phase])

  const isPlayActive = phase === 'playing' || phase === 'pre-snap'

  return (
    <div className="relative w-full h-full bg-gradient-to-t from-green-800 via-green-700 to-green-600 overflow-hidden rounded-lg shadow-inner">
      {/* Field texture - grass stripes */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 40px,
            rgba(0,0,0,0.1) 40px,
            rgba(0,0,0,0.1) 80px
          )`
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, transparent 30%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* End zone */}
      <EndZone />

      {/* Field markings */}
      <FieldMarkings />

      {/* Game state indicators */}
      {isPlayActive && (
        <>
          <LineOfScrimmage />
          <FirstDownMarker yardsToGo={yardsToGo} />
        </>
      )}

      {/* Offensive line */}
      {isPlayActive && <OffensiveLine teamColor={teamColor} />}

      {/* Defensive line */}
      {isPlayActive && <DefensiveLine />}

      {/* Route visualization (pre-snap) */}
      {showRoutes && selectedPlay && phase === 'pre-snap' && (
        <>
          {receivers.map(receiver => (
            <RoutePath
              key={`route-${receiver.id}`}
              startPosition={receiver.startPosition}
              points={receiver.route.points}
              color={teamColor}
              isRun={selectedPlay.playType === 'run' && receiver.position === 'RB'}
            />
          ))}
        </>
      )}

      {/* Defenders */}
      <AnimatePresence>
        {isPlayActive && defenders.filter(d => d.position !== 'DL').map(defender => (
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
        {isPlayActive && receivers.filter(r => r.position !== 'RB').map(receiver => (
          <PlayerDot
            key={receiver.id}
            position={receiver.currentPosition}
            color={teamColor}
            label={receiver.position.replace(/[0-9]/g, '')}
            isOpen={receiver.isOpen}
            isTargeted={receiver.targeted}
            onClick={phase === 'playing' && onReceiverClick && !throwInProgress ? () => onReceiverClick(receiver.id) : undefined}
          />
        ))}
      </AnimatePresence>

      {/* Running Back - special handling */}
      <AnimatePresence>
        {isPlayActive && receivers.filter(r => r.position === 'RB').map(rb => (
          <PlayerDot
            key={rb.id}
            position={rb.currentPosition}
            color={teamColor}
            label="RB"
            isRB
            isOpen={rb.isOpen}
            isTargeted={rb.targeted}
            onClick={phase === 'playing' && !throwInProgress ? () => {
              if (onRBClick) onRBClick()
              else if (onReceiverClick) onReceiverClick(rb.id)
            } : undefined}
          />
        ))}
      </AnimatePresence>

      {/* Quarterback - at bottom center */}
      {isPlayActive && (
        <PlayerDot
          position={{ x: 50, y: 5 }}
          color={teamColor}
          label="QB"
          isQB
        />
      )}

      {/* Play clock warning */}
      <PlayClockOverlay />

      {/* Motion trails */}
      <AnimatePresence>
        {trails.map(trail => (
          <PlayerTrail
            key={trail.id}
            position={trail.position}
            color={trail.color}
          />
        ))}
      </AnimatePresence>

      {/* Flying ball animation */}
      <AnimatePresence>
        {ballFlight && (
          <FlyingBall
            from={ballFlight.from}
            to={ballFlight.to}
            onComplete={() => setBallFlight(null)}
          />
        )}
      </AnimatePresence>

      {/* Impact effects */}
      <AnimatePresence>
        {impact && (
          <ImpactBurst
            position={impact.position}
            type={impact.type}
          />
        )}
      </AnimatePresence>

      {/* Sideline indicators */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>
        SIDELINE
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold tracking-widest" style={{ writingMode: 'vertical-rl' }}>
        SIDELINE
      </div>
    </div>
  )
}

export default Field
