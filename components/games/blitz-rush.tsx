'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Trophy, Zap, Coins, Heart, Play, RotateCcw, Crown } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import { Leaderboard } from './leaderboard'
import { AchievementPopup } from './achievement-popup'

interface Player {
    lane: number // 0 (left), 1 (center), 2 (right)
}

interface Obstacle {
    id: string
    y: number // vertical position (coming toward player)
    lane: number
    type: 'defender' | 'coin' | 'powerup'
}

const LANES = 3 // Three lanes: left, center, right
const LANE_POSITIONS = [25, 50, 75] // Percentage positions
const GAME_SPEED_BASE = 4
const COIN_VALUE = 10
const POWERUP_DURATION = 3000

export function BlitzRushGame() {
    const { colors } = useTheme()
    const playSound = useGameSound()
    const gameLoopRef = useRef<number>()
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [distance, setDistance] = useState(0)
    const [lives, setLives] = useState(3)
    const [isPowerupActive, setIsPowerupActive] = useState(false)
    const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_BASE)
    const [player, setPlayer] = useState<Player>({ lane: 1 }) // Start in center lane
    const [obstacles, setObstacles] = useState<Obstacle[]>([])
    const [highScore, setHighScore] = useState(0)

    // Load high score from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('blitz_rush_high_score')
        if (saved) setHighScore(parseInt(saved))
    }, [])

    // Keyboard controls - Temple Run style (left/right to change lanes)
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                setPlayer(prev => {
                    if (prev.lane > 0) {
                        playSound('click')
                        return { lane: prev.lane - 1 }
                    }
                    return prev
                })
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                setPlayer(prev => {
                    if (prev.lane < 2) {
                        playSound('click')
                        return { lane: prev.lane + 1 }
                    }
                    return prev
                })
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameStarted, gameOver, playSound])

    // Spawn obstacles coming from the top
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const spawnInterval = setInterval(() => {
            const randomLane = Math.floor(Math.random() * 3)
            const randomType = Math.random()

            let type: 'defender' | 'coin' | 'powerup' = 'defender'
            if (randomType > 0.7) type = 'coin'
            if (randomType > 0.95) type = 'powerup'

            const newObstacle: Obstacle = {
                id: `${Date.now()}-${Math.random()}`,
                y: -50, // Start above the screen
                lane: randomLane,
                type
            }

            setObstacles(prev => [...prev, newObstacle])
        }, 1200 / gameSpeed)

        return () => clearInterval(spawnInterval)
    }, [gameStarted, gameOver, gameSpeed])

    // Game loop - move obstacles DOWN toward player
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const gameLoop = () => {
            setObstacles(prev => {
                const updated = prev.map(obs => ({
                    ...obs,
                    y: obs.y + gameSpeed // Move DOWN
                })).filter(obs => obs.y < 550) // Remove obstacles that passed the player

                // Collision detection (when obstacle reaches player position)
                updated.forEach(obs => {
                    // Player is at y=450, check if obstacle is in collision range
                    if (obs.y > 420 && obs.y < 480 && obs.lane === player.lane) {
                        if (obs.type === 'coin') {
                            setCoins(c => c + COIN_VALUE)
                            setScore(s => s + 100)
                            playSound('correct')
                            obs.y = 1000 // Remove from screen
                        } else if (obs.type === 'powerup') {
                            setIsPowerupActive(true)
                            playSound('win')
                            setTimeout(() => setIsPowerupActive(false), POWERUP_DURATION)
                            obs.y = 1000
                        } else if (obs.type === 'defender' && !isPowerupActive) {
                            setLives(l => {
                                const newLives = l - 1
                                if (newLives <= 0) {
                                    setGameOver(true)
                                    playSound('wrong')
                                } else {
                                    playSound('wrong')
                                }
                                return newLives
                            })
                            obs.y = 1000
                        }
                    }
                })

                return updated
            })

            setDistance(d => d + 1)
            setScore(s => s + 1)

            // Increase difficulty over time
            if (distance % 500 === 0 && distance > 0) {
                setGameSpeed(s => Math.min(s + 0.5, 10))
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop)
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
        }
    }, [gameStarted, gameOver, gameSpeed, player.lane, distance, isPowerupActive, playSound])

    const { markGameCompleted, unlockedAchievement, clearAchievement } = useGameProgress()

    // Save high score
    useEffect(() => {
        if (gameOver) {
            if (score > highScore) {
                setHighScore(score)
                localStorage.setItem('blitz_rush_high_score', score.toString())
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            }
            markGameCompleted('blitz-rush', score, coins)
        }
    }, [gameOver, score, highScore, coins, markGameCompleted])

    const startGame = () => {
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setDistance(0)
        setLives(3)
        setGameSpeed(GAME_SPEED_BASE)
        setObstacles([])
        setPlayer({ lane: 1 })
        playSound('start')
    }

    const resetGame = () => {
        setGameStarted(false)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setDistance(0)
        setLives(3)
        setGameSpeed(GAME_SPEED_BASE)
        setObstacles([])
        setPlayer({ lane: 1 })
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card className={cn("relative overflow-hidden border-4 bg-gradient-to-b from-green-600 to-green-800 shadow-2xl", colors.cardBorder)}>
                {/* Header */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Zap className="text-yellow-400 w-6 h-6" />
                        <span className="font-heading text-2xl text-white uppercase tracking-wider">Blitz Rush</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {[...Array(lives)].map((_, i) => (
                                <Heart key={i} className="w-5 h-5 text-red-500 fill-current" />
                            ))}
                        </div>
                        <Badge className="bg-yellow-400 text-black font-bold text-lg px-3">
                            <Coins className="w-4 h-4 mr-1" />
                            {coins}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white font-bold text-lg px-3">
                            {Math.floor(distance / 10)} YDS
                        </Badge>
                    </div>
                </div>

                {/* Game Area - Temple Run Style (Vertical) */}
                <div className="relative h-[500px] overflow-hidden bg-gradient-to-b from-green-700 via-green-800 to-green-900">
                    {/* Field Lines (horizontal yard markers) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="absolute w-full h-0.5 bg-white/20" style={{ top: `${i * 50}px` }} />
                        ))}
                    </div>

                    {/* Lane dividers (vertical) */}
                    <div className="absolute inset-0 flex pointer-events-none">
                        <div className="flex-1 border-r border-white/20" />
                        <div className="flex-1 border-r border-white/20" />
                        <div className="flex-1" />
                    </div>

                    <AnimatePresence mode="wait">
                        {!gameStarted ? (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Ready to Rush?</h2>
                                <p className="text-white/80 text-lg mb-2">Use ← → Arrow Keys to switch lanes</p>
                                <p className="text-white/80 text-lg mb-8">Dodge defenders, collect coins!</p>
                                {highScore > 0 && (
                                    <Badge className="mb-6 bg-yellow-400 text-black font-bold text-lg px-4 py-2">
                                        <Crown className="w-4 h-4 mr-2" />
                                        High Score: {highScore}
                                    </Badge>
                                )}
                                <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-8 rounded-full shadow-lg">
                                    <Play className="mr-2 w-6 h-6" />
                                    Start Game
                                </Button>
                            </motion.div>
                        ) : gameOver ? (
                            <motion.div
                                key="gameover"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Game Over!</h2>
                                <div className="text-center mb-8">
                                    <p className="text-2xl text-white mb-2">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                                    <p className="text-xl text-white mb-2">Distance: <span className="text-green-400 font-bold">{Math.floor(distance / 10)} yards</span></p>
                                    <p className="text-xl text-white">Coins: <span className="text-yellow-400 font-bold">{coins}</span></p>
                                    {score > highScore && (
                                        <Badge className="mt-4 bg-yellow-400 text-black font-bold text-lg px-4 py-2">
                                            🎉 NEW HIGH SCORE! 🎉
                                        </Badge>
                                    )}
                                </div>
                                <Button onClick={resetGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8">
                                    <RotateCcw className="mr-2 w-5 h-5" />
                                    Play Again
                                </Button>

                                <div className="mt-8 w-full max-w-md bg-black/40 rounded-xl p-4 backdrop-blur-md border border-white/10">
                                    <Leaderboard gameId="blitz-rush" limit={5} />
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Player (at bottom, running forward) */}
                                <motion.div
                                    className={cn(
                                        "absolute w-16 h-16 rounded-full flex items-center justify-center font-bold text-4xl transition-all duration-200",
                                        isPowerupActive ? "bg-yellow-400 text-black animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.9)]" : "bg-blue-600 text-white shadow-lg"
                                    )}
                                    style={{
                                        left: `calc(${LANE_POSITIONS[player.lane]}% - 32px)`,
                                        top: '450px',
                                        transform: 'translateX(-50%)'
                                    }}
                                    animate={{
                                        left: `calc(${LANE_POSITIONS[player.lane]}% - 32px)`,
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    🏃
                                </motion.div>

                                {/* Obstacles (coming from top) */}
                                {obstacles.map(obs => (
                                    <motion.div
                                        key={obs.id}
                                        className={cn(
                                            "absolute w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg",
                                            obs.type === 'defender' && "bg-red-600",
                                            obs.type === 'coin' && "bg-yellow-400 animate-spin",
                                            obs.type === 'powerup' && "bg-purple-500 animate-pulse"
                                        )}
                                        style={{
                                            left: `calc(${LANE_POSITIONS[obs.lane]}% - 28px)`,
                                            top: `${obs.y}px`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    >
                                        {obs.type === 'defender' && '🛡️'}
                                        {obs.type === 'coin' && '🪙'}
                                        {obs.type === 'powerup' && '⚡'}
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <AchievementPopup
                    achievement={unlockedAchievement as any}
                    onClose={clearAchievement}
                />

                {/* Footer Stats */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-t border-white/10">
                    <div className="text-white/80 text-sm">
                        <p>Speed: <span className="text-yellow-400 font-bold">{gameSpeed.toFixed(1)}x</span></p>
                    </div>
                    <div className="text-white/80 text-sm">
                        <p>Score: <span className="text-white font-bold">{score}</span></p>
                    </div>
                    {isPowerupActive && (
                        <Badge className="bg-purple-500 text-white animate-pulse">
                            ⚡ INVINCIBLE
                        </Badge>
                    )}
                </div>
            </Card>
        </div>
    )
}
