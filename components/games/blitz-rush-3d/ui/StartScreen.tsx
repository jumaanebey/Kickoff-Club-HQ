'use client'

import { useState } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { useShopStore } from '../hooks/useShopStore'
import { Button } from '@/components/ui/button'
import { Play, Trophy, HelpCircle, ShoppingBag, Coins, Target, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howler } from 'howler'
import { Shop } from './Shop'
import { Missions, MissionsWidget } from './Missions'
import { CharacterSelect, CHARACTERS } from './CharacterSelect'
import { HEAD_STARTS } from '../data/shop-items'

interface StartScreenProps {
  onShowTutorial?: () => void
}

export function StartScreen({ onShowTutorial }: StartScreenProps) {
  const { phase, highScore, startGame } = useGameStore()
  const { totalCoins, selectedHeadStarts, selectedCharacter, getHeadStartCost, spendCoins, clearHeadStarts } = useShopStore()
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isMissionsOpen, setIsMissionsOpen] = useState(false)
  const [isCharacterSelectOpen, setIsCharacterSelectOpen] = useState(false)

  const currentCharacter = CHARACTERS.find(c => c.id === selectedCharacter) || CHARACTERS[0]

  const headStartCost = getHeadStartCost()
  const hasSelectedHeadStarts = Object.values(selectedHeadStarts).some(v => v)

  const handleStart = () => {
    // Unlock audio context on first user gesture
    if (typeof window !== 'undefined' && Howler.ctx) {
      if (Howler.ctx.state === 'suspended') {
        Howler.ctx.resume()
      }
    }

    // Deduct head start cost if any selected
    if (headStartCost > 0) {
      const success = spendCoins(headStartCost)
      if (!success) {
        // Not enough coins - shouldn't happen if UI is correct
        return
      }
    }

    // Start game with head starts applied
    startGame()

    // Apply head starts after a short delay (after game state is set)
    if (hasSelectedHeadStarts) {
      setTimeout(() => {
        const { activatePowerup, activateShield } = useGameStore.getState()

        if (selectedHeadStarts.shield) {
          activateShield()
        }
        if (selectedHeadStarts.magnet) {
          activatePowerup('magnet', 8000) // 8 seconds
        }
        if (selectedHeadStarts.speed) {
          activatePowerup('speed', 5000) // 5 seconds
        }
        if (selectedHeadStarts.multiplier) {
          activatePowerup('multiplier', 10000) // 10 seconds
        }
      }, 100)

      // Clear selected head starts for next run
      clearHeadStarts()
    }
  }

  if (phase !== 'menu') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />

          <div className="relative text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />

            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
              Blitz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Rush
              </span>
            </h1>

            <p className="text-xl text-blue-300 font-bold tracking-widest uppercase mt-2">
              3D Edition
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {/* Coin Balance */}
          <div className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/50 flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              {totalCoins.toLocaleString()}
            </span>
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/50 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold">
                {Math.floor(highScore).toLocaleString()}
              </span>
            </div>
          )}
        </motion.div>

        {/* Missions Widget */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <MissionsWidget onClick={() => setIsMissionsOpen(true)} />
        </motion.div>

        {/* Selected Head Starts Preview */}
        {hasSelectedHeadStarts && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 bg-slate-800/50 px-4 py-3 rounded-2xl border border-slate-700"
          >
            <div className="text-xs text-slate-400 uppercase font-bold mb-2">Starting with:</div>
            <div className="flex items-center gap-2 justify-center">
              {HEAD_STARTS.filter(h => selectedHeadStarts[h.id]).map(h => (
                <div
                  key={h.id}
                  className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center text-xl"
                  title={h.name}
                >
                  {h.icon}
                </div>
              ))}
              <div className="text-sm text-yellow-400 font-bold ml-2">
                -{headStartCost} coins
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 items-center"
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-2xl md:text-3xl px-12 md:px-16 py-8 md:py-10 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 mr-3 fill-black" />
            KICKOFF
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setIsShopOpen(true)}
              variant="outline"
              className="border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 font-bold px-6 py-6 rounded-2xl flex-1"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              SHOP
            </Button>
            <Button
              onClick={() => setIsCharacterSelectOpen(true)}
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10 text-purple-400 font-bold px-6 py-6 rounded-2xl flex-1"
            >
              <Users className="w-5 h-5 mr-2" />
              PLAYERS
            </Button>
          </div>

          {/* Current Character Preview */}
          <button
            onClick={() => setIsCharacterSelectOpen(true)}
            className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-2xl px-4 py-2 transition-all"
          >
            <div
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: currentCharacter.jerseyColor }}
            />
            <div className="text-left">
              <p className="text-white font-bold text-sm">{currentCharacter.name}</p>
              <p className="text-slate-400 text-xs">{currentCharacter.ability.description}</p>
            </div>
          </button>

          {onShowTutorial && (
            <Button
              onClick={onShowTutorial}
              variant="ghost"
              className="text-white/40 hover:text-white/60 font-bold text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              How to Play
            </Button>
          )}
        </motion.div>

        {/* Shop Modal */}
        <Shop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

        {/* Missions Modal */}
        <Missions isOpen={isMissionsOpen} onClose={() => setIsMissionsOpen(false)} />

        {/* Character Select Modal */}
        <CharacterSelect isOpen={isCharacterSelectOpen} onClose={() => setIsCharacterSelectOpen(false)} />

        {/* Mobile hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-white/40 text-sm"
        >
          Tap or press Space to start • Swipe or use arrow keys to play
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
