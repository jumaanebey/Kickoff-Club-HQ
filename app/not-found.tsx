import Link from 'next/link'
import { ThemedHeader } from '@/components/layout/themed-header'
import { ArrowRight, Home, BookOpen, Gamepad2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader />

      <main className="pt-[140px] pb-20">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Display */}
            <div className="relative inline-block mb-8">
              <div className="text-[12rem] md:text-[16rem] font-heading text-gray-900/10 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl">🏈</span>
              </div>
            </div>

            {/* Message */}
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4">
              Incomplete Pass
            </span>
            <h1 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-gray-900">
              Page Not <span className="text-orange-500">Found</span>
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              Looks like this play went out of bounds. The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <Link href="/" className="group">
                <div className="relative bg-white border-2 border-gray-900 p-6 hover:-translate-y-1 transition-all">
                  <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
                  <Home className="w-8 h-8 text-gray-900 mb-3 mx-auto" />
                  <div className="font-heading text-lg uppercase text-gray-900">Home</div>
                </div>
              </Link>

              <Link href="/courses" className="group">
                <div className="relative bg-white border-2 border-gray-900 p-6 hover:-translate-y-1 transition-all">
                  <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
                  <BookOpen className="w-8 h-8 text-gray-900 mb-3 mx-auto" />
                  <div className="font-heading text-lg uppercase text-gray-900">Courses</div>
                </div>
              </Link>

              <Link href="/games" className="group">
                <div className="relative bg-white border-2 border-gray-900 p-6 hover:-translate-y-1 transition-all">
                  <div className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-gray-900 -z-10 group-hover:top-2 group-hover:left-2 transition-all" />
                  <Gamepad2 className="w-8 h-8 text-gray-900 mb-3 mx-auto" />
                  <div className="font-heading text-lg uppercase text-gray-900">Games</div>
                </div>
              </Link>
            </div>

            {/* Back Home Button */}
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors"
            >
              Back to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
