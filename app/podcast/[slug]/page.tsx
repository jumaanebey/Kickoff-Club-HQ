import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Headphones } from 'lucide-react'
import { ShareButtons } from '@/components/social/share-buttons'
import { ThemedHeader } from '@/components/layout/themed-header'
import { getPodcastBySlug } from '@/database/queries/courses'

// Revalidate every 6 hours - individual episodes rarely change
export const revalidate = 21600

interface PodcastEpisodePageProps {
  params: {
    slug: string
  }
}

export default async function PodcastEpisodePage({ params }: PodcastEpisodePageProps) {
  const episode = await getPodcastBySlug(params.slug)

  if (!episode) {
    notFound()
  }

  // Parse shownotes from JSONB if it exists
  const shownotes = episode.shownotes?.topics || episode.shownotes?.timestamps || []

  return (
    <div className="min-h-screen bg-background">
      <ThemedHeader activePage="podcast" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/podcast"
          className="inline-flex items-center text-orange-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Episodes
        </Link>

        {/* Episode Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {episode.category && (
              <Badge className="text-white border bg-secondary">{episode.category}</Badge>
            )}
            <span className="text-sm text-muted-foreground">Episode {episode.episode_number}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{episode.title}</h1>
          <p className="text-xl mb-4 text-muted-foreground">{episode.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-6 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(episode.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <ShareButtons
            url={`https://kickoffclubhq.com/podcast/${params.slug}`}
            title={episode.title}
            description={episode.description}
          />
        </div>

        {/* Audio Player */}
        <Card className="mb-8 bg-gradient-to-r from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Headphones className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <div className="text-sm mb-1 text-muted-foreground">Now Playing</div>
                  <div className="font-semibold">Episode {episode.episode_number}: {episode.title.split('with')[0].trim()}</div>
                </div>

                {/* Audio Element */}
                <audio
                  controls
                  className="w-full"
                >
                  <source src={episode.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show Notes */}
        {shownotes.length > 0 && (
          <Card className="mb-8 backdrop-blur-xl border bg-card">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Show Notes</h2>
              <ul className="space-y-2">
                {shownotes.map((note: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span className="text-muted-foreground">{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Transcript */}
        {episode.transcript && (
          <Card className="mb-8 backdrop-blur-xl border bg-card">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Episode Transcript</h2>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {episode.transcript}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscribe CTA */}
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30">
          <CardContent className="p-8 text-center">
            <Headphones className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <h3 className="text-2xl font-bold mb-3">Subscribe to the Podcast</h3>
            <p className="mb-6 text-muted-foreground">
              Get notified when we release new episodes with expert coaches and training insights.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" className="bg-[#1DB954] hover:bg-[#1ed760] text-white border-0">
                Listen on Spotify
              </Button>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                Listen on Apple Podcasts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
