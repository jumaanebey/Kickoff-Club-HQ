'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface AdminCoursesClientProps {
  courses: any[]
}

export function AdminCoursesClient({ courses }: AdminCoursesClientProps) {
  const { colors } = useTheme()

  const coursesWithStats = courses?.map(course => ({
    ...course,
    lessonCount: course.lessons?.length || 0
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Manage Courses</h1>
          <p className={colors.textSecondary}>Create, edit, and publish courses</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
          <Link href="/admin/courses/new">Create New Course</Link>
        </Button>
      </div>

      {/* Course Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Total Courses</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>{courses?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Published</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>
              {courses?.filter(c => c.is_published).length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Drafts</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>
              {courses?.filter(c => !c.is_published).length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
          <CardHeader className="pb-3">
            <CardDescription className={colors.textMuted}>Total Enrollments</CardDescription>
            <CardTitle className={cn("text-3xl", colors.text)}>
              {courses?.reduce((sum, c) => sum + (c.enrolled_count || 0), 0) || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Courses List */}
      <Card className={cn("border", colors.bgSecondary, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>All Courses</CardTitle>
          <CardDescription className={colors.textMuted}>Manage your course catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursesWithStats && coursesWithStats.length > 0 ? (
              coursesWithStats.map((course) => (
                <div
                  key={course.id}
                  className={cn("flex items-start justify-between p-4 border rounded-lg hover:opacity-80 transition-opacity", colors.cardBorder)}
                >
                  <div className="flex gap-4 flex-1">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className={cn("w-20 h-20 rounded flex items-center justify-center text-2xl", colors.bgTertiary)}>
                          🏈
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className={cn("font-semibold text-lg hover:text-orange-400", colors.text)}
                        >
                          {course.title}
                        </Link>
                        {course.is_published ? (
                          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>

                      <p className={cn("text-sm mb-2 line-clamp-2", colors.textSecondary)}>
                        {course.description}
                      </p>

                      <div className={cn("flex flex-wrap items-center gap-3 text-sm", colors.textMuted)}>
                        <div className="flex items-center gap-1">
                          <span>📚</span>
                          <span>{course.lessonCount} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{course.enrolled_count} enrolled</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{course.duration_minutes} min</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {course.category.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.difficulty_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.tier_required}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/courses/${course.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className={cn("text-center py-12", colors.textMuted)}>
                <div className="text-6xl mb-4">📚</div>
                <p className="mb-4">No courses created yet</p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/admin/courses/new">Create Your First Course</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
