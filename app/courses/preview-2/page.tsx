'use client'

import { Suspense, useEffect, useState } from 'react'
import { CourseCard } from "@/components/courses/course-card"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
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

// DESIGN 2: Category Tabs with Horizontal Filters
// Clean tab-based navigation with inline search and filters
export default function CoursesPageDesign2({ searchParams }: PageProps) {
  const { colors } = useTheme()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(searchParams.category || 'all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const { getCoursesWithFilters, getAllCategories, getAllTags } = await import("@/lib/db/queries")

        const [coursesData, categoriesData, tagsData] = await Promise.all([
          getCoursesWithFilters({
            search: searchParams.search,
            category: activeCategory === 'all' ? undefined : activeCategory,
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
  }, [searchParams.search, activeCategory, searchParams.difficulty, searchParams.tier, searchParams.tags])

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="courses" />

      {/* Compact Header */}
      <section className={cn('py-12 border-b', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <h1 className={cn("text-4xl md:text-5xl font-black mb-3", colors.text)}>
            Browse Courses
          </h1>
          <p className={cn("text-lg", colors.textMuted)}>
            {courses.length} courses to help you master football
          </p>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className={cn('sticky top-16 z-40 py-4 border-b backdrop-blur-xl', colors.bg, colors.cardBorder)}>
        <div className="container px-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", colors.textMuted)} />
              <Input
                type="text"
                placeholder="Search courses..."
                className={cn("pl-10 h-12", colors.input, colors.inputBorder, colors.inputText, colors.inputPlaceholder)}
              />
            </div>
            <Button
              variant="outline"
              className={cn("h-12 px-6 border", colors.cardBorder, colors.text)}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className={cn('border-b', colors.cardBorder)}>
        <div className="container px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all",
                activeCategory === 'all'
                  ? "bg-orange-500 text-white"
                  : cn("border hover:opacity-80", colors.cardBorder, colors.text)
              )}
            >
              All Courses
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all",
                  activeCategory === cat.slug
                    ? "bg-orange-500 text-white"
                    : cn("border hover:opacity-80", colors.cardBorder, colors.text)
                )}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Expandable Filters */}
      {showFilters && (
        <section className={cn('py-6 border-b', colors.bg, colors.cardBorder)}>
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={cn("text-sm font-medium mb-2 block", colors.text)}>Difficulty</label>
                <select className={cn("w-full h-10 rounded-lg border px-3", colors.input, colors.inputBorder, colors.inputText)}>
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className={cn("text-sm font-medium mb-2 block", colors.text)}>Access</label>
                <select className={cn("w-full h-10 rounded-lg border px-3", colors.input, colors.inputBorder, colors.inputText)}>
                  <option>All Access</option>
                  <option>Free</option>
                  <option>Basic</option>
                  <option>Premium</option>
                </select>
              </div>
              <div>
                <label className={cn("text-sm font-medium mb-2 block", colors.text)}>Sort By</label>
                <select className={cn("w-full h-10 rounded-lg border px-3", colors.input, colors.inputBorder, colors.inputText)}>
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Highest Rated</option>
                  <option>A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Course Grid */}
      <section className="py-8">
        <div className="container px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className={colors.textMuted}>Loading courses...</div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className={cn("text-2xl font-bold mb-2", colors.text)}>No courses found</h2>
              <p className={colors.textMuted}>
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
