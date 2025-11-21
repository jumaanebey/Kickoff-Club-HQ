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
const PlayerDot = ({ type, x, y, isHighlighted }: { type: string, x: number, y: number, isHighlighted: boolean }) => (
    <div
        className={cn(
            "absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-sm transition-all duration-500",
            type === 'OL' ? "bg-gray-300 border-gray-400 text-gray-800" :
                type === 'QB' ? "bg-red-500 border-red-600 text-white" :
                    type === 'RB' ? "bg-blue-500 border-blue-600 text-white" :
                        type === 'WR' ? "bg-green-500 border-green-600 text-white" :
                            "bg-yellow-500 border-yellow-600 text-white", // TE
            isHighlighted ? "scale-150 ring-4 ring-white ring-opacity-70 z-50 animate-pulse" : "opacity-50"
        )}
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
        {isHighlighted ? "?" : type}
    </div>
)

const SCENARIOS = [
    {
        id: 1,
        question: "Who is the player behind the center?",
        highlightIndex: 5, // QB
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 60 },
            // RB
            { type: 'RB', x: 50, y: 75 },
            // WR
            { type: 'WR', x: 10, y: 50 }, { type: 'WR', x: 90, y: 50 }, { type: 'WR', x: 20, y: 55 }, { type: 'WR', x: 80, y: 55 }
        ],
        answer: "Quarterback (QB)",
        options: ["Quarterback (QB)", "Running Back (RB)", "Wide Receiver (WR)", "Kicker (K)"],
        explanation: "The Quarterback (QB) stands behind the offensive line and leads the offense. He throws the ball or hands it off."
    },
    {
        id: 2,
        question: "Who snaps the ball?",
        highlightIndex: 0, // Center (Middle OL)
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 60 },
            // RB
            { type: 'RB', x: 50, y: 75 },
            // WR
            { type: 'WR', x: 10, y: 50 }, { type: 'WR', x: 90, y: 50 }
        ],
        answer: "Center (C)",
        options: ["Quarterback (QB)", "Center (C)", "Tackle (T)", "Guard (G)"],
        explanation: "The Center (C) is the player in the middle of the line who 'snaps' (passes) the ball to the Quarterback to start the play."
    },
    {
        id: 3,
        question: "Who catches passes out wide?",
        highlightIndex: 7, // WR
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 60 },
            // WR highlighted
            { type: 'WR', x: 10, y: 50 }
        ],
        answer: "Wide Receiver (WR)",
        options: ["Tight End (TE)", "Running Back (RB)", "Wide Receiver (WR)", "Linebacker (LB)"],
        explanation: "Wide Receivers (WR) line up far away from the ball. Their main job is to run fast and catch passes!"
    },
    {
        id: 4,
        question: "Who runs with the ball?",
        highlightIndex: 6, // RB
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 60 },
            // RB
            { type: 'RB', x: 50, y: 75 }
        ],
        answer: "Running Back (RB)",
        options: ["Quarterback (QB)", "Running Back (RB)", "Kicker (K)", "Safety (S)"],
        explanation: "The Running Back (RB) stands behind the Quarterback. He takes the handoff and tries to run through the defense."
    },
    {
        id: 5,
        question: "Who blocks AND catches?",
        highlightIndex: 7, // TE
        players: [
            // OL
            { type: 'OL', x: 50, y: 50 }, { type: 'OL', x: 45, y: 50 }, { type: 'OL', x: 55, y: 50 }, { type: 'OL', x: 40, y: 50 }, { type: 'OL', x: 60, y: 50 },
            // QB
            { type: 'QB', x: 50, y: 60 },
            // TE
            { type: 'TE', x: 65, y: 50 }
        ],
        answer: "Tight End (TE)",
        options: ["Wide Receiver (WR)", "Tight End (TE)", "Cornerback (CB)", "Punter (P)"],
        explanation: "The Tight End (TE) is a hybrid player. He lines up next to the line to block, but can also run out to catch passes."
    }
]

export function FormationFrenzyGame() {
    const { colors } = useTheme()
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
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className={cn("text-4xl font-black uppercase", colors.text)}>Formation Frenzy</h2>
                    <p className={cn("text-xl max-w-md mx-auto", colors.textMuted)}>
                        Can you identify the players on the field? Test your knowledge of positions.
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-8">
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">5</div>
                            <div className="text-xs text-white/50 uppercase">Levels</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">IQ</div>
                            <div className="text-xs text-white/50 uppercase">Positions</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">XP</div>
                            <div className="text-xs text-white/50 uppercase">Rewards</div>
                        </div>
                    </div>
                    <Button onClick={() => setGameStarted(true)} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-12 py-6 rounded-full shadow-lg shadow-purple-900/20 transition-all hover:scale-105">
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
                <span className="font-bold">Question {currentQuestion + 1} of {SCENARIOS.length}</span>
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
                                <PlayerDot
                                    key={i}
                                    type={p.type}
                                    x={p.x}
                                    y={p.y}
                                    isHighlighted={i === scenario.highlightIndex}
                                />
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
                        {scenario.question}
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
                                    {isCorrect ? "That's right!" : "Try again!"}
                                </h4>
                                <p className="text-white/90 mb-4">{scenario.explanation}</p>
                                <Button onClick={nextQuestion} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {currentQuestion + 1 === SCENARIOS.length ? "Finish Game" : "Next Player"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
