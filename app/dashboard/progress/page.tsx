import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Your Progress</h1>
        <p className="text-white/70">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Total Watch Time</CardDescription>
            <CardTitle className="text-2xl text-white">
              {Math.floor(stats.totalWatchTime / 60)}h {stats.totalWatchTime % 60}m
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Lessons Completed</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.lessonsCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Courses Completed</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.coursesCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Current Streak</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-1 text-white">
              <span>🔥</span>
              <span>{stats.currentStreak}</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Longest Streak</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.longestStreak} days</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Avg Session</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.averageSessionTime}m</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">This Week&apos;s Activity</CardTitle>
          <CardDescription className="text-white/60">Your learning time over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyActivity.map((day) => (
              <div key={day.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium w-12 text-white">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-8 bg-white/10 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg transition-all"
                        style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-32">
                    <div className="text-sm font-semibold text-white">{day.minutes} min</div>
                    <div className="text-xs text-white/60">{day.lessons} lessons</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Weekly Total</p>
                <p className="text-2xl font-bold text-white">
                  {weeklyActivity.reduce((sum, day) => sum + day.minutes, 0)} minutes
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">Lessons Completed</p>
                <p className="text-2xl font-bold text-white">
                  {weeklyActivity.reduce((sum, day) => sum + day.lessons, 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
          <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={achievement.unlocked ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'bg-white/5 backdrop-blur-xl border-white/10 opacity-60'}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  {achievement.unlocked ? (
                    <Badge className="bg-green-500/20 border-green-500/30 text-green-400">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60">Locked</Badge>
                  )}
                </div>
                <CardTitle className="text-lg text-white">{achievement.title}</CardTitle>
                <CardDescription className="text-white/60">{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {achievement.unlocked ? (
                  <p className="text-xs text-white/60">Unlocked {achievement.unlockedDate}</p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2 bg-white/10" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Course Progress Detail */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Course Progress</h2>

        <div className="space-y-4">
          {courseProgress.map((course) => (
            <Card key={course.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">{course.title}</h3>
                    <p className="text-sm text-white/70">
                      {course.lessonsCompleted} of {course.totalLessons} lessons • {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m spent
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 border-white/20 text-white">{course.progress}%</Badge>
                </div>

                <Progress value={course.progress} className="bg-white/10" />

                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{course.lessonsCompleted}</p>
                    <p className="text-xs text-white/60">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white/60">
                      {course.totalLessons - course.lessonsCompleted}
                    </p>
                    <p className="text-xs text-white/60">Remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-400">
                      {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m
                    </p>
                    <p className="text-xs text-white/60">Time Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Streak Info */}
      <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔥</div>
            <div>
              <CardTitle className="text-white">Keep Your Streak Going!</CardTitle>
              <CardDescription className="text-white/70">
                You&apos;re on a {stats.currentStreak}-day streak. Learn today to keep it alive!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  i < stats.currentStreak
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/70 mt-3">
            {14 - stats.currentStreak} more days to unlock the &quot;Dedicated Student&quot; achievement!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
