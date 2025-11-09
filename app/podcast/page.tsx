'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Headphones, Play, TrendingUp } from 'lucide-react'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

// Kickoff Club Podcast episodes - teaching football to beginners through conversations
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
  {
    id: 2,
    slug: 'fantasy-football',
    title: 'Can We Talk About Fantasy Football?',
    description: 'Strategy, scarcity, and psychology of fantasy football. Two roommates discuss what makes fantasy football so addictive and how it actually helps you understand the real game better.',
    guest: 'Roommates (M+F)',
    duration: '27:15',
    date: '2025-01-13',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-02-fantasy-football.m4a',
    featured: false,
  },
  {
    id: 3,
    slug: 'game-clock',
    title: "What's the Deal With the Clock?",
    description: 'How NFL teams weaponize the game clock. A wife explains to her husband why mastering clock management separates good teams from championship teams.',
    guest: 'Wife & Husband',
    duration: '31:20',
    date: '2025-01-12',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-03-game-clock.m4a',
    featured: false,
  },
  {
    id: 4,
    slug: 'penalties',
    title: 'Wait, That\'s Illegal?!',
    description: 'Football penalties explained with consequences. An older brother teaches his sister why those yellow flags matter and how penalties can completely change a game.',
    guest: 'Brother & Sister (20s)',
    duration: '37:10',
    date: '2025-01-10',
    category: 'Rules',
    audioUrl: '/podcasts/episode-04-penalties.m4a',
    featured: false,
  },
  {
    id: 5,
    slug: 'scoring',
    title: 'How Does Scoring Even Work?',
    description: 'The 4 pillars of football scoring demystified. Best friends break down touchdowns, field goals, extra points, and safeties while watching Sunday football.',
    guest: 'Best Friends (F+F)',
    duration: '33:45',
    date: '2025-01-08',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-05-scoring.m4a',
    featured: false,
  },
  {
    id: 6,
    slug: 'touchdown-rules',
    title: 'Touchdown Is Six Points... But Why?',
    description: 'Hidden rules that make touchdowns worth 6 points. A boyfriend explains to his girlfriend the surprisingly complex rules around what actually counts as a touchdown.',
    guest: 'Boyfriend & Girlfriend',
    duration: '29:50',
    date: '2025-01-06',
    category: 'Rules',
    audioUrl: '/podcasts/episode-06-touchdown-rules.m4a',
    featured: false,
  },
  {
    id: 7,
    slug: 'strategy-blueprint',
    title: 'The Strategy Blueprint No One Explains',
    description: 'Understanding offensive and defensive schemes. Coworkers discuss why football is actually a giant chess match disguised as a contact sport.',
    guest: 'Coworkers (M+M)',
    duration: '26:30',
    date: '2025-01-04',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-07-strategy-blueprint.m4a',
    featured: false,
  },
  {
    id: 8,
    slug: 'coaching-strategy',
    title: 'Why Is Everyone Yelling About the Coach?',
    description: 'Coaching decisions and their impact on games. A mom teaches her adult son how coaching strategy wins (and loses) championships.',
    guest: 'Mom & Adult Son',
    duration: '34:20',
    date: '2025-01-02',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-08-coaching-strategy.m4a',
    featured: false,
  },
  {
    id: 9,
    slug: 'super-bowl',
    title: 'Super Bowl... Make It Make Sense',
    description: 'How the NFL playoffs and Super Bowl actually work. A grandpa explains to his teenage grandson why the Super Bowl is called "the big game" and how teams actually get there.',
    guest: 'Grandpa & Grandson (teen)',
    duration: '32:10',
    date: '2024-12-30',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-09-super-bowl.m4a',
    featured: false,
  },
  {
    id: 10,
    slug: 'i-get-it-now',
    title: 'I Think I Actually Get It Now!',
    description: 'Putting it all together - from complete beginner to confident fan. The dad and daughter return to wrap up their football learning journey and celebrate how far they\'ve come.',
    guest: 'Dad & Daughter (7)',
    duration: '32:25',
    date: '2024-12-28',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-10-penalty-cost.m4a',
    featured: false,
  },
]

