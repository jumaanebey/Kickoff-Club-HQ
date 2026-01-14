'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, X, Trophy, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Character definitions
export interface Character {
  id: string
  name: string
  description: string
  jerseyColor: string
  unlockRequirement: {
    type: 'default' | 'score' | 'games'
    value: number
  }
}

export const CHARACTERS: Character[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    description: 'Fresh out of the draft, ready to prove themselves on the field.',
    jerseyColor: '#f97316',
    unlockRequirement: { type: 'default', value: 0 }
  },
  {
    id: 'blue-thunder',
    name: 'Blue Thunder',
    description: 'Strikes like lightning, unstoppable in the open field.',
    jerseyColor: '#3b82f6',
    unlockRequirement: { type: 'score', value: 1000 }
  },
  {
    id: 'green-machine',
    name: 'Green Machine',
    description: 'A tireless runner who never stops grinding for yards.',
    jerseyColor: '#22c55e',
    unlockRequirement: { type: 'score', value: 2500 }
  },
  {
    id: 'purple-reign',
    name: 'Purple Reign',
    description: 'Royalty on the gridiron, feared by every defense.',
    jerseyColor: '#8b5cf6',
    unlockRequirement: { type: 'score', value: 5000 }
  },
  {
    id: 'gold-standard',
    name: 'Gold Standard',
    description: 'The elite of the elite. Pure excellence in motion.',
    jerseyColor: '#eab308',
    unlockRequirement: { type: 'score', value: 10000 }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'A shadow on the field, moves unseen until it\'s too late.',
    jerseyColor: '#1f2937',
    unlockRequirement: { type: 'games', value: 10 }
  }
]

// LocalStorage keys
const CHARACTER_KEY = 'blitz-rush-character'
const TOTAL_SCORE_KEY = 'blitz-rush-total-score'
const GAMES_PLAYED_KEY = 'blitz-rush-games-played'

// Get player stats from localStorage
export function getPlayerStats(): { totalScore: number; gamesPlayed: number } {
  if (typeof window === 'undefined') {
    return { totalScore: 0, gamesPlayed: 0 }
  }

  const totalScore = parseInt(localStorage.getItem(TOTAL_SCORE_KEY) || '0', 10)
  const gamesPlayed = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10)

  return { totalScore, gamesPlayed }
}

// Update player stats (call this after each game)
export function updatePlayerStats(score: number): void {
  if (typeof window === 'undefined') return

  const stats = getPlayerStats()
  localStorage.setItem(TOTAL_SCORE_KEY, String(stats.totalScore + score))
  localStorage.setItem(GAMES_PLAYED_KEY, String(stats.gamesPlayed + 1))
}

// Check if a character is unlocked
export function isCharacterUnlocked(character: Character, stats: { totalScore: number; gamesPlayed: number }): boolean {
  switch (character.unlockRequirement.type) {
    case 'default':
      return true
    case 'score':
      return stats.totalScore >= character.unlockRequirement.value
    case 'games':
      return stats.gamesPlayed >= character.unlockRequirement.value
    default:
      return false
  }
}

// Get selected character from localStorage
export function getSelectedCharacter(): Character {
  if (typeof window === 'undefined') {
    return CHARACTERS[0]
  }

  const savedId = localStorage.getItem(CHARACTER_KEY)
  const found = CHARACTERS.find(c => c.id === savedId)
  return found || CHARACTERS[0]
}

// Save selected character to localStorage
export function setSelectedCharacter(characterId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHARACTER_KEY, characterId)
}

// Character card component
function CharacterCard({
  character,
  isSelected,
  isUnlocked,
  stats,
  onSelect
}: {
  character: Character
  isSelected: boolean
  isUnlocked: boolean
  stats: { totalScore: number; gamesPlayed: number }
  onSelect: () => void
}) {
  const getUnlockText = () => {
    const req = character.unlockRequirement
    if (req.type === 'score') {
      return `Unlock at ${req.value.toLocaleString()} total score`
    }
    if (req.type === 'games') {
      return `Play ${req.value} games to unlock`
    }
    return ''
  }

  const getProgress = () => {
    const req = character.unlockRequirement
    if (req.type === 'score') {
      return Math.min(100, (stats.totalScore / req.value) * 100)
    }
    if (req.type === 'games') {
      return Math.min(100, (stats.gamesPlayed / req.value) * 100)
    }
    return 100
  }

  return (
    <motion.button
      whileHover={isUnlocked ? { scale: 1.02 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
      onClick={isUnlocked ? onSelect : undefined}
      className={`relative w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
        isSelected
          ? 'border-yellow-400 bg-yellow-400/10'
          : isUnlocked
          ? 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          : 'border-slate-800 bg-slate-900/50 cursor-not-allowed opacity-70'
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
        </div>
      )}

      {/* Lock indicator */}
      {!isUnlocked && (
        <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-slate-700 rounded-full flex items-center justify-center">
          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Jersey color preview */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-white/10"
          style={{ backgroundColor: character.jerseyColor }}
        >
          {/* Simple jersey icon representation */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-md" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-sm sm:text-base ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
            {character.name}
          </h3>
          <p className={`text-xs sm:text-sm mt-0.5 line-clamp-2 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
            {character.description}
          </p>

          {/* Unlock progress for locked characters */}
          {!isUnlocked && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 mb-1">
                {character.unlockRequirement.type === 'score' ? (
                  <Trophy className="w-3 h-3" />
                ) : (
                  <Gamepad2 className="w-3 h-3" />
                )}
                <span>{getUnlockText()}</span>
              </div>
              <div className="h-1 sm:h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: character.jerseyColor }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// Main CharacterSelect component
interface CharacterSelectProps {
  isOpen: boolean
  onClose: () => void
}

export function CharacterSelect({ isOpen, onClose }: CharacterSelectProps) {
  const [stats, setStats] = useState({ totalScore: 0, gamesPlayed: 0 })
  const [selectedId, setSelectedId] = useState<string>('rookie')

  // Load stats and selected character on mount
  useEffect(() => {
    if (isOpen) {
      setStats(getPlayerStats())
      setSelectedId(getSelectedCharacter().id)
    }
  }, [isOpen])

  const handleSelect = (character: Character) => {
    setSelectedId(character.id)
    setSelectedCharacter(character.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-slate-700 rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-slate-700">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </button>

              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Choose Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Player
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Unlock new characters by playing games and scoring points
              </p>

              {/* Stats display */}
              <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className="text-slate-300">
                    Total Score:{' '}
                    <span className="font-bold text-white">{stats.totalScore.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="text-slate-300">
                    Games:{' '}
                    <span className="font-bold text-white">{stats.gamesPlayed}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Character list */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)] space-y-2 sm:space-y-3">
              {CHARACTERS.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CharacterCard
                    character={character}
                    isSelected={selectedId === character.id}
                    isUnlocked={isCharacterUnlocked(character, stats)}
                    stats={stats}
                    onSelect={() => handleSelect(character)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-700">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
