'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import { Howl, Howler } from 'howler'

// Sound effect types
type SoundEffect =
  | 'snap'
  | 'throw'
  | 'catch'
  | 'incomplete'
  | 'touchdown'
  | 'interception'
  | 'sack'
  | 'whistle'
  | 'crowd-cheer'
  | 'crowd-boo'
  | 'first-down'
  | 'select'
  | 'click'

// Announcer call types
type AnnouncerCall =
  | 'touchdown'
  | 'interception'
  | 'complete'
  | 'incomplete'
  | 'sacked'
  | 'first-down'
  | 'nice-throw'
  | 'great-read'

// Sound configuration - using Web Audio API for generated sounds
const SOUND_CONFIG: { [key in SoundEffect]: { frequency?: number; duration: number; type: 'tone' | 'noise' | 'click' } } = {
  snap: { frequency: 200, duration: 0.1, type: 'click' },
  throw: { frequency: 800, duration: 0.15, type: 'tone' },
  catch: { frequency: 600, duration: 0.2, type: 'tone' },
  incomplete: { frequency: 300, duration: 0.3, type: 'tone' },
  touchdown: { frequency: 440, duration: 0.5, type: 'tone' },
  interception: { frequency: 200, duration: 0.4, type: 'tone' },
  sack: { frequency: 150, duration: 0.3, type: 'tone' },
  whistle: { frequency: 1200, duration: 0.4, type: 'tone' },
  'crowd-cheer': { duration: 1.0, type: 'noise' },
  'crowd-boo': { duration: 0.8, type: 'noise' },
  'first-down': { frequency: 523, duration: 0.3, type: 'tone' },
  select: { frequency: 500, duration: 0.1, type: 'click' },
  click: { frequency: 400, duration: 0.05, type: 'click' },
}

// Announcer phrases (text-to-speech or pre-recorded would go here)
const ANNOUNCER_PHRASES: { [key in AnnouncerCall]: string[] } = {
  touchdown: ['TOUCHDOWN!', 'HE SCORES!', 'IN THE END ZONE!'],
  interception: ['INTERCEPTED!', 'PICKED OFF!', 'TURNOVER!'],
  complete: ['Complete!', 'First down!', 'Nice throw!'],
  incomplete: ['Incomplete.', 'Dropped.', 'No catch.'],
  sacked: ['SACKED!', 'He\'s down!', 'Got him!'],
  'first-down': ['First down!', 'Moving the chains!'],
  'nice-throw': ['What a throw!', 'Perfect placement!'],
  'great-read': ['Great read!', 'He saw it all the way!'],
}

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.value = isMuted ? 0 : 0.5
      }
    }

    // Initialize on first user interaction
    const handleInteraction = () => {
      initAudio()
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }
    }

    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [isMuted])

  // Update gain when muted state changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 0.5
    }
  }, [isMuted])

  // Play a generated sound effect
  const playSound = useCallback((effect: SoundEffect) => {
    if (isMuted || !audioContextRef.current || !gainNodeRef.current) return

    const ctx = audioContextRef.current
    const config = SOUND_CONFIG[effect]

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    try {
      if (config.type === 'tone' && config.frequency) {
        // Generate a tone
        const oscillator = ctx.createOscillator()
        const envelope = ctx.createGain()

        oscillator.type = 'sine'
        oscillator.frequency.value = config.frequency

        envelope.gain.setValueAtTime(0.3, ctx.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)

        oscillator.connect(envelope)
        envelope.connect(gainNodeRef.current!)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + config.duration)
      } else if (config.type === 'noise') {
        // Generate noise (for crowd sounds)
        const bufferSize = ctx.sampleRate * config.duration
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }

        const noise = ctx.createBufferSource()
        const filter = ctx.createBiquadFilter()
        const envelope = ctx.createGain()

        noise.buffer = buffer
        filter.type = 'lowpass'
        filter.frequency.value = 1000

        envelope.gain.setValueAtTime(0.1, ctx.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)

        noise.connect(filter)
        filter.connect(envelope)
        envelope.connect(gainNodeRef.current!)

        noise.start(ctx.currentTime)
      } else if (config.type === 'click') {
        // Generate a click sound
        const oscillator = ctx.createOscillator()
        const envelope = ctx.createGain()

        oscillator.type = 'square'
        oscillator.frequency.value = config.frequency || 400

        envelope.gain.setValueAtTime(0.2, ctx.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)

        oscillator.connect(envelope)
        envelope.connect(gainNodeRef.current!)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + config.duration)
      }
    } catch (e) {
      console.error('Audio error:', e)
    }
  }, [isMuted])

  // Play announcer call (using speech synthesis as fallback)
  const playAnnouncer = useCallback((call: AnnouncerCall) => {
    if (isMuted) return

    const phrases = ANNOUNCER_PHRASES[call]
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]

    // Use speech synthesis if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase)
      utterance.rate = 1.2
      utterance.pitch = 0.9
      utterance.volume = 0.7
      window.speechSynthesis.speak(utterance)
    }
  }, [isMuted])

  // Play touchdown celebration
  const playTouchdown = useCallback(() => {
    playSound('whistle')
    setTimeout(() => playSound('touchdown'), 200)
    setTimeout(() => playSound('crowd-cheer'), 400)
    setTimeout(() => playAnnouncer('touchdown'), 600)
  }, [playSound, playAnnouncer])

  // Play interception
  const playInterception = useCallback(() => {
    playSound('interception')
    setTimeout(() => playSound('crowd-boo'), 300)
    setTimeout(() => playAnnouncer('interception'), 500)
  }, [playSound, playAnnouncer])

  // Play completion
  const playCompletion = useCallback((yards: number) => {
    playSound('catch')
    if (yards >= 15) {
      setTimeout(() => playAnnouncer('nice-throw'), 300)
    }
  }, [playSound, playAnnouncer])

  // Play incompletion
  const playIncompletion = useCallback(() => {
    playSound('incomplete')
  }, [playSound])

  // Play sack
  const playSack = useCallback(() => {
    playSound('sack')
    setTimeout(() => playAnnouncer('sacked'), 200)
  }, [playSound, playAnnouncer])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    return newMuted
  }, [isMuted])

  return {
    playSound,
    playAnnouncer,
    playTouchdown,
    playInterception,
    playCompletion,
    playIncompletion,
    playSack,
    toggleMute,
    isMuted,
  }
}
