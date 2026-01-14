'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Game card data for the preview
const gameCards = [
  { emoji: '🏃', label: 'RB' },
  { emoji: '💪', label: 'LB' },
  { emoji: '🎯', label: 'QB' },
  { emoji: '🛡️', label: 'OL' },
  { emoji: '🏃‍♂️', label: 'WR' },
]

// Feature boxes
const features = [
  {
    icon: '🎴',
    title: 'Card Matching',
    description: 'Match positions to their roles and responsibilities on the field.',
  },
  {
    icon: '⚡',
    title: 'Quick Fire Mode',
    description: 'Race against the clock to identify plays and formations.',
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    description: 'Compete with other members and climb the weekly rankings.',
  },
]

// Leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Chris B.', streak: '15 day streak', score: '9,847', avatar: '🏆' },
  { rank: 2, name: 'Sarah M.', streak: '12 day streak', score: '8,932', avatar: '🥈' },
  { rank: 3, name: 'Mike T.', streak: '8 day streak', score: '7,654', avatar: '🥉' },
  { rank: 4, name: 'Lisa R.', streak: '10 day streak', score: '7,201', avatar: '😊' },
  { rank: 5, name: 'James K.', streak: '5 day streak', score: '6,890', avatar: '😄' },
]

export default function GamesHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader activePage="games" />

      {/* Game Hero */}
      <section className="pt-[140px] pb-20 bg-white border-b border-gray-200 text-center">
        <div className="container mx-auto px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-5">
            Interactive Learning
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-4 text-gray-900">
            Play <span className="text-orange-500">Blitz Rush</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-10">
            Test your football knowledge with our addictive card game. Learn formations, positions, and plays while having fun.
          </p>
          <Link
            href="/games/blitz-rush"
            className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-lg uppercase hover:bg-orange-600 transition-colors"
          >
            Play Now - It's Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          {/* Game Preview */}
          <div className="max-w-[700px] mx-auto mt-12 bg-gray-50 rounded-2xl border border-gray-200 p-8 md:p-12">
            <div className="flex justify-center gap-4 flex-wrap">
              {gameCards.map((card, index) => (
                <div
                  key={index}
                  className="w-[100px] h-[140px] bg-white rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-amber-100 hover:-translate-y-2 hover:border-orange-300 hover:shadow-lg"
                >
                  <span className="text-4xl mb-2">{card.emoji}</span>
                  <span className="text-xs font-bold text-gray-700 uppercase">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 max-w-[1000px]">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-heading text-lg uppercase text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-8 max-w-[1000px]">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-5">
              This Week
            </span>
            <h2 className="text-3xl md:text-4xl font-heading uppercase text-white">
              Top Players
            </h2>
          </div>

          <div className="max-w-[600px] mx-auto space-y-3">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="font-heading text-xl text-amber-400 w-10">
                  {player.rank}
                </div>
                <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-xl">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{player.name}</div>
                  <div className="text-sm text-white/60">{player.streak}</div>
                </div>
                <div className="font-heading text-xl text-amber-400">
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 max-w-4xl text-center">
          <div className="text-5xl mb-6">🎮</div>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 mb-4">
            Ready to Test Your Skills?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Jump into Blitz Rush and see how well you know the game. No signup required to play!
          </p>
          <Link
            href="/games/blitz-rush"
            className="inline-flex items-center px-10 py-5 bg-orange-500 text-white font-bold text-lg rounded-lg uppercase hover:bg-orange-600 transition-colors"
          >
            Start Playing
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
