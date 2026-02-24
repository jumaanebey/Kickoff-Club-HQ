'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { BlitzRushEngine } from '../engine/BlitzRushEngine'
import type { GamePhase, GameSnapshot, PopupData } from '../engine/core/EventBus'

export interface GameStateHook {
  phase: GamePhase
  snapshot: GameSnapshot | null
  popups: PopupData[]
  isFever: boolean
  highScore: number
}

const INITIAL_SNAPSHOT: GameSnapshot = {
  score: 0,
  coins: 0,
  distance: 0,
  speed: 22,
  combo: 0,
  multiplier: 1,
  feverMeter: 0,
  isFever: false,
  nearMissChain: 0,
  nearMissChainBest: 0,
  nearMissChainTimer: 0,
  nearMissMultiplier: 1,
  hasShield: false,
  hasSpeedBoost: false,
  hasMagnet: false,
  hasMultiplier: false,
  activePowerupType: null,
  activePowerupProgress: 0,
  deathCause: null,
  highScore: 0,
  previousHighScore: 0,
  isFirstRunMode: false,
  footballIQGained: 0,
  feverActivations: 0,
}

export function useGameState(engine: BlitzRushEngine | null): GameStateHook {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [popups, setPopups] = useState<PopupData[]>([])
  const [isFever, setIsFever] = useState(false)

  // Use ref for high-frequency snapshot updates (avoid re-renders)
  const snapshotRef = useRef<GameSnapshot>(INITIAL_SNAPSHOT)
  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL_SNAPSHOT)

  // High score tracked separately for display
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    if (!engine) return

    const unsubs: (() => void)[] = []

    // State changes (low frequency)
    unsubs.push(engine.on('stateChange', (newPhase) => {
      setPhase(newPhase)
    }))

    // Game over (low frequency)
    unsubs.push(engine.on('gameOver', (snap) => {
      snapshotRef.current = snap
      setSnapshot(snap)
      setHighScore(snap.highScore)
    }))

    // Tick updates — only update React state at ~20fps
    let lastUpdate = 0
    unsubs.push(engine.on('tick', (snap) => {
      snapshotRef.current = snap
      const now = performance.now()
      if (now - lastUpdate > 50) {
        setSnapshot(snap)
        lastUpdate = now
      }
    }))

    // Popups
    unsubs.push(engine.on('popup', (popup) => {
      setPopups(prev => [...prev, popup])
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== popup.id))
      }, 1500)
    }))

    // Fever
    unsubs.push(engine.on('feverActivated', () => setIsFever(true)))
    unsubs.push(engine.on('feverEnded', () => setIsFever(false)))

    // Load initial high score
    setHighScore(engine.getState().highScore)

    return () => {
      unsubs.forEach(fn => fn())
    }
  }, [engine])

  return { phase, snapshot, popups, isFever, highScore }
}
