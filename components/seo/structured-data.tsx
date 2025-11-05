import Script from 'next/script'

interface CourseStructuredDataProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail_url: string | null
    slug: string
    duration_minutes: number
    instructor_name: string | null
    tier_required: string
  }
  rating?: {
    average: number
    count: number
  }
}

export function CourseStructuredData({ course, rating }: CourseStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Kickoff Club HQ',
      sameAs: 'https://kickoffclubhq.com'
    },
    image: course.thumbnail_url || 'https://kickoffclubhq.com/og-image.png',
    url: `https://kickoffclubhq.com/courses/${course.slug}`,
    timeRequired: `PT${course.duration_minutes}M`,
    ...(course.instructor_name && {
      instructor: {
        '@type': 'Person',
        name: course.instructor_name
      }
    }),
    ...(rating && rating.count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.average,
        ratingCount: rating.count,
        bestRating: 5,
        worstRating: 1
      }
    }),
    offers: {
      '@type': 'Offer',
      category: 'Educational',
      price: course.tier_required === 'free' ? '0' : course.tier_required === 'basic' ? '19' : '49',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  }

  return (
    <Script
      id="course-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kickoff Club HQ',
    url: 'https://kickoffclubhq.com',
    logo: 'https://kickoffclubhq.com/logo.png',
    description: 'Professional football training made accessible. Learn from expert coaches through comprehensive video courses.',
    sameAs: [
      'https://twitter.com/kickoffclubhq',
      'https://facebook.com/kickoffclubhq',
      'https://instagram.com/kickoffclubhq'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@kickoffclubhq.com'
    }
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kickoff Club HQ',
    url: 'https://kickoffclubhq.com',
    description: 'Master football with expert coaches. 50+ courses, 10k+ students.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kickoffclubhq.com/courses?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
