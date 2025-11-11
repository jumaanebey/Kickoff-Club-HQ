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
    question: "How many points is a touchdown worth?",
    options: [
      { text: "3 points", value: 0 },
      { text: "6 points", value: 3 },
      { text: "7 points", value: 1 },
      { text: "Not sure", value: 0 }
    ]
  },
  {
    question: "A team has the ball on 3rd down and 8 yards to go. What happens if they only gain 5 yards?",
    options: [
      { text: "They get another chance on 4th down", value: 3 },
      { text: "The other team gets the ball", value: 1 },
      { text: "They have to kick a field goal", value: 0 },
      { text: "They start over on 1st down", value: 0 }
    ]
  },
  {
    question: "Which position is responsible for throwing passes?",
    options: [
      { text: "Running back", value: 0 },
      { text: "Wide receiver", value: 0 },
      { text: "Quarterback", value: 3 },
      { text: "Linebacker", value: 0 }
    ]
  },
  {
    question: "What is the main difference between a pass play and a run play?",
    options: [
      { text: "Pass plays throw the ball, run plays carry it", value: 3 },
      { text: "Pass plays are on offense, run plays are on defense", value: 0 },
      { text: "Pass plays score more points", value: 0 },
      { text: "There is no difference", value: 0 }
    ]
  },
  {
    question: "In zone coverage, what are defenders primarily responsible for?",
    options: [
      { text: "Following a specific offensive player", value: 1 },
      { text: "Covering a specific area of the field", value: 3 },
      { text: "Rushing the quarterback", value: 0 },
      { text: "Blocking offensive linemen", value: 0 }
    ]
  },
  {
    question: "What is a blitz in football?",
    options: [
      { text: "When the offense runs the ball quickly", value: 0 },
      { text: "When extra defenders rush the quarterback", value: 3 },
      { text: "A type of offensive formation", value: 0 },
      { text: "A penalty for illegal contact", value: 0 }
    ]
  },
  {
    question: "Which special teams play happens at the start of each half and after scores?",
    options: [
      { text: "Punt", value: 1 },
      { text: "Field goal", value: 0 },
      { text: "Kickoff", value: 3 },
      { text: "Extra point", value: 1 }
    ]
  },
  {
    question: "It's 4th down with 2 minutes left. Your team is winning by 3 points and has the ball on the opponent's 45-yard line. What should you do?",
    options: [
      { text: "Go for it (try to get a first down)", value: 0 },
      { text: "Attempt a field goal", value: 1 },
      { text: "Punt to pin them deep and trust your defense", value: 3 },
      { text: "Spike the ball to stop the clock", value: 0 }
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
