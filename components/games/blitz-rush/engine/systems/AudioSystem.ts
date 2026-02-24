import { Howl, Howler } from 'howler'
import { EventBus } from '../core/EventBus'
import { SOUND_PATHS, MUSIC_PATHS, AMBIENT_PATHS, type SoundName, type MusicName } from '../config/constants'

export class AudioSystem {
  private events: EventBus
  private sounds = new Map<SoundName, Howl>()
  private music = new Map<MusicName, Howl>()
  private currentMusic: MusicName | null = null
  private sfxVolume = 0.7
  private musicVolume = 0.4
  private muted = true // Start muted by default
  private loaded = false
  private musicLoaded = false

  // Reactive crowd
  private crowdAmbience: Howl | null = null
  private crowdBaseVolume = 0.15

  constructor(events: EventBus) {
    this.events = events

    // Subscribe to engine sound events
    this.events.on('playSound', ({ name, options }) => {
      this.play(name as SoundName, options)
    })
    this.events.on('playMusic', ({ name, fadeIn }) => {
      this.playMusic(name as MusicName, fadeIn)
    })
    this.events.on('stopMusic', ({ fadeOut }) => {
      this.stopMusic(fadeOut)
    })

    // Reactive crowd excitement
    this.events.on('nearMiss', ({ chain }) => {
      this.setCrowdExcitement(Math.min(chain * 0.3, 1.5))
    })
    this.events.on('feverActivated', () => {
      this.setCrowdExcitement(1.5)
    })
    this.events.on('feverEnded', () => {
      this.setCrowdExcitement(0)
    })
    this.events.on('comboMilestone', ({ combo }) => {
      this.setCrowdExcitement(combo >= 20 ? 1.2 : combo >= 10 ? 0.8 : 0.4)
    })
  }

  async preload(): Promise<void> {
    if (this.loaded) return

    // Only preload SFX eagerly — music is lazy-loaded on first play
    const promises = Object.entries(SOUND_PATHS).map(([name, path]) =>
      new Promise<void>((resolve) => {
        const sound = new Howl({
          src: [path],
          volume: this.sfxVolume,
          preload: true,
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Failed to load sound: ${name}`)
            resolve()
          },
        })
        this.sounds.set(name as SoundName, sound)
      })
    )

    await Promise.all(promises)
    this.loaded = true
  }

  private ensureMusicLoaded(): void {
    if (this.musicLoaded) return
    this.musicLoaded = true

    Object.entries(MUSIC_PATHS).forEach(([name, path]) => {
      const m = new Howl({
        src: [path],
        volume: this.musicVolume,
        loop: true,
        preload: true,
      })
      this.music.set(name as MusicName, m)
    })

    // Load crowd ambience (loop, low base volume)
    this.crowdAmbience = new Howl({
      src: [AMBIENT_PATHS.crowdAmbience],
      volume: this.crowdBaseVolume,
      loop: true,
      preload: true,
    })
  }

  // Start/stop crowd ambience with gameplay
  startCrowdAmbience(): void {
    if (this.muted || !this.crowdAmbience) return
    this.crowdAmbience.volume(this.crowdBaseVolume)
    this.crowdAmbience.play()
  }

  stopCrowdAmbience(fadeOut = 500): void {
    if (!this.crowdAmbience) return
    this.crowdAmbience.fade(this.crowdAmbience.volume(), 0, fadeOut)
    setTimeout(() => this.crowdAmbience?.stop(), fadeOut)
  }

  play(name: SoundName, options?: { volume?: number; rate?: number }): void {
    if (this.muted) return
    const sound = this.sounds.get(name)
    if (!sound) return

    const id = sound.play()
    if (options?.volume !== undefined) {
      sound.volume(options.volume * this.sfxVolume, id)
    }
    if (options?.rate !== undefined) {
      sound.rate(options.rate, id)
    }
  }

  playMusic(name: MusicName, fadeIn = 1000): void {
    this.ensureMusicLoaded()
    if (this.currentMusic === name) return

    if (this.currentMusic) {
      const current = this.music.get(this.currentMusic)
      if (current) {
        current.fade(current.volume(), 0, fadeIn)
        setTimeout(() => current.stop(), fadeIn)
      }
    }

    const m = this.music.get(name)
    if (m) {
      m.volume(0)
      m.play()
      m.fade(0, this.muted ? 0 : this.musicVolume, fadeIn)
      this.currentMusic = name
    }
  }

  stopMusic(fadeOut = 500): void {
    if (this.currentMusic) {
      const m = this.music.get(this.currentMusic)
      if (m) {
        m.fade(m.volume(), 0, fadeOut)
        setTimeout(() => m.stop(), fadeOut)
      }
      this.currentMusic = null
    }
  }

  // Reactive crowd: increase volume/pitch on exciting moments
  setCrowdExcitement(level: number): void {
    if (this.crowdAmbience) {
      const vol = this.crowdBaseVolume + level * 0.2
      this.crowdAmbience.volume(Math.min(0.5, vol))
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    Howler.mute(muted)
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  get isMuted(): boolean {
    return this.muted
  }

  unlockAudioContext(): void {
    if (typeof window !== 'undefined' && Howler.ctx) {
      if (Howler.ctx.state === 'suspended') {
        Howler.ctx.resume()
      }
    }
  }

  destroy(): void {
    this.stopMusic(0)
    this.sounds.forEach(s => s.unload())
    this.music.forEach(m => m.unload())
    this.sounds.clear()
    this.music.clear()
    if (this.crowdAmbience) {
      this.crowdAmbience.unload()
    }
  }
}
