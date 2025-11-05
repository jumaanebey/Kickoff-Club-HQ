'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  enrolled_count: number
  instructors?: {
    name: string
    slug: string
  }
  course_categories?: {
    name: string
    slug: string
    icon: string
  }
}

interface RecommendationsWidgetProps {
  recommendations: Course[]
}

export function RecommendationsWidget({ recommendations }: RecommendationsWidgetProps) {
  const difficultyColors = {
    beginner: "bg-success-100 text-success-700",
    intermediate: "bg-warning-100 text-warning-700",
    advanced: "bg-destructive-100 text-destructive-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Recommended for You
        </CardTitle>
        <CardDescription>
          Courses we think you'll love based on your learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((course) => (
              <div
                key={course.id}
                className="flex gap-4 p-3 rounded-lg border hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🏈
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold line-clamp-1">{course.title}</h4>
                    <Badge
                      className={`flex-shrink-0 text-xs ${difficultyColors[course.difficulty_level]}`}
                    >
                      {course.difficulty_level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {course.instructors && (
                        <span>👨‍🏫 {course.instructors.name}</span>
                      )}
                      <span>⏱️ {course.duration_minutes}min</span>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/courses/${course.slug}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recommendations available yet</p>
            <p className="text-sm mt-1">Complete some courses to get personalized recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
