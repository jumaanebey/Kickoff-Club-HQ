import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/database/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage courses, users, and platform settings'
}

export default async function AdminPage() {
  const user = await getUser()
  if (!user) redirect('/auth/sign-in')

  const supabase = await createServerClient()

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get platform statistics
  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalEnrollments },
    { count: activeUsers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')
  ])

  // Get recent enrollments
  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles (name, email),
      courses (title, slug)
    `)
    .order('enrolled_at', { ascending: false })
    .limit(10)

  // Get course statistics
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      enrolled_count,
      is_published,
      created_at
    `)
    .order('enrolled_count', { ascending: false })
    .limit(5)

  // Get subscription breakdown
  const { data: subscriptions } = await supabase
    .from('profiles')
    .select('subscription_tier')

  const tierCounts = subscriptions?.reduce((acc, p) => {
    acc[p.subscription_tier] = (acc[p.subscription_tier] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your platform and monitor key metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-4xl">{totalUsers || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {activeUsers || 0} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Published Courses</CardDescription>
            <CardTitle className="text-4xl">{totalCourses || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/courses" className="text-sm text-primary-600 hover:underline">
              Manage courses →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Enrollments</CardDescription>
            <CardTitle className="text-4xl">{totalEnrollments || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Enrollments</CardDescription>
            <CardTitle className="text-4xl">
              {totalCourses && totalEnrollments
                ? Math.round(totalEnrollments / totalCourses)
                : 0
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Per course
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
          <CardDescription>User breakdown by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{tierCounts.free || 0}</div>
              <div className="text-sm text-gray-600">Free Tier</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{tierCounts.basic || 0}</div>
              <div className="text-sm text-gray-600">Basic ($19/mo)</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{tierCounts.premium || 0}</div>
              <div className="text-sm text-gray-600">Premium ($49/mo)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Enrollment</CardTitle>
          <CardDescription>Most popular courses on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses?.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {course.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {course.is_published ? (
                        <Badge variant="default" className="text-xs">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        Created {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{course.enrolled_count}</div>
                  <div className="text-sm text-gray-600">enrollments</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
          <CardDescription>Latest student enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEnrollments?.map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-start justify-between pb-4 border-b last:border-0">
                <div>
                  <div className="font-semibold">
                    {enrollment.profiles?.name || enrollment.profiles?.email}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    enrolled in <Link
                      href={`/courses/${enrollment.courses?.slug}`}
                      className="text-primary-600 hover:underline"
                    >
                      {enrollment.courses?.title}
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Manage Courses</CardTitle>
            <CardDescription>Create, edit, and publish courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/courses"
              className="text-primary-600 hover:underline font-medium"
            >
              Go to Courses →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Manage Users</CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/users"
              className="text-primary-600 hover:underline font-medium"
            >
              Go to Users →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Platform Settings</CardTitle>
            <CardDescription>Configure platform settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/settings"
              className="text-primary-600 hover:underline font-medium"
            >
              Go to Settings →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
