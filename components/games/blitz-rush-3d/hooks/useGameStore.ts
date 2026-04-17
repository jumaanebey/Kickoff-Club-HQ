import { create } from 'zustand'

export type Lane = -1 | 0 | 1
export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover'
export type PowerupType = 'magnet' | 'shield' | 'speed' | 'multiplier'

interface PowerupState {
  type: PowerupType
  timeRemaining: number
  duration: number
}

interface GameState {
  // Game Phase
  phase: GamePhase

  // Player State
  lane: Lane
  targetLane: Lane
  isJumping: boolean
  isSliding: boolean
  isGrounded: boolean
  playerY: number
  playerVelocityY: number

  // Score & Progress
  score: number
  coins: number
  distance: number
  speed: number
  multiplier: number
  combo: number
  maxCombo: number

  // Powerups
  activePowerup: PowerupState | null
  hasShield: boolean
  hasSpeedBoost: boolean
  hasMagnet: boolean

  // Game Settings
  difficulty: number
  highScore: number

  // Camera
  cameraShake: number
  slowMotion: boolean

  // Session Stats (for missions)
  feverTimeMs: number
  powerupsCollected: number
  hitsTaken: number
  isFeverMode: boolean
  lastMilestone: number

  // Actions
  startGame: () => void
  endGame: () => void
  pauseGame: () => void
  resumeGame: () => void

  // Player Actions
  switchLane: (direction: 'left' | 'right') => void
  jump: () => void
  slide: () => void
  land: () => void

  // Scoring
  addScore: (amount: number) => void
  addCoins: (amount: number) => void
  addCombo: () => void
  resetCombo: () => void

  // Powerups
  activatePowerup: (type: PowerupType, duration: number) => void
  deactivatePowerup: () => void
  activateShield: () => void
  breakShield: () => void

  // Stats tracking
  recordHit: () => void
  checkMilestone: () => number | null

  // Game Loop
  tick: (delta: number) => void
  increaseSpeed: (amount: number) => void
  triggerCameraShake: (intensity: number) => void
  triggerSlowMotion: (duration: number) => void

  // Reset
  reset: () => void
}

// Physics constants
const GRAVITY = 45
const JUMP_FORCE = 18
const BASE_SPEED = 20
const MAX_SPEED = 50
const SPEED_INCREMENT = 0.5

// Milestone thresholds for celebration
const MILESTONES = [100, 250, 500, 1000, 1500, 2000, 3000, 5000]

