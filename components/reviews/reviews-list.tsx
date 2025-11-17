import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: {
    name: string | null
    email: string
    avatar_url: string | null
  }
}

interface ReviewsListProps {
  reviews: Review[]
}

export const ReviewsList = memo(function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this course!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.profiles.avatar_url ? (
                  <img
                    src={review.profiles.avatar_url}
                    alt={review.profiles.name || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {(review.profiles.name || review.profiles.email)[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {review.profiles.name || review.profiles.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
