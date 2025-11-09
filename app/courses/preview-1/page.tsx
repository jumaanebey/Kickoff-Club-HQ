'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { Trophy, Users, Star, TrendingUp } from 'lucide-react'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

// DESIGN 1: Hero with Sidebar Stats
// Modern layout with large hero section and sticky sidebar showing stats
export default function CoursesPageDesign1({ searchParams }: PageProps) {
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

      {/* Hero Section with Background Pattern */}
      <section className={cn('relative py-24 overflow-hidden border-b', colors.bg, colors.cardBorder)}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>
        <div className="container px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <Trophy className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Expert-Led Training</span>
            </div>
            <h1 className={cn("text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight", colors.text)}>
              Master Football,<br />One Course at a Time
            </h1>
            <p className={cn("text-xl md:text-2xl leading-relaxed", colors.textMuted)}>
              From fundamentals to advanced strategies. Learn from professional coaches with proven track records.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-[1fr,320px] gap-12">
          {/* Main Content */}
          <div>
            {/* Filters */}
            <div className={cn('p-6 rounded-xl border mb-8', colors.bgSecondary, colors.cardBorder)}>
              <h2 className={cn("text-xl font-bold mb-6", colors.text)}>Find Your Perfect Course</h2>
              <Suspense fallback={<div className={colors.textMuted}>Loading filters...</div>}>
                <CourseFilters categories={categories || []} tags={tags || []} />
              </Suspense>
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className={colors.textMuted}>Loading courses...</div>
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <p className={colors.textMuted}>
                    <span className={cn("font-semibold text-2xl", colors.text)}>{courses.length}</span> {courses.length !== 1 ? 'courses' : 'course'} available
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>No courses found</h2>
                <p className={colors.textMuted}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-6">
            <div className={cn("sticky top-24 space-y-6", colors.text)}>
              {/* Stats Card */}
              <div className={cn("p-6 rounded-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("text-lg font-bold mb-6", colors.text)}>Platform Stats</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black", colors.text)}>12,500+</div>
                        <div className={cn("text-sm", colors.textMuted)}>Active Students</div>
                      </div>
                    </div>
                  </div>
                  <div className={cn("border-t pt-6", colors.cardBorder)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black", colors.text)}>4.9/5</div>
                        <div className={cn("text-sm", colors.textMuted)}>Average Rating</div>
                      </div>
                    </div>
                  </div>
                  <div className={cn("border-t pt-6", colors.cardBorder)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black", colors.text)}>98%</div>
                        <div className={cn("text-sm", colors.textMuted)}>Completion Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white">
                <h3 className="text-xl font-bold mb-2">Not sure where to start?</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Take our quick assessment to find the perfect course for your skill level.
                </p>
                <button className="w-full px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors">
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
