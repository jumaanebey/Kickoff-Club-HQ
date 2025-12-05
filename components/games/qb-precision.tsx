'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Target, Coins, Trophy, Play, RotateCcw, ArrowLeft, Headphones } from 'lucide-react'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import Link from 'next/link'
import { usePlayer } from '@/components/providers/player-provider'

// Physics Constants
const GRAVITY = 0.5
const FIELD_WIDTH = 800
const FIELD_HEIGHT = 400
const QB_POS = { x: 100, y: 200 }

interface Receiver {
    id: number
    x: number
    y: number
    speed: number
    route: 'go' | 'slant' | 'post'
    caught: boolean
}

interface Ball {
    x: number
    y: number
    vx: number
    vy: number
    active: boolean
}

export function QBPrecisionGame() {
    const { colors } = useTheme()
    const { playSound } = useGameSound()
    const { playTrack, isPlaying } = usePlayer()
    const requestRef = useRef<number>()
    const canvasRef = useRef<HTMLDivElement>(null)

    // Game State
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [attempts, setAttempts] = useState(10)

    // New State
    const [streak, setStreak] = useState(0)
    const [comboMultiplier, setComboMultiplier] = useState(1)

    // Interaction State
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 })

    // Game Objects
    const [ball, setBall] = useState<Ball>({ x: QB_POS.x, y: QB_POS.y, vx: 0, vy: 0, active: false })
    const [receivers, setReceivers] = useState<Receiver[]>([])

    // Initialize Receivers
    const spawnReceivers = useCallback(() => {
        const newReceivers: Receiver[] = [
            { id: 1, x: 200, y: 100, speed: 2, route: 'go', caught: false },
            { id: 2, x: 200, y: 300, speed: 2.5, route: 'slant', caught: false },
            { id: 3, x: 200, y: 200, speed: 1.5, route: 'post', caught: false }
        ]
        setReceivers(newReceivers)
    }, [])

    // Game Loop
    const updateGame = useCallback(() => {
        if (!gameStarted || gameOver) return

        // Update Receivers
        setReceivers(prev => prev.map(r => {
            if (r.caught) return r // Stop moving if caught

            let newX = r.x + r.speed
            let newY = r.y

            // Simple routes
            if (r.route === 'slant') newY -= 1 // Move up
            if (r.route === 'post') newY += 0.5 // Move down slightly

            // Reset if off screen
            if (newX > FIELD_WIDTH) {
                newX = 200
                newY = r.route === 'slant' ? 300 : (r.route === 'post' ? 200 : 100)
            }

            return { ...r, x: newX, y: newY }
        }))

        // Update Ball
        if (ball.active) {
            setBall(prev => {
                const newX = prev.x + prev.vx
                const newY = prev.y + prev.vy
                const newVy = prev.vy + GRAVITY // Apply gravity

                // Check bounds (ground or out of bounds)
                if (newY > FIELD_HEIGHT || newX > FIELD_WIDTH || newY < 0) {
                    // Missed
                    if (prev.active) { // Only trigger once
                        setAttempts(a => a - 1)
                        setStreak(0)
                        setComboMultiplier(1)
                        playSound('wrong')
                        if (attempts <= 1) setGameOver(true)
                    }
                    return { ...prev, active: false, x: QB_POS.x, y: QB_POS.y, vx: 0, vy: 0 }
                }

                return { ...prev, x: newX, y: newY, vy: newVy }
            })

            // Collision Detection
            receivers.forEach(r => {
                if (r.caught) return
                const dx = ball.x - r.x
                const dy = ball.y - r.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 30) { // Catch radius
                    // Caught!
                    setStreak(s => {
                        const newStreak = s + 1
                        setComboMultiplier(Math.min(5, 1 + Math.floor(newStreak / 3) * 0.5))
                        return newStreak
                    })

                    setScore(s => s + (100 * comboMultiplier))
                    setCoins(c => c + 10)
                    playSound('correct')

                    // Reset ball
                    setBall({ x: QB_POS.x, y: QB_POS.y, vx: 0, vy: 0, active: false })
                    setAttempts(a => a - 1)
                    if (attempts <= 1) setGameOver(true)

                    // Flash receiver
                    // (In a real game we'd animate the catch, here we just score)
                }
            })
        }

        requestRef.current = requestAnimationFrame(updateGame)
    }, [gameStarted, gameOver, ball, receivers, attempts, playSound, comboMultiplier])

    useEffect(() => {
        if (gameStarted && !gameOver) {
            requestRef.current = requestAnimationFrame(updateGame)
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [gameStarted, gameOver, updateGame])

    // Input Handling
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameStarted || gameOver || ball.active) return
        setIsDragging(true)

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        // Get canvas offset
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
            setDragStart({ x: clientX - rect.left, y: clientY - rect.top })
            setDragCurrent({ x: clientX - rect.left, y: clientY - rect.top })
        }
    }

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
            setDragCurrent({ x: clientX - rect.left, y: clientY - rect.top })
        }
    }

    const handleMouseUp = () => {
        if (!isDragging) return
        setIsDragging(false)

        // Calculate velocity vector based on drag
        // Pull back (dragStart - dragCurrent) determines force
        const dx = dragStart.x - dragCurrent.x
        const dy = dragStart.y - dragCurrent.y

        const power = Math.sqrt(dx * dx + dy * dy) * 0.15
        const angle = Math.atan2(dy, dx)

        // Cap max power
        const maxPower = 25
        const actualPower = Math.min(power, maxPower)

        if (actualPower > 2) { // Minimum throw threshold
            setBall({
                x: QB_POS.x,
                y: QB_POS.y,
                vx: Math.cos(angle) * actualPower,
                vy: Math.sin(angle) * actualPower,
                active: true
            })
            playSound('click') // Whoosh sound
        }
    }

    const { markGameCompleted, progress } = useGameProgress()

    useEffect(() => {
        if (gameOver && score > 0) {
            markGameCompleted('qb-precision', score, coins)
        }
    }, [gameOver, score, coins, markGameCompleted])

    const startGame = () => {
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setAttempts(10)
        setStreak(0)
        setComboMultiplier(1)
        setBall({ x: QB_POS.x, y: QB_POS.y, vx: 0, vy: 0, active: false })
        spawnReceivers()
        playSound('start')
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10">
                    <Link href="/">
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back to HQ
                    </Link>
                </Button>
                <div className="flex gap-4">
                    {progress['qb-precision']?.highScore > 0 && (
                        <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50">
                            <span className="text-yellow-400 font-bold text-sm">Best: {Math.floor(progress['qb-precision'].highScore)}</span>
                        </div>
                    )}
                    {streak > 1 && (
                        <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/50 animate-pulse">
                            <span className="text-orange-400 font-bold">🔥 {streak} Streak</span>
                            {comboMultiplier > 1 && <span className="text-yellow-400 font-black text-sm">x{comboMultiplier}</span>}
                        </div>
                    )}
                    <Button
                        variant="outline"
                        className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        onClick={() => playTrack({
                            id: 'ep-qb-mindset',
                            title: 'The QB Mindset',
                            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                            image: '/images/podcast/cover.jpg'
                        })}
                    >
                        <Headphones className="w-4 h-4" />
                        {isPlaying ? "Now Playing" : "Music"}
                    </Button>
                </div>
            </div>

            <Card className={cn("relative overflow-hidden border-4 shadow-2xl", colors.cardBorder)}>
                {/* Header */}
                <div className="relative z-10 bg-black/60 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Target className="text-yellow-400 w-6 h-6" />
                        <span className="font-heading text-2xl text-white uppercase">QB Precision</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-blue-500 text-white font-bold text-lg px-3">
                            Attempts: {attempts}
                        </Badge>
                        <Badge className="bg-yellow-400 text-black font-bold text-lg px-3">
                            <Coins className="w-4 h-4 mr-1" />
                            {coins}
                        </Badge>
                    </div>
                </div>

                {/* Game Area */}
                <div
                    className="relative bg-green-700 cursor-crosshair select-none overflow-hidden"
                    style={{ width: '100%', height: '400px' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                    ref={canvasRef}
                >
                    {/* Field Markings */}
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="absolute top-0 bottom-0 w-1 bg-white/20" style={{ left: `${i * 100}px` }} />
                    ))}

                    {/* Endzone */}
                    <div className="absolute top-0 bottom-0 right-0 w-20 bg-blue-900/30 border-l-4 border-yellow-400/50 flex items-center justify-center">
                        <span className="text-white/20 font-black text-4xl -rotate-90">ZONE</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {!gameStarted ? (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 pointer-events-none"
                            >
                                <Target className="w-20 h-20 text-yellow-400 mb-4 animate-pulse" />
                                <h2 className="text-4xl font-heading text-white font-black mb-4">QB PRECISION</h2>
                                <p className="text-white/80 text-lg mb-8">Drag back to aim, release to throw!</p>
                                <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-6 rounded-full pointer-events-auto">
                                    <Play className="mr-2 w-6 h-6" />
                                    START
                                </Button>
                            </motion.div>
                        ) : gameOver ? (
                            <motion.div
                                key="gameover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 pointer-events-none"
                            >
                                <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-black mb-4">GAME OVER</h2>
                                <p className="text-3xl text-yellow-400 font-bold mb-2">Score: {score}</p>
                                <Button onClick={startGame} size="lg" className="bg-white text-black hover:bg-gray-200 font-bold text-lg px-8 rounded-full pointer-events-auto">
                                    <RotateCcw className="mr-2 w-5 h-5" />
                                    Play Again
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                {/* QB */}
                                <div className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white z-10"
                                    style={{ left: QB_POS.x - 16, top: QB_POS.y - 16 }}>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white font-bold text-xs">QB</div>
                                </div>

                                {/* Receivers */}
                                {receivers.map(r => (
                                    <div key={r.id}
                                        className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white z-10"
                                        style={{ left: r.x - 16, top: r.y - 16 }}>
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white font-bold text-xs">WR</div>
                                    </div>
                                ))}

                                {/* Ball */}
                                {ball.active && (
                                    <div className="absolute w-4 h-6 bg-amber-800 rounded-full border border-amber-950 z-20 shadow-lg"
                                        style={{
                                            left: ball.x - 8,
                                            top: ball.y - 12,
                                            transform: `rotate(${Math.atan2(ball.vy, ball.vx) * (180 / Math.PI)}deg)`
                                        }}
                                    />
                                )}

                                {/* Aiming Arc */}
                                {isDragging && (
                                    <svg className="absolute inset-0 pointer-events-none overflow-visible">
                                        {/* Trajectory Line */}
                                        <path
                                            d={`M ${QB_POS.x} ${QB_POS.y} Q ${QB_POS.x + (dragStart.x - dragCurrent.x)} ${QB_POS.y + (dragStart.y - dragCurrent.y) * 2} ${QB_POS.x + (dragStart.x - dragCurrent.x) * 2} ${QB_POS.y + (dragStart.y - dragCurrent.y) * 4}`}
                                            fill="none"
                                            stroke="rgba(255, 255, 255, 0.5)"
                                            strokeWidth="4"
                                            strokeDasharray="10 5"
                                        />
                                        {/* Drag Line */}
                                        <line
                                            x1={dragStart.x} y1={dragStart.y}
                                            x2={dragCurrent.x} y2={dragCurrent.y}
                                            stroke="yellow"
                                            strokeWidth="2"
                                            opacity="0.5"
                                        />
                                    </svg>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="relative z-10 bg-black/60 p-4 flex justify-between items-center border-t border-white/10">
                    <div className="text-white/80 text-sm">
                        Score: <span className="text-white font-bold text-lg">{score}</span>
                    </div>
                    <div className="text-white/60 text-xs">
                        Drag back to aim • Release to throw
                    </div>
                </div>
            </Card>
        </div>
    )
}
