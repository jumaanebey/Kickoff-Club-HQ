'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Gamepad2, CheckCircle2, Trophy, Zap, Target, Keyboard } from 'lucide-react'
import { useGameProgress } from '@/hooks/use-game-progress'

const games = [
    {
        id: 'blitz-rush',
        title: 'Blitz Rush',
        description: '🎮 Endless runner! Dodge defenders, collect coins. Arrow keys to play.',
        icon: Zap,
        status: 'live',
        link: '/games/blitz-rush',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/20',
        type: 'arcade'
    },
    {
        id: 'qb-precision',
        title: 'QB Precision',
        description: '🎮 Hit open receivers! WASD to aim, Space to throw. Test your timing.',
        icon: Target,
        status: 'live',
        link: '/games/qb-precision',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/20',
        type: 'arcade'
    }
];

export default function GamesHubPage() {
    const { colors } = useTheme()
    const { progress, isLoaded } = useGameProgress()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100
            }
        }
    }

    return (
        <div className={cn('min-h-screen flex flex-col', colors.bg)}>
            <ThemedHeader activePage="games" />

            <main className="flex-grow container px-4 py-8 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 sm:mb-16"
                >
                    <Badge className="mb-4 sm:mb-6 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2">
                        <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        Arcade
                    </Badge>
                    <h1 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight font-heading uppercase", colors.text)}>
                        Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Grounds</span>
                    </h1>
                    <p className={cn("text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto", colors.textMuted)}>
                        Sharpen your football IQ with interactive drills and challenges.
                    </p>
                    <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                        <Link href="/dashboard">
                            <Button variant="outline" className={cn("gap-2 border-2 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base lg:text-lg", colors.cardBorder, colors.text)}>
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                View Career Stats
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto"
                >
                    {games.map((game) => {
                        const Icon = game.icon
                        const isCompleted = isLoaded && progress[game.id]?.completed

                        return (
                            <motion.div key={game.id} variants={itemVariants}>
                                <div className={cn(
                                    "h-full rounded-2xl sm:rounded-3xl border-2 p-5 sm:p-6 md:p-8 transition-all relative overflow-hidden group",
                                    colors.card,
                                    game.status === 'live' ? "hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : "opacity-70 grayscale-[0.5]",
                                    isCompleted ? "border-green-500/30" : game.borderColor
                                )}>
                                    {/* Background Glow */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-3xl -z-10 transition-opacity",
                                        game.bgColor,
                                        "opacity-0 group-hover:opacity-100"
                                    )} />

                                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                                        <div className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl", game.bgColor, game.color)}>
                                            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:gap-2 items-end">
                                            {game.id === 'blitz-rush' && (
                                                <Badge className="bg-orange-500 text-white border-0 gap-1 pl-1.5 text-[10px] sm:text-xs animate-pulse">
                                                    <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Daily Challenge
                                                </Badge>
                                            )}
                                            {game.type === 'arcade' && (
                                                <Badge className="bg-purple-500 text-white border-0 gap-1 pl-1.5 text-[10px] sm:text-xs">
                                                    <Keyboard className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Keyboard
                                                </Badge>
                                            )}
                                            {isCompleted ? (
                                                <Badge className="bg-green-500 text-white border-0 gap-1 pl-1.5 text-[10px] sm:text-xs">
                                                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Completed
                                                </Badge>
                                            ) : game.status === 'live' ? (
                                                <Badge className="bg-green-500 text-white border-0 text-[10px] sm:text-xs">Play Now</Badge>
                                            ) : (
                                                <Badge variant="outline" className={cn("text-[10px] sm:text-xs", colors.textMuted)}>Coming Soon</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className={cn("text-xl sm:text-2xl font-black mb-2 sm:mb-3 font-heading uppercase", colors.text)}>
                                        {game.title}
                                    </h3>
                                    <p className={cn("text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8 leading-relaxed", colors.textMuted)}>
                                        {game.description}
                                    </p>

                                    {game.status === 'live' && (
                                        <Button asChild className={cn(
                                            "w-full font-bold text-sm sm:text-base md:text-lg h-10 sm:h-12 rounded-lg sm:rounded-xl shadow-lg transition-all",
                                            isCompleted
                                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                                                : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                                        )}>
                                            <Link href={game.link!}>
                                                {isCompleted ? "Play Again" : "Start Game"}
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </main>
        </div>
    )
}
