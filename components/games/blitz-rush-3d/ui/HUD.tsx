'use client'

import { useGameStore, PowerupType } from '../hooks/useGameStore'
import { Coins, Zap, Shield, Magnet, Flame, Star } from 'lucide-react'
import { cn } from '@/shared/utils'

// Powerup icon mapping
const PowerupIcon: Record<PowerupType, React.ReactNode> = {
  magnet: <Magnet className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  speed: <Flame className="w-5 h-5" />,
  multiplier: <Star className="w-5 h-5" />,
}

const PowerupColors: Record<PowerupType, string> = {
  magnet: 'bg-red-500',
  shield: 'bg-blue-500',
  speed: 'bg-orange-500',
  multiplier: 'bg-purple-500',
}

export function GameHUD() {
  const {
    phase,
    score,
    coins,
    combo,
    multiplier,
    activePowerup,
    speed,
    distance,
  } = useGameStore()

  if (phase !== 'playing') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {/* Score */}
        <div className="flex flex-col gap-2">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">Score</div>
            <div className="text-3xl font-black text-white tabular-nums">
              {Math.floor(score).toLocaleString()}
            </div>
          </div>

          {/* Combo indicator */}
          {combo > 0 && (
            <div className={cn(
              "bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-3 py-1 text-center animate-pulse",
              multiplier >= 3 && "from-purple-500 to-pink-500"
            )}>
              <span className="font-black text-white">
                {multiplier}x COMBO ({combo})
              </span>
            </div>
          )}
        </div>

        {/* Coins */}
        <div className="bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
          <div className="text-xs text-yellow-300 font-bold uppercase tracking-wider">Coins</div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-3xl font-black text-yellow-400 tabular-nums">{coins}</span>
          </div>
        </div>
      </div>

      {/* Active powerup indicator */}
      {activePowerup && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border-2 border-white/30 animate-pulse",
            PowerupColors[activePowerup.type]
          )}>
            {PowerupIcon[activePowerup.type]}
            <span className="font-bold text-white uppercase">{activePowerup.type}</span>
            <div className="w-16 h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: `${(activePowerup.timeRemaining / activePowerup.duration) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Speed indicator */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="font-mono">{Math.floor(speed)} mph</span>
          </div>
        </div>
      </div>

      {/* Distance */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
          <span className="font-mono text-sm text-gray-300">
            {Math.floor(distance)}m
          </span>
        </div>
      </div>

      {/* Mobile touch zones indicator (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white/30 text-xs">
          ← Swipe to move → | ↑ Jump | ↓ Slide
        </div>
      )}
    </div>
  )
}
