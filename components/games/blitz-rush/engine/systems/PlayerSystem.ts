import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EventBus, type GamePhase } from '../core/EventBus'
import {
  GRAVITY, JUMP_FORCE, LANE_WIDTH, LANE_SWITCH_SPEED,
  SLIDE_DURATION, FAST_FALL_MULTIPLIER, type Lane,
} from '../config/constants'

type AnimState = 'run' | 'jump' | 'slide' | 'hit'

export class PlayerSystem {
  private scene: THREE.Scene
  private events: EventBus
  private group: THREE.Group

  // State
  lane: Lane = 0
  targetLane: Lane = 0
  playerY = 0
  velocityY = 0
  isJumping = false
  isSliding = false
  isGrounded = true
  private animState: AnimState = 'run'

  // Model
  private model: THREE.Group | null = null
  private mixer: THREE.AnimationMixer | null = null
  private animations: Map<string, THREE.AnimationAction> = new Map()

  // Procedural parts (fallback if GLB not loaded)
  private body: THREE.Mesh | null = null
  private helmet: THREE.Mesh | null = null
  private cape: THREE.Mesh | null = null
  private shieldBubble: THREE.Mesh | null = null

  // Slide timer
  private slideTimer: ReturnType<typeof setTimeout> | null = null

  // Visual smoothing
  private visualX = 0

  // Skin
  private jerseyColor = new THREE.Color('#f97316')

  constructor(scene: THREE.Scene, events: EventBus) {
    this.scene = scene
    this.events = events
    this.group = new THREE.Group()
    this.group.position.set(0, 0, 0)
    this.scene.add(this.group)

    this.buildProceduralPlayer()
    this.loadModel()
  }

