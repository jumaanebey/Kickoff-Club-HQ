import useSWR from 'swr'
import { fetcher, REVALIDATE_INTERVALS } from '@/lib/swr-config'
import { Course } from '@/types/database.types'

// Hook for fetching all courses with client-side caching
export function useCourses() {
  const { data, error, isLoading, mutate } = useSWR<Course[]>(
    '/api/courses',
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: REVALIDATE_INTERVALS.static, // Revalidate every hour
    }
  )

  return {
    courses: data,
    isLoading,
    isError: error,
    mutate, // Allows manual cache invalidation
  }
}

// Hook for fetching all podcasts with client-side caching
export function usePodcasts() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/podcasts',
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: REVALIDATE_INTERVALS.static, // Revalidate every hour
    }
  )

  return {
    podcasts: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user enrollments with client-side caching
export function useEnrollments(userId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/enrollments?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: REVALIDATE_INTERVALS.dynamic, // Revalidate every 5 minutes
    }
  )

  return {
    enrollments: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user progress for a lesson
export function useLessonProgress(userId: string | null | undefined, lessonId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    userId && lessonId ? `/api/progress?userId=${userId}&lessonId=${lessonId}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: REVALIDATE_INTERVALS.dynamic, // Revalidate every 5 minutes
    }
  )

  return {
    progress: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching course reviews
export function useCourseReviews(courseId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    courseId ? `/api/reviews?courseId=${courseId}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: REVALIDATE_INTERVALS.realtime, // Revalidate every 30 seconds
    }
  )

  return {
    reviews: data,
    isLoading,
    isError: error,
    mutate,
  }
}

// Generic hook for any API endpoint
export function useFetch<T = any>(url: string | null, refreshInterval?: number) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      refreshInterval: refreshInterval || REVALIDATE_INTERVALS.static,
    }
  )

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  }
}
