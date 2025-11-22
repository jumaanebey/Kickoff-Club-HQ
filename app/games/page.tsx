import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Play } from 'lucide-react'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata = {
  title: 'Football Games | Kickoff Club HQ',
  description: 'Play interactive football games - Blitz Rush endless runner and QB Precision throwing challenge.',
}

export default function GamesPage() {
  const games = [
    {
      id: 'blitz-rush',
      title: 'Blitz Rush',
      slug: 'blitz-rush',
      description: '3D endless runner - dodge obstacles, switch lanes, and score touchdowns!',
      icon: Trophy,
      difficulty: 'Medium',
      style: 'Temple Run / Subway Surfers style',
      features: [
        'Three-lane gameplay',
        'Jump and slide mechanics',
        'Progressive difficulty',
        'High score tracking'
      ]
    },
    {
      id: 'qb-precision',
      title: 'QB Precision',
      slug: 'qb-precision',
      description: 'Test your quarterback skills with Retro Bowl-style throwing mechanics!',
      icon: Target,
      difficulty: 'Easy',
      style: 'Retro Bowl inspired',
      features: [
        'Hold and drag to aim',
        'Parabolic ball physics',
        'Receiver route running',
        'Completion percentage tracking'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <ThemedHeader activePage="games" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Football Games
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Test your skills with our interactive football games. Master the fundamentals while having fun!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <Card key={game.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden group hover:border-orange-500 transition-all duration-300">
                {/* Header with Icon */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-12 w-12 text-white" />
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                      {game.difficulty}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{game.title}</h2>
                  <p className="text-orange-100 text-sm mt-1">{game.style}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-300 mb-6">{game.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Features
                    </h3>
                    <ul className="space-y-2">
                      {game.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Play Button */}
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all"
                  >
                    <Link href={`/games/${game.slug}`}>
                      <Play className="h-5 w-5 mr-2" />
                      Play Now
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-8 py-6">
            <h3 className="text-2xl font-bold text-white mb-2">More Games Coming Soon!</h3>
            <p className="text-gray-400">
              We're working on additional football games to help you master the sport.
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Game Tips</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-orange-500 mb-2">Desktop Players</h4>
                <ul className="space-y-1">
                  <li>• Use arrow keys or WASD for controls</li>
                  <li>• Full screen for best experience</li>
                  <li>• Press ESC to pause</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-500 mb-2">Mobile Players</h4>
                <ul className="space-y-1">
                  <li>• Swipe gestures for movement</li>
                  <li>• Tap and drag for throwing</li>
                  <li>• Portrait mode recommended</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
