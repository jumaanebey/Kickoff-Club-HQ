'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { memo } from 'react'

import { Ticker } from '@/components/ui/ticker'
import { useGameProgress } from '@/hooks/use-game-progress'
import { CheckCircle2, Trophy, ArrowRight, PlayCircle, Headphones, Coins } from 'lucide-react'

// Dynamic imports for code splitting - load sections only when needed
const HeroSection = dynamic(() => import("@/components/sections/hero-section").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-screen animate-pulse bg-gradient-to-br from-orange-500/10 to-orange-600/10" />
})


export const HomePageClient = memo(function HomePageClient() {
  const { colors } = useTheme()

  return (
    <>
      <ThemedHeader activePage="home" />
      <Ticker
        items={[
          "New Course: Defensive Coverages Explained",
          "Podcast Ep #42: The Art of the Blitz",
          "Join the Coaching Cohort Waitlist",
          "NEW: Visit the Arcade! 6 Games Coming Soon 🏁",
          "Weekly Film Review: Sunday at 8pm EST"
        ]}
      />
      <div className={cn('min-h-screen', colors.bg)}>
        {/* New Hero Section */}
        <HeroSection />

        {/* 2. Problem / Solution - See How It Works */}
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

        {/* 3. The "Hook" (Games) - Test Your Football IQ */}
        <section className="py-16 bg-black/90 border-y border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20" />
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-left">
                <Badge className="mb-4 bg-yellow-400 text-black font-bold text-sm px-3 py-1 uppercase tracking-wider animate-pulse">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Play Now
                </Badge>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading uppercase tracking-tight">
                  Test Your <span className="text-yellow-400">Football IQ</span> Right Now
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                  Don't just watch. Play. Jump into <strong>Blitz Rush</strong> and see how far you can go before the defense catches you.
                </p>
                <div className="flex gap-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                    <Link href="/games/blitz-rush">
                      Play Blitz Rush
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10">
                    <Link href="/games">View All Games</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-md">
                {/* Mini Game Preview Card */}
                <div className="relative aspect-[3/4] md:aspect-video rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-gradient-to-br from-green-800 to-green-950 group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-bounce">🏃💨</div>
                      <div className="text-2xl font-black text-white uppercase tracking-widest">Blitz Rush</div>
                      <div className="mt-4 px-4 py-2 bg-black/50 rounded-full text-white/80 text-sm backdrop-blur-sm">
                        Tap to Start
                      </div>
                    </div>
                  </div>
                  {/* Hover Effect Overlay */}
                  <Link href="/games/blitz-rush" className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-orange-500 text-white rounded-full p-4 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <PlayCircle className="w-12 h-12" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Social Proof */}
        <section className={cn("py-12 border-b", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto text-center">
            <p className={cn("text-sm font-bold uppercase tracking-widest mb-8 opacity-60", colors.textMuted)}>
              Trusted by New Learners, Casual Fans, and Aspiring Superstars
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder Logos - Text for now */}
              {['Varsity High', 'State College', 'Pro Academy', 'Youth League', 'Elite Camps'].map(name => (
                <div key={name} className={cn("text-xl font-black font-heading uppercase", colors.text)}>{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Trending Now (Mix) */}
        <section className={cn("py-24 border-t", colors.bgSecondary, colors.cardBorder)}>
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className={cn("text-3xl md:text-4xl font-black mb-4 font-heading uppercase", colors.text)}>Trending Now</h2>
                <p className={cn("text-lg", colors.textMuted)}>The most popular content on HQ this week.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 1. Game */}
              <Link href="/games/blitz-rush" className="group block relative rounded-xl overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-950" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-5xl mb-4">🏃💨</div>
                  <h3 className="text-2xl font-black text-white uppercase font-heading">Blitz Rush</h3>
                  <Badge className="mt-2 bg-yellow-400 text-black border-0">Arcade Game</Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>

              {/* 2. Course */}
              <Link href="/courses" className="group block relative rounded-xl overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                {/* Use the generated image if available, fallback to gradient */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/courses/fundamentals.jpg')" }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <Badge className="mb-2 bg-blue-500 text-white border-0">Course</Badge>
                  <h3 className="text-xl font-bold text-white">Football Fundamentals 101</h3>
                </div>
              </Link>

              {/* 3. Podcast */}
              <Link href="/podcast" className="group block relative rounded-xl overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Ep #42: The Art of the Blitz</h3>
                  <Badge className="mt-2 bg-purple-500 text-white border-0">Podcast</Badge>
                </div>
              </Link>
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
      </div>
    </>
  )
})
