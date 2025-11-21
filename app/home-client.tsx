'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { memo } from 'react'

import { Ticker } from '@/components/ui/ticker'

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
          "Game Day: Test Your Referee Skills",
          "Weekly Film Review: Sunday at 8pm EST"
        ]}
      />
      <div className={cn('min-h-screen', colors.bg)}>
        {/* New Hero Section */}
        <HeroSection />

        {/* Game Day Section */}
        <section className="py-16 bg-black/5 dark:bg-white/5 border-y border-black/10 dark:border-white/10">
          <div className="container px-4 mx-auto text-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-black uppercase tracking-widest transform -rotate-2">
              Interactive Zone
            </div>
            <h2 className={cn("text-4xl md:text-5xl font-heading uppercase mb-6", colors.text)}>
              Test Your Knowledge
            </h2>
            <p className={cn("text-lg mb-8 max-w-2xl mx-auto", colors.textMuted)}>
              Think you can make the right call? Step into the referee's shoes and see if you can spot the penalty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-4xl mx-auto">
              <div className="group relative overflow-hidden rounded-2xl bg-[#004d25] border-4 border-white/10 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                {/* Chalkboard Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }}>
                </div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left">
                    <h3 className="text-3xl font-heading text-white mb-2">Guess the Penalty</h3>
                    <p className="text-white/80 mb-6">5 Scenarios. 5 Calls. Can you get a perfect score?</p>
                    <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-lg px-8">
                      <Link href="/games/guess-the-penalty">Play Now</Link>
                    </Button>
                  </div>
                  <div className="text-6xl md:text-8xl animate-bounce">
                    🏁
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


      </div>
    </>
  )
})
