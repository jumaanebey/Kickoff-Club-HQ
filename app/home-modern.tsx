'use client'

import Link from 'next/link'
import { memo } from 'react'
import { ArrowRight, Play, BookOpen, Headphones, Gamepad2, CheckCircle, Users, Clock, Star } from 'lucide-react'

export const HomePageModern = memo(function HomePageModern() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-center py-3 px-4 text-sm font-medium">
        New to football? <Link href="/courses" className="text-blue-400 hover:underline">Start with our free intro course</Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              KC
            </div>
            <span className="font-bold text-gray-900 text-lg">Kickoff Club</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/courses" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition">Courses</Link>
            <Link href="/podcast" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition">Podcast</Link>
            <Link href="/games" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition">Games</Link>
            <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition">Pricing</Link>
            <Link href="/auth/sign-up" className="ml-2 px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-60" />
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[80px] opacity-30" />
        <div className="absolute top-[200px] left-[-100px] w-[400px] h-[400px] bg-purple-400 rounded-full blur-[80px] opacity-20" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Join 10,000+ fans learning football
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Learn football the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              right way
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Finally understand the game you love. Video courses, podcasts, and games designed for complete beginners. No jargon, no gatekeeping.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/sign-up" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
              <Play className="w-5 h-5" />
              Watch Preview
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500 font-medium">Video Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-500 font-medium">Podcast Episodes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.9</div>
              <div className="text-sm text-gray-500 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4 block">How it works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Three ways to learn
            </h2>
            <p className="text-lg text-gray-500">
              Choose the format that works best for you. Most members use all three.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Video Courses',
                desc: 'Short, engaging lessons that break down complex concepts into bite-sized videos.',
                color: 'bg-blue-100 text-blue-600',
                link: '/courses'
              },
              {
                icon: <Headphones className="w-6 h-6" />,
                title: 'Podcast Episodes',
                desc: 'Learn on the go with weekly episodes covering strategy, history, and current games.',
                color: 'bg-purple-100 text-purple-600',
                link: '/podcast'
              },
              {
                icon: <Gamepad2 className="w-6 h-6" />,
                title: 'Interactive Games',
                desc: 'Test your knowledge with Blitz Rush and climb the leaderboard against other fans.',
                color: 'bg-green-100 text-green-600',
                link: '/games'
              }
            ].map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                <span className="text-blue-600 font-medium text-sm group-hover:underline">Learn more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4 block">Popular courses</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Start with the basics
            </h2>
            <p className="text-lg text-gray-500">
              Beginner-friendly courses designed to take you from confused to confident.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Football 101', desc: 'The complete beginner guide to understanding the game.', lessons: 8, time: '45 min', badge: 'Free' },
              { title: 'Positions Explained', desc: 'Learn what every player on the field actually does.', lessons: 12, time: '1.5 hrs', badge: 'Popular' },
              { title: 'Understanding Plays', desc: 'Decode offensive and defensive strategies like a pro.', lessons: 10, time: '1 hr', badge: 'New' },
            ].map((course, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative">
                  <span className="text-6xl">🏈</span>
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      course.badge === 'Free' ? 'bg-green-100 text-green-700' :
                      course.badge === 'Popular' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {course.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{course.desc}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 block">Why Kickoff Club</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Built for real beginners
            </h2>
            <p className="text-lg text-gray-400">
              We know what it's like to feel lost watching a game. That's why we do things differently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎯', title: 'No jargon', desc: 'We explain everything in plain English. No assumed knowledge.' },
              { icon: '⚡', title: 'Bite-sized lessons', desc: 'Learn in 5-10 minute chunks that fit your schedule.' },
              { icon: '🎮', title: 'Actually fun', desc: 'Games and quizzes make learning interactive, not boring.' },
              { icon: '👥', title: 'Supportive community', desc: 'Ask questions without judgment. We were all beginners once.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-2xl p-8 flex gap-5 hover:border-gray-600 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl text-gray-900 font-medium mb-8 leading-relaxed">
            "I watched football for years without really understanding it. After just one week with Kickoff Club, I finally get what's happening on the field."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg">👤</div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-sm text-gray-500">Kickoff Club Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to finally understand football?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of fans who went from confused to confident. Start with our free course today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Start Learning Free
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  KC
                </div>
                <span className="font-bold text-white">Kickoff Club</span>
              </div>
              <p className="text-sm leading-relaxed">
                Making football accessible to everyone. No gatekeeping, no judgment.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Learn</h4>
              <div className="space-y-2">
                <Link href="/courses" className="block text-sm hover:text-white transition">Courses</Link>
                <Link href="/podcast" className="block text-sm hover:text-white transition">Podcast</Link>
                <Link href="/games" className="block text-sm hover:text-white transition">Games</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/pricing" className="block text-sm hover:text-white transition">Pricing</Link>
                <Link href="/auth/sign-in" className="block text-sm hover:text-white transition">Sign In</Link>
                <Link href="/auth/sign-up" className="block text-sm hover:text-white transition">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm hover:text-white transition">Privacy</Link>
                <Link href="/terms" className="block text-sm hover:text-white transition">Terms</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Kickoff Club HQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
})
