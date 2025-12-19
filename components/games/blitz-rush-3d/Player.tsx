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
  const capeRef = useRef<THREE.Group>(null)
  const capeSegmentsRef = useRef<THREE.Mesh[]>([])

  const { isJumping, isSliding, isGrounded, speed, isFever } = useGameStore()

  // Animation speed multiplier based on game speed
  const animSpeed = useMemo(() => Math.max(1, speed / 25), [speed])

  useFrame((state) => {
    if (!bodyRef.current) return
    const time = state.clock.elapsedTime

    // Fever intensity (breathing/pulsing)
    const feverInt = isFever ? 1 + Math.sin(time * 10) * 0.2 : 1

    // Running animation
    if (isGrounded && !isSliding) {
      const runFreq = isFever ? 16 : 12
      // Body bob
      bodyRef.current.position.y = Math.abs(Math.sin(time * runFreq * animSpeed)) * 0.15
      bodyRef.current.rotation.x = (isFever ? 0.3 : 0) + Math.sin(time * runFreq * animSpeed) * 0.08

      // Arm pumping (opposite to legs)
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * runFreq * animSpeed) * (isFever ? 1.2 : 0.8)
        rightArmRef.current.rotation.x = -Math.sin(time * runFreq * animSpeed) * (isFever ? 1.2 : 0.8)
        // Arms swing forward more
        leftArmRef.current.rotation.z = 0.2 + Math.sin(time * runFreq * animSpeed) * 0.1
        rightArmRef.current.rotation.z = -0.2 - Math.sin(time * runFreq * animSpeed) * 0.1
      }

      // Leg running cycle
      if (leftLegRef.current && rightLegRef.current) {
        const legLift = isFever ? 1.4 : 0.7; // High step during fever
        leftLegRef.current.rotation.x = -Math.sin(time * runFreq * animSpeed) * legLift
        rightLegRef.current.rotation.x = Math.sin(time * runFreq * animSpeed) * legLift
        // Higher knee lift
        leftLegRef.current.position.y = Math.max(0, -Math.sin(time * runFreq * animSpeed)) * (isFever ? 0.4 : 0.1)
        rightLegRef.current.position.y = Math.max(0, Math.sin(time * runFreq * animSpeed)) * (isFever ? 0.4 : 0.1)

        leftLegRef.current.position.z = Math.max(0, Math.sin(time * runFreq * animSpeed)) * 0.15
        rightLegRef.current.position.z = Math.max(0, -Math.sin(time * runFreq * animSpeed)) * 0.15
      }

      // Helmet slight wobble
      if (helmetRef.current) {
        helmetRef.current.rotation.z = Math.sin(time * runFreq * animSpeed) * 0.05
      }

      // Cape wiggle
      if (capeRef.current) {
        capeRef.current.rotation.x = 0.5 + Math.sin(time * 15) * 0.1
        capeSegmentsRef.current.forEach((segment, i) => {
          segment.rotation.x = Math.sin(time * 20 - i * 0.5) * (0.2 + (speed / 50) * 0.3)
        })
      }
    }

    // Jump pose - Superhero Somersault
    if (isJumping) {
      // Rotation based on time into the jump - full flip
      const jumpTime = time % 1.0;
      bodyRef.current.rotation.x = -jumpTime * Math.PI * 2;
      bodyRef.current.position.y = 0;

      if (leftArmRef.current && rightArmRef.current) {
        // Tucked for the flip
        leftArmRef.current.rotation.x = 2;
        rightArmRef.current.rotation.x = 2;
        leftArmRef.current.rotation.z = 0.3;
        rightArmRef.current.rotation.z = -0.3;
      }

      if (leftLegRef.current && rightLegRef.current) {
        // Tucked
        leftLegRef.current.rotation.x = 1.2;
        rightLegRef.current.rotation.x = 1.2;
      }

      if (capeRef.current) {
        // Cape whips wildly
        capeRef.current.rotation.x = Math.PI + Math.sin(time * 30) * 0.5;
      }
    }

    // Slide pose - Power Roll
    if (isSliding) {
      const slideTime = time % 0.8;
      bodyRef.current.rotation.x = slideTime * Math.PI * 2.5; // Fast roll
      bodyRef.current.position.y = -0.8;

      if (leftArmRef.current && rightArmRef.current) {
        // Arms tucked for the roll
        leftArmRef.current.rotation.x = 2.5;
        rightArmRef.current.rotation.x = 2.5;
      }

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 1.5;
        rightLegRef.current.rotation.x = 1.5;
      }

      if (capeRef.current) {
        capeRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 40) * 0.8;
      }
    }
  })

  // Colors - bright, saturated Subway Surfer style
  const jerseyColor = '#1d4ed8' // Premium Blue
  const helmetColor = '#facc15' // Golden Hero
  const pantsColor = '#e2e8f0' // Metallic Silver/White
  const skinColor = '#854d0e' // Heroic Tan
  const shoulderPadColor = '#1e40af' // Deep Navy
  const speedGlowColor = '#fbbf24' // Sun Gold
  const visorColor = '#fef08a' // Bright Vision
  const capeColor = '#dc2626' // Hero Red

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

      {/* Fever Mode Aura - intense golden glow */}
      {isFever && (
        <>
          <mesh>
            <sphereGeometry args={[2, 24, 24]} />
            <meshStandardMaterial
              color="#fbbf24"
              transparent
              opacity={0.15 + (Math.sin(Date.now() * 0.01) * 0.05)}
              emissive="#f97316"
              emissiveIntensity={2}
              side={THREE.BackSide}
            />
          </mesh>
          {/* Rocket Boot Flames */}
          <group position={[0, -0.5, 0]}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.5, 1.5, 8]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#f97316"
                emissiveIntensity={4}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        </>
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
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.4}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* === HELMET (Oversized Mascot Style) === */}
      <mesh ref={helmetRef} position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={helmetColor}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Heroic Visor - shiny and oversized */}
      <mesh position={[0, 2.1, 0.3]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.48, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={visorColor}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.7}
          emissive={visorColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Helmet Team Logos - Stylized Lightning Bolts */}
      {[-0.56, 0.56].map((x, i) => (
        <group key={i} position={[x, 2.05, 0]} rotation={[0, i === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial
              color="#1d4ed8"
              transparent
              opacity={0.9}
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 1.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.9} />
      </mesh>

      {/* Mascot Spike - Aggressive Hero Silhouette */}
      <mesh position={[0, 2.7, -0.1]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.08, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
      </mesh>

      {/* Hero Eyes - glowing dots inside visor */}
      <group position={[0, 2.05, 0.45]}>
        <mesh position={[-0.15, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      </group>

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

      {/* === HEROIC CAPE === */}
      <group ref={capeRef} position={[0, 1.6, -0.3]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={i} position={[0, -i * 0.4, -i * 0.05]} ref={(el) => { if (el) capeSegmentsRef.current[i] = el as any }}>
            {/* Cape Main Body */}
            <mesh>
              <planeGeometry args={[1.2 - i * 0.1, 0.5]} />
              <meshStandardMaterial color={capeColor} side={THREE.DoubleSide} roughness={0.8} />
            </mesh>
            {/* Golden Trim Left */}
            <mesh position={[-(1.2 - i * 0.1) / 2, 0, 0.01]}>
              <planeGeometry args={[0.05, 0.5]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0} />
            </mesh>
            {/* Golden Trim Right */}
            <mesh position={[(1.2 - i * 0.1) / 2, 0, 0.01]}>
              <planeGeometry args={[0.05, 0.5]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[1.6, 0.35, 0.6]} />
        <meshStandardMaterial
          color={shoulderPadColor}
          roughness={0.2}
          metalness={0.5}
          emissive={isFever ? "#3b82f6" : "#000000"}
          emissiveIntensity={isFever ? 0.5 : 0}
        />
      </mesh>
      {/* Chrome spikes/detail on pads */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.85, 0]} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.4]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
        </mesh>
      ))}
      <mesh position={[-0.7, 1.6, 0]} rotation={[0, 0, 0.4]} castShadow>
        <capsuleGeometry args={[0.22, 0.25, 8, 8]} />
        <meshStandardMaterial color={shoulderPadColor} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0.7, 1.6, 0]} rotation={[0, 0, -0.4]} castShadow>
        <capsuleGeometry args={[0.22, 0.25, 8, 8]} />
        <meshStandardMaterial color={shoulderPadColor} roughness={0.2} metalness={0.5} />
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

      {/* === RIGHT ARM (Holding Football) === */}
      <group ref={rightArmRef} position={[0.6, 1.4, 0]}>
        {/* Upper arm (Sleeve) */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.4, 8, 12]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.6} />
        </mesh>

        {/* Forearm angled forward */}
        <group position={[0, -0.55, 0.1]} rotation={[-0.4, 0, 0.2]}>
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.3, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.7} />
          </mesh>

          {/* THE FOOTBALL */}
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1.6, 1.2]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.8} />
          </mesh>

          {/* Football Laces (Procedural) */}
          <mesh position={[0, 0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.25]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
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
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.2} />
          {/* Cleat Accent Stripe */}
          <mesh position={[0, -0.05, 0.15]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
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
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.2} />
          {/* Cleat Accent Stripe */}
          <mesh position={[0, -0.05, 0.15]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
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

    // Dynamic shadow based on height
    if (shadowRef.current) {
      // Shadow gets smaller and more transparent as player goes higher
      const heightFactor = 1 - Math.min(playerY / 5, 0.6)
      shadowRef.current.scale.setScalar(0.6 + heightFactor * 0.4)
      const mat = shadowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.15 + heightFactor * 0.25
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
