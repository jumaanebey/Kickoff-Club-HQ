// @ts-nocheck - TypeScript doesn't understand notFound() never returns
'use client'

import Link from "next/link"
import Image from "next/image"
import { EnrollButton } from "@/components/enrollment/enroll-button"
import { SaveCourseButton } from "@/components/enrollment/save-course-button"
import { ReviewForm } from "@/components/reviews/review-form"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { ThemedHeader } from '@/components/layout/themed-header'
import { CourseStructuredData } from "@/components/seo/structured-data"
import { Play, Clock, Users, BookOpen, Star, CheckCircle, Trophy, ArrowRight, Lock } from 'lucide-react'

interface CourseDetailClientProps {
  course: any
  user: any
  reviews: any[]
  rating: any
  isEnrolled: boolean
  userSubscription: any
  hasAccess: boolean
  hasCompleted: boolean
  searchParams: {
    access?: string
    message?: string
  }
}

export default function CourseDetailClient({
  course,
  user,
  reviews,
  rating,
  isEnrolled,
  userSubscription,
  hasAccess,
  hasCompleted,
  searchParams
}: CourseDetailClientProps) {
  const difficultyColors = {
    beginner: "bg-emerald-500 text-white",
    intermediate: "bg-amber-400 text-gray-900",
    advanced: "bg-orange-500 text-white"
  } as const

  const firstLesson = course.lessons && course.lessons.length > 0 ? course.lessons[0] : null

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseStructuredData course={course} rating={rating} />
      <ThemedHeader activePage="courses" />

      {/* Access Denied Alert */}
      {searchParams.access === 'denied' && searchParams.message && (
        <div className="bg-orange-500 text-white sticky top-[72px] z-40">
          <div className="container mx-auto px-8 py-4 flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <p className="font-bold">{decodeURIComponent(searchParams.message)}</p>
          </div>
        </div>
      )}

      <main className="container mx-auto px-8 pt-[140px] pb-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-12 mb-16">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 uppercase tracking-wider">
              <Link href="/courses" className="hover:text-orange-500 transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">{course.title}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`text-xs font-bold px-3 py-1 uppercase ${difficultyColors[course.difficulty_level as keyof typeof difficultyColors]}`}>
                {course.difficulty_level}
              </span>
              {course.category && (
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 uppercase">
                  {course.category.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-heading uppercase mb-6 text-gray-900">
              {course.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
              {course.description}
            </p>

            <div className="relative bg-white border-2 border-gray-300 p-6 mb-8">
              <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-500">Duration</div>
                    <div className="font-heading text-gray-900">{course.duration_minutes} Min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-500">Lessons</div>
                    <div className="font-heading text-gray-900">{course.lessons?.length || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 text-gray-900 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-500">Enrolled</div>
                    <div className="font-heading text-gray-900">{course.enrolled_count || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTA - Direct to Lesson */}
            <div className="flex flex-col sm:flex-row gap-4">
              {firstLesson && (
                <Link
                  href={`/courses/${course.slug}/lessons/${firstLesson.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start Watching Now
                </Link>
              )}
              {!isEnrolled && (
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  size="lg"
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold uppercase hover:bg-gray-50 transition-colors"
                  variant="outline"
                />
              )}
            </div>
          </div>

          {/* Sidebar / Preview Card */}
          <div className="space-y-6">
            {/* Video Preview Card */}
            <div className="relative bg-white border-2 border-gray-300 overflow-hidden group">
              <div className="absolute top-3 left-3 right-[-12px] bottom-[-12px] bg-amber-400 -z-10" />

              {firstLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${firstLesson.id}`} className="block relative aspect-video">
                  <Image
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800&auto=format&fit=crop'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-orange-500 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 uppercase mb-2 inline-block">Free Preview</span>
                    <p className="text-white font-bold text-sm truncate">{firstLesson.title}</p>
                  </div>
                </Link>
              ) : (
                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl">🏈</span>
                </div>
              )}

              <div className="p-6">
                <h3 className="font-heading text-lg uppercase text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  What You'll Learn
                </h3>
                <ul className="space-y-3 mb-6">
                  {[
                    'Master fundamental techniques',
                    'Expert coaching drills',
                    'Game-situation analysis',
                    'Pro-level strategies'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {!isEnrolled && (
                  <div className="pt-4 border-t-2 border-retro-border">
                    <p className="text-sm text-center text-gray-500 mb-4">
                      {course.tier_required === 'free' ? 'Free for everyone' : `Requires ${course.tier_required} plan`}
                    </p>
                    <Link
                      href="/pricing"
                      className="block w-full text-center py-3 bg-gray-900 text-white font-bold uppercase hover:bg-gray-900/90 transition-colors"
                    >
                      View Plans
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase">
              {course.lessons?.length || 0} Lessons
            </span>
            <h2 className="text-2xl font-heading uppercase text-gray-900">Course Curriculum</h2>
          </div>

          <div className="space-y-4">
            {course.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, index: number) => (
              <Link key={lesson.id} href={`/courses/${course.slug}/lessons/${lesson.id}`} className="group block">
                <div className="relative bg-white border-2 border-gray-300 hover:-translate-y-1 transition-all">
                  <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />

                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-heading group-hover:bg-orange-500 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-lg uppercase text-gray-900 truncate group-hover:text-orange-500 transition-colors">{lesson.title}</h3>
                        {lesson.is_free && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase">Free</span>}
                        {lesson.completed && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <span className="text-sm font-heading text-gray-500">{Math.floor(lesson.duration_seconds / 60)}:00</span>
                      <div className="w-10 h-10 bg-gray-50 border-2 border-gray-300 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-colors">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-heading uppercase text-gray-900">Student Reviews</h2>
            <div className="flex items-center gap-2 bg-amber-400 text-gray-900 px-4 py-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-heading">{rating?.average || 0}</span>
              <span className="text-sm opacity-80">({rating?.count || 0})</span>
            </div>
          </div>

          {user && isEnrolled && (
            <div className="relative bg-white border-2 border-dashed border-gray-300 p-6 mb-12">
              <h3 className="font-heading text-xl uppercase text-gray-900 mb-2">Share Your Experience</h3>
              <p className="text-gray-500 mb-4">Help other students by rating this course</p>
              <ReviewForm courseId={course.id} hasCompleted={hasCompleted} />
            </div>
          )}

          <ReviewsList reviews={reviews} />
        </section>

      </main>
    </div>
  )
}
