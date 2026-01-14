'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore, Lane } from './hooks/useGameStore'
import { useAudio } from './hooks/useAudio'
import { useHaptics } from './hooks/useHaptics'

// Football terminology for educational labels
const DEFENDER_POSITIONS = ['LINEBACKER', 'SAFETY', 'CORNERBACK', 'DEFENSIVE END', 'NICKELBACK']
const BARRIER_LABELS = ['OFFENSIVE LINE', 'BLOCKING SLED']

// Educational Label Component - floats above obstacles with billboarding
function EducationalLabel({
  text,
  position,
  color = '#ffffff',
  glowColor = '#22c55e'
}: {
  text: string
  position: [number, number, number]
  color?: string
  glowColor?: string
}) {
  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      {/* Glow/outline effect - slightly larger text behind */}
      <Text
        fontSize={0.35}
        color={glowColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#000000"
        font="/fonts/inter-bold.woff"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ "
      >
        {text}
      </Text>
      {/* Main text on top */}
      <Text
        fontSize={0.32}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        font="/fonts/inter-bold.woff"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ "
      >
        {text}
      </Text>
    </Billboard>
  )
}

// Configuration
const LANE_WIDTH = 3
const SPAWN_DISTANCE = 80
const DESPAWN_DISTANCE = -10
const MIN_OBSTACLE_SPACING = 15
const FIRST_RUN_OBSTACLE_SPACING = 28 // More spacing for tutorial mode
const COLLISION_THRESHOLD_Z = 2
const NEAR_MISS_THRESHOLD = 1.5

type ObstacleType = 'hurdle' | 'defender' | 'barrier' | 'tackledummy'

// Tutorial pattern: teaches lane switching, then jumping, then sliding
// Each obstacle is placed predictably so player learns one mechanic at a time
// Lane 0 = center, -1 = left, 1 = right
// The pattern is designed so within 10 seconds of starting, the player has:
// 1. Dodged an obstacle by switching lanes
// 2. Collected a coin (handled by Collectibles component)
const FIRST_RUN_PATTERN: { type: ObstacleType; lane: Lane }[] = [
  // First: barrier on left side - player starts center, easy pass
  { type: 'barrier', lane: -1 },
  // Second: barrier on center - must switch to left or right
  { type: 'barrier', lane: 0 },
  // Third: hurdle on center - teaches jumping (with a coin behind it as reward)
  { type: 'hurdle', lane: 0 },
  // Fourth: tackle dummy on center - teaches sliding
  { type: 'tackledummy', lane: 0 },
  // Fifth: hurdle on right - combine lane switch + jump awareness
  { type: 'hurdle', lane: 1 },
  // Sixth: defender on left - can dodge or slide under
  { type: 'defender', lane: -1 },
  // After this, switch to normal random patterns but still at slower speed
]

interface Obstacle {
  id: number
  type: ObstacleType
  lane: Lane
  z: number
  hit: boolean
}

// Collision event queue - processed outside of setState
interface CollisionEvent {
  type: 'hit' | 'dodge' | 'nearMiss'
  obstacleId: number
}

// Enhanced Hurdle - Professional track hurdle style
function Hurdle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Educational Label */}
      <EducationalLabel
        text="HURDLE"
        position={[0, 2.0, 0]}
        color="#ffffff"
        glowColor="#ef4444"
      />

      {/* Left post */}
      <mesh position={[-0.9, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.1, 8]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right post */}
      <mesh position={[0.9, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.1, 8]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top bar - striped */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* White stripe accents */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.0, 0.045]} castShadow>
          <boxGeometry args={[0.25, 0.12, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Support bars */}
      <mesh position={[-0.9, 0.05, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.3]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.6} />
      </mesh>
      <mesh position={[0.9, 0.05, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.3]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.6} />
      </mesh>
    </group>
  )
}

