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
    <section className={cn("relative py-12 md:py-20 overflow-hidden bg-[#004d25]")}>
      {/* Chalkboard Texture Effect via CSS */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 opacity-30 -z-10 bg-gradient-to-b from-black/40 to-transparent"></div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white/10 text-white border border-white/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="font-medium tracking-wide uppercase">Rookie Training Camp</span>
            </Badge>

            {/* Main Headline */}
            <div>
              <h1 className={cn("text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6 text-white font-heading uppercase tracking-tighter")}>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 drop-shadow-sm">Love the vibe.</span>
                <span className="block relative">
                  Learn the game.
                  {/* Telestrator Circle */}
                  <svg className="absolute -right-4 -top-4 w-24 h-24 text-yellow-400/80 pointer-events-none -rotate-12 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q30,10 80,30 T90,80 T20,90 T10,50" strokeDasharray="5,5" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed text-white/80 max-w-lg font-medium">
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
              <Button asChild variant="outline" size="lg" className="text-xl px-10 h-16 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
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
            <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl -z-10"></div>

            <div className={cn("relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/40 backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500")}>
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
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-black font-black text-sm px-4 py-2 rounded transform -rotate-3 shadow-lg border-2 border-black">
              X's AND O's
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
