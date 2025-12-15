'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from './hooks/useGameStore'

// Camera configuration
const BASE_POSITION = new THREE.Vector3(0, 8, 12)
const BASE_LOOKAT = new THREE.Vector3(0, 2, -20)

// Dynamic offsets
const LANE_FOLLOW_FACTOR = 0.3 // How much camera follows player lane
const JUMP_ZOOM_OUT = 2 // Extra distance when jumping
const SPEED_ZOOM_FACTOR = 0.1 // Zoom in at high speed
const SHAKE_DECAY = 0.9

export function GameCamera() {
  const { camera } = useThree()
  const targetPosition = useRef(BASE_POSITION.clone())
  const targetLookAt = useRef(BASE_LOOKAT.clone())
  const shakeOffset = useRef(new THREE.Vector3())

  const {
    phase,
    lane,
    playerY,
    speed,
    cameraShake,
    slowMotion,
    activePowerup,
  } = useGameStore()

  useFrame((state, delta) => {
    if (phase !== 'playing' && phase !== 'gameover') {
      // Menu/paused camera - gentle orbit
      const time = state.clock.getElapsedTime()
      camera.position.x = Math.sin(time * 0.2) * 3
      camera.position.y = 10 + Math.sin(time * 0.3) * 1
      camera.position.z = 15
      camera.lookAt(0, 2, 0)
      return
    }

    // Calculate target position based on game state
    const laneOffset = lane * LANE_FOLLOW_FACTOR * 3
    const jumpOffset = playerY > 0 ? JUMP_ZOOM_OUT * (playerY / 10) : 0
    const speedOffset = Math.max(0, (speed - 20) * SPEED_ZOOM_FACTOR)

    // Speed boost zoom
    const isSpeedBoosted = activePowerup?.type === 'speed'
    const speedBoostZoom = isSpeedBoosted ? -3 : 0

    targetPosition.current.set(
      laneOffset,
      BASE_POSITION.y + jumpOffset * 0.5,
      BASE_POSITION.z + jumpOffset - speedOffset + speedBoostZoom
    )

    targetLookAt.current.set(
      laneOffset * 0.5,
      BASE_LOOKAT.y,
      BASE_LOOKAT.z
    )

    // Camera shake
    if (cameraShake > 0.1) {
      shakeOffset.current.set(
        (Math.random() - 0.5) * cameraShake * 0.1,
        (Math.random() - 0.5) * cameraShake * 0.1,
        (Math.random() - 0.5) * cameraShake * 0.05
      )
    } else {
      shakeOffset.current.multiplyScalar(SHAKE_DECAY)
    }

    // Slow motion effect - reduce delta
    const effectiveDelta = slowMotion ? delta * 0.3 : delta

    // Smooth interpolation
    const lerpFactor = Math.min(1, effectiveDelta * 5)

    camera.position.lerp(
      targetPosition.current.clone().add(shakeOffset.current),
      lerpFactor
    )

    // Look at target with shake
    const lookAtTarget = targetLookAt.current.clone().add(
      shakeOffset.current.clone().multiplyScalar(0.5)
    )
    camera.lookAt(lookAtTarget)

    // FOV changes for speed effect
    const baseFov = 60
    const speedFovBoost = isSpeedBoosted ? 10 : Math.max(0, (speed - 30) * 0.5)
    const targetFov = baseFov + speedFovBoost

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, lerpFactor)
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// Dramatic camera for game over
export function GameOverCamera() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const { phase } = useGameStore()

  useFrame((_, delta) => {
    if (phase !== 'gameover') return

    timeRef.current += delta

    // Dramatic zoom out and spin
    const t = Math.min(1, timeRef.current / 2)
    const eased = 1 - Math.pow(1 - t, 3) // Ease out cubic

    camera.position.x = Math.sin(timeRef.current * 0.5) * 5
    camera.position.y = 8 + eased * 5
    camera.position.z = 12 + eased * 8

    camera.lookAt(0, 1, 0)
  })

  return null
}
