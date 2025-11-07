import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroDesign8() {
  return (
    <section className="relative min-h-screen bg-[#FAFAF9] overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        {/* Gradient accent */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-orange-100/40 via-transparent to-transparent"></div>
      </div>

      <div className="container relative px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - Editorial Style */}
          <div className="flex items-center justify-between mb-20 pb-6 border-b-2 border-black">
            <div className="flex items-center gap-8">
              <div className="text-sm uppercase tracking-[0.2em] font-medium">
                Est. 2024
              </div>
              <div className="w-px h-6 bg-black/20"></div>
              <div className="text-sm uppercase tracking-[0.2em] font-medium">
                Premium Training
              </div>
            </div>
            <div className="text-sm uppercase tracking-[0.2em] font-medium">
              10,000+ Athletes
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left - Headline (7 columns) */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                {/* Eyebrow */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-orange-500"></div>
                  <span className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600">
                    Excellence
                  </span>
                </div>

                {/* Main Headline - Magazine Style */}
                <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] text-black">
                  Train With
                  <br />
                  <span className="italic font-serif text-orange-600">Purpose</span>
                </h1>

                {/* Subheadline */}
                <p className="text-2xl leading-relaxed text-gray-700 max-w-2xl font-light">
                  Championship coaches. Proven methods. Your transformation begins here.
                </p>
              </div>

              {/* CTA Area */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="h-16 px-12 bg-black hover:bg-gray-800 text-white text-base font-medium tracking-wide"
                  >
                    <Link href="/auth/sign-up">Begin Your Journey</Link>
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free to start</span>
                  </div>
                </div>

                {/* Trust Line */}
                <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500 font-medium">★★★★★</div>
                    <span>4.9 from 2,500+</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div>Featured in ESPN & SI</div>
                </div>
              </div>
            </div>

            {/* Right - Visual + Stats (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Featured Image Area */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-sm overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-0 h-0 border-t-[16px] border-t-transparent border-l-[24px] border-l-white border-b-[16px] border-b-transparent ml-1"></div>
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <div className="text-white text-sm uppercase tracking-[0.2em] mb-2">
                    Featured Course
                  </div>
                  <div className="text-white text-xl font-bold">
                    Advanced Techniques
                  </div>
                </div>

                {/* Corner Badge */}
                <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold">
                  New
                </div>
              </div>

              {/* Stats Grid - Minimal */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-2 border-black pl-4 py-2">
                  <div className="text-3xl font-bold text-black mb-1">50+</div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">Courses</div>
                </div>
                <div className="border-l-2 border-black pl-4 py-2">
                  <div className="text-3xl font-bold text-black mb-1">72</div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">Hours</div>
                </div>
                <div className="border-l-2 border-orange-500 pl-4 py-2">
                  <div className="text-3xl font-bold text-orange-600 mb-1">98%</div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Feature Highlights */}
          <div className="mt-32 pt-12 border-t border-gray-300">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-bold text-xl">
                  01
                </div>
                <h3 className="text-xl font-bold text-black">Expert Instruction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn from coaches with proven championship experience at every level.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-bold text-xl">
                  02
                </div>
                <h3 className="text-xl font-bold text-black">Comprehensive Curriculum</h3>
                <p className="text-gray-600 leading-relaxed">
                  50+ courses covering fundamentals, advanced techniques, and game strategy.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  03
                </div>
                <h3 className="text-xl font-bold text-black">Proven Results</h3>
                <p className="text-gray-600 leading-relaxed">
                  98% completion rate. Join 10,000+ athletes seeing real improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
