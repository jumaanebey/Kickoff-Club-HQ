import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroDesign7() {
  return (
    <>
      {/* Dark Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Kickoff Club HQ
          </Link>
          <nav className="flex items-center gap-6 text-white/80">
            <Link href="/" className="hover:text-white transition-colors font-medium text-white">
              Home
            </Link>
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/podcast" className="hover:text-white transition-colors">
              Podcast
            </Link>
            <Link href="/instructors" className="hover:text-white transition-colors">
              Instructors
            </Link>
            <Link href="/auth/sign-in" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="container relative px-4 py-20">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-20 items-center min-h-[85vh]">
          {/* Left Column - Content */}
          <div className="space-y-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-white/80">Premium Football Training Platform</span>
            </div>

            {/* Headline with custom kerning */}
            <div className="space-y-4">
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.04em]">
                <span className="block text-white">Dominate</span>
                <span className="block text-white">The</span>
                <span className="block relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Playbook
                  </span>
                  {/* Custom underline */}
                  <div className="absolute -bottom-2 left-0 right-0 h-[6px] bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full"></div>
                </span>
              </h1>
            </div>

            {/* Description with better typography */}
            <p className="text-xl text-white/60 leading-relaxed max-w-xl font-light">
              Elite football training from championship coaches.
              <span className="text-white/90 font-normal"> Master techniques</span>,
              <span className="text-white/90 font-normal"> elevate strategy</span>,
              <span className="text-white/90 font-normal"> transform your game</span>.
            </p>

            {/* Stats Bar with custom design */}
            <div className="flex items-center gap-8 py-6 border-y border-white/10">
              <div>
                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Athletes</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Courses</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">4.9</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Rating</div>
              </div>
            </div>

            {/* Premium CTA */}
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-16 px-10 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-[0_0_40px_rgba(251,146,60,0.3)] hover:shadow-[0_0_60px_rgba(251,146,60,0.4)] transition-all duration-300 group"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-3">
                  <span>Start Training</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-16 px-10 text-lg text-white hover:bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-xl"
              >
                <Link href="/courses">View Courses</Link>
              </Button>
            </div>

            {/* Trust indicator */}
            <div className="flex items-center gap-3 text-sm text-white/40">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm"
                  />
                ))}
              </div>
              <span>Trusted by thousands of athletes worldwide</span>
            </div>
          </div>

          {/* Right Column - Custom Visual */}
          <div className="relative h-[700px] hidden lg:block">
            {/* Main Card - Glassmorphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px]">
              {/* Bento Grid Layout */}
              <div className="relative w-full h-full">
                {/* Large Video Card */}
                <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-blue-800/50"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Bottom Left Card */}
                <div className="absolute bottom-0 left-0 w-[48%] h-[35%] bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-2xl rounded-2xl border border-orange-400/30 p-6 flex flex-col justify-end hover:scale-[1.05] transition-transform duration-300">
                  <div className="text-4xl font-black text-white mb-1">72</div>
                  <div className="text-sm text-orange-100 uppercase tracking-wider">Hours</div>
                </div>

                {/* Bottom Right Card */}
                <div className="absolute bottom-0 right-0 w-[48%] h-[35%] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 flex flex-col justify-end hover:scale-[1.05] transition-transform duration-300">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">4.9</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">Rating</div>
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
