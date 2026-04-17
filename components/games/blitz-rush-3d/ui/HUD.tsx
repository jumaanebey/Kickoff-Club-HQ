'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '../hooks/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Zap } from 'lucide-react';

export const GameHUD = () => {
  const {
    phase,
    score,
    coins,
    combo,
    multiplier,
    comboTimer,
    activePowerup,
    distance,
    difficulty,
    pauseGame,
  } = useGameStore();

  // Combo timer progress (3000ms max)
  const comboProgress = combo > 0 ? comboTimer / 3000 : 0;

  // Difficulty level display
  const difficultyLevel = Math.min(Math.floor(difficulty), 10);
  const difficultyColor = difficultyLevel >= 8 ? 'text-red-400' : difficultyLevel >= 5 ? 'text-orange-400' : difficultyLevel >= 3 ? 'text-yellow-400' : 'text-green-400';

  const powerupIcons: Record<string, string> = {
    magnet: '/images/blitz-rush/icon-magnet.png',
    shield: '/images/blitz-rush/icon-shield.png',
    speed: '/images/blitz-rush/icon-speed.png',
    multiplier: '/images/blitz-rush/icon-multiplier.png',
  };

  if (phase !== 'playing') return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Character Portrait & Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-slate-800 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            <Image
              src="/images/blitz-rush/skins/mascot-hero-portrait.png"
              alt="Mascot Hero"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black italic text-white drop-shadow-lg">
                RUN
              </span>
              {combo > 1 && (
                <div className="relative">
                  <span className="text-xs font-bold text-yellow-400 bg-black/60 px-2 py-0.5 rounded border border-yellow-400/30">
                    COMBO x{multiplier}
                  </span>
                  {/* Combo timer bar */}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-400"
                      initial={{ width: '100%' }}
                      animate={{ width: `${comboProgress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <motion.span
              key={Math.floor(score)}
              initial={{ scale: 1.2, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#60a5fa' }}
              className="text-lg font-bold font-mono drop-shadow-md"
            >
              {Math.floor(score).toString().padStart(6, '0')}
            </motion.span>
          </div>
        </div>

        {/* Right side - Coins, Difficulty, Pause */}
        <div className="flex items-center gap-3">
          {/* Difficulty Level */}
          <div className={`flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 ${difficultyColor}`}>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold">Lv.{difficultyLevel}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10 shadow-xl">
            <div className="relative w-8 h-8">
              <Image
                src="/images/blitz-rush/icon-coin.png"
                alt="Coin"
                fill
                className="object-contain drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]"
              />
            </div>
            <motion.span
              key={coins}
              initial={{ scale: 1.5, color: '#fff' }}
              animate={{ scale: 1, color: '#fbbf24' }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="text-2xl font-black text-yellow-400 italic"
            >
              {coins}
            </motion.span>
          </div>

          {/* Pause Button */}
          <button
            onClick={pauseGame}
            className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Distance Progress (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 md:w-96 flex flex-col gap-1 shadow-lg pointer-events-auto">
        <div className="flex justify-between text-white text-xs font-bold uppercase tracking-wider drop-shadow-md px-1">
          <span>Distance</span>
          <span>{Math.floor(distance)}m</span>
        </div>
        <div className="h-4 bg-black/60 rounded-full border border-white/20 overflow-hidden backdrop-blur">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 border-r-2 border-white/50"
            style={{ width: `${Math.min(100, (distance / 500) * 100)}%`, transition: 'width 0.2s linear' }}
          />
        </div>
      </div>

      {/* Active Powerup */}
      <AnimatePresence>
        {activePowerup && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="absolute top-20 right-4 flex flex-col gap-2"
          >
            <div className="w-16 h-16 relative bg-white/10 backdrop-blur-md rounded-2xl p-2 border-2 border-white/20 overflow-hidden">
              <Image
                src={powerupIcons[activePowerup.type] || '/images/blitz-rush/icon-coin.png'}
                alt={activePowerup.type}
                fill
                className="object-contain p-2"
              />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 * (1 - activePowerup.timeRemaining / activePowerup.duration)}
                  className="text-yellow-400 opacity-50"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
