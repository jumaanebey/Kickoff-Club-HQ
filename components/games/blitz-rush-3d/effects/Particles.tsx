'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'

// Particle pool configuration
const DUST_POOL_SIZE = 80
const COIN_BURST_POOL_SIZE = 100
const NEAR_MISS_POOL_SIZE = 60
const CONFETTI_POOL_SIZE = 200
const SPEED_LINE_POOL_SIZE = 40

// Distance milestones for celebration
const MILESTONES = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]

// Confetti colors for celebrations
const CONFETTI_COLORS = [
  new THREE.Color('#fbbf24'), // Gold
  new THREE.Color('#f97316'), // Orange
  new THREE.Color('#ef4444'), // Red
  new THREE.Color('#3b82f6'), // Blue
  new THREE.Color('#22c55e'), // Green
  new THREE.Color('#a855f7'), // Purple
]

// Enhanced particle system with multiple effect types
export function ParticleSystem() {
  const phase = useGameStore(state => state.phase)
  const prevGrounded = useRef(true)
  const prevLane = useRef(0)
  const prevPlayerY = useRef(0)
  const lastMilestone = useRef(0)

  // Dust particle pool
  const dustParticlesRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
    lives: Float32Array
    count: number
  }>({
    positions: new Float32Array(DUST_POOL_SIZE * 3),
    velocities: new Float32Array(DUST_POOL_SIZE * 3),
    lives: new Float32Array(DUST_POOL_SIZE),
    count: 0
  })

  // Coin burst particle pool (golden sparkles)
  const coinBurstRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
    lives: Float32Array
    scales: Float32Array
  }>({
    positions: new Float32Array(COIN_BURST_POOL_SIZE * 3),
    velocities: new Float32Array(COIN_BURST_POOL_SIZE * 3),
    lives: new Float32Array(COIN_BURST_POOL_SIZE),
    scales: new Float32Array(COIN_BURST_POOL_SIZE),
  })

  // Near-miss sparks pool (orange sparks)
  const nearMissRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
    lives: Float32Array
  }>({
    positions: new Float32Array(NEAR_MISS_POOL_SIZE * 3),
    velocities: new Float32Array(NEAR_MISS_POOL_SIZE * 3),
    lives: new Float32Array(NEAR_MISS_POOL_SIZE),
  })

  // Confetti particle pool for milestones
  const confettiRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
    rotations: Float32Array
    lives: Float32Array
    colorIndices: Uint8Array
  }>({
    positions: new Float32Array(CONFETTI_POOL_SIZE * 3),
    velocities: new Float32Array(CONFETTI_POOL_SIZE * 3),
    rotations: new Float32Array(CONFETTI_POOL_SIZE * 3),
    lives: new Float32Array(CONFETTI_POOL_SIZE),
    colorIndices: new Uint8Array(CONFETTI_POOL_SIZE),
  })

  // Geometry refs
  const dustGeometryRef = useRef<THREE.BufferGeometry>(null)
  const coinBurstGeometryRef = useRef<THREE.BufferGeometry>(null)
  const nearMissGeometryRef = useRef<THREE.BufferGeometry>(null)
  const confettiGeometryRef = useRef<THREE.BufferGeometry>(null)

  // Slot counters for round-robin particle allocation
  const dustSlotRef = useRef(0)
  const coinSlotRef = useRef(0)
  const nearMissSlotRef = useRef(0)
  const confettiSlotRef = useRef(0)

  // Material refs for dynamic updates
  const coinBurstMaterialRef = useRef<THREE.PointsMaterial>(null)

  // Emit dust particles
  const emitDust = useCallback((x: number, y: number, z: number, count: number, intensity: number = 1) => {
    const particles = dustParticlesRef.current
    for (let i = 0; i < count; i++) {
      const slot = dustSlotRef.current % DUST_POOL_SIZE
      const idx = slot * 3

      particles.positions[idx] = x + (Math.random() - 0.5) * 0.8
      particles.positions[idx + 1] = y
      particles.positions[idx + 2] = z + (Math.random() - 0.5) * 0.8

      particles.velocities[idx] = (Math.random() - 0.5) * 6 * intensity
      particles.velocities[idx + 1] = Math.random() * 5 * intensity + 2
      particles.velocities[idx + 2] = (Math.random() - 0.5) * 6 * intensity

      particles.lives[slot] = 1.0

      dustSlotRef.current++
    }
  }, [])

  // Emit coin burst particles (golden sparkles)
  const emitCoinBurst = useCallback((x: number, y: number, z: number, count: number = 15) => {
    const particles = coinBurstRef.current
    for (let i = 0; i < count; i++) {
      const slot = coinSlotRef.current % COIN_BURST_POOL_SIZE
      const idx = slot * 3

      // Spread outward from collection point
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const radius = Math.random() * 0.3 + 0.1

      particles.positions[idx] = x + Math.cos(angle) * radius
      particles.positions[idx + 1] = y + (Math.random() - 0.3) * 0.5
      particles.positions[idx + 2] = z + Math.sin(angle) * radius

      // Fly outward with upward bias
      const speed = 4 + Math.random() * 4
      particles.velocities[idx] = Math.cos(angle) * speed + (Math.random() - 0.5) * 2
      particles.velocities[idx + 1] = Math.random() * 6 + 3
      particles.velocities[idx + 2] = Math.sin(angle) * speed + (Math.random() - 0.5) * 2

      particles.lives[slot] = 1.0
      particles.scales[slot] = 0.8 + Math.random() * 0.4

      coinSlotRef.current++
    }
  }, [])

  // Emit near-miss sparks (orange sparks)
  const emitNearMissSparks = useCallback((x: number, y: number, z: number, direction: number = 0) => {
    const particles = nearMissRef.current
    const count = 12
    for (let i = 0; i < count; i++) {
      const slot = nearMissSlotRef.current % NEAR_MISS_POOL_SIZE
      const idx = slot * 3

      particles.positions[idx] = x + (Math.random() - 0.5) * 0.3
      particles.positions[idx + 1] = y + Math.random() * 2
      particles.positions[idx + 2] = z + (Math.random() - 0.5) * 0.5

      // Sparks fly in the dodge direction with random spread
      const sparkSpeed = 8 + Math.random() * 6
      particles.velocities[idx] = direction * sparkSpeed + (Math.random() - 0.5) * 4
      particles.velocities[idx + 1] = Math.random() * 5 + 1
      particles.velocities[idx + 2] = (Math.random() - 0.5) * 6

      particles.lives[slot] = 0.6 + Math.random() * 0.3

      nearMissSlotRef.current++
    }
  }, [])

  // Emit confetti for milestones
  const emitConfetti = useCallback((x: number, y: number, z: number, count: number = 80) => {
    const particles = confettiRef.current
    for (let i = 0; i < count; i++) {
      const slot = confettiSlotRef.current % CONFETTI_POOL_SIZE
      const idx = slot * 3

      // Spawn in a wide area around the player
      particles.positions[idx] = x + (Math.random() - 0.5) * 12
      particles.positions[idx + 1] = y + 8 + Math.random() * 4
      particles.positions[idx + 2] = z + (Math.random() - 0.5) * 8 - 5

      // Float down with some sideways drift
      particles.velocities[idx] = (Math.random() - 0.5) * 4
      particles.velocities[idx + 1] = -3 - Math.random() * 2
      particles.velocities[idx + 2] = (Math.random() - 0.5) * 3

      // Random rotation speeds
      particles.rotations[idx] = Math.random() * 10
      particles.rotations[idx + 1] = Math.random() * 10
      particles.rotations[idx + 2] = Math.random() * 10

      particles.lives[slot] = 2.5 + Math.random() * 1.0
      particles.colorIndices[slot] = Math.floor(Math.random() * CONFETTI_COLORS.length)

      confettiSlotRef.current++
    }
  }, [])

  // Update particles each frame
  useFrame((state, delta) => {
    if (phase !== 'playing') return

    // Read game state
    const { isGrounded, isSliding, playerY, lane, isFever, distance, coins } = useGameStore.getState()

    // ===== DUST PARTICLES UPDATE =====
    const dustParticles = dustParticlesRef.current
    let hasDust = false
    for (let i = 0; i < DUST_POOL_SIZE; i++) {
      if (dustParticles.lives[i] <= 0) continue
      const idx = i * 3
      dustParticles.positions[idx] += dustParticles.velocities[idx] * delta
      dustParticles.positions[idx + 1] += dustParticles.velocities[idx + 1] * delta
      dustParticles.positions[idx + 2] += dustParticles.velocities[idx + 2] * delta
      dustParticles.velocities[idx + 1] -= 18 * delta // Gravity
      dustParticles.lives[i] -= delta * 2.5
      if (dustParticles.lives[i] > 0) hasDust = true
    }
    if (dustGeometryRef.current && hasDust) {
      const posAttr = dustGeometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }

    // ===== COIN BURST PARTICLES UPDATE =====
    const coinParticles = coinBurstRef.current
    let hasCoinParticles = false
    for (let i = 0; i < COIN_BURST_POOL_SIZE; i++) {
      if (coinParticles.lives[i] <= 0) continue
      const idx = i * 3
      coinParticles.positions[idx] += coinParticles.velocities[idx] * delta
      coinParticles.positions[idx + 1] += coinParticles.velocities[idx + 1] * delta
      coinParticles.positions[idx + 2] += coinParticles.velocities[idx + 2] * delta
      coinParticles.velocities[idx + 1] -= 12 * delta // Light gravity
      coinParticles.velocities[idx] *= 0.96 // Air resistance
      coinParticles.velocities[idx + 2] *= 0.96
      coinParticles.lives[i] -= delta * 1.8
      if (coinParticles.lives[i] > 0) hasCoinParticles = true
    }
    if (coinBurstGeometryRef.current && hasCoinParticles) {
      const posAttr = coinBurstGeometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }
    // Pulsing size for coin particles
    if (coinBurstMaterialRef.current) {
      coinBurstMaterialRef.current.size = 0.25 + Math.sin(state.clock.elapsedTime * 8) * 0.05
    }

    // ===== NEAR-MISS SPARKS UPDATE =====
    const sparkParticles = nearMissRef.current
    let hasSparks = false
    for (let i = 0; i < NEAR_MISS_POOL_SIZE; i++) {
      if (sparkParticles.lives[i] <= 0) continue
      const idx = i * 3
      sparkParticles.positions[idx] += sparkParticles.velocities[idx] * delta
      sparkParticles.positions[idx + 1] += sparkParticles.velocities[idx + 1] * delta
      sparkParticles.positions[idx + 2] += sparkParticles.velocities[idx + 2] * delta
      sparkParticles.velocities[idx + 1] -= 20 * delta // Strong gravity
      sparkParticles.velocities[idx] *= 0.92 // Quick slowdown
      sparkParticles.velocities[idx + 2] *= 0.92
      sparkParticles.lives[i] -= delta * 3.5 // Quick fade
      if (sparkParticles.lives[i] > 0) hasSparks = true
    }
    if (nearMissGeometryRef.current && hasSparks) {
      const posAttr = nearMissGeometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }

    // ===== CONFETTI PARTICLES UPDATE =====
    const confettiParticles = confettiRef.current
    let hasConfetti = false
    for (let i = 0; i < CONFETTI_POOL_SIZE; i++) {
      if (confettiParticles.lives[i] <= 0) continue
      const idx = i * 3
      // Flutter motion
      const flutter = Math.sin(state.clock.elapsedTime * 5 + i) * 2
      confettiParticles.positions[idx] += (confettiParticles.velocities[idx] + flutter) * delta
      confettiParticles.positions[idx + 1] += confettiParticles.velocities[idx + 1] * delta
      confettiParticles.positions[idx + 2] += confettiParticles.velocities[idx + 2] * delta
      confettiParticles.lives[i] -= delta * 0.4
      if (confettiParticles.lives[i] > 0) hasConfetti = true
    }
    if (confettiGeometryRef.current && hasConfetti) {
      const posAttr = confettiGeometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }

    // ===== EVENT TRIGGERS =====

    // Landing dust (enhanced with jump height)
    if (!prevGrounded.current && isGrounded) {
      const jumpHeight = prevPlayerY.current
      const intensity = Math.min(2, 1 + jumpHeight / 5)
      const dustCount = Math.floor(10 + jumpHeight * 2)
      emitDust(lane * 3, 0.1, 0, dustCount, intensity)

      // Extra screen shake for high jumps
      if (jumpHeight > 3) {
        useGameStore.getState().triggerCameraShake(8 + jumpHeight)
      }
    }
    prevGrounded.current = isGrounded
    prevPlayerY.current = playerY

    // Lane switch dust
    if (prevLane.current !== lane) {
      emitDust(prevLane.current * 3, 0.2, 0, 6)

      // Emit near-miss sparks if player was close to an obstacle
      // Direction is based on lane switch direction
      const direction = lane > prevLane.current ? 1 : -1
      emitNearMissSparks(lane * 3, 1, 0, direction)

      useGameStore.getState().triggerCameraShake(3)
    }
    prevLane.current = lane

    // Running dust (occasional)
    if (playerY === 0 && !isSliding && Math.random() < (isFever ? 0.06 : 0.03)) {
      emitDust(lane * 3, 0.1, 0, isFever ? 4 : 2)
    }

    // Milestone celebration confetti
    const currentMilestone = Math.floor(distance / 500) * 500
    if (currentMilestone > lastMilestone.current && currentMilestone > 0) {
      lastMilestone.current = currentMilestone
      emitConfetti(lane * 3, playerY + 1, 0, 100)
      useGameStore.getState().triggerCameraShake(12)
      useGameStore.getState().addPopup(`${currentMilestone}M!`, 'score')
    }
  })

  // Create buffer attributes
  const dustPositionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(dustParticlesRef.current.positions, 3)
  }, [])

  const coinBurstPositionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(coinBurstRef.current.positions, 3)
  }, [])

  const nearMissPositionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(nearMissRef.current.positions, 3)
  }, [])

  const confettiPositionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(confettiRef.current.positions, 3)
  }, [])

  // Expose emit functions globally for other components to use
  useEffect(() => {
    // Store emit functions on window for access from Collectibles, Obstacles, etc.
    (window as any).__particleEmitters = {
      emitCoinBurst,
      emitNearMissSparks,
      emitConfetti,
      emitDust,
    }
    return () => {
      delete (window as any).__particleEmitters
    }
  }, [emitCoinBurst, emitNearMissSparks, emitConfetti, emitDust])

  // Reset milestone tracker on game restart
  useEffect(() => {
    if (phase === 'playing') {
      lastMilestone.current = 0
    }
  }, [phase])

  return (
    <group>
      {/* Dust particles - gray/brown */}
      <points>
        <bufferGeometry ref={dustGeometryRef}>
          <primitive object={dustPositionAttribute} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#a3a3a3"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Coin burst particles - golden sparkles */}
      <points>
        <bufferGeometry ref={coinBurstGeometryRef}>
          <primitive object={coinBurstPositionAttribute} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial
          ref={coinBurstMaterialRef}
          size={0.25}
          color="#fbbf24"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Near-miss sparks - orange/red */}
      <points>
        <bufferGeometry ref={nearMissGeometryRef}>
          <primitive object={nearMissPositionAttribute} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#f97316"
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Confetti particles - multi-colored */}
      <points>
        <bufferGeometry ref={confettiGeometryRef}>
          <primitive object={confettiPositionAttribute} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color="#fbbf24"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          vertexColors={false}
        />
      </points>
    </group>
  )
}


