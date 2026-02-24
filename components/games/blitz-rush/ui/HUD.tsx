'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Zap, Shield, Magnet, Sparkles, Volume2, VolumeX, Pause, Brain, Flame } from 'lucide-react'
import type { IQLevel } from '../hooks/useFootballIQ'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameSnapshot, PopupData } from '../engine/core/EventBus'

interface HUDProps {
  snapshot: GameSnapshot
  popups: PopupData[]
  isFever: boolean
  onPause: () => void
  onMuteToggle: () => boolean
  footballIQ?: number
  iqLevel?: IQLevel
  currentStreak?: number
}

export const GameHUD: React.FC<HUDProps> = ({ snapshot, popups, isFever, onPause, onMuteToggle, footballIQ = 0, iqLevel = 'Rookie', currentStreak = 0 }) => {
  // Use refs for 60fps DOM updates (avoid React re-renders)
  const scoreRef = useRef<HTMLSpanElement>(null)
  const coinsRef = useRef<HTMLSpanElement>(null)
  const distanceRef = useRef<HTMLSpanElement>(null)
  const feverBarRef = useRef<HTMLDivElement>(null)
  const feverBarMobileRef = useRef<HTMLDivElement>(null)
  const comboRef = useRef<HTMLSpanElement>(null)
  const comboContainerRef = useRef<HTMLDivElement>(null)
  const distanceBarRef = useRef<HTMLDivElement>(null)
  const chainContainerRef = useRef<HTMLDivElement>(null)
  const chainTextRef = useRef<HTMLSpanElement>(null)
  const chainTimerBarRef = useRef<HTMLDivElement>(null)
  const chainMultRef = useRef<HTMLSpanElement>(null)
  const feverFlashRef = useRef<HTMLDivElement>(null)
  const prevFeverRef = useRef(false)
  const prevComboRef = useRef(0)

  const [muted, setMuted] = useState(true)

  const handleMuteToggle = useCallback(() => {
    const newMuted = onMuteToggle()
    setMuted(newMuted)
  }, [onMuteToggle])

  // Direct DOM updates for performance
  useEffect(() => {
    const s = snapshot

    if (scoreRef.current) {
      scoreRef.current.textContent = Math.floor(s.score).toString().padStart(6, '0')
    }
    if (coinsRef.current) {
      coinsRef.current.textContent = s.coins.toString()
    }
    if (distanceRef.current) {
      distanceRef.current.textContent = `${Math.floor(s.distance)}m`
    }
    if (distanceBarRef.current) {
      distanceBarRef.current.style.width = `${Math.min(100, (s.distance / 500) * 100)}%`
    }
    if (feverBarRef.current) {
      feverBarRef.current.style.height = `${s.feverMeter}%`
    }
    if (feverBarMobileRef.current) {
      feverBarMobileRef.current.style.width = `${s.feverMeter}%`
    }

    // Combo display
    if (comboRef.current && comboContainerRef.current) {
      if (s.combo > 1) {
        comboRef.current.textContent = s.isFever ? 'FEVER!' : `x${s.multiplier}`
        comboRef.current.style.display = 'inline'
        if (s.combo > prevComboRef.current) {
          comboContainerRef.current.style.transform = 'scale(1.3)'
          comboContainerRef.current.style.transition = 'transform 0.1s ease-out'
          setTimeout(() => {
            if (comboContainerRef.current) {
              comboContainerRef.current.style.transform = 'scale(1)'
              comboContainerRef.current.style.transition = 'transform 0.2s ease-in'
            }
          }, 100)
        }
      } else {
        comboRef.current.style.display = 'none'
      }
      prevComboRef.current = s.combo
    }

    // Near-miss chain
    if (chainContainerRef.current) {
      if (s.nearMissChain >= 2) {
        chainContainerRef.current.style.display = 'flex'
        if (chainTextRef.current) {
          const label = s.nearMissChain >= 8 ? 'UNTOUCHABLE' : s.nearMissChain >= 5 ? 'IN THE ZONE' : 'THREADING IT'
          chainTextRef.current.textContent = `${label} x${s.nearMissChain}`
          chainTextRef.current.style.color = s.nearMissChain >= 8 ? '#60a5fa' : s.nearMissChain >= 5 ? '#f97316' : '#fbbf24'
        }
        if (chainTimerBarRef.current) {
          chainTimerBarRef.current.style.width = `${(s.nearMissChainTimer / 3) * 100}%`
          chainTimerBarRef.current.style.backgroundColor = s.nearMissChain >= 8 ? '#60a5fa' : s.nearMissChain >= 5 ? '#f97316' : '#fbbf24'
        }
        if (chainMultRef.current) {
          chainMultRef.current.textContent = `${s.nearMissMultiplier.toFixed(1)}x`
        }
      } else {
        chainContainerRef.current.style.display = 'none'
      }
    }

    // Fever flash
    if (s.isFever && !prevFeverRef.current && feverFlashRef.current) {
      feverFlashRef.current.style.opacity = '0.6'
      setTimeout(() => {
        if (feverFlashRef.current) feverFlashRef.current.style.opacity = '0'
      }, 150)
    }
    prevFeverRef.current = s.isFever
  }, [snapshot])

  const PowerupIcon = ({ type }: { type: string }) => {
    const iconClass = 'w-full h-full'
    switch (type) {
      case 'magnet': return <Magnet className={`${iconClass} text-blue-400`} />
      case 'shield': return <Shield className={`${iconClass} text-cyan-400`} />
      case 'speed': return <Zap className={`${iconClass} text-yellow-400`} />
      case 'multiplier': return <Sparkles className={`${iconClass} text-purple-400`} />
      default: return <Zap className={`${iconClass} text-white`} />
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {/* Fever Flash */}
      <div
        ref={feverFlashRef}
        className="absolute inset-0 bg-white pointer-events-none z-20"
        style={{ opacity: 0, transition: 'opacity 0.15s ease-out' }}
      />

      {/* Fever Vignette */}
      <AnimatePresence>
        {isFever && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-[radial-gradient(circle,transparent_40%,rgba(234,179,8,0.2)_100%)] mix-blend-overlay"
            style={{ animation: 'feverPulse 1s infinite alternate ease-in-out' }}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-3 md:p-4 z-10">
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full gap-2">
          {/* Score */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_10px_rgba(251,191,36,0.5)] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-black text-lg sm:text-xl md:text-2xl">20</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-lg md:text-2xl font-black italic text-white drop-shadow-lg">RUN</span>
                <div ref={comboContainerRef} className="inline-block">
                  <span
                    ref={comboRef}
                    className="text-[10px] sm:text-xs font-bold text-yellow-400 bg-black/60 px-1.5 sm:px-2 py-0.5 rounded border border-yellow-400/30 transition-all duration-150 whitespace-nowrap"
                    style={{ display: 'none' }}
                  >
                    x1
                  </span>
                </div>
              </div>
              <span ref={scoreRef} className="text-sm sm:text-base md:text-lg font-bold font-mono drop-shadow-md text-blue-400">000000</span>
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-black/40 backdrop-blur-md px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] flex items-center justify-center">
              <span className="text-yellow-900 font-black text-xs sm:text-sm">$</span>
            </div>
            <span ref={coinsRef} className="text-base sm:text-lg md:text-2xl font-black text-yellow-400 italic">0</span>
          </div>

          {/* Pause */}
          <button
            onClick={onPause}
            className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Mute */}
          <button
            onClick={handleMuteToggle}
            className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
          </button>

          {/* Football IQ Badge */}
          {footballIQ > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-indigo-500/20 backdrop-blur-md px-2 py-1 rounded-lg border border-indigo-500/20">
              <Brain className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-bold">{footballIQ}</span>
            </div>
          )}

          {/* Streak */}
          {currentStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-orange-500/20 backdrop-blur-md px-2 py-1 rounded-lg border border-orange-500/20">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 text-[10px] font-bold">{currentStreak}</span>
            </div>
          )}
        </div>

        {/* Fever Bar — Mobile */}
        <div className="sm:hidden absolute bottom-16 left-1/2 -translate-x-1/2 w-[70%] flex flex-col items-center gap-1">
          <AnimatePresence>
            {isFever && (
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="text-orange-500 font-black italic tracking-wider text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse">
                FEVER MODE!
              </motion.span>
            )}
          </AnimatePresence>
          <div className="w-full h-2.5 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
            <div ref={feverBarMobileRef} className="absolute left-0 top-0 h-full bg-blue-500/50 transition-all duration-100" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Fever Bar — Desktop */}
        <div className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-2 md:gap-4">
          <AnimatePresence>
            {isFever && (
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="[writing-mode:vertical-rl] rotate-180 text-orange-500 font-black italic tracking-widest text-sm md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse">
                FEVER!
              </motion.span>
            )}
          </AnimatePresence>
          <div className="w-3 md:w-4 h-40 md:h-64 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
            <div ref={feverBarRef} className="absolute bottom-0 w-full bg-blue-500/50 transition-all duration-100" style={{ height: '0%' }} />
          </div>
        </div>

        {/* Near-Miss Chain */}
        <div
          ref={chainContainerRef}
          className="absolute left-1/2 sm:left-16 md:left-20 top-1/3 -translate-x-1/2 sm:translate-x-0 flex flex-col items-center gap-1 pointer-events-none"
          style={{ display: 'none' }}
        >
          <span ref={chainTextRef} className="text-sm sm:text-base md:text-lg font-black italic tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ color: '#fbbf24' }}>NEAR MISS!</span>
          <span ref={chainMultRef} className="text-xs sm:text-sm font-bold text-white/80">1.0x</span>
          <div className="w-16 sm:w-20 h-1 bg-black/40 rounded-full overflow-hidden">
            <div ref={chainTimerBarRef} className="h-full rounded-full transition-all duration-100" style={{ width: '100%', backgroundColor: '#fbbf24' }} />
          </div>
        </div>

        {/* Distance Bar */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[85%] sm:w-64 md:w-96 flex flex-col gap-0.5 sm:gap-1 shadow-lg pointer-events-auto">
          <div className="flex justify-between text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider drop-shadow-md px-1">
            <span>Distance</span>
            <span ref={distanceRef}>0m</span>
          </div>
          <div className="h-2.5 sm:h-3 md:h-4 bg-black/60 rounded-full border border-white/20 overflow-hidden backdrop-blur">
            <div ref={distanceBarRef} className="h-full bg-gradient-to-r from-green-500 to-green-400 border-r-2 border-white/50 transition-all duration-100" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Active Powerup Indicator */}
        <AnimatePresence>
          {snapshot.activePowerupType && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute top-14 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                <PowerupIcon type={snapshot.activePowerupType} />
              </div>
              <div className="w-16 sm:w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-100"
                  style={{ width: `${snapshot.activePowerupProgress * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Popups */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {popups.map((popup) => {
              const rotation = ((popup.id % 20) - 10)
              return (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, y: -60, scale: 1, rotate: rotation }}
                  exit={{ opacity: 0, scale: 1.5, y: -150 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]
                    ${popup.type === 'score' ? 'text-blue-400' : ''}
                    ${popup.type === 'coin' ? 'text-yellow-400' : ''}
                    ${popup.type === 'juke' ? 'text-orange-500' : ''}
                    ${popup.type === 'powerup' ? 'text-purple-400' : ''}
                  `}>
                    {popup.text}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes feverPulse {
          from { opacity: 0.3; }
          to { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
