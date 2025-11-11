import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { getQuizById, getQuizAttemptById } from '@/database/queries/quizzes'
import { QuizInterface } from '@/components/quiz/quiz-interface'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
    quizId: string
    attemptId: string
  }
}

async function handleSaveAnswer(attemptId: string, questionId: string, answer: any) {
  'use server'
  const { saveQuizAnswer } = await import('@/database/queries/quizzes')
  await saveQuizAnswer(attemptId, questionId, answer)
}

async function handleSubmitQuiz(attemptId: string, courseSlug: string, quizId: string) {
  'use server'
  const { submitQuizAttempt } = await import('@/database/queries/quizzes')
  await submitQuizAttempt(attemptId)
  redirect(`/courses/${courseSlug}/quizzes/${quizId}/results/${attemptId}`)
}

export default async function QuizAttemptPage({ params }: PageProps) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const quiz = await getQuizById(params.quizId)
  if (!quiz) {
    notFound()
  }

  const attempt = await getQuizAttemptById(params.attemptId)
  if (!attempt || attempt.user_id !== user.id) {
    notFound()
  }

  // If already completed, redirect to results
  if (attempt.completed_at) {
    redirect(`/courses/${params.slug}/quizzes/${params.quizId}/results/${params.attemptId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
          </Link>
          <div className="text-sm text-gray-600">
            Quiz in progress...
          </div>
        </div>
      </header>

      <div className="container px-4 py-12">
        <QuizInterface
          quiz={quiz}
          attemptId={params.attemptId}
          onSaveAnswer={handleSaveAnswer}
          onSubmit={(attemptId) => handleSubmitQuiz(attemptId, params.slug, params.quizId)}
        />
      </div>
    </div>
  )
}
