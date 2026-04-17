'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

interface FlashEffect {
  id: number
  color: string
  opacity: number
}

interface ComboPopup {
  id: number
  combo: number
  multiplier: number
}

// Global effect triggers (can be called from anywhere)
let flashCallback: ((color: string, opacity: number) => void) | null = null
let comboCallback: ((combo: number, multiplier: number) => void) | null = null

export function triggerFlash(color: string = '#ffffff', opacity: number = 0.6): void {
  flashCallback?.(color, opacity)
}

export function triggerComboPopup(combo: number, multiplier: number): void {
  comboCallback?.(combo, multiplier)
}

export function ScreenEffectsOverlay() {
  const [flashes, setFlashes] = useState<FlashEffect[]>([])
  const [comboPopups, setComboPopups] = useState<ComboPopup[]>([])
  const { phase } = useGameStore()
  let idCounter = 0

  // Register callbacks
  useEffect(() => {
    flashCallback = (color: string, opacity: number) => {
      const id = Date.now() + Math.random()
      setFlashes(prev => [...prev, { id, color, opacity }])
      setTimeout(() => {
        setFlashes(prev => prev.filter(f => f.id !== id))
      }, 150)
    }

    comboCallback = (combo: number, multiplier: number) => {
      const id = Date.now() + Math.random()
      setComboPopups(prev => [...prev, { id, combo, multiplier }])
      setTimeout(() => {
        setComboPopups(prev => prev.filter(c => c.id !== id))
      }, 1500)
    }

    return () => {
      flashCallback = null
      comboCallback = null
    }
  }, [])

  // Clear effects on game phase change
  useEffect(() => {
    if (phase === 'menu') {
      setFlashes([])
      setComboPopups([])
    }
  }, [phase])

  return (
    <>
      {/* Screen Flash Effects */}
      <AnimatePresence>
        {flashes.map(flash => (
          <motion.div
            key={flash.id}
            initial={{ opacity: flash.opacity }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 pointer-events-none z-30"
            style={{ backgroundColor: flash.color }}
          />
        ))}
      </AnimatePresence>

      {/* Combo Milestone Popups */}
      <AnimatePresence>
        {comboPopups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: -30, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
              >
                {popup.combo}x
              </motion.div>
              <div className="text-xl font-bold text-white/80 uppercase tracking-widest mt-1">
                {popup.multiplier === 3 ? 'FEVER!' : popup.multiplier === 2 ? 'ON FIRE!' : 'COMBO!'}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Danger Vignette (when hit) */}
      {phase === 'reviving' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(220, 38, 38, 0.4) 100%)',
          }}
        />
      )}
    </>
  )
}

// Near-miss popup component
export function NearMissPopup({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 800)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 12 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
        >
          <div className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.6)]">
            <span className="text-2xl font-black text-white uppercase tracking-wide">
              CLOSE!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
