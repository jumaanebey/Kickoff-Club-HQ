import * as THREE from 'three'
import { EventBus, type GamePhase, type GameSnapshot, type PopupData } from './core/EventBus'
import { GameLoop } from './core/GameLoop'
import { InputManager, type InputAction } from './core/InputManager'
import { PlayerSystem } from './systems/PlayerSystem'
import { ObstacleSystem } from './systems/ObstacleSystem'
import { CollectibleSystem } from './systems/CollectibleSystem'
import { TrackSystem } from './systems/TrackSystem'
import { CameraSystem } from './systems/CameraSystem'
import { ParticleSystem } from './systems/ParticleSystem'
import { AudioSystem } from './systems/AudioSystem'
import { JuiceSystem } from './systems/JuiceSystem'
import {
  BASE_SPEED, FIRST_RUN_SPEED, MAX_SPEED,
  FEVER_FILL_PER_DODGE, FEVER_DECAY_RATE, FEVER_SPEED_BOOST,
  FEVER_MULTIPLIER, NEAR_MISS_CHAIN_WINDOW, NEAR_MISS_BASE_SCORE,
  DODGE_BASE_SCORE, SMASH_SCORE_FEVER, SMASH_SCORE_SPEED,
  SHIELD_BREAK_SCORE, COIN_SCORE, MEGA_COIN_SCORE,
  POWERUP_DURATIONS, MAX_DPR, FOG_NEAR, FOG_FAR, BG_COLOR,
  getNearMissTier, getComboMultiplier, COMBO_MILESTONES,
  type PowerupType, type Lane, type ObstacleType, type DeathCause,
} from './config/constants'
import { getTargetSpeed, getDifficultyLevel } from './config/difficulty'

interface PowerupState {
  type: PowerupType
  timeRemaining: number
  duration: number
}

export interface EngineConfig {
  antialias?: boolean
}

export class BlitzRushEngine {
  // Three.js core
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private canvas: HTMLCanvasElement

  // Engine infrastructure
  readonly events: EventBus
  private loop: GameLoop
  private input: InputManager

  // Systems
  private player: PlayerSystem
  private obstacles: ObstacleSystem
  private collectibles: CollectibleSystem
  private track: TrackSystem
  private cameraSystem: CameraSystem
  private particles: ParticleSystem
  private audio: AudioSystem
  private juice: JuiceSystem

  // Game state
  private phase: GamePhase = 'menu'
  private score = 0
  private coins = 0
  private distance = 0
  private speed = BASE_SPEED
  private combo = 0
  private multiplier = 1
  private feverMeter = 0
  private isFever = false
  private isFirstRunMode = false
  private highScore = 0
  private previousHighScore = 0
  private deathCause: DeathCause | null = null
  private feverActivations = 0

  // Near-miss chain
  private nearMissChain = 0
  private nearMissChainBest = 0
  private nearMissChainTimer = 0
  private nearMissMultiplier = 1

  // Powerups
  private activePowerups: PowerupState[] = []
  private hasShield = false
  private hasSpeedBoost = false
  private hasMagnet = false
  private hasMultiplier = false

  // Difficulty
  private difficulty = 1

  // Football IQ tracking
  private footballIQGained = 0
  private labelsViewed = new Set<string>()

  // FPS monitoring for auto-quality
  private lowFpsFrames = 0
  private qualityLevel: 'high' | 'medium' | 'low' = 'high'

  constructor(canvas: HTMLCanvasElement, config: EngineConfig = {}) {
    this.canvas = canvas
    this.events = new EventBus()
    this.loop = new GameLoop()
    this.input = new InputManager()

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: config.antialias !== false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(BG_COLOR)
    this.scene.fog = new THREE.Fog(BG_COLOR, FOG_NEAR, FOG_FAR)

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200)

    // Lighting
    this.setupLighting()

