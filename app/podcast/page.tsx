import { ThemedHeader } from '@/components/layout/themed-header'
import { getAllPodcasts } from '@/database/queries/courses'
import { PodcastContent } from '@/components/podcast/podcast-content'

export const dynamic = 'force-dynamic'

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
