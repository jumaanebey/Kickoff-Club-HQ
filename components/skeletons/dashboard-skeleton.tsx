import { Card, CardContent } from '@/components/ui/card'

export function DashboardCourseSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Title and badge */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded" />
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DashboardCourseSkeleton key={i} />
      ))}
    </div>
  )
}
