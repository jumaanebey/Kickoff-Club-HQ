'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight, Star, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { colors } = useTheme()

  return (
    <section className={cn("relative py-12 md:py-16 overflow-hidden", colors.bg)}>
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-500/20 border border-orange-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-orange-400">New Fan? Start Here</span>
            </Badge>

            {/* Main Headline */}
            <div>
              <h1 className={cn("text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6", colors.text)}>
                <span className="block text-orange-500">Love the vibe.</span>
                <span className="block">Learn the game.</span>
              </h1>
              <p className={cn("text-xl md:text-2xl leading-relaxed", colors.textMuted)}>
                Football explained simply - no judgment, no gatekeeping. From "what's a down?" to "that's holding!" in bite-sized lessons that actually make sense.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/auth/sign-up">
                  Start Training
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="watch-free-btn text-lg px-8 h-14 border-2">
                <Link href="/courses/football-fundamentals/lessons/00000000-0000-0000-0000-000000000101">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Free Lesson
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Platform Trailer/Overview */}
          <div className="relative lg:order-last space-y-6">
            <div className={cn("relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-600/20 to-orange-800/20 border", colors.cardBorder)}>
              {/* Video Placeholder - Replace with actual trailer video */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-2">Platform Overview</h3>
                  <p className="text-white/70 text-sm">See what Kickoff Club HQ has to offer</p>
                </div>
              </div>
              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">TRAILER</Badge>
                  <span className="text-white/60 text-sm">2:30</span>
                </div>
                <h3 className="text-white font-bold text-xl">Welcome to Kickoff Club HQ</h3>
                <p className="text-white/70 text-sm">Learn football from championship coaches • Master every position • Train at your pace</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
