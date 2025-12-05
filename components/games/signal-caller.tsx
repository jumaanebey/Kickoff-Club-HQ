'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, User, CheckCircle2, XCircle, Hand, Clock, Flame } from 'lucide-react'
import confetti from 'canvas-confetti'

import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'

// ... (RefereeSignal component remains the same)
const RefereeSignal = ({ type }: { type: string }) => {
    // Base body
    const body = (
        <>
            <circle cx="50" cy="20" r="10" className="fill-white" /> {/* Head */}
            <path d="M 50 30 L 50 70" className="stroke-white stroke-[4]" /> {/* Torso */}
            <path d="M 50 70 L 30 100" className="stroke-white stroke-[4]" /> {/* Left Leg */}
            <path d="M 50 70 L 70 100" className="stroke-white stroke-[4]" /> {/* Right Leg */}
        </>
    )

    let arms = null

    switch (type) {
        case 'touchdown':
            arms = <path d="M 50 40 L 30 10 M 50 40 L 70 10" className="stroke-white stroke-[4]" />
            break
        case 'incomplete':
            arms = <path d="M 20 40 L 80 40" className="stroke-white stroke-[4]" />
            break
        case 'holding':
            arms = (
                <>
                    <path d="M 50 40 L 30 50" className="stroke-white stroke-[4]" /> {/* Left arm down */}
                    <path d="M 50 40 L 40 30" className="stroke-white stroke-[4]" /> {/* Right arm up grasping */}
                    <circle cx="30" cy="50" r="3" className="fill-white" /> {/* Fist */}
                </>
            )
            break
        case 'false_start':
            arms = (
                <>
                    <path d="M 50 40 L 40 50" className="stroke-white stroke-[4]" />
                    <path d="M 50 40 L 60 50" className="stroke-white stroke-[4]" />
                    <circle cx="40" cy="50" r="5" className="stroke-white stroke-[2] fill-none animate-spin" />
                    <circle cx="60" cy="50" r="5" className="stroke-white stroke-[2] fill-none animate-spin" />
                </>
            )
            break
        case 'offside':
            arms = <path d="M 50 40 L 35 50 M 50 40 L 65 50" className="stroke-white stroke-[4]" /> // Hands on hips roughly
            break
        case 'timeout':
            arms = <path d="M 30 30 L 70 50 M 70 30 L 30 50" className="stroke-white stroke-[4]" /> // Criss cross
            break
        default:
            arms = <path d="M 30 50 L 70 50" className="stroke-white stroke-[4]" />
    }

    return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
            {body}
            {arms}
        </svg>
    )
}

const SCENARIOS = [
    {
        id: 1,
        name: "Arms straight up!",
        type: "touchdown",
        answer: "Touchdown (We Scored!)",
        options: ["Touchdown (We Scored!)", "Stop the Game", "Penalty", "Incomplete Pass"],
        explanation: "Touchdown! This signal means a team has scored 6 points (or a Field Goal for 3)."
    },
    {
        id: 2,
        name: "Waving arms side to side!",
        type: "incomplete",
        answer: "Incomplete Pass (No Catch)",
        options: ["Touchdown", "Incomplete Pass (No Catch)", "Timeout", "First Down"],
        explanation: "This means 'No Good'. The pass was not caught, or the kick missed."
    },
    {
        id: 3,
        name: "Criss-crossing arms!",
        type: "timeout",
        answer: "Timeout (Stop the Clock)",
        options: ["Touchdown", "Penalty", "Timeout (Stop the Clock)", "Fight"],
        explanation: "Timeout! The referee stops the clock so the teams can rest or talk."
    },
    {
        id: 4,
        name: "Throwing a Yellow Flag!",
        type: "holding", // Use holding visual but context is flag
        answer: "Penalty (Rule Broken)",
        options: ["Touchdown", "Game Over", "Penalty (Rule Broken)", "Halftime"],
        explanation: "When you see a Yellow Flag, it means a rule was broken. The referee will explain the penalty."
    },
    {
        id: 5,
        name: "Rolling fists!",
        type: "false_start",
        answer: "False Start (Moved too early)",
        options: ["Holding", "False Start (Moved too early)", "Touchdown", "Good Job"],
        explanation: "False Start! An offensive player moved before the ball was snapped. 5 yard penalty."
    }
]

const TIME_PER_QUESTION = 10

