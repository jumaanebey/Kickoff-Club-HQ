// Game engine utilities for Blitz Rush 3D
// Implements object pooling, fixed timestep, and game feel helpers

// ============================================
// OBJECT POOL - Reuse objects to avoid GC
// ============================================

export class ObjectPool<T> {
  private pool: T[] = []
  private active: Set<T> = new Set()
  private factory: () => T
  private reset: (obj: T) => void

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number = 20
  ) {
    this.factory = factory
    this.reset = reset

    // Pre-allocate
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory())
    }
  }

  acquire(): T {
    let obj = this.pool.pop()
    if (!obj) {
      obj = this.factory()
    }
    this.active.add(obj)
    return obj
  }

  release(obj: T): void {
    if (this.active.has(obj)) {
      this.active.delete(obj)
      this.reset(obj)
      this.pool.push(obj)
    }
  }

  releaseAll(): void {
    this.active.forEach(obj => {
      this.reset(obj)
      this.pool.push(obj)
    })
    this.active.clear()
  }

  getActive(): T[] {
    return Array.from(this.active)
  }

  getActiveCount(): number {
    return this.active.size
  }
}

// ============================================
// FIXED TIMESTEP - Consistent physics
// ============================================

export class FixedTimestep {
  private accumulator: number = 0
  private readonly fixedDelta: number
  private readonly maxDelta: number

  constructor(fps: number = 60, maxFrameSkip: number = 5) {
    this.fixedDelta = 1 / fps
    this.maxDelta = this.fixedDelta * maxFrameSkip
  }

  update(delta: number, physicsUpdate: (dt: number) => void): void {
    // Clamp max delta to prevent spiral of death
    this.accumulator += Math.min(delta, this.maxDelta)

    // Run fixed timestep updates
    while (this.accumulator >= this.fixedDelta) {
      physicsUpdate(this.fixedDelta)
      this.accumulator -= this.fixedDelta
    }
  }

  getAlpha(): number {
    // For interpolation between physics states
    return this.accumulator / this.fixedDelta
  }

  reset(): void {
    this.accumulator = 0
  }
}

// ============================================
// GAME FEEL UTILITIES
// ============================================

// Hit-stop: Brief freeze on impact for weight
export class HitStop {
  private freezeUntil: number = 0
  private callback: (() => void) | null = null

  freeze(durationMs: number, onComplete?: () => void): void {
    this.freezeUntil = performance.now() + durationMs
    this.callback = onComplete || null
  }

  isFrozen(): boolean {
    const now = performance.now()
    if (now < this.freezeUntil) {
      return true
    }
    if (this.callback) {
      this.callback()
      this.callback = null
    }
    return false
  }

  getTimeScale(): number {
    return this.isFrozen() ? 0 : 1
  }
}

// Screen effects manager
export interface ScreenEffect {
  type: 'flash' | 'vignette' | 'shake'
  intensity: number
  duration: number
  startTime: number
  color?: string
}

export class ScreenEffects {
  private effects: ScreenEffect[] = []

  flash(color: string = '#ffffff', intensity: number = 0.8, durationMs: number = 100): void {
    this.effects.push({
      type: 'flash',
      intensity,
      duration: durationMs,
      startTime: performance.now(),
      color,
    })
  }

  vignette(color: string = '#ff0000', intensity: number = 0.5, durationMs: number = 300): void {
    this.effects.push({
      type: 'vignette',
      intensity,
      duration: durationMs,
      startTime: performance.now(),
      color,
    })
  }

  getActiveEffects(): ScreenEffect[] {
    const now = performance.now()
    this.effects = this.effects.filter(e => now - e.startTime < e.duration)
    return this.effects.map(e => ({
      ...e,
      intensity: e.intensity * (1 - (now - e.startTime) / e.duration),
    }))
  }

  clear(): void {
    this.effects = []
  }
}

// Easing functions for animations
export const easing = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  bounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  },
  elastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

// Number formatting with animation support
export function formatScore(score: number): string {
  return Math.floor(score).toLocaleString()
}

// Lerp with delta time
export function lerp(from: number, to: number, alpha: number): number {
  return from + (to - from) * alpha
}

// Smooth damp (like Unity's SmoothDamp)
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number
): number {
  smoothTime = Math.max(0.0001, smoothTime)
  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  let change = current - target
  const originalTo = target

  const maxChange = maxSpeed * smoothTime
  change = Math.max(-maxChange, Math.min(maxChange, change))
  const tempTarget = current - change

  const temp = (velocity.value + omega * change) * deltaTime
  velocity.value = (velocity.value - omega * temp) * exp
  let output = tempTarget + (change + temp) * exp

  if ((originalTo - current > 0) === (output > originalTo)) {
    output = originalTo
    velocity.value = (output - originalTo) / deltaTime
  }

  return output
}

// Random utilities
export const random = {
  range: (min: number, max: number) => min + Math.random() * (max - min),
  int: (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1)),
  choice: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
  chance: (probability: number) => Math.random() < probability,
  gaussian: () => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  },
}

// Singleton instances for global access
export const hitStop = new HitStop()
export const screenEffects = new ScreenEffects()
