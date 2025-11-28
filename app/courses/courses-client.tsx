'use client'

<<<<<<< HEAD
import { useState, useMemo } from 'react'
=======
>>>>>>> origin/main
import { Course } from '@/types/database.types'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
<<<<<<< HEAD
import { SeasonMode } from '@/components/gamification/season-mode'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CourseThumbnail } from '@/components/ui/generated-visuals'
=======
import { motion } from 'framer-motion'
import { Play, Lock, Zap } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  duration_seconds: number
  is_free: boolean
  order_index: number
}
>>>>>>> origin/main

interface CoursesClientProps {
  courses: Course[]
  enrollments?: any[]
}

<<<<<<< HEAD
=======
// Gradient colors for each free lesson card
const cardGradients = [
  'from-orange-500 via-red-500 to-pink-500',
  'from-blue-500 via-purple-500 to-pink-500',
  'from-green-500 via-teal-500 to-cyan-500',
]

// Icons for each lesson
const lessonIcons = ['🏈', '🎯', '🏆']

// Fun descriptions for all lessons
const lessonDescriptions: Record<string, string> = {
  // Free lessons
  'How Downs Work': 'Four chances to move the ball. Simple, right? Let\'s break it down!',
  'Understanding the Field': 'The 100-yard battlefield explained. Know your turf!',
  'Scoring: Touchdowns & More': 'Six points for a TD, three for a field goal - master the math of winning.',
  // Premium lessons
  'Offensive Positions': 'Meet the playmakers - QBs, RBs, WRs, and the big guys up front.',
  'Defensive Positions': 'The stoppers, the hitters, the ball hawks. Defense wins championships!',
  'Special Teams Basics': 'Kicks, punts, and returns - the hidden game-changers.',
  'Basic Offensive Plays': 'Runs, passes, and play-action. Build your offensive playbook.',
  'Basic Defensive Formations': '4-3, 3-4, nickel, dime - learn to read the defense.',
  'Game Flow & Clock': 'Quarters, timeouts, and two-minute drills. Master the clock.',
  'Penalties Explained': 'Flags fly! Know what they mean and why refs throw them.',
}

>>>>>>> origin/main
export default function CoursesClient({ courses, enrollments = [] }: CoursesClientProps) {
  const { colors } = useTheme()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

<<<<<<< HEAD
  // Calculate overall season progress
  const seasonProgress = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return 0
    const totalProgress = enrollments.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0)
    return Math.min(100, Math.round(totalProgress / enrollments.length))
  }, [enrollments])

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesDifficulty = selectedDifficulty ? course.difficulty_level === selectedDifficulty : true
      return matchesDifficulty
    })
  }, [courses, selectedDifficulty])

  // Get featured course (e.g., the first advanced one, or just the first one)
  const featuredCourse = useMemo(() => {
    return courses.find(c => c.difficulty_level === 'advanced') || courses[0]
  }, [courses])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }
=======
  // Get all lessons from all courses, sorted by order_index
  const allLessons: (Lesson & { courseSlug: string })[] = courses.flatMap(course =>
    (course.lessons || []).map((lesson: Lesson) => ({
      ...lesson,
      courseSlug: course.slug
    }))
  ).sort((a, b) => a.order_index - b.order_index)

  // Separate free and premium lessons
  const freeLessons = allLessons.filter(l => l.is_free)
  const premiumLessons = allLessons.filter(l => !l.is_free)
>>>>>>> origin/main

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", colors.bg)}>
      <ThemedHeader activePage="courses" />

