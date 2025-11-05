import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { getQuizAttemptById } from '@/lib/db/quiz-queries'
import { QuizResults } from '@/components/quiz/quiz-results'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
    quizId: string
    attemptId: string
  }
}

export default async function QuizResultsPage({ params }: PageProps) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const attempt = await getQuizAttemptById(params.attemptId)

  if (!attempt || attempt.user_id !== user.id) {
    notFound()
  }

  // If not completed yet, redirect to attempt page
  if (!attempt.completed_at) {
    redirect(`/courses/${params.slug}/quizzes/${params.quizId}/attempt/${params.attemptId}`)
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
        <QuizResults attempt={attempt} courseSlug={params.slug} />
      </div>
    </div>
  )
}
