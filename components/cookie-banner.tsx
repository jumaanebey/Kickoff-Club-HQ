'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted')
    if (!cookiesAccepted) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-200">
            <p>
              We use cookies to enhance your experience, analyze site traffic, and provide personalized content. By clicking "Accept", you consent to our use of cookies.{' '}
              <Link
                href="/legal/cookies"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptCookies}
              className="bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Accept Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
