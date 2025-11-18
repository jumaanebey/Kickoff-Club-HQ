'use client'

import { useMemo } from 'react'
import { Course } from '@/types/database.types'
import { ThemedHeader } from '@/components/layout/themed-header'
import { CourseCard } from '@/components/courses/course-card'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface CoursesClientProps {
  courses: Course[]
}

export default function CoursesClient({ courses }: CoursesClientProps) {
  const { colors } = useTheme()

  // Group courses by difficulty level
  const coursesByDifficulty = useMemo(() => {
    const grouped = {
      beginner: courses.filter(c => c.difficulty_level === 'beginner'),
      intermediate: courses.filter(c => c.difficulty_level === 'intermediate'),
      advanced: courses.filter(c => c.difficulty_level === 'advanced')
    }
    return grouped
  }, [courses])


  return (
    <div className={cn("min-h-screen", colors.bg)}>
      <ThemedHeader activePage="courses" />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
            Football Courses
          </h1>
          <p className={cn("text-lg max-w-2xl", colors.textSecondary)}>
            Master the game with our comprehensive football courses. From beginner basics to advanced strategies.
          </p>
        </div>


        {/* Beginner Courses */}
        {coursesByDifficulty.beginner.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className={cn("text-3xl font-bold", colors.text)}>
                Beginner Courses
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                {coursesByDifficulty.beginner.length} courses
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByDifficulty.beginner.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Intermediate Courses */}
        {coursesByDifficulty.intermediate.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className={cn("text-3xl font-bold", colors.text)}>
                Intermediate Courses
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {coursesByDifficulty.intermediate.length} courses
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByDifficulty.intermediate.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Advanced Courses */}
        {coursesByDifficulty.advanced.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className={cn("text-3xl font-bold", colors.text)}>
                Advanced Courses
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                {coursesByDifficulty.advanced.length} courses
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByDifficulty.advanced.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {courses.length === 0 && (
          <div className={cn("text-center py-20", colors.textSecondary)}>
            <div className="text-6xl mb-4">🏈</div>
            <h3 className={cn("text-2xl font-bold mb-2", colors.text)}>No courses available yet</h3>
            <p>Check back soon for new football courses!</p>
          </div>
        )}
      </main>
    </div>
  )
}
