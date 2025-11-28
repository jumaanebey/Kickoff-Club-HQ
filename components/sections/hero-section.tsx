'use client'

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/shared/utils"

export const HeroSection = memo(function HeroSection() {
  const { colors } = useTheme()

  return (
    <section className={cn("relative py-20 md:py-32 overflow-hidden")}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[800px] bg-gradient-to-b from-orange-500/5 to-transparent rounded-full blur-3xl -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-500/10 text-orange-500 border border-orange-500/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
              </span>
              <span className="font-bold tracking-wide uppercase">Kickoff Club HQ</span>
            </Badge>

            {/* Main Headline */}
            <div>
              <h1 className={cn("text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6 font-heading uppercase tracking-tighter", colors.text)}>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-sm">Love the vibe.</span>
                <span className="block relative">
                  Learn the game.
                  {/* Telestrator Circle */}
                  <svg className="absolute -right-4 -top-4 w-24 h-24 text-orange-400/80 pointer-events-none -rotate-12 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q30,10 80,30 T90,80 T20,90 T10,50" strokeDasharray="5,5" />
                  </svg>
                </span>
              </h1>
              <p className={cn("text-xl md:text-2xl leading-relaxed max-w-lg font-medium", colors.textSecondary)}>
                Football explained simply. No judgment. No gatekeeping. Just clear lessons that actually make sense.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-xl px-10 h-16 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all animate-huddle-break">
                <Link href="/auth/sign-up">
                  Start Training
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-xl px-10 h-16 border-2">
                <Link href="/courses">
                  <Play className="mr-2 w-6 h-6 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Dynamic Visuals */}
          <div className="relative lg:order-last">
            {/* Abstract Play Diagram Background */}
            <div className="absolute -inset-10 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>

            <div className={cn("relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500", colors.cardBorder)}>
              {/* YouTube Video Player */}
              <iframe
                src="https://www.youtube.com/embed/2Crk_DZ0TDE?modestbranding=1&rel=0&showinfo=0&origin=http://localhost:3000"
                title="How Downs Work - Kickoff Club HQ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
              />

              {/* "Live" Badge Overlay */}
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Live Feed
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white font-black text-sm px-4 py-2 rounded transform -rotate-3 shadow-lg border-2 border-orange-600">
              X's AND O's
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