export default function PodcastPage() {
  const { colors } = useTheme()
  const featuredEpisode = podcastEpisodes.find(ep => ep.featured)
  const recentEpisodes = podcastEpisodes.filter(ep => !ep.featured)

  return (
    <div className={cn('min-h-screen flex flex-col', colors.bg)}>
      <ThemedHeader activePage="podcast" />

      {/* LAYOUT 3: Magazine/Editorial Style with Sidebar */}
      <div className="container px-4 py-12 flex-1 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr,380px] gap-12 h-full">
          {/* Main Content - Scrollable */}
          <div className="overflow-y-auto pr-4 -mr-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {/* Page Title */}
            <div className="mb-12">
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4", colors.bgSecondary, colors.cardBorder, "border")}>
                <Headphones className="h-4 w-4 text-orange-400" />
                <span className={cn("text-sm", colors.textSecondary)}>Podcast</span>
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
                  <Card className={cn("backdrop-blur-xl border hover:border-orange-500/50 transition-all overflow-hidden group", colors.bgSecondary, colors.cardBorder)}>
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
                          <Badge className="bg-green-500 border-0 text-white">{featuredEpisode.category}</Badge>
                        </div>
                        <h2 className={cn("text-3xl font-bold mb-3 group-hover:text-orange-400 transition-colors", colors.text)}>
                          {featuredEpisode.title}
                        </h2>
                        <p className={cn("mb-4 leading-relaxed", colors.textSecondary)}>
                          {featuredEpisode.description}
                        </p>
                        <div className={cn("flex items-center gap-4 text-sm", colors.textMuted)}>
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
              <h2 className={cn("text-2xl font-bold mb-6 flex items-center gap-2", colors.text)}>
                <TrendingUp className="h-6 w-6 text-orange-400" />
                Recent Episodes
              </h2>
              <div className="space-y-4">
                {recentEpisodes.map((episode) => (
                  <Link key={episode.id} href={`/podcast/${episode.slug}`}>
                    <Card className={cn("backdrop-blur-xl border transition-all", colors.bgSecondary, colors.cardBorder, "hover:opacity-80")}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">#{episode.id}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-500 border-0 text-white text-xs">{episode.category}</Badge>
                              <span className={cn("text-xs", colors.textMuted)}>
                                {new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <h3 className={cn("text-lg font-bold mb-2 hover:text-orange-400 transition-colors line-clamp-1", colors.text)}>
                              {episode.title}
                            </h3>
                            <p className={cn("text-sm mb-3 line-clamp-2", colors.textMuted)}>{episode.description}</p>
                            <div className={cn("flex items-center gap-3 text-xs", colors.textMuted)}>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{episode.duration}</span>
                              </div>
                              <span>•</span>
                              <span className="line-clamp-1">{episode.guest}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex items-center">
                            <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full", colors.text, "hover:opacity-70")}>
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
            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className={cn("text-xl font-bold mb-2", colors.text)}>Never Miss an Episode</h3>
                <p className={cn("text-sm mb-4", colors.textSecondary)}>
                  Get notified about new episodes
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className={cn("w-full px-4 py-2 rounded-lg backdrop-blur-xl border text-sm mb-3", colors.bgSecondary, colors.cardBorder, colors.inputText, "placeholder:opacity-50")}
                />
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Listen On */}
            <Card className={cn("backdrop-blur-xl border p-6", colors.bgSecondary, colors.cardBorder)}>
              <h3 className={cn("text-lg font-bold mb-4", colors.text)}>Listen On</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white border-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </Button>
                <Button className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-15v8l6-4-6-4z"/>
                  </svg>
                  Apple Podcasts
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className={cn("backdrop-blur-xl border p-6", colors.bgSecondary, colors.cardBorder)}>
              <h3 className={cn("text-lg font-bold mb-4", colors.text)}>Podcast Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className={cn("text-3xl font-black mb-1", colors.text)}>10</div>
                  <div className={cn("text-sm", colors.textMuted)}>Total Episodes</div>
                </div>
                <div className={cn("border-t pt-4", colors.cardBorder)}>
                  <div className={cn("text-3xl font-black mb-1", colors.text)}>2.5K</div>
                  <div className={cn("text-sm", colors.textMuted)}>Active Listeners</div>
                </div>
                <div className={cn("border-t pt-4", colors.cardBorder)}>
                  <div className="text-3xl font-black text-orange-400 mb-1">4.8</div>
                  <div className={cn("text-sm", colors.textMuted)}>Average Rating</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
