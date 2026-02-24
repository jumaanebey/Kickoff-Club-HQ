'use client'

import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface PauseScreenProps {
  onResume: () => void
  onRestart: () => void
  onMuteToggle: () => boolean
}

export function PauseScreen({ onResume, onRestart, onMuteToggle }: PauseScreenProps) {
  const [muted, setMuted] = useState(true)

  const handleMuteToggle = () => {
    const newMuted = onMuteToggle()
    setMuted(newMuted)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter">
          Paused
        </h2>

        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={onResume}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-lg py-4 rounded-xl shadow-[0_4px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-black" /> RESUME
          </button>

          <button
            onClick={onRestart}
            className="border-2 border-white/20 hover:bg-white/10 text-white font-bold text-base py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> RESTART
          </button>

          <button
            onClick={handleMuteToggle}
            className="border-2 border-white/10 hover:bg-white/10 text-white/60 font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {muted ? 'UNMUTE' : 'MUTE'}
          </button>
        </div>

        <p className="text-white/30 text-xs">Press ESC or P to resume</p>
      </motion.div>
    </motion.div>
  )
}