// Enhanced Trail effect for player with 3D speed lines
export function PlayerTrail() {
  const phase = useGameStore(state => state.phase)
  const trailRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const positionsRef = useRef<Float32Array>(new Float32Array(450)) // 150 points * 3 (increased for more trail)

  // Create buffer attribute once
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positionsRef.current, 3)
  }, [])

  useFrame((state) => {
    if (!geometryRef.current || !materialRef.current || phase !== 'playing') return

    const { activePowerup, speed, isFever, lane, playerY } = useGameStore.getState()
    const hasTrail = activePowerup?.type === 'speed' || speed > 35 || isFever

    // Enhanced material properties
    const baseSize = isFever ? 0.6 : 0.35
    const pulseSize = isFever ? Math.sin(state.clock.elapsedTime * 10) * 0.15 : 0
    materialRef.current.size = baseSize + pulseSize
    materialRef.current.color.set(isFever ? '#facc15' : (activePowerup?.type === 'speed' ? '#f97316' : '#3b82f6'))
    materialRef.current.opacity = isFever ? 0.85 : 0.6
    materialRef.current.visible = hasTrail

    if (!hasTrail) return

    // Shift all positions back
    for (let i = positionsRef.current.length - 3; i >= 3; i -= 3) {
      positionsRef.current[i] = positionsRef.current[i - 3]
      positionsRef.current[i + 1] = positionsRef.current[i - 2]
      positionsRef.current[i + 2] = positionsRef.current[i - 1]
    }

    // Add new position with slight spread for visual variety
    const spread = isFever ? 0.15 : 0.05
    positionsRef.current[0] = lane * 3 + (Math.random() - 0.5) * spread
    positionsRef.current[1] = playerY + 1 + (Math.random() - 0.5) * spread
    positionsRef.current[2] = (Math.random() - 0.5) * spread

    const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
    if (posAttr) posAttr.needsUpdate = true
  })

  return (
    <points ref={trailRef}>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.35}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        visible={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 3D Speed lines that fly past player during fever/speed boost
const SPEED_LINE_COUNT = 60

export function SpeedLines3D() {
  const phase = useGameStore(state => state.phase)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.LineBasicMaterial>(null)

  // Line positions - each line has 2 points (start and end)
  const positionsRef = useRef<Float32Array>(new Float32Array(SPEED_LINE_COUNT * 6))
  const velocitiesRef = useRef<Float32Array>(new Float32Array(SPEED_LINE_COUNT))
  const lifetimesRef = useRef<Float32Array>(new Float32Array(SPEED_LINE_COUNT))

  // Initialize lines
  useEffect(() => {
    for (let i = 0; i < SPEED_LINE_COUNT; i++) {
      lifetimesRef.current[i] = 0 // Start inactive
      velocitiesRef.current[i] = 0
    }
  }, [])

  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positionsRef.current, 3)
  }, [])

  useFrame((state, delta) => {
    if (phase !== 'playing') return

    const { speed, isFever, lane, playerY, activePowerup } = useGameStore.getState()
    const isSpeedBoosted = activePowerup?.type === 'speed'
    const showLines = isFever || isSpeedBoosted || speed > 40

    if (!showLines) {
      if (materialRef.current) materialRef.current.visible = false
      return
    }

    if (materialRef.current) {
      materialRef.current.visible = true
      materialRef.current.color.set(isFever ? '#facc15' : '#ffffff')
      materialRef.current.opacity = isFever ? 0.7 : 0.4
    }

    const playerX = lane * 3
    const spawnRate = isFever ? 0.4 : 0.2

    for (let i = 0; i < SPEED_LINE_COUNT; i++) {
      const idx = i * 6

      if (lifetimesRef.current[i] <= 0) {
        // Respawn line with chance based on fever state
        if (Math.random() < spawnRate) {
          // Spawn around player, ahead in Z
          const angle = Math.random() * Math.PI * 2
          const radius = 3 + Math.random() * 8
          const startX = playerX + Math.cos(angle) * radius
          const startY = playerY + 1 + (Math.random() - 0.3) * 6
          const startZ = -20 - Math.random() * 40

          // Line length
          const lineLength = 1.5 + Math.random() * 2.5

          positionsRef.current[idx] = startX
          positionsRef.current[idx + 1] = startY
          positionsRef.current[idx + 2] = startZ
          positionsRef.current[idx + 3] = startX
          positionsRef.current[idx + 4] = startY
          positionsRef.current[idx + 5] = startZ + lineLength

          velocitiesRef.current[i] = speed * (1.5 + Math.random() * 0.5)
          lifetimesRef.current[i] = 0.8 + Math.random() * 0.4
        }
      } else {
        // Update line position (move toward camera)
        const velocity = velocitiesRef.current[i] * delta
        positionsRef.current[idx + 2] += velocity
        positionsRef.current[idx + 5] += velocity

        // Decay lifetime
        lifetimesRef.current[i] -= delta

        // Reset if passed camera
        if (positionsRef.current[idx + 2] > 15) {
          lifetimesRef.current[i] = 0
        }
      }
    }

    if (geometryRef.current) {
      const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }
  })

  return (
    <lineSegments>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#ffffff"
        transparent
        opacity={0.4}
        linewidth={1}
        visible={false}
      />
    </lineSegments>
  )
}

