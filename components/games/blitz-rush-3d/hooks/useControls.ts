'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useGameStore } from './useGameStore'

const SWIPE_THRESHOLD = 40 // Reduced for better mobile sensitivity
const SWIPE_TIME_MAX = 400 // Increased for slower swipes
const TAP_THRESHOLD = 15 // Increased tap tolerance

interface TouchPoint {
  x: number
  y: number
  time: number
}

// Haptic feedback utility
function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined' || !('navigator' in window)) return

  // Vibration API
  if ('vibrate' in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 10,
      medium: 25,
      heavy: [15, 30, 15],
    }
    navigator.vibrate(patterns[type])
  }
}

export function useControls() {
  const {
    phase,
    switchLane,
    jump,
    slide,
    startGame,
    pauseGame,
    resumeGame,
  } = useGameStore()

  const touchStartRef = useRef<TouchPoint | null>(null)

  // Keyboard Controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Menu state
    if (phase === 'menu') {
      if (e.code === 'Space' || e.code === 'Enter') {
        startGame()
      }
      return
    }

    // Paused state
    if (phase === 'paused') {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        resumeGame()
      }
      return
    }

    // Game over state
    if (phase === 'gameover') {
      if (e.code === 'Space' || e.code === 'Enter') {
        startGame()
      }
      return
    }

    // Playing state
    if (phase !== 'playing') return

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        switchLane('left')
        break
      case 'ArrowRight':
      case 'KeyD':
        switchLane('right')
        break
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        jump()
        break
      case 'ArrowDown':
      case 'KeyS':
        slide()
        break
      case 'Escape':
      case 'KeyP':
        pauseGame()
        break
    }
  }, [phase, switchLane, jump, slide, startGame, pauseGame, resumeGame])

  // Touch Controls
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const startPoint = touchStartRef.current

    const deltaX = touch.clientX - startPoint.x
    const deltaY = touch.clientY - startPoint.y
    const deltaTime = Date.now() - startPoint.time

    touchStartRef.current = null

    // Check if it's a valid swipe (within time threshold)
    if (deltaTime > SWIPE_TIME_MAX) return

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Menu/Game Over - tap to start
    if (phase === 'menu' || phase === 'gameover') {
      if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
        triggerHaptic('medium')
        startGame()
      }
      return
    }

    // Paused - tap to resume
    if (phase === 'paused') {
      if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
        triggerHaptic('light')
        resumeGame()
      }
      return
    }

    // Playing state - handle swipes
    if (phase !== 'playing') return

    // Determine swipe direction
    if (absX > absY && absX > SWIPE_THRESHOLD) {
      // Horizontal swipe
      triggerHaptic('light')
      if (deltaX > 0) {
        switchLane('right')
      } else {
        switchLane('left')
      }
    } else if (absY > absX && absY > SWIPE_THRESHOLD) {
      // Vertical swipe
      triggerHaptic('light')
      if (deltaY < 0) {
        jump()
      } else {
        slide()
      }
    } else if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
      // Tap - default to jump
      triggerHaptic('light')
      jump()
    }
  }, [phase, switchLane, jump, slide, startGame, resumeGame])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleKeyDown, handleTouchStart, handleTouchEnd])
}

// Mobile detection utility
export function useIsMobile() {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// Export haptic for use in other components (collisions, powerups, etc.)
export { triggerHaptic }