<<<<<<< HEAD
      <main className="container mx-auto px-4 py-6 md:py-12">

        {/* Hero Section */}
        <div className="relative mb-12 md:mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10" />

          <div className="grid lg:grid-cols-[1fr,350px] gap-8 md:gap-12 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-3 py-1 text-sm">
                  <Sparkles className="w-3 h-3 mr-2 inline-block" />
                  Level Up Your Game
                </Badge>
                <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tight", colors.text)}>
                  Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Grounds</span>
                </h1>
                <p className={cn("text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-6 md:mb-8", colors.textSecondary)}>
                  Master every aspect of football with our pro-level curriculum.
                  From fundamental drills to advanced tactical analysis.
                </p>

                {/* Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                      className={cn(
                        "capitalize h-10 md:h-12 px-4 md:px-6 border-2 whitespace-nowrap flex-shrink-0",
                        selectedDifficulty === level
                          ? "bg-orange-600 hover:bg-orange-700 border-orange-600 text-white"
                          : "hover:border-orange-500 hover:text-orange-500"
                      )}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Stats / Progress Card - Now visible on mobile too */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={cn("p-4 md:p-6 rounded-2xl border backdrop-blur-md shadow-2xl", colors.card, colors.cardBorder)}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  Season Progress
                </h3>
                <span className="text-xl md:text-2xl font-black text-orange-500">{seasonProgress}%</span>
              </div>
              <SeasonMode progress={seasonProgress} />
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border grid grid-cols-2 gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-foreground">{enrollments.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Enrolled</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-foreground">{courses.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Courses</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Course (only show if no filter active) */}
        {!selectedDifficulty && featuredCourse && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-6 md:h-8 w-1 bg-orange-500 rounded-full" />
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">Featured Course</h2>
            </div>
            <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden border-2 border-border bg-card">
              <div className="grid md:grid-cols-2 gap-0">


                <div className="relative h-56 sm:h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {featuredCourse.thumbnail_url ? (
                    <img
                      src={featuredCourse.thumbnail_url}
                      alt={featuredCourse.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <CourseThumbnail
                      title={featuredCourse.title}
                      category={featuredCourse.category || 'general'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 z-20">
                    <Badge className="bg-orange-500 text-white border-0 mb-2 text-xs md:text-sm">FEATURED</Badge>
                  </div>
                </div>
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
                    <Badge variant="outline" className="uppercase text-xs">{featuredCourse.difficulty_level}</Badge>
                    <span>•</span>
                    <span>{featuredCourse.duration_minutes} min</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 group-hover:text-orange-500 transition-colors">
                    {featuredCourse.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 md:mb-8 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                    {featuredCourse.description}
                  </p>
                  <Button size="lg" className="w-full md:w-auto bg-foreground text-background hover:bg-orange-600 hover:text-white transition-colors h-11 md:h-12">
                    Start Learning Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Course Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-blue-500 rounded-full" />
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {selectedDifficulty ? `${selectedDifficulty} Courses` : 'All Courses'}
              </h2>
            </div>
            <span className="text-muted-foreground font-mono text-sm">
              {filteredCourses.length} RESULT{filteredCourses.length !== 1 ? 'S' : ''}
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {filteredCourses.map((course) => {
                  const enrollment = enrollments.find(e => e.course_id === course.id)
                  const progress = enrollment?.progress_percentage || 0

                  return (
                    <motion.div key={course.id} variants={itemVariants} layout>
                      <CourseCard course={course} progress={progress} />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/50"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No courses found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any courses matching your criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedDifficulty(null)}
              >
                Clear Filter
              </Button>
            </motion.div>
          )}
        </section>
=======
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-4"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Start Learning Today</span>
          </motion.div>
          <h1 className={cn("text-4xl md:text-5xl font-black mb-4", colors.text)}>
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Football</span>
          </h1>
          <p className={cn("text-lg max-w-xl mx-auto", colors.textSecondary)}>
            Watch free lessons and become a football expert
          </p>
        </motion.div>

        {/* Free Videos - Featured Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {freeLessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/courses/${lesson.courseSlug}/lessons/${lesson.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative h-full"
                >
                  {/* Card */}
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl h-full",
                    "bg-gradient-to-br",
                    cardGradients[index % cardGradients.length]
                  )}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12" />

                    {/* Content */}
                    <div className="relative p-6 flex flex-col h-full min-h-[280px]">
                      {/* Top: Icon & Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{lessonIcons[index % lessonIcons.length]}</span>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
                          Free
                        </span>
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                          {lesson.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {lessonDescriptions[lesson.title] || 'Learn the fundamentals of football!'}
                        </p>
                      </div>

                      {/* Bottom: Play Button */}
                      <div className="mt-6">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-gray-900 fill-gray-900 ml-0.5" />
                          </div>
                          <span className="text-white font-semibold">Watch Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Premium Videos Section */}
        {premiumLessons.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className={cn("text-xl font-bold", colors.text)}>
                  Premium Lessons
                </h2>
                <p className={cn("text-sm", colors.textSecondary)}>
                  {premiumLessons.length} advanced videos for Pro members
                </p>
              </div>
            </div>

            <div className={cn("rounded-2xl border p-1", colors.card, colors.cardBorder)}>
              {premiumLessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${lesson.courseSlug}/lessons/${lesson.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer",
                      "hover:bg-orange-500/5",
                      index !== premiumLessons.length - 1 && "border-b border-border"
                    )}
                  >
                    {/* Number */}
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500">
                      {index + 4}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-medium group-hover:text-orange-500 transition-colors", colors.text)}>
                        {lesson.title}
                      </h3>
                      <p className={cn("text-sm mt-0.5 line-clamp-1", colors.textSecondary)}>
                        {lessonDescriptions[lesson.title] || 'Advanced football concepts'}
                      </p>
                    </div>

                    {/* Premium Badge */}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-500 border border-orange-500/30">
                      PRO
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Upgrade CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-center relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10" />

              <div className="relative">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Unlock All {premiumLessons.length} Premium Lessons
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Get full access to advanced techniques, pro strategies, and exclusive content
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                >
                  <Zap className="w-5 h-5" />
                  Upgrade to Pro
                </Link>
              </div>
            </motion.div>
          </motion.section>
        )}
>>>>>>> origin/main

      </main>
    </div>
  )
}
