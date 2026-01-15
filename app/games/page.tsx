'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, Trophy, Target, Users, Star } from 'lucide-react'

// Game data
const games = [
  {
    id: 'gridiron-iq',
    title: 'Gridiron IQ',
    subtitle: 'Think Like a Quarterback',
    description: 'Master NFL plays and concepts. Read defenses, call plays, and score touchdowns while learning real football strategy.',
    badge: 'NEW',
    badgeColor: 'bg-green-500',
    icon: Brain,
    iconColor: 'text-green-400',
    bgGradient: 'from-green-900 to-emerald-900',
    features: ['Learn real NFL plays', 'QB simulation', 'Coverage reads'],
    href: '/games/gridiron-iq',
  },
  {
    id: 'blitz-rush',
    title: 'Blitz Rush 3D',
    subtitle: 'Endless Runner',
    description: 'Dodge defenders, collect coins, and race down the field in this fast-paced endless runner with football flair.',
    badge: 'POPULAR',
    badgeColor: 'bg-orange-500',
    icon: Zap,
    iconColor: 'text-orange-400',
    bgGradient: 'from-orange-900 to-red-900',
    features: ['Endless running action', 'Power-ups & fever mode', 'Unlockable characters'],
    href: '/games/blitz-rush',
  },
]

// Leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Chris B.', game: 'Gridiron IQ', score: '156 QB Rating', avatar: '🏆' },
  { rank: 2, name: 'Sarah M.', game: 'Blitz Rush', score: '24,847', avatar: '🥈' },
  { rank: 3, name: 'Mike T.', game: 'Gridiron IQ', score: '142 QB Rating', avatar: '🥉' },
  { rank: 4, name: 'Lisa R.', game: 'Blitz Rush', score: '19,201', avatar: '😊' },
  { rank: 5, name: 'James K.', game: 'Gridiron IQ', score: '128 QB Rating', avatar: '😄' },
]

export default function GamesHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader activePage="games" />

      {/* Hero Section */}
      <section className="pt-[140px] pb-16 bg-gradient-to-b from-slate-900 to-slate-800 text-center">
        <div className="container mx-auto px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-5">
            Interactive Learning
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-4 text-white">
            Football <span className="text-orange-400">Games</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto">
            Learn football while having fun. Play games that teach real concepts, test your knowledge, and compete with friends.
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.bgGradient} p-8 h-full border border-white/10 transition-all hover:scale-[1.02] hover:shadow-2xl`}>
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 ${game.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {game.badge}
                  </span>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <game.icon className={`w-8 h-8 ${game.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-heading uppercase text-white mb-1">
                      {game.title}
                    </h2>
                    <p className={`text-sm font-bold ${game.iconColor} uppercase tracking-wide mb-3`}>
                      {game.subtitle}
                    </p>
                    <p className="text-white/70">
                      {game.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {game.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-white font-bold group-hover:gap-3 gap-2 transition-all">
                    Play Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Games Help Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 mb-4">
              Why Play Football Games?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Games are one of the best ways to learn. Our games are designed to teach real football concepts in a fun, engaging way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-heading text-lg uppercase text-gray-900 mb-2">Learn by Doing</h3>
              <p className="text-sm text-gray-600">
                Active learning through gameplay helps concepts stick better than passive watching.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-heading text-lg uppercase text-gray-900 mb-2">Instant Feedback</h3>
              <p className="text-sm text-gray-600">
                Know immediately if you made the right call. Learn from mistakes in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-heading text-lg uppercase text-gray-900 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Watch your scores improve as your football knowledge grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-8 max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
              This Week
            </span>
            <h2 className="text-3xl md:text-4xl font-heading uppercase text-white">
              Top Players
            </h2>
          </div>

          <div className="space-y-3">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="font-heading text-xl text-amber-400 w-10">
                  {player.rank}
                </div>
                <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-xl">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{player.name}</div>
                  <div className="text-sm text-white/50">{player.game}</div>
                </div>
                <div className="font-heading text-lg text-amber-400">
                  {player.score}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              Play any game to appear on the leaderboard!
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8 max-w-3xl text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 mb-4">
            More Games Coming Soon
          </h2>
          <p className="text-gray-600 mb-8">
            We're working on new games including Play Caller Challenge, Route Tree Master, and Fantasy Draft Simulator.
            Join the club to be notified when they launch!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full">
              Play Caller Challenge
            </span>
            <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full">
              Route Tree Master
            </span>
            <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full">
              Fantasy Draft Sim
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
