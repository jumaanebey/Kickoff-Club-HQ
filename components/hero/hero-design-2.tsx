import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, CheckCircle } from 'lucide-react'

export function HeroDesign2() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow Text */}
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-primary-600"></div>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                Football Training Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Elevate Your
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 bg-clip-text text-transparent">
                Football IQ
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Access 50+ courses from championship coaches. Master fundamentals,
              advanced techniques, and game strategy—all at your own pace.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                'HD video lessons with multiple camera angles',
                'Progress tracking and performance analytics',
                'Certificate of completion for every course',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base border-2 group"
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4 text-sm">
              <div>
                <div className="font-bold text-2xl text-gray-900">10k+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="font-bold text-2xl text-gray-900">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="font-bold text-2xl text-gray-900">50+</div>
                <div className="text-gray-600">Expert Courses</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:h-[600px] h-[400px]">
            {/* Main Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="h-12 w-12" />
                  </div>
                  <p className="text-lg font-semibold">Course Preview</p>
                  <p className="text-sm text-primary-100 mt-2">Click to watch demo</p>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">98% Success Rate</div>
                  <div className="text-sm text-gray-600">Course Completion</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-orange-500 text-white rounded-2xl shadow-xl p-6">
              <div className="text-3xl font-bold">72 hrs</div>
              <div className="text-sm text-orange-100">Training Content</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
