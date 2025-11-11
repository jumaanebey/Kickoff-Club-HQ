import { MetadataRoute } from 'next'
import { createServerClient } from '@/database/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kickoffclubhq.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/podcast`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Podcast episodes
  const podcastEpisodes = [
    'four-downs',
    'fantasy-football',
    'game-clock',
    'penalties',
    'scoring',
    'touchdown-rules',
    'strategy-blueprint',
    'coaching-strategy',
    'super-bowl',
    'i-get-it-now',
  ]

  const podcastPages: MetadataRoute.Sitemap = podcastEpisodes.map((slug) => ({
    url: `${baseUrl}/podcast/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog posts
  const blogPosts = [
    'understanding-football-basics',
    'quarterback-fundamentals',
    'defensive-strategies-101',
    'speed-training-for-football',
    'route-running-techniques',
    'film-study-guide',
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Get all published courses
  try {
    const supabase = await createServerClient()
    const { data: courses } = await supabase
      .from('courses')
      .select('slug, updated_at')
      .eq('is_published', true)

    const coursePages: MetadataRoute.Sitemap = (courses || []).map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(course.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...podcastPages, ...blogPages, ...coursePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
