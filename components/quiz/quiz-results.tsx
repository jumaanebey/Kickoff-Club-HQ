'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Award, Clock, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface QuizResultsProps {
  attempt: {
    id: string
    score: number
    max_score: number
    is_passing: boolean
    time_taken_seconds: number
    completed_at: string
    quiz_user_answers?: QuizUserAnswer[]
    quizzes: {
      id: string
      title: string
      passing_score_percentage: number
      show_correct_answers: boolean
      allow_retakes: boolean
    }
  }
  courseSlug?: string
}

interface QuizUserAnswer {
  id: string
  is_correct: boolean
  points_earned: number
  selected_option_id?: string
  text_answer?: string
  quiz_questions: {
    id: string
    question_text: string
    question_type: string
    points: number
    explanation?: string
  }
  quiz_question_options?: {
    id: string
    option_text: string
    is_correct: boolean
  }
}

export function QuizResults({ attempt, courseSlug }: QuizResultsProps) {
  const percentage = attempt.max_score > 0
    ? Math.round((attempt.score / attempt.max_score) * 100)
    : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const correctAnswersCount = attempt.quiz_user_answers?.filter(a => a.is_correct).length || 0
  const totalQuestions = attempt.quiz_user_answers?.length || 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Results Summary */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {attempt.is_passing ? (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-10 w-10 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl">
            {attempt.is_passing ? 'Congratulations!' : 'Keep Trying!'}
          </CardTitle>
          <CardDescription className="text-lg">
            {attempt.is_passing
              ? 'You passed the quiz!'
              : `You need ${attempt.quizzes.passing_score_percentage}% to pass`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {percentage}%
              </div>
              <div className="text-gray-600">
                {attempt.score} out of {attempt.max_score} points
              </div>
              <Progress value={percentage} className="mt-4" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswersCount}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {totalQuestions - correctAnswersCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" />
                  {formatTime(attempt.time_taken_seconds)}
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              {attempt.quizzes.allow_retakes && (
                <Button asChild className="flex-1">
                  <Link href={`/courses/${courseSlug}/quizzes/${attempt.quizzes.id}`}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/courses/${courseSlug}`}>
                  Back to Course
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      {attempt.quizzes.show_correct_answers && attempt.quiz_user_answers && (
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
            <CardDescription>
              Review your answers and see explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attempt.quiz_user_answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border-2 ${
                    answer.is_correct
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.is_correct ? (
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          Question {index + 1}
                        </h4>
                        <Badge variant={answer.is_correct ? 'default' : 'destructive'}>
                          {answer.points_earned} / {answer.quiz_questions.points} points
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        {answer.quiz_questions.question_text}
                      </p>

                      {/* Show answer based on question type */}
                      {answer.quiz_questions.question_type === 'short_answer' ? (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Your Answer:
                          </div>
                          <div className="p-2 bg-white rounded border">
                            {answer.text_answer || 'No answer provided'}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {answer.quiz_question_options && (
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">
                                {answer.is_correct ? 'Your Answer (Correct):' : 'Your Answer:'}
                              </div>
                              <div className={`p-2 rounded border ${
                                answer.is_correct
                                  ? 'bg-green-100 border-green-300'
                                  : 'bg-red-100 border-red-300'
                              }`}>
                                {answer.quiz_question_options.option_text}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      {answer.quiz_questions.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="text-sm font-medium text-blue-800 mb-1">
                            Explanation:
                          </div>
                          <p className="text-sm text-blue-900">
                            {answer.quiz_questions.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
