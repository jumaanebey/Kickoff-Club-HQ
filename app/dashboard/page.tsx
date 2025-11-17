import { DashboardContent } from '@/components/dashboard/dashboard-content'

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

  return <DashboardContent stats={stats} recentCourses={recentCourses} />
}
