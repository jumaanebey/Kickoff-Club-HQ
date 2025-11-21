'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, Brain, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import confetti from 'canvas-confetti'

// Game Data
const SCENARIOS = [
    {
        id: 1,
        defense: "Cover 2 (Two Deep Safeties)",
        description: "The defense has two safeties deep to protect against long passes. The middle of the field is open, and the linebackers are spread out.",
        answer: "Run Up The Middle",
        options: ["Hail Mary", "Run Up The Middle", "Deep Out Route", "Flea Flicker"],
        explanation: "With two safeties deep, the 'box' (area near the line) is lighter. Running up the middle exploits the lack of numbers in the run defense."
    },
    {
        id: 2,
        defense: "All-Out Blitz (Zero Coverage)",
        description: "The defense is sending everyone! Linebackers and safeties are rushing the QB. There is no help deep.",
        answer: "Screen Pass",
        options: ["Long developing Play Action", "Run Up The Middle", "Screen Pass", "QB Kneel"],
        explanation: "When the defense blitzes, they leave the space behind them open. A screen pass invites the rush in, then dumps the ball over their heads to a runner with blockers."
    },
    {
        id: 3,
        defense: "Goal Line Defense",
        description: "The defense is packed tight near the endzone. All 11 players are close to the line of scrimmage to stop the run.",
        answer: "Play Action Pass",
        options: ["HB Dive", "QB Sneak", "Play Action Pass", "Field Goal"],
        explanation: "Since the defense is selling out to stop the run, faking a run (Play Action) will freeze them just long enough to slip a tight end or receiver into the endzone."
    },
    {
        id: 4,
        defense: "Prevent Defense",
        description: "It's the end of the game. The defense is playing way back to prevent a touchdown. They are giving you short yards.",
        answer: "Short Out Route",
        options: ["Deep Fly Route", "Short Out Route", "Hail Mary", "Run the Clock"],
        explanation: "Take what the defense gives you! If they are playing deep, throw it short, get out of bounds, and move down the field."
    },
    {
        id: 5,
        defense: "Man-to-Man (Single High Safety)",
        description: "Each defender is locked onto a receiver. There is only one safety deep in the middle of the field.",
        answer: "Deep Fade/Go Route",
        options: ["Screen Pass", "Run Up The Middle", "Deep Fade/Go Route", "Spike"],
        explanation: "If you have a fast receiver, this is the time to test the cornerback 1-on-1. If he beats his man, there's no one there to help!"
    }
]

export function PlayCallerGame() {
    const { colors } = useTheme()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [gameOver, setGameOver] = useState(false)

    const handleAnswer = (option: string) => {
        if (selectedOption) return // Prevent multiple clicks

        setSelectedOption(option)
        const correct = option === SCENARIOS[currentQuestion].answer
        setIsCorrect(correct)

        if (correct) {
            setScore(score + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#3b82f6', '#1d4ed8', '#ffffff']
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
                        You scored <span className="font-bold text-blue-500">{score}</span> out of {SCENARIOS.length}
                    </p>

                    <div className="py-4">
                        {score === SCENARIOS.length ? (
                            <p className="text-green-500 font-bold text-xl">Perfect Game! You're a Master Tactician! 🧠</p>
                        ) : score >= 3 ? (
                            <p className="text-blue-500 font-bold text-xl">Great job! You can read a defense!</p>
                        ) : (
                            <p className="text-orange-500 font-bold text-xl">Back to the film room, rookie!</p>
                        )}
                    </div>

                    <Button onClick={resetGame} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 rounded-full">
                        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
                    </Button>
                </motion.div>
            </Card>
        )
    }

    const scenario = SCENARIOS[currentQuestion]

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 flex justify-between items-center text-white/80">
                <span className="font-bold">Scenario {currentQuestion + 1} of {SCENARIOS.length}</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Defense Display */}
                <Card className={cn("p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-blue-500/30 bg-blue-950/50 backdrop-blur-sm text-center")}>
                    <ShieldAlert className="w-20 h-20 text-blue-400 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase">{scenario.defense}</h3>
                    <p className="text-blue-100 text-lg leading-relaxed">{scenario.description}</p>
                </Card>

                {/* Options */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-blue-400" />
                        Choose the Counter Play:
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

                    {/* Explanation & Next Button */}
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
                                    {isCorrect ? "Touchdown! Great call." : "Turnover! Bad read."}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={nextQuestion} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Scenario"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
