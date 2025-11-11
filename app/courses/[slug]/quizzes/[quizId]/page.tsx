import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { getCourseBySlug } from '@/database/queries/courses'
import { getQuizById, createQuizAttempt, saveQuizAnswer, submitQuizAttempt } from '@/database/queries/quizzes'
import { QuizInterface } from '@/components/quiz/quiz-interface'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Clock, RotateCcw } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
    quizId: string
  }
}

async function checkEnrollment(userId: string, courseId: string) {
  const { createServerClient } = await import('@/database/supabase/server')
  const supabase = await createServerClient()

  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  return !!data
}

async function handleStartQuiz(quizId: string, userId: string) {
  'use server'
  const attempt = await createQuizAttempt(userId, quizId)
  redirect(`/courses/${attempt.quiz_id}/quizzes/${quizId}/attempt/${attempt.id}`)
}

async function handleSaveAnswer(attemptId: string, questionId: string, answer: any) {
  'use server'
  await saveQuizAnswer(attemptId, questionId, answer)
}

async function handleSubmitQuiz(attemptId: string, courseSlug: string, quizId: string) {
  'use server'
  await submitQuizAttempt(attemptId)
  redirect(`/courses/${courseSlug}/quizzes/${quizId}/results/${attemptId}`)
}

export default async function QuizPage({ params }: PageProps) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const course = await getCourseBySlug(params.slug)
  if (!course) {
    notFound()
  }

  const quiz = await getQuizById(params.quizId)
  if (!quiz) {
    notFound()
  }

  // Check if user is enrolled
  const isEnrolled = await checkEnrollment(user.id, course.id)
  if (!isEnrolled) {
    redirect(`/courses/${params.slug}?access=denied&message=${encodeURIComponent('You must be enrolled in this course to take quizzes')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
          </Link>
          <nav className="flex items-center gap-6">
            <Link href={`/courses/${params.slug}`}>Back to Course</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">{quiz.title}</CardTitle>
              {quiz.description && (
                <CardDescription className="text-lg mt-2">
                  {quiz.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                    <div className="font-semibold">{quiz.passing_score_percentage}%</div>
                  </div>
                </div>

                {quiz.time_limit_minutes && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Time Limit</div>
                      <div className="font-semibold">{quiz.time_limit_minutes} minutes</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <RotateCcw className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Retakes</div>
                    <div className="font-semibold">
                      {quiz.allow_retakes ? 'Unlimited' : 'One attempt'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Before you start:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>This quiz has {quiz.quiz_questions.length} questions</li>
                  {quiz.time_limit_minutes && (
                    <li>You have {quiz.time_limit_minutes} minutes to complete it</li>
                  )}
                  <li>Your answers will be saved automatically as you progress</li>
                  {quiz.show_correct_answers && (
                    <li>You'll see the correct answers after submission</li>
                  )}
                  {!quiz.allow_retakes && (
                    <li className="font-semibold">⚠️ You can only take this quiz once</li>
                  )}
                </ul>
              </div>

              <form action={handleStartQuiz.bind(null, quiz.id, user.id)}>
                <Button type="submit" size="lg" className="w-full mt-6">
                  Start Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
