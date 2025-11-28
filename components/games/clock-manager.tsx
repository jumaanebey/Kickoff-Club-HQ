<<<<<<< HEAD
"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Timer, Play, Pause, Trophy, ArrowRight, AlertTriangle, Flag } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'
import Link from 'next/link'
import { cn } from '@/shared/utils'

type GameState = 'start' | 'playing' | 'won' | 'lost'

interface GameScenario {
    id: string
    description: string
    timeLeft: number
    score: { us: number, them: number }
    ballOn: number // Yard line (0-100, 100 is TD)
    down: number
    toGo: number
    timeouts: number
    difficulty: 'Rookie' | 'Pro' | 'All-Madden'
}

const SCENARIOS: GameScenario[] = [
    {
        id: '1',
        description: "The Classic Drive",
        timeLeft: 120,
        score: { us: 20, them: 24 },
        ballOn: 20,
        down: 1,
        toGo: 10,
        timeouts: 3,
        difficulty: 'Rookie'
    },
    {
        id: '2',
        description: "No Timeouts Left",
        timeLeft: 45,
        score: { us: 17, them: 20 },
        ballOn: 40,
        down: 1,
        toGo: 10,
        timeouts: 0,
        difficulty: 'Pro'
    },
    {
        id: '3',
        description: "Hail Mary Time",
        timeLeft: 10,
        score: { us: 21, them: 27 },
        ballOn: 50,
        down: 4,
        toGo: 10,
        timeouts: 1,
        difficulty: 'All-Madden'
=======
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, Timer, CheckCircle2, XCircle, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'

import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'

const SCENARIOS = [
    {
        id: 1,
        situation: "The game is about to start! Both teams are on the field.",
        clock: "15:00",
        score: "0 - 0",
        answer: "Kickoff",
        options: ["Kickoff", "Punt", "Timeout", "Halftime"],
        explanation: "Every game starts with a Kickoff! One team kicks the ball to the other to start the play."
    },
    {
        id: 2,
        situation: "We just scored a Touchdown! (6 Points). What do we do next?",
        clock: "10:00",
        score: "6 - 0",
        answer: "Extra Point Kick",
        options: ["Kickoff", "Extra Point Kick", "Go Home", "Punt"],
        explanation: "After a Touchdown, you get a chance to kick the ball through the posts for 1 extra point!"
    },
    {
        id: 3,
        situation: "The clock hit 0:00 in the 2nd Quarter. The players are leaving the field.",
        clock: "0:00",
        score: "14 - 7",
        answer: "Halftime",
        options: ["Game Over", "Halftime", "Timeout", "Sudden Death"],
        explanation: "Halftime happens in the middle of the game. Players go to the locker room to rest and talk strategy."
    },
    {
        id: 4,
        situation: "The referee is flipping a coin before the game.",
        clock: "PRE",
        score: "0 - 0",
        answer: "Call Heads or Tails",
        options: ["Kick the ball", "Call Heads or Tails", "Run a play", "Cheer"],
        explanation: "The Coin Toss decides who gets the ball first. The captains call Heads or Tails!"
    },
    {
        id: 5,
        situation: "The game is over! The clock is at 0:00 in the 4th Quarter.",
        clock: "0:00",
        score: "21 - 17",
        answer: "Shake Hands",
        options: ["Keep Playing", "Shake Hands", "Call Timeout", "Punt"],
        explanation: "Good game! When the game ends, players shake hands with the other team to show good sportsmanship."
>>>>>>> origin/main
    }
]

export function ClockManagerGame() {
    const { colors } = useTheme()
<<<<<<< HEAD
    const { playSound } = useGameSound()
    const { markGameCompleted, progress } = useGameProgress()

    const [gameState, setGameState] = useState<GameState>('start')
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)

    // Game State
    const [timeLeft, setTimeLeft] = useState(0)
    const [ballOn, setBallOn] = useState(0)
    const [down, setDown] = useState(1)
    const [toGo, setToGo] = useState(10)
    const [timeouts, setTimeouts] = useState(0)
    const [gameLog, setGameLog] = useState<string[]>([])
    const [isClockRunning, setIsClockRunning] = useState(false)

    const scenario = SCENARIOS[currentScenarioIndex]

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (gameState === 'playing' && isClockRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleGameOver('lost')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [gameState, isClockRunning, timeLeft])

    const startGame = () => {
        const s = SCENARIOS[currentScenarioIndex]
        setTimeLeft(s.timeLeft)
        setBallOn(s.ballOn)
        setDown(s.down)
        setToGo(s.toGo)
        setTimeouts(s.timeouts)
        setGameLog([`Starting drive at own ${s.ballOn} yard line.`])
        setGameState('playing')
        setIsClockRunning(true)
        playSound('start')
    }

    const handleGameOver = (result: 'won' | 'lost') => {
        setGameState(result)
        setIsClockRunning(false)
        if (result === 'won') {
            playSound('win')
            markGameCompleted('clock-manager', 100, 50)
=======
    const playSound = useGameSound()
    const { markGameCompleted } = useGameProgress()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [gameOver, setGameOver] = useState(false)

    const [gameStarted, setGameStarted] = useState(false)

    const handleAnswer = (option: string) => {
        if (selectedOption) return

        setSelectedOption(option)
        const correct = option === SCENARIOS[currentQuestion].answer
        setIsCorrect(correct)

        if (correct) {
            playSound('correct')
            setScore(score + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#f97316', '#ea580c', '#ffffff']
            })
>>>>>>> origin/main
        } else {
            playSound('wrong')
        }
    }

<<<<<<< HEAD
    const handleAction = (action: 'spike' | 'timeout' | 'pass_short' | 'pass_deep' | 'run') => {
        if (gameState !== 'playing') return

        let timeConsumed = 0
        let yardsGained = 0
        let newClockRunning = true
        let logMessage = ""

        switch (action) {
            case 'spike':
                if (down === 4) {
                    handleGameOver('lost') // Turnover on downs
                    return
                }
                timeConsumed = 1
                yardsGained = 0
                setDown(d => d + 1)
                newClockRunning = false
                logMessage = "Spiked the ball! Clock stopped."
                break

            case 'timeout':
                if (timeouts > 0) {
                    setTimeouts(t => t - 1)
                    newClockRunning = false
                    logMessage = "Timeout called! Clock stopped."
                } else {
                    return // Can't call timeout
                }
                break

            case 'pass_short':
                timeConsumed = Math.floor(Math.random() * 4) + 3 // 3-6 seconds
                if (Math.random() > 0.2) { // 80% completion
                    yardsGained = Math.floor(Math.random() * 8) + 2 // 2-9 yards
                    // 30% chance to get out of bounds
                    if (Math.random() < 0.3) {
                        newClockRunning = false
                        logMessage = `Pass complete for ${yardsGained} yards! Out of bounds.`
                    } else {
                        logMessage = `Pass complete for ${yardsGained} yards. Clock running.`
                    }
                } else {
                    timeConsumed = 2 // Incomplete takes less time
                    newClockRunning = false
                    logMessage = "Incomplete pass!"
                }
                setDown(d => d + 1)
                break

            case 'pass_deep':
                timeConsumed = Math.floor(Math.random() * 5) + 5 // 5-9 seconds
                if (Math.random() > 0.5) { // 50% completion
                    yardsGained = Math.floor(Math.random() * 20) + 15 // 15-34 yards
                    logMessage = `Deep pass complete for ${yardsGained} yards!`
                } else {
                    timeConsumed = 3
                    newClockRunning = false
                    logMessage = "Deep pass incomplete!"
                }
                setDown(d => d + 1)
                break

            case 'run':
                timeConsumed = Math.floor(Math.random() * 4) + 2
                yardsGained = Math.floor(Math.random() * 6) + 1
                logMessage = `Run for ${yardsGained} yards.`
                setDown(d => d + 1)
                break
        }

        // Update State
        setTimeLeft(t => Math.max(0, t - timeConsumed))
        setIsClockRunning(newClockRunning)
        setGameLog(prev => [logMessage, ...prev].slice(0, 5))

        // Check Yardage
        const newBallOn = ballOn + yardsGained
        setBallOn(newBallOn)

        // Check First Down
        if (yardsGained >= toGo) {
            setDown(1)
            setToGo(10)
            // Clock stops briefly on 1st down in college/some rules, but let's keep it running for NFL style unless out of bounds
            if (action === 'run' || (action.startsWith('pass') && newClockRunning)) {
                // Clock keeps running
            }
        } else {
            setToGo(t => t - yardsGained)
        }

        // Check Touchdown
        if (newBallOn >= 100) {
            handleGameOver('won')
        }
        // Check Turnover on Downs
        else if (down > 4) {
            handleGameOver('lost')
        }
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    if (gameState === 'start') {
        return (
            <Card className="w-full max-w-2xl mx-auto p-8 bg-slate-900 border-slate-800 text-white">
                <div className="text-center space-y-6">
                    <Timer className="w-20 h-20 mx-auto text-yellow-500" />
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Clock <span className="text-yellow-500">Manager</span>
                    </h1>
                    <p className="text-xl text-slate-400">
                        Master the Two-Minute Drill. Make the right calls to score before time runs out!
                    </p>

                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-left space-y-4">
                        <h3 className="font-bold text-lg text-yellow-400">Scenario: {scenario.description}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Time Left:</span>
                                <span className="font-mono font-bold">{formatTime(scenario.timeLeft)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Timeouts:</span>
                                <span className="font-bold">{scenario.timeouts}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Score:</span>
                                <span>Us {scenario.score.us} - {scenario.score.them} Them</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Ball On:</span>
                                <span>Own {scenario.ballOn}</span>
                            </div>
                        </div>
                    </div>

                    <Button onClick={startGame} size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-6">
                        Start Drive
                    </Button>
                </div>
=======
    const nextQuestion = () => {
        if (currentQuestion + 1 < SCENARIOS.length) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(null)
            setIsCorrect(null)
        } else {
            setGameOver(true)
            markGameCompleted('clock-manager', score)
            if (score === SCENARIOS.length) {
                playSound('win')
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                })
            }
        }
    }

    const resetGame = () => {
        setCurrentQuestion(0)
        setScore(0)
        setGameOver(false)
        setSelectedOption(null)
        setIsCorrect(null)
        setGameStarted(false)
    }

    if (!gameStarted) {
        return (
            <Card className={cn("w-full max-w-2xl p-8 text-center backdrop-blur-xl border-2 mx-auto", colors.card, colors.cardBorder)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-orange-400" />
                    </div>
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Game Flow</h2>
                    <p className={cn("text-xl max-w-md mx-auto", colors.textMuted)}>
                        From Kickoff to the final whistle. Do you know how the game works?
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-8">
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-orange-400">5</div>
                            <div className="text-xs text-white/50 uppercase">Levels</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-orange-400">IQ</div>
                            <div className="text-xs text-white/50 uppercase">Flow</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-orange-400">XP</div>
                            <div className="text-xs text-white/50 uppercase">Rewards</div>
                        </div>
                    </div>
                    <Button onClick={() => {
                        setGameStarted(true)
                        playSound('start')
                    }} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-12 py-6 rounded-full shadow-lg shadow-orange-900/20 transition-all hover:scale-105">
                        Start Game
                    </Button>
                </motion.div>
>>>>>>> origin/main
            </Card>
        )
    }

<<<<<<< HEAD
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Scoreboard */}
            <div className="bg-black border-4 border-slate-800 rounded-xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                <div className="relative z-10 grid grid-cols-3 gap-8 items-center text-center">
                    {/* Home */}
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">Home</div>
                        <div className="text-4xl font-black text-white font-mono">{scenario.score.them}</div>
                    </div>

                    {/* Clock */}
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                        <div className={cn("text-5xl font-black font-mono tracking-widest", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-yellow-500")}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex justify-center gap-2 mt-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={cn("w-3 h-3 rounded-full", i < timeouts ? "bg-yellow-500" : "bg-slate-800")} />
                            ))}
                        </div>
                    </div>

                    {/* Away (Us) */}
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">Away</div>
                        <div className="text-4xl font-black text-white font-mono">{scenario.score.us}</div>
                    </div>
                </div>

                {/* Field Position Indicator */}
                <div className="mt-6 relative h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 bottom-0 bg-green-500 transition-all duration-500"
                        style={{ left: `${ballOn}%`, width: '2px' }}
                    />
                    <div
                        className="absolute top-0 bottom-0 bg-yellow-500/30 transition-all duration-500"
                        style={{ left: `${ballOn}%`, width: `${Math.min(100 - ballOn, toGo)}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                    <span>Own 0</span>
                    <span>50</span>
                    <span>TD</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Controls */}
                <Card className="bg-slate-900 border-slate-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <span className="text-2xl font-bold text-white">{down === 1 ? "1st" : down === 2 ? "2nd" : down === 3 ? "3rd" : "4th"} & {toGo}</span>
                            <div className="text-slate-400 text-sm">Ball on {ballOn > 50 ? `Opp ${100 - ballOn}` : `Own ${ballOn}`}</div>
                        </div>
                        <div className="text-right">
                            <div className={cn("text-sm font-bold uppercase flex items-center gap-2", isClockRunning ? "text-green-500" : "text-red-500")}>
                                {isClockRunning ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                {isClockRunning ? "Clock Running" : "Clock Stopped"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => handleAction('pass_short')}
                            disabled={gameState !== 'playing'}
                            className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-1"
                        >
                            <ArrowRight className="w-6 h-6" />
                            <span className="font-bold">Short Pass</span>
                            <span className="text-xs opacity-70">Low Risk • 3-6s</span>
                        </Button>
                        <Button
                            onClick={() => handleAction('pass_deep')}
                            disabled={gameState !== 'playing'}
                            className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-1"
                        >
                            <ArrowRight className="w-6 h-6 -rotate-45" />
                            <span className="font-bold">Deep Pass</span>
                            <span className="text-xs opacity-70">High Risk • 5-9s</span>
                        </Button>
                        <Button
                            onClick={() => handleAction('run')}
                            disabled={gameState !== 'playing'}
                            className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center gap-1"
                        >
                            <ArrowRight className="w-6 h-6" />
                            <span className="font-bold">Run Ball</span>
                            <span className="text-xs opacity-70">Safe • Clock Runs</span>
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={() => handleAction('spike')}
                                disabled={gameState !== 'playing'}
                                variant="outline"
                                className="h-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex flex-col gap-1"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-bold text-xs">SPIKE</span>
                            </Button>
                            <Button
                                onClick={() => handleAction('timeout')}
                                disabled={gameState !== 'playing' || timeouts === 0}
                                variant="outline"
                                className="h-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black flex flex-col gap-1"
                            >
                                <Timer className="w-4 h-4" />
                                <span className="font-bold text-xs">TIMEOUT</span>
                            </Button>
=======
    if (gameOver) {
        return (
            <Card className={cn("w-full max-w-2xl p-8 text-center backdrop-blur-xl border-2 mx-auto", colors.card, colors.cardBorder)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Game Over!</h2>
                    <p className={cn("text-2xl", colors.textMuted)}>
                        You scored <span className="font-bold text-orange-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <Button onClick={() => {
                        resetGame()
                        playSound('click')
                    }} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 rounded-full">
                        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
                    </Button>
                </motion.div>
            </Card>
        )
    }

    const scenario = SCENARIOS[currentQuestion]

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-center text-white/80">
                <span className="font-bold">Scenario {currentQuestion + 1} of {SCENARIOS.length}</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Scoreboard Display */}
                <Card className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-black border-4 border-gray-800 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />

                    <div className="relative z-10 w-full space-y-8">
                        <div className="flex justify-between items-center border-b-2 border-red-900/50 pb-4">
                            <div className="text-red-500 font-mono text-xl">HOME</div>
                            <div className="text-red-500 font-mono text-xl">GUEST</div>
                        </div>

                        <div className="text-6xl font-black font-mono text-red-600 tracking-widest animate-pulse">
                            {scenario.clock}
                        </div>

                        <div className="text-red-400 font-mono text-lg">
                            {scenario.score}
>>>>>>> origin/main
                        </div>
                    </div>
                </Card>

<<<<<<< HEAD
                {/* Game Log */}
                <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Play-by-Play</h3>
                    <div className="flex-1 space-y-3">
                        {gameLog.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn("p-3 rounded-lg text-sm border-l-4", i === 0 ? "bg-slate-800 border-yellow-500 text-white" : "bg-slate-800/50 border-slate-700 text-slate-400")}
                            >
                                {log}
                            </motion.div>
                        ))}
                        {gameLog.length === 0 && (
                            <div className="text-slate-600 text-center italic mt-10">Waiting for snap...</div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Game Over Overlay */}
            <AnimatePresence>
                {gameState === 'won' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-md bg-slate-900 border-yellow-500 border-2 p-8 text-center">
                            <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6 animate-bounce" />
                            <h2 className="text-4xl font-black text-white mb-2">TOUCHDOWN!</h2>
                            <p className="text-slate-400 mb-8">You managed the clock perfectly and led your team to victory!</p>
                            <Button onClick={() => {
                                setCurrentScenarioIndex(prev => (prev + 1) % SCENARIOS.length)
                                setGameState('start')
                            }} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg">
                                Next Scenario
                            </Button>
                        </Card>
                    </motion.div>
                )}
                {gameState === 'lost' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-md bg-slate-900 border-red-500 border-2 p-8 text-center">
                            <Flag className="w-24 h-24 mx-auto text-red-500 mb-6" />
                            <h2 className="text-4xl font-black text-white mb-2">GAME OVER</h2>
                            <p className="text-slate-400 mb-8">Time ran out or you turned the ball over. The drive stalled.</p>
                            <Button onClick={() => setGameState('start')} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg">
                                Try Again
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
=======
                {/* Options */}
                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Timer className="w-5 h-5 text-red-400" />
                            Situation:
                        </h3>
                        <p className="text-white/90 leading-relaxed">{scenario.situation}</p>
                    </div>

                    <div className="grid gap-3">
                        {scenario.options.map((option, idx) => (
                            <Button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={selectedOption !== null}
                                className={cn(
                                    "h-auto py-4 text-lg justify-start px-6 transition-all",
                                    selectedOption === null
                                        ? "bg-white/10 hover:bg-white/20 text-white border-2 border-transparent"
                                        : option === scenario.answer
                                            ? "bg-green-500 text-white border-green-400"
                                            : selectedOption === option
                                                ? "bg-red-500 text-white border-red-400"
                                                : "bg-white/5 text-white/50"
                                )}
                            >
                                <span className="mr-4 font-mono opacity-50">{idx + 1}.</span>
                                {option}
                                {selectedOption && option === scenario.answer && (
                                    <CheckCircle2 className="ml-auto h-6 w-6" />
                                )}
                                {selectedOption === option && option !== scenario.answer && (
                                    <XCircle className="ml-auto h-6 w-6" />
                                )}
                            </Button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedOption && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "mt-6 p-6 rounded-xl border-l-4",
                                    isCorrect ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
                                )}
                            >
                                <h4 className={cn("font-bold mb-2 flex items-center gap-2", isCorrect ? "text-green-400" : "text-red-400")}>
                                    {isCorrect ? "Great Clock Management!" : "Game Over! Time Expired."}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={() => {
                                    nextQuestion()
                                    playSound('click')
                                }} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Scenario"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
>>>>>>> origin/main
        </div>
    )
}
