import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              The Ultimate Football Learning Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Master Football with Expert Coaches
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn from the best. Train like a pro. Elevate your game with comprehensive video courses designed by championship coaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg">
                <Link href="/auth/sign-up">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Expert Courses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">10k+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive training tools and resources to take your football skills to the next level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <CardTitle>HD Video Lessons</CardTitle>
                <CardDescription>
                  Crystal-clear instructional videos with multiple camera angles and slow-motion breakdowns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <CardTitle>Expert Coaches</CardTitle>
                <CardDescription>
                  Learn from championship coaches with decades of experience at all levels of football
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed progress tracking and completion certificates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏈</span>
                </div>
                <CardTitle>Position-Specific</CardTitle>
                <CardDescription>
                  Specialized training for every position - QB, WR, RB, OL, Defense, and Special Teams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle>Earn Certificates</CardTitle>
                <CardDescription>
                  Receive official certificates of completion to showcase your skills and dedication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle>Learn Anywhere</CardTitle>
                <CardDescription>
                  Access courses on any device - desktop, tablet, or mobile. Learn at your own pace.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Access to free courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Community access</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Basic Tier */}
            <Card className="border-2 border-primary-500 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Access to Basic courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Downloadable resources</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>All Premium courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>1-on-1 coaching sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Exclusive content</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Players at Every Level
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Kickoff Club HQ transformed my understanding of football. The video breakdowns are incredibly detailed and the coaches explain everything in a way that just clicks."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    MJ
                  </div>
                  <div>
                    <div className="font-semibold">Marcus Johnson</div>
                    <div className="text-sm text-gray-600">High School QB</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "As a coach, I use these courses to supplement my training program. The progression system is excellent and my players love the interactive quizzes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    SR
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Rodriguez</div>
                    <div className="text-sm text-gray-600">Youth Coach</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I went from knowing nothing about football to understanding complex plays and strategies. This platform is a game-changer for beginners!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    TK
                  </div>
                  <div>
                    <div className="font-semibold">Taylor Kim</div>
                    <div className="text-sm text-gray-600">New Fan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Level Up Your Game?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of players who are already improving their skills with Kickoff Club HQ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link href="/auth/sign-up">Start Learning Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-white text-xl font-bold mb-4">Kickoff Club HQ</div>
              <p className="text-sm">
                The ultimate platform for football training and education.
              </p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Platform</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/podcast">Podcast</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/auth/sign-in">Sign In</Link></li>
                <li><Link href="/auth/sign-up">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Support</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/privacy">Privacy Policy</Link></li>
                <li><Link href="/legal/terms">Terms of Service</Link></li>
                <li><Link href="/legal/refund">Refund Policy</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Kickoff Club HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
