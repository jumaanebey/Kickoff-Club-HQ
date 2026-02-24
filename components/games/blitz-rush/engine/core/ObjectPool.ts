// Generic object pool with acquire/release
// Prevents per-frame allocations for obstacles, coins, particles

export class ObjectPool<T> {
  private pool: T[] = []
  private active: Set<T> = new Set()
  private factory: () => T
  private reset: (obj: T) => void
  private maxSize: number

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number,
    maxSize: number
  ) {
    this.factory = factory
    this.reset = reset
    this.maxSize = maxSize

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory())
    }
  }

  acquire(): T | null {
    let obj: T

    if (this.pool.length > 0) {
      obj = this.pool.pop()!
    } else if (this.active.size < this.maxSize) {
      obj = this.factory()
    } else {
      return null // Pool exhausted
    }

    this.reset(obj)
    this.active.add(obj)
    return obj
  }

  release(obj: T): void {
    if (!this.active.has(obj)) return
    this.active.delete(obj)
    this.pool.push(obj)
  }

  releaseAll(): void {
    this.active.forEach(obj => {
      this.pool.push(obj)
    })
    this.active.clear()
  }

  getActive(): ReadonlySet<T> {
    return this.active
  }

  get activeCount(): number {
    return this.active.size
  }

  get availableCount(): number {
    return this.pool.length
  }

  destroy(): void {
    this.pool.length = 0
    this.active.clear()
  }
}
