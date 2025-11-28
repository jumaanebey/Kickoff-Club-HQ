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

import { createServerClient } from '@/database/supabase/server'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  // Fetch Real Game Stats
  let gameStats = { coins: 0, totalScore: 0 }
  let achievements: any[] = []

  if (user) {
    // Fetch game progress
    const { data: progress } = await supabase
      .from('game_progress')
      .select('coins, high_score')
      .eq('user_id', user.id)

    if (progress) {
<<<<<<< HEAD
      // gameStats.coins = progress.reduce((acc, curr) => acc + (curr.coins || 0), 0) // Deprecated: use user_hq
      // gameStats.totalScore = progress.reduce((acc, curr) => acc + (curr.high_score || 0), 0) // This is Arcade Score, keep or replace with XP?
      // Let's use XP for "Coach XP" display
    }

    // Fetch HQ data for global coins/xp
    const { data: hq } = await supabase
      .from('user_hq')
      .select('coins, xp')
      .eq('user_id', user.id)
      .single()

    if (hq) {
      gameStats.coins = hq.coins || 0
      gameStats.totalScore = hq.xp || 0 // Mapping XP to "totalScore" prop which is displayed as Coach XP
    } else {
      // Fallback if no HQ yet (shouldn't happen if they played games/completed courses, but just in case)
      gameStats.coins = 0
      gameStats.totalScore = 0
=======
      gameStats.coins = progress.reduce((acc, curr) => acc + (curr.coins || 0), 0)
      gameStats.totalScore = progress.reduce((acc, curr) => acc + (curr.high_score || 0), 0)
>>>>>>> origin/main
    }

    // Fetch achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', user.id)

    if (userAchievements) {
      achievements = userAchievements.map((ua: any) => ({
        ...ua.achievements,
        earned_at: ua.earned_at
      }))
    }
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent
        stats={stats}
        recentCourses={recentCourses}
        gameStats={gameStats}
        achievements={achievements}
      />
    </Suspense>
  )
}
