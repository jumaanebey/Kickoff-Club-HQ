'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

// Sample blog posts - in production, these would come from a CMS or database
const blogPosts = [
  {
    slug: 'understanding-football-basics',
    title: 'Understanding Football Basics: A Beginner\'s Guide',
    excerpt: 'New to football? Learn the fundamental rules, positions, and strategies that every fan should know.',
    category: 'Beginners',
    author: 'Coach Marcus Williams',
    date: '2025-01-15',
    readTime: '8 min read',
    image: '/blog/football-basics.jpg',
  },
  {
    slug: 'quarterback-fundamentals',
    title: 'Quarterback Fundamentals: Master the Most Important Position',
    excerpt: 'Dive deep into quarterback mechanics, footwork, and decision-making skills that separate good from great.',
    category: 'Position Training',
    author: 'Coach Sarah Johnson',
    date: '2025-01-12',
    readTime: '10 min read',
    image: '/blog/qb-fundamentals.jpg',
  },
  {
    slug: 'defensive-strategies-101',
    title: 'Defensive Strategies 101: Reading Offensive Formations',
    excerpt: 'Learn how to identify and counter common offensive formations with smart defensive positioning.',
    category: 'Strategy',
    author: 'Coach David Rodriguez',
    date: '2025-01-10',
    readTime: '12 min read',
    image: '/blog/defense-strategies.jpg',
  },
  {
    slug: 'speed-training-for-football',
    title: 'Speed Training for Football: Explosive Power Development',
    excerpt: 'Proven exercises and drills to increase your 40-yard dash time and on-field explosiveness.',
    category: 'Training',
    author: 'Coach Michael Chen',
    date: '2025-01-08',
    readTime: '7 min read',
    image: '/blog/speed-training.jpg',
  },
  {
    slug: 'route-running-techniques',
    title: 'Route Running Techniques: Creating Separation from Defenders',
    excerpt: 'Master the art of route running with tips on footwork, timing, and reading defensive coverage.',
    category: 'Position Training',
    author: 'Coach Lisa Martinez',
    date: '2025-01-05',
    readTime: '9 min read',
    image: '/blog/route-running.jpg',
  },
  {
    slug: 'film-study-guide',
    title: 'Film Study Guide: How to Break Down Game Tape Like a Pro',
    excerpt: 'Learn what to look for when studying game film to improve your football IQ and decision-making.',
    category: 'Strategy',
    author: 'Coach Marcus Williams',
    date: '2025-01-03',
    readTime: '11 min read',
    image: '/blog/film-study.jpg',
  },
]

const categories = ['All', 'Beginners', 'Position Training', 'Strategy', 'Training']

export default function BlogPage() {
  const { colors } = useTheme()

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      {/* Navigation Header */}
      <ThemedHeader />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-b border-white/10 text-white py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Football Training Blog
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Expert insights, training tips, and strategies to elevate your game
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={cn('border-b border-white/10 py-6', colors.bg)}>
        <div className="container px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                className={category === 'All' ? 'bg-orange-500 border-0 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={cn('py-12', colors.bg)}>
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-lg overflow-hidden flex items-center justify-center">
                    <span className="text-white text-6xl">🏈</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/10 border-white/20 text-white">{post.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-white hover:text-orange-400 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-white/60">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border-t border-white/10 text-white">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with Football Training Tips
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Get the latest training insights, strategies, and course updates delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/50 flex-1 max-w-md"
              />
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-[0_0_30px_rgba(251,146,60,0.3)] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
