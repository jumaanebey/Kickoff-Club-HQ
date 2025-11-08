'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

export function HeroDesign7() {
  const { colors, theme } = useTheme()
  const isDarkOrGlam = theme === 'dark' || theme === 'glam'

  return (
    <>
      {/* Themed Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b",
        colors.headerBg,
        colors.headerBorder
      )}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className={cn("text-2xl font-bold", colors.headerLogo)}>
            Kickoff Club HQ
          </Link>
          <div className="flex items-center gap-6">
            <nav className={cn("flex items-center gap-6", colors.headerText)}>
              <Link href="/" className="hover:text-orange-500 transition-colors font-medium">
                Home
              </Link>
              <Link href="/courses" className="hover:text-orange-500 transition-colors">
                Courses
              </Link>
              <Link href="/podcast" className="hover:text-orange-500 transition-colors">
                Podcast
              </Link>
              <Link href="/auth/sign-in" className="hover:text-orange-500 transition-colors">
                Sign In
              </Link>
            </nav>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <section className={cn("relative overflow-hidden", colors.bg)}>
      {/* Ambient Background Effects - only show in dark/glam themes */}
      {isDarkOrGlam && <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>}

      <div className="container relative px-4 py-20">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Premium Badge */}
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
              colors.badge,
              colors.badgeBorder
            )}>
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className={cn("text-sm font-medium", colors.badgeText)}>
                Premium Football Training Platform
              </span>
            </div>

            {/* Headline with custom kerning */}
            <div className="space-y-2">
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.04em]">
                <span className={cn("block", colors.text)}>Love The Vibe,</span>
                <span className="block relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Learn The Game
                  </span>
                  {/* Custom underline */}
                  <div className="absolute -bottom-2 left-0 right-0 h-[4px] bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full"></div>
                </span>
              </h1>
            </div>

            {/* Description with better typography */}
            <p className={cn("text-lg leading-relaxed max-w-xl font-light", colors.textSecondary)}>
              Elite football training from championship coaches.
              <span className={cn("font-normal", colors.text)}> Master techniques</span>,
              <span className={cn("font-normal", colors.text)}> elevate strategy</span>,
              <span className={cn("font-normal", colors.text)}> transform your game</span>.
            </p>

            {/* Stats Bar with custom design */}
            <div className={cn("flex items-center gap-6 py-4 border-y", colors.cardBorder)}>
              <div>
                <div className={cn("text-2xl font-bold mb-1", colors.text)}>10k+</div>
                <div className={cn("text-xs uppercase tracking-wider", colors.textMuted)}>Athletes</div>
              </div>
              <div className={cn("w-px h-10", colors.cardBorder)}></div>
              <div>
                <div className={cn("text-2xl font-bold mb-1", colors.text)}>50+</div>
                <div className={cn("text-xs uppercase tracking-wider", colors.textMuted)}>Courses</div>
              </div>
              <div className={cn("w-px h-10", colors.cardBorder)}></div>
              <div>
                <div className={cn("text-2xl font-bold mb-1", colors.text)}>4.9</div>
                <div className={cn("text-xs uppercase tracking-wider", colors.textMuted)}>Rating</div>
              </div>
            </div>

            {/* Premium CTA */}
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                asChild
                className={cn(
                  "h-12 px-8 text-base border-0 shadow-[0_0_40px_rgba(251,146,60,0.3)] hover:shadow-[0_0_60px_rgba(251,146,60,0.4)] transition-all duration-300 group",
                  colors.primary,
                  colors.primaryHover,
                  colors.primaryText
                )}
              >
                <Link href="/auth/sign-up" className="flex items-center gap-3">
                  <span>Start Training</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className={cn(
                  "h-12 px-8 text-base border-2",
                  colors.inputBorder,
                  colors.text,
                  theme === 'light' ? "hover:bg-orange-50" : "hover:bg-white/5"
                )}
              >
                <Link href="/courses">View Courses</Link>
              </Button>
            </div>

            {/* Trust indicator */}
            <div className={cn("flex items-center gap-3 text-sm", colors.textMuted)}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 backdrop-blur-sm",
                      theme === 'light'
                        ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-white'
                        : 'bg-gradient-to-br from-white/20 to-white/5 border-[#0A0A0A]'
                    )}
                  />
                ))}
              </div>
              <span>Trusted by thousands of athletes worldwide</span>
            </div>
          </div>

          {/* Right Column - Custom Visual */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Main Card - Glassmorphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px]">
              {/* Bento Grid Layout */}
              <div className="relative w-full h-full">
                {/* Large Video Card */}
                <div className={cn(
                  "absolute top-0 left-0 w-full h-[60%] rounded-3xl border overflow-hidden group hover:scale-[1.02] transition-transform duration-500",
                  colors.card,
                  colors.cardHover
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-blue-800/50"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 bg-white/20 backdrop-blur-sm border-white/30">
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Bottom Left Card */}
                <div className={cn(
                  "absolute bottom-0 left-0 w-[48%] h-[35%] bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-2xl rounded-2xl border border-orange-400/30 p-6 flex flex-col justify-end hover:scale-[1.05] transition-transform duration-300"
                )}>
                  <div className="text-4xl font-black text-white mb-1">72</div>
                  <div className="text-sm text-orange-100 uppercase tracking-wider">Hours</div>
                </div>

                {/* Bottom Right Card */}
                <div className={cn(
                  "absolute bottom-0 right-0 w-[48%] h-[35%] rounded-2xl border p-6 flex flex-col justify-end hover:scale-[1.05] transition-transform duration-300",
                  colors.card,
                  colors.cardHover
                )}>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                    ))}
                  </div>
                  <div className={cn("text-2xl font-bold mb-1", colors.text)}>4.9</div>
                  <div className={cn("text-xs uppercase tracking-wider", colors.textMuted)}>Rating</div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-green-400 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg rotate-3 hover:rotate-0 transition-transform">
                  98% Success
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-0 w-2 h-32 bg-gradient-to-b from-orange-500/50 to-transparent rounded-full"></div>
            <div className="absolute bottom-32 left-0 w-2 h-24 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
