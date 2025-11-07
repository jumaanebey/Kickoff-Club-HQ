import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Headphones, Play } from 'lucide-react'
import { Header } from '@/components/layout/header'

export const metadata = {
  title: 'Kickoff Club Podcast | Learn Football Through Real Conversations',
  description: 'Learn football fundamentals through real conversations between beginners and experienced fans.',
}

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
    featured: true,
  },
  {
    id: 2,
    slug: 'fantasy-football',
    title: 'Can We Talk About Fantasy Football?',
    description: 'Strategy, scarcity, and psychology of fantasy football.',
    guest: 'Roommates (M+F)',
    duration: '27:15',
    date: '2025-01-13',
    category: 'Strategy',
    featured: false,
  },
  {
    id: 3,
    slug: 'game-clock',
    title: "What's the Deal With the Clock?",
    description: 'How NFL teams weaponize the game clock.',
    guest: 'Wife & Husband',
    duration: '31:20',
    date: '2025-01-12',
    category: 'Strategy',
    featured: false,
  },
  {
    id: 4,
    slug: 'penalties',
    title: 'Wait, That\'s Illegal?!',
    description: 'Football penalties explained with consequences.',
    guest: 'Brother & Sister (20s)',
    duration: '37:10',
    date: '2025-01-10',
    category: 'Rules',
    featured: false,
  },
]

const categories = ['All Episodes', 'Fundamentals', 'Strategy', 'Rules']

export default function PodcastPage() {
  const featuredEpisode = podcastEpisodes.find(ep => ep.featured)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header activePage="podcast" />

      {/* LAYOUT 2: Side-by-Side Hero with Large Featured */}
      <section className="py-20 bg-[#0A0A0A] border-b border-white/10">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Title & Description */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-6">
                <Headphones className="h-5 w-5 text-orange-400" />
                <span className="font-semibold text-white">Kickoff Club Podcast</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                Real Talk,<br />Real Football
              </h1>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Learn through honest conversations between beginners and experienced fans. No jargon, just clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                  <Play className="h-5 w-5" />
                  Listen Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Right: Featured Episode Card */}
            {featuredEpisode && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <Badge className="mb-4 bg-orange-500 border-0 text-white">Latest Episode</Badge>
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-6 flex items-center justify-center">
                  <Headphones className="h-24 w-24 text-white opacity-20" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-white/10 border-white/20 text-white text-xs">{featuredEpisode.category}</Badge>
                  <span className="text-sm text-white/50">Episode {featuredEpisode.id}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{featuredEpisode.title}</h3>
                <p className="text-white/60 mb-4 line-clamp-2">{featuredEpisode.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{featuredEpisode.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredEpisode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  <Play className="h-4 w-4" />
                  Listen Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid Layout for Episodes */}
      <section className="py-12 bg-[#0A0A0A]">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">All Episodes</h2>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  className={category === 'All Episodes' ? 'bg-orange-500 border-0 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer'}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastEpisodes.map((episode) => (
              <Link key={episode.id} href={`/podcast/${episode.slug}`}>
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all h-full">
                  <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">#{episode.id}</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/10 border-white/20 text-white text-xs">{episode.category}</Badge>
                    </div>
                    <CardTitle className="text-white text-lg line-clamp-2">{episode.title}</CardTitle>
                    <CardDescription className="text-white/60 line-clamp-2">{episode.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{episode.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Headphones className="h-3 w-3" />
                        <span className="line-clamp-1">{episode.guest}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t border-white/10">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Never Miss an Episode
            </h2>
            <p className="text-white/70 mb-6">
              Subscribe to get notified about new episodes
            </p>
            <div className="flex gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/50 max-w-md flex-1"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
