import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Headphones, Play, TrendingUp } from 'lucide-react'
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

export default function PodcastPage() {
  const featuredEpisode = podcastEpisodes.find(ep => ep.featured)
  const recentEpisodes = podcastEpisodes.filter(ep => !ep.featured)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header activePage="podcast" />

      {/* LAYOUT 3: Magazine/Editorial Style with Sidebar */}
      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-[1fr,380px] gap-12">
          {/* Main Content */}
          <div>
            {/* Page Title */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-4">
                <Headphones className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-white/80">Podcast</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Kickoff Club Podcast
              </h1>
              <p className="text-xl text-white/60 leading-relaxed">
                Real conversations that make football click. No jargon, just clarity.
              </p>
            </div>

            {/* Featured Episode - Large */}
            {featuredEpisode && (
              <div className="mb-12">
                <Link href={`/podcast/${featuredEpisode.slug}`}>
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 transition-all overflow-hidden group">
                    <div className="grid md:grid-cols-[300px,1fr] gap-0">
                      <div className="aspect-square bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-7xl font-black text-white opacity-20 mb-2">#{featuredEpisode.id}</div>
                          <Play className="h-16 w-16 text-white opacity-40 mx-auto" />
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-orange-500 border-0 text-white">Featured</Badge>
                          <Badge className="bg-white/10 border-white/20 text-white">{featuredEpisode.category}</Badge>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                          {featuredEpisode.title}
                        </h2>
                        <p className="text-white/70 mb-4 leading-relaxed">
                          {featuredEpisode.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{featuredEpisode.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Headphones className="h-4 w-4" />
                            <span>{featuredEpisode.guest}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )}

            {/* Recent Episodes List */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-400" />
                Recent Episodes
              </h2>
              <div className="space-y-4">
                {recentEpisodes.map((episode) => (
                  <Link key={episode.id} href={`/podcast/${episode.slug}`}>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">#{episode.id}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-white/10 border-white/20 text-white text-xs">{episode.category}</Badge>
                              <span className="text-xs text-white/40">
                                {new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 hover:text-orange-400 transition-colors line-clamp-1">
                              {episode.title}
                            </h3>
                            <p className="text-sm text-white/60 mb-3 line-clamp-2">{episode.description}</p>
                            <div className="flex items-center gap-3 text-xs text-white/40">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{episode.duration}</span>
                              </div>
                              <span>•</span>
                              <span className="line-clamp-1">{episode.guest}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex items-center">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white hover:bg-white/10">
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

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Subscribe Card */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Never Miss an Episode</h3>
                <p className="text-white/70 text-sm mb-4">
                  Get notified about new episodes
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/50 text-sm mb-3"
                />
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Listen On */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Listen On</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 border-white/20 text-white hover:bg-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-white/20 text-white hover:bg-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-15v8l6-4-6-4z"/>
                  </svg>
                  Apple Podcasts
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Podcast Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-black text-white mb-1">10</div>
                  <div className="text-sm text-white/50">Total Episodes</div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-3xl font-black text-white mb-1">2.5K</div>
                  <div className="text-sm text-white/50">Active Listeners</div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-3xl font-black text-orange-400 mb-1">4.8</div>
                  <div className="text-sm text-white/50">Average Rating</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
