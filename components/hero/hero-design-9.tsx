import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

export function HeroDesign9() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {/* Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="container relative px-4 py-16">
        <div className="min-h-[90vh] flex flex-col justify-center">
          {/* Top Label */}
          <div className="mb-16 flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-orange-500 to-transparent"></div>
            <span className="text-sm uppercase tracking-[0.3em] text-blue-200 font-medium">
              Next Generation Training
            </span>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-[1fr,0.8fr] gap-16 items-center mb-20">
            {/* Left - Headline */}
            <div className="space-y-10">
              {/* Massive Headline */}
              <h1 className="space-y-2">
                <div className="text-[clamp(3rem,7vw,6rem)] font-black leading-[1] tracking-[-0.02em]">
                  <span className="block">Transform</span>
                  <span className="block">Your Game</span>
                  <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Forever
                  </span>
                </div>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl font-light">
                Elite training programs designed by championship coaches.
                Access cutting-edge techniques, personalized feedback, and a community
                of dedicated athletes.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold border-0 shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:shadow-[0_0_50px_rgba(251,146,60,0.5)] transition-all duration-300 group"
                >
                  <Link href="/auth/sign-up" className="flex items-center gap-2">
                    <span>Get Started Free</span>
                    <MoveRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-blue-900 bg-gradient-to-br from-blue-400 to-blue-600"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-white">10,000+ athletes</div>
                    <div className="text-blue-300 text-xs">training right now</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Stats Dashboard */}
            <div className="relative h-[500px] lg:h-[600px]">
              {/* Floating Cards with Depth */}
              <div className="absolute inset-0">
                {/* Card 1 - Main Featured */}
                <div className="absolute top-0 right-0 w-[90%] h-[55%] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-semibold uppercase tracking-wider">
                      Live Now
                    </div>
                    <div className="text-blue-100 text-sm">Featured</div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-bold text-white">Quarterback Mastery</h3>
                    <p className="text-blue-200 text-sm">with Coach Marcus Williams</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">12 Lessons</div>
                      <div className="text-blue-300 text-sm">4.5 hours</div>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Stats */}
                <div className="absolute bottom-0 left-0 w-[45%] h-[40%] bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-[1.05] transition-transform duration-300">
                  <div className="text-white/80 text-xs uppercase tracking-widest mb-3">Total Content</div>
                  <div className="text-5xl font-black text-white mb-2">72</div>
                  <div className="text-orange-100 text-sm font-medium">Hours of Training</div>
                </div>

                {/* Card 3 - Rating */}
                <div className="absolute bottom-0 right-0 w-[50%] h-[40%] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-[1.05] transition-transform duration-300">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-orange-400 text-lg">★</span>
                    ))}
                  </div>
                  <div className="text-5xl font-black text-white mb-1">4.9</div>
                  <div className="text-blue-200 text-sm">From 2,500+ reviews</div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 left-1/4 bg-blue-600 backdrop-blur-xl border border-blue-400/30 px-4 py-2 rounded-xl shadow-lg">
                  <div className="text-white text-sm font-bold">50+ Courses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Active Athletes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Expert Coaches</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">98%</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
