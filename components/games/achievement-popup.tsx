'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/shared/utils'

export interface Achievement {
    id: string
    name: string
    description: string
    points: number
    icon?: any
}

interface AchievementPopupProps {
    achievement: Achievement | null
    onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(onClose, 4000)
            return () => clearTimeout(timer)
        }
    }, [achievement, onClose])

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-[2px] rounded-xl shadow-2xl">
                        <div className="bg-black/90 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 min-w-[300px] border border-white/10">
                            <div className="bg-yellow-500/20 p-3 rounded-full">
                                <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                            </div>
                            <div className="flex-1">
                                <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">Achievement Unlocked!</p>
                                <h3 className="text-white font-bold text-lg leading-none mb-1">{achievement.name}</h3>
                                <p className="text-white/60 text-xs">{achievement.description}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between h-full gap-2">
                                <button onClick={onClose} className="text-white/40 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                                <span className="text-yellow-400 font-bold text-sm">+{achievement.points} pts</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
