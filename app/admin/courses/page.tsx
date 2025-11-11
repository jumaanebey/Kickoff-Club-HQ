import { createServerClient } from '@/database/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Courses - Admin',
  description: 'Manage all courses on the platform'
}

export default async function AdminCoursesPage() {
  const supabase = await createServerClient()

  // Get all courses with lesson count
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (id)
    `)
    .order('created_at', { ascending: false })

  const coursesWithStats = courses?.map(course => ({
    ...course,
    lessonCount: course.lessons?.length || 0
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Courses</h1>
          <p className="text-gray-600">Create, edit, and publish courses</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">Create New Course</Link>
        </Button>
      </div>

      {/* Course Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{courses?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl">
              {courses?.filter(c => c.is_published).length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-3xl">
              {courses?.filter(c => !c.is_published).length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Enrollments</CardDescription>
            <CardTitle className="text-3xl">
              {courses?.reduce((sum, c) => sum + (c.enrolled_count || 0), 0) || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>Manage your course catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursesWithStats && coursesWithStats.length > 0 ? (
              coursesWithStats.map((course) => (
                <div
                  key={course.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-2xl">
                          🏈
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="font-semibold text-lg hover:text-primary-600"
                        >
                          {course.title}
                        </Link>
                        {course.is_published ? (
                          <Badge variant="default">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📚</div>
                <p className="mb-4">No courses created yet</p>
                <Button asChild>
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
