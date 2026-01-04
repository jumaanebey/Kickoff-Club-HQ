'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, Lane, PowerupType } from './hooks/useGameStore'
import { useAudio } from './hooks/useAudio'

// Configuration
const LANE_WIDTH = 3
const SPAWN_DISTANCE = 80
const DESPAWN_DISTANCE = -10
const COLLECTION_RADIUS = 2
const MAGNET_RANGE = 15
const MAGNET_SPEED = 25

type CollectibleType = 'coin' | 'megacoin' | 'magnet' | 'shield' | 'speed' | 'multiplier'

interface Collectible {
  id: number
  type: CollectibleType
  lane: Lane
  z: number
  y: number
  collected: boolean
  magnetPull: boolean
}

// Sparkle points for mega coin - uses useFrame for stable animation
function SparklePoints() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(time * 5 + i) * 0.1
    })
  })

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 2) * 0.7,
            0,
            Math.sin(i * Math.PI / 2) * 0.7,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

// Polished spinning coin with torus geometry
function Coin({ position, mega = false }: { position: [number, number, number]; mega?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const scale = mega ? 1.6 : 1

  const baseColor = mega ? '#fbbf24' : '#eab308'
  const innerColor = mega ? '#f59e0b' : '#ca8a04'

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth spinning
      groupRef.current.rotation.y += 0.08
      // Subtle bobbing
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[2]) * 0.15
    }
    // Pulsing glow
    if (glowRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.2
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main coin body - torus for that classic coin shape */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.4, 0.12, 16, 32]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Inner disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial
          color={innerColor}
          metalness={0.85}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dollar/football symbol in center */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.15, mega ? 6 : 4]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.5}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={mega ? 0.3 : 0.15}
        />
      </mesh>

      {/* Sparkle points - animated via useFrame in parent */}
      {mega && <SparklePoints />}

      {/* Point light for glow */}
      <pointLight
        color={baseColor}
        intensity={mega ? 3 : 1}
        distance={mega ? 6 : 3}
        decay={2}
      />
    </group>
  )
}

// Magnet powerup - horseshoe shape
function MagnetPowerup({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.04
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Horseshoe shape */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color="#ef4444"
          metalness={0.7}
          roughness={0.3}
          emissive="#ef4444"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Poles */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
          <meshStandardMaterial
            color={i === 0 ? '#dc2626' : '#3b82f6'}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
      </mesh>
      <pointLight color="#ef4444" intensity={4} distance={6} />
    </group>
  )
}

// Shield powerup - energy sphere
function ShieldPowerup({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.25
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.05
      innerRef.current.rotation.z += 0.03
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Outer shield bubble */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.4}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Inner energy core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Energy rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 8, 32]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.03, 8, 32]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>
      <pointLight color="#3b82f6" intensity={5} distance={6} />
    </group>
  )
}

// Speed powerup - lightning bolt / flame
function SpeedPowerup({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.06
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3
      // Shake effect
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Lightning bolt shape using cone */}
      <mesh rotation={[0, 0, 0.3]} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.3, 0.8, 3]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.8}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI, 0, -0.3]} position={[0.1, -0.15, 0]}>
        <coneGeometry args={[0.25, 0.6, 3]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#f97316"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Fire glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.25} />
      </mesh>
      <pointLight color="#f97316" intensity={5} distance={7} />
    </group>
  )
}

// Multiplier powerup - star with 2X
function MultiplierPowerup({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.04
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.2
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Star shape using multiple cones */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i * Math.PI * 2) / 5]}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.3,
            0,
            Math.sin((i * Math.PI * 2) / 5) * 0.3,
          ]}
        >
          <coneGeometry args={[0.2, 0.5, 4]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>
      <pointLight color="#8b5cf6" intensity={5} distance={6} />
    </group>
  )
}

// Collectible component selector
function CollectibleModel({
  type,
  position,
}: {
  type: CollectibleType
  position: [number, number, number]
}) {
  switch (type) {
    case 'coin':
      return <Coin position={position} />
    case 'megacoin':
      return <Coin position={position} mega />
    case 'magnet':
      return <MagnetPowerup position={position} />
    case 'shield':
      return <ShieldPowerup position={position} />
    case 'speed':
      return <SpeedPowerup position={position} />
    case 'multiplier':
      return <MultiplierPowerup position={position} />
    default:
      return <Coin position={position} />
  }
}

