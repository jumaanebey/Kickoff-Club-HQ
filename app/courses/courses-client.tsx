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
      <header className="pt-[140px] pb-16 bg-white border-b border-gray-200 text-center">
        <div className="container mx-auto px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-5">
            Learn Football
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-4 text-gray-900">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            From complete beginner to armchair analyst. Pick your path and start learning at your own pace.
          </p>
        </div>
      </header>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-8 max-w-[1200px]">
          {/* Filter Bar */}
          <div className="flex gap-3 mb-10 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
                  px-5 py-2.5 text-sm font-semibold rounded-full transition-all
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <div className={`relative aspect-[16/10] ${colorClass} flex items-center justify-center text-6xl`}>
                      {icon}
                      {/* Level Badge */}
                      <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {course.difficulty_level || 'Beginner'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex gap-4 text-sm text-gray-500 font-medium mb-2">
                        <span>{lessonCount} Lessons</span>
                        <span>{formatDuration(course.duration_minutes || 0)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-xl uppercase text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-500">
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
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🏈</div>
              <h2 className="text-2xl font-heading uppercase text-gray-900 mb-4">No Courses Found</h2>
              <p className="text-gray-500 mb-8">
                No courses match your current filter. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg uppercase hover:bg-orange-600 transition-colors"
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
