'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Target, Zap, Coins, Trophy, Play, RotateCcw, Crown, Crosshair } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import { Leaderboard } from './leaderboard'

interface Receiver {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    route: 'slant' | 'post' | 'fly' | 'out'
    isOpen: boolean
}

interface Throw {
    id: string
    x: number
    y: number
    targetX: number
    targetY: number
    progress: number
}

const FIELD_WIDTH = 600
const FIELD_HEIGHT = 400
const QB_X = FIELD_WIDTH / 2
const QB_Y = FIELD_HEIGHT - 50

export function QBPrecisionGame() {
    const { colors } = useTheme()
    const playSound = useGameSound()
    const gameLoopRef = useRef<number>()
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [streak, setStreak] = useState(0)
    const [bestStreak, setBestStreak] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60) // 60 second rounds
    const [receivers, setReceivers] = useState<Receiver[]>([])
    const [throws, setThrows] = useState<Throw[]>([])
    const [aimX, setAimX] = useState(QB_X)
    const [aimY, setAimY] = useState(QB_Y - 100)
    const [highScore, setHighScore] = useState(0)
    const [perfectThrows, setPerfectThrows] = useState(0)

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('qb_precision_high_score')
        if (saved) setHighScore(parseInt(saved))
    }, [])

    // Keyboard controls for aiming
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const handleKeyPress = (e: KeyboardEvent) => {
            const speed = 15

            setAimX(prev => {
                if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
                    return Math.max(50, prev - speed)
                }
                if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
                    return Math.min(FIELD_WIDTH - 50, prev + speed)
                }
                return prev
            })

            setAimY(prev => {
                if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
                    return Math.max(50, prev - speed)
                }
                if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
                    return Math.min(FIELD_HEIGHT - 100, prev + speed)
                }
                return prev
            })

            // Throw ball
            if (e.key === ' ' && throws.length < 3) {
                e.preventDefault()
                const newThrow: Throw = {
                    id: `${Date.now()}`,
                    x: QB_X,
                    y: QB_Y,
                    targetX: aimX,
                    targetY: aimY,
                    progress: 0
                }
                setThrows(prev => [...prev, newThrow])
                playSound('click')
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameStarted, gameOver, aimX, aimY, throws.length, playSound])

    // Spawn receivers
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const spawnInterval = setInterval(() => {
            const routes: Array<'slant' | 'post' | 'fly' | 'out'> = ['slant', 'post', 'fly', 'out']
            const route = routes[Math.floor(Math.random() * routes.length)]

            const startX = Math.random() * (FIELD_WIDTH - 100) + 50
            const startY = 50

            const newReceiver: Receiver = {
                id: `${Date.now()}-${Math.random()}`,
                x: startX,
                y: startY,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2 + 1,
                route,
                isOpen: Math.random() > 0.3 // 70% chance of being open
            }

            setReceivers(prev => [...prev.slice(-4), newReceiver]) // Max 5 receivers
        }, 2000)

        return () => clearInterval(spawnInterval)
    }, [gameStarted, gameOver])

    // Game loop - move receivers and throws
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const gameLoop = () => {
            // Move receivers
            setReceivers(prev => prev.map(rec => {
                let newX = rec.x + rec.vx
                let newY = rec.y + rec.vy
                let newVx = rec.vx
                let newVy = rec.vy

                // Bounce off walls
                if (newX < 50 || newX > FIELD_WIDTH - 50) {
                    newVx = -newVx
                    newX = Math.max(50, Math.min(FIELD_WIDTH - 50, newX))
                }

                // Route patterns
                if (rec.route === 'slant' && rec.y > 150) {
                    newVx = rec.vx > 0 ? 3 : -3
                }
                if (rec.route === 'post' && rec.y > 200) {
                    newVx = newX < FIELD_WIDTH / 2 ? 2 : -2
                }

                return {
                    ...rec,
                    x: newX,
                    y: Math.min(newY, FIELD_HEIGHT - 80),
                    vx: newVx,
                    vy: newVy
                }
            }).filter(rec => rec.y < FIELD_HEIGHT - 60))

            // Move throws
            setThrows(prev => {
                const updated = prev.map(thr => ({
                    ...thr,
                    progress: Math.min(thr.progress + 0.05, 1)
                }))

                // Check for completions
                updated.forEach(thr => {
                    if (thr.progress >= 0.95 && thr.progress < 1) {
                        const currentX = QB_X + (thr.targetX - QB_X) * thr.progress
                        const currentY = QB_Y + (thr.targetY - QB_Y) * thr.progress

                        receivers.forEach(rec => {
                            const dist = Math.sqrt(Math.pow(rec.x - currentX, 2) + Math.pow(rec.y - currentY, 2))

                            if (dist < 40) {
                                if (rec.isOpen) {
                                    // Perfect throw!
                                    const points = dist < 20 ? 500 : 300
                                    setScore(s => s + points)
                                    setCoins(c => c + (dist < 20 ? 50 : 30))
                                    setStreak(st => {
                                        const newStreak = st + 1
                                        if (newStreak > bestStreak) setBestStreak(newStreak)
                                        return newStreak
                                    })
                                    if (dist < 20) {
                                        setPerfectThrows(p => p + 1)
                                        playSound('win')
                                        confetti({
                                            particleCount: 30,
                                            spread: 50,
                                            origin: { x: currentX / FIELD_WIDTH, y: currentY / FIELD_HEIGHT }
                                        })
                                    } else {
                                        playSound('correct')
                                    }
                                    setReceivers(prev => prev.filter(r => r.id !== rec.id))
                                } else {
                                    // Intercepted!
                                    playSound('wrong')
                                    setStreak(0)
                                }
                                thr.progress = 1 // Mark as complete
                            }
                        })
                    }
                })

                return updated.filter(thr => thr.progress < 1)
            })

            gameLoopRef.current = requestAnimationFrame(gameLoop)
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
        }
    }, [gameStarted, gameOver, receivers, bestStreak, playSound])

    // Timer
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true)
                    return 0
                }
                return t - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameStarted, gameOver])

    const { markGameCompleted } = useGameProgress()

    // Save high score
    useEffect(() => {
        if (gameOver) {
            if (score > highScore) {
                setHighScore(score)
                localStorage.setItem('qb_precision_high_score', score.toString())
            }
            markGameCompleted('qb-precision', score, coins)
        }
    }, [gameOver, score, highScore, coins, markGameCompleted])

    const startGame = () => {
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setStreak(0)
        setPerfectThrows(0)
        setTimeLeft(60)
        setReceivers([])
        setThrows([])
        setAimX(QB_X)
        setAimY(QB_Y - 100)
        playSound('start')
    }

    const resetGame = () => {
        setGameStarted(false)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setStreak(0)
        setPerfectThrows(0)
        setTimeLeft(60)
        setReceivers([])
        setThrows([])
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card className={cn("relative overflow-hidden border-4 bg-gradient-to-b from-blue-600 to-blue-900 shadow-2xl", colors.cardBorder)}>
                {/* Header */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Target className="text-yellow-400 w-6 h-6" />
                        <span className="font-heading text-2xl text-white uppercase tracking-wider">QB Precision</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-red-500 text-white font-bold text-lg px-3">
                            {timeLeft}s
                        </Badge>
                        <Badge className="bg-yellow-400 text-black font-bold text-lg px-3">
                            <Coins className="w-4 h-4 mr-1" />
                            {coins}
                        </Badge>
                        {streak > 0 && (
                            <Badge className="bg-orange-500 text-white font-bold text-lg px-3 animate-pulse">
                                🔥 {streak}x
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Game Area */}
                <div className="relative overflow-hidden" style={{ width: `${FIELD_WIDTH}px`, height: `${FIELD_HEIGHT}px`, margin: '0 auto' }}>
                    {/* Field background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-800">
                        {/* Yard lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="absolute w-full h-0.5 bg-white/20" style={{ top: `${i * 100}px` }} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {!gameStarted ? (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <Target className="w-20 h-20 text-yellow-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Ready to Throw?</h2>
                                <p className="text-white/80 text-lg mb-2">WASD or Arrow Keys to aim</p>
                                <p className="text-white/80 text-lg mb-8">SPACE to throw to open receivers!</p>
                                {highScore > 0 && (
                                    <Badge className="mb-6 bg-yellow-400 text-black font-bold text-lg px-4 py-2">
                                        <Crown className="w-4 h-4 mr-2" />
                                        High Score: {highScore}
                                    </Badge>
                                )}
                                <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-8 rounded-full">
                                    <Play className="mr-2 w-6 h-6" />
                                    Start Game
                                </Button>
                            </motion.div>
                        ) : gameOver ? (
                            <motion.div
                                key="gameover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Time's Up!</h2>
                                <div className="text-center mb-8">
                                    <p className="text-2xl text-white mb-2">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                                    <p className="text-xl text-white mb-2">Best Streak: <span className="text-orange-400 font-bold">{bestStreak}x</span></p>
                                    <p className="text-xl text-white mb-2">Perfect Throws: <span className="text-green-400 font-bold">{perfectThrows}</span></p>
                                    <p className="text-xl text-white">Coins: <span className="text-yellow-400 font-bold">{coins}</span></p>
                                </div>
                                <Button onClick={resetGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8">
                                    <RotateCcw className="mr-2 w-5 h-5" />
                                    Play Again
                                </Button>

                                <div className="mt-8 w-full max-w-md bg-black/40 rounded-xl p-4 backdrop-blur-md border border-white/10">
                                    <Leaderboard gameId="qb-precision" limit={5} />
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* QB */}
                                <div className="absolute w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl"
                                    style={{ left: `${QB_X - 20}px`, top: `${QB_Y - 20}px` }}>
                                    🏈
                                </div>

                                {/* Aim cursor */}
                                <motion.div
                                    className="absolute w-12 h-12 pointer-events-none"
                                    style={{ left: `${aimX - 24}px`, top: `${aimY - 24}px` }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    <Crosshair className="w-12 h-12 text-yellow-400" strokeWidth={3} />
                                </motion.div>

                                {/* Aim line */}
                                <svg className="absolute inset-0 pointer-events-none" style={{ width: FIELD_WIDTH, height: FIELD_HEIGHT }}>
                                    <line x1={QB_X} y1={QB_Y} x2={aimX} y2={aimY} stroke="yellow" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                                </svg>

                                {/* Receivers */}
                                {receivers.map(rec => (
                                    <motion.div
                                        key={rec.id}
                                        className={cn(
                                            "absolute w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2",
                                            rec.isOpen ? "border-green-400 bg-green-600" : "border-red-400 bg-red-600"
                                        )}
                                        style={{ left: `${rec.x - 20}px`, top: `${rec.y - 20}px` }}
                                    >
                                        {rec.isOpen ? '👐' : '🛡️'}
                                    </motion.div>
                                ))}

                                {/* Throws */}
                                {throws.map(thr => {
                                    const currentX = QB_X + (thr.targetX - QB_X) * thr.progress
                                    const currentY = QB_Y + (thr.targetY - QB_Y) * thr.progress - Math.sin(thr.progress * Math.PI) * 50

                                    return (
                                        <motion.div
                                            key={thr.id}
                                            className="absolute w-6 h-6 rounded-full bg-yellow-400 shadow-lg"
                                            style={{ left: `${currentX - 12}px`, top: `${currentY - 12}px` }}
                                        />
                                    )
                                })}
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-t border-white/10">
                    <div className="text-white/80 text-sm">
                        Score: <span className="text-white font-bold">{score}</span>
                    </div>
                    <div className="text-white/80 text-sm">
                        Perfect Throws: <span className="text-green-400 font-bold">{perfectThrows}</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
