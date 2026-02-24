import * as THREE from 'three'
import { EventBus } from '../core/EventBus'
import {
  LANE_WIDTH, SPAWN_DISTANCE, DESPAWN_DISTANCE,
  COLLISION_THRESHOLD_Z, NEAR_MISS_THRESHOLD,
  HITBOXES, OBSTACLE_SPAWN_TABLE, FIRST_RUN_PATTERN,
  FIRST_RUN_OBSTACLE_SPACING, MIN_OBSTACLE_SPACING,
  type ObstacleType, type Lane,
} from '../config/constants'
import { getObstacleSpacing, getDifficultyLevel, getSpawnProbability } from '../config/difficulty'
import { EDUCATIONAL_LABELS, type ObstacleLabel } from './ObstacleLabels'

interface ActiveObstacle {
  id: number
  type: ObstacleType
  lane: Lane
  z: number
  hit: boolean
  group: THREE.Group
  label?: ObstacleLabel
  labelEmitted?: boolean
  rollingOffset?: number // For rolling barrel
}

// Materials cache to avoid re-creating
const matCache = new Map<string, THREE.Material>()

function getMat(key: string, factory: () => THREE.Material): THREE.Material {
  if (!matCache.has(key)) matCache.set(key, factory())
  return matCache.get(key)!
}

export class ObstacleSystem {
  private scene: THREE.Scene
  private events: EventBus
  private obstacles: ActiveObstacle[] = []
  private nextId = 0
  private lastSpawnZ = 0
  private tutorialIndex = 0
  private processedIds = new Set<number>()

  // Shared geometries
  private geoCache = new Map<string, THREE.BufferGeometry>()

  constructor(scene: THREE.Scene, events: EventBus) {
    this.scene = scene
    this.events = events
  }

  private getGeo(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (!this.geoCache.has(key)) this.geoCache.set(key, factory())
    return this.geoCache.get(key)!
  }

  private buildObstacleMesh(type: ObstacleType): THREE.Group {
    const group = new THREE.Group()

    switch (type) {
      case 'hurdle':
        this.buildHurdle(group)
        break
      case 'defender':
        this.buildDefender(group)
        break
      case 'barrier':
        this.buildBarrier(group)
        break
      case 'tackledummy':
        this.buildTackleDummy(group)
        break
      case 'doublehurdle':
        this.buildDoubleHurdle(group)
        break
      case 'rollingbarrel':
        this.buildRollingBarrel(group)
        break
      case 'twolanewall':
        this.buildTwoLaneWall(group)
        break
      case 'sprintzone':
        this.buildSprintZone(group)
        break
    }

    return group
  }

