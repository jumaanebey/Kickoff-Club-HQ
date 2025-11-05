import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata = {
  title: 'Football Training Blog | Kickoff Club HQ',
  description: 'Expert football training tips, strategies, and insights for players at every level',
}

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Football Training Blog
            </h1>
            <p className="text-xl text-blue-100">
              Expert insights, training tips, and strategies to elevate your game
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b py-6">
        <div className="container px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-6xl"><È</span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Football Training Tips
            </h2>
            <p className="text-blue-100 mb-6">
              Get the latest training insights, strategies, and course updates delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
