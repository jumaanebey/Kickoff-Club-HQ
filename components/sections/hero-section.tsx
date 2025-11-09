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
    <section className={cn("relative py-20 md:py-32 overflow-hidden", colors.bg)}>
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-500/20 border border-orange-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-orange-400">Premium Football Training Platform</span>
            </Badge>

            {/* Main Headline */}
            <div>
              <h1 className={cn("text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6", colors.text)}>
                <span className="block text-orange-500">Love The Vibe,</span>
                <span className="block">Learn The Game</span>
              </h1>
              <p className={cn("text-xl md:text-2xl leading-relaxed", colors.textMuted)}>
                Elite football training from championship coaches. Master techniques,
                elevate strategy, transform your game.
              </p>
            </div>

            {/* Stats Row */}
            <div className={cn("grid grid-cols-3 gap-4 py-6 border-y", colors.cardBorder)}>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-orange-500" />
                  <div className={cn("text-2xl font-bold", colors.text)}>10k+</div>
                </div>
                <div className={cn("text-sm", colors.textMuted)}>Athletes</div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <div className={cn("text-2xl font-bold", colors.text)}>50+</div>
                </div>
                <div className={cn("text-sm", colors.textMuted)}>Courses</div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <div className={cn("text-2xl font-bold", colors.text)}>4.9</div>
                </div>
                <div className={cn("text-sm", colors.textMuted)}>Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/auth/sign-up">
                  Start Training
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={cn("text-lg px-8 h-14 border", colors.cardBorder, colors.text)}>
                <Link href="/courses">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Sample Lesson
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className={cn("flex flex-col sm:flex-row sm:items-center gap-4 text-sm", colors.textMuted)}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block text-muted-foreground/50">•</div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
              <div className="hidden sm:block text-muted-foreground/50">•</div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>30-day guarantee</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-6">
              <p className={cn("text-sm font-medium mb-3", colors.text)}>Trusted by thousands of athletes worldwide</p>
              <div className="flex items-center gap-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-sm">
                  <span className={cn("font-semibold", colors.text)}>4.9/5</span>
                  <span className={colors.textMuted}> from 250+ reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Trailer Video */}
          <div className="relative lg:order-last">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* YouTube Embedded Video - Replace VIDEO_ID with your actual YouTube video ID */}
              {/* Example: If your video is https://youtube.com/watch?v=ABC123, use VIDEO_ID="ABC123" */}
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="Kickoff Club HQ Course Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Secondary Trust Bar */}
        <div className={cn("mt-20 pt-12 border-t", colors.cardBorder)}>
          <p className={cn("text-center text-sm mb-8", colors.textMuted)}>
            USED BY ATHLETES AT THESE SCHOOLS AND MORE
          </p>
          <div className={cn("flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60", colors.textMuted)}>
            <div className="font-semibold">Lincoln High</div>
            <div className="font-semibold">Valley Sports</div>
            <div className="font-semibold">East Raiders</div>
            <div className="font-semibold">Central United</div>
            <div className="font-semibold">West Prep</div>
          </div>
        </div>
      </div>
    </section>
  )
}
