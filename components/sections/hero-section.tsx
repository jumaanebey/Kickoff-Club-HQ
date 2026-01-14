'use client'

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/shared/utils"

export const HeroSection = memo(function HeroSection() {
  const { colors } = useTheme()

  return (
    <section className="relative pt-[116px] pb-24 overflow-hidden bg-gray-50">
      {/* Dotted Pattern Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="container px-8 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-full">
              Football for Everyone
            </span>

            {/* Main Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading uppercase leading-[0.95] mb-6 text-gray-900">
                <span className="block text-orange-500">Love the vibe.</span>
                <span className="block">Learn the game.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
                Football explained simply. No judgment. No gatekeeping. Just clear lessons that actually make sense.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-bold text-lg uppercase rounded-lg hover:bg-orange-600 transition-colors"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border border-gray-300 font-bold text-lg uppercase rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                Watch Demo
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4 text-gray-500 text-sm">
              <span className="flex items-center gap-2">
                <span className="text-lg">🎓</span> Beginner-friendly
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">⏱️</span> 5-min lessons
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">🆓</span> Start free
              </span>
            </div>
          </div>

          {/* Right Column - Video Card */}
          <div className="relative">
            {/* Main Video Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* YouTube Video Player */}
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/2Crk_DZ0TDE?modestbranding=1&rel=0&showinfo=0"
                  title="How Downs Work - Kickoff Club HQ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Video Title Bar */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-heading text-sm uppercase text-gray-900">Getting Started</div>
                    <div className="text-xs text-gray-500">How Downs Work • 5 min</div>
                  </div>
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Free</span>
                </div>
              </div>
            </div>

            {/* Floating Badge - Top Right */}
            <div className="absolute -top-4 -right-4 bg-amber-400 text-gray-900 font-bold text-sm px-4 py-2 uppercase tracking-wider rounded-lg animate-float shadow-lg hidden md:block">
              No Experience Needed
            </div>

            {/* Floating Badge - Bottom Left */}
            <div className="absolute -bottom-4 -left-4 bg-gray-900 text-white font-bold text-sm px-4 py-2 uppercase tracking-wider rounded-lg shadow-lg hidden md:block">
              100% Beginner-Friendly
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
