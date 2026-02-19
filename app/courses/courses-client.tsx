'use client'

import { useState, useMemo } from 'react'
import { Course } from '@/types/database.types'
import { ThemedHeader } from '@/components/layout/themed-header'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  duration_seconds: number
  is_free: boolean
  order_index: number
}

interface CoursesClientProps {
  courses: Course[]
  enrollments?: any[]
}

// Color themes for course thumbnails
const courseColors: Record<string, string> = {
  beginner: 'bg-orange-500',
  intermediate: 'bg-gray-800',
  advanced: 'bg-amber-500',
  essential: 'bg-gray-800',
  core: 'bg-amber-500',
  bonus: 'bg-emerald-500',
  fun: 'bg-orange-500',
}

// Icons for courses based on category or index
const courseIcons = ['🏈', '👥', '📋', '🎯', '🛡️', '⚡', '📊', '🏆', '🎮']

export default function CoursesClient({ courses, enrollments = [] }: CoursesClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Get enrollment data for progress
  const enrollmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    enrollments.forEach(e => {
      if (e.course_id) {
        map[e.course_id] = e.progress_percentage || 0
      }
    })
    return map
  }, [enrollments])

  // Filter courses by difficulty
  const filteredCourses = useMemo(() => {
    if (activeFilter === 'all') return courses
    return courses.filter(course =>
      course.difficulty_level?.toLowerCase() === activeFilter.toLowerCase()
    )
  }, [courses, activeFilter])

  const filters = [
    { key: 'all', label: 'All Courses' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
  ]

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader activePage="courses" />

      {/* Page Header */}
      <header className="pt-24 sm:pt-32 md:pt-[140px] pb-10 sm:pb-12 md:pb-16 bg-white border-b border-gray-200 text-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-wider rounded-full mb-4 sm:mb-5">
            Learn Football
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-3 sm:mb-4 text-gray-900">
            All Courses
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            From complete beginner to armchair analyst. Pick your path and start learning at your own pace.
          </p>
        </div>
      </header>

      {/* Courses Section */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1200px]">
          {/* Filter Bar */}
          <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
                  px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all
                  ${activeFilter === filter.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredCourses.map((course, index) => {
              const lessonCount = course.lessons?.length || 0
              const progress = enrollmentMap[course.id] || 0
              const completedLessons = Math.round((progress / 100) * lessonCount)
              const colorClass = courseColors[course.difficulty_level?.toLowerCase() || 'beginner'] || 'bg-emerald-500'
              const icon = courseIcons[index % courseIcons.length]

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                    {/* Thumbnail */}
                    <div className={`relative aspect-[16/10] ${colorClass} flex items-center justify-center text-4xl sm:text-5xl md:text-6xl`}>
                      {icon}
                      {/* Level Badge */}
                      <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 text-gray-800 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase">
                        {course.difficulty_level || 'Beginner'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 md:p-6">
                      {/* Meta */}
                      <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-medium mb-2">
                        <span>{lessonCount} Lessons</span>
                        <span>{formatDuration(course.duration_minutes || 0)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg sm:text-xl uppercase text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-500">
                          {completedLessons}/{lessonCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🏈</div>
              <h2 className="text-xl sm:text-2xl font-heading uppercase text-gray-900 mb-3 sm:mb-4">No Courses Found</h2>
              <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                No courses match your current filter. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white font-bold text-sm sm:text-base rounded-lg uppercase hover:bg-orange-600 transition-colors"
              >
                View All Courses
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
