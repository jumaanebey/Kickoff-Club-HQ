'use client'

import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedCoursesSection } from "@/components/sections/featured-courses-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function HomePageClient() {
  const { colors } = useTheme()

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      {/* New Hero Section */}
      <HeroSection />

      {/* New Featured Courses Section */}
      <FeaturedCoursesSection />

      {/* Features Section */}
      <section className={cn('py-24 lg:py-32', colors.bg, 'border-t', colors.cardBorder)}>
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight', colors.text)}>
              Everything You Need to Excel
            </h2>
            <p className={cn('text-lg md:text-xl max-w-3xl mx-auto leading-relaxed', colors.textMuted)}>
              Comprehensive training tools and resources to take your football skills to the next level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: '🎥', title: 'HD Video Lessons', desc: 'Crystal-clear instructional videos with multiple camera angles and slow-motion breakdowns' },
              { icon: '👨‍🏫', title: 'Expert Coaches', desc: 'Learn from championship coaches with decades of experience at all levels of football' },
              { icon: '📊', title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking and completion certificates' },
              { icon: '🏈', title: 'Position-Specific', desc: 'Specialized training for every position - QB, WR, RB, OL, Defense, and Special Teams' },
              { icon: '🏆', title: 'Earn Certificates', desc: 'Receive official certificates of completion to showcase your skills and dedication' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'Access courses on any device - desktop, tablet, or mobile. Learn at your own pace.' }
            ].map((feature, i) => (
              <div key={i} className={cn('p-8 rounded-2xl border transition-all', colors.card, colors.cardHover)}>
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className={cn('text-xl font-bold mb-3', colors.text)}>{feature.title}</h3>
                <p className={cn('leading-relaxed', colors.textMuted)}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <TestimonialsSection />

      {/* New Pricing Section */}
      <PricingSection />

      {/* Final CTA Section */}
      <section className={cn('py-24 lg:py-32 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t', colors.cardBorder)}>
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight', colors.text)}>
              Ready to Level Up Your Game?
            </h2>
            <p className={cn('text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed', colors.textSecondary)}>
              Join thousands of players who are already improving their skills with Kickoff Club HQ. Start learning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                <Link href="/auth/sign-up">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className={cn('text-lg h-14 px-8 border-2', colors.cardBorder, colors.text, colors.cardHover)}>
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
            <p className={cn('mt-8 text-sm', colors.textMuted)}>
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn('py-12', colors.bg, 'border-t', colors.cardBorder, colors.textMuted)}>
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className={cn('text-xl font-bold mb-4', colors.text)}>Kickoff Club HQ</div>
              <p className={cn('text-sm', colors.textMuted)}>
                The ultimate platform for football training and education.
              </p>
            </div>
            <div>
              <div className={cn('font-semibold mb-4', colors.text)}>Platform</div>
              <ul className={cn('space-y-2 text-sm')}>
                <li><Link href="/courses" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Courses</Link></li>
                <li><Link href="/podcast" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Podcast</Link></li>
                <li><Link href="/blog" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Blog</Link></li>
                <li><Link href="/auth/sign-in" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Sign In</Link></li>
                <li><Link href="/auth/sign-up" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <div className={cn('font-semibold mb-4', colors.text)}>Support</div>
              <ul className={cn('space-y-2 text-sm')}>
                <li><a href="#" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Help Center</a></li>
                <li><a href="#" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Contact Us</a></li>
                <li><a href="#" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className={cn('font-semibold mb-4', colors.text)}>Legal</div>
              <ul className={cn('space-y-2 text-sm')}>
                <li><Link href="/legal/privacy" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Terms of Service</Link></li>
                <li><Link href="/legal/refund" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Refund Policy</Link></li>
                <li><Link href="/legal/cookies" className={cn('transition-colors', colors.textMuted, 'hover:text-white')}>Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className={cn('border-t mt-8 pt-8 text-center text-sm', colors.cardBorder, colors.textMuted)}>
            <p>&copy; 2025 Kickoff Club HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