  private buildHurdle(group: THREE.Group): void {
    const postGeo = this.getGeo('hurdlePost', () => new THREE.CylinderGeometry(0.06, 0.08, 1.1, 8))
    const postMat = getMat('metalLight', () => new THREE.MeshStandardMaterial({ color: '#d4d4d8', metalness: 0.8, roughness: 0.2 }))
    const barGeo = this.getGeo('hurdleBar', () => new THREE.BoxGeometry(2.0, 0.12, 0.08))
    const barMat = getMat('red', () => new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 }))

    const lPost = new THREE.Mesh(postGeo, postMat)
    lPost.position.set(-0.9, 0.55, 0)
    lPost.castShadow = true
    group.add(lPost)

    const rPost = new THREE.Mesh(postGeo, postMat)
    rPost.position.set(0.9, 0.55, 0)
    rPost.castShadow = true
    group.add(rPost)

    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(0, 1.0, 0)
    bar.castShadow = true
    group.add(bar)

    // White stripes
    const stripeGeo = this.getGeo('hurdleStripe', () => new THREE.BoxGeometry(0.25, 0.12, 0.01))
    const whiteMat = getMat('white', () => new THREE.MeshStandardMaterial({ color: '#ffffff' }))
    for (const x of [-0.6, 0, 0.6]) {
      const stripe = new THREE.Mesh(stripeGeo, whiteMat)
      stripe.position.set(x, 1.0, 0.045)
      group.add(stripe)
    }
  }

  private buildDefender(group: THREE.Group): void {
    const jerseyColor = '#dc2626'
    const helmetColor = '#7f1d1d'

    // Body
    const bodyGeo = this.getGeo('defBody', () => new THREE.CapsuleGeometry(0.5, 1.0, 12, 24))
    const bodyMat = getMat('defJersey', () => new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.6 }))
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.set(0, 1.2, 0)
    body.castShadow = true
    group.add(body)

    // Danger glow
    const glowGeo = this.getGeo('defGlow', () => new THREE.SphereGeometry(2, 16, 16))
    const glowMat = getMat('defGlowMat', () => new THREE.MeshBasicMaterial({ color: '#dc2626', transparent: true, opacity: 0.08 }))
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.y = 1.5
    group.add(glow)

    // Helmet
    const helmetGeo = this.getGeo('defHelmet', () => new THREE.SphereGeometry(0.48, 24, 24))
    const helmetMat = getMat('defHelmetMat', () => new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.25, metalness: 0.6 }))
    const helmet = new THREE.Mesh(helmetGeo, helmetMat)
    helmet.position.set(0, 2.15, 0)
    helmet.castShadow = true
    group.add(helmet)

    // Shoulder pads
    const padGeo = this.getGeo('defPad', () => new THREE.BoxGeometry(1.5, 0.3, 0.6))
    const padMat = getMat('defPadMat', () => new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.4 }))
    const pad = new THREE.Mesh(padGeo, padMat)
    pad.position.y = 1.75
    pad.castShadow = true
    group.add(pad)

    // Arms
    const armGeo = this.getGeo('defArm', () => new THREE.CapsuleGeometry(0.14, 0.5, 8, 12))
    for (const xSign of [-1, 1]) {
      const arm = new THREE.Mesh(armGeo, bodyMat)
      arm.position.set(xSign * 0.7, 1.1, 0.2)
      arm.rotation.z = xSign * 0.6
      arm.castShadow = true
      group.add(arm)
    }

    // Legs
    const legGeo = this.getGeo('defLeg', () => new THREE.CapsuleGeometry(0.16, 0.5, 8, 12))
    const legMat = getMat('defLegMat', () => new THREE.MeshStandardMaterial({ color: '#1f2937' }))
    for (const xSign of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(xSign * 0.25, 0.35, 0.15)
      leg.castShadow = true
      group.add(leg)
    }

    // Face mask bars
    const maskGeo = this.getGeo('defMask', () => new THREE.BoxGeometry(0.55, 0.035, 0.035))
    const maskMat = getMat('defMaskMat', () => new THREE.MeshStandardMaterial({ color: '#1f2937', metalness: 0.9, roughness: 0.2 }))
    for (const y of [-0.12, 0, 0.12]) {
      const bar = new THREE.Mesh(maskGeo, maskMat)
      bar.position.set(0, 2.0 + y, 0.4)
      group.add(bar)
    }
  }

  private buildBarrier(group: THREE.Group): void {
    const mainGeo = this.getGeo('barrierMain', () => new THREE.BoxGeometry(2.4, 3.0, 0.4))
    const mainMat = getMat('orange', () => new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.7 }))
    const main = new THREE.Mesh(mainGeo, mainMat)
    main.position.set(0, 1.5, 0)
    main.castShadow = true
    group.add(main)

    // Diagonal warning stripes
    const stripeGeo = this.getGeo('barrierStripe', () => new THREE.PlaneGeometry(3.5, 0.35))
    const darkMat = getMat('dark', () => new THREE.MeshStandardMaterial({ color: '#1f2937' }))
    for (const y of [0.8, 0, -0.8]) {
      const stripe = new THREE.Mesh(stripeGeo, darkMat)
      stripe.position.set(0, 1.5 + y, 0.21)
      stripe.rotation.z = Math.PI / 6
      group.add(stripe)
    }

    // Warning light
    const lightGeo = this.getGeo('barrierLight', () => new THREE.CylinderGeometry(0.15, 0.15, 0.15, 16))
    const lightMat = getMat('yellowGlow', () => new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 1.5 }))
    const light = new THREE.Mesh(lightGeo, lightMat)
    light.position.set(0, 3.15, 0)
    group.add(light)
  }

  private buildTackleDummy(group: THREE.Group): void {
    // Heavy base
    const baseGeo = this.getGeo('dummyBase', () => new THREE.CylinderGeometry(0.9, 1.0, 0.3, 16))
    const baseMat = getMat('dummyBaseMat', () => new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.8, metalness: 0.3 }))
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.set(0, 0.15, 0)
    base.castShadow = true
    group.add(base)

    // Main body
    const bodyGeo = this.getGeo('dummyBody', () => new THREE.CapsuleGeometry(0.55, 2.2, 12, 24))
    const bodyMat = getMat('blue', () => new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.8 }))
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.set(0, 1.8, 0)
    body.castShadow = true
    group.add(body)

    // Head
    const headGeo = this.getGeo('dummyHead', () => new THREE.SphereGeometry(0.35, 16, 16))
    const headMat = getMat('dummyHeadMat', () => new THREE.MeshStandardMaterial({ color: '#f5f5f4', roughness: 0.6 }))
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.set(0, 3.2, 0)
    head.castShadow = true
    group.add(head)

    // Target zone
    const targetGeo = this.getGeo('dummyTarget', () => new THREE.CircleGeometry(0.25, 16))
    const targetMat = getMat('redGlow', () => new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.3 }))
    const target = new THREE.Mesh(targetGeo, targetMat)
    target.position.set(0, 1.5, 0.57)
    group.add(target)
  }

  private buildDoubleHurdle(group: THREE.Group): void {
    const postGeo = this.getGeo('hurdlePost', () => new THREE.CylinderGeometry(0.06, 0.08, 1.1, 8))
    const postMat = getMat('metalLight', () => new THREE.MeshStandardMaterial({ color: '#d4d4d8', metalness: 0.8, roughness: 0.2 }))
    const barGeo = this.getGeo('hurdleBar', () => new THREE.BoxGeometry(2.0, 0.12, 0.08))
    const barMat = getMat('red', () => new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2 }))

    // Bottom hurdle
    for (const x of [-0.9, 0.9]) {
      const post = new THREE.Mesh(postGeo, postMat)
      post.position.set(x, 0.55, 0)
      post.castShadow = true
      group.add(post)
    }
    const bottomBar = new THREE.Mesh(barGeo, barMat)
    bottomBar.position.set(0, 1.0, 0)
    bottomBar.castShadow = true
    group.add(bottomBar)

    // Top hurdle
    for (const x of [-0.9, 0.9]) {
      const post = new THREE.Mesh(postGeo, postMat)
      post.position.set(x, 1.65, 0)
      post.castShadow = true
      group.add(post)
    }
    const topBar = new THREE.Mesh(barGeo, barMat.clone())
    ;(topBar.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3
    topBar.position.set(0, 2.1, 0)
    topBar.castShadow = true
    group.add(topBar)
  }

  private buildRollingBarrel(group: THREE.Group): void {
    const barrelGeo = this.getGeo('barrel', () => new THREE.CylinderGeometry(0.6, 0.6, 1.4, 16))
    const barrelMat = getMat('barrel', () => new THREE.MeshStandardMaterial({ color: '#92400e', roughness: 0.7 }))
    const barrel = new THREE.Mesh(barrelGeo, barrelMat)
    barrel.position.set(0, 0.6, 0)
    barrel.rotation.z = Math.PI / 2
    barrel.castShadow = true
    group.add(barrel)

    // Rings
    const ringGeo = this.getGeo('barrelRing', () => new THREE.TorusGeometry(0.61, 0.04, 8, 16))
    const ringMat = getMat('barrelRing', () => new THREE.MeshStandardMaterial({ color: '#78350f', metalness: 0.5 }))
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.set(0, 0.6, 0)
      ring.rotation.z = Math.PI / 2
      group.add(ring)
    }

    // Danger indicator
    const dangerGeo = this.getGeo('dangerCircle', () => new THREE.CircleGeometry(0.8, 16))
    const dangerMat = getMat('dangerMat', () => new THREE.MeshBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.15 }))
    const danger = new THREE.Mesh(dangerGeo, dangerMat)
    danger.rotation.x = -Math.PI / 2
    danger.position.y = 0.02
    group.add(danger)
  }

  private buildTwoLaneWall(group: THREE.Group): void {
    const wallGeo = this.getGeo('wallBlock', () => new THREE.BoxGeometry(2.8, 3.0, 0.4))
    const wallMat = getMat('orange', () => new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.7 }))

    // Two walls side by side (blocking 2 of 3 lanes)
    for (const offset of [-LANE_WIDTH, 0]) {
      const wall = new THREE.Mesh(wallGeo, wallMat)
      wall.position.set(offset, 1.5, 0)
      wall.castShadow = true
      group.add(wall)
    }

    // Connecting bar
    const barGeo = this.getGeo('wallBar', () => new THREE.BoxGeometry(LANE_WIDTH + 2.8, 0.15, 0.4))
    const barMat = getMat('yellowGlow', () => new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.5 }))
    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(-LANE_WIDTH / 2, 2.95, 0)
    group.add(bar)
  }

  private buildSprintZone(group: THREE.Group): void {
    const wallGeo = this.getGeo('sprintWall', () => new THREE.BoxGeometry(0.4, 3.0, 6))
    const wallMat = getMat('greenGlow', () => new THREE.MeshStandardMaterial({ color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 0.3, roughness: 0.5 }))

    const left = new THREE.Mesh(wallGeo, wallMat)
    left.position.set(-1.2, 1.5, 0)
    left.castShadow = true
    group.add(left)

    const right = new THREE.Mesh(wallGeo, wallMat)
    right.position.set(1.2, 1.5, 0)
    right.castShadow = true
    group.add(right)

    // Golden glow floor
    const floorGeo = this.getGeo('sprintFloor', () => new THREE.PlaneGeometry(2.0, 6))
    const floorMat = getMat('sprintFloor', () => new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#fbbf24', emissiveIntensity: 0.8, transparent: true, opacity: 0.3 }))
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0.05
    group.add(floor)
  }

  private addLabelSprite(group: THREE.Group, text: string, color: string, y: number): void {
    // Simple sprite label using canvas texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, 512, 64)

    // Black outline
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 6
    ctx.strokeText(text, 256, 32)

    // Main text
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, 256, 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(3, 0.4, 1)
    sprite.position.set(0, y, 0)
    sprite.name = 'label'
    group.add(sprite)
  }

  private pickRandomLabel(type: ObstacleType): ObstacleLabel {
    const labels = EDUCATIONAL_LABELS[type]
    if (!labels || labels.length === 0) {
      return { label: type.toUpperCase(), definition: '', color: '#ffffff' }
    }
    return labels[Math.floor(Math.random() * labels.length)]
  }

  update(dt: number, speed: number, playerLane: Lane, playerY: number, isSliding: boolean, hasShield: boolean, hasSpeedBoost: boolean, isFever: boolean, isFirstRun: boolean, distance: number, difficulty: number): {
    hit: boolean
    dodged: number
    nearMissed: number
    deathCause: ObstacleType | null
    shieldBroken: boolean
    smashed: boolean
  } {
    const result = {
      hit: false,
      dodged: 0,
      nearMissed: 0,
      deathCause: null as ObstacleType | null,
      shieldBroken: false,
      smashed: false,
    }

    const playerX = playerLane * LANE_WIDTH

    // Move obstacles and check collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i]

      // Move toward player
      obs.z -= speed * dt
      obs.group.position.z = -obs.z

      // Rolling barrel lane sway
      if (obs.type === 'rollingbarrel') {
        obs.rollingOffset = (obs.rollingOffset || 0) + dt
        obs.group.position.x = obs.lane * LANE_WIDTH + Math.sin(obs.rollingOffset * 1.5) * LANE_WIDTH * 0.8
        // Spin barrel
        const barrel = obs.group.children[0]
        if (barrel) barrel.rotation.x += dt * 4
      }

      // Despawn
      if (obs.z < DESPAWN_DISTANCE) {
        this.scene.remove(obs.group)
        this.obstacles.splice(i, 1)
        this.processedIds.delete(obs.id)
        continue
      }

      // Skip if already processed
      if (obs.hit || this.processedIds.has(obs.id)) continue

      // Emit label event when obstacle enters view range
      if (obs.z < 60 && obs.z > 55 && obs.label && !obs.labelEmitted) {
        obs.labelEmitted = true
        this.events.emit('obstacleLabeled', {
          label: obs.label.label,
          definition: obs.label.definition,
          termId: (obs.label as { relatedTermId?: string }).relatedTermId,
        })
      }

      // Collision detection
      if (Math.abs(obs.z) < COLLISION_THRESHOLD_Z) {
        const hitbox = HITBOXES[obs.type]
        const obsX = obs.type === 'rollingbarrel'
          ? obs.group.position.x
          : obs.lane * LANE_WIDTH
        const xDistance = Math.abs(obsX - playerX)
        const inSameLane = xDistance < (hitbox.width / 2 + 1)

        if (inSameLane) {
          const jumpedOver = hitbox.jumpable && playerY > hitbox.height * 0.7
          const slidUnder = hitbox.slideable && isSliding

          if (!jumpedOver && !slidUnder) {
            this.processedIds.add(obs.id)
            obs.hit = true

            if (isFever || hasSpeedBoost) {
              result.smashed = true
            } else if (hasShield) {
              result.shieldBroken = true
            } else {
              result.hit = true
              result.deathCause = obs.type
              break
            }
          } else {
            // Successful dodge
            this.processedIds.add(obs.id)
            obs.hit = true
            result.dodged++
          }
        }
      }

      // Near-miss detection
      if (!this.processedIds.has(obs.id) && Math.abs(obs.z) < NEAR_MISS_THRESHOLD) {
        const hitbox = HITBOXES[obs.type]
        const obsX = obs.type === 'rollingbarrel'
          ? obs.group.position.x
          : obs.lane * LANE_WIDTH
        const xDistance = Math.abs(obsX - playerX)

        if (xDistance < LANE_WIDTH && xDistance > hitbox.width / 2) {
          this.processedIds.add(obs.id)
          obs.hit = true
          result.nearMissed++
        }
      }
    }

    // Spawning
    this.lastSpawnZ -= speed * dt
    const baseSpacing = isFirstRun ? FIRST_RUN_OBSTACLE_SPACING : getObstacleSpacing(distance, difficulty)

    if (this.lastSpawnZ <= 0) {
      const spawnProb = getSpawnProbability(distance, isFirstRun)
      const shouldSpawn = isFirstRun
        ? this.tutorialIndex < FIRST_RUN_PATTERN.length || Math.random() < 0.4
        : Math.random() < spawnProb

      if (shouldSpawn) {
        this.spawn(isFirstRun, distance)
      }
      this.lastSpawnZ = baseSpacing
    }

    return result
  }

  private spawn(isFirstRun: boolean, distance: number): void {
    let type: ObstacleType
    let lane: Lane

    if (isFirstRun && this.tutorialIndex < FIRST_RUN_PATTERN.length) {
      const pattern = FIRST_RUN_PATTERN[this.tutorialIndex]
      type = pattern.type
      lane = pattern.lane
      this.tutorialIndex++
    } else {
      // Weighted random selection based on distance
      const available = OBSTACLE_SPAWN_TABLE.filter(e => distance >= e.minDistance)
      const totalWeight = available.reduce((sum, e) => sum + e.weight, 0)
      let rand = Math.random() * totalWeight
      type = 'hurdle'
      for (const entry of available) {
        rand -= entry.weight
        if (rand <= 0) {
          type = entry.type
          break
        }
      }

      // Lane selection
      if (type === 'twolanewall' || type === 'sprintzone') {
        lane = 0 as Lane
      } else {
        const lanes: Lane[] = [-1, 0, 1]
        lane = lanes[Math.floor(Math.random() * lanes.length)]
      }
    }

    const group = this.buildObstacleMesh(type)
    group.position.set(lane * LANE_WIDTH, 0, -SPAWN_DISTANCE)

    // Add educational label
    const label = this.pickRandomLabel(type)
    const labelY = type === 'tackledummy' ? 4.2 : type === 'barrier' ? 4.0 : type === 'defender' ? 3.8 : 2.5
    this.addLabelSprite(group, label.label, label.color, labelY)

    this.scene.add(group)
    this.obstacles.push({
      id: this.nextId++,
      type,
      lane,
      z: SPAWN_DISTANCE,
      hit: false,
      group,
      label,
      rollingOffset: 0,
    })
  }

  reset(): void {
    for (const obs of this.obstacles) {
      this.scene.remove(obs.group)
    }
    this.obstacles.length = 0
    this.processedIds.clear()
    this.nextId = 0
    this.tutorialIndex = 0
    this.lastSpawnZ = MIN_OBSTACLE_SPACING
  }

  destroy(): void {
    this.reset()
    // Dispose cached geometries and materials
    this.geoCache.forEach(geo => geo.dispose())
    this.geoCache.clear()
    matCache.forEach(m => m.dispose())
    matCache.clear()
  }
}
