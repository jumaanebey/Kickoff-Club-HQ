'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'

// Particle configuration
interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  color: THREE.Color
  size: number
  life: number
  maxLife: number
}

interface ParticleBurst {
  id: number
  particles: Particle[]
  type: 'coin' | 'dust' | 'impact' | 'sparkle' | 'confetti'
}

// Particle system component
export function ParticleSystem() {
  const [bursts, setBursts] = useState<ParticleBurst[]>([])
  const burstIdRef = useRef(0)

  const { phase, playerY, isJumping, isSliding } = useGameStore()

  // Create a particle burst
  const createBurst = useCallback((
    position: THREE.Vector3,
    type: ParticleBurst['type'],
    count: number = 20
  ) => {
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          Math.random() * 8 + 2,
          (Math.random() - 0.5) * 10
        ),
        color: getParticleColor(type),
        size: getParticleSize(type),
        life: 1,
        maxLife: 1 + Math.random() * 0.5,
      }
      particles.push(particle)
    }

    const burst: ParticleBurst = {
      id: burstIdRef.current++,
      particles,
      type,
    }

    setBursts(prev => [...prev, burst])
  }, [])

  // Update particles
  useFrame((_, delta) => {
    setBursts(prev => {
      return prev.map(burst => ({
        ...burst,
        particles: burst.particles.map(p => {
          // Update position
          p.position.add(p.velocity.clone().multiplyScalar(delta))

          // Apply gravity
          p.velocity.y -= 20 * delta

          // Decay life
          p.life -= delta / p.maxLife

          return p
        }).filter(p => p.life > 0),
      })).filter(burst => burst.particles.length > 0)
    })
  })

  // Expose createBurst to game via context or store
  // For now, we'll trigger based on game events
  useFrame(() => {
    if (phase !== 'playing') return

    // Dust particles when running (occasionally)
    if (playerY === 0 && !isSliding && Math.random() < 0.05) {
      createBurst(
        new THREE.Vector3(0, 0.1, 0),
        'dust',
        3
      )
    }
  })

  return (
    <group>
      {bursts.map(burst => (
        <ParticleBurstRenderer key={burst.id} burst={burst} />
      ))}
    </group>
  )
}

// Render individual burst
function ParticleBurstRenderer({ burst }: { burst: ParticleBurst }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(burst.particles.length * 3)
    const colors = new Float32Array(burst.particles.length * 3)
    const sizes = new Float32Array(burst.particles.length)

    burst.particles.forEach((p, i) => {
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z

      colors[i * 3] = p.color.r
      colors[i * 3 + 1] = p.color.g
      colors[i * 3 + 2] = p.color.b

      sizes[i] = p.size * p.life
    })

    return { positions, colors, sizes }
  }, [burst.particles])

  useFrame(() => {
    if (!pointsRef.current) return

    const posAttr = pointsRef.current.geometry.attributes.position
    const sizeAttr = pointsRef.current.geometry.attributes.size

    burst.particles.forEach((p, i) => {
      posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z)
      sizeAttr.setX(i, p.size * p.life)
    })

    posAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={burst.particles.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={burst.particles.length}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={burst.particles.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Helper functions
function getParticleColor(type: ParticleBurst['type']): THREE.Color {
  switch (type) {
    case 'coin':
      return new THREE.Color('#fbbf24')
    case 'dust':
      return new THREE.Color('#a3a3a3')
    case 'impact':
      return new THREE.Color('#ef4444')
    case 'sparkle':
      return new THREE.Color('#ffffff')
    case 'confetti':
      const confettiColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6']
      return new THREE.Color(confettiColors[Math.floor(Math.random() * confettiColors.length)])
    default:
      return new THREE.Color('#ffffff')
  }
}

function getParticleSize(type: ParticleBurst['type']): number {
  switch (type) {
    case 'coin':
      return 0.3
    case 'dust':
      return 0.15
    case 'impact':
      return 0.4
    case 'sparkle':
      return 0.2
    case 'confetti':
      return 0.25
    default:
      return 0.2
  }
}

// Trail effect for player
export function PlayerTrail() {
  const { phase, activePowerup, speed } = useGameStore()
  const trailRef = useRef<THREE.Points>(null)
  const positions = useRef<Float32Array>(new Float32Array(300)) // 100 points * 3
  const opacities = useRef<Float32Array>(new Float32Array(100))

  const hasTrail = activePowerup?.type === 'speed' || speed > 35

  useFrame(() => {
    if (!trailRef.current || phase !== 'playing' || !hasTrail) return

    // Shift all positions back
    for (let i = positions.current.length - 3; i >= 3; i -= 3) {
      positions.current[i] = positions.current[i - 3]
      positions.current[i + 1] = positions.current[i - 2]
      positions.current[i + 2] = positions.current[i - 1]
    }

    // Add new position at front (player position)
    const { lane, playerY } = useGameStore.getState()
    positions.current[0] = lane * 3
    positions.current[1] = playerY + 1
    positions.current[2] = 0

    // Update opacities
    for (let i = 0; i < opacities.current.length; i++) {
      opacities.current[i] = 1 - (i / opacities.current.length)
    }

    const posAttr = trailRef.current.geometry.attributes.position
    if (posAttr) {
      posAttr.needsUpdate = true
    }
  })

  if (!hasTrail) return null

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color={activePowerup?.type === 'speed' ? '#f97316' : '#3b82f6'}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
