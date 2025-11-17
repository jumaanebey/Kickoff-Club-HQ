import type { Course } from '@/types/database.types'

interface CourseStructuredDataProps {
  course: Course
  rating?: {
    averageRating: number
    totalReviews: number
  }
}

export function CourseStructuredData({ course, rating }: CourseStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || `Learn ${course.title.toLowerCase()} with step-by-step video lessons.`,
    provider: {
      '@type': 'Organization',
      name: 'Kickoff Club HQ',
      url: 'https://kickoffclubhq.com',
    },
    url: `https://kickoffclubhq.com/courses/${course.slug}`,
    ...(course.thumbnail_url && {
      image: course.thumbnail_url,
    }),
    ...(rating && rating.totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.averageRating.toFixed(1),
        reviewCount: rating.totalReviews,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    educationalLevel: course.difficulty_level || 'Beginner',
    inLanguage: 'en-US',
    isAccessibleForFree: course.tier_required === 'free',
    ...(course.tier_required !== 'free' && {
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT2H', // Approximate 2 hour workload
      },
    }),
    // Add offers for paid courses
    ...(course.tier_required !== 'free' && {
      offers: {
        '@type': 'Offer',
        category: 'Subscription',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
