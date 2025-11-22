'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Music, Zap, Coins, Trophy, Play, RotateCcw, Crown, Flame } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import { Leaderboard } from './leaderboard'
import { AchievementPopup } from './achievement-popup'

interface Note {
    id: string
    key: string
    lane: number // 0-3 for Q, W, E, R
    y: number
    hit: boolean
}

const KEYS = ['Q', 'W', 'E', 'R']
const LANES = 4
const NOTE_SPEED = 3
const HIT_ZONE_Y = 450
const HIT_TOLERANCE = 30

const PLAYS = [
    { name: 'HB Dive', pattern: ['Q', 'Q', 'W', 'E'], difficulty: 1 },
    { name: 'PA Boot', pattern: ['W', 'E', 'R', 'Q', 'W'], difficulty: 2 },
    { name: 'Slant Post', pattern: ['Q', 'W', 'E', 'R', 'E', 'W'], difficulty: 3 },
    { name: 'Blitz Package', pattern: ['R', 'E', 'W', 'Q', 'R', 'E', 'W', 'Q'], difficulty: 4 },
]

export function SnapReactionGame() {
    const { colors } = useTheme()
    const playSound = useGameSound()
    const gameLoopRef = useRef<number>()
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [coins, setCoins] = useState(0)
    const [combo, setCombo] = useState(0)
    const [maxCombo, setMaxCombo] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [currentPlay, setCurrentPlay] = useState(0)
    const [notes, setNotes] = useState<Note[]>([])
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
    const [totalNotes, setTotalNotes] = useState(0)
    const [hitNotes, setHitNotes] = useState(0)
    const [missedNotes, setMissedNotes] = useState(0)
    const [perfectHits, setPerfectHits] = useState(0)
    const [highScore, setHighScore] = useState(0)

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('snap_reaction_high_score')
        if (saved) setHighScore(parseInt(saved))
    }, [])

    // Generate notes for current play
    const generatePlay = useCallback(() => {
        const play = PLAYS[currentPlay]
        const newNotes: Note[] = []

        play.pattern.forEach((key, index) => {
            const lane = KEYS.indexOf(key)
            newNotes.push({
                id: `${Date.now()}-${index}`,
                key,
                lane,
                y: -100 - (index * 150), // Space them out
                hit: false
            })
        })

        setNotes(newNotes)
        setTotalNotes(prev => prev + newNotes.length)
    }, [currentPlay])

    // Start game and first play
    useEffect(() => {
        if (gameStarted && !gameOver && notes.length === 0) {
            generatePlay()
        }
    }, [gameStarted, gameOver, notes.length, generatePlay])

    // Keyboard controls
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase()
            if (!KEYS.includes(key)) return

            setPressedKeys(prev => new Set(prev).add(key))

            // Check for hits
            setNotes(prev => {
                let hitSomething = false
                const updated = prev.map(note => {
                    if (note.hit || note.key !== key) return note

                    const distance = Math.abs(note.y - HIT_ZONE_Y)

                    if (distance < HIT_TOLERANCE) {
                        hitSomething = true
                        const isPerfect = distance < 15
                        const points = isPerfect ? 200 : distance < 25 ? 100 : 50

                        setScore(s => s + points * (combo + 1))
                        setCoins(c => c + (isPerfect ? 20 : 10))
                        setCombo(c => {
                            const newCombo = c + 1
                            if (newCombo > maxCombo) setMaxCombo(newCombo)
                            return newCombo
                        })
                        setHitNotes(h => h + 1)

                        if (isPerfect) {
                            setPerfectHits(p => p + 1)
                            playSound('win')
                            confetti({
                                particleCount: 20,
                                spread: 40,
                                origin: { x: (note.lane + 0.5) / LANES, y: 0.9 }
                            })
                        } else {
                            playSound('correct')
                        }

                        return { ...note, hit: true }
                    }
                    return note
                })

                if (!hitSomething && KEYS.includes(key)) {
                    // Missed - pressed wrong key or bad timing
                    setCombo(0)
                    playSound('wrong')
                }

                return updated
            })
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase()
            setPressedKeys(prev => {
                const next = new Set(prev)
                next.delete(key)
                return next
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [gameStarted, gameOver, combo, maxCombo, playSound])

    // Game loop - move notes
    useEffect(() => {
        if (!gameStarted || gameOver) return

        const gameLoop = () => {
            setNotes(prev => {
                const updated = prev.map(note => ({
                    ...note,
                    y: note.y + NOTE_SPEED
                }))

                // Check for missed notes
                updated.forEach(note => {
                    if (!note.hit && note.y > HIT_ZONE_Y + HIT_TOLERANCE + 50) {
                        if (!note.hit) {
                            setMissedNotes(m => m + 1)
                            setCombo(0)
                        }
                    }
                })

                // Remove notes that are off screen
                const filtered = updated.filter(note => note.y < 600)

                // If all notes are done, move to next play
                if (filtered.length === 0 && prev.length > 0) {
                    if (currentPlay < PLAYS.length - 1) {
                        setCurrentPlay(c => c + 1)
                    } else {
                        setGameOver(true)
                    }
                }

                return filtered
            })

            gameLoopRef.current = requestAnimationFrame(gameLoop)
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
        }
    }, [gameStarted, gameOver, currentPlay])

    // Calculate accuracy
    useEffect(() => {
        if (totalNotes > 0) {
            setAccuracy(Math.round((hitNotes / totalNotes) * 100))
        }
    }, [hitNotes, totalNotes])

    const { markGameCompleted, unlockedAchievement, clearAchievement } = useGameProgress()

    // Save high score
    useEffect(() => {
        if (gameOver) {
            if (score > highScore) {
                setHighScore(score)
                localStorage.setItem('snap_reaction_high_score', score.toString())
            }
            markGameCompleted('snap-reaction', score, coins)
        }
    }, [gameOver, score, highScore, coins, markGameCompleted])

    const startGame = () => {
        setGameStarted(true)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setCombo(0)
        setMaxCombo(0)
        setAccuracy(100)
        setCurrentPlay(0)
        setNotes([])
        setTotalNotes(0)
        setHitNotes(0)
        setMissedNotes(0)
        setPerfectHits(0)
        playSound('start')
    }

    const resetGame = () => {
        setGameStarted(false)
        setGameOver(false)
        setScore(0)
        setCoins(0)
        setCombo(0)
        setMaxCombo(0)
        setCurrentPlay(0)
        setNotes([])
        setTotalNotes(0)
        setHitNotes(0)
        setMissedNotes(0)
        setPerfectHits(0)
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card className={cn("relative overflow-hidden border-4 bg-gradient-to-b from-purple-600 to-purple-900 shadow-2xl", colors.cardBorder)}>
                {/* Header */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Music className="text-yellow-400 w-6 h-6" />
                        <span className="font-heading text-2xl text-white uppercase tracking-wider">Snap Reaction</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-purple-500 text-white font-bold text-lg px-3">
                            {PLAYS[currentPlay]?.name || 'Complete!'}
                        </Badge>
                        <Badge className="bg-yellow-400 text-black font-bold text-lg px-3">
                            <Coins className="w-4 h-4 mr-1" />
                            {coins}
                        </Badge>
                        {combo > 0 && (
                            <Badge className="bg-orange-500 text-white font-bold text-lg px-3 animate-pulse">
                                <Flame className="w-4 h-4 mr-1" />
                                {combo}x
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Game Area */}
                <div className="relative h-[500px] overflow-hidden bg-gradient-to-b from-gray-900 to-black">
                    {/* Lanes */}
                    <div className="absolute inset-0 flex">
                        {KEYS.map((key, index) => (
                            <div key={key} className="flex-1 border-r border-white/10 last:border-r-0 relative">
                                {/* Lane highlight when pressed */}
                                {pressedKeys.has(key) && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                )}

                                {/* Key label at bottom */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-lg bg-white/10 border-2 border-white/30 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{key}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hit zone indicator */}
                    <div className="absolute w-full h-1 bg-yellow-400/50" style={{ top: `${HIT_ZONE_Y}px` }} />
                    <div className="absolute w-full h-20 border-y-2 border-yellow-400/30" style={{ top: `${HIT_ZONE_Y - 40}px` }} />

                    <AnimatePresence mode="wait">
                        {!gameStarted ? (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <Music className="w-20 h-20 text-purple-400 mb-4" />
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Ready to Execute?</h2>
                                <p className="text-white/80 text-lg mb-2">Press Q, W, E, R keys in rhythm</p>
                                <p className="text-white/80 text-lg mb-8">Hit the notes in the yellow zone!</p>
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
                                <h2 className="text-4xl font-heading text-white font-bold mb-4">Playbook Complete!</h2>
                                <div className="text-center mb-8">
                                    <p className="text-2xl text-white mb-2">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                                    <p className="text-xl text-white mb-2">Accuracy: <span className={cn("font-bold", accuracy >= 90 ? "text-green-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-400")}>{accuracy}%</span></p>
                                    <p className="text-xl text-white mb-2">Max Combo: <span className="text-orange-400 font-bold">{maxCombo}x</span></p>
                                    <p className="text-xl text-white mb-2">Perfect Hits: <span className="text-purple-400 font-bold">{perfectHits}</span></p>
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
                                    <Leaderboard gameId="snap-reaction" limit={5} />
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Notes */}
                                {notes.map(note => (
                                    <motion.div
                                        key={note.id}
                                        className={cn(
                                            "absolute w-20 h-12 rounded-lg flex items-center justify-center font-bold text-xl border-2 transition-all",
                                            note.hit ? "bg-green-500 border-green-400 text-white scale-110" : "bg-purple-500 border-purple-400 text-white"
                                        )}
                                        style={{
                                            left: `${(note.lane / LANES) * 100}%`,
                                            top: `${note.y}px`,
                                            marginLeft: 'calc(25% - 40px)'
                                        }}
                                        animate={note.hit ? { opacity: 0, scale: 1.5 } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {note.key}
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

                {/* Footer */}
                <div className="relative z-10 bg-black/40 p-4 flex justify-between items-center border-t border-white/10">
                    <div className="text-white/80 text-sm">
                        Score: <span className="text-white font-bold">{score}</span>
                    </div>
                    <div className="text-white/80 text-sm">
                        Accuracy: <span className={cn("font-bold", accuracy >= 90 ? "text-green-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-400")}>{accuracy}%</span>
                    </div>
                    <div className="text-white/80 text-sm">
                        Play: <span className="text-purple-400 font-bold">{currentPlay + 1}/{PLAYS.length}</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
