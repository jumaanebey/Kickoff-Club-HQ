import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

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
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome back!</h1>
        <p className="text-white/70">Here&apos;s what&apos;s happening with your learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Courses Enrolled</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.coursesEnrolled}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Lessons Completed</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.lessonsCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Watch Time</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.watchTime}m</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/60">Current Streak</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.currentStreak} days</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
          <Link href="/dashboard/my-courses" className="text-sm text-orange-400 hover:text-orange-500">
            View all courses
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentCourses.map((course) => (
            <Card key={course.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">{course.title}</CardTitle>
                <CardDescription className="text-white/60">Last watched {course.lastWatched}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/70">Progress</span>
                    <span className="font-medium text-white">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="bg-white/10" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    Next: {course.nextLesson}
                  </span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">Continue</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Recommended For You</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="h-32 bg-white/10 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  🏈
                </div>
                <CardTitle className="text-lg text-white">Sample Course {i}</CardTitle>
                <CardDescription className="text-white/60">Learn the fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">View Course</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
