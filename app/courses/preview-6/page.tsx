'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { GraduationCap, Target, Zap, TrendingUp, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

// DESIGN 6: Learning Path Style
// Emphasizes progression and learning journey
export default function CoursesPageDesign6({ searchParams }: PageProps) {
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

  const beginnerCourses = courses.filter(c => c.difficulty_level === 'beginner')
  const intermediateCourses = courses.filter(c => c.difficulty_level === 'intermediate')
  const advancedCourses = courses.filter(c => c.difficulty_level === 'advanced')

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="courses" />

      {/* Hero with Learning Path Visual */}
      <section className={cn('py-20 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
                <GraduationCap className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Your Learning Journey</span>
              </div>
              <h1 className={cn("text-5xl md:text-6xl font-black mb-6", colors.text)}>
                Start Your Football Mastery Path
              </h1>
              <p className={cn("text-xl mb-8", colors.textMuted)}>
                Follow a structured curriculum designed to take you from complete beginner to advanced player. Every course builds on the last.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
                Begin Your Journey
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Learning Path Visual */}
            <div className="relative">
              <div className={cn("space-y-6", colors.text)}>
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className={cn("font-bold text-lg", colors.text)}>1. Beginner</div>
                    <div className={cn("text-sm", colors.textMuted)}>{beginnerCourses.length} courses • Build your foundation</div>
                  </div>
                </div>

                {/* Connector */}
                <div className="ml-8 h-8 w-0.5 bg-gradient-to-b from-green-500 to-orange-500"></div>

                {/* Step 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                    <Target className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className={cn("font-bold text-lg", colors.text)}>2. Intermediate</div>
                    <div className={cn("text-sm", colors.textMuted)}>{intermediateCourses.length} courses • Develop advanced skills</div>
                  </div>
                </div>

                {/* Connector */}
                <div className="ml-8 h-8 w-0.5 bg-gradient-to-b from-orange-500 to-red-500"></div>

                {/* Step 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className={cn("font-bold text-lg", colors.text)}>3. Advanced</div>
                    <div className={cn("text-sm", colors.textMuted)}>{advancedCourses.length} courses • Master pro techniques</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className={cn('py-8 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <Suspense fallback={<div className={colors.textMuted}>Loading filters...</div>}>
            <CourseFilters categories={categories || []} tags={tags || []} />
          </Suspense>
        </div>
      </section>

      {/* Level 1: Beginner */}
      {beginnerCourses.length > 0 && (
        <section className="py-16">
          <div className="container px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <span className="text-xl font-black text-green-400">1</span>
              </div>
              <div>
                <h2 className={cn("text-3xl font-black", colors.text)}>
                  Beginner Level
                </h2>
                <p className={colors.textMuted}>Perfect starting point for newcomers</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      {beginnerCourses.length > 0 && intermediateCourses.length > 0 && (
        <div className="container px-4">
          <div className="flex items-center gap-4 py-8">
            <div className={cn("flex-1 h-px", colors.cardBorder)}></div>
            <div className={cn("px-4 py-2 rounded-full border", colors.bgSecondary, colors.cardBorder)}>
              <ChevronRight className="h-5 w-5 text-orange-400" />
            </div>
            <div className={cn("flex-1 h-px", colors.cardBorder)}></div>
          </div>
        </div>
      )}

      {/* Level 2: Intermediate */}
      {intermediateCourses.length > 0 && (
        <section className="py-16">
          <div className="container px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                <span className="text-xl font-black text-orange-400">2</span>
              </div>
              <div>
                <h2 className={cn("text-3xl font-black", colors.text)}>
                  Intermediate Level
                </h2>
                <p className={colors.textMuted}>Build on your foundation</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediateCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      {intermediateCourses.length > 0 && advancedCourses.length > 0 && (
        <div className="container px-4">
          <div className="flex items-center gap-4 py-8">
            <div className={cn("flex-1 h-px", colors.cardBorder)}></div>
            <div className={cn("px-4 py-2 rounded-full border", colors.bgSecondary, colors.cardBorder)}>
              <ChevronRight className="h-5 w-5 text-orange-400" />
            </div>
            <div className={cn("flex-1 h-px", colors.cardBorder)}></div>
          </div>
        </div>
      )}

      {/* Level 3: Advanced */}
      {advancedCourses.length > 0 && (
        <section className="py-16">
          <div className="container px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <span className="text-xl font-black text-red-400">3</span>
              </div>
              <div>
                <h2 className={cn("text-3xl font-black", colors.text)}>
                  Advanced Level
                </h2>
                <p className={colors.textMuted}>Master professional techniques</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
