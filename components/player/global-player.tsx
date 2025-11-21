'use client'

import { usePlayer } from '@/components/providers/player-provider'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function GlobalPlayer() {
    const { currentTrack, isPlaying, togglePlay, pause } = usePlayer()
    const { colors } = useTheme()

    if (!currentTrack) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl p-4 shadow-2xl",
                    colors.bgSecondary,
                    colors.cardBorder
                )}
            >
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                            {currentTrack.image ? (
                                <Image
                                    src={currentTrack.image}
                                    alt={currentTrack.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white font-bold">
                                    ♫
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h4 className={cn("font-bold truncate", colors.text)}>{currentTrack.title}</h4>
                            <p className={cn("text-xs truncate", colors.textMuted)}>{currentTrack.artist || 'Kickoff Club Podcast'}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <button className={cn("hidden md:block hover:text-orange-500 transition-colors", colors.textMuted)}>
                            <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>

                        <button className={cn("hidden md:block hover:text-orange-500 transition-colors", colors.textMuted)}>
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Volume / Close */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="hidden md:flex items-center gap-2 w-24">
                            <Volume2 className={cn("w-4 h-4", colors.textMuted)} />
                            <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-orange-500" />
                            </div>
                        </div>
                        <button
                            onClick={pause} // Just pause/hide for now, ideally clear track
                            className={cn("p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors", colors.textMuted)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
