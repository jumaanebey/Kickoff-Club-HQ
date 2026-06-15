'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, Trophy, Target, Users, Star, Clock } from 'lucide-react'

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
  {
    id: 'two-minute-drill',
    title: 'Two-Minute Drill',
    subtitle: 'Beat The Clock',
    description: 'Two minutes on the clock. Read each situation, call the smart play, manage the clock, and score before time runs out.',
    badge: 'NEW',
    badgeColor: 'bg-green-500',
    icon: Clock,
    iconColor: 'text-cyan-400',
    bgGradient: 'from-cyan-900 to-blue-900',
    features: ['Real clock management', 'Combo multipliers', 'Drive & score'],
    href: '/games/two-minute-drill',
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    subtitle: '3D QB Read & React',
    description: 'Read the routes pre-snap, hike, and lead the open receiver downfield. Move the chains, beat the coverage, and learn real football in a full 3D stadium.',
    badge: 'NEW',
    badgeColor: 'bg-green-500',
    icon: Target,
    iconColor: 'text-amber-400',
    bgGradient: 'from-amber-900 to-yellow-900',
    features: ['Read routes & coverage', 'Move the chains', 'Spiral physics in 3D'],
    href: '/games/hail-mary',
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
      <section className="pt-24 sm:pt-32 md:pt-[140px] pb-10 sm:pb-12 md:pb-16 bg-gradient-to-b from-slate-900 to-slate-800 text-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-wider rounded-full mb-4 sm:mb-5">
            Interactive Learning
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-3 sm:mb-4 text-white">
            Football <span className="text-orange-400">Games</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl mx-auto">
            Learn football while having fun. Play games that teach real concepts, test your knowledge, and compete with friends.
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-10 sm:py-12 md:py-16 -mt-4 sm:-mt-6 md:-mt-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {games.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${game.bgGradient} p-5 sm:p-6 md:p-8 h-full border border-white/10 transition-all hover:scale-[1.02] hover:shadow-2xl`}>
                  {/* Badge */}
                  <span className={`absolute top-3 sm:top-4 right-3 sm:right-4 ${game.badgeColor} text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
                    {game.badge}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                    <game.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${game.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <h2 className="text-xl sm:text-2xl font-heading uppercase text-white mb-1">
                      {game.title}
                    </h2>
                    <p className={`text-xs sm:text-sm font-bold ${game.iconColor} uppercase tracking-wide mb-2 sm:mb-3`}>
                      {game.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-white/70">
                      {game.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
                    {game.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 text-white/80 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-white font-bold text-sm sm:text-base group-hover:gap-3 gap-2 transition-all">
                    Play Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Games Help Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading uppercase text-gray-900 mb-3 sm:mb-4">
              Why Play Football Games?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Games are one of the best ways to learn. Our games are designed to teach real football concepts in a fun, engaging way.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="font-heading text-base sm:text-lg uppercase text-gray-900 mb-2">Learn by Doing</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Active learning through gameplay helps concepts stick better than passive watching.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <h3 className="font-heading text-base sm:text-lg uppercase text-gray-900 mb-2">Instant Feedback</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Know immediately if you made the right call. Learn from mistakes in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="font-heading text-base sm:text-lg uppercase text-gray-900 mb-2">Track Progress</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Watch your scores improve as your football knowledge grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-3xl">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-wider rounded-full mb-3 sm:mb-4">
              This Week
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading uppercase text-white">
              Top Players
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="font-heading text-lg sm:text-xl text-amber-400 w-8 sm:w-10">
                  {player.rank}
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white/10 rounded-full flex items-center justify-center text-lg sm:text-xl">
                  {player.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm sm:text-base truncate">{player.name}</div>
                  <div className="text-xs sm:text-sm text-white/50 truncate">{player.game}</div>
                </div>
                <div className="font-heading text-sm sm:text-lg text-amber-400 text-right">
                  {player.score}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-white/40 text-xs sm:text-sm">
              Play any game to appear on the leaderboard!
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-3xl text-center">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎮</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading uppercase text-gray-900 mb-3 sm:mb-4">
            More Games Coming Soon
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            We're working on new games including Play Caller Challenge, Route Tree Master, and Fantasy Draft Simulator.
            Join the club to be notified when they launch!
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Play Caller Challenge
            </span>
            <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Route Tree Master
            </span>
            <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              Fantasy Draft Sim
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
