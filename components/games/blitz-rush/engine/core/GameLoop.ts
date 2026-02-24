// Fixed 60Hz physics timestep + interpolated rendering
// Delta-capped at 100ms to prevent spiral of death

export type TickCallback = (dt: number, timeScale: number) => void
export type RenderCallback = (alpha: number) => void

const FIXED_DT = 1 / 60 // 60Hz physics
const MAX_DELTA = 0.1 // Cap at 100ms to prevent spiral of death

export class GameLoop {
  private running = false
  private paused = false
  private rafId: number | null = null
  private lastTime = 0
  private accumulator = 0
  private timeScale = 1

  private tickCallbacks: TickCallback[] = []
  private renderCallbacks: RenderCallback[] = []

  // Performance monitoring
  private frameCount = 0
  private fpsAccumulator = 0
  private currentFps = 60

  get fps(): number {
    return this.currentFps
  }

  get isRunning(): boolean {
    return this.running
  }

  get isPaused(): boolean {
    return this.paused
  }

  onTick(callback: TickCallback): () => void {
    this.tickCallbacks.push(callback)
    return () => {
      const idx = this.tickCallbacks.indexOf(callback)
      if (idx !== -1) this.tickCallbacks.splice(idx, 1)
    }
  }

  onRender(callback: RenderCallback): () => void {
    this.renderCallbacks.push(callback)
    return () => {
      const idx = this.renderCallbacks.indexOf(callback)
      if (idx !== -1) this.renderCallbacks.splice(idx, 1)
    }
  }

  setTimeScale(scale: number): void {
    this.timeScale = scale
  }

  getTimeScale(): number {
    return this.timeScale
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.paused = false
    this.lastTime = performance.now()
    this.accumulator = 0
    this.frameCount = 0
    this.fpsAccumulator = 0
    this.loop(this.lastTime)
  }

  pause(): void {
    this.paused = true
  }

  resume(): void {
    if (!this.running) return
    this.paused = false
    this.lastTime = performance.now()
    this.accumulator = 0
  }

  stop(): void {
    this.running = false
    this.paused = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  destroy(): void {
    this.stop()
    this.tickCallbacks.length = 0
    this.renderCallbacks.length = 0
  }

  private loop = (now: number): void => {
    if (!this.running) return

    this.rafId = requestAnimationFrame(this.loop)

    if (this.paused) {
      this.lastTime = now
      return
    }

    let rawDelta = (now - this.lastTime) / 1000
    this.lastTime = now

    // Cap delta to prevent spiral of death
    if (rawDelta > MAX_DELTA) rawDelta = MAX_DELTA

    // FPS tracking
    this.frameCount++
    this.fpsAccumulator += rawDelta
    if (this.fpsAccumulator >= 1) {
      this.currentFps = Math.round(this.frameCount / this.fpsAccumulator)
      this.frameCount = 0
      this.fpsAccumulator = 0
    }

    const scaledDelta = rawDelta * this.timeScale
    this.accumulator += scaledDelta

    // Fixed timestep physics updates
    while (this.accumulator >= FIXED_DT) {
      for (const cb of this.tickCallbacks) {
        cb(FIXED_DT, this.timeScale)
      }
      this.accumulator -= FIXED_DT
    }

    // Interpolated render
    const alpha = this.accumulator / FIXED_DT
    for (const cb of this.renderCallbacks) {
      cb(alpha)
    }
  }
}
