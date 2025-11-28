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
    }
]

export function ClockManagerGame() {
    const { colors } = useTheme()
    const { playSound } = useGameSound()
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
        } else {
            playSound('wrong')
        }
    }

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
        </div>
    )
}
