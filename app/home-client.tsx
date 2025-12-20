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
        <section className={cn("py-12 sm:py-16 md:py-20 border-b", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <Badge className="mb-3 sm:mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-2.5 sm:px-3 py-1 text-xs sm:text-sm uppercase tracking-wider">
                Simple Process
              </Badge>
              <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-black font-heading uppercase", colors.text)}>
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Works</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Pick a Course', desc: 'Choose from beginner-friendly courses covering positions, rules, and strategy.', icon: '📚', link: '/courses' },
                { step: '02', title: 'Watch & Learn', desc: 'Short, engaging video lessons that break down complex concepts simply.', icon: '🎬', link: '/courses' },
                { step: '03', title: 'Join the Community', desc: 'Go Pro and connect with other fans learning the game.', icon: '🤝', link: '/pricing' },
              ].map((item, i) => (
                <Link key={i} href={item.link} className={cn("relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border text-center group hover:border-orange-500/50 hover:-translate-y-1 transition-all cursor-pointer", colors.card, colors.cardBorder)}>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{item.icon}</div>
                  <div className="text-orange-500 font-bold text-xs sm:text-sm mb-2">{item.step}</div>
                  <h3 className={cn("text-lg sm:text-xl font-black font-heading uppercase mb-2 sm:mb-3", colors.text)}>{item.title}</h3>
                  <p className={cn("text-sm sm:text-base leading-relaxed", colors.textMuted)}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Problem / Solution */}
        <section className="py-12 sm:py-16 md:py-24 container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 blur-3xl opacity-20 rounded-full hidden sm:block" />
              <div className={cn("relative rounded-xl sm:rounded-2xl border p-5 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl", colors.card, colors.cardBorder)}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-base shrink-0">✕</div>
                    <p className={cn("font-medium text-sm sm:text-base", colors.text)}>Confusing paper playbooks</p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-base shrink-0">✕</div>
                    <p className={cn("font-medium text-sm sm:text-base", colors.text)}>Boring whiteboard lectures</p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/20 sm:scale-105 shadow-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-base shrink-0">✓</div>
                    <p className={cn("font-bold text-sm sm:text-base", colors.text)}>Interactive, gamified learning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 font-heading uppercase", colors.text)}>
                Stop Memorizing.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Start Understanding.</span>
              </h2>
              <p className={cn("text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8", colors.textMuted)}>
                Traditional football education is stuck in the past. We break down the game through short videos and podcasts, so you can learn faster and retain more.
              </p>
              <Button asChild variant="link" className="text-orange-500 font-bold text-base sm:text-lg p-0 hover:text-orange-600">
                <Link href="/courses">See How It Works <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. Course Preview */}
        <section className={cn("py-12 sm:py-16 md:py-20 border-b", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="mb-3 sm:mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-2.5 sm:px-3 py-1 text-xs sm:text-sm uppercase tracking-wider">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Courses
              </Badge>
              <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-black font-heading uppercase mb-3 sm:mb-4", colors.text)}>
                Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Learning</span>
              </h2>
              <p className={cn("text-base sm:text-lg md:text-xl max-w-2xl mx-auto", colors.textMuted)}>
                Beginner-friendly courses designed to take you from confused to confident.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[
                { title: 'Getting Started', desc: 'The basics of football - perfect for complete beginners.', icon: '🏈', color: 'from-green-500 to-emerald-600' },
                { title: 'Positions Explained', desc: 'Learn what every player on the field actually does.', icon: '👥', color: 'from-blue-500 to-indigo-600' },
                { title: 'Rules & Strategy', desc: 'Understand the game beyond just touchdowns.', icon: '📋', color: 'from-purple-500 to-pink-600' },
              ].map((course, i) => (
                <Link key={i} href="/courses" className={cn("group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border transition-all hover:border-orange-500/50 hover:-translate-y-1", colors.card, colors.cardBorder)}>
                  <div className={`text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                    {course.icon}
                  </div>
                  <h3 className={cn("text-lg sm:text-xl font-black font-heading uppercase mb-2", colors.text)}>{course.title}</h3>
                  <p className={cn("text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4", colors.textMuted)}>{course.desc}</p>
                  <span className="text-orange-500 font-bold text-xs sm:text-sm group-hover:underline">View Course →</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-10">
              <Button asChild size="lg" variant="outline" className={cn("h-10 sm:h-12 px-6 sm:px-8 font-bold border-2 text-sm sm:text-base", colors.cardBorder)}>
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6. Podcast Teaser */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-b border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-3 sm:mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 px-2.5 sm:px-3 py-1 text-xs sm:text-sm uppercase tracking-wider">
                  <Headphones className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Podcast
                </Badge>
                <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-black font-heading uppercase mb-3 sm:mb-4", colors.text)}>
                  The Kickoff <span className="text-purple-400">Podcast</span>
                </h2>
                <p className={cn("text-base sm:text-lg md:text-xl leading-relaxed mb-5 sm:mb-6", colors.textMuted)}>
                  Weekly episodes breaking down the game, interviewing experts, and answering your questions. Learn football on your commute.
                </p>
                <Button asChild size="lg" className="h-10 sm:h-12 px-6 sm:px-8 font-bold bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base">
                  <Link href="/podcast">
                    Listen Now
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex-1 w-full max-w-xs sm:max-w-sm">
                <div className={cn("rounded-xl sm:rounded-2xl border p-4 sm:p-6 backdrop-blur-xl", colors.card, colors.cardBorder)}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                      🎙️
                    </div>
                    <div>
                      <div className={cn("font-bold text-sm sm:text-base", colors.text)}>Latest Episode</div>
                      <div className={cn("text-xs sm:text-sm", colors.textMuted)}>New episodes weekly</div>
                    </div>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-purple-500/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-purple-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Mobile App Teaser */}
        <section className={cn("py-12 sm:py-16 md:py-20", colors.bg)}>
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
              <div className="flex-1 order-2 md:order-1">
                <div className="relative mx-auto w-36 h-72 sm:w-48 sm:h-96 rounded-[2rem] sm:rounded-[3rem] border-2 sm:border-4 border-white/20 bg-gradient-to-br from-gray-900 to-black overflow-hidden shadow-xl sm:shadow-2xl">
                  <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-4 sm:h-6 bg-black rounded-full" />
                  <div className="absolute inset-3 sm:inset-4 top-9 sm:top-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl mb-2">🏈</div>
                      <div className={cn("text-xs sm:text-sm font-bold", colors.text)}>Kickoff Club</div>
                      <div className={cn("text-[10px] sm:text-xs", colors.textMuted)}>Mobile App</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2 text-center md:text-left">
                <Badge className="mb-3 sm:mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20 px-2.5 sm:px-3 py-1 text-xs sm:text-sm uppercase tracking-wider">
                  <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Coming Soon
                </Badge>
                <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-black font-heading uppercase mb-3 sm:mb-4", colors.text)}>
                  Learn On <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">The Go</span>
                </h2>
                <p className={cn("text-base sm:text-lg md:text-xl leading-relaxed mb-5 sm:mb-6", colors.textMuted)}>
                  The Kickoff Club mobile app is in development. Build your football knowledge anywhere, anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <div className={cn("px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border font-bold opacity-60 text-sm sm:text-base", colors.card, colors.cardBorder)}>
                    iOS - Coming Soon
                  </div>
                  <div className={cn("px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border font-bold opacity-60 text-sm sm:text-base", colors.card, colors.cardBorder)}>
                    Android - Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={cn('py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t', colors.cardBorder)}>
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={cn('text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tight font-heading uppercase', colors.text)}>
                Ready to Level Up Your Game?
              </h2>
              <p className={cn('text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed', colors.textSecondary)}>
                Start learning football today. No judgment, no gatekeeping - just clear explanations that actually make sense.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" asChild className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_40px_rgba(251,146,60,0.3)] animate-huddle-break">
                  <Link href="/auth/sign-up">Start Learning Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="browse-courses-btn text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 border-2">
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
