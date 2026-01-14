'use client'

import { Clock, CheckCircle2, Award, Flame, Trophy, Timer } from 'lucide-react'

interface WeeklyActivity {
  day: string
  minutes: number
  lessons: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
  progress?: number
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  timeSpent: number
}

interface ProgressContentProps {
  stats: {
    totalWatchTime: number
    lessonsCompleted: number
    coursesCompleted: number
    currentStreak: number
    longestStreak: number
    averageSessionTime: number
  }
  weeklyActivity: WeeklyActivity[]
  achievements: Achievement[]
  courseProgress: CourseProgress[]
}

export function ProgressContent({ stats, weeklyActivity, achievements, courseProgress }: ProgressContentProps) {
  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4">
          Stats
        </span>
        <h1 className="text-4xl md:text-5xl font-heading uppercase mb-2 text-gray-900">
          Your <span className="text-orange-500">Progress</span>
        </h1>
        <p className="text-lg text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <Clock className="w-5 h-5 text-emerald-500 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Watch Time</div>
          <div className="text-2xl font-heading text-gray-900">
            {Math.floor(stats.totalWatchTime / 60)}h {stats.totalWatchTime % 60}m
          </div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <CheckCircle2 className="w-5 h-5 text-orange-500 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Lessons</div>
          <div className="text-2xl font-heading text-gray-900">{stats.lessonsCompleted}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <Award className="w-5 h-5 text-amber-400 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Courses</div>
          <div className="text-2xl font-heading text-gray-900">{stats.coursesCompleted}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-orange-500 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <Flame className="w-5 h-5 text-orange-500 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Streak</div>
          <div className="text-2xl font-heading text-orange-500">{stats.currentStreak}</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <Trophy className="w-5 h-5 text-amber-400 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Best</div>
          <div className="text-2xl font-heading text-gray-900">{stats.longestStreak}d</div>
        </div>

        <div className="relative bg-white border-2 border-gray-900 p-4 group hover:-translate-y-1 transition-all">
          <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
          <Timer className="w-5 h-5 text-emerald-500 mb-2" />
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Avg Session</div>
          <div className="text-2xl font-heading text-gray-900">{stats.averageSessionTime}m</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="relative bg-white border-2 border-gray-900 p-6">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />

        <div className="flex items-center gap-4 mb-6">
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 uppercase">7 Days</span>
          <h3 className="font-heading text-xl uppercase text-gray-900">This Week&apos;s Activity</h3>
        </div>

        <div className="space-y-4">
          {weeklyActivity.map((day) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900 w-10 uppercase">{day.day}</span>
              <div className="flex-1">
                <div className="h-6 bg-gray-50 border border-gray-900/20">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-right w-24">
                <div className="text-sm font-heading text-gray-900">{day.minutes} min</div>
                <div className="text-xs text-gray-500">{day.lessons} lessons</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-gray-500">Weekly Total</p>
              <p className="text-2xl font-heading text-gray-900">
                {weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} minutes
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-gray-500">Lessons</p>
              <p className="text-2xl font-heading text-emerald-500">
                {weeklyActivity.reduce((sum, day) => sum + day.lessons, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 uppercase">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </span>
          <h2 className="text-xl font-heading uppercase text-gray-900">Achievements</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-5 border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-white border-amber-400'
                  : 'bg-gray-50/50 border-gray-900/30 opacity-60'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-amber-400 -z-10" />
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{achievement.icon}</div>
                {achievement.unlocked ? (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase">Unlocked</span>
                ) : (
                  <span className="bg-gray-900/20 text-gray-500 text-[10px] font-bold px-2 py-0.5 uppercase">Locked</span>
                )}
              </div>

              <h4 className="font-heading text-lg uppercase text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>

              {achievement.unlocked ? (
                <p className="text-xs text-gray-500">Unlocked {achievement.unlockedDate}</p>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 uppercase font-bold">Progress</span>
                    <span className="font-heading text-gray-900">{achievement.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-50 border border-gray-900/20">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress Detail */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase">Details</span>
          <h2 className="text-xl font-heading uppercase text-gray-900">Course Progress</h2>
        </div>

        <div className="space-y-4">
          {courseProgress.map((course) => (
            <div key={course.id} className="relative bg-white border-2 border-gray-900 p-6 group hover:-translate-y-1 transition-all">
              <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-heading text-xl uppercase text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {course.lessonsCompleted} of {course.totalLessons} lessons • {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m spent
                  </p>
                </div>
                <span className="bg-gray-900 text-white font-heading text-sm px-3 py-1">{course.progress}%</span>
              </div>

              <div className="h-3 bg-gray-50 border-2 border-gray-900/20 mb-4">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-heading text-emerald-500">{course.lessonsCompleted}</p>
                  <p className="text-xs text-gray-500 uppercase font-bold">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-heading text-gray-500">
                    {course.totalLessons - course.lessonsCompleted}
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-bold">Remaining</p>
                </div>
                <div>
                  <p className="text-2xl font-heading text-orange-500">
                    {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m
                  </p>
                  <p className="text-xs text-gray-500 uppercase font-bold">Time Spent</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Streak Info */}
      <div className="relative bg-gray-900 p-6">
        <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-orange-500 -z-10" />

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">🔥</div>
          <div>
            <h3 className="font-heading text-2xl uppercase text-white">Keep Your Streak Going!</h3>
            <p className="text-white/70">
              You&apos;re on a {stats.currentStreak}-day streak. Learn today to keep it alive!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className={`h-10 w-10 flex items-center justify-center text-sm font-heading ${
                i < stats.currentStreak
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 text-white/60">
          {14 - stats.currentStreak} more days to unlock the &quot;Dedicated Student&quot; achievement!
        </p>
      </div>
    </div>
  )
}
