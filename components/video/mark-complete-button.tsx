'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { markComplete } from '@/app/actions/progress'

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
