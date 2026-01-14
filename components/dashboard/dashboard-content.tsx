'use client'

import { memo } from 'react'
import Link from "next/link"
import { DailyMissions } from './daily-missions'
import { Users, ExternalLink, ArrowRight, Trophy, Coins, Zap, BookOpen, CheckCircle2 } from 'lucide-react'

interface DashboardContentProps {
  stats: {
    coursesEnrolled: number
    lessonsCompleted: number
    watchTime: number
    currentStreak: number
  }
  recentCourses: Array<{
    id: string
    title: string
    progress: number
    lastWatched: string
    nextLesson: string
  }>
  gameStats?: {
    coins: number
    totalScore: number
  }
  achievements?: Array<{
    id: string
    name: string
    description: string
    badge_icon: string | null
    earned_at: string
  }>
  subscriptionTier?: 'free' | 'basic' | 'premium'
}

export const DashboardContent = memo(function DashboardContent({ stats, recentCourses, gameStats, achievements, subscriptionTier = 'free' }: DashboardContentProps) {
  const isPro = subscriptionTier === 'basic' || subscriptionTier === 'premium'
  const level = Math.floor(Math.sqrt((gameStats?.totalScore || 0) / 100)) + 1

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4">
          Dashboard
        </span>
        <h1 className="text-4xl md:text-5xl font-heading uppercase mb-2 text-gray-900">
          Welcome <span className="text-orange-500">Back!</span>
        </h1>
        <p className="text-lg text-gray-600">Here&apos;s what&apos;s happening with your learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative bg-white border-2 border-gray-900 p-5 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm uppercase font-bold text-gray-500">Courses</span>
          </div>
          <div className="text-4xl font-heading text-gray-900">{stats.coursesEnrolled}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-5 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm uppercase font-bold text-gray-500">Lessons</span>
          </div>
          <div className="text-4xl font-heading text-gray-900">{stats.lessonsCompleted}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-5 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-400 text-gray-900 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-sm uppercase font-bold text-gray-500">Coins</span>
          </div>
          <div className="text-4xl font-heading text-amber-400">{(gameStats?.coins || 0).toLocaleString()}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-5 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-sm uppercase font-bold text-gray-500">Coach XP</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading text-orange-500">{(gameStats?.totalScore || 0).toLocaleString()}</span>
            <span className="text-sm font-bold text-gray-500">LVL {level}</span>
          </div>
        </div>
      </div>

      {/* Club HQ Banner */}
      <Link href="/hq" className="block group">
        <div className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-amber-400 -z-10" />
          <div className="absolute inset-0 bg-[url('/kickoff-club-assets/buildings/stadium/building-stadium-level-5@2x.png')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-heading uppercase text-white mb-2">
                Manage Your <span className="text-amber-400">Club HQ</span>
              </h3>
              <p className="text-white/70">
                Build your facilities, train your units, and dominate the league.
              </p>
            </div>
            <button className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors shrink-0">
              Enter HQ
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </Link>

      {/* Community Access */}
      {isPro ? (
        <a
          href="https://whop.com/joined/kickoff-club-master-football/exp_FCkkFtJm4gUhkD/app/"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative bg-gray-900 overflow-hidden">
            <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-emerald-500 -z-10" />
            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading uppercase text-white mb-1">
                    Join the <span className="text-emerald-500">Community</span>
                  </h3>
                  <p className="text-white/70">
                    Connect with fellow football learners, share insights, and grow together.
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-bold uppercase hover:bg-emerald-500/80 transition-colors shrink-0">
                Open Community
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </a>
      ) : (
        <div className="relative bg-white border-2 border-dashed border-gray-900 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 border-2 border-gray-900 text-gray-500 flex items-center justify-center shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-heading uppercase text-gray-900 mb-1">
                  Community Access
                </h3>
                <p className="text-gray-500">
                  Upgrade to Pro to join our exclusive community of football learners.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors shrink-0"
            >
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      )}

      {/* Daily Missions */}
      <DailyMissions />

      {/* Trophy Room */}
      {achievements && achievements.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 uppercase">{achievements.length} Earned</span>
            <h2 className="text-xl font-heading uppercase text-gray-900">Trophy Room</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="relative bg-white border-2 border-amber-400 p-4 text-center group hover:-translate-y-1 transition-all">
                <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-amber-400 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
                <div className="mx-auto bg-amber-400/20 w-12 h-12 flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="font-heading text-sm uppercase text-gray-900 mb-1">{achievement.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase">In Progress</span>
            <h2 className="text-xl font-heading uppercase text-gray-900">Continue Learning</h2>
          </div>
          <Link href="/dashboard/my-courses" className="text-orange-500 hover:underline font-bold text-sm uppercase">
            View all courses
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentCourses.map((course) => (
            <div key={course.id} className="relative bg-white border-2 border-gray-900 p-6 group hover:-translate-y-1 transition-all">
              <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10 group-hover:top-3 group-hover:left-3 transition-all" />

              <h3 className="font-heading text-xl uppercase text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Last watched {course.lastWatched}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 uppercase text-xs font-bold">Progress</span>
                  <span className="font-heading text-gray-900">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-50 border border-gray-900/20">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">Next:</span> {course.nextLesson}
                </span>
                <button className="px-4 py-2 bg-orange-500 text-white font-bold text-sm uppercase hover:bg-orange-600 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
