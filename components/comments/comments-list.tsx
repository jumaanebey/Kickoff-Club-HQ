'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CommentForm } from './comment-form'
import { deleteComment } from '@/app/actions/comments'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  comment: string
  created_at: string
  updated_at: string
  user_id: string
  profiles: {
    name: string | null
    email: string
    avatar_url: string | null
  }
  replies?: Comment[]
}

interface CommentsListProps {
  comments: Comment[]
  currentUserId?: string
  lessonId: string
}

function CommentItem({
  comment,
  currentUserId,
  lessonId,
  isReply = false
}: {
  comment: Comment
  currentUserId?: string
  lessonId: string
  isReply?: boolean
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const isOwner = currentUserId === comment.user_id
  const displayName = comment.profiles.name || comment.profiles.email

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setDeleting(true)
    const result = await deleteComment(comment.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
      setDeleting(false)
    }
  }

  return (
    <div className={isReply ? 'ml-8' : ''}>
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.profiles.avatar_url ? (
                <img
                  src={comment.profiles.avatar_url}
                  alt={displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {displayName[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{displayName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
                {comment.updated_at !== comment.created_at && (
                  <span className="text-xs text-gray-500">(edited)</span>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                {comment.comment}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-xs h-7"
                  >
                    Reply
                  </Button>
                )}
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 pl-13">
              <CommentForm
                lessonId={lessonId}
                parentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              lessonId={lessonId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentsList({ comments, currentUserId, lessonId }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          lessonId={lessonId}
        />
      ))}
    </div>
  )
}
