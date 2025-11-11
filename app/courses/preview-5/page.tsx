'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import Link from 'next/link'
import { Clock, Users, ArrowRight, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from "@/components/courses/course-card"

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

// DESIGN 5: List View with Toggle
// Detailed list view with option to switch to grid
export default function CoursesPageDesign5({ searchParams }: PageProps) {
  const { colors } = useTheme()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

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

      {/* Header */}
      <section className={cn('py-12 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <h1 className={cn("text-4xl md:text-5xl font-black mb-2", colors.text)}>
            All Courses
          </h1>
          <p className={cn("text-lg", colors.textMuted)}>
            {courses.length} courses available • Learn at your own pace
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className={cn('py-6 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <Suspense fallback={<div className={colors.textMuted}>Loading filters...</div>}>
            <CourseFilters categories={categories || []} tags={tags || []} />
          </Suspense>
        </div>
      </section>

      {/* View Toggle and Results */}
      <section className="py-8">
        <div className="container px-4">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className={cn("text-sm", colors.textMuted)}>
              Showing <span className={cn("font-semibold", colors.text)}>{courses.length}</span> results
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-orange-500 hover:bg-orange-600 text-white" : cn("border", colors.cardBorder, colors.text)}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "bg-orange-500 hover:bg-orange-600 text-white" : cn("border", colors.cardBorder, colors.text)}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className={colors.textMuted}>Loading courses...</div>
            </div>
          ) : courses.length > 0 ? (
            <>
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.slug}`}>
                      <div className={cn("p-6 rounded-xl border group hover:border-orange-500/50 transition-all", colors.bgSecondary, colors.cardBorder)}>
                        <div className="grid md:grid-cols-[200px,1fr,auto] gap-6 items-center">
                          {/* Thumbnail */}
                          <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-4xl">
                            {course.thumbnail_url ? (
                              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              '🏈'
                            )}
                          </div>

                          {/* Content */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn("inline-block px-2 py-1 rounded text-xs font-medium",
                                course.difficulty_level === 'beginner' && "bg-green-500/20 text-green-400 border border-green-500/30",
                                course.difficulty_level === 'intermediate' && "bg-orange-500/20 text-orange-400 border border-orange-500/30",
                                course.difficulty_level === 'advanced' && "bg-red-500/20 text-red-400 border border-red-500/30"
                              )}>
                                {course.difficulty_level}
                              </span>
                              <span className={cn("text-sm", colors.textMuted)}>
                                {course.category.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <h3 className={cn("text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors", colors.text)}>
                              {course.title}
                            </h3>
                            <p className={cn("text-sm mb-3 line-clamp-2", colors.textSecondary)}>
                              {course.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className={cn("flex items-center gap-1", colors.textMuted)}>
                                <Clock className="h-4 w-4" />
                                <span>{course.duration_minutes} min</span>
                              </div>
                              <div className={cn("flex items-center gap-1", colors.textMuted)}>
                                <Users className="h-4 w-4" />
                                <span>{course.enrolled_count} students</span>
                              </div>
                              {course.instructor_name && (
                                <div className={cn("flex items-center gap-1", colors.textMuted)}>
                                  <span>👤</span>
                                  <span>{course.instructor_name}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex items-center justify-end">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                              View Course
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>No courses found</h2>
              <p className={colors.textMuted}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
