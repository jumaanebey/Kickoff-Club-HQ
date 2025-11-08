'use client'

import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import { HeroDesign7 } from '@/components/hero/hero-design-7'

export default function LandingPage() {
  const { colors } = useTheme()

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <OrganizationStructuredData />
      <WebsiteStructuredData />

      {/* Hero Section - Design 7 */}
      <HeroDesign7 />

      {/* Social Proof Section - Dark */}
      <section className={cn('py-20', colors.bg, 'border-t', colors.cardBorder)}>
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: '50+', label: 'Expert Courses' },
              { number: '10k+', label: 'Active Students' },
              { number: '4.9', label: 'Average Rating' },
              { number: '100+', label: 'Pro Coaches' }
            ].map((stat, i) => (
              <div key={i} className={cn('text-center p-6 rounded-2xl border transition-all', colors.card, colors.cardHover)}>
                <div className={cn('text-4xl md:text-5xl font-black mb-2', colors.text)}>{stat.number}</div>
                <div className={cn('text-sm md:text-base uppercase tracking-wider', colors.textMuted)}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dark */}
      <section className={cn('py-24 lg:py-32', colors.bg, 'border-t', colors.cardBorder)}>
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight', colors.text)}>
              Trusted by Players at Every Level
            </h2>
            <p className={cn('text-lg md:text-xl max-w-3xl mx-auto leading-relaxed', colors.textMuted)}>
              See what our community is saying about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Marcus Johnson', role: 'High School QB', initials: 'MJ', color: 'from-blue-500 to-blue-600', quote: 'Kickoff Club HQ transformed my understanding of football. The video breakdowns are incredibly detailed and the coaches explain everything in a way that just clicks.' },
              { name: 'Sarah Rodriguez', role: 'Youth Coach', initials: 'SR', color: 'from-green-500 to-green-600', quote: 'As a coach, I use these courses to supplement my training program. The progression system is excellent and my players love the interactive content.' },
              { name: 'Taylor Kim', role: 'New Fan', initials: 'TK', color: 'from-purple-500 to-purple-600', quote: 'I went from knowing nothing about football to understanding complex plays and strategies. This platform is a game-changer for beginners!' }
            ].map((testimonial, i) => (
              <div key={i} className={cn('p-8 rounded-2xl border transition-all', colors.card, colors.cardHover)}>
                <div className="flex mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-400 text-xl">★</span>
                  ))}
                </div>
                <p className={cn('mb-6 text-base leading-relaxed', colors.textSecondary)}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className={cn('font-semibold', colors.text)}>{testimonial.name}</div>
                    <div className={cn('text-sm', colors.textMuted)}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Dark */}
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

      {/* Pricing Section - Dark */}
      <section className={cn('py-24 lg:py-32', colors.bg, 'border-t', colors.cardBorder)}>
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className={cn('text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight', colors.text)}>
              Choose Your Plan
            </h2>
            <p className={cn('text-lg md:text-xl leading-relaxed', colors.textMuted)}>
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className={cn('p-8 rounded-2xl border transition-all', colors.card, colors.cardHover)}>
              <div className="mb-8">
                <h3 className={cn('text-2xl font-bold mb-4', colors.text)}>Free</h3>
                <div>
                  <span className={cn('text-5xl font-black', colors.text)}>$0</span>
                  <span className={cn('', colors.textMuted)}>/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['5+ beginner courses', 'Progress tracking', 'Community forum access', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className={cn('', colors.textSecondary)}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className={cn('w-full h-12 text-base border-2', colors.cardBorder, colors.text, colors.cardHover)} asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>

            {/* Basic Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border-2 border-orange-500/50 relative hover:from-orange-500/30 hover:to-orange-600/30 transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 border-0">
                Most Popular
              </Badge>
              <div className="mb-8">
                <h3 className={cn('text-2xl font-bold mb-4', colors.text)}>Basic</h3>
                <div>
                  <span className={cn('text-5xl font-black', colors.text)}>$19</span>
                  <span className={cn('', colors.textMuted)}>/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Free', '25+ intermediate courses', 'Priority email support', 'Downloadable drills & playbooks', 'Course certificates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className={cn('', colors.textSecondary)}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_30px_rgba(251,146,60,0.3)]" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>

            {/* Premium Tier */}
            <div className={cn('p-8 rounded-2xl border transition-all', colors.card, colors.cardHover)}>
              <div className="mb-8">
                <h3 className={cn('text-2xl font-bold mb-4', colors.text)}>Premium</h3>
                <div>
                  <span className={cn('text-5xl font-black', colors.text)}>$49</span>
                  <span className={cn('', colors.textMuted)}>/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Basic', '50+ advanced courses', 'Monthly 1-on-1 coaching call', 'Exclusive masterclasses', 'Early access to new content'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className={cn('', colors.textSecondary)}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className={cn('w-full h-12 text-base border-2', colors.cardBorder, colors.text, colors.cardHover)} asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Dark */}
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

      {/* Footer - Dark */}
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
