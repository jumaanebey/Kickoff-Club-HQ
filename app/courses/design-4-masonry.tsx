'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Award, BookOpen, Clock } from 'lucide-react'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

// DESIGN 4: Masonry/Pinterest Style with Filter Sidebar
// Visual masonry layout with left sidebar filters
export default function CoursesPageDesign4({ searchParams }: PageProps) {
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
      <ThemedHeader activePage="courses" />

      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-700"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Explore Our Course Library
            </h1>
            <p className="text-xl text-white/90">
              Browse {courses.length}+ expert-led courses designed to take you from beginner to pro
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Left Sidebar Filters */}
          <aside className={cn("lg:sticky lg:top-24 h-fit space-y-6", colors.text)}>
            <div className={cn("p-6 rounded-xl border", colors.bgSecondary, colors.cardBorder)}>
              <h3 className={cn("font-bold text-lg mb-4", colors.text)}>Filters</h3>
              <Suspense fallback={<div className={colors.textMuted}>Loading...</div>}>
                <CourseFilters categories={categories || []} tags={tags || []} />
              </Suspense>
            </div>

            {/* Quick Stats */}
            <div className={cn("p-6 rounded-xl border", colors.bgSecondary, colors.cardBorder)}>
              <h3 className={cn("font-bold text-lg mb-4", colors.text)}>Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black", colors.text)}>{courses.length}</div>
                    <div className={cn("text-sm", colors.textMuted)}>Total Courses</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black", colors.text)}>150+</div>
                    <div className={cn("text-sm", colors.textMuted)}>Hours of Content</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className={cn("text-2xl font-black", colors.text)}>98%</div>
                    <div className={cn("text-sm", colors.textMuted)}>Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Masonry Grid */}
          <main>
            <div className="mb-6">
              <h2 className={cn("text-3xl font-black mb-2", colors.text)}>
                All Courses
              </h2>
              <p className={colors.textMuted}>
                Showing {courses.length} courses
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className={colors.textMuted}>Loading courses...</div>
              </div>
            ) : courses.length > 0 ? (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="break-inside-avoid">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>No courses found</h2>
                <p className={colors.textMuted}>
                  Try adjusting your filters
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
