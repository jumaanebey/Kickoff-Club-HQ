'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, Timer, CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

const SCENARIOS = [
    {
        id: 1,
        situation: "Down by 4 points. 0:45 left in 4th Quarter. No timeouts. You just ran for a 1st down and were tackled IN BOUNDS.",
        clock: "0:45",
        score: "Opponent 24 - You 20",
        answer: "Spike the Ball",
        options: ["Call Timeout", "Spike the Ball", "Huddle Up", "Hail Mary"],
        explanation: "Since you have no timeouts and the clock is running, you must spike the ball immediately to stop the clock and save time for the next plays."
    },
    {
        id: 2,
        situation: "Up by 3 points. 1:50 left in 4th Quarter. Opponent has 0 timeouts. It's 1st and 10.",
        clock: "1:50",
        score: "You 27 - Opponent 24",
        answer: "Kneel / Run Clock",
        options: ["Throw Deep", "Run Outside", "Kneel / Run Clock", "Quick Slant"],
        explanation: "The opponent cannot stop the clock. If you kneel 3 times, the game ends. Don't risk a turnover or stopping the clock!"
    },
    {
        id: 3,
        situation: "Down by 6 points. 0:08 left in 4th Quarter. Ball on opponent's 40 yard line. 4th Down.",
        clock: "0:08",
        score: "Opponent 30 - You 24",
        answer: "Hail Mary",
        options: ["Field Goal", "Screen Pass", "Hail Mary", "Punt"],
        explanation: "This is the last play of the game. You need a touchdown to win. Throw it deep to the endzone and pray!"
    },
    {
        id: 4,
        situation: "Down by 2 points. 0:03 left in 4th Quarter. Ball on opponent's 20 yard line. 4th Down.",
        clock: "0:03",
        score: "Opponent 21 - You 19",
        answer: "Field Goal",
        options: ["Hail Mary", "QB Sneak", "Field Goal", "Spike"],
        explanation: "You are in easy field goal range. Kick the 3 points as time expires to win 22-21."
    },
    {
        id: 5,
        situation: "Tie Game. 0:25 left in 4th Quarter. You are on your own 5 yard line. 3rd and 10.",
        clock: "0:25",
        score: "You 17 - Opponent 17",
        answer: "Kneel / Play for OT",
        options: ["Throw Deep", "Kneel / Play for OT", "Flea Flicker", "Go for it"],
        explanation: "You are backed up deep in your own territory. A turnover here gives the opponent an easy win. Play it safe and go to Overtime."
    }
]

export function ClockManagerGame() {
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
                colors: ['#ef4444', '#b91c1c', '#ffffff']
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
                        You scored <span className="font-bold text-red-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <Button onClick={resetGame} size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 rounded-full">
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
                        </div>
                    </div>
                </Card>

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
