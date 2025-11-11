'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { markComplete } from '@/app/actions/progress'
import confetti from 'canvas-confetti'

interface MarkCompleteButtonProps {
  lessonId: string
  userId?: string
  isCompleted?: boolean
  onComplete?: () => void
}

export function MarkCompleteButton({
  lessonId,
  userId,
  isCompleted = false,
  onComplete
}: MarkCompleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  const handleMarkComplete = async () => {
    setLoading(true)

    const formData = new FormData()
    formData.append('lessonId', lessonId)

    const result = await markComplete(formData)

    if (result.success) {
      setCompleted(true)

      // Trigger confetti if course is completed
      if (result.courseCompleted) {
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          })
        }, 250)
      }

      if (onComplete) {
        onComplete()
      }
    }

    setLoading(false)
  }

  if (completed) {
    return (
      <Button variant="secondary" disabled>
        ✓ Completed
      </Button>
    )
  }

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={loading}
      variant="secondary"
    >
      {loading ? 'Marking...' : 'Mark Complete'}
    </Button>
  )
}
