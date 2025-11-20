import { ThemedHeader } from '@/components/layout/themed-header'
import { getAllPodcasts } from '@/database/queries/courses'
import { PodcastContent } from '@/components/podcast/podcast-content'

// Force dynamic rendering to avoid build-time errors
// Force dynamic rendering to avoid build-time errors
// export const dynamic = 'force-dynamic'
// Revalidate every hour - podcast episodes don't change frequently
export const revalidate = 3600

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
