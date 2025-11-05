'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CertificateCardProps {
  enrollment: {
    id: string
    completed_at: string
    course: {
      id: string
      title: string
      slug: string
      instructor_name: string
      thumbnail_url: string | null
      category: string
      difficulty_level: string
    }
  }
}

export function CertificateCard({ enrollment }: CertificateCardProps) {
  const certificateId = `KCFC-${enrollment.id.split('-')[0].toUpperCase()}`

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {enrollment.course.thumbnail_url ? (
              <img
                src={enrollment.course.thumbnail_url}
                alt={enrollment.course.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-primary-100 rounded-lg flex items-center justify-center text-5xl">
                🏆
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-600">
                  Instructor: {enrollment.course.instructor_name}
                </p>
              </div>
              <Badge variant="default" className="bg-green-600">
                Completed
              </Badge>
            </div>

            {/* Certificate Details */}
            <div className="mb-4 space-y-1">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Certificate ID:</span> {certificateId}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Completed:</span>{' '}
                {new Date(enrollment.completed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Level:</span>{' '}
                {enrollment.course.difficulty_level.charAt(0).toUpperCase() +
                 enrollment.course.difficulty_level.slice(1)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/dashboard/certificates/${enrollment.course.id}`}>
                  View Certificate
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/courses/${enrollment.course.slug}`}>
                  View Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
