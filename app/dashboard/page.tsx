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
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Courses Enrolled</CardDescription>
            <CardTitle className="text-3xl">{stats.coursesEnrolled}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lessons Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.lessonsCompleted}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Watch Time</CardDescription>
            <CardTitle className="text-3xl">{stats.watchTime}m</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl">{stats.currentStreak} days</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Continue Learning</h2>
          <Link href="/dashboard/my-courses" className="text-sm text-primary-500 hover:text-primary-600">
            View all courses
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>Last watched {course.lastWatched}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Next: {course.nextLesson}
                  </span>
                  <Button size="sm">Continue</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  🏈
                </div>
                <CardTitle className="text-lg">Sample Course {i}</CardTitle>
                <CardDescription>Learn the fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Course</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
