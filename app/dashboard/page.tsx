import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load the dashboard content component
const DashboardContent = lazy(() => import('@/components/dashboard/dashboard-content').then(mod => ({ default: mod.DashboardContent })))

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  // Mock data - will be replaced with real data from database
  const stats = {
    coursesEnrolled: 3,
    lessonsCompleted: 12,
    watchTime: 240, // minutes
    currentStreak: 5, // days
  }

  const recentCourses = [
    {
      id: '1',
      title: 'How Downs Work',
      progress: 75,
      lastWatched: '2 hours ago',
      nextLesson: 'The 10-Yard Rule'
    },
    {
      id: '2',
      title: 'Quarterback Fundamentals',
      progress: 40,
      lastWatched: '1 day ago',
      nextLesson: 'Reading Defenses'
    },
  ]

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent stats={stats} recentCourses={recentCourses} />
    </Suspense>
  )
}
