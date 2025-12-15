import { useCallback, useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler'

// Sound effect definitions
// These will be loaded from actual files once Antigravity creates them
const SOUND_PATHS = {
  // Player sounds
  footstep: '/sounds/blitz-rush/footstep.mp3',
  jump: '/sounds/blitz-rush/jump.mp3',
  land: '/sounds/blitz-rush/land.mp3',
  slide: '/sounds/blitz-rush/slide.mp3',
  laneSwitch: '/sounds/blitz-rush/lane-switch.mp3',

  // Collectibles
  coin: '/sounds/blitz-rush/coin.mp3',
  powerup: '/sounds/blitz-rush/powerup.mp3',
  megaCoin: '/sounds/blitz-rush/mega-coin.mp3',

  // Effects
  shieldActivate: '/sounds/blitz-rush/shield-activate.mp3',
  shieldBreak: '/sounds/blitz-rush/shield-break.mp3',
  speedBoost: '/sounds/blitz-rush/speed-boost.mp3',
  magnetActivate: '/sounds/blitz-rush/magnet.mp3',

  // Collision
  nearMiss: '/sounds/blitz-rush/near-miss.mp3',
  collision: '/sounds/blitz-rush/collision.mp3',

  // Game events
  gameStart: '/sounds/blitz-rush/game-start.mp3',
  gameOver: '/sounds/blitz-rush/game-over.mp3',
  highScore: '/sounds/blitz-rush/high-score.mp3',
  milestone: '/sounds/blitz-rush/milestone.mp3',
  combo: '/sounds/blitz-rush/combo.mp3',

  // UI
  buttonClick: '/sounds/blitz-rush/button-click.mp3',

  // Ambience
  crowd: '/sounds/blitz-rush/crowd-ambience.mp3',
} as const

type SoundName = keyof typeof SOUND_PATHS

// Music tracks
const MUSIC_PATHS = {
  menu: '/sounds/blitz-rush/music-menu.mp3',
  gameplay: '/sounds/blitz-rush/music-gameplay.mp3',
  gameOver: '/sounds/blitz-rush/music-gameover.mp3',
} as const

type MusicName = keyof typeof MUSIC_PATHS

interface AudioState {
  sounds: Map<SoundName, Howl>
  music: Map<MusicName, Howl>
  currentMusic: MusicName | null
  sfxVolume: number
  musicVolume: number
  muted: boolean
}

// Singleton audio manager
class AudioManager {
  private state: AudioState = {
    sounds: new Map(),
    music: new Map(),
    currentMusic: null,
    sfxVolume: 0.7,
    musicVolume: 0.4,
    muted: false,
  }

  private loaded = false

  async preload(): Promise<void> {
    if (this.loaded) return

    // Preload all sound effects
    const soundPromises = Object.entries(SOUND_PATHS).map(([name, path]) => {
      return new Promise<void>((resolve) => {
        const sound = new Howl({
          src: [path],
          volume: this.state.sfxVolume,
          preload: true,
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Failed to load sound: ${name}`)
            resolve() // Don't block on missing sounds
          },
        })
        this.state.sounds.set(name as SoundName, sound)
      })
    })

    // Preload music (but don't block)
    Object.entries(MUSIC_PATHS).forEach(([name, path]) => {
      const music = new Howl({
        src: [path],
        volume: this.state.musicVolume,
        loop: true,
        preload: true,
      })
      this.state.music.set(name as MusicName, music)
    })

    await Promise.all(soundPromises)
    this.loaded = true
  }

  play(name: SoundName, options?: { volume?: number; rate?: number }): void {
    if (this.state.muted) return

    const sound = this.state.sounds.get(name)
    if (!sound) {
      console.warn(`Sound not found: ${name}`)
      return
    }

    const id = sound.play()

    if (options?.volume !== undefined) {
      sound.volume(options.volume * this.state.sfxVolume, id)
    }
    if (options?.rate !== undefined) {
      sound.rate(options.rate, id)
    }
  }

  playMusic(name: MusicName, fadeIn = 1000): void {
    if (this.state.currentMusic === name) return

    // Fade out current music
    if (this.state.currentMusic) {
      const current = this.state.music.get(this.state.currentMusic)
      if (current) {
        current.fade(current.volume(), 0, fadeIn)
        setTimeout(() => current.stop(), fadeIn)
      }
    }

    // Start new music
    const music = this.state.music.get(name)
    if (music) {
      music.volume(0)
      music.play()
      music.fade(0, this.state.muted ? 0 : this.state.musicVolume, fadeIn)
      this.state.currentMusic = name
    }
  }

  stopMusic(fadeOut = 500): void {
    if (this.state.currentMusic) {
      const music = this.state.music.get(this.state.currentMusic)
      if (music) {
        music.fade(music.volume(), 0, fadeOut)
        setTimeout(() => music.stop(), fadeOut)
      }
      this.state.currentMusic = null
    }
  }

  setSfxVolume(volume: number): void {
    this.state.sfxVolume = Math.max(0, Math.min(1, volume))
    this.state.sounds.forEach((sound) => {
      sound.volume(this.state.sfxVolume)
    })
  }

  setMusicVolume(volume: number): void {
    this.state.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.state.currentMusic) {
      const music = this.state.music.get(this.state.currentMusic)
      if (music) {
        music.volume(this.state.muted ? 0 : this.state.musicVolume)
      }
    }
  }

  setMuted(muted: boolean): void {
    this.state.muted = muted
    Howler.mute(muted)
  }

  toggleMute(): boolean {
    this.setMuted(!this.state.muted)
    return this.state.muted
  }

  get isMuted(): boolean {
    return this.state.muted
  }
}

// Singleton instance
const audioManager = new AudioManager()

// React hook
export function useAudio() {
  const managerRef = useRef(audioManager)

  useEffect(() => {
    // Preload sounds on mount
    managerRef.current.preload()
  }, [])

  const play = useCallback((name: SoundName, options?: { volume?: number; rate?: number }) => {
    managerRef.current.play(name, options)
  }, [])

  const playMusic = useCallback((name: MusicName, fadeIn?: number) => {
    managerRef.current.playMusic(name, fadeIn)
  }, [])

  const stopMusic = useCallback((fadeOut?: number) => {
    managerRef.current.stopMusic(fadeOut)
  }, [])

  const setSfxVolume = useCallback((volume: number) => {
    managerRef.current.setSfxVolume(volume)
  }, [])

  const setMusicVolume = useCallback((volume: number) => {
    managerRef.current.setMusicVolume(volume)
  }, [])

  const toggleMute = useCallback(() => {
    return managerRef.current.toggleMute()
  }, [])

  return {
    play,
    playMusic,
    stopMusic,
    setSfxVolume,
    setMusicVolume,
    toggleMute,
    isMuted: managerRef.current.isMuted,
  }
}

// Export types for use elsewhere
export type { SoundName, MusicName }
