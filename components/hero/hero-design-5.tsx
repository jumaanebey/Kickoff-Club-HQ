import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, ChevronRight, Users, Clock, Target } from 'lucide-react'

export function HeroDesign5() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow with dot */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">
                Premium Football Training
              </span>
            </div>

            {/* Main Headline with gradient */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1]">
              Master the Game
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                From the Best
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Access world-class football training from championship coaches.
              HD video courses, personalized feedback, and a community of 10,000+ players
              improving their skills every day.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">10k+ Students</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-900">72+ Hours</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900">50+ Courses</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600 group"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Start Learning Free
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base border-2 hover:bg-gray-50"
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Join 10,000+ students</div>
                <div className="text-gray-600">Already learning with us</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-[600px]">
            {/* Main Visual Container */}
            <div className="relative h-full w-full">
              {/* Large Video Card */}
              <div className="absolute top-0 right-0 w-[85%] h-[70%] bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl group">
                    <Play className="h-10 w-10 text-blue-600 ml-1 group-hover:text-orange-500 transition-colors" />
                  </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  2:45
                </div>

                {/* Course Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Quarterback Fundamentals
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Coach Marcus Williams • 12 lessons
                  </p>
                </div>
              </div>

              {/* Small Card 1 - Stats */}
              <div className="absolute bottom-24 left-0 bg-white rounded-xl shadow-xl p-4 border border-gray-100 w-48">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    72
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Hours of</div>
                    <div className="font-bold text-gray-900">Content</div>
                  </div>
                </div>
              </div>

              {/* Small Card 2 - Rating */}
              <div className="absolute top-[65%] right-0 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-xl p-4 w-44">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-300">★</span>
                  ))}
                </div>
                <div className="font-bold text-2xl">4.9/5</div>
                <div className="text-xs text-green-100">From 2,500+ reviews</div>
              </div>

              {/* Small Card 3 - Students */}
              <div className="absolute bottom-0 right-8 bg-blue-600 text-white rounded-xl shadow-xl p-4 w-40">
                <div className="text-3xl font-bold mb-1">10k+</div>
                <div className="text-sm text-blue-100">Active Students</div>
              </div>

              {/* Decorative Circles */}
              <div className="absolute -top-8 left-12 w-32 h-32 bg-orange-300 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 right-0 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
