'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'

// Simplified particle system using refs for updates (no React state in game loop)
export function ParticleSystem() {
  // Only subscribe to phase (changes rarely)
  const phase = useGameStore(state => state.phase)
  const prevGrounded = useRef(true)
  const prevLane = useRef(0)

  // Particle pool stored in refs
  const dustParticlesRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
    lives: Float32Array
    count: number
  }>({
    positions: new Float32Array(150), // 50 particles * 3
    velocities: new Float32Array(150),
    lives: new Float32Array(50),
    count: 0
  })

  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const nextSlotRef = useRef(0)

  // Create particles at position
  const emitDust = useCallback((x: number, y: number, z: number, count: number) => {
    const particles = dustParticlesRef.current
    for (let i = 0; i < count; i++) {
      const slot = nextSlotRef.current % 50
      const idx = slot * 3

      particles.positions[idx] = x + (Math.random() - 0.5) * 0.5
      particles.positions[idx + 1] = y
      particles.positions[idx + 2] = z + (Math.random() - 0.5) * 0.5

      particles.velocities[idx] = (Math.random() - 0.5) * 5
      particles.velocities[idx + 1] = Math.random() * 4 + 2
      particles.velocities[idx + 2] = (Math.random() - 0.5) * 5

      particles.lives[slot] = 1.0

      nextSlotRef.current++
      particles.count = Math.min(50, particles.count + 1)
    }
  }, [])

  // Update particles each frame (no state updates)
  useFrame((_, delta) => {
    if (phase !== 'playing') return

    const particles = dustParticlesRef.current
    let hasActiveParticles = false

    // Update each particle
    for (let i = 0; i < 50; i++) {
      if (particles.lives[i] <= 0) continue

      const idx = i * 3

      // Apply velocity
      particles.positions[idx] += particles.velocities[idx] * delta
      particles.positions[idx + 1] += particles.velocities[idx + 1] * delta
      particles.positions[idx + 2] += particles.velocities[idx + 2] * delta

      // Gravity
      particles.velocities[idx + 1] -= 15 * delta

      // Decay life
      particles.lives[i] -= delta * 2

      if (particles.lives[i] > 0) hasActiveParticles = true
    }

    // Update geometry buffer
    if (geometryRef.current && hasActiveParticles) {
      const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
      if (posAttr) {
        posAttr.needsUpdate = true
      }
    }

    // Read frequently-changing values directly from store (no re-renders)
    const { isGrounded, isSliding, playerY, lane } = useGameStore.getState()

    // Trigger dust on events
    // Landing
    if (!prevGrounded.current && isGrounded) {
      emitDust(lane * 3, 0.1, 0, 8)
    }
    prevGrounded.current = isGrounded

    // Lane switch
    if (prevLane.current !== lane) {
      emitDust(prevLane.current * 3, 0.2, 0, 5)
      useGameStore.getState().triggerCameraShake(3)
    }
    prevLane.current = lane

    // Running dust (occasional)
    if (playerY === 0 && !isSliding && Math.random() < 0.03) {
      emitDust(lane * 3, 0.1, 0, 2)
    }
  })

  // Create buffer attribute once
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(dustParticlesRef.current.positions, 3)
  }, [])

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#a3a3a3"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}


// Trail effect for player
export function PlayerTrail() {
  // Only subscribe to phase (changes rarely)
  const phase = useGameStore(state => state.phase)
  const trailRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const positionsRef = useRef<Float32Array>(new Float32Array(300)) // 100 points * 3

  // Create buffer attribute once
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(positionsRef.current, 3)
  }, [])

  useFrame(() => {
    if (!geometryRef.current || !materialRef.current || phase !== 'playing') return

    // Read frequently-changing values directly from store (no re-renders)
    const { activePowerup, speed, isFever, lane, playerY } = useGameStore.getState()
    const hasTrail = activePowerup?.type === 'speed' || speed > 35 || isFever

    // Update material properties
    materialRef.current.size = isFever ? 0.5 : 0.3
    materialRef.current.color.set(isFever ? '#facc15' : (activePowerup?.type === 'speed' ? '#f97316' : '#3b82f6'))
    materialRef.current.visible = hasTrail

    if (!hasTrail) return

    // Shift all positions back
    for (let i = positionsRef.current.length - 3; i >= 3; i -= 3) {
      positionsRef.current[i] = positionsRef.current[i - 3]
      positionsRef.current[i + 1] = positionsRef.current[i - 2]
      positionsRef.current[i + 2] = positionsRef.current[i - 1]
    }

    // Add new position at front (player position)
    positionsRef.current[0] = lane * 3
    positionsRef.current[1] = playerY + 1
    positionsRef.current[2] = 0

    const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute
    if (posAttr) {
      posAttr.needsUpdate = true
    }
  })

  return (
    <points ref={trailRef}>
      <bufferGeometry ref={geometryRef}>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.3}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        visible={false}
      />
    </points>
  )
}
