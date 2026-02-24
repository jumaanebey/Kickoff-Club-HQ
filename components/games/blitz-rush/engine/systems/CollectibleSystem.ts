import * as THREE from 'three'
import { EventBus } from '../core/EventBus'
import type { PowerupType, Lane } from '../config/constants'
import {
  LANE_WIDTH, SPAWN_DISTANCE, DESPAWN_DISTANCE,
  MAGNET_RADIUS, MAGNET_PULL_SPEED,
  COIN_SPAWN_CHANCE, POWERUP_SPAWN_CHANCE,
  COIN_LINE_LENGTH, COIN_ARC_COUNT, POWERUP_DURATIONS,
} from '../config/constants'

interface ActiveCollectible {
  id: number
  type: 'coin' | 'megaCoin' | PowerupType
  lane: Lane
  z: number
  baseY: number
  group: THREE.Group
  collected: boolean
}

const POWERUP_COLORS: Record<PowerupType, string> = {
  magnet: '#3b82f6',
  shield: '#06b6d4',
  speed: '#eab308',
  multiplier: '#a855f7',
}

export class CollectibleSystem {
  private scene: THREE.Scene
  private events: EventBus
  private collectibles: ActiveCollectible[] = []
  private nextId = 0
  private spawnTimer = 0
  private spawnInterval = 8 // distance between spawn attempts

  // Shared geometries
  private coinGeo: THREE.CylinderGeometry
  private megaCoinGeo: THREE.CylinderGeometry
  private powerupGeo: THREE.SphereGeometry
  private coinMat: THREE.MeshStandardMaterial
  private megaCoinMat: THREE.MeshStandardMaterial