export function SignalCallerGame() {
    const { colors } = useTheme()
    const { playSound } = useGameSound()
    const { markGameCompleted, progress } = useGameProgress()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [gameOver, setGameOver] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)

    // New State
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (gameStarted && !gameOver && !selectedOption && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!)
                        handleTimeOut()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [gameStarted, gameOver, selectedOption, timeLeft])

    const handleTimeOut = () => {
        setSelectedOption("TIMEOUT")
        setIsCorrect(false)
        setStreak(0)
        playSound('wrong')
    }

    const handleAnswer = (option: string) => {
        if (selectedOption) return

        if (timerRef.current) clearInterval(timerRef.current)

        setSelectedOption(option)
        const correct = option === SCENARIOS[currentQuestion].answer
        setIsCorrect(correct)

        if (correct) {
            playSound('correct')
            setScore(score + 1)
            setStreak(s => {
                const newStreak = s + 1
                setMaxStreak(ms => Math.max(ms, newStreak))
                return newStreak
            })
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#ef4444', '#b91c1c', '#ffffff']
            })
        } else {
            playSound('wrong')
            setStreak(0)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion + 1 < SCENARIOS.length) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(null)
            setIsCorrect(null)
            setTimeLeft(TIME_PER_QUESTION)
        } else {
            setGameOver(true)
            markGameCompleted('signal-caller', score)
            if (score === SCENARIOS.length) {
                playSound('win')
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#ef4444', '#b91c1c', '#ffffff']
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
        setTimeLeft(TIME_PER_QUESTION)
        setStreak(0)
    }

    if (!gameStarted) {
        return (
            <Card className={cn("w-full max-w-2xl p-8 text-center backdrop-blur-xl border-2 mx-auto", colors.card, colors.cardBorder)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Hand className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Signal Caller</h2>
                    <p className={cn("text-xl max-w-md mx-auto", colors.textMuted)}>
                        What is the referee saying? Learn the signals and make the call before time runs out!
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-8">
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">5</div>
                            <div className="text-xs text-white/50 uppercase">Levels</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">IQ</div>
                            <div className="text-xs text-white/50 uppercase">Signals</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">XP</div>
                            <div className="text-xs text-white/50 uppercase">Rewards</div>
                        </div>
                    </div>
                    <Button onClick={() => {
                        setGameStarted(true)
                        playSound('start')
                    }} size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-12 py-6 rounded-full shadow-lg shadow-red-900/20 transition-all hover:scale-105">
                        Start Game
                    </Button>
                </motion.div>
            </Card>
        )
    }

    if (gameOver) {
        return (
            <Card className={cn("w-full max-w-2xl p-8 text-center backdrop-blur-xl border-2 mx-auto", colors.card, colors.cardBorder)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <Trophy className="w-24 h-24 mx-auto text-red-400 mb-4" />
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Game Over!</h2>
                    <p className={cn("text-2xl", colors.textMuted)}>
                        You scored <span className="font-bold text-red-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <div className="flex justify-center gap-8 text-white/60">
                        <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span>Max Streak: {maxStreak}</span>
                        </div>
                        {progress['signal-caller']?.highScore > 0 && (
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span>Best: {progress['signal-caller'].highScore}</span>
                            </div>
                        )}
                    </div>
                    <Button onClick={() => {
                        resetGame()
                        playSound('click')
                    }} size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 rounded-full">
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
                <div className="flex items-center gap-4">
                    <span className="font-bold">Signal {currentQuestion + 1} of {SCENARIOS.length}</span>
                    {streak > 1 && (
                        <div className="flex items-center gap-1 text-orange-400 font-bold animate-pulse">
                            <Flame className="w-4 h-4" />
                            <span>{streak} Streak!</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full font-mono transition-colors",
                        timeLeft <= 3 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-white/10"
                    )}>
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}s</span>
                    </div>
                    <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Signal Display */}
                <Card className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-black/50 border-2 border-white/20 text-center relative overflow-hidden">
                    {/* Timer Progress Bar */}
                    <motion.div
                        className="absolute top-0 left-0 h-1 bg-red-500"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />

                    <div className="w-48 h-48 mb-6 bg-white/5 rounded-full p-4">
                        <RefereeSignal type={scenario.type} />
                    </div>
                    <p className="text-white/80 text-lg italic">"{scenario.name}"</p>
                </Card>

                {/* Options */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <User className="w-6 h-6 text-yellow-400" />
                        What's the Call?
                    </h3>

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
                                    {isCorrect ? "Correct Call!" : selectedOption === "TIMEOUT" ? "Time's Up!" : "Wrong Signal!"}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={() => {
                                    nextQuestion()
                                    playSound('click')
                                }} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Signal"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