// Fever activation burst effect
export function FeverBurst() {
  const phase = useGameStore(state => state.phase)
  const isFever = useGameStore(state => state.isFever)
  const prevFever = useRef(false)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  const BURST_PARTICLES = 80
  const positionsRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES * 3))
  const velocitiesRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES * 3))
  const livesRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES))

  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positionsRef.current, 3)
  }, [])

  useFrame((state, delta) => {
    if (phase !== 'playing') return

    const { lane, playerY } = useGameStore.getState()

    // Trigger burst when fever activates
    if (isFever && !prevFever.current) {
      const playerX = lane * 3
      const playerYPos = playerY + 1

      for (let i = 0; i < BURST_PARTICLES; i++) {
        const idx = i * 3
        const angle = (i / BURST_PARTICLES) * Math.PI * 2
        const elevation = (Math.random() - 0.5) * Math.PI

        positionsRef.current[idx] = playerX
        positionsRef.current[idx + 1] = playerYPos
        positionsRef.current[idx + 2] = 0

        const speed = 8 + Math.random() * 8
        velocitiesRef.current[idx] = Math.cos(angle) * Math.cos(elevation) * speed
        velocitiesRef.current[idx + 1] = Math.sin(elevation) * speed + 3
        velocitiesRef.current[idx + 2] = Math.sin(angle) * Math.cos(elevation) * speed

        livesRef.current[i] = 1.0
      }

      // Camera shake for fever activation
      useGameStore.getState().triggerCameraShake(18)
    }
    prevFever.current = isFever

    // Update burst particles
    let hasParticles = false
    for (let i = 0; i < BURST_PARTICLES; i++) {
      if (livesRef.current[i] <= 0) continue
      const idx = i * 3

      positionsRef.current[idx] += velocitiesRef.current[idx] * delta
      positionsRef.current[idx + 1] += velocitiesRef.current[idx + 1] * delta
      positionsRef.current[idx + 2] += velocitiesRef.current[idx + 2] * delta

      velocitiesRef.current[idx] *= 0.95
      velocitiesRef.current[idx + 1] -= 15 * delta
      velocitiesRef.current[idx + 2] *= 0.95

      livesRef.current[i] -= delta * 1.5
      if (livesRef.current[i] > 0) hasParticles = true
    }

    if (geometryRef.current && hasParticles) {
      const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }

    if (materialRef.current) {
      materialRef.current.visible = hasParticles
      // Pulsing glow
      materialRef.current.size = 0.4 + Math.sin(state.clock.elapsedTime * 12) * 0.1
    }
  })

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.4}
        color="#fbbf24"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        visible={false}
      />
    </points>
  )
}