// Enhanced Defender - Menacing enemy football player
function Defender({ position, isFever, defenderLabel }: { position: [number, number, number]; isFever?: boolean; defenderLabel?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  // Use the passed label or pick a random one (memoized)
  const positionLabel = useMemo(() => {
    return defenderLabel || DEFENDER_POSITIONS[Math.floor(Math.random() * DEFENDER_POSITIONS.length)]
  }, [defenderLabel])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Menacing sway
    groupRef.current.rotation.y = Math.sin(time * 2) * 0.25
    groupRef.current.position.y = Math.sin(time * 3) * 0.1

    // Arms ready to tackle
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0.6 + Math.sin(time * 4) * 0.15
      rightArmRef.current.rotation.z = -0.6 - Math.sin(time * 4) * 0.15
    }
  })

  const jerseyColor = '#dc2626' // Red
  const helmetColor = '#7f1d1d' // Dark red
  const pantsColor = '#1f2937' // Dark gray

  return (
    <group ref={groupRef} position={position}>
      {/* Educational Label */}
      <EducationalLabel
        text={positionLabel}
        position={[0, 3.8, 0]}
        color="#ffffff"
        glowColor="#dc2626"
      />

      {/* Danger indicator glow */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.08} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.0, 12, 24]} />
        <meshStandardMaterial
          color={jerseyColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* X mark on jersey */}
      <mesh position={[0, 1.3, 0.52]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.48, 24, 24]} />
        <meshStandardMaterial
          color={helmetColor}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Helmet stripe */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.95]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Face mask - menacing */}
      <group position={[0, 2.0, 0.4]}>
        {[-0.12, 0, 0.12].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.55, 0.035, 0.035]} />
            <meshStandardMaterial
              color={isFever ? "#f97316" : "#1f2937"}
              emissive={isFever ? "#f97316" : "#000000"}
              emissiveIntensity={isFever ? 2 : 0}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))}
        {[-0.18, 0, 0.18].map((x, i) => (
          <mesh key={`v${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.035, 0.3, 0.035]} />
            <meshStandardMaterial
              color={isFever ? "#f97316" : "#1f2937"}
              emissive={isFever ? "#f97316" : "#000000"}
              emissiveIntensity={isFever ? 2 : 0}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Shoulder pads - larger and more intimidating */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.65, 1.65, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.2, 0.25, 8, 8]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.65, 1.65, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.2, 0.25, 8, 8]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Left arm - reaching out to tackle */}
      <group ref={leftArmRef} position={[-0.7, 1.4, 0.2]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.5, 8, 12]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.65, 0.15]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 8, 12]} />
          <meshStandardMaterial color="#a16207" roughness={0.7} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.7, 1.4, 0.2]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.5, 8, 12]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.65, 0.15]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 8, 12]} />
          <meshStandardMaterial color="#a16207" roughness={0.7} />
        </mesh>
      </group>

      {/* Legs in blocking stance */}
      <mesh position={[-0.25, 0.35, 0.15]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.5, 8, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.25, 0.35, 0.15]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.5, 8, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.5} />
      </mesh>
    </group>
  )
}

// Enhanced Barrier - Construction barrier style
function Barrier({ position, barrierLabel }: { position: [number, number, number]; barrierLabel?: string }) {
  // Use the passed label or pick a random one (memoized)
  const label = useMemo(() => {
    return barrierLabel || BARRIER_LABELS[Math.floor(Math.random() * BARRIER_LABELS.length)]
  }, [barrierLabel])

  return (
    <group position={position}>
      {/* Educational Label */}
      <EducationalLabel
        text={label}
        position={[0, 4.0, 0]}
        color="#ffffff"
        glowColor="#f97316"
      />

      {/* Main barrier body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.4, 3.0, 0.4]} />
        <meshStandardMaterial
          color="#f97316"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Diagonal warning stripes */}
      {[0.8, 0, -0.8].map((y, i) => (
        <mesh key={i} position={[0, 1.5 + y, 0.21]} rotation={[0, 0, Math.PI / 6]}>
          <planeGeometry args={[3.5, 0.35]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}

      {/* Reflective strips on top */}
      <mesh position={[0, 2.95, 0.21]}>
        <planeGeometry args={[2.3, 0.15]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Support legs */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.25]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.6]} />
          <meshStandardMaterial color="#f97316" roughness={0.8} />
        </mesh>
      ))}

      {/* Warning light on top */}
      <mesh position={[0, 3.15, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight position={[0, 3.2, 0]} color="#fbbf24" intensity={2} distance={4} />
    </group>
  )
}

// Enhanced Tackle Dummy - Professional training equipment
function TackleDummy({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    // Slight wobble as if recently hit
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.03
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 3) * 0.02
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Educational Label */}
      <EducationalLabel
        text="TACKLE DUMMY"
        position={[0, 4.2, 0]}
        color="#ffffff"
        glowColor="#2563eb"
      />

      {/* Heavy base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.0, 0.3, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.85, 0.06, 8, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Main dummy body */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <capsuleGeometry args={[0.55, 2.2, 12, 24]} />
        <meshStandardMaterial
          color="#2563eb"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Body padding seams */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[0, 1.8 + y, 0.56]}>
          <boxGeometry args={[0.8, 0.04, 0.02]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
      ))}

      {/* "Hit here" target zone */}
      <mesh position={[0, 1.5, 0.57]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Head/top */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#f5f5f4" roughness={0.6} />
      </mesh>

      {/* Neck padding */}
      <mesh position={[0, 2.95, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.2, 16]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>

      {/* "SLIDE UNDER" text indicator - warning stripe */}
      <mesh position={[0, 0.8, 0.57]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

// Obstacle component selector
function ObstacleModel({ type, position, isFever }: { type: ObstacleType; position: [number, number, number]; isFever?: boolean }) {
  switch (type) {
    case 'hurdle':
      return <Hurdle position={position} />
    case 'defender':
      return <Defender position={position} isFever={isFever} />
    case 'barrier':
      return <Barrier position={position} />
    case 'tackledummy':
      return <TackleDummy position={position} />
    default:
      return <Hurdle position={position} />
  }
}

// Hitbox dimensions per obstacle type
const HITBOXES: Record<ObstacleType, { width: number; height: number; jumpable: boolean; slideable: boolean }> = {
  hurdle: { width: 1.8, height: 1.2, jumpable: true, slideable: false },
  defender: { width: 1.6, height: 2.5, jumpable: true, slideable: true },
  barrier: { width: 2.5, height: 3, jumpable: false, slideable: false },
  tackledummy: { width: 1.2, height: 3.2, jumpable: false, slideable: true },
}

// Individual obstacle component that manages its own position via ref
function ObstacleInstance({
  obstacle,
  speed,
  isFever,
  onDespawn,
  onCollision,
}: {
  obstacle: Obstacle
  speed: number
  isFever: boolean
  onDespawn: (id: number) => void
  onCollision: (id: number, z: number) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const zRef = useRef(obstacle.z)
  const processedRef = useRef(false)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Update position via ref (no React state update)
    zRef.current -= speed * delta
    groupRef.current.position.z = -zRef.current

    // Despawn check
    if (zRef.current < DESPAWN_DISTANCE) {
      onDespawn(obstacle.id)
      return
    }

    // Report position for collision detection (only when in collision zone)
    if (!processedRef.current && Math.abs(zRef.current) < COLLISION_THRESHOLD_Z + 2) {
      onCollision(obstacle.id, zRef.current)
    }
  })

  // Mark as processed when collision detected externally
  useEffect(() => {
    if (obstacle.hit) {
      processedRef.current = true
    }
  }, [obstacle.hit])

  return (
    <group ref={groupRef} position={[obstacle.lane * LANE_WIDTH, 0, -obstacle.z]}>
      <ObstacleModel type={obstacle.type} position={[0, 0, 0]} isFever={isFever} />
    </group>
  )
}

export function Obstacles() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const lastSpawnZ = useRef(0)
  const obstacleIdRef = useRef(0)
  // Track obstacle positions for collision detection (updated via callback, no state)
  const obstaclePositions = useRef<Map<number, number>>(new Map())
  // Track which obstacles have been processed for collision this frame
  const processedCollisions = useRef<Set<number>>(new Set())
  // Track if game ended this frame to prevent multiple calls
  const gameEndedRef = useRef(false)
  // Batch despawn IDs to reduce state updates
  const despawnQueue = useRef<number[]>([])
  // Track which tutorial pattern obstacle to spawn next
  const tutorialPatternIndex = useRef(0)

  // Only subscribe to values that don't change every frame
  const phase = useGameStore(state => state.phase)
  const isFever = useGameStore(state => state.isFever)
  const difficulty = useGameStore(state => state.difficulty)
  const speed = useGameStore(state => state.speed)
  const isFirstRunMode = useGameStore(state => state.isFirstRunMode)

  const { play } = useAudio()
  const { vibrate } = useHaptics()

  // Spawn obstacles
  const spawnObstacle = useCallback((forceFirstRunPattern = false) => {
    let selectedType: ObstacleType
    let lane: Lane

    // Use tutorial pattern during first-run mode
    const usePattern = forceFirstRunPattern && tutorialPatternIndex.current < FIRST_RUN_PATTERN.length

    if (usePattern) {
      const pattern = FIRST_RUN_PATTERN[tutorialPatternIndex.current]
      selectedType = pattern.type
      lane = pattern.lane
      tutorialPatternIndex.current++
    } else {
      // Normal random spawning
      const types: ObstacleType[] = ['hurdle', 'defender', 'barrier', 'tackledummy']
      const weights = [0.35, 0.35, 0.15, 0.15] // Probability weights

      // Weighted random selection
      const rand = Math.random()
      let cumulative = 0
      selectedType = 'hurdle'
      for (let i = 0; i < types.length; i++) {
        cumulative += weights[i]
        if (rand < cumulative) {
          selectedType = types[i]
          break
        }
      }

      // Random lane, with some patterns
      const laneOptions: Lane[] = [-1, 0, 1]
      lane = laneOptions[Math.floor(Math.random() * laneOptions.length)]
    }

    const newObstacle: Obstacle = {
      id: obstacleIdRef.current++,
      type: selectedType,
      lane,
      z: SPAWN_DISTANCE,
      hit: false,
    }

    setObstacles(prev => [...prev, newObstacle])
  }, [])

  // Handle despawn (batched to reduce re-renders)
  const handleDespawn = useCallback((id: number) => {
    despawnQueue.current.push(id)
    obstaclePositions.current.delete(id)
  }, [])

  // Handle collision position updates from child components
  const handleCollision = useCallback((id: number, z: number) => {
    obstaclePositions.current.set(id, z)
  }, [])

  // Game loop - only handles spawning and collision detection (no position updates)
  useFrame((_, delta) => {
    if (phase !== 'playing' || gameEndedRef.current) return

    // Read frequently-changing values directly from store (no re-renders)
    const {
      speed,
      lane: playerLane,
      playerY,
      isSliding,
      hasShield,
      hasSpeedBoost,
      endGame,
      breakShield,
      addScore,
      addCombo,
      addPopup,
      triggerCameraShake,
      triggerSlowMotion,
    } = useGameStore.getState()

    const movement = speed * delta
    const playerX = playerLane * LANE_WIDTH
    const hitObstacleIds: number[] = []

    // STEP 1: Process despawn queue (batched)
    if (despawnQueue.current.length > 0) {
      const toRemove = new Set(despawnQueue.current)
      despawnQueue.current = []
      setObstacles(prev => prev.filter(obs => !toRemove.has(obs.id)))
    }

    // STEP 2: Collision detection using position refs
    for (const obs of obstacles) {
      if (obs.hit || processedCollisions.current.has(obs.id)) continue

      const currentZ = obstaclePositions.current.get(obs.id)
      if (currentZ === undefined) continue

      const hitbox = HITBOXES[obs.type]
      const obsX = obs.lane * LANE_WIDTH

      // Check Z proximity
      if (Math.abs(currentZ) < COLLISION_THRESHOLD_Z) {
        const xDistance = Math.abs(obsX - playerX)
        const inSameLane = xDistance < (hitbox.width / 2 + 1)

        if (inSameLane) {
          const jumpedOver = hitbox.jumpable && playerY > hitbox.height * 0.7
          const slidUnder = hitbox.slideable && isSliding

          if (!jumpedOver && !slidUnder) {
            // Collision - mark for processing
            processedCollisions.current.add(obs.id)
            hitObstacleIds.push(obs.id)

            if (hasSpeedBoost) {
              // Speed boost = invincibility! Smash through obstacles
              play('nearMiss')
              vibrate('nearMiss')
              addScore(150)
              addPopup('SMASH!', 'juke')
              triggerCameraShake(10)
            } else if (hasShield) {
              // Shield blocks one hit then breaks
              breakShield()
              play('shieldBreak')
              vibrate('shieldBreak')
              addScore(50)
            } else {
              // Game over - set flag FIRST to prevent further processing
              gameEndedRef.current = true
              play('collision')
              vibrate('obstacleHit')
              triggerCameraShake(25)
              triggerSlowMotion(500)
              endGame(obs.type) // Pass the obstacle type as death cause
              break // Exit loop immediately
            }
          } else {
            // Successful dodge
            processedCollisions.current.add(obs.id)
            hitObstacleIds.push(obs.id)
            addCombo()
            addScore(100)
            play('nearMiss')
            vibrate('nearMiss')
            addPopup('DODGE!', 'juke')
          }
        }
      }

      // Near miss detection
      if (!processedCollisions.current.has(obs.id) && Math.abs(currentZ) < NEAR_MISS_THRESHOLD) {
        const xDistance = Math.abs(obsX - playerX)
        if (xDistance < LANE_WIDTH && xDistance > hitbox.width / 2) {
          processedCollisions.current.add(obs.id)
          hitObstacleIds.push(obs.id)
          addScore(50)
          addPopup('NEAR MISS!', 'juke')
          play('nearMiss')
          vibrate('nearMiss')
          triggerCameraShake(5)

          // Emit near-miss sparks
          const emitters = (window as any).__particleEmitters
          if (emitters?.emitNearMissSparks) {
            const direction = playerX > obsX ? 1 : -1
            emitters.emitNearMissSparks(playerX, playerY + 1, 0, direction)
          }
        }
      }
    }

    // STEP 3: Mark hit obstacles (only if there are any)
    if (hitObstacleIds.length > 0) {
      setObstacles(prev => prev.map(obs => ({
        ...obs,
        hit: obs.hit || hitObstacleIds.includes(obs.id),
      })))
    }

    // STEP 4: Spawn new obstacles based on distance traveled
    lastSpawnZ.current -= movement

    // Get current first-run mode from store
    const { isFirstRunMode: currentFirstRunMode } = useGameStore.getState()

    // Use different spacing for tutorial mode - more time between obstacles
    const baseSpacing = currentFirstRunMode ? FIRST_RUN_OBSTACLE_SPACING : MIN_OBSTACLE_SPACING
    const spawnThreshold = baseSpacing - (currentFirstRunMode ? 0 : difficulty * 2)

    if (lastSpawnZ.current <= 0) {
      // In first-run mode, always spawn from pattern; otherwise use random chance
      const shouldSpawn = currentFirstRunMode
        ? tutorialPatternIndex.current < FIRST_RUN_PATTERN.length || Math.random() < 0.4
        : Math.random() < 0.5 + difficulty * 0.1

      if (shouldSpawn) {
        spawnObstacle(currentFirstRunMode)
      }
      lastSpawnZ.current = spawnThreshold
    }
  })

  // Reset obstacles when game restarts
  useEffect(() => {
    if (phase === 'playing') {
      setObstacles([])
      // Use appropriate spacing based on mode
      const initialSpacing = isFirstRunMode ? FIRST_RUN_OBSTACLE_SPACING : MIN_OBSTACLE_SPACING
      lastSpawnZ.current = initialSpacing // Start spawning after initial distance
      gameEndedRef.current = false
      processedCollisions.current.clear()
      obstaclePositions.current.clear()
      despawnQueue.current = []
      tutorialPatternIndex.current = 0 // Reset tutorial pattern
    }
  }, [phase, isFirstRunMode])

  return (
    <group>
      {obstacles.map(obs => (
        <ObstacleInstance
          key={obs.id}
          obstacle={obs}
          speed={speed}
          isFever={isFever}
          onDespawn={handleDespawn}
          onCollision={handleCollision}
        />
      ))}
    </group>
  )
}
