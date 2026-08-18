'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { memo } from 'react'
import { ArrowRight, Headphones, BookOpen, Smartphone, Gamepad2 } from 'lucide-react'
import { WaitlistForm } from '@/components/forms/waitlist-form'

// Dynamic imports for code splitting
const HeroSection = dynamic(() => import("@/components/sections/hero-section").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
})

export const HomePageClient = memo(function HomePageClient() {
  const { colors } = useTheme()

  return (
    <>
      <ThemedHeader activePage="home" />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="container px-8 mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-heading uppercase text-gray-900">
                How It <span className="text-orange-500">Works</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Pick a Course', desc: 'Choose from beginner-friendly courses covering positions, rules, and strategy.', icon: '📚', link: '/courses' },
                { step: '02', title: 'Watch & Learn', desc: 'Short, engaging video lessons that break down complex concepts simply.', icon: '🎬', link: '/courses' },
                { step: '03', title: 'Join the Community', desc: 'Go Pro and connect with other fans learning the game.', icon: '🤝', link: '/pricing' },
              ].map((item, i) => (
                <Link key={i} href={item.link} className="bg-white border border-gray-200 rounded-xl p-8 text-center group hover:-translate-y-2 hover:shadow-lg transition-all">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-orange-500 font-bold text-sm mb-2">{item.step}</div>
                  <h3 className="font-heading text-xl uppercase mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Journey */}
        <section className="py-24 bg-gray-50">
          <div className="container px-8 mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                {/* Learning path visual */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-heading text-lg shrink-0">1</div>
                    <div className="flex-1 border-l-2 border-dashed border-gray-200 pl-4 pb-6">
                      <div className="font-heading text-lg uppercase text-gray-900">Watch</div>
                      <p className="text-gray-500 text-sm">Short, clear video lessons</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center text-gray-900 font-heading text-lg shrink-0">2</div>
                    <div className="flex-1 border-l-2 border-dashed border-gray-200 pl-4 pb-6">
                      <div className="font-heading text-lg uppercase text-gray-900">Listen</div>
                      <p className="text-gray-500 text-sm">Podcast episodes on the go</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-heading text-lg shrink-0">3</div>
                    <div className="flex-1 pl-4">
                      <div className="font-heading text-lg uppercase text-gray-900">Play</div>
                      <p className="text-gray-500 text-sm">Test knowledge with Blitz Rush</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-heading uppercase mb-6 text-gray-900">
                  Watch. Listen.<br />
                  <span className="text-orange-500">Play. Repeat.</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Learn football your way. Our multi-format approach combines video lessons, podcast episodes, and interactive games so you can absorb information however works best for you.
                </p>
                <Link href="/courses" className="inline-flex items-center text-orange-500 font-bold text-lg hover:underline">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Course Preview */}
        <section className="py-20 bg-white border-y border-gray-200">
          <div className="container px-8 mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </span>
              <h2 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-gray-900">
                Start <span className="text-orange-500">Learning</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Beginner-friendly courses designed to take you from confused to confident.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: 'Getting Started', desc: 'The basics of football - perfect for complete beginners.', icon: '🏈', color: 'bg-emerald-500' },
                { title: 'Positions Explained', desc: 'Learn what every player on the field actually does.', icon: '👥', color: 'bg-gray-800' },
                { title: 'Rules & Strategy', desc: 'Understand the game beyond just touchdowns.', icon: '📋', color: 'bg-orange-500' },
              ].map((course, i) => (
                <Link key={i} href="/courses" className="group bg-white border border-gray-200 rounded-xl p-6 hover:-translate-y-2 hover:shadow-lg transition-all">
                  <div className={`text-4xl mb-4 w-16 h-16 ${course.color} rounded-xl flex items-center justify-center`}>
                    {course.icon}
                  </div>
                  <h3 className="font-heading text-xl uppercase mb-2 text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{course.desc}</p>
                  <span className="text-orange-500 font-bold text-sm group-hover:underline">View Course →</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-900 border border-gray-300 font-bold uppercase rounded-lg hover:bg-gray-200 transition-colors">
                Browse All Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Podcast Teaser */}
        <section className="py-20 bg-gray-900">
          <div className="container px-8 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-flex items-center bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
                  <Headphones className="w-4 h-4 mr-2" />
                  Podcast
                </span>
                <h2 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-white">
                  The Kickoff <span className="text-amber-400">Podcast</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-6">
                  Weekly episodes breaking down the game, interviewing experts, and answering your questions. Learn football on your commute.
                </p>
                <Link href="/podcast" className="inline-flex items-center px-8 py-4 bg-amber-400 text-gray-900 font-bold uppercase rounded-lg hover:bg-amber-300 transition-colors">
                  Listen Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <div className="bg-white/10 border border-amber-400/30 p-6 backdrop-blur rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-amber-400 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      🎙️
                    </div>
                    <div>
                      <div className="font-bold text-white">Latest Episode</div>
                      <div className="text-sm text-white/60">New episodes weekly</div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-8 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-1 w-full max-w-sm order-2 md:order-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="aspect-square bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
                    <span className="text-8xl">🎮</span>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-heading text-lg uppercase text-gray-900">Blitz Rush</div>
                    <div className="text-sm text-gray-500">Test your knowledge</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left order-1 md:order-2">
                <span className="inline-flex items-center bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Games
                </span>
                <h2 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-gray-900">
                  Learn By <span className="text-orange-500">Playing</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Reinforce what you've learned with our interactive games. Challenge yourself, compete with friends, and climb the leaderboard.
                </p>
                <Link href="/games" className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold uppercase rounded-lg hover:bg-orange-600 transition-colors">
                  Play Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Waitlist */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="container px-8 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-1 order-2 md:order-1">
                <div className="relative mx-auto w-48 h-96 border-4 border-gray-900 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-white overflow-hidden shadow-2xl">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
                  <div className="absolute inset-4 top-12 bg-gradient-to-br from-orange-500/20 to-amber-400/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏈</div>
                      <div className="text-sm font-bold text-gray-900">Kickoff Club</div>
                      <div className="text-xs text-gray-500">Mobile App</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2 text-center md:text-left">
                <span className="inline-flex items-center bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full mb-4">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Coming Soon
                </span>
                <h2 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-gray-900">
                  Learn On <span className="text-orange-500">The Go</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  The Kickoff Club mobile app is in development. Join the waitlist for exclusive launch pricing and bonus content.
                </p>

                {/* Waitlist Signup */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">Early Access</span>
                    <span className="text-gray-500 text-sm">Limited spots</span>
                  </div>
                  <WaitlistForm
                    source="mobile_app"
                placeholder="Enter your email"
                    buttonText="Join"
                    successMessage="You're on the list! We'll notify you at launch."
                  />
                  <p className="text-xs text-gray-500 mt-3">Get 50% off launch pricing + exclusive bonus lessons</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-orange-500">
          <div className="container px-8 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-6 text-white">
                Ready to Level Up Your Game?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Start learning football today. No judgment, no gatekeeping - just clear explanations that actually make sense.
              </p>

              {/* Email Signup */}
              <div className="max-w-md mx-auto mb-8">
                <WaitlistForm
                  source="homepage"
                placeholder="Enter your email to get started"
                  buttonText="Join Free"
                  successMessage="Welcome to the club!"
                />
              </div>

              <p className="text-sm text-white/70 mb-8">or</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/sign-up" className="inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white font-bold text-lg uppercase rounded-lg hover:bg-gray-800 transition-colors">
                  Create Account
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-500 font-bold text-lg uppercase rounded-lg hover:bg-gray-100 transition-colors">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
})
