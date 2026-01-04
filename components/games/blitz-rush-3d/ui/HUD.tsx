'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Shield, Magnet, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../hooks/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';

// Optimized HUD that updates display values at lower frequency
export const GameHUD = () => {
  // Only subscribe to values that don't change every frame
  const phase = useGameStore(state => state.phase);
  const activePowerup = useGameStore(state => state.activePowerup);
  const popups = useGameStore(state => state.popups);

  // Use refs for frequently-updating values to avoid re-renders
  const scoreRef = useRef<HTMLSpanElement>(null);
  const coinsRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const feverBarRef = useRef<HTMLDivElement>(null);
  const feverBarMobileRef = useRef<HTMLDivElement>(null);
  const comboRef = useRef<HTMLSpanElement>(null);
  const distanceBarRef = useRef<HTMLDivElement>(null);

  // Track values in refs
  const lastUpdateRef = useRef(0);
  const valuesRef = useRef({ score: 0, coins: 0, distance: 0, feverMeter: 0, combo: 0, multiplier: 1, isFever: false });

  const { toggleMute, isMuted } = useAudio();
  const [muted, setMuted] = useState(true); // Start muted

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  // Update DOM directly at throttled rate (skip React re-renders)
  useEffect(() => {
    if (phase !== 'playing') return;

    let animationId: number;

    const updateDisplay = () => {
      const now = performance.now();
      // Update at ~20fps instead of 60fps
      if (now - lastUpdateRef.current > 50) {
        const state = useGameStore.getState();
        valuesRef.current = {
          score: state.score,
          coins: state.coins,
          distance: state.distance,
          feverMeter: state.feverMeter,
          combo: state.combo,
          multiplier: state.multiplier,
          isFever: state.isFever,
        };

        // Update DOM directly
        if (scoreRef.current) {
          scoreRef.current.textContent = Math.floor(valuesRef.current.score).toString().padStart(6, '0');
        }
        if (coinsRef.current) {
          coinsRef.current.textContent = valuesRef.current.coins.toString();
        }
        if (distanceRef.current) {
          distanceRef.current.textContent = `${Math.floor(valuesRef.current.distance)}m`;
        }
        if (distanceBarRef.current) {
          distanceBarRef.current.style.width = `${Math.min(100, (valuesRef.current.distance / 500) * 100)}%`;
        }
        if (feverBarRef.current) {
          feverBarRef.current.style.height = `${valuesRef.current.feverMeter}%`;
        }
        if (feverBarMobileRef.current) {
          feverBarMobileRef.current.style.width = `${valuesRef.current.feverMeter}%`;
        }
        if (comboRef.current) {
          if (valuesRef.current.combo > 1) {
            comboRef.current.textContent = valuesRef.current.isFever ? 'FEVER!' : `x${valuesRef.current.multiplier}`;
            comboRef.current.style.display = 'inline';
          } else {
            comboRef.current.style.display = 'none';
          }
        }

        lastUpdateRef.current = now;
      }

      animationId = requestAnimationFrame(updateDisplay);
    };

    animationId = requestAnimationFrame(updateDisplay);
    return () => cancelAnimationFrame(animationId);
  }, [phase]);

  const PowerupIcon = ({ type }: { type: string }) => {
    const iconClass = "w-full h-full"
    switch (type) {
      case 'magnet': return <Magnet className={`${iconClass} text-blue-400`} />
      case 'shield': return <Shield className={`${iconClass} text-cyan-400`} />
      case 'speed': return <Zap className={`${iconClass} text-yellow-400`} />
      case 'multiplier': return <Sparkles className={`${iconClass} text-purple-400`} />
      default: return <Zap className={`${iconClass} text-white`} />
    }
  }

  if (phase !== 'playing') return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {/* Fever Vignette Overlay */}
      <AnimatePresence>
        {isFever && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-[radial-gradient(circle,transparent_40%,rgba(234,179,8,0.2)_100%)] mix-blend-overlay"
            style={{
              animation: 'feverPulse 1s infinite alternate ease-in-out'
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-3 md:p-4 z-10">
        {/* Top Bar - Responsive layout */}
        <div className="flex justify-between items-start w-full gap-2">
          {/* Character Portrait & Info - Compact on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Portrait - smaller on mobile */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_10px_rgba(251,191,36,0.5)] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-black text-lg sm:text-xl md:text-2xl">20</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-lg md:text-2xl font-black italic text-white drop-shadow-lg">
                  RUN
                </span>
                <span
                  ref={comboRef}
                  className="text-[10px] sm:text-xs font-bold text-yellow-400 bg-black/60 px-1.5 sm:px-2 py-0.5 rounded border border-yellow-400/30 transition-colors whitespace-nowrap"
                  style={{ display: 'none' }}
                >
                  x1
                </span>
              </div>
              <span
                ref={scoreRef}
                className="text-sm sm:text-base md:text-lg font-bold font-mono drop-shadow-md text-blue-400"
              >
                000000
              </span>
            </div>
          </div>

          {/* Coins - Compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-black/40 backdrop-blur-md px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] flex items-center justify-center">
              <span className="text-yellow-900 font-black text-xs sm:text-sm">$</span>
            </div>
            <span
              ref={coinsRef}
              className="text-base sm:text-lg md:text-2xl font-black text-yellow-400 italic"
            >
              0
            </span>
          </div>

          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
        </div>

        {/* Fever Bar - Horizontal on mobile, vertical on desktop */}
        {/* Mobile: Bottom horizontal bar */}
        <div className="sm:hidden absolute bottom-16 left-1/2 -translate-x-1/2 w-[70%] flex flex-col items-center gap-1">
          <AnimatePresence>
            {isFever && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-orange-500 font-black italic tracking-wider text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse"
              >
                FEVER MODE!
              </motion.span>
            )}
          </AnimatePresence>
          <div className="w-full h-2.5 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
            <div
              ref={feverBarMobileRef}
              className="absolute left-0 top-0 h-full bg-blue-500/50 transition-all duration-100"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Desktop: Left vertical bar */}
        <div className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-2 md:gap-4">
          <AnimatePresence>
            {isFever && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="[writing-mode:vertical-rl] rotate-180 text-orange-500 font-black italic tracking-widest text-sm md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse"
              >
                FEVER!
              </motion.span>
            )}
          </AnimatePresence>
          <div className="w-3 md:w-4 h-40 md:h-64 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
            <div
              ref={feverBarRef}
              className="absolute bottom-0 w-full bg-blue-500/50 transition-all duration-100"
              style={{ height: '0%' }}
            />
          </div>
        </div>

        {/* Distance Progress (Bottom Center) - Responsive */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[85%] sm:w-64 md:w-96 flex flex-col gap-0.5 sm:gap-1 shadow-lg pointer-events-auto">
          <div className="flex justify-between text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider drop-shadow-md px-1">
            <span>Distance</span>
            <span ref={distanceRef}>0m</span>
          </div>
          <div className="h-2.5 sm:h-3 md:h-4 bg-black/60 rounded-full border border-white/20 overflow-hidden backdrop-blur">
            <div
              ref={distanceBarRef}
              className="h-full bg-gradient-to-r from-green-500 to-green-400 border-r-2 border-white/50 transition-all duration-100"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Active Powerup Indicator - Top center on mobile */}
        <AnimatePresence>
          {activePowerup && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute top-14 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                <PowerupIcon type={activePowerup.type} />
              </div>
              <div className="w-16 sm:w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(activePowerup.timeRemaining / activePowerup.duration) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Popups - Responsive size */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {popups.map((popup) => {
              // Use popup.id to generate consistent rotation per popup
              const rotation = ((popup.id % 20) - 10);
              return (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -20 }}
                  animate={{
                    opacity: 1,
                    y: -60,
                    scale: 1,
                    rotate: rotation
                  }}
                  exit={{ opacity: 0, scale: 1.5, y: -150 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className={`
                    text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]
                    ${popup.type === 'score' ? 'text-blue-400' : ''}
                    ${popup.type === 'coin' ? 'text-yellow-400' : ''}
                    ${popup.type === 'juke' ? 'text-orange-500' : ''}
                    ${popup.type === 'powerup' ? 'text-purple-400' : ''}
                  `}>
                    {popup.text}
                  </div>
                </motion.div>
              );
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
  );
};
