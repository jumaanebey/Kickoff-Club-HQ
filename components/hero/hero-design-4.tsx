import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Star, BookOpen, Video, Trophy } from 'lucide-react'

export function HeroDesign4() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="container px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Badge with Stats */}
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-4 py-2 text-sm font-semibold">
              🏆 Trusted by 10,000+ Players Worldwide
            </Badge>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Transform Your
              <br />
              <span className="relative inline-block mt-2">
                <span className="text-orange-500">Game Today</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 5 150 2 298 8"
                    stroke="#FF8C00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Join the premier online football academy. Learn from championship coaches
              through comprehensive video courses designed to take your skills to the next level.
            </p>

            {/* Quick Stats Inline */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">72+ hours content</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">50+ expert courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">100+ pro coaches</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/auth/sign-up">
                  Get Started Free →
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✓ Free forever plan  •  ✓ No credit card required  •  ✓ Cancel anytime
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">4.9/5</span> from 2,500+ reviews
              </span>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-[500px] lg:h-[650px]">
            {/* Main Content Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl shadow-2xl overflow-hidden">
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <Play className="h-12 w-12 ml-1" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Watch How It Works</h3>
                <p className="text-blue-100 text-center max-w-xs">
                  See how our platform transforms players at every level
                </p>
              </div>
            </div>

            {/* Floating Card 1 - Top Right */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">10k+</div>
                  <div className="text-xs text-gray-600">Active Students</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Bottom Left */}
            <div className="absolute -bottom-4 -left-4 bg-orange-500 text-white rounded-2xl shadow-2xl p-5 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 fill-white" />
                </div>
                <div>
                  <div className="font-bold text-2xl">4.9/5</div>
                  <div className="text-xs text-orange-100">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Floating Card 3 - Middle Left */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-green-500 text-white rounded-xl shadow-2xl p-4">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-xs text-green-100">Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  )
}