  private buildProceduralPlayer(): void {
    // Bean-shaped kawaii football player
    const bodyGeo = new THREE.CapsuleGeometry(0.45, 0.8, 12, 24)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.jerseyColor,
      roughness: 0.6,
      metalness: 0.1,
    })
    this.body = new THREE.Mesh(bodyGeo, bodyMat)
    this.body.position.y = 1.2
    this.body.castShadow = true
    this.group.add(this.body)

    // Helmet
    const helmetGeo = new THREE.SphereGeometry(0.4, 24, 24)
    const helmetMat = new THREE.MeshStandardMaterial({
      color: '#1e3a5f',
      roughness: 0.25,
      metalness: 0.6,
    })
    this.helmet = new THREE.Mesh(helmetGeo, helmetMat)
    this.helmet.position.y = 2.1
    this.helmet.castShadow = true
    this.group.add(this.helmet)

    // Helmet stripe
    const stripeGeo = new THREE.BoxGeometry(0.06, 0.2, 0.8)
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#ffffff' })
    const stripe = new THREE.Mesh(stripeGeo, stripeMat)
    stripe.position.y = 2.2
    this.group.add(stripe)

    // Face mask
    const maskGeo = new THREE.BoxGeometry(0.45, 0.035, 0.035)
    const maskMat = new THREE.MeshStandardMaterial({ color: '#1f2937', metalness: 0.9 })
    for (let i = -1; i <= 1; i++) {
      const bar = new THREE.Mesh(maskGeo, maskMat)
      bar.position.set(0, 1.95 + i * 0.1, 0.35)
      this.group.add(bar)
    }

    // Shoulder pads
    const padGeo = new THREE.BoxGeometry(1.3, 0.25, 0.5)
    const padMat = new THREE.MeshStandardMaterial({ color: '#1e3a5f', roughness: 0.4 })
    const pads = new THREE.Mesh(padGeo, padMat)
    pads.position.y = 1.7
    pads.castShadow = true
    this.group.add(pads)

    // Legs
    const legGeo = new THREE.CapsuleGeometry(0.14, 0.4, 8, 12)
    const legMat = new THREE.MeshStandardMaterial({ color: '#1f2937' })
    for (const xOff of [-0.2, 0.2]) {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(xOff, 0.3, 0.1)
      leg.castShadow = true
      this.group.add(leg)
    }

    // Cape
    const capeGeo = new THREE.PlaneGeometry(0.8, 1.0)
    const capeMat = new THREE.MeshStandardMaterial({
      color: this.jerseyColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    this.cape = new THREE.Mesh(capeGeo, capeMat)
    this.cape.position.set(0, 1.2, -0.5)
    this.cape.rotation.x = 0.3
    this.group.add(this.cape)

    // Shadow on ground
    const shadowGeo = new THREE.CircleGeometry(0.6, 16)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    })
    const shadow = new THREE.Mesh(shadowGeo, shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    this.group.add(shadow)

    // Shield bubble (hidden by default)
    const shieldGeo = new THREE.SphereGeometry(1.5, 24, 24)
    const shieldMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      transparent: true,
      opacity: 0,
      emissive: '#06b6d4',
      emissiveIntensity: 0,
    })
    this.shieldBubble = new THREE.Mesh(shieldGeo, shieldMat)
    this.shieldBubble.position.y = 1.2
    this.group.add(this.shieldBubble)
  }

  private async loadModel(): Promise<void> {
    try {
      const loader = new GLTFLoader()
      const gltf = await loader.loadAsync('/games/blitz-rush/models/player-animated.glb')
      this.model = gltf.scene
      this.model.scale.set(1, 1, 1)
      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
        }
      })

      if (gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model)
        for (const clip of gltf.animations) {
          this.animations.set(clip.name.toLowerCase(), this.mixer.clipAction(clip))
        }
      }

      // Model loaded but we keep procedural player visible
      // The GLB can be swapped in if desired
    } catch {
      // Model not available, procedural fallback is already active
    }
  }

  switchLane(direction: 'left' | 'right'): void {
    const newLane = direction === 'left'
      ? Math.max(-1, this.lane - 1) as Lane
      : Math.min(1, this.lane + 1) as Lane

    if (newLane === this.lane) return

    this.lane = newLane
    this.targetLane = newLane
    this.events.emit('playSound', { name: 'laneSwitch' })
  }

  jump(): boolean {
    if (!this.isGrounded || this.isSliding) return false

    this.isJumping = true
    this.isGrounded = false
    this.velocityY = JUMP_FORCE
    this.animState = 'jump'
    this.events.emit('playSound', { name: 'jump' })
    return true
  }

  slide(): boolean {
    if (this.isJumping && !this.isGrounded) {
      // Fast fall
      this.velocityY = -JUMP_FORCE * FAST_FALL_MULTIPLIER
      return true
    }

    if (!this.isGrounded) return false

    // Clear existing slide timer
    if (this.slideTimer) {
      clearTimeout(this.slideTimer)
    }

    this.isSliding = true
    this.animState = 'slide'
    this.events.emit('playSound', { name: 'slide' })

    this.slideTimer = setTimeout(() => {
      this.isSliding = false
      this.animState = 'run'
      this.slideTimer = null
    }, SLIDE_DURATION)

    return true
  }

  land(): void {
    this.isJumping = false
    this.isGrounded = true
    this.playerY = 0
    this.velocityY = 0
    this.animState = this.isSliding ? 'slide' : 'run'
    this.events.emit('playSound', { name: 'land' })
    this.events.emit('cameraShake', 5)
  }

  setShieldVisible(visible: boolean): void {
    if (!this.shieldBubble) return
    const mat = this.shieldBubble.material as THREE.MeshStandardMaterial
    mat.opacity = visible ? 0.2 : 0
    mat.emissiveIntensity = visible ? 0.5 : 0
  }

  setJerseyColor(color: string): void {
    this.jerseyColor.set(color)
    if (this.body) {
      (this.body.material as THREE.MeshStandardMaterial).color.set(color)
    }
    if (this.cape) {
      (this.cape.material as THREE.MeshStandardMaterial).color.set(color)
    }
  }

  update(dt: number, timeScale: number): void {
    const adjustedDt = dt * timeScale

    // Gravity
    if (!this.isGrounded) {
      this.velocityY -= GRAVITY * adjustedDt
      this.playerY += this.velocityY * adjustedDt

      if (this.playerY <= 0) {
        this.land()
      }
    }

    // Smooth lane switching
    const targetX = this.lane * LANE_WIDTH
    const diff = targetX - this.visualX
    if (Math.abs(diff) > 0.01) {
      this.visualX += Math.sign(diff) * Math.min(Math.abs(diff), LANE_SWITCH_SPEED * adjustedDt)
    } else {
      this.visualX = targetX
    }

    // Update group position
    this.group.position.x = this.visualX
    this.group.position.y = this.playerY

    // Animate cape based on speed
    if (this.cape) {
      this.cape.rotation.x = 0.3 + Math.sin(Date.now() * 0.003) * 0.1
    }

    // Scale body for slide
    if (this.body) {
      const targetScaleY = this.isSliding ? 0.5 : 1
      this.body.scale.y = THREE.MathUtils.lerp(this.body.scale.y, targetScaleY, 10 * adjustedDt)
      const targetPosY = this.isSliding ? 0.6 : 1.2
      this.body.position.y = THREE.MathUtils.lerp(this.body.position.y, targetPosY, 10 * adjustedDt)
    }

    // Somersault during jump
    if (this.isJumping && this.body) {
      this.body.rotation.x += 8 * adjustedDt
    } else if (this.body) {
      this.body.rotation.x = THREE.MathUtils.lerp(this.body.rotation.x, 0, 8 * adjustedDt)
    }

    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(adjustedDt)
    }

    // Bobble shield bubble
    if (this.shieldBubble) {
      this.shieldBubble.rotation.y += adjustedDt * 0.5
    }
  }

  reset(): void {
    this.lane = 0
    this.targetLane = 0
    this.playerY = 0
    this.velocityY = 0
    this.isJumping = false
    this.isSliding = false
    this.isGrounded = true
    this.visualX = 0
    this.animState = 'run'
    this.group.position.set(0, 0, 0)
    this.setShieldVisible(false)

    if (this.slideTimer) {
      clearTimeout(this.slideTimer)
      this.slideTimer = null
    }

    if (this.body) {
      this.body.scale.y = 1
      this.body.position.y = 1.2
      this.body.rotation.x = 0
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.group.position.clone()
  }

  destroy(): void {
    if (this.slideTimer) clearTimeout(this.slideTimer)
    this.scene.remove(this.group)
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    })
  }
}
