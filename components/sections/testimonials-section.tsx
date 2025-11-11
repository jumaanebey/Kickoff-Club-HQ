'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/shared/utils"

interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  avatar: string
  content: string
  rating: 5
  metric?: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    role: "Starting QB",
    location: "Lincoln High School, Illinois",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    content: "Kickoff Club HQ transformed my understanding of football. After just 3 weeks, my completion percentage went from 55% to 72%. Coach Mike's QB course is incredible—the pre-snap read breakdowns alone changed my entire game.",
    rating: 5,
    metric: "55% → 72% completion",
    verified: true
  },
  {
    id: "2",
    name: "Sarah Rodriguez",
    role: "Head Coach",
    location: "Valley Youth Football, California",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    content: "As a coach, I use these courses to supplement my training program. My receivers cut their route running times by 0.8 seconds on average after the WR course. Parents love the progress tracking, and I love seeing real improvement in my players.",
    rating: 5,
    metric: "0.8s faster routes",
    verified: true
  },
  {
    id: "3",
    name: "Taylor Kim",
    role: "New Player",
    location: "East Side Raiders, New York",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    content: "I went from knowing nothing about football to understanding complex plays and strategies. Passed my team's playbook test with a 94% after just 4 weeks. This platform is incredible for beginners—everything is explained so clearly.",
    rating: 5,
    metric: "94% playbook test",
    verified: true
  },
  {
    id: "4",
    name: "Jamal Washington",
    role: "Linebacker",
    location: "Riverside High School, Texas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    content: "The defensive fundamentals course helped me make varsity as a sophomore. My tackling technique improved so much that I went from 3rd string to starting linebacker in one season. Coach Thompson breaks everything down perfectly.",
    rating: 5,
    metric: "3rd string → Starter",
    verified: true
  },
  {
    id: "5",
    name: "David Chen",
    role: "Wide Receiver",
    location: "West Valley High, Arizona",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    content: "The route running course is pure gold. I'm getting open on nearly every play now. My coach even asked me what I've been doing differently. The slow-motion breakdowns and multiple camera angles make everything so easy to understand.",
    rating: 5,
    metric: "Improved separation",
    verified: true
  },
  {
    id: "6",
    name: "Coach Mike Stevens",
    role: "Offensive Coordinator",
    location: "Central High School, Georgia",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    content: "I recommend Kickoff Club HQ to all my players. The quality of instruction rivals what we taught at the college level. My entire offense uses these courses during the off-season, and it shows when we hit the field in August.",
    rating: 5,
    verified: true
  }
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { colors } = useTheme()

  return (
    <Card className={cn(
      "h-full hover:shadow-lg transition-all duration-300 border",
      colors.bgSecondary,
      colors.cardBorder
    )}>
      <CardContent className="p-6">
        {/* Quote Icon */}
        <Quote className="w-10 h-10 text-orange-500/20 mb-4" />

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        {/* Testimonial Content */}
        <p className={cn("text-base leading-relaxed mb-6", colors.text)}>
          "{testimonial.content}"
        </p>

        {/* Metric Badge (if exists) */}
        {testimonial.metric && (
          <div className="mb-6">
            <div className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold">
              📊 {testimonial.metric}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn("font-semibold", colors.text)}>
                {testimonial.name}
              </p>
              {testimonial.verified && (
                <span className="text-orange-500" title="Verified Student">
                  ✓
                </span>
              )}
            </div>
            <p className={cn("text-sm", colors.textMuted)}>
              {testimonial.role}
            </p>
            <p className={cn("text-xs", colors.textMuted)}>
              {testimonial.location}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TestimonialsSection() {
  const { colors } = useTheme()

  return (
    <section className={cn("py-24", colors.bg)}>
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
            Trusted by Players at Every Level
          </h2>
          <p className={cn("text-xl", colors.textMuted)}>
            See what our community is saying about their experience training with
            championship coaches at Kickoff Club HQ
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={cn("mt-16 pt-12 border-t", colors.cardBorder)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">⭐ 4.9/5</div>
              <div className={cn("text-sm", colors.textMuted)}>Average Rating</div>
              <div className={cn("text-xs mt-1", colors.textMuted)}>from 250+ reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">10,000+</div>
              <div className={cn("text-sm", colors.textMuted)}>Athletes Training</div>
              <div className={cn("text-xs mt-1", colors.textMuted)}>worldwide</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">200+</div>
              <div className={cn("text-sm", colors.textMuted)}>High Schools</div>
              <div className={cn("text-xs mt-1", colors.textMuted)}>trust us</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
              <div className={cn("text-sm", colors.textMuted)}>Would Recommend</div>
              <div className={cn("text-xs mt-1", colors.textMuted)}>to a teammate</div>
            </div>
          </div>
        </div>

        {/* Social Proof Quote */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <p className={cn("text-lg italic", colors.textMuted)}>
            "The most comprehensive football training platform I've seen.
            My players are more prepared, more confident, and playing smarter football."
          </p>
          <p className={cn("text-sm font-semibold mt-3", colors.text)}>
            — Coach Robert Miller, 3x State Champion
          </p>
        </div>
      </div>
    </section>
  )
}
