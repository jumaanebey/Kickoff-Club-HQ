import * as THREE from 'three'
import { POOL_PARTICLES } from '../config/constants'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
  size: number
  color: THREE.Color
  active: boolean
}

export class ParticleSystem {
  private scene: THREE.Scene
  private particles: Particle[] = []
  private geometry: THREE.BufferGeometry
  private material: THREE.PointsMaterial
  private points: THREE.Points

  private positions: Float32Array
  private colors: Float32Array
  private sizes: Float32Array

  // Quality scaling: 1.0 = full, 0.5 = half particles, etc.
  private _qualityScale = 1.0

  set qualityScale(value: number) {
    this._qualityScale = Math.max(0.2, Math.min(1, value))
  }

  get qualityScale(): number {
    return this._qualityScale
  }

  constructor(scene: THREE.Scene) {
    this.scene = scene

    // Pre-allocate particle array
    for (let i = 0; i < POOL_PARTICLES; i++) {
      this.particles.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        size: 0.1,
        color: new THREE.Color('#ffffff'),
        active: false,
      })
    }

    // GPU buffer
    this.positions = new Float32Array(POOL_PARTICLES * 3)
    this.colors = new Float32Array(POOL_PARTICLES * 3)
    this.sizes = new Float32Array(POOL_PARTICLES)

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1))

    this.material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
    this.scene.add(this.points)
  }

  private findFreeParticle(): Particle | null {
    for (const p of this.particles) {
      if (!p.active) return p
    }
    return null
  }

  // Emit a burst of particles at a position
  emit(
    x: number, y: number, z: number,
    count: number,
    color: string,
    speed: number = 5,
    life: number = 0.8,
    spread: number = 1,
    size: number = 0.1,
  ): void {
    const scaledCount = Math.max(1, Math.round(count * this._qualityScale))
    const col = new THREE.Color(color)
    for (let i = 0; i < scaledCount; i++) {
      const p = this.findFreeParticle()
      if (!p) break

      p.active = true
      p.position.set(x, y, z)
      p.velocity.set(
        (Math.random() - 0.5) * spread * speed,
        Math.random() * speed,
        (Math.random() - 0.5) * spread * speed,
      )
      p.life = life + Math.random() * life * 0.3
      p.maxLife = p.life
      p.size = size + Math.random() * size * 0.5
      p.color.copy(col)
    }
  }

  // Dust trail behind player
  emitDustTrail(x: number, y: number, z: number): void {
    this.emit(x, y + 0.1, z + 0.5, 2, '#8b7355', 1.5, 0.4, 0.5, 0.08)
  }

  // Jump burst
  emitJumpBurst(x: number, y: number, z: number): void {
    this.emit(x, y, z, 15, '#fbbf24', 4, 0.6, 1.2, 0.12)
  }

  // Coin collect
  emitCoinBurst(x: number, y: number, z: number): void {
    this.emit(x, y, z, 8, '#fbbf24', 3, 0.5, 0.8, 0.1)
  }

  // Shield glow
  emitShieldGlow(x: number, y: number, z: number): void {
    this.emit(x, y + 1, z, 3, '#06b6d4', 1, 0.3, 0.5, 0.15)
  }

  // Speed lines (directional)
  emitSpeedLines(x: number, y: number, z: number): void {
    for (let i = 0; i < 3; i++) {
      const p = this.findFreeParticle()
      if (!p) break
      p.active = true
      p.position.set(x + (Math.random() - 0.5) * 4, y + Math.random() * 3, z - 5 - Math.random() * 10)
      p.velocity.set(0, 0, 15) // Streak toward camera
      p.life = 0.3
      p.maxLife = 0.3
      p.size = 0.05
      p.color.set('#ffffff')
    }
  }

  // Fever burst
  emitFeverBurst(x: number, y: number, z: number): void {
    this.emit(x, y + 1, z, 40, '#f97316', 8, 1.0, 2.0, 0.15)
    this.emit(x, y + 1, z, 20, '#fbbf24', 6, 0.8, 1.5, 0.12)
  }

  // Near-miss sparks
  emitNearMissSparks(x: number, y: number, z: number, direction: number): void {
    for (let i = 0; i < 12; i++) {
      const p = this.findFreeParticle()
      if (!p) break
      p.active = true
      p.position.set(x, y, z)
      p.velocity.set(
        direction * (2 + Math.random() * 4),
        Math.random() * 3,
        (Math.random() - 0.5) * 2,
      )
      p.life = 0.4 + Math.random() * 0.3
      p.maxLife = p.life
      p.size = 0.08
      p.color.set('#fbbf24')
    }
  }

  // Confetti for milestones
  emitConfetti(x: number, y: number, z: number, count: number): void {
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#fbbf24', '#a855f7', '#ec4899']
    for (let i = 0; i < count; i++) {
      const p = this.findFreeParticle()
      if (!p) break
      p.active = true
      p.position.set(x + (Math.random() - 0.5) * 3, y + 2, z)
      p.velocity.set(
        (Math.random() - 0.5) * 6,
        3 + Math.random() * 5,
        (Math.random() - 0.5) * 4,
      )
      p.life = 1.5 + Math.random()
      p.maxLife = p.life
      p.size = 0.12 + Math.random() * 0.08
      p.color.set(colors[Math.floor(Math.random() * colors.length)])
    }
  }

  // Collision impact
  emitCollisionImpact(x: number, y: number, z: number): void {
    this.emit(x, y + 1, z, 25, '#ef4444', 6, 0.8, 1.5, 0.15)
  }

  update(dt: number): void {
    let activeCount = 0

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]

      if (!p.active) {
        this.positions[i * 3] = 0
        this.positions[i * 3 + 1] = -100 // Hide below ground
        this.positions[i * 3 + 2] = 0
        this.sizes[i] = 0
        continue
      }

      p.life -= dt
      if (p.life <= 0) {
        p.active = false
        this.sizes[i] = 0
        continue
      }

      // Physics
      p.velocity.y -= 9.8 * dt // Gravity on particles
      p.position.add(p.velocity.clone().multiplyScalar(dt))

      // Fade
      const lifeRatio = p.life / p.maxLife

      // Write to buffers
      this.positions[i * 3] = p.position.x
      this.positions[i * 3 + 1] = p.position.y
      this.positions[i * 3 + 2] = p.position.z
      this.colors[i * 3] = p.color.r
      this.colors[i * 3 + 1] = p.color.g
      this.colors[i * 3 + 2] = p.color.b
      this.sizes[i] = p.size * lifeRatio

      activeCount++
    }

    // Mark buffers as needing upload
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute
    const colAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute
    const sizeAttr = this.geometry.getAttribute('size') as THREE.BufferAttribute
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    sizeAttr.needsUpdate = true

    // Update draw range to only active particles
    this.geometry.setDrawRange(0, this.particles.length)
  }

  reset(): void {
    for (const p of this.particles) {
      p.active = false
    }
  }

  destroy(): void {
    this.scene.remove(this.points)
    this.geometry.dispose()
    this.material.dispose()
  }
}
