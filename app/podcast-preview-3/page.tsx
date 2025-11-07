import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Headphones, Play } from 'lucide-react'
import { Header } from '@/components/layout/header'

export const metadata = {
  title: 'Kickoff Club Podcast | Learn Football Through Real Conversations',
  description: 'Learn football fundamentals through real conversations between beginners and experienced fans. No jargon, no confusion - just honest questions and clear explanations.',
}

// [Same podcast episodes data as before - truncated for brevity]
const podcastEpisodes = [
  {
    id: 1,
    slug: 'four-downs',
    title: 'The 4 Downs Thing Everyone Talks About',
    description: 'Why 4 downs for 10 yards is the strategy engine of football. A dad teaches his 7-year-old daughter the most important concept in football while watching a live game together.',
    guest: 'Dad & Daughter (7)',
    duration: '25:30',
    date: '2025-01-15',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-01-four-downs.m4a',
    featured: true,
  },
  // ... other episodes
]

const categories = ['All Episodes', 'Fundamentals', 'Strategy', 'Rules']

export default function PodcastPage() {
  const featuredEpisode = podcastEpisodes.find(ep => ep.featured)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Header */}
      <Header activePage="podcast" />

      {/* Hero Section - Option 3: Minimalist Dark (no color gradient) */}
      <section className="border-b border-white/10 text-white py-20 bg-[#0A0A0A]">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-6">
              <Headphones className="h-5 w-5 text-white/60" />
              <span className="font-semibold text-white/80">Kickoff Club Podcast</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Learn Football Through Real Conversations
            </h1>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Real people learning football together - no jargon, just honest questions and clear answers
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Listen on Spotify
              </Button>
              <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-15v8l6-4-6-4z"/>
                </svg>
                Listen on Apple Podcasts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Episode */}
      {featuredEpisode && (
        <section className="py-12 bg-[#0A0A0A] border-b border-white/10">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <Badge className="mb-4 bg-white text-black border-0">Featured Episode</Badge>
              <Card className="border border-white/20 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-white/10 border-white/20 text-white">{featuredEpisode.category}</Badge>
                        <span className="text-sm text-white/60">Episode {featuredEpisode.id}</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">{featuredEpisode.title}</h2>
                      <p className="text-white/70 mb-4 leading-relaxed">{featuredEpisode.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredEpisode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredEpisode.duration}</span>
                        </div>
                      </div>
                      <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90">
                        <Play className="h-5 w-5" />
                        Listen Now
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-xl aspect-square flex items-center justify-center border border-white/10">
                      <Headphones className="h-32 w-32 text-white opacity-30" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Rest of the page would be similar but with white/minimalist accents instead of colors */}
    </div>
  )
}
