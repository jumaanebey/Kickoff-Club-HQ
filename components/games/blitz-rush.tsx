'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Zap, Coins, Trophy, Play, RotateCcw, ArrowLeft, Headphones, Shield, Skull, Magnet, Flame } from 'lucide-react'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import Link from 'next/link'
import { usePlayer } from '@/components/providers/player-provider'

// --- Constants ---
const LANE_WIDTH = 140
const VISIBLE_DEPTH = 3000
const PLAYER_SPEED_Z = 25
const GRAVITY = 0.9
const JUMP_FORCE = 20
const MAGNET_RANGE = 600
const POWERUP_DURATION = 8000 // 8 seconds

type Lane = -1 | 0 | 1
type ObstacleType = 'hurdle' | 'defender' | 'coin' | 'magnet' | 'shield'

interface GameObject {
    id: number
    lane: Lane
    z: number
    type: ObstacleType
    hit?: boolean
}

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
}

// --- Assets (CSS Components) ---

const PlayerModel = ({ action, lane, hasShield }: { action: string, lane: number, hasShield: boolean }) => (
    <div className="relative w-24 h-40 transform-style-3d transition-transform duration-200">
        {/* Shield Bubble */}
        {hasShield && (
            <div className="absolute -inset-4 rounded-full border-4 border-blue-400/50 bg-blue-400/20 animate-pulse z-50 shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
        )}

        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/40 blur-md rounded-full transform rotate-x-90" />

        {/* Body Group */}
        <motion.div
            className="relative w-full h-full"
            animate={{
                y: action === 'jump' ? -120 : 0,
                scaleY: action === 'slide' ? 0.6 : 1,
                rotateZ: lane * 15, // More lean
                rotateX: action === 'run' ? 10 : 0 // Lean forward when running
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Helmet */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg z-20 overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-black/20" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-black/80 rounded-b-xl" />
                {/* Reflection */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/40 rounded-full blur-[2px]" />
            </div>

            {/* Shoulder Pads */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-28 h-14 bg-blue-700 rounded-xl shadow-md z-10 flex justify-between px-1 transform -translate-y-2">
                <div className="w-8 h-full bg-blue-800 rounded-l-xl border-r border-blue-900" />
                <div className="w-8 h-full bg-blue-800 rounded-r-xl border-l border-blue-900" />
            </div>

            {/* Jersey Torso */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-blue-600 rounded-b-xl shadow-inner flex items-center justify-center z-0">
                <span className="text-white font-black text-2xl font-mono drop-shadow-md">20</span>
            </div>

            {/* Arms */}
            <motion.div
                className="absolute top-14 left-[-8px] w-7 h-24 bg-amber-800 rounded-full origin-top border-2 border-black/10"
                animate={{ rotateX: [40, -40, 40] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            >
                <div className="absolute bottom-0 w-full h-8 bg-white rounded-b-full" /> {/* Gloves */}
            </motion.div>
            <motion.div
                className="absolute top-14 right-[-8px] w-7 h-24 bg-amber-800 rounded-full origin-top border-2 border-black/10"
                animate={{ rotateX: [-40, 40, -40] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            >
                <div className="absolute bottom-0 w-full h-8 bg-white rounded-b-full" /> {/* Gloves */}
            </motion.div>

            {/* Legs */}
            <motion.div
                className="absolute bottom-0 left-4 w-7 h-24 bg-white rounded-full origin-top border-b-8 border-black"
                animate={{ rotateX: [-45, 45, -45] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 right-4 w-7 h-24 bg-white rounded-full origin-top border-b-8 border-black"
                animate={{ rotateX: [45, -45, 45] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            />
        </motion.div>
    </div>
)

const DefenderModel = () => (
    <div className="relative w-24 h-40">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/50 blur-md rounded-full" />
        <div className="relative w-full h-full animate-bounce-slight">
            {/* Helmet */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-red-600 rounded-full border-4 border-red-800 z-20">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/60" />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-full bg-white/20" />
            </div>
            {/* Pads */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-16 bg-red-700 rounded-xl z-10 transform -rotate-3 shadow-lg" />
            {/* Jersey */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-20 bg-red-600 rounded-xl flex items-center justify-center border-2 border-red-800">
                <span className="text-white/80 font-black text-3xl">X</span>
            </div>
            {/* Arms */}
            <div className="absolute top-16 -left-6 w-10 h-28 bg-red-700 rounded-full transform rotate-[30deg] border-b-8 border-white" />
            <div className="absolute top-16 -right-6 w-10 h-28 bg-red-700 rounded-full transform -rotate-[30deg] border-b-8 border-white" />
        </div>
    </div>
)

const HurdleModel = () => (
    <div className="w-32 h-24 relative transform-style-3d">
        <div className="absolute bottom-0 left-0 w-3 h-24 bg-gray-400 rounded-t-lg shadow-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-24 bg-gray-400 rounded-t-lg shadow-lg" />
        <div className="absolute top-2 left-0 right-0 h-6 bg-white border-y-4 border-red-600 striped-bar shadow-sm" />
        <div className="absolute top-12 left-0 right-0 h-16 bg-white/5 backdrop-blur-sm border border-white/20 rounded flex items-center justify-center">
            <span className="text-white/30 font-black text-2xl rotate-12">HIT ME</span>
        </div>
    </div>
)

const CoinModel = () => (
    <div className="w-16 h-16 relative animate-spin-slow transform-style-3d">
        <div className="absolute inset-0 bg-yellow-400 rounded-full border-[6px] border-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.6)]">
            <span className="text-yellow-700 font-black text-2xl">$</span>
        </div>
        <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
    </div>
)

const PowerupModel = ({ type }: { type: 'magnet' | 'shield' }) => (
    <div className="w-16 h-16 relative animate-bounce-slow transform-style-3d">
        <div className={cn(
            "absolute inset-0 rounded-xl border-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.6)]",
            type === 'magnet' ? "bg-red-500 border-red-300" : "bg-blue-500 border-blue-300"
        )}>
            {type === 'magnet' ? <Magnet className="w-10 h-10 text-white" /> : <Shield className="w-10 h-10 text-white" />}
        </div>
    </div>
)

// --- Main Component ---

export function BlitzRushGame() {
    const { colors } = useTheme()
    const { playSound } = useGameSound()
    const { playTrack, isPlaying } = usePlayer()
    const requestRef = useRef<number>()
    const lastTimeRef = useRef<number>()

    // Game State
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start')
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [speed, setSpeed] = useState(PLAYER_SPEED_Z)

    // Player Physics
    const [lane, setLane] = useState<Lane>(0)
    const [action, setAction] = useState<'run' | 'jump' | 'slide'>('run')
    const [yPos, setYPos] = useState(0)
    const [yVel, setYVel] = useState(0)

    // Powerups
    const [activePowerup, setActivePowerup] = useState<'magnet' | 'shield' | null>(null)
    const [powerupTimer, setPowerupTimer] = useState(0)

    // World State
    const [obstacles, setObstacles] = useState<GameObject[]>([])
    const [particles, setParticles] = useState<Particle[]>([])
    const [distance, setDistance] = useState(0)
    const [cameraShake, setCameraShake] = useState(0)

    // --- Controls ---
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'playing') return

        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                setLane(prev => Math.max(-1, prev - 1) as Lane)
                playSound('click')
                break
            case 'ArrowRight':
            case 'd':
                setLane(prev => Math.min(1, prev + 1) as Lane)
                playSound('click')
                break
            case 'ArrowUp':
            case 'w':
            case ' ':
                if (yPos === 0 && action !== 'slide') {
                    setYVel(JUMP_FORCE)
                    setAction('jump')
                    playSound('click')
                    // Dust particles
                    spawnParticles(0, 0, 5, '#fff')
                }
                break
            case 'ArrowDown':
            case 's':
                if (yPos === 0 && action !== 'slide') {
                    setAction('slide')
                    playSound('click')
                    setTimeout(() => setAction('run'), 800)
                } else if (yPos > 0) {
                    setYVel(-JUMP_FORCE * 1.5) // Fast fall
                }
                break
        }
    }, [gameState, yPos, action, playSound])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const spawnParticles = (x: number, y: number, count: number, color: string) => {
        setParticles(prev => [
            ...prev,
            ...Array.from({ length: count }).map(() => ({
                id: Math.random(),
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            }))
        ])
    }

    // --- Game Loop ---
    const update = useCallback((time: number) => {
        if (lastTimeRef.current !== undefined) {
            // 1. Physics (Jump)
            if (yPos > 0 || yVel !== 0) {
                setYPos(y => {
                    const nextY = y + yVel
                    if (nextY <= 0) {
                        setYVel(0)
                        setAction('run')
                        spawnParticles(0, 0, 3, '#88cc88') // Land dust
                        return 0
                    }
                    return nextY
                })
                setYVel(v => v - GRAVITY)
            }

            // 2. Move World
            setDistance(d => d + speed)
            setSpeed(s => Math.min(60, s + 0.01)) // Higher max speed
            setScore(s => s + Math.floor(speed / 10))
            if (cameraShake > 0) setCameraShake(s => Math.max(0, s - 1))

            // Powerup Timer
            if (activePowerup) {
                setPowerupTimer(t => {
                    if (t <= 0) {
                        setActivePowerup(null)
                        return 0
                    }
                    return t - 16 // approx 16ms per frame
                })
            }

            // 3. Manage Obstacles
            setObstacles(prev => {
                const moved = prev.map(obs => {
                    let newZ = obs.z - speed
                    let newLane = obs.lane
                    let newHit = obs.hit

                    // Magnet Effect
                    if (activePowerup === 'magnet' && obs.type === 'coin' && !obs.hit) {
                        if (newZ < MAGNET_RANGE && newZ > -100) {
                            // Move towards player lane
                            const laneDiff = lane - obs.lane
                            if (Math.abs(laneDiff) > 0.1) {
                                // Lerp lane
                                // This is tricky with discrete lanes, so we'll just fly it to player visually
                                // For logic, we'll just say if it's close enough, collect it
                                if (newZ < 200) {
                                    newHit = true
                                    setCoins(c => c + 1)
                                    playSound('correct')
                                    spawnParticles(0, 100, 5, '#fbbf24')
                                }
                            }
                        }
                    }

                    return { ...obs, z: newZ, hit: newHit }
                }).filter(obs => obs.z > -200)

                // Collision Detection
                moved.forEach(obs => {
                    if (obs.hit) return

                    // Check Z overlap (Player is at z=0, depth approx 50)
                    if (obs.z < 70 && obs.z > -70) {
                        // Check Lane
                        if (obs.lane === lane) {
                            // Check Type
                            if (obs.type === 'coin') {
                                obs.hit = true
                                setCoins(c => c + 1)
                                playSound('correct')
                                spawnParticles(0, 100, 5, '#fbbf24')
                            } else if (obs.type === 'magnet' || obs.type === 'shield') {
                                obs.hit = true
                                setActivePowerup(obs.type)
                                setPowerupTimer(POWERUP_DURATION)
                                playSound('correct') // Reuse 'correct' sound for now
                                spawnParticles(0, 100, 10, obs.type === 'magnet' ? '#ef4444' : '#3b82f6')
                            } else if (obs.type === 'hurdle') {
                                if (yPos < 60) {
                                    if (activePowerup === 'shield') {
                                        setActivePowerup(null)
                                        obs.hit = true
                                        setCameraShake(10)
                                        playSound('click') // Shield break sound
                                    } else {
                                        setGameState('gameover')
                                        setCameraShake(20)
                                        playSound('wrong')
                                    }
                                }
                            } else if (obs.type === 'defender') {
                                if (yPos < 20) {
                                    if (activePowerup === 'shield') {
                                        setActivePowerup(null)
                                        obs.hit = true
                                        setCameraShake(10)
                                        playSound('click')
                                    } else {
                                        setGameState('gameover')
                                        setCameraShake(20)
                                        playSound('wrong')
                                    }
                                }
                            }
                        }
                    }
                })

                return moved
            })

            // 4. Spawn New Obstacles
            if (Math.random() < 0.025 + (speed / 2000)) {
                setObstacles(prev => {
                    const lastObs = prev[prev.length - 1]
                    if (lastObs && lastObs.z > VISIBLE_DEPTH - 400) return prev

                    const newLane = (Math.floor(Math.random() * 3) - 1) as Lane
                    const typeRand = Math.random()
                    let type: ObstacleType = 'coin'

                    if (typeRand > 0.95) type = 'magnet'
                    else if (typeRand > 0.90) type = 'shield'
                    else if (typeRand > 0.5) type = 'hurdle'
                    else if (typeRand > 0.75) type = 'defender'

                    // Coins often come in lines
                    if (type === 'coin' && Math.random() > 0.5) {
                        return [
                            ...prev,
                            { id: Date.now(), lane: newLane, z: VISIBLE_DEPTH, type: 'coin', hit: false },
                            { id: Date.now() + 1, lane: newLane, z: VISIBLE_DEPTH + 150, type: 'coin', hit: false },
                            { id: Date.now() + 2, lane: newLane, z: VISIBLE_DEPTH + 300, type: 'coin', hit: false },
                        ]
                    }

                    return [...prev, {
                        id: Date.now(),
                        lane: newLane,
                        z: VISIBLE_DEPTH,
                        type,
                        hit: false
                    }]
                })
            }

            // 5. Update Particles
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                life: p.life - 0.05
            })).filter(p => p.life > 0))
        }

        lastTimeRef.current = time
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update)
        }
    }, [gameState, lane, yPos, yVel, speed, playSound, activePowerup])

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update)
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [gameState, update])

    const startGame = () => {
        setGameState('playing')
        setScore(0)
        setCoins(0)
        setSpeed(PLAYER_SPEED_Z)
        setObstacles([])
        setParticles([])
        setDistance(0)
        setLane(0)
        setYPos(0)
        setYVel(0)
        setActivePowerup(null)
        playSound('start')
    }

    const { markGameCompleted, progress } = useGameProgress()
    useEffect(() => {
        if (gameState === 'gameover' && score > 0) {
            markGameCompleted('blitz-rush', score, coins)
        }
    }, [gameState, score, coins, markGameCompleted])

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-4 relative z-[100]">
                <Link href="/" className="inline-flex items-center gap-2 text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to HQ
                </Link>
                <div className="flex gap-4">
                    {activePowerup && (
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full animate-pulse border border-white/20">
                            {activePowerup === 'magnet' ? <Magnet className="text-red-400" /> : <Shield className="text-blue-400" />}
                            <span className="text-white font-bold uppercase">{activePowerup}</span>
                            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-100"
                                    style={{ width: `${(powerupTimer / POWERUP_DURATION) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        onClick={() => playTrack({
                            id: 'ep-game-day',
                            title: 'Game Day Hype',
                            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                            image: '/images/podcast/cover.jpg'
                        })}
                    >
                        <Headphones className="w-4 h-4" />
                        {isPlaying ? "Now Playing" : "Music"}
                    </Button>
                </div>
            </div>

            {/* Game Container */}
            <Card className="relative w-full h-[650px] overflow-hidden border-4 border-black shadow-2xl bg-sky-300 group">

                {/* 1. Sky / Stadium Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-600 via-sky-400 to-sky-200">
                    {/* Moving Clouds */}
                    <div className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
                            backgroundPosition: `${distance * 0.1}px 0`
                        }}
                    />

                    {/* Stadium Crowd */}
                    <div className="absolute bottom-[40%] left-0 right-0 h-80 bg-gradient-to-t from-blue-900 to-transparent opacity-60" />
                    <div className="absolute bottom-[40%] left-0 right-0 h-40 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 animate-pulse" />

                    {/* Giant Stadium Lights */}
                    <div className="absolute top-20 left-10 w-6 h-32 bg-gray-800 rotate-12 shadow-2xl z-0">
                        <div className="w-40 h-20 bg-white/60 blur-3xl absolute -top-10 -left-10 animate-pulse" />
                    </div>
                    <div className="absolute top-20 right-10 w-6 h-32 bg-gray-800 -rotate-12 shadow-2xl z-0">
                        <div className="w-40 h-20 bg-white/60 blur-3xl absolute -top-10 -right-10 animate-pulse" />
                    </div>
                </div>

                {/* 2. 3D Scene */}
                <div className="absolute inset-0 perspective-1000 overflow-hidden">
                    <motion.div
                        className="relative w-full h-full transform-style-3d"
                        animate={{
                            x: cameraShake > 0 ? Math.sin(Date.now()) * cameraShake : 0,
                            rotateZ: -lane * 2 // Subtle camera tilt
                        }}
                    >

                        {/* Ground Plane */}
                        <div
                            className="absolute top-1/2 left-1/2 w-[4000px] h-[8000px] bg-green-600 origin-top shadow-2xl"
                            style={{
                                transform: `translate3d(-50%, 0, 0) rotateX(75deg) translateY(${distance % 200}px)`,
                                backgroundImage: `
                                    linear-gradient(to bottom, transparent 90%, rgba(255,255,255,0.4) 90%),
                                    repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 80px)
                                `,
                                backgroundSize: '100% 200px, 100% 100%' // Yard lines + Mowed grass pattern
                            }}
                        >
                            {/* Endzone Text (Repeated) */}
                            <div className="absolute top-[-2000px] left-0 right-0 h-[400px] bg-blue-900 flex items-center justify-center transform rotate-180">
                                <span className="text-[200px] font-black text-white/30 tracking-widest">KICKOFF</span>
                            </div>

                            {/* Lane Markers */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[140px] bg-white/5 border-x-4 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)_inset]" />
                            <div className="absolute left-1/2 -translate-x-[210px] top-0 bottom-0 w-[140px] bg-black/5 border-l-8 border-white/40" />
                            <div className="absolute left-1/2 translate-x-[70px] top-0 bottom-0 w-[140px] bg-black/5 border-r-8 border-white/40" />

                            {/* Sidelines */}
                            <div className="absolute left-[35%] top-0 bottom-0 w-12 bg-white shadow-lg" />
                            <div className="absolute right-[35%] top-0 bottom-0 w-12 bg-white shadow-lg" />
                        </div>

                        {/* Speed Lines Effect */}
                        <div className="absolute inset-0 pointer-events-none z-40"
                            style={{
                                background: `radial-gradient(circle, transparent 50%, rgba(255,255,255,${Math.min(0.3, speed / 200)}) 100%)`,
                                opacity: speed > 30 ? 1 : 0,
                                transition: 'opacity 0.5s'
                            }}
                        />

                        {/* Objects Container */}
                        <div className="absolute inset-0 flex justify-center items-end pb-24 perspective-origin-center pointer-events-none">

                            {/* Player */}
                            <motion.div
                                className="absolute z-50"
                                animate={{
                                    x: lane * LANE_WIDTH,
                                    y: -yPos,
                                }}
                                transition={{
                                    x: { type: 'spring', stiffness: 400, damping: 25 },
                                    y: { type: 'tween', duration: 0 }
                                }}
                            >
                                <PlayerModel action={action} lane={lane} hasShield={activePowerup === 'shield'} />
                            </motion.div>

                            {/* Obstacles */}
                            <AnimatePresence>
                                {obstacles.map(obs => {
                                    const scale = Math.max(0, (2000 - obs.z) / 2000)
                                    const opacity = obs.z > VISIBLE_DEPTH - 500 ? 0 : 1
                                    const yOffset = obs.z * 0.15

                                    if (obs.hit && obs.type !== 'coin' && obs.type !== 'magnet' && obs.type !== 'shield') return null // Don't hide coins immediately for animation? Actually hide them

                                    return (
                                        <div
                                            key={obs.id}
                                            className="absolute bottom-0 transition-transform duration-0 will-change-transform"
                                            style={{
                                                transform: `translate3d(${obs.lane * LANE_WIDTH * scale}px, ${-yOffset}px, 0) scale(${scale})`,
                                                zIndex: Math.floor(3000 - obs.z),
                                                opacity
                                            }}
                                        >
                                            {obs.type === 'hurdle' && <HurdleModel />}
                                            {obs.type === 'defender' && <DefenderModel />}
                                            {obs.type === 'coin' && !obs.hit && <CoinModel />}
                                            {(obs.type === 'magnet' || obs.type === 'shield') && !obs.hit && <PowerupModel type={obs.type} />}
                                        </div>
                                    )
                                })}
                            </AnimatePresence>

                            {/* Particles */}
                            {particles.map(p => (
                                <div
                                    key={p.id}
                                    className="absolute w-3 h-3 rounded-full pointer-events-none"
                                    style={{
                                        backgroundColor: p.color,
                                        left: `calc(50% + ${lane * LANE_WIDTH}px + ${p.x}px)`,
                                        bottom: p.y,
                                        opacity: p.life,
                                        transform: `scale(${p.life})`
                                    }}
                                />
                            ))}

                        </div>
                    </motion.div>
                </div>

                {/* 3. UI Overlay */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 bg-black/80 p-3 rounded-xl backdrop-blur-md border-2 border-white/10 shadow-xl transform -skew-x-12">
                            <div className="bg-blue-600 p-2 rounded-lg transform skew-x-12">
                                <Shield className="text-white w-6 h-6" />
                            </div>
                            <div className="flex flex-col transform skew-x-12">
                                <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">Score</span>
                                <span className="font-black text-3xl text-white leading-none">{Math.floor(score)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-black/80 p-3 rounded-xl backdrop-blur-md border-2 border-white/10 shadow-xl transform -skew-x-12">
                        <div className="flex flex-col items-end transform skew-x-12">
                            <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider">Coins</span>
                            <span className="font-black text-3xl text-yellow-400 leading-none">{coins}</span>
                        </div>
                        <div className="bg-yellow-600 p-2 rounded-lg transform skew-x-12">
                            <Coins className="text-white w-6 h-6 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 4. Screens */}
                <AnimatePresence>
                    {gameState === 'start' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
                                <Trophy className="w-32 h-32 text-yellow-400 relative z-10 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                            </div>
                            <h1 className="text-7xl font-black text-white italic tracking-tighter mb-2 drop-shadow-2xl">
                                BLITZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">RUSH</span>
                            </h1>
                            <p className="text-2xl text-blue-300 mb-12 font-bold tracking-widest uppercase">Ultimate Edition</p>

                            <div className="grid grid-cols-3 gap-12 mb-12 text-white">
                                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                                        <span className="text-3xl">⬆️</span>
                                    </div>
                                    <span className="font-bold text-sm tracking-wider">JUMP</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                                        <span className="text-3xl">⬇️</span>
                                    </div>
                                    <span className="font-bold text-sm tracking-wider">SLIDE</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                                        <span className="text-3xl">↔️</span>
                                    </div>
                                    <span className="font-bold text-sm tracking-wider">DODGE</span>
                                </div>
                            </div>

                            {progress['blitz-rush']?.highScore > 0 && (
                                <div className="mb-8 bg-yellow-500/20 px-6 py-2 rounded-full border border-yellow-500/50">
                                    <span className="text-yellow-400 font-bold text-xl">High Score: {Math.floor(progress['blitz-rush'].highScore)}</span>
                                </div>
                            )}

                            <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-3xl px-16 py-10 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transform hover:scale-105 transition-all border-4 border-white/20">
                                <Play className="w-10 h-10 mr-4 fill-black" />
                                KICKOFF
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'gameover' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center"
                        >
                            <Skull className="w-32 h-32 text-red-500 mb-6 animate-bounce" />
                            <h2 className="text-6xl font-black text-white mb-4 tracking-tighter">TACKLED!</h2>

                            <div className="grid grid-cols-2 gap-6 mb-10 w-full max-w-md">
                                <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                                    <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Score</p>
                                    <p className="text-5xl font-black text-white">{Math.floor(score)}</p>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                                    <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Coins</p>
                                    <p className="text-5xl font-black text-yellow-400">{coins}</p>
                                </div>
                            </div>

                            {score > (progress['blitz-rush']?.highScore || 0) && (
                                <div className="mb-8 animate-pulse">
                                    <span className="text-yellow-400 font-black text-3xl">NEW HIGH SCORE! 🏆</span>
                                </div>
                            )}

                            <Button onClick={startGame} size="lg" className="bg-white hover:bg-gray-200 text-black font-black text-2xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-105 transition-all">
                                <RotateCcw className="w-8 h-8 mr-3" />
                                TRY AGAIN
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </Card>

            <div className="mt-4 flex justify-between text-white/40 text-xs font-mono uppercase tracking-widest">
                <span>Ver 3.0 - Ultimate Edition</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Magnet className="w-3 h-3" /> Powerups Active</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> Speed Boost</span>
                </div>
            </div>
        </div>
    )
}
