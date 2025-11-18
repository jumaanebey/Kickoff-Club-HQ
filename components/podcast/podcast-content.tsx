'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Headphones, Play, TrendingUp } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface PodcastContentProps {
  podcasts: any[]
  featuredEpisode: any
  recentEpisodes: any[]
}

export const PodcastContent = memo(function PodcastContent({ podcasts, featuredEpisode, recentEpisodes }: PodcastContentProps) {
  const { colors } = useTheme()

  // Memoize podcast count to prevent recalculation
  const podcastCount = useMemo(() => podcasts?.length || 0, [podcasts?.length])

  return (
    <div className="container px-4 py-12 flex-1 overflow-hidden">
      <div className="grid lg:grid-cols-[1fr,380px] gap-12 h-full">
        {/* Main Content - Scrollable */}
        <div className="overflow-y-auto pr-4 -mr-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Page Title */}
          <div className="mb-12">
            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border", colors.bgSecondary, colors.cardBorder)}>
              <Headphones className="h-4 w-4 text-orange-400" />
              <span className={cn("text-sm", colors.textMuted)}>Podcast</span>
            </div>
            <h1 className={cn("text-5xl md:text-6xl font-black mb-4 tracking-tight", colors.text)}>
              Kickoff Club Podcast
            </h1>
            <p className={cn("text-xl leading-relaxed", colors.textMuted)}>
              Real conversations that make football click. No jargon, just clarity.
            </p>
          </div>

          {/* Featured Episode - Large */}
          {featuredEpisode && (
            <div className="mb-12">
              <Link href={`/podcast/${featuredEpisode.slug}`}>
                <Card className={cn("backdrop-blur-xl border hover:border-orange-500/50 transition-all overflow-hidden group", colors.card, colors.cardBorder)}>
                  <div className="grid md:grid-cols-[300px,1fr] gap-0">
                    <div className="aspect-square relative bg-black">
                      {featuredEpisode.cover_image_url ? (
                        <Image
                          src={featuredEpisode.cover_image_url}
                          alt={featuredEpisode.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-7xl font-black text-white opacity-20 mb-2">#{featuredEpisode.episode_number}</div>
                            <Play className="h-16 w-16 text-white opacity-40 mx-auto" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-orange-500 border-0 text-white">Featured</Badge>
                        {featuredEpisode.category && (
                          <Badge className="bg-green-500 border-0 text-white">{featuredEpisode.category}</Badge>
                        )}
                      </div>
                      <h2 className={cn("text-3xl font-bold mb-3 group-hover:text-orange-400 transition-colors", colors.text)}>
                        {featuredEpisode.title}
                      </h2>
                      <p className={cn("mb-4 leading-relaxed", colors.textMuted)}>
                        {featuredEpisode.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* All Episodes List */}
          <div>
            <h2 className={cn("text-2xl font-bold mb-6 flex items-center gap-2", colors.text)}>
              <TrendingUp className="h-6 w-6 text-orange-400" />
              All Episodes
            </h2>
            <div className="space-y-4">
              {recentEpisodes.map((episode) => (
                <Link key={episode.id} href={`/podcast/${episode.slug}`}>
                  <Card className={cn("backdrop-blur-xl border transition-all hover:opacity-80", colors.card, colors.cardBorder, colors.cardHover)}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-black">
                            {episode.cover_image_url ? (
                              <Image
                                src={episode.cover_image_url}
                                alt={episode.title}
                                width={80}
                                height={80}
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">#{episode.episode_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {episode.category && (
                              <Badge className="bg-green-500 border-0 text-white text-xs">{episode.category}</Badge>
                            )}
                            <span className={cn("text-xs", colors.textMuted)}>
                              {new Date(episode.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h3 className={cn("text-lg font-bold mb-2 hover:text-orange-400 transition-colors line-clamp-1", colors.text)}>
                            {episode.title}
                          </h3>
                          <p className={cn("text-sm mb-3 line-clamp-2", colors.textMuted)}>{episode.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:opacity-70">
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Scrollable */}
        <div className="overflow-y-auto pl-4 -ml-4 space-y-8" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Subscribe Card */}
          <Card className={cn("bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30 p-6", colors.cardBorder)}>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className={cn("text-xl font-bold mb-2", colors.text)}>Never Miss an Episode</h3>
              <p className={cn("text-sm mb-4", colors.textMuted)}>
                Get notified about new episodes
              </p>
              <input
                type="email"
                placeholder="Your email"
                className={cn("w-full px-4 py-2 rounded-lg backdrop-blur-xl border text-sm mb-3", colors.input, colors.inputBorder, colors.inputText, colors.inputPlaceholder)}
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Subscribe
              </Button>
            </div>
          </Card>

          {/* Listen On */}
          <Card className={cn("backdrop-blur-xl border p-6", colors.card, colors.cardBorder)}>
            <h3 className={cn("text-lg font-bold mb-4", colors.text)}>Listen On</h3>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white border-0">
                <Link href="https://open.spotify.com/show/YOUR_SPOTIFY_SHOW_ID" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0">
                <Link href="https://podcasts.apple.com/us/podcast/kickoff-club-football-for-complete-beginners/id1851889207" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-15v8l6-4-6-4z"/>
                  </svg>
                  Apple Podcasts
                </Link>
              </Button>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className={cn("backdrop-blur-xl border p-6", colors.card, colors.cardBorder)}>
            <h3 className={cn("text-lg font-bold mb-4", colors.text)}>Podcast Stats</h3>
            <div className="space-y-4">
              <div>
                <div className={cn("text-3xl font-black mb-1", colors.text)}>{podcastCount}</div>
                <div className={cn("text-sm", colors.textMuted)}>Total Episodes</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
})
