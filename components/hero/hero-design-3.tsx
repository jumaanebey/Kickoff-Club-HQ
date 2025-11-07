import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, TrendingUp, Users, Award } from 'lucide-react'

export function HeroDesign3() {
  return (
    <section className="relative min-h-screen bg-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white"></div>

      <div className="container relative px-4 py-16">
        {/* Main Hero Content */}
        <div className="max-w-6xl mx-auto">
          {/* Top Section - Headline and Description */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Complete
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Football Academy</span>
                <div className="absolute bottom-2 left-0 right-0 h-4 bg-orange-300 -rotate-1"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Video courses, expert coaching, and proven training methods—all in one platform designed to transform your game.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base border-2"
              >
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✓ No credit card required  •  ✓ Access 5+ courses free forever
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 - Video Library */}
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">50+ Video Courses</h3>
                <p className="text-gray-600 mb-4">
                  HD lessons covering fundamentals, advanced techniques, and game strategy
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">72 hours</span>
                  <span>of content</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Expert Coaches */}
            <Card className="border-2 hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Championship Coaches</h3>
                <p className="text-gray-600 mb-4">
                  Learn directly from coaches with proven track records at every level
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-orange-600">100+ coaches</span>
                  <span>worldwide</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Community */}
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Active Community</h3>
                <p className="text-gray-600 mb-4">
                  Join thousands of players sharing progress and supporting each other
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-green-600">10,000+</span>
                  <span>active students</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Preview Section */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
              <div className="text-center">
                <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors mb-4 mx-auto group">
                  <Play className="h-10 w-10 text-primary-600 ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <p className="text-white text-lg font-semibold">Watch Platform Overview</p>
                <p className="text-primary-200 text-sm mt-2">See how Kickoff Club HQ works (2:30)</p>
              </div>
            </div>

            {/* Floating metrics */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-bold text-gray-900">98%</div>
                    <div className="text-xs text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <div>
                    <div className="font-bold text-gray-900">4.9/5</div>
                    <div className="text-xs text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-bold text-gray-900">10k+</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
