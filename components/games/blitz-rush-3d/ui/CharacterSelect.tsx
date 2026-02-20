'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Check, Star, Zap, Shield, Coins, Sparkles, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopStore } from '../hooks/useShopStore'
import { CHARACTER_ABILITIES } from '../data/shop-items'
import { cn } from '@/shared/utils'

export interface Character {
  id: string
  name: string
  jerseyColor: string
  helmetColor: string
  unlockRequirement: {
    type: 'default' | 'score' | 'games' | 'coins'
    value: number
  }
  ability: {
    name: string
    description: string
    icon: React.ReactNode
  }
}

// Character definitions
export const CHARACTERS: Character[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    jerseyColor: '#f97316', // Orange
    helmetColor: '#fbbf24', // Gold
    unlockRequirement: { type: 'default', value: 0 },
    ability: {
      name: "Beginner's Luck",
      description: '+10% coins',
      icon: <Coins className="w-4 h-4" />,
    },
  },
  {
    id: 'blue-thunder',
    name: 'Blue Thunder',
    jerseyColor: '#3b82f6', // Blue
    helmetColor: '#60a5fa', // Light blue
    unlockRequirement: { type: 'score', value: 1000 },
    ability: {
      name: 'Lightning Reflexes',
      description: 'Easier lane switches',
      icon: <Zap className="w-4 h-4" />,
    },
  },
  {
    id: 'green-machine',
    name: 'Green Machine',
    jerseyColor: '#22c55e', // Green
    helmetColor: '#4ade80', // Light green
    unlockRequirement: { type: 'score', value: 2500 },
    ability: {
      name: 'Endurance',
      description: 'Shield +25% duration',
      icon: <Shield className="w-4 h-4" />,
    },
  },
  {
    id: 'purple-reign',
    name: 'Purple Reign',
    jerseyColor: '#a855f7', // Purple
    helmetColor: '#c084fc', // Light purple
    unlockRequirement: { type: 'games', value: 10 },
    ability: {
      name: 'Royal Presence',
      description: '+15% fever gain',
      icon: <Sparkles className="w-4 h-4" />,
    },
  },
  {
    id: 'gold-standard',
    name: 'Gold Standard',
    jerseyColor: '#eab308', // Yellow/Gold
    helmetColor: '#fde047', // Bright gold
    unlockRequirement: { type: 'score', value: 5000 },
    ability: {
      name: 'Midas Touch',
      description: '+20% mega coins',
      icon: <Star className="w-4 h-4" />,
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    jerseyColor: '#1e293b', // Dark slate
    helmetColor: '#334155', // Slate
    unlockRequirement: { type: 'games', value: 25 },
    ability: {
      name: 'Shadow Step',
      description: 'Lane switch invuln',
      icon: <Ghost className="w-4 h-4" />,
    },
  },
]

interface CharacterSelectProps {
  isOpen: boolean
  onClose: () => void
}

// Get player stats from localStorage
function getPlayerStats(): { highScore: number; gamesPlayed: number; totalCoins: number } {
  if (typeof window === 'undefined') {
    return { highScore: 0, gamesPlayed: 0, totalCoins: 0 }
  }

  try {
    const progress = localStorage.getItem('football_game_progress')
    if (progress) {
      const parsed = JSON.parse(progress)
      const blitzRush = parsed['blitz-rush-3d'] || {}
      return {
        highScore: blitzRush.highScore || 0,
        gamesPlayed: parseInt(localStorage.getItem('blitz_rush_games_played') || '0'),
        totalCoins: blitzRush.coins || 0,
      }
    }
  } catch (e) {
    console.error('Failed to load player stats', e)
  }

  return { highScore: 0, gamesPlayed: 0, totalCoins: 0 }
}

// Check if a character is unlocked
function isCharacterUnlocked(character: Character, stats: { highScore: number; gamesPlayed: number; totalCoins: number }): boolean {
  const { type, value } = character.unlockRequirement

  switch (type) {
    case 'default':
      return true
    case 'score':
      return stats.highScore >= value
    case 'games':
      return stats.gamesPlayed >= value
    case 'coins':
      return stats.totalCoins >= value
    default:
      return false
  }
}

// Get unlock progress text
function getUnlockText(character: Character, stats: { highScore: number; gamesPlayed: number; totalCoins: number }): string {
  const { type, value } = character.unlockRequirement

  switch (type) {
    case 'score':
      return `Score ${value.toLocaleString()} (${stats.highScore.toLocaleString()}/${value.toLocaleString()})`
    case 'games':
      return `Play ${value} games (${stats.gamesPlayed}/${value})`
    case 'coins':
      return `Earn ${value.toLocaleString()} coins`
    default:
      return ''
  }
}

export function CharacterSelect({ isOpen, onClose }: CharacterSelectProps) {
  const { selectedCharacter, setSelectedCharacter } = useShopStore()
  const [stats, setStats] = useState({ highScore: 0, gamesPlayed: 0, totalCoins: 0 })

  useEffect(() => {
    if (isOpen) {
      setStats(getPlayerStats())
    }
  }, [isOpen])

  const handleSelect = (character: Character) => {
    if (isCharacterUnlocked(character, stats)) {
      setSelectedCharacter(character.id)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Characters
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Each character has a unique ability
            </p>
          </div>

          {/* Character Grid */}
          <div className="relative p-6 max-h-[450px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {CHARACTERS.map((character) => {
                const unlocked = isCharacterUnlocked(character, stats)
                const isSelected = selectedCharacter === character.id

                return (
                  <button
                    key={character.id}
                    onClick={() => handleSelect(character)}
                    disabled={!unlocked}
                    className={cn(
                      "relative p-4 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400/30"
                        : unlocked
                          ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                          : "border-slate-700/50 bg-slate-800/30 opacity-60 cursor-not-allowed"
                    )}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}

                    {/* Lock indicator */}
                    {!unlocked && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-slate-400" />
                      </div>
                    )}

                    {/* Character Preview */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Jersey color preview */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: character.jerseyColor + '30' }}
                      >
                        <div
                          className="w-8 h-10 rounded-t-full"
                          style={{ backgroundColor: character.jerseyColor }}
                        />
                        <div
                          className="absolute top-0 w-6 h-6 rounded-full"
                          style={{ backgroundColor: character.helmetColor }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{character.name}</h3>
                        {!unlocked && (
                          <p className="text-xs text-slate-500">
                            {getUnlockText(character, stats)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ability */}
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-xl text-sm",
                      unlocked
                        ? "bg-slate-700/50 text-white"
                        : "bg-slate-800/50 text-slate-500"
                    )}>
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center",
                        unlocked ? "bg-purple-500/20 text-purple-400" : "bg-slate-700 text-slate-500"
                      )}>
                        {character.ability.icon}
                      </div>
                      <div>
                        <span className="font-medium">{character.ability.name}</span>
                        <span className="text-slate-400 ml-1 text-xs">
                          {character.ability.description}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="relative p-4 border-t border-slate-700/50 bg-slate-800/30">
            <Button
              onClick={onClose}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Get currently selected character
export function getSelectedCharacter(): Character {
  const selectedId = useShopStore.getState().selectedCharacter
  return CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0]
}
