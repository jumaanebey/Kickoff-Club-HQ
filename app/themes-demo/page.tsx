import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Theme Demonstrations | Kickoff Club HQ',
  description: 'Preview all available color themes',
}

export default function ThemesDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4">Theme Demonstrations</h1>
          <p className="text-xl text-gray-600">Choose your preferred color palette</p>
        </div>

        <div className="space-y-16">
          {/* LIGHT THEME */}
          <section>
            <div className="bg-white rounded-xl border-4 border-orange-500 p-1">
              <div className="bg-white min-h-screen rounded-lg overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl">
                  <div className="container flex h-16 items-center justify-between">
                    <div className="text-2xl font-bold text-orange-600">Kickoff Club HQ</div>
                    <nav className="flex items-center gap-6 text-gray-700">
                      <span>Home</span>
                      <span>Courses</span>
                      <span>Podcast</span>
                      <Badge className="bg-orange-500 text-white">LIGHT THEME</Badge>
                    </nav>
                  </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gray-50 py-20">
                  <div className="container px-4">
                    <h2 className="text-5xl font-black text-gray-900 mb-4">Master Football</h2>
                    <p className="text-xl text-gray-700 mb-8">Learn from championship coaches</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Cards Section */}
                <div className="container px-4 py-12">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gray-100 text-gray-700 border-gray-300">
                          Beginner
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Course Title</h3>
                        <p className="text-gray-600">Learn the fundamentals of football training</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gray-100 text-gray-700 border-gray-300">
                          Intermediate
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Tactics</h3>
                        <p className="text-gray-600">Master complex game strategies</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gray-100 text-gray-700 border-gray-300">
                          Expert
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Training</h3>
                        <p className="text-gray-600">Train like a professional athlete</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DARK THEME */}
          <section>
            <div className="bg-[#0A0A0A] rounded-xl border-4 border-orange-500 p-1">
              <div className="bg-[#0A0A0A] min-h-screen rounded-lg overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
                  <div className="container flex h-16 items-center justify-between">
                    <div className="text-2xl font-bold text-white">Kickoff Club HQ</div>
                    <nav className="flex items-center gap-6 text-white/80">
                      <span>Home</span>
                      <span>Courses</span>
                      <span>Podcast</span>
                      <Badge className="bg-orange-500 text-white">DARK THEME</Badge>
                    </nav>
                  </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 py-20">
                  <div className="container px-4">
                    <h2 className="text-5xl font-black text-white mb-4">Master Football</h2>
                    <p className="text-xl text-white/70 mb-8">Learn from championship coaches</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Cards Section */}
                <div className="container px-4 py-12">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-white/10 border-white/20 text-white">
                          Beginner
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Course Title</h3>
                        <p className="text-white/70">Learn the fundamentals of football training</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-white/10 border-white/20 text-white">
                          Intermediate
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Advanced Tactics</h3>
                        <p className="text-white/70">Master complex game strategies</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-white/10 border-white/20 text-white">
                          Expert
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Pro Training</h3>
                        <p className="text-white/70">Train like a professional athlete</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GLAM THEME */}
          <section>
            <div className="bg-purple-950 rounded-xl border-4 border-pink-500 p-1">
              <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 min-h-screen rounded-lg overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-purple-950/80 backdrop-blur-xl">
                  <div className="container flex h-16 items-center justify-between">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      Kickoff Club HQ
                    </div>
                    <nav className="flex items-center gap-6 text-purple-100">
                      <span>Home</span>
                      <span>Courses</span>
                      <span>Podcast</span>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">GLAM THEME</Badge>
                    </nav>
                  </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 py-20">
                  <div className="container px-4">
                    <h2 className="text-5xl font-black text-white mb-4">Master Football</h2>
                    <p className="text-xl text-purple-100 mb-8">Learn from championship coaches</p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Cards Section */}
                <div className="container px-4 py-12">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-purple-500/20 hover:from-purple-900/30 hover:to-pink-900/30 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-purple-500/20 border-purple-500/30 text-purple-100">
                          Beginner
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Course Title</h3>
                        <p className="text-purple-200/60">Learn the fundamentals of football training</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-purple-500/20 hover:from-purple-900/30 hover:to-pink-900/30 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-purple-500/20 border-purple-500/30 text-purple-100">
                          Intermediate
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Advanced Tactics</h3>
                        <p className="text-purple-200/60">Master complex game strategies</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-purple-500/20 hover:from-purple-900/30 hover:to-pink-900/30 transition-all">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-purple-500/20 border-purple-500/30 text-purple-100">
                          Expert
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-2">Pro Training</h3>
                        <p className="text-purple-200/60">Train like a professional athlete</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
