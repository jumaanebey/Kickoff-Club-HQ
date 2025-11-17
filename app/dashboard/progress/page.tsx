import { ProgressContent } from "@/components/dashboard/progress-content"

export default function ProgressPage() {
  // Mock data - will be replaced with real data from database
  const stats = {
    totalWatchTime: 720, // minutes
    lessonsCompleted: 24,
    coursesCompleted: 2,
    currentStreak: 7, // days
    longestStreak: 14, // days
    averageSessionTime: 28, // minutes
  }

  const weeklyActivity = [
    { day: 'Mon', minutes: 45, lessons: 2 },
    { day: 'Tue', minutes: 60, lessons: 3 },
    { day: 'Wed', minutes: 30, lessons: 1 },
    { day: 'Thu', minutes: 75, lessons: 4 },
    { day: 'Fri', minutes: 40, lessons: 2 },
    { day: 'Sat', minutes: 90, lessons: 5 },
    { day: 'Sun', minutes: 50, lessons: 2 },
  ]

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlocked: true,
      unlockedDate: '2 weeks ago'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      unlocked: true,
      unlockedDate: 'Today'
    },
    {
      id: '3',
      title: 'Course Crusher',
      description: 'Complete your first course',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '1 week ago'
    },
    {
      id: '4',
      title: 'Marathon Learner',
      description: 'Watch 10 hours of content',
      icon: '⏱️',
      unlocked: true,
      unlockedDate: '3 days ago'
    },
    {
      id: '5',
      title: 'Dedicated Student',
      description: 'Maintain a 14-day learning streak',
      icon: '⭐',
      unlocked: false,
      progress: 50 // 7/14 days
    },
    {
      id: '6',
      title: 'Knowledge Seeker',
      description: 'Complete 5 courses',
      icon: '📚',
      unlocked: false,
      progress: 40 // 2/5 courses
    },
  ]

  const courseProgress = [
    {
      id: '1',
      title: 'How Downs Work',
      progress: 75,
      lessonsCompleted: 6,
      totalLessons: 8,
      timeSpent: 180, // minutes
    },
    {
      id: '2',
      title: 'Quarterback Fundamentals',
      progress: 40,
      lessonsCompleted: 4,
      totalLessons: 10,
      timeSpent: 240, // minutes
    },
    {
      id: '3',
      title: 'Wide Receiver Routes',
      progress: 20,
      lessonsCompleted: 2,
      totalLessons: 10,
      timeSpent: 90, // minutes
    },
  ]

  return (
    <ProgressContent
      stats={stats}
      weeklyActivity={weeklyActivity}
      achievements={achievements}
      courseProgress={courseProgress}
    />
  )
}
