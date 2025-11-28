'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpCircle } from 'lucide-react'

interface LevelUpEffectProps {
    isVisible: boolean
    onComplete: () => void
}

export function LevelUpEffect({ isVisible, onComplete }: LevelUpEffectProps) {
    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        {/* Burst effect */}
                        <motion.div
                            className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 0.8, repeat: 0 }}
                        />

                        <div className="bg-yellow-500 text-slate-900 font-black text-2xl px-6 py-3 rounded-full shadow-lg border-4 border-yellow-300 flex items-center gap-2 transform -rotate-6">
                            <ArrowUpCircle className="w-8 h-8" />
                            LEVEL UP!
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