// Pre-computed squared collection radius (avoid sqrt in hot path)
const COLLECTION_RADIUS_SQ = COLLECTION_RADIUS * COLLECTION_RADIUS
const COLLECTION_RADIUS_MAGNET_SQ = (COLLECTION_RADIUS * 2) * (COLLECTION_RADIUS * 2)

// Individual collectible that manages its own position via ref
function CollectibleInstance({
  collectible,
  onDespawn,
  onCollect,
}: {
  collectible: Collectible
  onDespawn: (id: number) => void
  onCollect: (id: number, type: CollectibleType) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const zRef = useRef(collectible.z)
  const yRef = useRef(collectible.y)
  const laneRef = useRef(collectible.lane)
  const collectedRef = useRef(false)
  const magnetPullRef = useRef(false)

  useFrame((_, delta) => {
    if (!groupRef.current || collectedRef.current) return

    // Read frequently-changing values directly from store (no re-renders)
    const { speed, lane: playerLane, playerY, hasMagnet, activePowerup } = useGameStore.getState()
    const playerX = playerLane * LANE_WIDTH
    const magnetActive = hasMagnet || activePowerup?.type === 'magnet'

    // Update Z position
    zRef.current -= speed * delta

    // Magnet effect for coins
    const isCoin = collectible.type === 'coin' || collectible.type === 'megacoin'
    if (magnetActive && isCoin && zRef.current < MAGNET_RANGE && zRef.current > 0) {
      magnetPullRef.current = true
      const colX = laneRef.current * LANE_WIDTH
      const pullX = (playerX - colX) * MAGNET_SPEED * delta
      const newX = colX + pullX

      // Update lane based on X position
      if (Math.abs(newX) < LANE_WIDTH / 2) {
        laneRef.current = 0
      } else if (newX < 0) {
        laneRef.current = -1
      } else {
        laneRef.current = 1
      }

      const playerTargetY = playerY + 1.5
      const pullY = (playerTargetY - yRef.current) * MAGNET_SPEED * 0.5 * delta
      yRef.current += pullY
    }

    // Update mesh position
    groupRef.current.position.x = laneRef.current * LANE_WIDTH
    groupRef.current.position.y = yRef.current
    groupRef.current.position.z = -zRef.current

    // Despawn check
    if (zRef.current < DESPAWN_DISTANCE) {
      onDespawn(collectible.id)
      return
    }

    // Collection check
    const dx = laneRef.current * LANE_WIDTH - playerX
    const dz = zRef.current
    const dy = yRef.current - (playerY + 1.5)
    const distanceSq = dx * dx + dz * dz + dy * dy
    const radiusSq = magnetPullRef.current ? COLLECTION_RADIUS_MAGNET_SQ : COLLECTION_RADIUS_SQ

    if (distanceSq < radiusSq) {
      collectedRef.current = true
      onCollect(collectible.id, collectible.type)
    }
  })

  // Hide when collected externally
  useEffect(() => {
    if (collectible.collected) {
      collectedRef.current = true
    }
  }, [collectible.collected])

  if (collectible.collected) return null

  return (
    <group ref={groupRef} position={[collectible.lane * LANE_WIDTH, collectible.y, -collectible.z]}>
      <CollectibleModel type={collectible.type} position={[0, 0, 0]} />
    </group>
  )
}

export function Collectibles() {
  const [collectibles, setCollectibles] = useState<Collectible[]>([])
  const spawnTimerRef = useRef(0)
  const collectibleIdRef = useRef(0)
  // Track collected/despawned IDs
  const removedIds = useRef<Set<number>>(new Set())

  // Only subscribe to values that don't change every frame
  const phase = useGameStore(state => state.phase)
  const difficulty = useGameStore(state => state.difficulty)

  const { play } = useAudio()

  // Spawn patterns
  const spawnCoinLine = useCallback((startZ: number, lane: Lane, count: number, arc = false) => {
    const newCoins: Collectible[] = []
    for (let i = 0; i < count; i++) {
      newCoins.push({
        id: collectibleIdRef.current++,
        type: 'coin',
        lane,
        z: startZ + i * 3,
        y: arc ? Math.sin((i / count) * Math.PI) * 2 + 1.5 : 1.5,
        collected: false,
        magnetPull: false,
      })
    }
    return newCoins
  }, [])

  // Spawn coin arc across lanes
  const spawnCoinArc = useCallback((startZ: number) => {
    const newCoins: Collectible[] = []
    const lanes: Lane[] = [-1, 0, 1]
    lanes.forEach((lane, i) => {
      newCoins.push({
        id: collectibleIdRef.current++,
        type: 'coin',
        lane,
        z: startZ + Math.abs(lane) * 4,
        y: 1.5 + (1 - Math.abs(lane)) * 1.5, // Middle lane higher
        collected: false,
        magnetPull: false,
      })
    })
    return newCoins
  }, [])

  const spawnCollectible = useCallback(() => {
    const rand = Math.random()
    const lanes: Lane[] = [-1, 0, 1]
    const lane = lanes[Math.floor(Math.random() * lanes.length)]

    let newCollectibles: Collectible[] = []

    if (rand < 0.5) {
      // Coin line (most common)
      const count = Math.floor(Math.random() * 4) + 4 // 4-7 coins
      const arc = Math.random() > 0.6
      newCollectibles = spawnCoinLine(SPAWN_DISTANCE, lane, count, arc)
    } else if (rand < 0.65) {
      // Coin arc across lanes
      newCollectibles = spawnCoinArc(SPAWN_DISTANCE)
    } else if (rand < 0.8) {
      // Single mega coin
      newCollectibles = [{
        id: collectibleIdRef.current++,
        type: 'megacoin',
        lane,
        z: SPAWN_DISTANCE,
        y: 2.5,
        collected: false,
        magnetPull: false,
      }]
    } else {
      // Powerup (rare)
      const powerupTypes: CollectibleType[] = ['magnet', 'shield', 'speed', 'multiplier']
      const powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)]
      newCollectibles = [{
        id: collectibleIdRef.current++,
        type: powerupType,
        lane,
        z: SPAWN_DISTANCE,
        y: 2.5,
        collected: false,
        magnetPull: false,
      }]
    }

    setCollectibles(prev => [...prev, ...newCollectibles])
  }, [spawnCoinLine, spawnCoinArc])

  // Handle despawn (called by child components)
  const handleDespawn = useCallback((id: number) => {
    removedIds.current.add(id)
  }, [])

  // Handle collection (called by child components)
  const handleCollect = useCallback((id: number, type: CollectibleType) => {
    if (removedIds.current.has(id)) return
    removedIds.current.add(id)

    // Get action functions from store
    const { addCoins, addScore, activatePowerup, addPopup } = useGameStore.getState()

    // Process collection effects
    switch (type) {
      case 'coin':
        addCoins(1)
        addScore(10)
        play('coin')
        break
      case 'megacoin':
        addCoins(10)
        addScore(100)
        play('megaCoin')
        addPopup('+10 COINS!', 'coin')
        break
      case 'magnet':
        activatePowerup('magnet', 8000)
        play('powerup')
        addPopup('MAGNET!', 'powerup')
        break
      case 'shield':
        activatePowerup('shield', 10000)
        play('shieldActivate')
        addPopup('SHIELD!', 'powerup')
        break
      case 'speed':
        activatePowerup('speed', 5000)
        play('speedBoost')
        addPopup('SPEED BOOST!', 'powerup')
        break
      case 'multiplier':
        activatePowerup('multiplier', 10000)
        play('powerup')
        addPopup('DOUBLE SCORE!', 'powerup')
        break
    }

    // Mark as collected in state
    setCollectibles(prev => prev.map(col =>
      col.id === id ? { ...col, collected: true } : col
    ))
  }, [play])

  // Game loop - only handles spawning and cleanup (no position updates)
  useFrame((_, delta) => {
    if (phase !== 'playing') return

    // Clean up removed collectibles periodically
    if (removedIds.current.size > 0) {
      setCollectibles(prev => prev.filter(col => !removedIds.current.has(col.id)))
      removedIds.current.clear()
    }

    // Spawn timer
    spawnTimerRef.current += delta
    const spawnInterval = Math.max(1, 2 - (difficulty * 0.15))
    if (spawnTimerRef.current > spawnInterval) {
      spawnCollectible()
      spawnTimerRef.current = 0
    }
  })

  // Reset on game start
  useEffect(() => {
    if (phase === 'playing') {
      setCollectibles([])
      spawnTimerRef.current = 0
      removedIds.current.clear()
    }
  }, [phase])

  return (
    <group>
      {collectibles.map(col => (
        <CollectibleInstance
          key={col.id}
          collectible={col}
          onDespawn={handleDespawn}
          onCollect={handleCollect}
        />
      ))}
    </group>
  )
}
