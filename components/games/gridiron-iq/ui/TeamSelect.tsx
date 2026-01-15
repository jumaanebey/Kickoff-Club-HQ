'use client'

import { motion } from 'framer-motion'
import { useGameStore, NFL_TEAMS } from '../hooks/useGameStore'
import { Shirt } from 'lucide-react'

export function TeamSelect() {
  const { phase, selectTeam } = useGameStore()

  if (phase !== 'team-select') return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <Shirt className="w-12 h-12 text-white/60 mx-auto mb-2" />
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          PICK YOUR TEAM
        </h2>
        <p className="text-white/50 text-sm mt-1">Choose who you're playing as</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl"
      >
        {NFL_TEAMS.map((team, index) => (
          <motion.button
            key={team.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => selectTeam(team.id)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-white/30 transition-all group"
            style={{
              background: `linear-gradient(135deg, ${team.color}40 0%, ${team.color}20 100%)`
            }}
          >
            {/* Team logo placeholder (jersey color) */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-4 group-hover:scale-110 transition-transform shadow-lg"
              style={{
                backgroundColor: team.color,
                borderColor: team.secondary
              }}
            >
              <span className="text-white font-black text-lg">
                {team.name.substring(0, 2).toUpperCase()}
              </span>
            </div>

            <span className="text-white font-bold text-sm group-hover:text-white/100 text-white/80">
              {team.name}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-white/30 text-xs"
      >
        Team colors are for display only - all teams play the same
      </motion.p>
    </motion.div>
  )
}
