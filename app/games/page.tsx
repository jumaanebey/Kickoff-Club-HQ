'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Gamepad2, Flag, Brain, Move, PenTool, Hand, Clock } from 'lucide-react'

const games = [
    {
        id: 'guess-the-penalty',
        title: 'Guess the Penalty',
        description: 'Watch the clip. Make the call. Are you ready for the big leagues?',
        icon: Flag,
        status: 'live',
        link: '/games/guess-the-penalty',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20'
    },
    {
        id: 'play-caller',
        title: 'Play Caller',
        description: 'Run, Pass, or Kick? Learn the basics of calling plays.',
        icon: Brain,
        status: 'live',
        link: '/games/play-caller',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    },
    {
        id: 'formation-frenzy',
        title: 'Formation Frenzy',
        description: 'Who is the Quarterback? Learn the player positions.',
        icon: Move,
        status: 'live',
        link: '/games/formation-frenzy',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
    },
    {
        id: 'route-runner',
        title: 'Route Runner',
        description: 'Slant, Post, or Fly? Learn the basic routes.',
        icon: PenTool,
        status: 'live',
        link: '/games/route-runner',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
    },
    {
        id: 'signal-caller',
        title: 'Signal Caller',
        description: 'Touchdown or Timeout? Learn the referee signals.',
        icon: Hand,
        status: 'live',
        link: '/games/signal-caller',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
    },
    {
        id: 'clock-manager',
        title: 'Game Flow',
        description: 'Kickoff, Halftime, and Overtime. Learn how the game works.',
        icon: Clock,
        status: 'live',
        link: '/games/clock-manager',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20'
    }
]

export default function GamesHubPage() {
    const { colors } = useTheme()

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

            <main className="flex-grow container px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-6 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-4 py-1.5 text-sm uppercase tracking-wider inline-flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        Arcade
                    </Badge>
                    <h1 className={cn("text-5xl md:text-7xl font-black mb-6 tracking-tight font-heading uppercase", colors.text)}>
                        Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Grounds</span>
                    </h1>
                    <p className={cn("text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto", colors.textMuted)}>
                        Sharpen your football IQ with interactive drills and challenges.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                >
                    {games.map((game) => {
                        const Icon = game.icon
                        return (
                            <motion.div key={game.id} variants={itemVariants}>
                                <div className={cn(
                                    "h-full rounded-3xl border-2 p-8 transition-all relative overflow-hidden group",
                                    colors.card,
                                    game.status === 'live' ? "hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : "opacity-70 grayscale-[0.5]",
                                    game.borderColor
                                )}>
                                    {/* Background Glow */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 transition-opacity",
                                        game.bgColor,
                                        "opacity-0 group-hover:opacity-100"
                                    )} />

                                    <div className="flex justify-between items-start mb-6">
                                        <div className={cn("p-3 rounded-2xl", game.bgColor, game.color)}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        {game.status === 'live' ? (
                                            <Badge className="bg-green-500 text-white border-0">Play Now</Badge>
                                        ) : (
                                            <Badge variant="outline" className={colors.textMuted}>Coming Soon</Badge>
                                        )}
                                    </div>

                                    <h3 className={cn("text-2xl font-black mb-3 font-heading uppercase", colors.text)}>
                                        {game.title}
                                    </h3>
                                    <p className={cn("text-lg mb-8 leading-relaxed", colors.textMuted)}>
                                        {game.description}
                                    </p>

                                    {game.status === 'live' && (
                                        <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg h-12 rounded-xl shadow-lg shadow-orange-500/20">
                                            <Link href={game.link!}>
                                                Start Game
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
