'use client'

import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useGameStore } from './hooks/useGameStore'
import { MenuScreen } from './ui/MenuScreen'
import { TeamSelect } from './ui/TeamSelect'
import { PlaySelect } from './ui/PlaySelect'
import { GameHUD } from './ui/GameHUD'
import { PostPlay, HalftimeScreen } from './ui/PostPlay'
import { GameOver } from './ui/GameOver'

export function GridironIQGame() {
  const { phase, resetGame } = useGameStore()

  // Reset game state on unmount
  useEffect(() => {
    return () => {
      // Optional: reset when leaving the game page
    }
  }, [])

  return (
    <div className="relative w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Game screens */}
      <AnimatePresence mode="wait">
        <MenuScreen key="menu" />
        <TeamSelect key="team-select" />
        <PlaySelect key="play-select" />
        <GameHUD key="game-hud" />
        <PostPlay key="post-play" />
        <HalftimeScreen key="halftime" />
        <GameOver key="game-over" />
      </AnimatePresence>

      {/* Version indicator */}
      <div className="absolute bottom-2 left-2 text-white/20 text-xs font-mono pointer-events-none z-10">
        Gridiron IQ v1.0
      </div>
    </div>
  )
}

export default GridironIQGame
