// Touch swipe + keyboard + input buffering
// ZERO React imports

export type InputAction = 'left' | 'right' | 'jump' | 'slide' | 'pause' | 'start'

export type InputCallback = (action: InputAction) => void

const SWIPE_THRESHOLD = 50 // Minimum pixels for swipe
const SWIPE_TIME_MAX = 300 // Max time in ms for swipe gesture
const TAP_THRESHOLD = 10 // Max movement for tap
const INPUT_BUFFER_WINDOW = 150 // ms to buffer next action during animations

interface TouchPoint {
  x: number
  y: number
  time: number
}

export class InputManager {
  private callback: InputCallback | null = null
  private touchStart: TouchPoint | null = null
  private inputBuffer: InputAction | null = null
  private bufferTimer: ReturnType<typeof setTimeout> | null = null
  private enabled = false

  // Bound handlers for cleanup
  private boundKeyDown: (e: KeyboardEvent) => void
  private boundTouchStart: (e: TouchEvent) => void
  private boundTouchEnd: (e: TouchEvent) => void
  private boundTouchMove: (e: TouchEvent) => void

  constructor() {
    this.boundKeyDown = this.handleKeyDown.bind(this)
    this.boundTouchStart = this.handleTouchStart.bind(this)
    this.boundTouchEnd = this.handleTouchEnd.bind(this)
    this.boundTouchMove = this.handleTouchMove.bind(this)
  }

  setCallback(callback: InputCallback): void {
    this.callback = callback
  }

  enable(): void {
    if (this.enabled) return
    this.enabled = true
    window.addEventListener('keydown', this.boundKeyDown)
    window.addEventListener('touchstart', this.boundTouchStart, { passive: false })
    window.addEventListener('touchend', this.boundTouchEnd, { passive: true })
    window.addEventListener('touchmove', this.boundTouchMove, { passive: false })
  }

  disable(): void {
    if (!this.enabled) return
    this.enabled = false
    window.removeEventListener('keydown', this.boundKeyDown)
    window.removeEventListener('touchstart', this.boundTouchStart)
    window.removeEventListener('touchend', this.boundTouchEnd)
    window.removeEventListener('touchmove', this.boundTouchMove)
  }

  destroy(): void {
    this.disable()
    this.callback = null
    this.clearBuffer()
  }

  // Buffer an action to execute on next available frame
  bufferAction(action: InputAction): void {
    this.inputBuffer = action
    if (this.bufferTimer) clearTimeout(this.bufferTimer)
    this.bufferTimer = setTimeout(() => {
      this.inputBuffer = null
      this.bufferTimer = null
    }, INPUT_BUFFER_WINDOW)
  }

  // Consume buffered action if available
  consumeBuffer(): InputAction | null {
    const action = this.inputBuffer
    this.inputBuffer = null
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer)
      this.bufferTimer = null
    }
    return action
  }

  private clearBuffer(): void {
    this.inputBuffer = null
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer)
      this.bufferTimer = null
    }
  }

  private emit(action: InputAction): void {
    this.callback?.(action)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Prevent default for game keys to avoid page scroll
    const gameKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space',
    ]
    if (gameKeys.includes(e.code)) {
      e.preventDefault()
    }

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.emit('left')
        break
      case 'ArrowRight':
      case 'KeyD':
        this.emit('right')
        break
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        this.emit('jump')
        break
      case 'ArrowDown':
      case 'KeyS':
        this.emit('slide')
        break
      case 'Escape':
      case 'KeyP':
        this.emit('pause')
        break
      case 'Enter':
        this.emit('start')
        break
    }
  }

  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return

    // Prevent zoom/scroll during gameplay
    e.preventDefault()

    const touch = e.touches[0]
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    // Prevent scroll during gameplay
    if (this.enabled) {
      e.preventDefault()
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (!this.touchStart) return

    const touch = e.changedTouches[0]
    const start = this.touchStart
    this.touchStart = null

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const deltaTime = Date.now() - start.time

    if (deltaTime > SWIPE_TIME_MAX) return

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Determine swipe direction
    if (absX > absY && absX > SWIPE_THRESHOLD) {
      this.emit(deltaX > 0 ? 'right' : 'left')
    } else if (absY > absX && absY > SWIPE_THRESHOLD) {
      this.emit(deltaY < 0 ? 'jump' : 'slide')
    } else if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
      // Tap — default to jump during gameplay, start otherwise
      this.emit('jump')
    }
  }
}
