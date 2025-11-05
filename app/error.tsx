'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          {error.message && (
            <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-3 rounded">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full" size="lg">
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => (window.location.href = '/')}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
