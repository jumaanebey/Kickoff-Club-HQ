'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface AdminDashboardClientProps {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  activeUsers: number
  tierCounts: Record<string, number>
  courses: any[]
  recentEnrollments: any[]
}

export function AdminDashboardClient({
  totalUsers,
  totalCourses,
  totalEnrollments,
  activeUsers,
  tierCounts,
  courses,
  recentEnrollments
}: AdminDashboardClientProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8">
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Admin Dashboard</h1>
        <p className={colors.textSecondary}>Manage your platform and monitor key metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Total Users</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{totalUsers || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm", colors.textMuted)}>
              {activeUsers || 0} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Published Courses</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{totalCourses || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/courses" className="text-sm text-orange-400 hover:text-orange-500">
              Manage courses →
            </Link>
          </CardContent>
        </Card>

        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Total Enrollments</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>{totalEnrollments || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm", colors.textMuted)}>
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Avg. Enrollments</CardDescription>
            <CardTitle className={cn("text-4xl", colors.text)}>
              {totalCourses && totalEnrollments
                ? Math.round(totalEnrollments / totalCourses)
                : 0
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm", colors.textMuted)}>
              Per course
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Subscription Distribution</CardTitle>
          <CardDescription className={colors.textMuted}>User breakdown by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={cn("p-4 rounded-lg", colors.bgTertiary)}>
              <div className={cn("text-2xl font-bold", colors.text)}>{tierCounts.free || 0}</div>
              <div className={cn("text-sm", colors.textMuted)}>Free Tier</div>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400">{tierCounts.basic || 0}</div>
              <div className={cn("text-sm", colors.textMuted)}>Basic ($19/mo)</div>
            </div>
            <div className="p-4 rounded-lg bg-orange-600/10 border border-orange-600/30">
              <div className="text-2xl font-bold text-orange-500">{tierCounts.premium || 0}</div>
              <div className={cn("text-sm", colors.textMuted)}>Premium ($49/mo)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Courses */}
      <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Top Courses by Enrollment</CardTitle>
          <CardDescription className={colors.textMuted}>Most popular courses on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses?.map((course, index) => (
              <div key={course.id} className={cn("flex items-center justify-between pb-4 border-b last:border-0", colors.cardBorder)}>
                <div className="flex items-center gap-4">
                  <div className={cn("text-2xl font-bold", colors.textMuted)}>#{index + 1}</div>
                  <div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className={cn("font-semibold hover:text-orange-400", colors.text)}
                    >
                      {course.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {course.is_published ? (
                        <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                      <span className={cn("text-xs", colors.textMuted)}>
                        Created {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", colors.text)}>{course.enrolled_count}</div>
                  <div className={cn("text-sm", colors.textMuted)}>enrollments</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Enrollments */}
      <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Recent Enrollments</CardTitle>
          <CardDescription className={colors.textMuted}>Latest student enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEnrollments?.map((enrollment: any) => (
              <div key={enrollment.id} className={cn("flex items-start justify-between pb-4 border-b last:border-0", colors.cardBorder)}>
                <div>
                  <div className={cn("font-semibold", colors.text)}>
                    {enrollment.profiles?.name || enrollment.profiles?.email}
                  </div>
                  <div className={cn("text-sm mt-1", colors.textSecondary)}>
                    enrolled in <Link
                      href={`/courses/${enrollment.courses?.slug}`}
                      className="text-orange-400 hover:text-orange-500"
                    >
                      {enrollment.courses?.title}
                    </Link>
                  </div>
                </div>
                <div className={cn("text-sm text-right", colors.textMuted)}>
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
        <Card className={cn("border hover:opacity-80 transition-opacity", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={cn("text-lg", colors.text)}>Manage Courses</CardTitle>
            <CardDescription className={colors.textMuted}>Create, edit, and publish courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/courses"
              className="text-orange-400 hover:text-orange-500 font-medium"
            >
              Go to Courses →
            </Link>
          </CardContent>
        </Card>

        <Card className={cn("border hover:opacity-80 transition-opacity", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={cn("text-lg", colors.text)}>Manage Users</CardTitle>
            <CardDescription className={colors.textMuted}>View and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/users"
              className="text-orange-400 hover:text-orange-500 font-medium"
            >
              Go to Users →
            </Link>
          </CardContent>
        </Card>

        <Card className={cn("border hover:opacity-80 transition-opacity", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={cn("text-lg", colors.text)}>Platform Settings</CardTitle>
            <CardDescription className={colors.textMuted}>Configure platform settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/settings"
              className="text-orange-400 hover:text-orange-500 font-medium"
            >
              Go to Settings →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
