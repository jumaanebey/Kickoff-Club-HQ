'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createReview } from '@/app/actions/reviews'

interface ReviewFormProps {
  courseId: string
  hasCompleted: boolean
}

export function ReviewForm({ courseId, hasCompleted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasCompleted) {
      setError('You must complete the course before reviewing it')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('courseId', courseId)
    formData.append('rating', rating.toString())
    formData.append('comment', comment)

    const result = await createReview(formData)

    if (!result.success) {
      setError(result.error || 'Failed to submit review')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()

    setTimeout(() => {
      setSuccess(false)
      setRating(0)
      setComment('')
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-600">Review submitted successfully!</p>
        </div>
      )}

      {/* Star Rating */}
      <div className="space-y-2">
        <Label>Your Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              {(hoverRating || rating) >= star ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {rating === 0 ? 'Click to rate' : `${rating} star${rating > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Your Review (Optional)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this course..."
          rows={4}
          disabled={loading}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500">
          {comment.length}/1000 characters
        </p>
      </div>

      <Button type="submit" disabled={loading || !hasCompleted}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>

      {!hasCompleted && (
        <p className="text-sm text-gray-500">
          Complete the course to leave a review
        </p>
      )}
    </form>
  )
}