const initialState = {
  phase: 'menu' as GamePhase,
  lane: 0 as Lane,
  targetLane: 0 as Lane,
  isJumping: false,
  isSliding: false,
  isGrounded: true,
  playerY: 0,
  playerVelocityY: 0,
  score: 0,
  coins: 0,
  distance: 0,
  speed: BASE_SPEED,
  multiplier: 1,
  combo: 0,
  maxCombo: 0,
  activePowerup: null,
  hasShield: false,
  hasSpeedBoost: false,
  hasMagnet: false,
  difficulty: 1,
  highScore: 0,
  cameraShake: 0,
  slowMotion: false,
  feverTimeMs: 0,
  powerupsCollected: 0,
  hitsTaken: 0,
  isFeverMode: false,
  lastMilestone: 0,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  // Game Phase Actions
  startGame: () => set({
    ...initialState,
    phase: 'playing',
    highScore: get().highScore,
  }),

  endGame: () => {
    const { score, highScore } = get()
    set({
      phase: 'gameover',
      highScore: Math.max(score, highScore),
    })
  },

  pauseGame: () => set({ phase: 'paused' }),

  resumeGame: () => set({ phase: 'playing' }),

  // Player Movement
  switchLane: (direction) => {
    const { lane, phase } = get()
    if (phase !== 'playing') return

    const newLane = direction === 'left'
      ? Math.max(-1, lane - 1) as Lane
      : Math.min(1, lane + 1) as Lane

    set({ targetLane: newLane, lane: newLane })
  },

  jump: () => {
    const { isGrounded, isSliding, phase } = get()
    if (phase !== 'playing' || !isGrounded || isSliding) return

    set({
      isJumping: true,
      isGrounded: false,
      playerVelocityY: JUMP_FORCE,
    })
  },

  slide: () => {
    const { isGrounded, isJumping, phase } = get()
    if (phase !== 'playing') return

    // Can slide while in air (fast fall) or on ground
    if (isJumping) {
      // Fast fall
      set({ playerVelocityY: -JUMP_FORCE * 1.5 })
    } else if (isGrounded) {
      set({ isSliding: true })
      // Auto-stop slide after duration
      setTimeout(() => {
        set({ isSliding: false })
      }, 800)
    }
  },

  land: () => {
    set({
      isJumping: false,
      isGrounded: true,
      playerY: 0,
      playerVelocityY: 0,
    })
    // Add juice to landing
    get().triggerCameraShake(5)
  },

  // Scoring
  addScore: (amount) => {
    const { multiplier, activePowerup } = get()
    const finalMultiplier = activePowerup?.type === 'multiplier'
      ? multiplier * 2
      : multiplier
    set(state => ({ score: state.score + Math.floor(amount * finalMultiplier) }))
  },

  addCoins: (amount) => set(state => ({ coins: state.coins + amount })),

  addCombo: () => {
    const { combo, maxCombo } = get()
    const newCombo = combo + 1
    const newMultiplier = newCombo >= 10 ? 3 : newCombo >= 5 ? 2 : 1
    const isFever = newCombo >= 10
    set({
      combo: newCombo,
      multiplier: newMultiplier,
      maxCombo: Math.max(maxCombo, newCombo),
      isFeverMode: isFever,
    })
  },

  resetCombo: () => set({ combo: 0, multiplier: 1, isFeverMode: false }),

  // Powerups
  activatePowerup: (type, duration) => set(state => ({
    activePowerup: { type, duration, timeRemaining: duration },
    hasShield: type === 'shield',
    hasSpeedBoost: type === 'speed',
    hasMagnet: type === 'magnet',
    powerupsCollected: state.powerupsCollected + 1,
  })),

  deactivatePowerup: () => set({
    activePowerup: null,
    hasSpeedBoost: false,
    hasMagnet: false,
    // Note: shield stays active until broken
  }),

  activateShield: () => set({ hasShield: true }),

  breakShield: () => {
    set({ hasShield: false })
    get().triggerCameraShake(15)
  },

  // Stats tracking
  recordHit: () => set(state => ({ hitsTaken: state.hitsTaken + 1 })),

  checkMilestone: () => {
    const { distance, lastMilestone } = get()
    const currentDistance = Math.floor(distance)

    for (const milestone of MILESTONES) {
      if (currentDistance >= milestone && lastMilestone < milestone) {
        set({ lastMilestone: milestone })
        return milestone
      }
    }
    return null
  },

  // Game Loop
  tick: (delta) => {
    const state = get()
    if (state.phase !== 'playing') return

    const timeScale = state.slowMotion ? 0.3 : 1
    const adjustedDelta = delta * timeScale

    // Update physics
    let newY = state.playerY
    let newVelY = state.playerVelocityY

    if (!state.isGrounded) {
      newVelY -= GRAVITY * adjustedDelta
      newY += newVelY * adjustedDelta

      if (newY <= 0) {
        newY = 0
        newVelY = 0
        get().land()
      }
    }

    // Update distance and score
    const distanceIncrement = state.speed * adjustedDelta
    const scoreIncrement = Math.floor(state.speed / 10)

    // Update powerup timer
    let activePowerup = state.activePowerup
    let powerupExpired = false
    if (activePowerup) {
      activePowerup = {
        ...activePowerup,
        timeRemaining: activePowerup.timeRemaining - delta * 1000,
      }
      if (activePowerup.timeRemaining <= 0) {
        powerupExpired = true
        activePowerup = null
      }
    }

    // Track fever time (when combo >= 10)
    const feverTimeIncrement = state.isFeverMode ? delta * 1000 : 0

    // Decay camera shake
    const newShake = Math.max(0, state.cameraShake - delta * 30)

    // Increase difficulty over time
    const newDifficulty = 1 + Math.floor(state.distance / 500) * 0.2

    set({
      playerY: newY,
      playerVelocityY: newVelY,
      distance: state.distance + distanceIncrement,
      score: state.score + scoreIncrement,
      activePowerup,
      cameraShake: newShake,
      difficulty: newDifficulty,
      feverTimeMs: state.feverTimeMs + feverTimeIncrement,
      // Clear powerup flags when expired
      ...(powerupExpired ? {
        hasSpeedBoost: false,
        hasMagnet: false,
        hasShield: state.activePowerup?.type === 'shield' ? false : state.hasShield,
      } : {}),
    })
  },

  increaseSpeed: (amount) => set(state => ({
    speed: Math.min(MAX_SPEED, state.speed + amount),
  })),

  triggerCameraShake: (intensity) => set({ cameraShake: intensity }),

  triggerSlowMotion: (duration) => {
    set({ slowMotion: true })
    setTimeout(() => set({ slowMotion: false }), duration)
  },

  reset: () => set({
    ...initialState,
    highScore: get().highScore,
  }),
}))