    // Systems
    this.player = new PlayerSystem(this.scene, this.events)
    this.obstacles = new ObstacleSystem(this.scene, this.events)
    this.collectibles = new CollectibleSystem(this.scene, this.events)
    this.track = new TrackSystem(this.scene)
    this.cameraSystem = new CameraSystem(this.camera)
    this.particles = new ParticleSystem(this.scene)
    this.audio = new AudioSystem(this.events)
    this.juice = new JuiceSystem(this.scene, this.events, this.loop, this.particles, this.cameraSystem)

    // Input
    this.input.setCallback(this.handleInput.bind(this))
    this.input.enable()

    // Game loop callbacks
    this.loop.onTick(this.tick.bind(this))
    this.loop.onRender(this.render.bind(this))

    // Preload audio
    this.audio.preload()

    // Load saved high score
    this.loadHighScore()

    // Start loop (renders menu scene)
    this.loop.start()

    // Window resize handler (also fires on orientation change)
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)

    // Visibility change — pause when tab hidden
    this.handleVisibility = this.handleVisibility.bind(this)
    document.addEventListener('visibilitychange', this.handleVisibility)

    // Orientation change — trigger resize after layout settles
    this.handleOrientation = this.handleOrientation.bind(this)
    window.addEventListener('orientationchange', this.handleOrientation)

    // WebGL context loss recovery
    this.handleContextLost = this.handleContextLost.bind(this)
    this.handleContextRestored = this.handleContextRestored.bind(this)
    canvas.addEventListener('webglcontextlost', this.handleContextLost)
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored)

    // Track labels for education
    this.events.on('obstacleLabeled', ({ label, definition }) => {
      if (!this.labelsViewed.has(label)) {
        this.labelsViewed.add(label)
        this.footballIQGained += 2
      }
    })
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight('#ffffff', 0.6)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight('#ffffff', 1.2)
    sun.position.set(5, 15, 10)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 50
    sun.shadow.camera.left = -15
    sun.shadow.camera.right = 15
    sun.shadow.camera.top = 15
    sun.shadow.camera.bottom = -15
    this.scene.add(sun)

    const fill = new THREE.DirectionalLight('#6366f1', 0.3)
    fill.position.set(-5, 5, -5)
    this.scene.add(fill)
  }

  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('football_game_progress')
      if (saved) {
        const data = JSON.parse(saved)
        this.highScore = data['blitz-rush-3d']?.highScore || data['blitz-rush']?.highScore || 0
      }
    } catch {
      this.highScore = 0
    }
  }

  // ── Public API ─────────────────────────────────────────
  start(firstRunMode = false): void {
    this.resetState()
    this.isFirstRunMode = firstRunMode
    this.speed = firstRunMode ? FIRST_RUN_SPEED : BASE_SPEED
    this.previousHighScore = this.highScore
    this.phase = 'playing'
    this.loop.resume()

    this.events.emit('stateChange', 'playing')
    this.events.emit('playSound', { name: 'gameStart' })
    this.events.emit('playMusic', { name: 'gameplay' })
    this.audio.startCrowdAmbience()
  }

  pause(): void {
    if (this.phase !== 'playing') return
    this.phase = 'paused'
    this.loop.pause()
    this.events.emit('stateChange', 'paused')
  }

  resume(): void {
    if (this.phase !== 'paused') return
    this.phase = 'playing'
    this.loop.resume()
    this.events.emit('stateChange', 'playing')
  }

  destroy(): void {
    this.loop.destroy()
    this.input.destroy()
    this.player.destroy()
    this.obstacles.destroy()
    this.collectibles.destroy()
    this.track.destroy()
    this.particles.destroy()
    this.audio.destroy()
    this.juice.destroy()

    // Dispose any remaining scene children as safety net
    this.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.geometry?.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose())
        } else if (mesh.material) {
          mesh.material.dispose()
        }
      }
    })

    this.renderer.dispose()
    this.events.removeAllListeners()

    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibility)
    window.removeEventListener('orientationchange', this.handleOrientation)
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored)
  }

  on<K extends keyof import('./core/EventBus').EventMap>(
    event: K,
    handler: (data: import('./core/EventBus').EventMap[K]) => void,
  ): () => void {
    return this.events.on(event, handler as any)
  }

  getState(): GameSnapshot {
    return {
      score: this.score,
      coins: this.coins,
      distance: this.distance,
      speed: this.speed,
      combo: this.combo,
      multiplier: this.multiplier,
      feverMeter: this.feverMeter,
      isFever: this.isFever,
      nearMissChain: this.nearMissChain,
      nearMissChainBest: this.nearMissChainBest,
      nearMissChainTimer: this.nearMissChainTimer,
      nearMissMultiplier: this.nearMissMultiplier,
      hasShield: this.hasShield,
      hasSpeedBoost: this.hasSpeedBoost,
      hasMagnet: this.hasMagnet,
      hasMultiplier: this.hasMultiplier,
      activePowerupType: this.activePowerups.length > 0 ? this.activePowerups[0].type : null,
      activePowerupProgress: this.activePowerups.length > 0
        ? this.activePowerups[0].timeRemaining / this.activePowerups[0].duration
        : 0,
      deathCause: this.deathCause,
      highScore: this.highScore,
      previousHighScore: this.previousHighScore,
      isFirstRunMode: this.isFirstRunMode,
      footballIQGained: this.footballIQGained,
      feverActivations: this.feverActivations,
    }
  }

  getPhase(): GamePhase {
    return this.phase
  }

  getFps(): number {
    return this.loop.fps
  }

  setSkin(id: string): void {
    // Map skin IDs to jersey colors
    const skinColors: Record<string, string> = {
      rookie: '#f97316',
      'blue-thunder': '#3b82f6',
      'green-machine': '#22c55e',
      'purple-reign': '#a855f7',
      'gold-standard': '#eab308',
      midnight: '#1e293b',
    }
    const color = skinColors[id] || '#f97316'
    this.player.setJerseyColor(color)
  }

  getAudio(): AudioSystem {
    return this.audio
  }

  // ── Input Handling ─────────────────────────────────────
  private handleInput(action: InputAction): void {
    switch (this.phase) {
      case 'menu':
        if (action === 'start' || action === 'jump') {
          // Menu handled by React — emit event
          this.events.emit('stateChange', 'menu')
        }
        break

      case 'playing':
        switch (action) {
          case 'left':
            this.player.switchLane('left')
            break
          case 'right':
            this.player.switchLane('right')
            break
          case 'jump':
            this.player.jump()
            break
          case 'slide':
            this.player.slide()
            break
          case 'pause':
            this.pause()
            break
        }
        break

      case 'paused':
        if (action === 'pause') {
          this.resume()
        }
        break

      case 'gameover':
        // Game over handled by React overlay
        break
    }
  }

  // ── Game Loop ──────────────────────────────────────────
  private tick(dt: number, timeScale: number): void {
    if (this.phase !== 'playing') return

    // Player physics
    this.player.update(dt, timeScale)

    // Speed ramp
    const targetSpeed = getTargetSpeed(this.distance, this.isFirstRunMode)
    this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed, dt * 0.5)

    // Fever decay
    if (this.isFever) {
      this.feverMeter -= dt * FEVER_DECAY_RATE
      if (this.feverMeter <= 0) {
        this.feverMeter = 0
        this.isFever = false
        this.events.emit('feverEnded')
      }
    }

    // Effective speed
    const feverBoost = this.isFever ? FEVER_SPEED_BOOST : 0
    const effectiveSpeed = this.speed + feverBoost + (this.hasSpeedBoost ? 10 : 0)

    // Distance & passive score
    const distInc = effectiveSpeed * dt
    this.distance += distInc
    const scoreMultiplier = this.isFever
      ? FEVER_MULTIPLIER
      : this.hasMultiplier ? this.multiplier * 2 : this.multiplier
    this.score += Math.floor((effectiveSpeed / 10) * scoreMultiplier * this.nearMissMultiplier)

    // Difficulty
    this.difficulty = getDifficultyLevel(this.distance)

    // Obstacles
    const obsResult = this.obstacles.update(
      dt, effectiveSpeed,
      this.player.lane, this.player.playerY, this.player.isSliding,
      this.hasShield, this.hasSpeedBoost, this.isFever,
      this.isFirstRunMode, this.distance, this.difficulty,
    )

    if (obsResult.hit) {
      this.endGame(obsResult.deathCause)
      return
    }

    if (obsResult.shieldBroken) {
      this.hasShield = false
      this.activePowerups = this.activePowerups.filter(p => p.type !== 'shield')
      this.score += SHIELD_BREAK_SCORE
      this.events.emit('shieldBroken')
      this.events.emit('cameraShake', 15)
      this.events.emit('playSound', { name: 'shieldBreak' })
      this.player.setShieldVisible(false)
    }

    if (obsResult.smashed) {
      const smashScore = this.isFever ? SMASH_SCORE_FEVER : SMASH_SCORE_SPEED
      this.score += smashScore
      this.events.emit('popup', { id: Date.now(), text: 'SMASH!', type: 'juke' })
      this.events.emit('cameraShake', 12)
      this.events.emit('playSound', { name: 'nearMiss' })
    }

    // Process dodges
    for (let i = 0; i < obsResult.dodged; i++) {
      this.addCombo()
      this.score += DODGE_BASE_SCORE
      this.events.emit('popup', { id: Date.now() + i, text: 'DODGE!', type: 'juke' })
      this.events.emit('playSound', { name: 'nearMiss' })
    }

    // Process near-misses
    for (let i = 0; i < obsResult.nearMissed; i++) {
      this.addNearMiss()
    }

    // Collectibles
    const collectResult = this.collectibles.update(
      dt, effectiveSpeed,
      this.player.lane, this.player.playerY,
      this.hasMagnet || this.isFever,
      this.distance,
    )

    if (collectResult.coinsCollected > 0) {
      this.coins += collectResult.coinsCollected
      this.score += collectResult.coinsCollected * COIN_SCORE
      const pos = this.player.getWorldPosition()
      this.particles.emitCoinBurst(pos.x, pos.y + 1, pos.z)
    }

    if (collectResult.megaCoinsCollected > 0) {
      this.coins += collectResult.megaCoinsCollected * 10
      this.score += collectResult.megaCoinsCollected * MEGA_COIN_SCORE
    }

    if (collectResult.powerup) {
      this.activatePowerup(collectResult.powerup)
    }

    // Update powerup timers
    this.updatePowerups(dt)

    // Near-miss chain timer
    if (this.nearMissChainTimer > 0 && !this.isFever) {
      this.nearMissChainTimer -= dt
      if (this.nearMissChainTimer <= 0) {
        this.nearMissChain = 0
        this.nearMissChainTimer = 0
        this.nearMissMultiplier = 1
      }
    }

    // Track scrolling
    this.track.update(dt, effectiveSpeed)

    // Particles
    this.particles.update(dt)
    // Dust trail
    if (this.player.isGrounded && !this.player.isSliding) {
      this.particles.emitDustTrail(
        this.player.getWorldPosition().x,
        0,
        this.player.getWorldPosition().z,
      )
    }
    // Speed lines during fever
    if (this.isFever || this.hasSpeedBoost) {
      this.particles.emitSpeedLines(
        this.player.getWorldPosition().x,
        this.player.getWorldPosition().y + 1,
        this.player.getWorldPosition().z,
      )
    }

    // Juice
    this.juice.update(dt)

    // Camera shake decay
    this.cameraSystem.update(
      dt,
      this.player.lane,
      this.player.playerY,
      effectiveSpeed,
      this.isFever,
      this.loop.getTimeScale() < 1,
    )

    // Emit tick for React HUD
    this.events.emit('tick', this.getState())

    // FPS monitoring for auto-quality (step down through tiers)
    if (this.loop.fps > 0 && this.loop.fps < 30 && this.qualityLevel !== 'low') {
      this.lowFpsFrames++
      if (this.lowFpsFrames > 90) { // ~1.5 seconds of low FPS
        this.reduceQuality()
        this.lowFpsFrames = 0
      }
    } else {
      this.lowFpsFrames = 0
    }
  }

  private render(_alpha: number): void {
    this.renderer.render(this.scene, this.camera)
  }

  // ── Combo & Fever ──────────────────────────────────────
  private addCombo(): void {
    this.combo++
    this.multiplier = getComboMultiplier(this.combo)

    let feverFill = FEVER_FILL_PER_DODGE
    if (!this.isFever) {
      this.feverMeter = Math.min(100, this.feverMeter + feverFill)
      if (this.feverMeter >= 100) {
        this.isFever = true
        this.feverActivations++
        this.events.emit('feverActivated')
        this.events.emit('cameraShake', 15)
        this.events.emit('playSound', { name: 'combo', options: { rate: 1.5 } })
        const pos = this.player.getWorldPosition()
        this.particles.emitFeverBurst(pos.x, pos.y, pos.z)
      }
    }

    this.events.emit('comboPulse', { combo: this.combo, multiplier: this.multiplier })

    // Check milestones
    if (COMBO_MILESTONES.includes(this.combo as any)) {
      this.events.emit('comboMilestone', { combo: this.combo })
      this.events.emit('cameraShake', this.combo >= 20 ? 10 : 6)
      this.events.emit('playSound', { name: 'combo' })

      if (this.combo >= 10) {
        const pos = this.player.getWorldPosition()
        this.particles.emitConfetti(pos.x, pos.y, pos.z, this.combo >= 20 ? 60 : 30)
      }
    }
  }

  // ── Near-Miss Chain ────────────────────────────────────
  private addNearMiss(): void {
    this.nearMissChain++
    const tier = getNearMissTier(this.nearMissChain)
    this.nearMissMultiplier = tier.multiplier
    this.nearMissChainBest = Math.max(this.nearMissChainBest, this.nearMissChain)
    this.nearMissChainTimer = NEAR_MISS_CHAIN_WINDOW

    const nearMissScore = (NEAR_MISS_BASE_SCORE + this.nearMissChain * 25) * this.multiplier * tier.multiplier
    this.score += Math.floor(nearMissScore)

    const feverFill = this.isFever ? 0 : (5 + this.nearMissChain * 2)
    this.feverMeter = Math.min(100, this.feverMeter + feverFill)

    this.events.emit('popup', { id: Date.now(), text: tier.label, type: 'juke' })
    this.events.emit('nearMiss', {
      chain: this.nearMissChain,
      multiplier: tier.multiplier,
      label: tier.label,
    })
    this.events.emit('cameraShake', 3 + Math.min(this.nearMissChain, 8))
    this.events.emit('playSound', { name: 'nearMiss', options: { rate: tier.audioRate } })

    // Sparks
    const pos = this.player.getWorldPosition()
    const dir = Math.random() > 0.5 ? 1 : -1
    this.particles.emitNearMissSparks(pos.x, pos.y + 1, pos.z, dir)
    if (this.nearMissChain >= 5) {
      this.particles.emitNearMissSparks(pos.x, pos.y + 1, pos.z, -dir)
    }
  }

  // ── Powerups ───────────────────────────────────────────
  private activatePowerup(type: PowerupType): void {
    const duration = POWERUP_DURATIONS[type as keyof typeof POWERUP_DURATIONS]

    // Remove existing of same type (refresh)
    this.activePowerups = this.activePowerups.filter(p => p.type !== type)
    this.activePowerups.push({ type, timeRemaining: duration, duration })

    switch (type) {
      case 'shield':
        this.hasShield = true
        this.player.setShieldVisible(true)
        this.events.emit('playSound', { name: 'shieldActivate' })
        break
      case 'speed':
        this.hasSpeedBoost = true
        this.events.emit('playSound', { name: 'speedBoost' })
        break
      case 'magnet':
        this.hasMagnet = true
        this.events.emit('playSound', { name: 'magnetActivate' })
        break
      case 'multiplier':
        this.hasMultiplier = true
        break
    }

    this.events.emit('popup', {
      id: Date.now(),
      text: type.toUpperCase() + '!',
      type: 'powerup',
    })
    this.events.emit('cameraShake', 5)
  }

  private updatePowerups(dt: number): void {
    const expired: PowerupType[] = []

    this.activePowerups = this.activePowerups.filter(p => {
      p.timeRemaining -= dt * 1000
      if (p.timeRemaining <= 0) {
        expired.push(p.type)
        return false
      }
      return true
    })

    for (const type of expired) {
      this.events.emit('powerupExpired', type)
      switch (type) {
        case 'shield':
          this.hasShield = false
          this.player.setShieldVisible(false)
          break
        case 'speed':
          this.hasSpeedBoost = false
          break
        case 'magnet':
          this.hasMagnet = false
          break
        case 'multiplier':
          this.hasMultiplier = false
          break
      }
    }
  }

  // ── Game Over ──────────────────────────────────────────
  private endGame(cause: DeathCause | null): void {
    this.deathCause = cause
    this.phase = 'gameover'
    this.highScore = Math.max(this.highScore, this.score)

    this.juice.triggerHitStop()
    this.juice.triggerSlowMotion(0.5)
    this.events.emit('cameraShake', 25)

    const pos = this.player.getWorldPosition()
    this.particles.emitCollisionImpact(pos.x, pos.y + 1, pos.z)

    this.events.emit('playSound', { name: 'collision' })
    this.events.emit('stopMusic', { fadeOut: 1000 })
    this.audio.stopCrowdAmbience(1000)

    // Slight delay then emit game over (after hit-stop resolves)
    setTimeout(() => {
      this.loop.pause()
      this.events.emit('playSound', { name: 'gameOver' })
      this.events.emit('gameOver', this.getState())
      this.events.emit('quizTrigger', this.getState())
      this.events.emit('stateChange', 'gameover')
    }, 600)
  }

  // ── State Reset ────────────────────────────────────────
  private resetState(): void {
    this.score = 0
    this.coins = 0
    this.distance = 0
    this.speed = BASE_SPEED
    this.combo = 0
    this.multiplier = 1
    this.feverMeter = 0
    this.isFever = false
    this.isFirstRunMode = false
    this.deathCause = null
    this.feverActivations = 0
    this.nearMissChain = 0
    this.nearMissChainBest = 0
    this.nearMissChainTimer = 0
    this.nearMissMultiplier = 1
    this.activePowerups = []
    this.hasShield = false
    this.hasSpeedBoost = false
    this.hasMagnet = false
    this.hasMultiplier = false
    this.difficulty = 1
    this.footballIQGained = 0
    this.labelsViewed.clear()

    this.player.reset()
    this.obstacles.reset()
    this.collectibles.reset()
    this.track.reset()
    this.cameraSystem.reset()
    this.particles.reset()
    this.juice.reset()
  }

  // ── Quality Management ─────────────────────────────────
  private reduceQuality(): void {
    if (this.qualityLevel === 'high') {
      // High → Medium: reduce DPR, keep shadows
      this.qualityLevel = 'medium'
      this.renderer.setPixelRatio(1)
      this.renderer.shadowMap.type = THREE.BasicShadowMap
      this.particles.qualityScale = 0.6
    } else if (this.qualityLevel === 'medium') {
      // Medium → Low: disable shadows, minimal particles
      this.qualityLevel = 'low'
      this.renderer.shadowMap.enabled = false
      this.particles.qualityScale = 0.3
      this.scene.fog = null
    }
  }

  // ── Event Handlers ─────────────────────────────────────
  private handleResize(): void {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  private handleVisibility(): void {
    if (document.hidden && this.phase === 'playing') {
      this.pause()
    }
  }

  private handleOrientation(): void {
    // Delay resize until layout settles after orientation change
    setTimeout(() => this.handleResize(), 100)
  }

  private handleContextLost(e: Event): void {
    e.preventDefault()
    this.loop.pause()
  }

  private handleContextRestored(): void {
    // Re-apply renderer settings after context recovery
    this.renderer.setPixelRatio(
      this.qualityLevel === 'high' ? Math.min(window.devicePixelRatio, MAX_DPR) : 1,
    )
    this.handleResize()
    if (this.phase === 'playing') {
      this.loop.resume()
    }
  }
}
