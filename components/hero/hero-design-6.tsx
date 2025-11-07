import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Award, Zap, Shield, ArrowRight } from 'lucide-react'

export function HeroDesign6() {
  return (
    <section className="relative min-h-screen bg-white">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-blue-50"></div>

      <div className="container relative px-4 py-20">
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-16 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Zap className="h-4 w-4" />
              <span>Start Your Journey Today</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Level Up Your
              <br />
              <span className="relative inline-block mt-2">
                Football Skills
                <div className="absolute -bottom-3 left-0 right-0 h-3 bg-orange-400 -skew-x-12 -z-10"></div>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Learn from elite coaches through 50+ comprehensive video courses.
              Master techniques, strategies, and fundamentals that will transform your game.
            </p>

            {/* Key Benefits - Icon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">HD Videos</div>
                  <div className="text-sm text-gray-600">72+ hours</div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Pro Coaches</div>
                  <div className="text-sm text-gray-600">100+ experts</div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Guaranteed</div>
                  <div className="text-sm text-gray-600">30-day refund</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all group"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base border-2 hover:bg-gray-50"
              >
                <Link href="/courses">View All Courses</Link>
              </Button>
            </div>

            {/* Trust Line */}
            <div className="flex items-center gap-6 pt-2 text-sm">
              <div>
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-gray-600">
                <span className="font-bold text-gray-900">4.9/5</span> rating
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-gray-600">
                <span className="font-bold text-gray-900">10,000+</span> students
              </div>
            </div>
          </div>

          {/* Right Column - Visual Dashboard Style */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main Content Area - Large Video Card */}
            <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>

              <div className="relative h-full flex flex-col items-center justify-center p-8">
                <button className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-2xl mb-6 group">
                  <Play className="h-12 w-12 text-blue-600 ml-2 group-hover:text-orange-500 transition-colors" />
                </button>
                <h3 className="text-white text-2xl font-bold mb-2">Featured Course</h3>
                <p className="text-blue-200 text-center">
                  Advanced Techniques with Coach Williams
                </p>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
            </div>

            {/* Bottom Row - Three Small Cards */}
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-3">
              {/* Card 1 - Students */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-1">10k+</div>
                <div className="text-xs text-gray-600 font-medium">Students</div>
                <div className="text-xs text-gray-500 mt-1">Active now</div>
              </div>

              {/* Card 2 - Courses */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-5 text-white hover:shadow-2xl transition-shadow">
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-xs text-orange-100 font-medium">Courses</div>
                <div className="text-xs text-orange-200 mt-1">All levels</div>
              </div>

              {/* Card 3 - Rating */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="text-3xl font-bold text-green-600 mb-1">4.9</div>
                <div className="text-xs text-gray-600 font-medium">Rating</div>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-xs">★★★★★</span>
                </div>
              </div>
            </div>

            {/* Floating Badge - Top Left */}
            <div className="absolute top-[58%] left-0 bg-green-500 text-white rounded-xl shadow-xl px-4 py-2 font-bold text-sm transform -rotate-3 hover:rotate-0 transition-transform">
              98% Success Rate
            </div>

            {/* Floating Badge - Right */}
            <div className="absolute top-[62%] -right-4 bg-white rounded-xl shadow-xl p-4 border-2 border-orange-200 transform rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="font-bold text-sm text-gray-900">Certified</div>
                  <div className="text-xs text-gray-600">Get your badge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
