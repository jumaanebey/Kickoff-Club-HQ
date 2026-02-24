import * as THREE from 'three'
import { EventBus } from '../core/EventBus'
import { GameLoop } from '../core/GameLoop'
import { ParticleSystem } from './ParticleSystem'
import { CameraSystem } from './CameraSystem'
import { SLOW_MOTION_TIMESCALE } from '../config/constants'

// JuiceSystem orchestrates game feel: hit-stop, slow-mo, screen effects, speed lines
export class JuiceSystem {
  private events: EventBus
  private loop: GameLoop
  private particles: ParticleSystem
  private camera: CameraSystem
  private scene: THREE.Scene

  // Hit-stop state
  private hitStopTimer = 0
  private hitStopDuration = 0.05 // 50ms freeze

  // Slow-motion state
  private slowMoTimer = 0
  private slowMoActive = false

  // Speed lines vignette (post-processing via overlay mesh)
  private speedLinesMesh: THREE.Mesh | null = null

  // Fever tint
  private feverOverlay: THREE.Mesh | null = null
  private feverActive = false

  constructor(
    scene: THREE.Scene,
    events: EventBus,
    loop: GameLoop,
    particles: ParticleSystem,
    camera: CameraSystem,
  ) {
    this.scene = scene
    this.events = events
    this.loop = loop
    this.particles = particles
    this.camera = camera

    // Listen for juice-triggering events
    this.events.on('cameraShake', (intensity) => {
      this.camera.triggerShake(intensity)
    })

    this.events.on('slowMotion', (durationMs) => {
      this.triggerSlowMotion(durationMs / 1000)
    })

    this.events.on('feverActivated', () => {
      this.feverActive = true
    })
    this.events.on('feverEnded', () => {
      this.feverActive = false
    })
  }

  // Hit-stop: brief freeze on collision for impact feel
  triggerHitStop(): void {
    this.hitStopTimer = this.hitStopDuration
    this.loop.setTimeScale(0) // Full freeze
  }

  // Slow-motion: reduced timescale
  triggerSlowMotion(duration: number): void {
    this.slowMoTimer = duration
    this.slowMoActive = true
    this.loop.setTimeScale(SLOW_MOTION_TIMESCALE)
  }

  // "JUKED!" moment: slow-mo + zoom + popup on defender dodge
  triggerJukedMoment(x: number, y: number, z: number, label: string): void {
    this.triggerSlowMotion(0.4)
    this.camera.triggerShake(8)
    this.particles.emitNearMissSparks(x, y, z, 1)
    this.particles.emitNearMissSparks(x, y, z, -1)
    this.events.emit('popup', {
      id: Date.now(),
      text: `JUKED the ${label}!`,
      type: 'juke',
    })
  }

  // Speed lines during fever or high speed
  emitSpeedLines(x: number, y: number, z: number): void {
    this.particles.emitSpeedLines(x, y, z)
  }

  update(dt: number): void {
    // Hit-stop expiry
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt
      if (this.hitStopTimer <= 0) {
        this.hitStopTimer = 0
        // Restore slow-mo or normal
        if (this.slowMoActive) {
          this.loop.setTimeScale(SLOW_MOTION_TIMESCALE)
        } else {
          this.loop.setTimeScale(1)
        }
      }
    }

    // Slow-mo expiry
    if (this.slowMoActive && this.hitStopTimer <= 0) {
      this.slowMoTimer -= dt
      if (this.slowMoTimer <= 0) {
        this.slowMoActive = false
        this.slowMoTimer = 0
        this.loop.setTimeScale(1)
      }
    }
  }

  reset(): void {
    this.hitStopTimer = 0
    this.slowMoTimer = 0
    this.slowMoActive = false
    this.feverActive = false
    this.loop.setTimeScale(1)
  }

  destroy(): void {
    this.reset()
    if (this.speedLinesMesh) {
      this.scene.remove(this.speedLinesMesh)
      this.speedLinesMesh.geometry.dispose()
      ;(this.speedLinesMesh.material as THREE.Material).dispose()
    }
    if (this.feverOverlay) {
      this.scene.remove(this.feverOverlay)
      this.feverOverlay.geometry.dispose()
      ;(this.feverOverlay.material as THREE.Material).dispose()
    }
  }
}
