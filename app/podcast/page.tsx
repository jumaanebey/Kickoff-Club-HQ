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

const categories = ['All Episodes', 'Fundamentals', 'Strategy', 'Rules']

export default function PodcastPage() {
  const featuredEpisode = podcastEpisodes.find(ep => ep.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-700 px-4 py-2 rounded-full mb-6">
              <Headphones className="h-5 w-5" />
              <span className="font-semibold">Kickoff Club Podcast</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn Football Through Real Conversations
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Real people learning football together - no jargon, just honest questions and clear answers
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Listen on Spotify
              </Button>
              <Button size="lg" className="gap-2 bg-purple-700 hover:bg-purple-900 text-white">
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
        <section className="py-12 bg-white border-b">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <Badge className="mb-4">Featured Episode</Badge>
              <Card className="border-2 border-purple-200">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{featuredEpisode.category}</Badge>
                        <span className="text-sm text-gray-600">Episode {featuredEpisode.id}</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-3">{featuredEpisode.title}</h2>
                      <p className="text-gray-600 mb-4">{featuredEpisode.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredEpisode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredEpisode.duration}</span>
                        </div>
                      </div>
                      <Button size="lg" className="gap-2">
                        <Play className="h-5 w-5" />
                        Listen Now
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl aspect-square flex items-center justify-center">
                      <Headphones className="h-32 w-32 text-white opacity-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-gray-100 py-6 sticky top-16 z-10">
        <div className="container px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === 'All Episodes' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-purple-600 hover:text-white transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-6">All Episodes</h2>
            {podcastEpisodes.map((episode) => (
              <Link key={episode.id} href={`/podcast/${episode.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">#{episode.id}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{episode.category}</Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                          {episode.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{episode.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{episode.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Headphones className="h-4 w-4" />
                            <span>{episode.guest}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Headphones className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Never Miss an Episode
            </h2>
            <p className="text-purple-100 mb-6">
              Subscribe to get notified when we release new episodes with expert coaches and training insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
              />
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
