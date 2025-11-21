import { ThemedHeader } from '@/components/layout/themed-header'
import { getAllPodcasts } from '@/database/queries/courses'
import { PodcastContent } from '@/components/podcast/podcast-content'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh data

// Updated: 2025-11-21 - Podcast covers now showing

export default async function PodcastPage() {
  const podcasts = await getAllPodcasts()
  const featuredEpisode = podcasts?.find(ep => ep.episode_number === 1) // First episode is featured
  const recentEpisodes = podcasts
    ?.filter(ep => ep.episode_number !== 1)
    .sort((a, b) => a.episode_number - b.episode_number) || []

  return (
    <div className="min-h-screen flex flex-col">
      <ThemedHeader activePage="podcast" />
      <PodcastContent
        podcasts={podcasts || []}
        featuredEpisode={featuredEpisode}
        recentEpisodes={recentEpisodes}
      />
    </div>
  )
}
