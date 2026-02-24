'use client'

import { useCallback, useRef } from 'react'

/**
 * Vibration patterns for different game events
 * Each pattern is an array of vibration/pause durations in milliseconds
 * Single number = simple vibration duration
 * Array = [vibrate, pause, vibrate, pause, ...]
 */
const HAPTIC_PATTERNS = {
  // Collectibles
  coinCollect: [10],                    // Light tap
  powerupGrab: [20, 50, 20],            // Double tap
  megaCoin: [30, 40, 30],               // Slightly stronger double tap

  // Near misses & obstacles
  nearMiss: [30],                       // Quick buzz
  obstacleHit: [100],                   // Strong thud
  shieldBreak: [80, 30, 80],            // Strong double

  // Power-up activations
  feverActivate: [50, 100, 50, 100, 50, 150], // Rumble crescendo
  shieldActivate: [40, 60, 40],         // Double pulse
  magnetActivate: [25, 50, 25, 50, 25], // Triple pulse
  speedBoost: [60, 40, 80],             // Accelerating buzz

  // Score & milestones
  newHighScore: [100, 50, 100, 50, 200], // Celebration pattern
  milestone: [50],                       // Medium buzz
  comboBreak: [60],                      // Medium thud

  // Game state
  gameOver: [150, 100, 150],            // Double strong thud
  gameStart: [40, 80, 40, 80, 60],      // Ready-set-go pattern
} as const

export type HapticEvent = keyof typeof HAPTIC_PATTERNS

interface HapticsState {
  enabled: boolean
  supported: boolean
  lastVibrationTime: number
}

// Minimum time between vibrations to prevent excessive calls (in ms)
const MIN_VIBRATION_INTERVAL = 50

/**
 * Singleton haptics manager for efficient vibration handling
 */
class HapticsManager {
  private state: HapticsState = {
    enabled: true,
    supported: false,
    lastVibrationTime: 0,
  }

  constructor() {
    // Check for vibration API support
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      this.state.supported = true
    }
  }

  /**
   * Trigger haptic feedback for a game event
   * @param event - The type of haptic event
   * @param force - Force vibration even if within throttle window
   */
  vibrate(event: HapticEvent, force = false): void {
    // Early returns for disabled/unsupported
    if (!this.state.enabled || !this.state.supported) return

    const now = performance.now()

    // Throttle vibrations to prevent performance issues
    if (!force && now - this.state.lastVibrationTime < MIN_VIBRATION_INTERVAL) {
      return
    }

    const pattern = HAPTIC_PATTERNS[event]

    try {
      navigator.vibrate(pattern)
      this.state.lastVibrationTime = now
    } catch (error) {
      // Silently fail - vibration is non-essential
      console.warn('Haptic feedback failed:', error)
    }
  }

  /**
   * Trigger a custom vibration pattern
   * @param pattern - Array of vibration/pause durations in ms
   */
  vibrateCustom(pattern: number[]): void {
    if (!this.state.enabled || !this.state.supported) return

    const now = performance.now()
    if (now - this.state.lastVibrationTime < MIN_VIBRATION_INTERVAL) {
      return
    }

    try {
      navigator.vibrate(pattern)
      this.state.lastVibrationTime = now
    } catch (error) {
      console.warn('Custom haptic feedback failed:', error)
    }
  }

  /**
   * Stop any ongoing vibration
   */
  stop(): void {
    if (!this.state.supported) return

    try {
      navigator.vibrate(0)
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Enable haptic feedback
   */
  enable(): void {
    this.state.enabled = true
  }

  /**
   * Disable haptic feedback
   */
  disable(): void {
    this.state.enabled = false
    this.stop()
  }

  /**
   * Toggle haptic feedback on/off
   * @returns New enabled state
   */
  toggle(): boolean {
    if (this.state.enabled) {
      this.disable()
    } else {
      this.enable()
    }
    return this.state.enabled
  }

  /**
   * Set enabled state directly
   */
  setEnabled(enabled: boolean): void {
    if (enabled) {
      this.enable()
    } else {
      this.disable()
    }
  }

  /**
   * Check if haptics are currently enabled
   */
  get isEnabled(): boolean {
    return this.state.enabled
  }

  /**
   * Check if device supports vibration API
   */
  get isSupported(): boolean {
    return this.state.supported
  }
}

// Singleton instance
const hapticsManager = new HapticsManager()
export { hapticsManager }

/**
 * React hook for haptic feedback in Blitz Rush 3D
 *
 * @example
 * ```tsx
 * const { vibrate, toggle, isEnabled, isSupported } = useHaptics()
 *
 * // Trigger haptic on coin collect
 * vibrate('coinCollect')
 *
 * // Toggle haptics
 * const newState = toggle()
 * ```
 */
export function useHaptics() {
  const managerRef = useRef(hapticsManager)

  const vibrate = useCallback((event: HapticEvent, force?: boolean) => {
    managerRef.current.vibrate(event, force)
  }, [])

  const vibrateCustom = useCallback((pattern: number[]) => {
    managerRef.current.vibrateCustom(pattern)
  }, [])

  const stop = useCallback(() => {
    managerRef.current.stop()
  }, [])

  const enable = useCallback(() => {
    managerRef.current.enable()
  }, [])

  const disable = useCallback(() => {
    managerRef.current.disable()
  }, [])

  const toggle = useCallback(() => {
    return managerRef.current.toggle()
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    managerRef.current.setEnabled(enabled)
  }, [])

  return {
    vibrate,
    vibrateCustom,
    stop,
    enable,
    disable,
    toggle,
    setEnabled,
    isEnabled: managerRef.current.isEnabled,
    isSupported: managerRef.current.isSupported,
  }
}

// Export the haptic event type for external use
export { HAPTIC_PATTERNS }
