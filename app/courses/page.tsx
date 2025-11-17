import Link from 'next/link'
import { CourseCard } from "@/components/courses/course-card"
import { ThemedHeader } from '@/components/layout/themed-header'
import { cn } from '@/shared/utils'
import { GraduationCap, Target, Zap, TrendingUp, ChevronRight, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAllCourses } from '@/database/queries/courses'

// Revalidate every 30 minutes - courses don't change frequently
export const revalidate = 1800
export default async function CoursesPage() {
  // Fetch courses on the server
  const courses = await getAllCourses() || []

  // Group courses by difficulty level
  const beginnerCourses = courses.filter(c => c.difficulty_level === 'beginner')
  const intermediateCourses = courses.filter(c => c.difficulty_level === 'intermediate')
  const advancedCourses = courses.filter(c => c.difficulty_level === 'advanced')

  return (
    <div className={cn('min-h-screen bg-gray-50')}>
      <ThemedHeader activePage="courses" />

      {/* Hero with Learning Path Visual */}
      <section className={cn('py-20 border-b bg-gray-50 border-gray-200')}>
        <div className="container px-4">
          <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
                <GraduationCap className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Your Learning Journey</span>
              </div>
              <h1 className={cn("text-5xl md:text-6xl font-black mb-6 text-gray-900")}>
                Start Your Football Mastery Path
              </h1>
              <p className={cn("text-xl mb-8 text-gray-500")}>
                Follow a structured curriculum designed to take you from complete beginner to advanced player. Every course builds on the last.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
                <Link href="/assessment">
                  Start Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Learning Path Visual */}
            <div className="relative">
              <div className={cn("space-y-6 text-gray-900")}>
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className={cn("font-bold text-lg text-gray-900")}>1. Beginner</div>
                    <div className={cn("text-sm text-gray-500")}>{beginnerCourses.length} courses • Build your foundation</div>
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
                    <div className={cn("font-bold text-lg text-gray-900")}>2. Intermediate</div>
                    <div className={cn("text-sm text-gray-500")}>{intermediateCourses.length} courses • Develop advanced skills</div>
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
                    <div className={cn("font-bold text-lg text-gray-900")}>3. Advanced</div>
                    <div className={cn("text-sm text-gray-500")}>{advancedCourses.length} courses • Master pro techniques</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-[1fr,320px] gap-12">
          {/* Main Content - Courses by Level */}
          <div className="space-y-16">
            {/* Level 1: Beginner */}
            {beginnerCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <span className="text-xl font-black text-green-400">1</span>
                  </div>
                  <div>
                    <h2 className={cn("text-3xl font-black text-gray-900")}>
                      Beginner Level
                    </h2>
                    <p className="text-gray-500">Perfect starting point for newcomers</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beginnerCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {/* Divider */}
            {beginnerCourses.length > 0 && intermediateCourses.length > 0 && (
              <div className="flex items-center gap-4 py-8">
                <div className={cn("flex-1 h-px border-gray-200")}></div>
                <div className={cn("px-4 py-2 rounded-full border bg-white border-gray-200")}>
                  <ChevronRight className="h-5 w-5 text-orange-400" />
                </div>
                <div className={cn("flex-1 h-px border-gray-200")}></div>
              </div>
            )}

            {/* Level 2: Intermediate */}
            {intermediateCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                    <span className="text-xl font-black text-orange-400">2</span>
                  </div>
                  <div>
                    <h2 className={cn("text-3xl font-black text-gray-900")}>
                      Intermediate Level
                    </h2>
                    <p className="text-gray-500">Build on your foundation</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {intermediateCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {/* Divider */}
            {intermediateCourses.length > 0 && advancedCourses.length > 0 && (
              <div className="flex items-center gap-4 py-8">
                <div className={cn("flex-1 h-px border-gray-200")}></div>
                <div className={cn("px-4 py-2 rounded-full border bg-white border-gray-200")}>
                  <ChevronRight className="h-5 w-5 text-orange-400" />
                </div>
                <div className={cn("flex-1 h-px border-gray-200")}></div>
              </div>
            )}

            {/* Level 3: Advanced */}
            {advancedCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                    <span className="text-xl font-black text-red-400">3</span>
                  </div>
                  <div>
                    <h2 className={cn("text-3xl font-black text-gray-900")}>
                      Advanced Level
                    </h2>
                    <p className="text-gray-500">Master professional techniques</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {advancedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {courses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className={cn("text-2xl font-bold mb-2 text-gray-900")}>No courses found</h2>
                <p className="text-gray-500">
                  Check back soon for new courses
                </p>
              </div>
            )}
          </div>

          {/* Sticky Sidebar - Design 1 Stats */}
          <div className="space-y-6">
            <div className={cn("sticky top-24 space-y-6 text-gray-900")}>
              {/* CTA Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white">
                <h3 className="text-xl font-bold mb-2">Not sure where to start?</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Take our quick assessment to find the perfect course for your skill level.
                </p>
                <Link href="/assessment" className="block w-full px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors text-center">
                  Start Assessment
                </Link>
              </div>

              {/* Stats Card */}
              <div className={cn("p-6 rounded-xl border bg-white border-gray-200")}>
                <h3 className={cn("text-lg font-bold mb-6 text-gray-900")}>Platform Stats</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black text-gray-900")}>12,500+</div>
                        <div className={cn("text-sm text-gray-500")}>Active Students</div>
                      </div>
                    </div>
                  </div>
                  <div className={cn("border-t pt-6 border-gray-200")}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black text-gray-900")}>4.9/5</div>
                        <div className={cn("text-sm text-gray-500")}>Average Rating</div>
                      </div>
                    </div>
                  </div>
                  <div className={cn("border-t pt-6 border-gray-200")}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <div className={cn("text-2xl font-black text-gray-900")}>98%</div>
                        <div className={cn("text-sm text-gray-500")}>Completion Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
