import { Suspense } from 'react'
import { getCoursesWithFilters, getAllCategories, getAllTags } from "@/lib/db/queries"
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { Header } from "@/components/layout/header"

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const [courses, categories, tags] = await Promise.all([
    getCoursesWithFilters({
      search: searchParams.search,
      category: searchParams.category,
      difficulty: searchParams.difficulty,
      tier: searchParams.tier,
      tags: searchParams.tags?.split(',').filter(Boolean)
    }),
    getAllCategories(),
    getAllTags()
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header activePage="courses" />

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Football Fundamentals
            </h1>
            <p className="text-lg text-gray-600">
              Choose from our structured courses designed by expert coaches. From beginner to advanced.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-gray-50 py-6">
        <div className="container px-4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <CourseFilters categories={categories || []} tags={tags || []} />
          </Suspense>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{courses.length}</span> course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">No courses found</h2>
              <p className="text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
