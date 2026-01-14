import { ThemedHeader } from '@/components/layout/themed-header'
import { getAllPodcasts } from '@/database/queries/courses'
import { PodcastContent } from '@/components/podcast/podcast-content'
import { isSupabaseConfigured } from '@/database/supabase'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh data

// Mock podcast data for demo mode
const mockPodcasts = [
  {
    id: '1',
    title: 'What Is Football, Anyway?',
    slug: 'what-is-football',
    description: 'We kick things off by answering the most basic question - what even is this sport?',
    episode_number: 1,
    audio_url: '',
    publish_date: '2024-01-01',
    cover_image_url: '',
    duration_seconds: 1800,
  },
  {
    id: '2',
    title: 'Downs Demystified',
    slug: 'downs-demystified',
    description: 'The downs system finally explained in a way that makes sense.',
    episode_number: 2,
    audio_url: '',
    publish_date: '2024-01-08',
    cover_image_url: '',
    duration_seconds: 2100,
  },
  {
    id: '3',
    title: 'Meet the Players',
    slug: 'meet-the-players',
    description: 'All 22 positions explained - who does what and why it matters.',
    episode_number: 3,
    audio_url: '',
    publish_date: '2024-01-15',
    cover_image_url: '',
    duration_seconds: 2400,
  },
]

export default async function PodcastPage() {
  let podcasts = mockPodcasts

  // Only fetch from database if Supabase is configured
  if (isSupabaseConfigured()) {
    const dbPodcasts = await getAllPodcasts()
    if (dbPodcasts && dbPodcasts.length > 0) {
      podcasts = dbPodcasts
    }
  }

  const featuredEpisode = podcasts?.find(ep => ep.episode_number === 1)
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
