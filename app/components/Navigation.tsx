'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - FIXED: No more "K" duplicate */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">
              Kickoff Club HQ
            </span>
          </Link>

          {/* Desktop Navigation - FIXED: Clean links, no emojis */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/podcast"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Podcast
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="hidden md:block">
            <Link
              href="/sign-in"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/podcast"
                className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Podcast
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/sign-in"
                className="mx-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
