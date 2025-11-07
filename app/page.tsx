import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import { HeroDesign7 } from '@/components/hero/hero-design-7'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <OrganizationStructuredData />
      <WebsiteStructuredData />

      {/* Hero Section - Design 7 */}
      <HeroDesign7 />

      {/* Social Proof Section - Dark */}
      <section className="py-20 bg-[#0A0A0A] border-t border-white/10">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: '50+', label: 'Expert Courses' },
              { number: '10k+', label: 'Active Students' },
              { number: '4.9', label: 'Average Rating' },
              { number: '100+', label: 'Pro Coaches' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-white/60 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dark */}
      <section className="py-24 lg:py-32 bg-[#0A0A0A] border-t border-white/10">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Trusted by Players at Every Level
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              See what our community is saying about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Marcus Johnson', role: 'High School QB', initials: 'MJ', color: 'from-blue-500 to-blue-600', quote: 'Kickoff Club HQ transformed my understanding of football. The video breakdowns are incredibly detailed and the coaches explain everything in a way that just clicks.' },
              { name: 'Sarah Rodriguez', role: 'Youth Coach', initials: 'SR', color: 'from-green-500 to-green-600', quote: 'As a coach, I use these courses to supplement my training program. The progression system is excellent and my players love the interactive content.' },
              { name: 'Taylor Kim', role: 'New Fan', initials: 'TK', color: 'from-purple-500 to-purple-600', quote: 'I went from knowing nothing about football to understanding complex plays and strategies. This platform is a game-changer for beginners!' }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/80 mb-6 text-base leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Dark */}
      <section className="py-24 lg:py-32 bg-[#0A0A0A] border-t border-white/10">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Everything You Need to Excel
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
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
              <div key={i} className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Dark */}
      <section className="py-24 lg:py-32 bg-[#0A0A0A] border-t border-white/10">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
                <div>
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['5+ beginner courses', 'Progress tracking', 'Community forum access', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-12 text-base border-2 border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>

            {/* Basic Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border-2 border-orange-500/50 relative hover:from-orange-500/30 hover:to-orange-600/30 transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 border-0">
                Most Popular
              </Badge>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Basic</h3>
                <div>
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Free', '25+ intermediate courses', 'Priority email support', 'Downloadable drills & playbooks', 'Course certificates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_30px_rgba(251,146,60,0.3)]" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
                <div>
                  <span className="text-5xl font-black text-white">$49</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Basic', '50+ advanced courses', 'Monthly 1-on-1 coaching call', 'Exclusive masterclasses', 'Early access to new content'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full h-12 text-base border-2 border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Dark */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t border-white/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to Level Up Your Game?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of players who are already improving their skills with Kickoff Club HQ. Start learning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                <Link href="/auth/sign-up">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 border-2 border-white/20 text-white hover:bg-white/10">
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/50">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="py-12 bg-[#0A0A0A] border-t border-white/10 text-white/60">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-white text-xl font-bold mb-4">Kickoff Club HQ</div>
              <p className="text-sm text-white/50">
                The ultimate platform for football training and education.
              </p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Platform</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link href="/podcast" className="hover:text-white transition-colors">Podcast</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/auth/sign-in" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Support</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
            <p>&copy; 2025 Kickoff Club HQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
