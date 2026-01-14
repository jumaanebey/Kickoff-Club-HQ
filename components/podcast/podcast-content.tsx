'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { usePlayer } from '@/components/providers/player-provider'

// Get local podcast cover image based on episode number
function getEpisodeCoverUrl(episode: { episode_number?: number; cover_image_url?: string }): string {
  if (episode.episode_number && episode.episode_number >= 1 && episode.episode_number <= 10) {
    const paddedNum = String(episode.episode_number).padStart(2, '0')
    return `/images/podcast-covers/episode-${paddedNum}.jpg`
  }
  return episode.cover_image_url || '/images/podcast-covers/episode-01.jpg'
}

interface PodcastContentProps {
  podcasts: any[]
  featuredEpisode: any
  recentEpisodes: any[]
}

export const PodcastContent = memo(function PodcastContent({ podcasts, featuredEpisode, recentEpisodes }: PodcastContentProps) {
  const { playTrack } = usePlayer()
  const podcastCount = useMemo(() => podcasts?.length || 0, [podcasts?.length])

  // Combine all episodes for display (Episode 1 first)
  const allEpisodes = useMemo(() => {
    const all = [...(featuredEpisode ? [featuredEpisode] : []), ...recentEpisodes]
    return all.sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0))
  }, [featuredEpisode, recentEpisodes])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Podcast Hero - Dark Background */}
      <section className="pt-[140px] pb-20 bg-gray-900">
        <div className="container mx-auto px-8 max-w-[1200px]">
          <div className="grid lg:grid-cols-[350px,1fr] gap-16 items-center">
            {/* Podcast Art */}
            <div className="aspect-square bg-white/5 border-2 border-amber-400 rounded-2xl flex flex-col items-center justify-center mx-auto lg:mx-0 max-w-[350px] w-full">
              <div className="text-7xl mb-3">🎙️</div>
              <div className="font-heading text-xl text-amber-400 uppercase tracking-wide">The Kickoff Show</div>
            </div>

            {/* Podcast Info */}
            <div className="text-center lg:text-left">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase text-white mb-4">
                The Kickoff Show
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                Weekly episodes breaking down plays, interviewing experts, and making football make sense. New episodes every Friday.
              </p>

              {/* Platform Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="https://podcasts.apple.com/us/podcast/kickoff-club-football-for-complete-beginners/id1851889207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/15 hover:border-amber-400 transition-all"
                >
                  🎧 Apple Podcasts
                </Link>
                <Link
                  href="https://open.spotify.com/show/YOUR_SPOTIFY_SHOW_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/15 hover:border-amber-400 transition-all"
                >
                  🟢 Spotify
                </Link>
                <Link
                  href="https://www.youtube.com/@kickoffclubhq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/15 hover:border-amber-400 transition-all"
                >
                  ▶️ YouTube
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="py-16">
        <div className="container mx-auto px-8 max-w-[1000px]">
          <div className="mb-10">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
              Latest Episodes
            </span>
            <h2 className="text-3xl font-heading uppercase text-gray-900">All Episodes</h2>
          </div>

          <div className="space-y-4">
            {allEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-white border border-gray-200 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => {
                  playTrack({
                    id: episode.id,
                    title: episode.title,
                    artist: 'Kickoff Club Podcast',
                    src: episode.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    image: getEpisodeCoverUrl(episode)
                  })
                }}
              >
                <div className="grid grid-cols-[auto,1fr,auto] gap-6 items-center p-6">
                  {/* Play Button */}
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>

                  {/* Episode Info */}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">
                      Episode {episode.episode_number}
                    </div>
                    <h3 className="font-heading text-lg uppercase text-gray-900 mb-1 truncate">
                      {episode.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {episode.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-sm text-gray-400 mb-1">
                      {episode.publish_date ? new Date(episode.publish_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : ''}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {episode.duration_seconds ? `${Math.floor(episode.duration_seconds / 60)}:${String(episode.duration_seconds % 60).padStart(2, '0')}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {allEpisodes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎙️</div>
              <h2 className="text-2xl font-heading uppercase text-gray-900 mb-4">Episodes Coming Soon</h2>
              <p className="text-gray-500">
                We're preparing our first episodes. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
})
