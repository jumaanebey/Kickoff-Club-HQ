'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, MoveRight, CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

// Helper to draw route paths
const RoutePath = ({ type }: { type: string }) => {
    let d = ""
    let arrow = ""

    switch (type) {
        case 'slant':
            d = "M 20 80 L 80 20"
            arrow = "M 70 20 L 80 20 L 80 30"
            break
        case 'out':
            d = "M 20 80 L 20 40 L 80 40"
            arrow = "M 70 35 L 80 40 L 70 45"
            break
        case 'in':
            d = "M 80 80 L 80 40 L 20 40"
            arrow = "M 30 35 L 20 40 L 30 45"
            break
        case 'post':
            d = "M 20 80 L 20 50 L 60 10"
            arrow = "M 50 10 L 60 10 L 60 20"
            break
        case 'flag': // Corner
            d = "M 80 80 L 80 50 L 40 10"
            arrow = "M 50 10 L 40 10 L 40 20"
            break
        case 'fly':
            d = "M 50 80 L 50 10"
            arrow = "M 45 20 L 50 10 L 55 20"
            break
        case 'curl':
            d = "M 50 80 L 50 30 L 40 40" // Hook back
            arrow = "M 35 35 L 40 40 L 45 35"
            break
        default:
            d = "M 50 80 L 50 50"
    }

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-current stroke-[4] fill-none">
            <path d={d} className="stroke-white" strokeLinecap="round" strokeLinejoin="round" />
            <path d={arrow} className="stroke-white fill-white" strokeWidth="0" />
        </svg>
    )
}

const SCENARIOS = [
    {
        id: 1,
        name: "Slant Route",
        description: "A quick diagonal route to the inside. Used to beat blitzes and gain quick yards.",
        answer: "slant",
        options: [
            { id: 'slant', label: 'Diagram A' },
            { id: 'out', label: 'Diagram B' },
            { id: 'fly', label: 'Diagram C' },
            { id: 'curl', label: 'Diagram D' }
        ],
        explanation: "The Slant is a 3-step drop route where the receiver cuts diagonally across the field."
    },
    {
        id: 2,
        name: "Out Route",
        description: "Run straight upfield, then make a hard 90-degree cut towards the sideline.",
        answer: "out",
        options: [
            { id: 'post', label: 'Diagram A' },
            { id: 'in', label: 'Diagram B' },
            { id: 'out', label: 'Diagram C' },
            { id: 'flag', label: 'Diagram D' }
        ],
        explanation: "The Out route uses the sideline as a defender. It's great for stopping the clock."
    },
    {
        id: 3,
        name: "Post Route",
        description: "Run deep, then cut towards the goal post at a 45-degree angle.",
        answer: "post",
        options: [
            { id: 'flag', label: 'Diagram A' },
            { id: 'post', label: 'Diagram B' },
            { id: 'fly', label: 'Diagram C' },
            { id: 'slant', label: 'Diagram D' }
        ],
        explanation: "Called a 'Post' because you run towards the goal post. It's a deep touchdown play."
    },
    {
        id: 4,
        name: "Fly / Go Route",
        description: "Pure speed. Run straight down the field as fast as you can.",
        answer: "fly",
        options: [
            { id: 'curl', label: 'Diagram A' },
            { id: 'fly', label: 'Diagram B' },
            { id: 'post', label: 'Diagram C' },
            { id: 'out', label: 'Diagram D' }
        ],
        explanation: "The simplest route in the book. Beat your man with speed and catch the deep ball."
    },
    {
        id: 5,
        name: "Dig / In Route",
        description: "Run upfield 10-12 yards, then make a hard 90-degree cut across the middle.",
        answer: "in",
        options: [
            { id: 'out', label: 'Diagram A' },
            { id: 'slant', label: 'Diagram B' },
            { id: 'in', label: 'Diagram C' },
            { id: 'flag', label: 'Diagram D' }
        ],
        explanation: "The Dig route finds the soft spot in the middle of the defense behind the linebackers."
    }
]

export function RouteRunnerGame() {
    const { colors } = useTheme()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [gameOver, setGameOver] = useState(false)

    const handleAnswer = (optionId: string) => {
        if (selectedOption) return

        setSelectedOption(optionId)
        const correct = optionId === SCENARIOS[currentQuestion].answer
        setIsCorrect(correct)

        if (correct) {
            setScore(score + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#f97316', '#ea580c', '#ffffff']
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
                        You scored <span className="font-bold text-orange-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <Button onClick={resetGame} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 rounded-full">
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
                <span className="font-bold">Route {currentQuestion + 1} of {SCENARIOS.length}</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wide">{scenario.name}</h2>
                <p className="text-orange-200 text-xl">{scenario.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {scenario.options.map((option, idx) => (
                    <Button
                        key={idx}
                        onClick={() => handleAnswer(option.id)}
                        disabled={selectedOption !== null}
                        className={cn(
                            "h-48 p-4 flex flex-col items-center justify-center gap-4 transition-all border-2",
                            selectedOption === null
                                ? "bg-white/10 hover:bg-white/20 border-transparent"
                                : option.id === scenario.answer
                                    ? "bg-green-500/20 border-green-500"
                                    : selectedOption === option.id
                                        ? "bg-red-500/20 border-red-500"
                                        : "bg-white/5 border-transparent opacity-50"
                        )}
                    >
                        <div className="w-24 h-24">
                            <RoutePath type={option.id} />
                        </div>
                        {selectedOption && option.id === scenario.answer && (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        )}
                        {selectedOption === option.id && option.id !== scenario.answer && (
                            <XCircle className="w-8 h-8 text-red-500" />
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
                            "p-6 rounded-xl border-l-4 text-center max-w-2xl mx-auto",
                            isCorrect ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
                        )}
                    >
                        <h4 className={cn("font-bold mb-2 text-xl", isCorrect ? "text-green-400" : "text-red-400")}>
                            {isCorrect ? "That's the one!" : "Incomplete Pass!"}
                        </h4>
                        <p className="text-white/90 mb-6">{scenario.explanation}</p>
                        <Button onClick={nextQuestion} size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-8">
                            {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Route"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