// Powerup collection burst
export function PowerupBurst() {
  const phase = useGameStore(state => state.phase)
  const activePowerup = useGameStore(state => state.activePowerup)
  const prevPowerup = useRef<string | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  const BURST_PARTICLES = 50
  const positionsRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES * 3))
  const velocitiesRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES * 3))
  const livesRef = useRef<Float32Array>(new Float32Array(BURST_PARTICLES))
  const colorRef = useRef('#8b5cf6')

  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positionsRef.current, 3)
  }, [])

  useFrame((state, delta) => {
    if (phase !== 'playing') return

    const { lane, playerY } = useGameStore.getState()
    const currentPowerup = activePowerup?.type || null

    // Trigger burst when powerup activates
    if (currentPowerup && currentPowerup !== prevPowerup.current) {
      const playerX = lane * 3
      const playerYPos = playerY + 1.5

      // Set color based on powerup type
      switch (currentPowerup) {
        case 'magnet': colorRef.current = '#ef4444'; break
        case 'shield': colorRef.current = '#3b82f6'; break
        case 'speed': colorRef.current = '#f97316'; break
        case 'multiplier': colorRef.current = '#8b5cf6'; break
      }

      for (let i = 0; i < BURST_PARTICLES; i++) {
        const idx = i * 3
        const angle = (i / BURST_PARTICLES) * Math.PI * 2

        positionsRef.current[idx] = playerX
        positionsRef.current[idx + 1] = playerYPos
        positionsRef.current[idx + 2] = 0

        const speed = 5 + Math.random() * 5
        velocitiesRef.current[idx] = Math.cos(angle) * speed
        velocitiesRef.current[idx + 1] = Math.random() * 6 + 2
        velocitiesRef.current[idx + 2] = Math.sin(angle) * speed

        livesRef.current[i] = 0.8
      }

      // Camera shake for powerup
      useGameStore.getState().triggerCameraShake(10)
    }
    prevPowerup.current = currentPowerup

    // Update particles
    let hasParticles = false
    for (let i = 0; i < BURST_PARTICLES; i++) {
      if (livesRef.current[i] <= 0) continue
      const idx = i * 3

      positionsRef.current[idx] += velocitiesRef.current[idx] * delta
      positionsRef.current[idx + 1] += velocitiesRef.current[idx + 1] * delta
      positionsRef.current[idx + 2] += velocitiesRef.current[idx + 2] * delta

      velocitiesRef.current[idx + 1] -= 18 * delta
      livesRef.current[i] -= delta * 2
      if (livesRef.current[i] > 0) hasParticles = true
    }

    if (geometryRef.current && hasParticles) {
      const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
    }

    if (materialRef.current) {
      materialRef.current.visible = hasParticles
      materialRef.current.color.set(colorRef.current)
    }
  })

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.3}
        color="#8b5cf6"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        visible={false}
      />
    </points>
  )
}
