'use client'

import { useEffect } from 'react'

export default function BlitzRushPage() {
  useEffect(() => {
    // Hide any parent elements that might interfere
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <iframe
      src="/games/blitz-rush/index.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 99999,
      }}
      title="Blitz Rush"
      allow="fullscreen"
    />
  )
}
