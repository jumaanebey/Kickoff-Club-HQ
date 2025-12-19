'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, Lane } from './hooks/useGameStore'
import { useAudio } from './hooks/useAudio'

// Configuration
const LANE_WIDTH = 3
const SPAWN_DISTANCE = 80
const DESPAWN_DISTANCE = -10
const MIN_OBSTACLE_SPACING = 15
const COLLISION_THRESHOLD_Z = 2
const NEAR_MISS_THRESHOLD = 1.5

type ObstacleType = 'hurdle' | 'defender' | 'barrier' | 'tackledummy'

interface Obstacle {
  id: number
  type: ObstacleType
  lane: Lane
  z: number
  hit: boolean
}

// Enhanced Hurdle - Professional track hurdle style
function Hurdle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
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
function Defender({ position, isFever }: { position: [number, number, number]; isFever?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

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
function Barrier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
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

export function Obstacles() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const lastSpawnZ = useRef(0)
  const obstacleIdRef = useRef(0)

  const {
    phase,
    speed,
    difficulty,
    lane: playerLane,
    playerY,
    isSliding,
    hasShield,
    endGame,
    breakShield,
    addScore,
    addCombo,
    addPopup,
    triggerCameraShake,
    triggerSlowMotion,
    isFever,
  } = useGameStore()

  const { play } = useAudio()

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const types: ObstacleType[] = ['hurdle', 'defender', 'barrier', 'tackledummy']
    const weights = [0.35, 0.35, 0.15, 0.15] // Probability weights

    // Weighted random selection
    const rand = Math.random()
    let cumulative = 0
    let selectedType: ObstacleType = 'hurdle'
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i]
      if (rand < cumulative) {
        selectedType = types[i]
        break
      }
    }

    // Random lane, with some patterns
    const laneOptions: Lane[] = [-1, 0, 1]
    const lane = laneOptions[Math.floor(Math.random() * laneOptions.length)]

    const newObstacle: Obstacle = {
      id: obstacleIdRef.current++,
      type: selectedType,
      lane,
      z: SPAWN_DISTANCE,
      hit: false,
    }

    setObstacles(prev => [...prev, newObstacle])
    lastSpawnZ.current = SPAWN_DISTANCE
  }, [])

  // Game loop for obstacles
  useFrame((_, delta) => {
    if (phase !== 'playing') return

    const movement = speed * delta

    setObstacles(prev => {
      let updated = prev.map(obs => ({
        ...obs,
        z: obs.z - movement,
      }))

      // Collision detection
      updated.forEach(obs => {
        if (obs.hit) return

        const hitbox = HITBOXES[obs.type]
        const obsX = obs.lane * LANE_WIDTH
        const playerX = playerLane * LANE_WIDTH

        // Check Z proximity
        if (Math.abs(obs.z) < COLLISION_THRESHOLD_Z) {
          // Check lane collision (X proximity)
          const xDistance = Math.abs(obsX - playerX)
          const inSameLane = xDistance < (hitbox.width / 2 + 1)

          if (inSameLane) {
            // Check if player avoided via jump or slide
            const jumpedOver = hitbox.jumpable && playerY > hitbox.height * 0.7
            const slidUnder = hitbox.slideable && isSliding

            if (!jumpedOver && !slidUnder) {
              // Collision!
              if (hasShield) {
                // Shield blocks hit
                obs.hit = true
                breakShield()
                play('shieldBreak')
                addScore(50) // Bonus for surviving
              } else {
                // Game over
                play('collision')
                triggerCameraShake(25)
                triggerSlowMotion(500)
                endGame()
              }
            } else {
              // Successful dodge
              obs.hit = true
              addCombo()
              addScore(100)
              play('nearMiss')
              addPopup('DODGE!', 'juke')
            }
          }
        }

        // Near miss detection (close but not hit)
        if (!obs.hit && Math.abs(obs.z) < NEAR_MISS_THRESHOLD) {
          const xDistance = Math.abs(obsX - playerX)
          if (xDistance < LANE_WIDTH && xDistance > hitbox.width / 2) {
            // Near miss!
            addScore(50)
            addPopup('NEAR MISS!', 'juke')
            play('nearMiss')
            triggerCameraShake(5)
            obs.hit = true
          }
        }
      })

      // Remove obstacles that are behind player
      updated = updated.filter(obs => obs.z > DESPAWN_DISTANCE)

      return updated
    })

    // Spawn new obstacles
    const spawnThreshold = MIN_OBSTACLE_SPACING - (difficulty * 2) // Closer together at higher difficulty
    if (lastSpawnZ.current - movement < spawnThreshold) {
      if (Math.random() < 0.4 + difficulty * 0.1) {
        spawnObstacle()
      }
      lastSpawnZ.current -= movement
    }
  })

  // Reset obstacles when game restarts
  useEffect(() => {
    if (phase === 'playing') {
      setObstacles([])
      lastSpawnZ.current = 0
    }
  }, [phase])

  return (
    <group>
      {obstacles.map(obs => (
        <ObstacleModel
          key={obs.id}
          type={obs.type}
          position={[obs.lane * LANE_WIDTH, 0, -obs.z]}
          isFever={isFever}
        />
      ))}
    </group>
  )
}
