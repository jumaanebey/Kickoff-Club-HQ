'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

export default function CoursesPage({ searchParams }: PageProps) {
  const { colors } = useTheme()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { getCoursesWithFilters, getAllCategories, getAllTags } = await import("@/lib/db/queries")

        const [coursesData, categoriesData, tagsData] = await Promise.all([
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

        setCourses(coursesData)
        setCategories(categoriesData || [])
        setTags(tagsData || [])
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchParams.search, searchParams.category, searchParams.difficulty, searchParams.tier, searchParams.tags])

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      {/* Header */}
      <ThemedHeader activePage="courses" />

      {/* Page Header */}
      <section className={cn('py-20 border-b border-white/10', colors.bg)}>
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Master Football Fundamentals
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Choose from our structured courses designed by expert coaches. From beginner to advanced.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className={cn('border-b border-white/10 py-6', colors.bg)}>
        <div className="container px-4">
          <Suspense fallback={<div className="text-white/50">Loading filters...</div>}>
            <CourseFilters categories={categories || []} tags={tags || []} />
          </Suspense>
        </div>
      </section>

      {/* Course Grid */}
      <section className={cn('py-12', colors.bg)}>
        <div className="container px-4">
          <div className="mb-6">
            <p className="text-white/60">
              Showing <span className="font-semibold text-white">{courses.length}</span> course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-white/60">Loading courses...</div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">No courses found</h2>
              <p className="text-white/60">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
