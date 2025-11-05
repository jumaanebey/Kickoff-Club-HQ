'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Trophy, Lock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points_reward: number
}

interface UserAchievement {
  id: string
  achievement_id: string
  earned_at: string
  progress: number
  achievements: Achievement
}

interface AchievementsWidgetProps {
  userAchievements: UserAchievement[]
  allAchievements: Achievement[]
  totalPoints: number
}

export function AchievementsWidget({
  userAchievements,
  allAchievements,
  totalPoints
}: AchievementsWidgetProps) {
  const earnedIds = new Set(userAchievements.map(ua => ua.achievement_id))
  const lockedAchievements = allAchievements.filter(a => !earnedIds.has(a.id))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
            <CardDescription>
              {userAchievements.length} of {allAchievements.length} earned
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
            <div className="text-xs text-gray-600">Total Points</div>
          </div>
        </div>
        <Progress
          value={(userAchievements.length / allAchievements.length) * 100}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Earned Achievements */}
          {userAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Earned</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {userAchievements.slice(0, 6).map((ua) => (
                  <div
                    key={ua.id}
                    className="p-3 rounded-lg border-2 border-yellow-200 bg-yellow-50"
                  >
                    <div className="text-3xl mb-2">{ua.achievements.icon}</div>
                    <div className="font-semibold text-sm">
                      {ua.achievements.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {ua.achievements.description}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{ua.achievements.points_reward} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Locked ({lockedAchievements.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lockedAchievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="text-3xl mb-2 filter grayscale">
                      {achievement.icon}
                    </div>
                    <div className="font-semibold text-sm flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {achievement.description}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.points_reward} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
