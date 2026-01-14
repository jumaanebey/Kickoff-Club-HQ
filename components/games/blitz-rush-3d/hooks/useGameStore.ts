import { create } from 'zustand'

export type Lane = -1 | 0 | 1
export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover'
export type PowerupType = 'magnet' | 'shield' | 'speed' | 'multiplier'

interface PowerupState {
  type: PowerupType
  timeRemaining: number
  duration: number
}

export type DeathCause = 'hurdle' | 'defender' | 'barrier' | 'tackledummy' | null

interface GameState {
  // Game Phase
  phase: GamePhase

  // Tutorial Mode
  isFirstRunMode: boolean // Slower speed, predictable obstacles for learning

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

  // Powerups (stackable - multiple can be active)
  activePowerups: PowerupState[]
  activePowerup: PowerupState | null // For backwards compatibility (first powerup or null)
  hasShield: boolean
  hasSpeedBoost: boolean
  hasMagnet: boolean
  hasMultiplier: boolean

  // Game Settings
  difficulty: number
  highScore: number
  previousHighScore: number // Track the high score from before this game session

  // Death tracking
  deathCause: DeathCause

  // Camera
  cameraShake: number
  slowMotion: boolean
  isFever: boolean
  feverMeter: number
  popups: { id: number; text: string; type: 'score' | 'coin' | 'juke' | 'powerup' }[]
  skin: 'mascot' | 'classic'

  // Actions
  startGame: (firstRunMode?: boolean) => void
  endGame: (deathCause?: DeathCause) => void
  pauseGame: () => void
  resumeGame: () => void

  // Player Actions
  switchLane: (direction: 'left' | 'right') => void
  jump: () => void
  slide: () => void
  land: () => void
  addPopup: (text: string, type: 'score' | 'coin' | 'juke' | 'powerup') => void
  removePopup: (id: number) => void

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

  // Game Loop
  tick: (delta: number) => void
  increaseSpeed: (amount: number) => void
  triggerCameraShake: (intensity: number) => void
  triggerSlowMotion: (duration: number) => void
  setSkin: (skin: 'mascot' | 'classic') => void

  // Reset
  reset: () => void
}

// Physics constants
const GRAVITY = 45
const JUMP_FORCE = 18
const BASE_SPEED = 20
const FIRST_RUN_SPEED = 14 // Slower speed for tutorial mode
const MAX_SPEED = 50
const SPEED_INCREMENT = 0.5

// Timer refs for cancellable timeouts
let slideTimerId: NodeJS.Timeout | null = null
let slowMotionTimerId: NodeJS.Timeout | null = null
let popupTimers: Map<number, NodeJS.Timeout> = new Map()

// Clear all active timers
function clearAllTimers() {
  if (slideTimerId) {
    clearTimeout(slideTimerId)
    slideTimerId = null
  }
  if (slowMotionTimerId) {
    clearTimeout(slowMotionTimerId)
    slowMotionTimerId = null
  }
  popupTimers.forEach(timer => clearTimeout(timer))
  popupTimers.clear()
}

