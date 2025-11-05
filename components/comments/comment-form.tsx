'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createComment } from '@/app/actions/comments'

interface CommentFormProps {
  lessonId: string
  parentId?: string | null
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({ lessonId, parentId = null, onCancel, placeholder }: CommentFormProps) {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      setError('Please enter a comment')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('lessonId', lessonId)
    formData.append('comment', comment.trim())
    if (parentId) {
      formData.append('parentId', parentId)
    }

    const result = await createComment(formData)

    if (!result.success) {
      setError(result.error || 'Failed to post comment')
      setLoading(false)
      return
    }

    setComment('')
    setLoading(false)
    router.refresh()

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder || 'Share your thoughts...'}
        rows={parentId ? 3 : 4}
        disabled={loading}
        maxLength={2000}
        className="resize-none"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {comment.length}/2000 characters
        </p>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading || !comment.trim()}>
            {loading ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </form>
  )
}
