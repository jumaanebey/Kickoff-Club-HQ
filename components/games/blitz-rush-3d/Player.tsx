'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from './hooks/useGameStore'

// Lane configuration
const LANE_WIDTH = 3
const LANE_SWITCH_SPEED = 12 // Units per second

// Kawaii Bean Football Player - Procedural "Subway Surfer" style character
function KawaiiPlayer({ hasShield, hasSpeedBoost }: { hasShield: boolean; hasSpeedBoost: boolean }) {
  const bodyRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const helmetRef = useRef<THREE.Mesh>(null)

  const { isJumping, isSliding, isGrounded, speed } = useGameStore()

  // Animation speed multiplier based on game speed
  const animSpeed = useMemo(() => Math.max(1, speed / 25), [speed])

  useFrame((state) => {
    if (!bodyRef.current) return
    const time = state.clock.elapsedTime

    // Running animation
    if (isGrounded && !isSliding) {
      // Body bob
      bodyRef.current.position.y = Math.abs(Math.sin(time * 12 * animSpeed)) * 0.15
      bodyRef.current.rotation.x = Math.sin(time * 12 * animSpeed) * 0.08

      // Arm pumping (opposite to legs)
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 12 * animSpeed) * 0.8
        rightArmRef.current.rotation.x = -Math.sin(time * 12 * animSpeed) * 0.8
        // Arms swing forward more
        leftArmRef.current.rotation.z = 0.2 + Math.sin(time * 12 * animSpeed) * 0.1
        rightArmRef.current.rotation.z = -0.2 - Math.sin(time * 12 * animSpeed) * 0.1
      }

      // Leg running cycle
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.sin(time * 12 * animSpeed) * 0.7
        rightLegRef.current.rotation.x = Math.sin(time * 12 * animSpeed) * 0.7
        // Knees bend on back swing
        leftLegRef.current.position.z = Math.max(0, Math.sin(time * 12 * animSpeed)) * 0.15
        rightLegRef.current.position.z = Math.max(0, -Math.sin(time * 12 * animSpeed)) * 0.15
      }

      // Helmet slight wobble
      if (helmetRef.current) {
        helmetRef.current.rotation.z = Math.sin(time * 12 * animSpeed) * 0.05
      }
    }

    // Jump pose - spread eagle superhero pose
    if (isJumping) {
      bodyRef.current.rotation.x = -0.2
      bodyRef.current.position.y = 0

      if (leftArmRef.current && rightArmRef.current) {
        // Arms up in victory/flying pose
        leftArmRef.current.rotation.x = -1.2
        rightArmRef.current.rotation.x = -1.2
        leftArmRef.current.rotation.z = 0.5
        rightArmRef.current.rotation.z = -0.5
      }

      if (leftLegRef.current && rightLegRef.current) {
        // Legs tucked slightly
        leftLegRef.current.rotation.x = 0.3
        rightLegRef.current.rotation.x = 0.3
      }
    }

    // Slide pose - diving forward
    if (isSliding) {
      bodyRef.current.rotation.x = 1.2 // Lean forward heavily
      bodyRef.current.position.y = -0.8 // Lower to ground

      if (leftArmRef.current && rightArmRef.current) {
        // Arms stretched back like diving
        leftArmRef.current.rotation.x = 0.8
        rightArmRef.current.rotation.x = 0.8
        leftArmRef.current.rotation.z = 0.3
        rightArmRef.current.rotation.z = -0.3
      }

      if (leftLegRef.current && rightLegRef.current) {
        // Legs stretched behind
        leftLegRef.current.rotation.x = 0.5
        rightLegRef.current.rotation.x = 0.5
      }
    }
  })

  // Colors - bright, saturated Subway Surfer style
  const jerseyColor = '#2563eb' // Bright blue
  const helmetColor = '#fbbf24' // Gold
  const pantsColor = '#f8fafc' // White
  const skinColor = '#d4a574' // Medium tan
  const shoulderPadColor = '#1e40af' // Darker blue
  const speedGlowColor = '#f97316' // Orange for speed boost

  return (
    <group ref={bodyRef}>
      {/* Speed boost aura */}
      {hasSpeedBoost && (
        <mesh>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshStandardMaterial
            color={speedGlowColor}
            transparent
            opacity={0.2}
            emissive={speedGlowColor}
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Shield bubble effect - pulsing energy field */}
      {hasShield && (
        <group>
          <mesh>
            <sphereGeometry args={[1.6, 32, 32]} />
            <meshStandardMaterial
              color="#60a5fa"
              transparent
              opacity={0.25}
              emissive="#3b82f6"
              emissiveIntensity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Inner glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.05, 8, 32]} />
            <meshStandardMaterial
              color="#93c5fd"
              emissive="#60a5fa"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      )}

      {/* === BODY (Bean-shaped torso) === */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.45, 0.9, 12, 24]} />
        <meshStandardMaterial
          color={jerseyColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Jersey white stripe */}
      <mesh position={[0, 1.1, 0.46]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Jersey number "20" - simplified as white circle */}
      <mesh position={[0, 1.3, 0.47]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* === HELMET (Rounded with shine) === */}
      <mesh ref={helmetRef} position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          color={helmetColor}
          roughness={0.2}
          metalness={0.7}
          envMapIntensity={1}
        />
      </mesh>

      {/* Helmet stripe */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.85]} />
        <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Face mask bars */}
      <group position={[0, 1.9, 0.35]}>
        {/* Horizontal bars */}
        {[-0.08, 0.08].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Vertical bars */}
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={`v${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.04]} />
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* === SHOULDER PADS (Oversized cartoon style) === */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[1.3, 0.25, 0.5]} />
        <meshStandardMaterial
          color={shoulderPadColor}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      {/* Shoulder pad curves */}
      <mesh position={[-0.55, 1.55, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.18, 0.2, 8, 8]} />
        <meshStandardMaterial color={shoulderPadColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.55, 1.55, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.18, 0.2, 8, 8]} />
        <meshStandardMaterial color={shoulderPadColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* === LEFT ARM === */}
      <group ref={leftArmRef} position={[-0.6, 1.4, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.4, 8, 12]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.6} />
        </mesh>
        {/* Forearm/hand */}
        <mesh position={[0, -0.55, 0.1]} castShadow>
          <capsuleGeometry args={[0.1, 0.25, 8, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* === RIGHT ARM === */}
      <group ref={rightArmRef} position={[0.6, 1.4, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.4, 8, 12]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.6} />
        </mesh>
        {/* Forearm/hand */}
        <mesh position={[0, -0.55, 0.1]} castShadow>
          <capsuleGeometry args={[0.1, 0.25, 8, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* === LEFT LEG === */}
      <group ref={leftLegRef} position={[-0.2, 0.4, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.35, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.5} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.5} />
        </mesh>
        {/* Cleat */}
        <mesh position={[0, -0.8, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.28]} />
          <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      {/* === RIGHT LEG === */}
      <group ref={rightLegRef} position={[0.2, 0.4, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.35, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.5} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.5} />
        </mesh>
        {/* Cleat */}
        <mesh position={[0, -0.8, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.28]} />
          <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

export function Player() {
  const groupRef = useRef<THREE.Group>(null)
  const currentX = useRef(0)
  const shadowRef = useRef<THREE.Mesh>(null)

  const { lane, playerY, hasShield, hasSpeedBoost, phase } = useGameStore()

  // Target X position based on lane
  const targetX = lane * LANE_WIDTH

  useFrame((_, delta) => {
    if (!groupRef.current || phase !== 'playing') return

    // Smooth lane switching
    const diff = targetX - currentX.current
    if (Math.abs(diff) > 0.01) {
      currentX.current += diff * LANE_SWITCH_SPEED * delta
      groupRef.current.position.x = currentX.current

      // Tilt during lane switch (more pronounced for juicy feel)
      groupRef.current.rotation.z = -diff * 0.2
    } else {
      groupRef.current.rotation.z *= 0.85 // Smooth return to neutral
    }

    // Update Y position (jump/fall)
    groupRef.current.position.y = playerY

    // Dynamic shadow based on height - more robust scaling
    if (shadowRef.current) {
      // Use exponential falloff for more natural shadow behavior
      // Shadow shrinks but never disappears completely (min scale 0.3)
      const normalizedHeight = Math.min(playerY / 8, 1) // Cap at 8 units (very high jump)
      const heightFactor = Math.pow(1 - normalizedHeight, 0.5) // Sqrt for gentler curve
      const scale = 0.3 + heightFactor * 0.7 // Scale from 0.3 to 1.0
      const opacity = 0.1 + heightFactor * 0.3 // Opacity from 0.1 to 0.4

      shadowRef.current.scale.setScalar(scale)
      const mat = shadowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <KawaiiPlayer hasShield={hasShield} hasSpeedBoost={hasSpeedBoost} />

      {/* Dynamic shadow */}
      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