const initialState = {
  phase: 'menu' as GamePhase,
  isFirstRunMode: false,
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
  activePowerups: [] as PowerupState[],
  activePowerup: null as PowerupState | null,
  hasShield: false,
  hasSpeedBoost: false,
  hasMagnet: false,
  hasMultiplier: false,
  difficulty: 1,
  highScore: 0,
  previousHighScore: 0,
  deathCause: null as DeathCause,
  cameraShake: 0,
  slowMotion: false,
  isFever: false,
  feverMeter: 0,
  popups: [],
  skin: 'mascot' as const,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  // Game Phase Actions
  startGame: (firstRunMode = false) => {
    // Clear all active timers from previous game
    clearAllTimers()
    const currentHighScore = get().highScore
    set({
      ...initialState,
      phase: 'playing',
      isFirstRunMode: firstRunMode,
      speed: firstRunMode ? FIRST_RUN_SPEED : BASE_SPEED,
      highScore: currentHighScore,
      previousHighScore: currentHighScore, // Store the high score before this game
    })
  },

  endGame: (deathCause?: DeathCause) => {
    // Clear slide timer to prevent animation continuing after game over
    if (slideTimerId) {
      clearTimeout(slideTimerId)
      slideTimerId = null
    }
    const { score, highScore, previousHighScore } = get()
    set({
      phase: 'gameover',
      highScore: Math.max(score, highScore),
      previousHighScore: previousHighScore, // Keep the previous high score for comparison
      deathCause: deathCause || null,
      isSliding: false, // Ensure sliding stops
    })
  },

  pauseGame: () => set({ phase: 'paused' }),

  resumeGame: () => set({ phase: 'playing' }),

  setSkin: (skin) => set({ skin }),

  addPopup: (text: string, type: 'score' | 'coin' | 'juke' | 'powerup') => {
    const id = Date.now()
    set(state => ({
      popups: [...state.popups, { id, text, type }]
    }))
    // Auto-remove after 1.5s (cancellable)
    const timerId = setTimeout(() => {
      get().removePopup(id)
      popupTimers.delete(id)
    }, 1500)
    popupTimers.set(id, timerId)
  },

  removePopup: (id: number) => set(state => ({
    popups: state.popups.filter(p => p.id !== id)
  })),

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
      // Clear any existing slide timer
      if (slideTimerId) {
        clearTimeout(slideTimerId)
      }
      set({ isSliding: true })
      // Auto-stop slide after duration (cancellable)
      slideTimerId = setTimeout(() => {
        // Only stop sliding if game is still playing
        if (get().phase === 'playing') {
          set({ isSliding: false })
        }
        slideTimerId = null
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
    const { combo, isFever } = get()
    const newCombo = combo + 1
    const newMultiplier = newCombo >= 20 ? 4 : newCombo >= 10 ? 3 : newCombo >= 5 ? 2 : 1

    let isNowFever = isFever
    let newMeter = get().feverMeter + 5

    if (newMeter >= 100 && !isFever) {
      isNowFever = true
      newMeter = 100
      get().triggerCameraShake(15)
    }

    set({
      combo: newCombo,
      multiplier: newMultiplier,
      isFever: isNowFever,
      feverMeter: Math.min(100, newMeter)
    })
  },

  resetCombo: () => set({ combo: 0, multiplier: 1, isFever: false, feverMeter: 0 }),

  // Powerups (stackable - can have multiple active at once)
  activatePowerup: (type, duration) => {
    const { activePowerups, hasShield } = get()
    const newPowerup = { type, duration, timeRemaining: duration }

    // Remove existing powerup of same type (refresh duration instead of stacking same type)
    const filteredPowerups = activePowerups.filter(p => p.type !== type)
    const updatedPowerups = [...filteredPowerups, newPowerup]

    set({
      activePowerups: updatedPowerups,
      activePowerup: updatedPowerups[0] || null, // For backwards compatibility
      // Update individual flags based on what's now active
      hasShield: type === 'shield' ? true : hasShield,
      hasSpeedBoost: type === 'speed' ? true : updatedPowerups.some(p => p.type === 'speed'),
      hasMagnet: type === 'magnet' ? true : updatedPowerups.some(p => p.type === 'magnet'),
      hasMultiplier: type === 'multiplier' ? true : updatedPowerups.some(p => p.type === 'multiplier'),
    })
  },

  deactivatePowerup: () => set({
    activePowerups: [],
    activePowerup: null,
    hasSpeedBoost: false,
    hasMagnet: false,
    hasMultiplier: false,
    // Note: shield stays active until broken - don't clear it here
  }),

  activateShield: () => set({ hasShield: true }),

  breakShield: () => {
    set({ hasShield: false })
    get().triggerCameraShake(15)
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

    // Fever decay
    let newFeverMeter = state.feverMeter
    let isNowFever = state.isFever
    if (state.isFever) {
      newFeverMeter -= delta * 12 // ~8 seconds of fever
      if (newFeverMeter <= 0) {
        newFeverMeter = 0
        isNowFever = false
      }
    }

    // Update distance and score
    const currentMultiplier = isNowFever ? 5 : (state.hasMultiplier ? state.multiplier * 2 : state.multiplier)
    const distanceIncrement = state.speed * adjustedDelta
    const scoreIncrement = Math.floor((state.speed / 10) * currentMultiplier)

    // Update ALL powerup timers (stacking support)
    const updatedPowerups = state.activePowerups
      .map(p => ({
        ...p,
        timeRemaining: p.timeRemaining - adjustedDelta * 1000,
      }))
      .filter(p => p.timeRemaining > 0) // Remove expired powerups

    // Check which powerups expired
    const expiredTypes = state.activePowerups
      .filter(p => p.timeRemaining - adjustedDelta * 1000 <= 0)
      .map(p => p.type)

    // Recalculate flags based on remaining active powerups
    const hasSpeed = updatedPowerups.some(p => p.type === 'speed')
    const hasMagnetActive = updatedPowerups.some(p => p.type === 'magnet')
    const hasMultiplierActive = updatedPowerups.some(p => p.type === 'multiplier')
    const shieldExpired = expiredTypes.includes('shield')

    // Decay camera shake
    const newShake = Math.max(0, state.cameraShake - delta * 30)

    // Increase difficulty over time
    const newDifficulty = 1 + Math.floor(state.distance / 500) * 0.2

    set({
      playerY: newY,
      playerVelocityY: newVelY,
      distance: state.distance + distanceIncrement,
      score: state.score + scoreIncrement,
      activePowerups: updatedPowerups,
      activePowerup: updatedPowerups[0] || null, // For backwards compatibility
      cameraShake: newShake,
      difficulty: newDifficulty,
      feverMeter: newFeverMeter,
      isFever: isNowFever,
      // Update powerup flags based on what's still active
      hasSpeedBoost: hasSpeed,
      hasMagnet: hasMagnetActive,
      hasMultiplier: hasMultiplierActive,
      // Shield only clears if shield powerup specifically expired
      ...(shieldExpired ? { hasShield: false } : {}),
    })
  },

  increaseSpeed: (amount) => set(state => ({
    speed: Math.min(MAX_SPEED, state.speed + amount),
  })),

  triggerCameraShake: (intensity) => set({ cameraShake: intensity }),

  triggerSlowMotion: (duration) => {
    // Clear any existing slow motion timer
    if (slowMotionTimerId) {
      clearTimeout(slowMotionTimerId)
    }
    set({ slowMotion: true })
    slowMotionTimerId = setTimeout(() => {
      set({ slowMotion: false })
      slowMotionTimerId = null
    }, duration)
  },

  reset: () => {
    // Clear all active timers
    clearAllTimers()
    const currentHighScore = get().highScore
    set({
      ...initialState,
      highScore: currentHighScore,
      previousHighScore: currentHighScore,
    })
  },
}))
