import * as THREE from 'three'
import {
  CAMERA_BASE_POSITION, CAMERA_FOV, CAMERA_SHAKE_DECAY,
  LANE_WIDTH,
} from '../config/constants'

export class CameraSystem {
  private camera: THREE.PerspectiveCamera
  private shakeIntensity = 0
  private shakeEnabled = true // Can be toggled for motion sickness

  // Smoothing
  private currentX = 0
  private currentFov = CAMERA_FOV

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.camera.position.set(
      CAMERA_BASE_POSITION.x,
      CAMERA_BASE_POSITION.y,
      CAMERA_BASE_POSITION.z,
    )
    this.camera.fov = CAMERA_FOV
    this.camera.lookAt(0, 1, -10)
    this.camera.updateProjectionMatrix()
  }

  setShakeEnabled(enabled: boolean): void {
    this.shakeEnabled = enabled
    if (!enabled) this.shakeIntensity = 0
  }

  triggerShake(intensity: number): void {
    if (!this.shakeEnabled) return
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity)
  }

  update(dt: number, playerLane: number, playerY: number, speed: number, isFever: boolean, isSlowMo: boolean): void {
    // Follow player lane with delay
    const targetX = playerLane * LANE_WIDTH * 0.3
    this.currentX = THREE.MathUtils.lerp(this.currentX, targetX, 3 * dt)

    // Base position
    let camY = CAMERA_BASE_POSITION.y
    let camZ = CAMERA_BASE_POSITION.z

    // Zoom out on jump
    if (playerY > 1) {
      camY += playerY * 0.3
      camZ += playerY * 0.5
    }

    // FOV changes based on speed
    const speedFov = CAMERA_FOV + (speed - 22) * 0.15
    const targetFov = isFever ? speedFov + 5 : speedFov
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, targetFov, 2 * dt)
    this.camera.fov = this.currentFov
    this.camera.updateProjectionMatrix()

    // Position
    this.camera.position.x = this.currentX
    this.camera.position.y = camY
    this.camera.position.z = camZ

    // Shake
    if (this.shakeIntensity > 0.1) {
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity * 0.02
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity * 0.02
      this.camera.position.x += shakeX
      this.camera.position.y += shakeY
      this.shakeIntensity = Math.max(0, this.shakeIntensity - CAMERA_SHAKE_DECAY * dt)
    }

    // Look target — slightly ahead
    this.camera.lookAt(this.currentX * 0.5, 1 + playerY * 0.2, -10)

    // Slight roll on lane switch
    const targetRoll = -playerLane * 0.02
    this.camera.rotation.z = THREE.MathUtils.lerp(this.camera.rotation.z, targetRoll, 3 * dt)
  }

  reset(): void {
    this.shakeIntensity = 0
    this.currentX = 0
    this.currentFov = CAMERA_FOV
    this.camera.position.set(
      CAMERA_BASE_POSITION.x,
      CAMERA_BASE_POSITION.y,
      CAMERA_BASE_POSITION.z,
    )
    this.camera.fov = CAMERA_FOV
    this.camera.rotation.set(0, 0, 0)
    this.camera.lookAt(0, 1, -10)
    this.camera.updateProjectionMatrix()
  }
}
