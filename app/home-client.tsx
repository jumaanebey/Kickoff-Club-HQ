'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { memo } from 'react'

import { ArrowRight, Headphones, BookOpen, Smartphone } from 'lucide-react'

// Dynamic imports for code splitting - load sections only when needed
const HeroSection = dynamic(() => import("@/components/sections/hero-section").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-screen animate-pulse bg-gradient-to-br from-orange-500/10 to-orange-600/10" />
})


export const HomePageClient = memo(function HomePageClient() {
  const { colors } = useTheme()

  return (
    <>
      <ThemedHeader activePage="home" />
      <div className={cn('min-h-screen', colors.bg)}>
        {/* New Hero Section */}
        <HeroSection />

        {/* 2. How It Works */}
        <section className={cn("py-20 border-b", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 text-sm uppercase tracking-wider">
                Simple Process
              </Badge>
              <h2 className={cn("text-4xl md:text-5xl font-black font-heading uppercase", colors.text)}>
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Works</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Pick a Course', desc: 'Choose from beginner-friendly courses covering positions, rules, and strategy.', icon: '📚', link: '/courses' },
                { step: '02', title: 'Watch & Learn', desc: 'Short, engaging video lessons that break down complex concepts simply.', icon: '🎬', link: '/courses' },
                { step: '03', title: 'Join the Community', desc: 'Go Pro and connect with other fans learning the game.', icon: '🤝', link: '/pricing' },
              ].map((item, i) => (
                <Link key={i} href={item.link} className={cn("relative p-8 rounded-2xl border text-center group hover:border-orange-500/50 hover:-translate-y-1 transition-all cursor-pointer", colors.card, colors.cardBorder)}>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-orange-500 font-bold text-sm mb-2">{item.step}</div>
                  <h3 className={cn("text-xl font-black font-heading uppercase mb-3", colors.text)}>{item.title}</h3>
                  <p className={cn("leading-relaxed", colors.textMuted)}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Problem / Solution */}
        <section className="py-24 container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 blur-3xl opacity-20 rounded-full" />
              <div className={cn("relative rounded-2xl border p-8 shadow-2xl", colors.card, colors.cardBorder)}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">✕</div>
                    <p className={cn("font-medium", colors.text)}>Confusing paper playbooks</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">✕</div>
                    <p className={cn("font-medium", colors.text)}>Boring whiteboard lectures</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 scale-105 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
                    <p className={cn("font-bold", colors.text)}>Interactive, gamified learning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className={cn("text-4xl md:text-5xl font-black mb-6 font-heading uppercase", colors.text)}>
                Stop Memorizing.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Start Understanding.</span>
              </h2>
              <p className={cn("text-xl leading-relaxed mb-8", colors.textMuted)}>
                Traditional football education is stuck in the past. We turned the playbook into a video game, so you can learn faster and retain more.
              </p>
              <Button asChild variant="link" className="text-orange-500 font-bold text-lg p-0 hover:text-orange-600">
                <Link href="/courses">See How It Works <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. Course Preview */}
        <section className={cn("py-20 border-b", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Badge>
              <h2 className={cn("text-4xl md:text-5xl font-black font-heading uppercase mb-4", colors.text)}>
                Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Learning</span>
              </h2>
              <p className={cn("text-xl max-w-2xl mx-auto", colors.textMuted)}>
                Beginner-friendly courses designed to take you from confused to confident.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { title: 'Getting Started', desc: 'The basics of football - perfect for complete beginners.', icon: '🏈', color: 'from-green-500 to-emerald-600' },
                { title: 'Positions Explained', desc: 'Learn what every player on the field actually does.', icon: '👥', color: 'from-blue-500 to-indigo-600' },
                { title: 'Rules & Strategy', desc: 'Understand the game beyond just touchdowns.', icon: '📋', color: 'from-purple-500 to-pink-600' },
              ].map((course, i) => (
                <Link key={i} href="/courses" className={cn("group p-6 rounded-2xl border transition-all hover:border-orange-500/50 hover:-translate-y-1", colors.card, colors.cardBorder)}>
                  <div className={`text-4xl mb-4 w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                    {course.icon}
                  </div>
                  <h3 className={cn("text-xl font-black font-heading uppercase mb-2", colors.text)}>{course.title}</h3>
                  <p className={cn("text-sm leading-relaxed mb-4", colors.textMuted)}>{course.desc}</p>
                  <span className="text-orange-500 font-bold text-sm group-hover:underline">View Course →</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg" variant="outline" className={cn("h-12 px-8 font-bold border-2", colors.cardBorder)}>
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6. Podcast Teaser */}
        <section className="py-20 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-b border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-1">
                <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 text-sm uppercase tracking-wider">
                  <Headphones className="w-4 h-4 mr-2" />
                  Podcast
                </Badge>
                <h2 className={cn("text-4xl md:text-5xl font-black font-heading uppercase mb-4", colors.text)}>
                  The Kickoff <span className="text-purple-400">Podcast</span>
                </h2>
                <p className={cn("text-xl leading-relaxed mb-6", colors.textMuted)}>
                  Weekly episodes breaking down the game, interviewing experts, and answering your questions. Learn football on your commute.
                </p>
                <Button asChild size="lg" className="h-12 px-8 font-bold bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/podcast">
                    Listen Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <div className={cn("rounded-2xl border p-6 backdrop-blur-xl", colors.card, colors.cardBorder)}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl">
                      🎙️
                    </div>
                    <div>
                      <div className={cn("font-bold", colors.text)}>Latest Episode</div>
                      <div className={cn("text-sm", colors.textMuted)}>New episodes weekly</div>
                    </div>
                  </div>
                  <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-purple-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Mobile App Teaser */}
        <section className={cn("py-20", colors.bg)}>
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
              <div className="flex-1 order-2 md:order-1">
                <div className="relative mx-auto w-48 h-96 rounded-[3rem] border-4 border-white/20 bg-gradient-to-br from-gray-900 to-black overflow-hidden shadow-2xl">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                  <div className="absolute inset-4 top-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏈</div>
                      <div className={cn("text-sm font-bold", colors.text)}>Kickoff Club</div>
                      <div className={cn("text-xs", colors.textMuted)}>Mobile App</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 text-sm uppercase tracking-wider">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Coming Soon
                </Badge>
                <h2 className={cn("text-4xl md:text-5xl font-black font-heading uppercase mb-4", colors.text)}>
                  Learn On <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">The Go</span>
                </h2>
                <p className={cn("text-xl leading-relaxed mb-6", colors.textMuted)}>
                  The Kickoff Club mobile app is in development. Build your football knowledge anywhere, anytime.
                </p>
                <div className="flex gap-4">
                  <div className={cn("px-6 py-3 rounded-xl border font-bold opacity-60", colors.card, colors.cardBorder)}>
                    iOS - Coming Soon
                  </div>
                  <div className={cn("px-6 py-3 rounded-xl border font-bold opacity-60", colors.card, colors.cardBorder)}>
                    Android - Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={cn('py-24 lg:py-32 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t', colors.cardBorder)}>
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight font-heading uppercase', colors.text)}>
                Ready to Level Up Your Game?
              </h2>
              <p className={cn('text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed', colors.textSecondary)}>
                Start learning football today. No judgment, no gatekeeping - just clear explanations that actually make sense.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_40px_rgba(251,146,60,0.3)] animate-huddle-break">
                  <Link href="/auth/sign-up">Start Learning Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="browse-courses-btn text-lg h-14 px-8 border-2">
                  <Link href="/courses">Browse All Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div >
    </>
  )
})