  constructor(scene: THREE.Scene, events: EventBus) {
    this.scene = scene
    this.events = events

    this.coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16)
    this.megaCoinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16)
    this.powerupGeo = new THREE.SphereGeometry(0.5, 16, 16)
    this.coinMat = new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      emissive: '#fbbf24',
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    })
    this.megaCoinMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#f59e0b',
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    })
  }

  private createCoinMesh(): THREE.Group {
    const group = new THREE.Group()
    const coin = new THREE.Mesh(this.coinGeo, this.coinMat)
    coin.rotation.x = Math.PI / 2
    coin.castShadow = true
    group.add(coin)

    // Dollar sign using a small box cross
    const signGeo = new THREE.BoxGeometry(0.15, 0.02, 0.02)
    const signMat = new THREE.MeshStandardMaterial({ color: '#92400e' })
    const sign = new THREE.Mesh(signGeo, signMat)
    sign.position.set(0, 0, 0.05)
    group.add(sign)

    return group
  }

  private createMegaCoinMesh(): THREE.Group {
    const group = new THREE.Group()
    const coin = new THREE.Mesh(this.megaCoinGeo, this.megaCoinMat)
    coin.rotation.x = Math.PI / 2
    coin.castShadow = true
    group.add(coin)

    // Glow
    const glowGeo = new THREE.SphereGeometry(0.7, 16, 16)
    const glowMat = new THREE.MeshBasicMaterial({
      color: '#fbbf24',
      transparent: true,
      opacity: 0.15,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    group.add(glow)

    return group
  }

  private createPowerupMesh(type: PowerupType): THREE.Group {
    const group = new THREE.Group()
    const color = POWERUP_COLORS[type]

    const sphere = new THREE.Mesh(
      this.powerupGeo,
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      })
    )
    sphere.castShadow = true
    group.add(sphere)

    // Outer glow ring
    const ringGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 32)
    const ringMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.6,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    group.add(ring)

    // Icon indicator label
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ffffff'
    const icons: Record<PowerupType, string> = { magnet: 'M', shield: 'S', speed: 'Z', multiplier: '2x' }
    ctx.fillText(icons[type], 64, 64)
    const texture = new THREE.CanvasTexture(canvas)
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(0.6, 0.6, 1)
    sprite.position.y = 0
    group.add(sprite)

    return group
  }

  private spawnCoinLine(lane: Lane, z: number): void {
    for (let i = 0; i < COIN_LINE_LENGTH; i++) {
      this.spawnSingle('coin', lane, z + i * 2.5, 1)
    }
  }

  private spawnCoinArc(lane: Lane, z: number): void {
    for (let i = 0; i < COIN_ARC_COUNT; i++) {
      const t = i / (COIN_ARC_COUNT - 1) // 0 to 1
      const arcY = 1 + Math.sin(t * Math.PI) * 3 // Parabolic arc
      this.spawnSingle('coin', lane, z + i * 2, arcY)
    }
  }

  private spawnSingle(type: 'coin' | 'megaCoin' | PowerupType, lane: Lane, z: number, y: number): void {
    let group: THREE.Group
    if (type === 'coin') {
      group = this.createCoinMesh()
    } else if (type === 'megaCoin') {
      group = this.createMegaCoinMesh()
    } else {
      group = this.createPowerupMesh(type)
    }

    group.position.set(lane * LANE_WIDTH, y, -z)
    this.scene.add(group)

    this.collectibles.push({
      id: this.nextId++,
      type,
      lane,
      z,
      baseY: y,
      group,
      collected: false,
    })
  }

  update(
    dt: number,
    speed: number,
    playerLane: Lane,
    playerY: number,
    hasMagnet: boolean,
    distance: number,
  ): { coinsCollected: number; megaCoinsCollected: number; powerup: PowerupType | null } {
    const result = { coinsCollected: 0, megaCoinsCollected: 0, powerup: null as PowerupType | null }
    const playerX = playerLane * LANE_WIDTH
    const time = Date.now() * 0.003

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i]

      // Move toward player
      c.z -= speed * dt
      c.group.position.z = -c.z

      // Animate
      c.group.position.y = c.baseY + Math.sin(time + c.id) * 0.2
      c.group.rotation.y += dt * 2

      // Despawn
      if (c.z < DESPAWN_DISTANCE) {
        this.scene.remove(c.group)
        this.collectibles.splice(i, 1)
        continue
      }

      if (c.collected) continue

      // Magnet pull (coins only)
      if (hasMagnet && (c.type === 'coin' || c.type === 'megaCoin')) {
        const dx = playerX - c.group.position.x
        const dy = (playerY + 1) - c.group.position.y
        const dz = 0 - c.group.position.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < MAGNET_RADIUS) {
          const pullStr = MAGNET_PULL_SPEED * dt
          c.group.position.x += (dx / dist) * pullStr
          c.group.position.y += (dy / dist) * pullStr
          c.group.position.z += (dz / dist) * pullStr
          // Update lane-relative position
          c.lane = Math.round(c.group.position.x / LANE_WIDTH) as Lane
        }
      }

      // Collection detection
      const cx = c.group.position.x
      const cy = c.group.position.y
      const cz = c.group.position.z
      const collectDist = Math.sqrt(
        (playerX - cx) ** 2 + (playerY + 1 - cy) ** 2 + cz ** 2
      )

      if (collectDist < 1.5) {
        c.collected = true
        this.scene.remove(c.group)
        this.collectibles.splice(i, 1)

        if (c.type === 'coin') {
          result.coinsCollected++
          this.events.emit('playSound', { name: 'coin' })
        } else if (c.type === 'megaCoin') {
          result.megaCoinsCollected++
          this.events.emit('playSound', { name: 'megaCoin' })
        } else {
          // Powerup
          result.powerup = c.type as PowerupType
          this.events.emit('playSound', { name: 'powerup' })
          this.events.emit('powerupCollected', c.type as PowerupType)
        }
      }
    }

    // Spawning
    this.spawnTimer -= speed * dt

    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.spawnInterval

      const lanes: Lane[] = [-1, 0, 1]
      const lane = lanes[Math.floor(Math.random() * lanes.length)]

      if (Math.random() < POWERUP_SPAWN_CHANCE) {
        // Spawn a powerup
        const types: PowerupType[] = ['magnet', 'shield', 'speed', 'multiplier']
        const type = types[Math.floor(Math.random() * types.length)]
        this.spawnSingle(type, lane, SPAWN_DISTANCE, 1.5)
      } else if (Math.random() < 0.05) {
        // Mega coin (rare)
        this.spawnSingle('megaCoin', lane, SPAWN_DISTANCE, 1.5)
      } else if (Math.random() < COIN_SPAWN_CHANCE) {
        // Coin pattern
        if (Math.random() < 0.3) {
          this.spawnCoinArc(lane, SPAWN_DISTANCE)
        } else {
          this.spawnCoinLine(lane, SPAWN_DISTANCE)
        }
      }
    }

    return result
  }

  reset(): void {
    for (const c of this.collectibles) {
      this.scene.remove(c.group)
    }
    this.collectibles.length = 0
    this.nextId = 0
    this.spawnTimer = 8
  }

  destroy(): void {
    this.reset()
    this.coinGeo.dispose()
    this.megaCoinGeo.dispose()
    this.powerupGeo.dispose()
    this.coinMat.dispose()
    this.megaCoinMat.dispose()
  }
}
