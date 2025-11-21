import { useCallback } from 'react'

export function useGameSound() {
    const playSound = useCallback((type: 'click' | 'correct' | 'wrong' | 'win' | 'start') => {
        // Check if we are in a browser environment
        if (typeof window === 'undefined') return

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContext) return

        const ctx = new AudioContext()

        // Create master gain to control overall volume
        const masterGain = ctx.createGain()
        masterGain.gain.value = 0.1 // Keep it subtle
        masterGain.connect(ctx.destination)

        const now = ctx.currentTime

        switch (type) {
            case 'click':
                const clickOsc = ctx.createOscillator()
                const clickGain = ctx.createGain()
                clickOsc.connect(clickGain)
                clickGain.connect(masterGain)

                clickOsc.type = 'sine'
                clickOsc.frequency.setValueAtTime(800, now)
                clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.05)

                clickGain.gain.setValueAtTime(1, now)
                clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

                clickOsc.start(now)
                clickOsc.stop(now + 0.05)
                break

            case 'correct':
                const correctOsc = ctx.createOscillator()
                const correctGain = ctx.createGain()
                correctOsc.connect(correctGain)
                correctGain.connect(masterGain)

                correctOsc.type = 'sine'
                correctOsc.frequency.setValueAtTime(600, now)
                correctOsc.frequency.setValueAtTime(1200, now + 0.1)

                correctGain.gain.setValueAtTime(0, now)
                correctGain.gain.linearRampToValueAtTime(1, now + 0.05)
                correctGain.gain.linearRampToValueAtTime(0, now + 0.3)

                correctOsc.start(now)
                correctOsc.stop(now + 0.3)
                break

            case 'wrong':
                const wrongOsc = ctx.createOscillator()
                const wrongGain = ctx.createGain()
                wrongOsc.connect(wrongGain)
                wrongGain.connect(masterGain)

                wrongOsc.type = 'sawtooth'
                wrongOsc.frequency.setValueAtTime(150, now)
                wrongOsc.frequency.linearRampToValueAtTime(100, now + 0.3)

                wrongGain.gain.setValueAtTime(1, now)
                wrongGain.gain.linearRampToValueAtTime(0, now + 0.3)

                wrongOsc.start(now)
                wrongOsc.stop(now + 0.3)
                break

            case 'start':
                const startOsc = ctx.createOscillator()
                const startGain = ctx.createGain()
                startOsc.connect(startGain)
                startGain.connect(masterGain)

                startOsc.type = 'triangle'
                startOsc.frequency.setValueAtTime(440, now)
                startOsc.frequency.linearRampToValueAtTime(880, now + 0.3)

                startGain.gain.setValueAtTime(0, now)
                startGain.gain.linearRampToValueAtTime(1, now + 0.1)
                startGain.gain.linearRampToValueAtTime(0, now + 0.6)

                startOsc.start(now)
                startOsc.stop(now + 0.6)
                break

            case 'win':
                // Arpeggio C Major
                const notes = [523.25, 659.25, 783.99, 1046.50] // C5 E5 G5 C6
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator()
                    const gain = ctx.createGain()
                    osc.connect(gain)
                    gain.connect(masterGain)

                    const t = now + i * 0.1
                    osc.type = 'sine'
                    osc.frequency.value = freq

                    gain.gain.setValueAtTime(0, t)
                    gain.gain.linearRampToValueAtTime(0.5, t + 0.05)
                    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4)

                    osc.start(t)
                    osc.stop(t + 0.4)
                })
                break
        }
    }, [])

    return playSound
}
