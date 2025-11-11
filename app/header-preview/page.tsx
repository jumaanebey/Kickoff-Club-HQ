'use client'

import Link from 'next/link'
import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Moon, ArrowRight } from 'lucide-react'

export default function HeaderPreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Header Style</h1>
          <p className="text-muted-foreground">Click on any header to select it</p>
        </div>

        {/* Option 1: Minimal & Clean */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Option 1</div>
            <div className="text-sm text-muted-foreground">Minimal & Clean</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <header className="border-b backdrop-blur bg-background/95">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">🏈</span>
                  <span>KICKOFF CLUB</span>
                </Link>
                <div className="flex items-center gap-8">
                  <nav className="flex items-center gap-6">
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <Link href="/courses" className="hover:text-orange-500 transition-colors">Courses</Link>
                    <Link href="/podcast" className="hover:text-orange-500 transition-colors">Podcast</Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm">Sign In</Button>
                    <Button variant="ghost" size="icon">
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="p-8 text-center text-muted-foreground">
              <p>Cleaner, simpler - removed Blog link</p>
            </div>
          </div>
        </div>

        {/* Option 2: Bold Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Option 2</div>
            <div className="text-sm text-muted-foreground">Bold Branding</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <header className="border-b backdrop-blur bg-background/95">
              <div className="container flex h-20 items-center justify-between">
                <div>
                  <Link href="/" className="block">
                    <div className="text-2xl font-black tracking-tight">KICKOFF CLUB HQ</div>
                    <div className="text-xs text-muted-foreground">Football for Beginners</div>
                  </Link>
                </div>
                <div className="flex items-center gap-8">
                  <nav className="flex items-center gap-6 font-medium">
                    <Link href="/courses" className="hover:text-orange-500 transition-colors">COURSES</Link>
                    <Link href="/podcast" className="hover:text-orange-500 transition-colors">PODCAST</Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      START FREE <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="p-8 text-center text-muted-foreground">
              <p>Two-line logo with tagline, CTA button, all caps nav</p>
            </div>
          </div>
        </div>

        {/* Option 3: Icon-Based */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Option 3</div>
            <div className="text-sm text-muted-foreground">Icon-Based</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <header className="border-b backdrop-blur bg-background/95">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    K
                  </div>
                  <span className="text-xl font-bold">KICKOFF CLUB</span>
                </Link>
                <div className="flex items-center gap-8">
                  <nav className="flex items-center gap-6">
                    <Link href="/courses" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                      <span className="text-lg">🏈</span>
                      Courses
                    </Link>
                    <Link href="/podcast" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                      <span className="text-lg">🎙️</span>
                      Podcast
                    </Link>
                  </nav>
                  <div className="flex items-center gap-3">
                    <Link href="/auth/sign-in" className="hover:text-orange-500 transition-colors">Sign In</Link>
                    <Button variant="ghost" size="icon">
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="p-8 text-center text-muted-foreground">
              <p>Logo with icon circle, emoji icons next to nav items</p>
            </div>
          </div>
        </div>

        {/* Option 4: Centered Nav */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Option 4</div>
            <div className="text-sm text-muted-foreground">Centered Nav</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <header className="border-b backdrop-blur bg-background/95">
              <div className="container py-4">
                <nav className="flex items-center justify-center gap-8 text-sm mb-4">
                  <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/courses" className="hover:text-orange-500 transition-colors">Courses</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/podcast" className="hover:text-orange-500 transition-colors">Podcast</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/auth/sign-in" className="hover:text-orange-500 transition-colors">Sign In</Link>
                </nav>
                <div className="flex items-center justify-between">
                  <div className="flex-1"></div>
                  <Link href="/" className="text-2xl font-bold">KICKOFF CLUB HQ</Link>
                  <div className="flex-1 flex justify-end">
                    <Button variant="ghost" size="icon">
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="p-8 text-center text-muted-foreground">
              <p>Centered navigation above logo - unique minimal approach</p>
            </div>
          </div>
        </div>

        {/* Option 5: Split Layout */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Option 5</div>
            <div className="text-sm text-muted-foreground">Split Layout</div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-card">
            <header className="border-b backdrop-blur bg-background/95">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  KICKOFF CLUB
                </Link>
                <nav className="flex items-center gap-6">
                  <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                  <Link href="/courses" className="hover:text-orange-500 transition-colors">Courses</Link>
                  <Link href="/podcast" className="hover:text-orange-500 transition-colors">Podcast</Link>
                </nav>
                <div className="flex items-center gap-6">
                  <Link href="/pricing" className="hover:text-orange-500 transition-colors font-medium">Pricing</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/auth/sign-in" className="hover:text-orange-500 transition-colors">Sign In</Link>
                  <Button variant="ghost" size="icon">
                    <Moon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </header>
            <div className="p-8 text-center text-muted-foreground">
              <p>Split layout with Pricing link added, separated actions</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t">
          <p className="text-muted-foreground mb-4">Made your choice?</p>
          <p className="text-sm text-muted-foreground">Tell me which option number you prefer, or describe a custom combination</p>
        </div>
      </div>
    </div>
  )
}
