'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Trophy, Calendar } from 'lucide-react'

interface StreakWidgetProps {
  streak: {
    current_streak: number
    longest_streak: number
    last_activity_date: string
  } | null
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  const currentStreak = streak?.current_streak || 0
  const longestStreak = streak?.longest_streak || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Learning Streak
        </CardTitle>
        <CardDescription>
          Keep learning daily to maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Streak */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-3">
              <div className="text-center text-white">
                <div className="text-3xl font-bold">{currentStreak}</div>
                <div className="text-xs">day{currentStreak !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="text-lg font-semibold">Current Streak</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-600 mb-1">
                <Trophy className="h-5 w-5" />
                <span className="text-2xl font-bold">{longestStreak}</span>
              </div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                <Calendar className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {streak?.last_activity_date
                    ? new Date(streak.last_activity_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="text-sm text-gray-600">Last Activity</div>
            </div>
          </div>

          {/* Milestones */}
          <div className="pt-4 border-t">
            <div className="text-sm font-semibold text-gray-700 mb-3">Milestones</div>
            <div className="space-y-2">
              {[
                { days: 7, emoji: '🎯', label: 'Week Warrior' },
                { days: 30, emoji: '🏆', label: 'Monthly Master' },
                { days: 100, emoji: '👑', label: 'Century Champion' }
              ].map((milestone) => (
                <div
                  key={milestone.days}
                  className={`flex items-center justify-between p-2 rounded ${
                    currentStreak >= milestone.days
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{milestone.emoji}</span>
                    <span className={`text-sm ${
                      currentStreak >= milestone.days
                        ? 'font-semibold text-green-900'
                        : 'text-gray-600'
                    }`}>
                      {milestone.label}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    currentStreak >= milestone.days
                      ? 'font-semibold text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {milestone.days} days
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
