'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, CheckCircle } from 'lucide-react'

const ASSESSMENT_QUESTIONS = [
  {
    question: "How familiar are you with football rules?",
    options: [
      { text: "I'm completely new to football", value: 0 },
      { text: "I understand basic rules like scoring", value: 1 },
      { text: "I know most rules and positions", value: 2 },
      { text: "I'm very familiar with all aspects", value: 3 }
    ]
  },
  {
    question: "What's your main goal with football training?",
    options: [
      { text: "Learn the basics to enjoy watching games", value: 0 },
      { text: "Understand strategy and plays", value: 1 },
      { text: "Improve my playing skills", value: 2 },
      { text: "Master advanced techniques", value: 3 }
    ]
  },
  {
    question: "How would you describe your football experience?",
    options: [
      { text: "I've never played or studied football", value: 0 },
      { text: "I watch games but don't play", value: 1 },
      { text: "I play recreationally", value: 2 },
      { text: "I play competitively or coach", value: 3 }
    ]
  },
  {
    question: "Which topic interests you most?",
    options: [
      { text: "Understanding basic rules and scoring", value: 0 },
      { text: "Learning positions and formations", value: 1 },
      { text: "Developing specific skills (QB, receiver, etc.)", value: 2 },
      { text: "Advanced strategy and game planning", value: 3 }
    ]
  }
]

export default function AssessmentPage() {
  const router = useRouter()
  const { colors } = useTheme()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleSelectOption = (value: number) => {
    setSelectedOption(value)
  }

  const handleNext = () => {
    if (selectedOption === null) return

    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      // Calculate score and redirect to results
      const totalScore = newAnswers.reduce((sum, val) => sum + val, 0)
      const maxScore = ASSESSMENT_QUESTIONS.length * 3
      const percentage = (totalScore / maxScore) * 100

      let level = 'beginner'
      if (percentage >= 70) level = 'advanced'
      else if (percentage >= 40) level = 'intermediate'

      router.push(`/assessment/results?level=${level}&score=${totalScore}`)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setAnswers(answers.slice(0, -1))
      setSelectedOption(answers[currentQuestion - 1])
    }
  }

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="courses" />

      <div className="container px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className={cn("text-4xl font-bold mb-4", colors.text)}>
              Skill Level Assessment
            </h1>
            <p className={cn("text-lg", colors.textMuted)}>
              Answer a few quick questions to find the perfect courses for your skill level
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-sm font-medium", colors.textMuted)}>
                Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
              </span>
              <span className={cn("text-sm font-medium", colors.textMuted)}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className={cn("w-full h-3 rounded-full overflow-hidden", colors.bgSecondary)}>
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className={cn("mb-8", colors.bgSecondary, colors.cardBorder)}>
            <CardHeader>
              <CardTitle className={cn("text-2xl", colors.text)}>
                {ASSESSMENT_QUESTIONS[currentQuestion].question}
              </CardTitle>
              <CardDescription className={colors.textMuted}>
                Choose the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    selectedOption === option.value
                      ? "border-orange-500 bg-orange-500/10"
                      : cn("border-transparent", colors.bgSecondary, "hover:border-orange-500/50")
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedOption === option.value
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-400"
                    )}>
                      {selectedOption === option.value && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className={cn(
                      "text-base",
                      selectedOption === option.value ? colors.text : colors.textSecondary
                    )}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-8"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'See Results' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
