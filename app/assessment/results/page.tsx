'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowRight, Target, Zap } from 'lucide-react'

const LEVEL_INFO = {
  beginner: {
    title: "Beginner",
    icon: Zap,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500",
    description: "Perfect! You're at the beginning of your football journey. We'll start with the fundamentals to build a strong foundation.",
    courses: [
      { title: "How Downs Work", slug: "how-downs-work", difficulty: "beginner" },
      { title: "Scoring Touchdowns", slug: "scoring-touchdowns", difficulty: "beginner" },
      { title: "Field Layout Basics", slug: "field-layout-basics", difficulty: "beginner" }
    ]
  },
  intermediate: {
    title: "Intermediate",
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500",
    description: "Great! You have some football knowledge. We'll help you deepen your understanding and develop more advanced skills.",
    courses: [
      { title: "Offensive Positions", slug: "offensive-positions", difficulty: "intermediate" },
      { title: "Defensive Positions", slug: "defensive-positions", difficulty: "intermediate" },
      { title: "Quarterback 101", slug: "quarterback-101", difficulty: "intermediate" }
    ]
  },
  advanced: {
    title: "Advanced",
    icon: Trophy,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500",
    description: "Excellent! You're ready for advanced training. We'll focus on mastering professional techniques and strategies.",
    courses: [
      { title: "Special Teams Basics", slug: "special-teams-basics", difficulty: "intermediate" },
      { title: "Understanding Penalties", slug: "understanding-penalties", difficulty: "intermediate" },
      { title: "Timeouts and Clock Management", slug: "timeouts-and-clock", difficulty: "intermediate" }
    ]
  }
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const { colors } = useTheme()
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [score, setScore] = useState(0)

  useEffect(() => {
    const levelParam = searchParams.get('level') as 'beginner' | 'intermediate' | 'advanced'
    const scoreParam = parseInt(searchParams.get('score') || '0')

    if (levelParam) setLevel(levelParam)
    if (scoreParam) setScore(scoreParam)
  }, [searchParams])

  const levelInfo = LEVEL_INFO[level]
  const Icon = levelInfo.icon

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="courses" />

      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-12">
            <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full mb-6", levelInfo.bgColor)}>
              <Icon className={cn("h-10 w-10", levelInfo.color)} />
            </div>
            <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
              You're at the {levelInfo.title} Level!
            </h1>
            <p className={cn("text-xl max-w-2xl mx-auto", colors.textMuted)}>
              {levelInfo.description}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex justify-center mb-12">
            <Badge className={cn("px-6 py-3 text-lg", levelInfo.bgColor, levelInfo.borderColor, levelInfo.color, "border-2")}>
              Assessment Score: {score}/24
            </Badge>
          </div>

          {/* Recommended Courses */}
          <div className="mb-12">
            <h2 className={cn("text-3xl font-bold mb-6", colors.text)}>
              Recommended Courses for You
            </h2>
            <p className={cn("text-lg mb-8", colors.textMuted)}>
              Start with these courses tailored to your skill level:
            </p>

            <div className="grid md:grid-cols-1 gap-4">
              {levelInfo.courses.map((course, index) => (
                <Link key={course.slug} href={`/courses/${course.slug}`}>
                  <Card className={cn(
                    "group hover:border-orange-500/50 transition-all cursor-pointer",
                    colors.bgSecondary,
                    colors.cardBorder
                  )}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                            levelInfo.bgColor,
                            levelInfo.color
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className={cn("text-xl group-hover:text-orange-400 transition-colors", colors.text)}>
                              {course.title}
                            </CardTitle>
                            <CardDescription className={colors.textMuted}>
                              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)} Level
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className={cn("h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity", levelInfo.color)} />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className={cn("rounded-xl p-8 text-center", levelInfo.bgColor, "border-2", levelInfo.borderColor)}>
            <h3 className={cn("text-2xl font-bold mb-4", colors.text)}>
              Ready to Start Your Journey?
            </h3>
            <p className={cn("text-lg mb-6", colors.textMuted)}>
              Browse all courses or jump right into your recommended path
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href={`/courses/${levelInfo.courses[0].slug}`}>
                  Start First Course
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/courses">
                  Browse All Courses
                </Link>
              </Button>
            </div>
          </div>

          {/* Retake Assessment */}
          <div className="mt-8 text-center">
            <Button asChild variant="ghost" className={colors.textMuted}>
              <Link href="/assessment">
                ← Retake Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
