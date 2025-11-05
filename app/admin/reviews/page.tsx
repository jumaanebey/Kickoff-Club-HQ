import { createServerClient } from '@/lib/db/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Reviews - Admin',
  description: 'Monitor and moderate course reviews'
}

export default async function AdminReviewsPage() {
  const supabase = await createServerClient()

  // Get all reviews with course and user info
  const { data: reviews } = await supabase
    .from('course_reviews')
    .select(`
      *,
      profiles (name, email),
      courses (title, slug)
    `)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalReviews = reviews?.length || 0
  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0
  const fiveStarCount = reviews?.filter(r => r.rating === 5).length || 0
  const withComments = reviews?.filter(r => r.comment).length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Reviews</h1>
        <p className="text-gray-600">Monitor and moderate course reviews</p>
      </div>

      {/* Review Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reviews</CardDescription>
            <CardTitle className="text-3xl">{totalReviews}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-3xl">{averageRating} ⭐</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>5-Star Reviews</CardDescription>
            <CardTitle className="text-3xl">{fiveStarCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>With Comments</CardDescription>
            <CardTitle className="text-3xl">{withComments}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>Recent course reviews from students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold">
                          {review.profiles?.name || review.profiles?.email}
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < review.rating ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        reviewed{' '}
                        <Link
                          href={`/courses/${review.courses?.slug}`}
                          className="text-primary-600 hover:underline"
                        >
                          {review.courses?.title}
                        </Link>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  {review.comment && (
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      "{review.comment}"
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">⭐</div>
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews?.filter(r => r.rating === stars).length || 0
              const percentage = reviews?.length ? (count / reviews.length) * 100 : 0
              return (
                <div key={stars} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{stars} stars</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
