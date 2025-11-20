'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, Flag, CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

// Game Data
const SCENARIOS = [
    {
        id: 1,
        text: "The offensive lineman moves his hand before the ball is snapped.",
        answer: "False Start",
        options: ["Offside", "False Start", "Holding", "Illegal Motion"],
        explanation: "When an offensive player simulates the start of the play before the snap, it's a False Start. 5-yard penalty."
    },
    {
        id: 2,
        text: "A defender crosses the line of scrimmage and touches an offensive player before the snap.",
        answer: "Encroachment",
        options: ["Offside", "Neutral Zone Infraction", "Encroachment", "Holding"],
        explanation: "If a defender touches an opponent before the snap, it's Encroachment. Immediate whistle, 5-yard penalty."
    },
    {
        id: 3,
        text: "The quarterback throws the ball away to avoid a sack while still inside the tackle box.",
        answer: "Intentional Grounding",
        options: ["Pass Interference", "Roughing the Passer", "Intentional Grounding", "Illegal Forward Pass"],
        explanation: "The QB must be outside the 'pocket' (tackle box) to throw the ball away legally. Loss of down + spot foul."
    },
    {
        id: 4,
        text: "A defender grabs the ball carrier's face mask and twists it.",
        answer: "Face Mask",
        options: ["Face Mask", "Horse Collar", "Unnecessary Roughness", "Holding"],
        explanation: "Grasping and twisting the face mask is a personal foul. 15-yard penalty and automatic first down."
    },
    {
        id: 5,
        text: "An offensive player grabs a defender's jersey to prevent them from tackling the ball carrier.",
        answer: "Holding",
        options: ["Pass Interference", "Holding", "Blocking in the Back", "Illegal Hands to the Face"],
        explanation: "Holding prevents a defender from making a play. 10-yard penalty."
    }
]

export function GuessThePenaltyGame() {
    const { colors } = useTheme()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
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
                colors: ['#fbbf24', '#004d25', '#ffffff']
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

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <Card className={cn("relative overflow-hidden border-4 border-white/10 bg-[#004d25] shadow-2xl min-h-[500px]", colors.cardBorder)}>
                {/* Chalkboard Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                    }}>
                </div>

                {/* Header / Scoreboard */}
                <div className="relative z-10 bg-black/30 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Flag className="text-yellow-400 w-6 h-6" />
                        <span className="font-heading text-2xl text-white uppercase tracking-wider">Guess the Penalty</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-white/80 font-mono text-sm">
                            Q: {currentQuestion + 1}/{SCENARIOS.length}
                        </div>
                        <Badge variant="secondary" className="bg-yellow-400 text-black font-bold text-lg px-3">
                            Score: {score}
                        </Badge>
                    </div>
                </div>

                <div className="relative z-10 p-6 md:p-10 flex flex-col items-center justify-center h-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!gameOver ? (
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full space-y-8"
                            >
                                {/* Scenario Text */}
                                <div className="text-center space-y-4">
                                    <h3 className="text-white/60 uppercase tracking-widest text-sm font-bold">The Scenario</h3>
                                    <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed font-heading">
                                        "{SCENARIOS[currentQuestion].text}"
                                    </p>
                                </div>

                                {/* Options Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {SCENARIOS[currentQuestion].options.map((option) => (
                                        <Button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            disabled={!!selectedOption}
                                            className={cn(
                                                "h-16 text-lg font-bold border-2 transition-all transform hover:scale-[1.02]",
                                                selectedOption === option
                                                    ? option === SCENARIOS[currentQuestion].answer
                                                        ? "bg-green-500 border-green-400 text-white"
                                                        : "bg-red-500 border-red-400 text-white"
                                                    : selectedOption && option === SCENARIOS[currentQuestion].answer
                                                        ? "bg-green-500/50 border-green-400/50 text-white/50" // Show correct answer if wrong
                                                        : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-yellow-400"
                                            )}
                                        >
                                            {option}
                                            {selectedOption === option && (
                                                <span className="ml-2">
                                                    {option === SCENARIOS[currentQuestion].answer ? <CheckCircle2 /> : <XCircle />}
                                                </span>
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {/* Explanation & Next Button */}
                                {selectedOption && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-black/40 rounded-xl p-6 border border-white/10 mt-6"
                                    >
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div>
                                                <h4 className={cn("font-bold mb-1", isCorrect ? "text-green-400" : "text-red-400")}>
                                                    {isCorrect ? "TOUCHDOWN! Correct." : "FLAG ON THE PLAY! Incorrect."}
                                                </h4>
                                                <p className="text-white/80 text-sm">
                                                    {SCENARIOS[currentQuestion].explanation}
                                                </p>
                                            </div>
                                            <Button onClick={nextQuestion} className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8">
                                                Next Play
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-6"
                            >
                                <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-heading text-white font-bold mb-2">Game Over!</h2>
                                    <p className="text-xl text-white/80">
                                        You scored <span className="text-yellow-400 font-bold">{score}</span> out of {SCENARIOS.length}
                                    </p>
                                </div>

                                <div className="p-6 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto">
                                    <p className="text-white italic">
                                        {score === SCENARIOS.length ? "Perfect game! You're ready for the pros." :
                                            score > SCENARIOS.length / 2 ? "Solid performance. A few more reps and you'll be a starter." :
                                                "Back to the practice squad. Keep studying!"}
                                    </p>
                                </div>

                                <Button onClick={resetGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 shadow-lg">
                                    <RefreshCw className="mr-2 w-5 h-5" />
                                    Play Again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    )
}
