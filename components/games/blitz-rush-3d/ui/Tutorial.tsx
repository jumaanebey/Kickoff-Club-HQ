'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X, ArrowUp, ArrowDown, ArrowLeftRight, Coins, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TutorialProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Blitz Rush 3D!',
    description: 'Dodge obstacles, collect coins, and run as far as you can!',
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
    visual: null,
  },
  {
    title: 'Swipe Left & Right',
    description: 'Swipe horizontally or press A/D to switch lanes and dodge obstacles.',
    icon: <ArrowLeftRight className="w-12 h-12 text-blue-400" />,
    visual: (
      <div className="flex items-center gap-4 mt-4">
        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600">
          <span className="text-2xl font-bold text-slate-400">A</span>
        </div>
        <span className="text-slate-500">or swipe</span>
        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600">
          <span className="text-2xl font-bold text-slate-400">D</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Jump Over Hurdles',
    description: 'Swipe up, tap, or press Space to jump over low obstacles.',
    icon: <ArrowUp className="w-12 h-12 text-green-400" />,
    visual: (
      <div className="flex items-center gap-4 mt-4">
        <div className="px-8 py-4 bg-slate-700 rounded-xl border-2 border-slate-600">
          <span className="text-lg font-bold text-slate-400">SPACE</span>
        </div>
        <span className="text-slate-500">or swipe up</span>
      </div>
    ),
  },
  {
    title: 'Slide Under Defenders',
    description: 'Swipe down or press S to slide under tall obstacles.',
    icon: <ArrowDown className="w-12 h-12 text-orange-400" />,
    visual: (
      <div className="flex items-center gap-4 mt-4">
        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600">
          <span className="text-2xl font-bold text-slate-400">S</span>
        </div>
        <span className="text-slate-500">or swipe down</span>
      </div>
    ),
  },
  {
    title: 'Collect Powerups',
    description: 'Grab shields for protection, magnets for coins, and boosters for speed!',
    icon: <Shield className="w-12 h-12 text-purple-400" />,
    visual: (
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="text-center">
          <div className="text-3xl mb-1">🛡️</div>
          <span className="text-xs text-slate-500">Shield</span>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">🧲</div>
          <span className="text-xs text-slate-500">Magnet</span>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">⚡</div>
          <span className="text-xs text-slate-500">Speed</span>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">✨</div>
          <span className="text-xs text-slate-500">2x Score</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Earn Coins',
    description: 'Collect coins to buy upgrades and head starts in the shop!',
    icon: <Coins className="w-12 h-12 text-yellow-400" />,
    visual: (
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="text-center">
          <div className="text-4xl mb-1">🪙</div>
          <span className="text-xs text-slate-500">+1 Coin</span>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-1">💰</div>
          <span className="text-xs text-slate-500">+5 Coins</span>
        </div>
      </div>
    ),
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1
  const step = TUTORIAL_STEPS[currentStep]

  const handleNext = () => {
    if (isLastStep) {
      // Save that user completed tutorial
      localStorage.setItem('blitz_rush_tutorial_complete', 'true')
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('blitz_rush_tutorial_complete', 'true')
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-md overflow-hidden"
      >
        {/* Skip button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={handleSkip}
            className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            Skip Tutorial
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center">
                {step.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-black text-white mb-2">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 mb-4">
                {step.description}
              </p>

              {/* Visual */}
              {step.visual && (
                <div className="flex justify-center">
                  {step.visual}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pb-4">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? 'bg-yellow-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 p-4 pt-0">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 border-slate-700 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
          >
            {isLastStep ? "Let's Play!" : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Hook to check if tutorial should be shown
export function useShouldShowTutorial(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('blitz_rush_tutorial_complete') !== 'true'
}
