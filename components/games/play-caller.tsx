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
        defense: "We need 1 yard for a First Down!",
        description: "It's 3rd Down and 1. The defense is worried about a long pass. We just need a tiny bit of distance.",
        answer: "Run Up The Middle",
        options: ["Hail Mary Pass", "Run Up The Middle", "Punt", "Kneel"],
        explanation: "When you only need a short distance, a strong run up the middle is the safest way to get it!"
    },
    {
        id: 2,
        defense: "We need 50 yards for a Touchdown!",
        description: "There are only 10 seconds left in the game! We are far away from the endzone.",
        answer: "Hail Mary Pass",
        options: ["Run Up The Middle", "QB Sneak", "Hail Mary Pass", "Spike"],
        explanation: "We need a big play! A 'Hail Mary' is a long pass to the endzone. It's risky, but it's our only hope!"
    },
    {
        id: 3,
        defense: "It's 4th Down and we are FAR away.",
        description: "We didn't get the First Down. If we try and fail, the other team gets the ball right here. What should we do?",
        answer: "Punt",
        options: ["Go for it", "Punt", "Field Goal", "Pass"],
        explanation: "Punt the ball! Kick it far away to the other team so they have to start from the other side of the field."
    },
    {
        id: 4,
        defense: "It's 4th Down and we are CLOSE.",
        description: "We are very close to the endzone, but it's 4th down. We can get 3 points easily.",
        answer: "Field Goal",
        options: ["Punt", "Run", "Field Goal", "Interception"],
        explanation: "Kick the Field Goal! It's better to take the guaranteed 3 points than risk getting nothing."
    },
    {
        id: 5,
        defense: "The game is over and we are winning!",
        description: "There is 1 minute left. The other team has no timeouts. We have the ball.",
        answer: "Kneel Down",
        options: ["Throw a deep pass", "Run for a touchdown", "Kneel Down", "Punt"],
        explanation: "Victory Formation! The Quarterback kneels down to let the clock run out. We win!"
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
