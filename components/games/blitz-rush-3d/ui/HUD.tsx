'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '../hooks/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const GameHUD = () => {
  const {
    phase,
    score,
    coins,
    combo,
    multiplier,
    activePowerup,
    distance,
    isFever,
    feverMeter,
    popups,
  } = useGameStore();

  const powerupIcons: Record<string, string> = {
    magnet: '/images/blitz-rush/icon-magnet.png',
    shield: '/images/blitz-rush/icon-shield.png',
    speed: '/images/blitz-rush/icon-speed.png',
    multiplier: '/images/blitz-rush/icon-multiplier.png',
  };

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

      <div className="relative w-full h-full flex flex-col justify-between p-4 z-10">
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
                  <motion.span
                    key={combo}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className={`text-xs font-bold ${isFever ? 'text-white bg-orange-600' : 'text-yellow-400 bg-black/60'} px-2 py-0.5 rounded border border-yellow-400/30 transition-colors`}
                  >
                    {isFever ? 'FEVER MODE' : `COMBO x${multiplier}`}
                  </motion.span>
                )}
              </div>
              <motion.span
                key={Math.floor(score)}
                initial={{ scale: 1.2, color: '#60a5fa' }}
                animate={{ scale: 1, color: isFever ? '#fbbf24' : '#60a5fa' }}
                className="text-lg font-bold font-mono drop-shadow-md"
              >
                {Math.floor(score).toString().padStart(6, '0')}
              </motion.span>
            </div>
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
        </div>

        {/* Fever Bar (Left) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <AnimatePresence>
            {isFever && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="[writing-mode:vertical-rl] rotate-180 text-orange-500 font-black italic tracking-widest text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse"
              >
                FEVER!
              </motion.span>
            )}
          </AnimatePresence>
          <div className="w-4 h-64 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
            <motion.div
              className={`absolute bottom-0 w-full ${isFever ? 'bg-gradient-to-t from-orange-600 to-yellow-400' : 'bg-blue-500/50'}`}
              initial={{ height: 0 }}
              animate={{ height: `${feverMeter}%` }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {isFever && (
                <div className="absolute top-0 left-0 w-full h-full bg-white animate-pulse opacity-30" />
              )}
            </motion.div>
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
              className={`h-full ${isFever ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : 'bg-gradient-to-r from-green-500 to-green-400'} border-r-2 border-white/50 transition-all duration-300`}
              style={{ width: `${Math.min(100, (distance / 500) * 100)}%` }}
            />
          </div>
        </div>

        {/* Floating Popups */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {popups.map((popup) => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -20 }}
                animate={{
                  opacity: 1,
                  y: -100,
                  scale: 1.2,
                  rotate: Math.random() * 20 - 10
                }}
                exit={{ opacity: 0, scale: 1.5, y: -200 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className={`
                  text-4xl font-black italic tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]
                  ${popup.type === 'score' ? 'text-blue-400' : ''}
                  ${popup.type === 'coin' ? 'text-yellow-400' : ''}
                  ${popup.type === 'juke' ? 'text-orange-500' : ''}
                  ${popup.type === 'powerup' ? 'text-purple-400' : ''}
                `}>
                  {popup.text}
                </div>
              </motion.div>
            ))}
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
