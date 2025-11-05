import { Card, CardContent } from '@/components/ui/card'

export function CourseCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-0">
        {/* Thumbnail skeleton */}
        <div className="w-full h-48 bg-gray-200 rounded-t-lg" />

        <div className="p-6">
          {/* Badges skeleton */}
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>

          {/* Title skeleton */}
          <div className="h-7 bg-gray-200 rounded mb-2" />
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-4" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Meta info skeleton */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>

          {/* Button skeleton */}
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}
