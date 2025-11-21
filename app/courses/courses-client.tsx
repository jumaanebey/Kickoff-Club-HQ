'use client'

import { useState, useMemo } from 'react'
import { Course } from '@/types/database.types'
import { ThemedHeader } from '@/components/layout/themed-header'
import { CourseCard } from '@/components/courses/course-card'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { SeasonMode } from '@/components/gamification/season-mode'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Sparkles, Trophy, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CoursesClientProps {
  courses: Course[]
  enrollments?: any[]
}

export default function CoursesClient({ courses, enrollments = [] }: CoursesClientProps) {
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  // Calculate overall season progress
  const seasonProgress = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return 0
    const totalProgress = enrollments.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0)
    return Math.min(100, Math.round(totalProgress / enrollments.length))
  }, [enrollments])

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesDifficulty = selectedDifficulty ? course.difficulty_level === selectedDifficulty : true
      return matchesSearch && matchesDifficulty
    })
  }, [courses, searchQuery, selectedDifficulty])

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

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", colors.bg)}>
      <ThemedHeader activePage="courses" />

      <main className="container mx-auto px-4 py-8 md:py-12">

        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10" />

          <div className="grid lg:grid-cols-[1fr,350px] gap-12 items-center">
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
                <h1 className={cn("text-5xl md:text-6xl font-black mb-6 tracking-tight", colors.text)}>
                  Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Grounds</span>
                </h1>
                <p className={cn("text-xl md:text-2xl max-w-2xl leading-relaxed mb-8", colors.textSecondary)}>
                  Master every aspect of football with our pro-level curriculum.
                  From fundamental drills to advanced tactical analysis.
                </p>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search courses..."
                      className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm border-2 focus-visible:ring-orange-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <Button
                        key={level}
                        variant={selectedDifficulty === level ? "default" : "outline"}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                        className={cn(
                          "capitalize h-12 px-6 border-2",
                          selectedDifficulty === level
                            ? "bg-orange-600 hover:bg-orange-700 border-orange-600 text-white"
                            : "hover:border-orange-500 hover:text-orange-500"
                        )}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats / Progress Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={cn("hidden lg:block p-6 rounded-2xl border backdrop-blur-md shadow-2xl", colors.card, colors.cardBorder)}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Season Progress
                </h3>
                <span className="text-2xl font-black text-orange-500">{seasonProgress}%</span>
              </div>
              <SeasonMode progress={seasonProgress} />
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-black text-foreground">{enrollments.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Enrolled</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-foreground">{courses.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Courses</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Course (only show if no search/filter active) */}
        {!searchQuery && !selectedDifficulty && featuredCourse && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-orange-500 rounded-full" />
              <h2 className="text-2xl font-bold uppercase tracking-wide">Featured Course</h2>
            </div>
            <div className="relative group rounded-3xl overflow-hidden border-2 border-border bg-card">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={featuredCourse.thumbnail_url || '/images/course-placeholder.jpg'}
                    alt={featuredCourse.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge className="bg-orange-500 text-white border-0 mb-2">FEATURED</Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className="uppercase">{featuredCourse.difficulty_level}</Badge>
                    <span>•</span>
                    <span>{featuredCourse.duration_minutes} min</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 group-hover:text-orange-500 transition-colors">
                    {featuredCourse.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 line-clamp-3">
                    {featuredCourse.description}
                  </p>
                  <Button size="lg" className="w-full md:w-auto bg-foreground text-background hover:bg-orange-600 hover:text-white transition-colors">
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
                {searchQuery ? 'Search Results' : selectedDifficulty ? `${selectedDifficulty} Courses` : 'All Courses'}
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
                {filteredCourses.map((course) => (
                  <motion.div key={course.id} variants={itemVariants} layout>
                    <CourseCard course={course} />
                  </motion.div>
                ))}
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
                We couldn't find any courses matching your criteria. Try adjusting your filters or search query.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedDifficulty(null)
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </section>

      </main>
    </div>
  )
}
