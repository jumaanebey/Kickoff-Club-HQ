'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle, XCircle, Award } from 'lucide-react'

interface QuizQuestion {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  points: number
  order_index: number
  explanation?: string
  quiz_question_options?: QuizQuestionOption[]
}

interface QuizQuestionOption {
  id: string
  option_text: string
  is_correct: boolean
  order_index: number
}

interface Quiz {
  id: string
  title: string
  description?: string
  passing_score_percentage: number
  time_limit_minutes?: number
  allow_retakes: boolean
  show_correct_answers: boolean
  quiz_questions: QuizQuestion[]
}

interface QuizInterfaceProps {
  quiz: Quiz
  attemptId: string
  onSubmit: (attemptId: string) => Promise<void>
  onSaveAnswer: (attemptId: string, questionId: string, answer: any) => Promise<void>
}

export function QuizInterface({ quiz, attemptId, onSubmit, onSaveAnswer }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = quiz.quiz_questions[currentQuestionIndex]
  const totalQuestions = quiz.quiz_questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = async (answer: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    // Auto-save answer
    try {
      await onSaveAnswer(attemptId, currentQuestion.id, answer)
    } catch (error) {
      console.error('Error saving answer:', error)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(attemptId)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setIsSubmitting(false)
    }
  }

  const isAnswered = (questionId: string) => {
    return answers[questionId] !== undefined && answers[questionId] !== null && answers[questionId] !== ''
  }

  const answeredCount = quiz.quiz_questions.filter(q => isAnswered(q.id)).length

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </CardDescription>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className={`h-5 w-5 ${timeRemaining < 60 ? 'text-red-500' : ''}`} />
                <span className={timeRemaining < 60 ? 'text-red-500' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.question_text}
          </CardTitle>
          <CardDescription>
            {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Multiple Choice / True False */}
          {(currentQuestion.question_type === 'multiple_choice' ||
            currentQuestion.question_type === 'true_false') && (
            <RadioGroup
              value={answers[currentQuestion.id]?.selectedOptionId || ''}
              onValueChange={(value) => handleAnswerChange({ selectedOptionId: value })}
            >
              <div className="space-y-3">
                {currentQuestion.quiz_question_options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-gray-50"
                    >
                      {option.option_text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Short Answer */}
          {currentQuestion.question_type === 'short_answer' && (
            <Textarea
              value={answers[currentQuestion.id]?.textAnswer || ''}
              onChange={(e) => handleAnswerChange({ textAnswer: e.target.value })}
              placeholder="Type your answer here..."
              rows={4}
              className="w-full"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          {answeredCount} of {totalQuestions} answered
        </div>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.quiz_questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`
                  w-10 h-10 rounded-lg font-medium transition-colors
                  ${index === currentQuestionIndex
                    ? 'bg-primary-500 text-white'
                    : isAnswered(question.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
