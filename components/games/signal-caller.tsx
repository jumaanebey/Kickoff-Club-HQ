'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, User, CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

// Helper to draw referee signals
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

export function SignalCallerGame() {
    const { colors } = useTheme()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [gameOver, setGameOver] = useState(false)

    const handleAnswer = (option: string) => {
        if (selectedOption) return

        setSelectedOption(option)
        const correct = option === SCENARIOS[currentQuestion].answer
        setIsCorrect(correct)

        if (correct) {
            setScore(score + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#facc15', '#ca8a04', '#ffffff']
            })
        }
    }

    const nextQuestion = () => {
        if (currentQuestion + 1 < SCENARIOS.length) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(null)
            setIsCorrect(null)
        } else {
            setGameOver(true)
            if (score === SCENARIOS.length) {
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
    }

    if (gameOver) {
        return (
            <Card className={cn("w-full max-w-2xl p-8 text-center backdrop-blur-xl border-2", colors.card, colors.cardBorder)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Game Over!</h2>
                    <p className={cn("text-2xl", colors.textMuted)}>
                        You scored <span className="font-bold text-yellow-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <Button onClick={resetGame} size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg px-8 rounded-full">
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
                <span className="font-bold">Signal {currentQuestion + 1} of {SCENARIOS.length}</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Signal Display */}
                <Card className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-black/50 border-2 border-white/20 text-center">
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
                                    {isCorrect ? "Correct Call!" : "Wrong Signal!"}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={nextQuestion} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
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
