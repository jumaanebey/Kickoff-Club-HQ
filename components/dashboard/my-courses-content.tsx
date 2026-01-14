'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Play } from 'lucide-react'

interface CourseWithProgress {
  id: string
  course: any
  lessons: any[]
  completedCount: number
  totalLessons: number
  progress: number
  nextLesson: any
  isCompleted: boolean
}

interface MyCoursesContentProps {
  inProgressCourses: CourseWithProgress[]
  coursesWithProgress: CourseWithProgress[]
}

export function MyCoursesContent({ inProgressCourses, coursesWithProgress }: MyCoursesContentProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4">
          My Learning
        </span>
        <h1 className="text-4xl md:text-5xl font-heading uppercase mb-2 text-gray-900">
          My <span className="text-orange-500">Courses</span>
        </h1>
        <p className="text-lg text-gray-600">Track your learning progress and continue where you left off</p>
      </div>

      {/* In Progress */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase">
            {inProgressCourses.length} Active
          </span>
          <h2 className="text-xl font-heading uppercase text-gray-900">In Progress</h2>
        </div>

        {inProgressCourses.length === 0 ? (
          <div className="relative bg-white border-2 border-gray-900 p-12 text-center">
            <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />
            <div className="w-20 h-20 bg-gray-50 border-2 border-gray-900 flex items-center justify-center mx-auto mb-6 text-4xl">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="font-heading text-2xl uppercase text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">You haven't started any courses yet</p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors"
            >
              Browse Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {inProgressCourses.map((enrollment: any) => {
              const course = enrollment.course
              return (
                <div key={enrollment.id} className="relative bg-white border-2 border-gray-900 group hover:-translate-y-1 transition-all">
                  <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10 group-hover:top-3 group-hover:left-3 transition-all" />

                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-6xl">
                          🏈
                        </div>
                      )}
                      {/* Progress Badge */}
                      <div className="absolute top-3 right-3 bg-gray-900 text-white font-heading text-sm px-2 py-1">
                        {enrollment.progress}%
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-6">
                      <div className="mb-4">
                        <h3 className="font-heading text-2xl uppercase text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          Instructor: <span className="text-gray-900 font-medium">{course.instructor_name}</span>
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500 uppercase text-xs font-bold">
                            {enrollment.completedCount} of {enrollment.totalLessons} lessons completed
                          </span>
                        </div>
                        <div className="h-3 bg-gray-50 border-2 border-gray-900/20">
                          <div
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {enrollment.nextLesson && (
                          <div className="text-sm text-gray-500">
                            <span className="font-bold text-gray-900">Next:</span> {enrollment.nextLesson.title}
                          </div>
                        )}
                        <div className="flex gap-3">
                          {enrollment.nextLesson && (
                            <Link
                              href={`/courses/${course.slug}/lessons/${enrollment.nextLesson.slug}`}
                              className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white font-bold uppercase text-sm hover:bg-orange-600 transition-colors"
                            >
                              <Play className="w-4 h-4 mr-2 fill-current" />
                              Continue
                            </Link>
                          )}
                          <Link
                            href={`/courses/${course.slug}`}
                            className="inline-flex items-center px-5 py-2.5 bg-white border-2 border-gray-900 text-gray-900 font-bold uppercase text-sm hover:bg-gray-50 transition-colors"
                          >
                            View Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Empty State (shown when no courses at all) */}
      {coursesWithProgress.length === 0 && inProgressCourses.length === 0 && (
        <div className="relative bg-white border-2 border-gray-900 p-12 text-center">
          <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-amber-400 -z-10" />
          <div className="text-6xl mb-6">📚</div>
          <h3 className="font-heading text-3xl uppercase text-gray-900 mb-3">Start Your Journey</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Explore our course catalog and begin mastering football today
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors"
          >
            Browse Courses
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      )}
    </div>
  )
}
