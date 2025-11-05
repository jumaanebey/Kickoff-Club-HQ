import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-500">Kickoff Club HQ</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/signin" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary-100 px-3 py-1 text-sm text-primary-700">
                  Love the vibe. Learn the game.
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Master Football
                  <span className="text-primary-500"> Fundamentals</span>
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Professional coaching made accessible. Learn football through structured video courses, progress tracking, and expert guidance.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl bg-primary-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏈</div>
                  <p className="text-lg font-semibold text-primary-700">Video Preview Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white border-y">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">127+</div>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">68%</div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">91%</div>
                <p className="text-sm text-gray-600">Would Recommend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to Master Football
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From complete beginner to confident player. Our platform has everything you need.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🎯</div>
                <CardTitle>Structured Curriculum</CardTitle>
                <CardDescription>
                  Position-specific courses designed by expert coaches
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🎥</div>
                <CardTitle>HD Video Lessons</CardTitle>
                <CardDescription>
                  Professional quality videos with clear demonstrations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">📊</div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">📱</div>
                <CardTitle>Learn Anywhere</CardTitle>
                <CardDescription>
                  Mobile-friendly platform works on any device
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🎓</div>
                <CardTitle>Expert Coaching</CardTitle>
                <CardDescription>
                  Learn from coaches with years of experience
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🏆</div>
                <CardTitle>Achievement System</CardTitle>
                <CardDescription>
                  Earn badges and certificates as you progress
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Choose the plan that&apos;s right for you. All plans include a 14-day free trial.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
            {/* Free Trial */}
            <Card>
              <CardHeader>
                <CardTitle>Free Trial</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600"> / 14 days</span>
                </div>
                <CardDescription className="mt-4">
                  Perfect for trying out the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 3 free courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Basic progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Community access
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Basic */}
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-gray-600"> / month</span>
                </div>
                <CardDescription className="mt-4">
                  For serious learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> All beginner courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Full progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Downloadable resources
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Email support
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-primary-500 border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$39.99</span>
                  <span className="text-gray-600"> / month</span>
                </div>
                <CardDescription className="mt-4">
                  For dedicated athletes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> All courses (beginner to advanced)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> New courses monthly
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 1-on-1 coaching sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Exclusive webinars
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Master Football?
              </h2>
              <p className="max-w-[600px] text-primary-100 md:text-xl">
                Join 127+ athletes already improving their game. Start your free 14-day trial today.
              </p>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/courses">Courses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Social</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; 2025 Kickoff Club HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
