'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageProps {
  searchParams: {
    search?: string
    category?: string
    difficulty?: string
    tier?: string
    tags?: string
  }
}

// DESIGN 3: Featured Course + Grid Layout
// Highlights featured course prominently, then organized grid sections
export default function CoursesPageDesign3({ searchParams }: PageProps) {
  const { colors } = useTheme()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { getCoursesWithFilters, getAllCategories, getAllTags } = await import("@/database/queries/courses")

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

  const featuredCourse = courses[0]
  const beginnerCourses = courses.filter(c => c.difficulty_level === 'beginner').slice(0, 3)
  const intermediateCourses = courses.filter(c => c.difficulty_level === 'intermediate').slice(0, 3)
  const advancedCourses = courses.filter(c => c.difficulty_level === 'advanced').slice(0, 3)

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="courses" />

      {/* Simple Header */}
      <section className={cn('py-16 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <div className="max-w-2xl">
            <h1 className={cn("text-5xl md:text-6xl font-black mb-4", colors.text)}>
              Football Courses
            </h1>
            <p className={cn("text-xl", colors.textMuted)}>
              Expert-led training from fundamentals to pro-level strategies
            </p>
          </div>
        </div>
      </section>

      {/* Featured Course */}
      {featuredCourse && (
        <section className={cn('py-12 border-b', colors.bg, colors.cardBorder)}>
          <div className="container px-4">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-orange-400" />
              <h2 className={cn("text-sm font-bold uppercase tracking-wider", colors.text)}>Featured Course</h2>
            </div>
            <Link href={`/courses/${featuredCourse.slug}`}>
              <div className={cn("grid md:grid-cols-2 gap-8 p-8 rounded-2xl border group hover:border-orange-500/50 transition-all", colors.bgSecondary, colors.cardBorder)}>
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-6xl">
                  🏈
                </div>
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 w-fit mb-4">
                    <span className="text-sm font-medium text-orange-400">{featuredCourse.category}</span>
                  </div>
                  <h3 className={cn("text-3xl font-black mb-4 group-hover:text-orange-400 transition-colors", colors.text)}>
                    {featuredCourse.title}
                  </h3>
                  <p className={cn("text-lg mb-6 line-clamp-3", colors.textSecondary)}>
                    {featuredCourse.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm mb-6">
                    <div className={cn("flex items-center gap-2", colors.textMuted)}>
                      <span>⏱️</span>
                      <span>{featuredCourse.duration_minutes} min</span>
                    </div>
                    <div className={cn("flex items-center gap-2", colors.textMuted)}>
                      <span>📊</span>
                      <span className="capitalize">{featuredCourse.difficulty_level}</span>
                    </div>
                    <div className={cn("flex items-center gap-2", colors.textMuted)}>
                      <span>👥</span>
                      <span>{featuredCourse.enrolled_count} enrolled</span>
                    </div>
                  </div>
                  <Button className="w-fit bg-orange-500 hover:bg-orange-600 text-white">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className={cn('py-8 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <Suspense fallback={<div className={colors.textMuted}>Loading filters...</div>}>
            <CourseFilters categories={categories || []} tags={tags || []} />
          </Suspense>
        </div>
      </section>

      {/* Beginner Courses */}
      {beginnerCourses.length > 0 && (
        <section className="py-12">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={cn("text-3xl font-black mb-2", colors.text)}>Beginner Courses</h2>
                <p className={colors.textMuted}>Perfect for those just starting out</p>
              </div>
              <Button variant="ghost" className={cn("hover:text-orange-400", colors.text)}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intermediate Courses */}
      {intermediateCourses.length > 0 && (
        <section className={cn('py-12 border-t', colors.cardBorder)}>
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={cn("text-3xl font-black mb-2", colors.text)}>Intermediate Courses</h2>
                <p className={colors.textMuted}>Ready to level up your skills</p>
              </div>
              <Button variant="ghost" className={cn("hover:text-orange-400", colors.text)}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediateCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advanced Courses */}
      {advancedCourses.length > 0 && (
        <section className={cn('py-12 border-t', colors.cardBorder)}>
          <div className="container px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={cn("text-3xl font-black mb-2", colors.text)}>Advanced Courses</h2>
                <p className={colors.textMuted}>Master pro-level techniques</p>
              </div>
              <Button variant="ghost" className={cn("hover:text-orange-400", colors.text)}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
