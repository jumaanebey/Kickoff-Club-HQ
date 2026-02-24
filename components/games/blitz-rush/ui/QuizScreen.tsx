'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, CheckCircle2, XCircle, SkipForward, Brain, Coins, ArrowRight } from 'lucide-react'
import { getAdaptiveQuestion, type TriviaQuestion } from '../data/footballTrivia'
import { useFootballIQ } from '../hooks/useFootballIQ'

const QUIZ_TIMER = 15 // seconds
const COINS_CORRECT = 200
const COINS_WRONG = 0

interface QuizScreenProps {
  footballIQ: number
  answeredIds: Set<string>
  onComplete: (result: { correct: boolean; coinsEarned: number; iqGained: number; questionId: string; termId?: string }) => void
  onSkip: () => void
}

export function QuizScreen({ footballIQ, answeredIds, onComplete, onSkip }: QuizScreenProps) {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIMER)
  const [phase, setPhase] = useState<'answering' | 'result'>('answering')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pick a question on mount
  useEffect(() => {
    const q = getAdaptiveQuestion(footballIQ, answeredIds)
    setQuestion(q)
  }, [footballIQ, answeredIds])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'answering' || !question) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — treat as wrong
          if (timerRef.current) clearInterval(timerRef.current)
          setPhase('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, question])

  const handleSelect = useCallback((index: number) => {
    if (phase !== 'answering' || selectedIndex !== null) return
    setSelectedIndex(index)
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('result')
  }, [phase, selectedIndex])

  const handleContinue = useCallback(() => {
    if (!question) return
    const correct = selectedIndex === question.correctIndex
    const iqGained = correct ? 50 : 10
    onComplete({
      correct,
      coinsEarned: correct ? COINS_CORRECT : COINS_WRONG,
      iqGained,
      questionId: question.id,
      termId: question.relatedTerm,
    })
  }, [question, selectedIndex, onComplete])

  if (!question) {
    // No question available — auto-skip
    onSkip()
    return null
  }

  const isCorrect = selectedIndex === question.correctIndex
  const timedOut = phase === 'result' && selectedIndex === null
  const timerPercent = (timeLeft / QUIZ_TIMER) * 100
  const timerColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-emerald-400'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border-2 border-indigo-500/30 p-4 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Quiz Time</span>
            </div>

            {phase === 'answering' && (
              <button
                onClick={onSkip}
                className="flex items-center gap-1 text-white/40 hover:text-white/60 text-xs font-medium transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" /> SKIP
              </button>
            )}
          </div>

          {/* Timer bar */}
          {phase === 'answering' && (
            <div className="relative">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${timerPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className={`flex items-center gap-1 mt-1 ${timerColor}`}>
                <Timer className="w-3 h-3" />
                <span className="text-xs font-bold">{timeLeft}s</span>
              </div>
            </div>
          )}

          {/* Difficulty badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              question.difficulty === 'rookie' ? 'bg-green-500/20 text-green-400' :
              question.difficulty === 'starter' ? 'bg-blue-500/20 text-blue-400' :
              question.difficulty === 'pro' ? 'bg-purple-500/20 text-purple-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-[10px] text-white/30 uppercase">{question.category}</span>
          </div>

          {/* Question */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {question.question}
          </h3>

          {/* Answers */}
          <div className="flex flex-col gap-2">
            {question.answers.map((answer, i) => {
              let borderColor = 'border-white/10 hover:border-white/30'
              let bgColor = 'hover:bg-white/5'
              let textColor = 'text-white/80'

              if (phase === 'result') {
                if (i === question.correctIndex) {
                  borderColor = 'border-emerald-500'
                  bgColor = 'bg-emerald-500/15'
                  textColor = 'text-emerald-300'
                } else if (i === selectedIndex && !isCorrect) {
                  borderColor = 'border-red-500'
                  bgColor = 'bg-red-500/15'
                  textColor = 'text-red-300'
                } else {
                  textColor = 'text-white/30'
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={phase === 'result'}
                  className={`border-2 ${borderColor} ${bgColor} ${textColor} rounded-xl px-4 py-3 text-left text-sm font-medium transition-all flex items-center gap-3`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{answer}</span>
                  {phase === 'result' && i === question.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                  )}
                  {phase === 'result' && i === selectedIndex && !isCorrect && (
                    <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Correct/Wrong/Timeout banner */}
                <div className={`rounded-xl px-4 py-3 ${
                  timedOut ? 'bg-yellow-500/15 border border-yellow-500/30' :
                  isCorrect ? 'bg-emerald-500/15 border border-emerald-500/30' :
                  'bg-red-500/15 border border-red-500/30'
                }`}>
                  <div className={`font-bold text-sm mb-1 ${
                    timedOut ? 'text-yellow-400' : isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {timedOut ? "Time's Up!" : isCorrect ? 'Correct!' : 'Not Quite!'}
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed">
                    {question.explanation}
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex items-center gap-3">
                  {isCorrect && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-lg">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-bold">+{COINS_CORRECT}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1.5 rounded-lg">
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-bold">+{isCorrect ? 50 : 10} IQ</span>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={handleContinue}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  CONTINUE <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
