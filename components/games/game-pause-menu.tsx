'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Settings, Pause, Play, RotateCcw, Home, Volume2, VolumeX, HelpCircle } from 'lucide-react'
import { useGameSound } from '@/hooks/use-game-sound'
import { usePlayer } from '@/components/providers/player-provider'
import { cn } from '@/shared/utils'
import Link from 'next/link'

interface GamePauseMenuProps {
    onResume: () => void
    onRestart: () => void
    gameTitle: string
    className?: string
}

export function GamePauseMenu({ onResume, onRestart, gameTitle, className }: GamePauseMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { isMuted, toggleMute } = useGameSound()
    const { isPlaying, togglePlay } = usePlayer()

    const handleOpen = () => {
        setIsOpen(true)
        // Ideally we would pause the game loop here, but that requires lifting state up further
        // For now, this is a visual overlay that users can use to access settings
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className={cn("absolute top-4 right-4 z-50 text-white hover:bg-white/10", className)}
                onClick={handleOpen}
            >
                <Settings className="w-6 h-6" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-heading text-white uppercase tracking-wider">Paused</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                    <Play className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => {
                                        setIsOpen(false)
                                        onResume()
                                    }}
                                    className="w-full bg-white text-black hover:bg-gray-200 font-bold text-lg h-12"
                                >
                                    <Play className="mr-2 w-5 h-5" /> Resume Game
                                </Button>

                                <Button
                                    onClick={() => {
                                        setIsOpen(false)
                                        onRestart()
                                    }}
                                    variant="outline"
                                    className="w-full border-white/20 text-white hover:bg-white/10 font-bold text-lg h-12"
                                >
                                    <RotateCcw className="mr-2 w-5 h-5" /> Restart
                                </Button>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={toggleMute}
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        {isMuted ? <VolumeX className="mr-2 w-4 h-4" /> : <Volume2 className="mr-2 w-4 h-4" />}
                                        SFX
                                    </Button>
                                    <Button
                                        onClick={togglePlay}
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        {isPlaying ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                                        Music
                                    </Button>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <Button asChild variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/5">
                                        <Link href="/">
                                            <Home className="mr-2 w-4 h-4" /> Exit to HQ
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
