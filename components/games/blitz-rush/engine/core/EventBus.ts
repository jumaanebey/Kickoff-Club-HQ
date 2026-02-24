// Typed event emitter for engine → React communication
// ZERO React imports — pure TypeScript

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover'
export type PowerupType = 'magnet' | 'shield' | 'speed' | 'multiplier'
export type DeathCause =
  | 'hurdle'
  | 'defender'
  | 'barrier'
  | 'tackledummy'
  | 'doublehurdle'
  | 'rollingbarrel'
  | 'twolanewall'
  | 'sprintzone'
  | null

export interface PopupData {
  id: number
  text: string
  type: 'score' | 'coin' | 'juke' | 'powerup'
}

export interface GameSnapshot {
  score: number
  coins: number
  distance: number
  speed: number
  combo: number
  multiplier: number
  feverMeter: number
  isFever: boolean
  nearMissChain: number
  nearMissChainBest: number
  nearMissChainTimer: number
  nearMissMultiplier: number
  hasShield: boolean
  hasSpeedBoost: boolean
  hasMagnet: boolean
  hasMultiplier: boolean
  activePowerupType: PowerupType | null
  activePowerupProgress: number
  deathCause: DeathCause
  highScore: number
  previousHighScore: number
  isFirstRunMode: boolean
  footballIQGained: number
  feverActivations: number
}

export interface EventMap {
  // State changes
  stateChange: GamePhase
  score: number
  coins: number
  distance: number

  // Gameplay events
  gameOver: GameSnapshot
  powerupCollected: PowerupType
  powerupExpired: PowerupType
  nearMiss: { chain: number; multiplier: number; label: string }
  feverActivated: void
  feverEnded: void
  obstacleLabeled: { label: string; definition: string; termId?: string }
  comboPulse: { combo: number; multiplier: number }
  comboMilestone: { combo: number }
  shieldBroken: void

  // UI events
  popup: PopupData
  quizTrigger: GameSnapshot
  tick: GameSnapshot

  // Camera
  cameraShake: number
  slowMotion: number

  // Audio cues
  playSound: { name: string; options?: { volume?: number; rate?: number } }
  playMusic: { name: string; fadeIn?: number }
  stopMusic: { fadeOut?: number }
}

type EventHandler<T> = T extends void ? () => void : (data: T) => void

export class EventBus {
  private listeners = new Map<string, Set<Function>>()

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler)
    }
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.listeners.get(event)?.delete(handler)
  }

  emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K] extends void ? [] : [EventMap[K]]
  ): void {
    const handlers = this.listeners.get(event)
    if (!handlers) return
    handlers.forEach(handler => {
      handler(...args)
    })
  }

  removeAllListeners(): void {
    this.listeners.clear()
  }
}
