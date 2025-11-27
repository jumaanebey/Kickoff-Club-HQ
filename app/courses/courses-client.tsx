'use client'

import { Course } from '@/types/database.types'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
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

interface CoursesClientProps {
  courses: Course[]
  enrollments?: any[]
}

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

export default function CoursesClient({ courses, enrollments = [] }: CoursesClientProps) {
  const { colors } = useTheme()

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

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", colors.bg)}>
      <ThemedHeader activePage="courses" />

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

      </main>
    </div>
  )
}
