'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { RefreshCw, Trophy, Users, CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

// Helper to render player dots
const PlayerDot = ({ type, x, y }: { type: string, x: number, y: number }) => (
    <div
        className={cn(
            "absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-sm",
            type === 'OL' ? "bg-gray-300 border-gray-400 text-gray-800" :
                type === 'QB' ? "bg-red-500 border-red-600 text-white" :
                    type === 'RB' ? "bg-blue-500 border-blue-600 text-white" :
                        type === 'WR' ? "bg-green-500 border-green-600 text-white" :
                            "bg-yellow-500 border-yellow-600 text-white" // TE
        )}
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
        {type}
    </div>
)

const SCENARIOS = [
    {
        id: 1,
        name: "Shotgun Spread (11 Personnel)",
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 65 },
            // RB
            { type: 'RB', x: 55, y: 65 },
            // TE
            { type: 'TE', x: 65, y: 50 },
            // WR
            { type: 'WR', x: 10, y: 50 }, { type: 'WR', x: 90, y: 50 }, { type: 'WR', x: 20, y: 55 }
        ],
        answer: "11 Personnel (1 RB, 1 TE)",
        options: ["11 Personnel (1 RB, 1 TE)", "12 Personnel (1 RB, 2 TE)", "21 Personnel (2 RB, 1 TE)", "10 Personnel (1 RB, 0 TE)"],
        explanation: "11 Personnel means 1 Running Back and 1 Tight End. That leaves 3 Wide Receivers. This is the most common formation in modern football."
    },
    {
        id: 2,
        name: "I-Formation (21 Personnel)",
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 55 },
            // RB (FB & HB)
            { type: 'RB', x: 50, y: 65 }, { type: 'RB', x: 50, y: 75 },
            // TE
            { type: 'TE', x: 65, y: 50 },
            // WR
            { type: 'WR', x: 10, y: 50 }, { type: 'WR', x: 90, y: 50 }
        ],
        answer: "21 Personnel (I-Formation)",
        options: ["11 Personnel", "21 Personnel (I-Formation)", "22 Personnel", "Empty Set"],
        explanation: "21 Personnel means 2 Running Backs (usually a Fullback and Tailback) and 1 Tight End. The 'I' refers to the vertical alignment of QB, FB, and RB."
    },
    {
        id: 3,
        name: "Empty Set (00 Personnel)",
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 65 },
            // WRs everywhere
            { type: 'WR', x: 10, y: 50 }, { type: 'WR', x: 20, y: 55 }, { type: 'WR', x: 30, y: 50 },
            { type: 'WR', x: 90, y: 50 }, { type: 'WR', x: 80, y: 55 }
        ],
        answer: "Empty Set (5 WR)",
        options: ["Hail Mary", "Goal Line", "Empty Set (5 WR)", "Wildcat"],
        explanation: "Empty Set means the backfield is empty (no RBs). The QB is alone, and there are 5 receivers spread out to stretch the defense maximally."
    },
    {
        id: 4,
        name: "Goal Line (23 Personnel)",
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 55 },
            // RBs
            { type: 'RB', x: 48, y: 60 }, { type: 'RB', x: 52, y: 60 },
            // TEs (Big package)
            { type: 'TE', x: 35, y: 50 }, { type: 'TE', x: 65, y: 50 }, { type: 'TE', x: 70, y: 50 }
        ],
        answer: "Goal Line / Heavy",
        options: ["Spread", "Goal Line / Heavy", "Punt Formation", "Victory Formation"],
        explanation: "This is a 'Heavy' package with 3 Tight Ends and 2 Running Backs. It's designed for pure power running in short-yardage situations."
    },
    {
        id: 5,
        name: "Wildcat",
        players: [
            // OL (Unbalanced maybe, but let's keep simple)
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // RB at QB spot
            { type: 'RB', x: 50, y: 65 },
            // QB lined up wide
            { type: 'QB', x: 10, y: 50 },
            // Motion player
            { type: 'WR', x: 80, y: 60 },
            { type: 'TE', x: 65, y: 50 }, { type: 'WR', x: 90, y: 50 }
        ],
        answer: "Wildcat",
        options: ["Shotgun", "Pistol", "Wildcat", "Pro Set"],
        explanation: "In the Wildcat, a Running Back takes the direct snap from center, while the Quarterback lines up as a receiver or is off the field. It gives the offense an extra blocker."
    }
]

export function FormationFrenzyGame() {
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
                colors: ['#8b5cf6', '#6d28d9', '#ffffff']
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
                        You scored <span className="font-bold text-purple-500">{score}</span> out of {SCENARIOS.length}
                    </p>
                    <Button onClick={resetGame} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 rounded-full">
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
                <span className="font-bold">Formation {currentQuestion + 1} of {SCENARIOS.length}</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Field Diagram */}
                <Card className="relative h-[400px] bg-green-800 border-4 border-white/20 overflow-hidden shadow-inner">
                    {/* Field Markings */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-white/50" />
                        ))}
                    </div>
                    <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
                        <div className="w-px h-full bg-white/50" /> {/* Center hash */}
                    </div>

                    {/* Players */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={scenario.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            {scenario.players.map((p, i) => (
                                <PlayerDot key={i} type={p.type} x={p.x} y={p.y} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-2 right-2 text-white/50 text-xs font-mono">
                        Offense moving ▲
                    </div>
                </Card>

                {/* Options */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-400" />
                        Identify the Formation:
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
                                    {isCorrect ? "Correct Formation!" : "Illegal Formation!"}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={nextQuestion} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Formation"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
