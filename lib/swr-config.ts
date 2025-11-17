import { SWRConfiguration } from 'swr'

// Global fetcher function for API requests
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object
    ;(error as any).info = await res.json()
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false, // Don't refetch when window regains focus
  revalidateOnReconnect: true, // Refetch when internet reconnects
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidation to every 5 seconds
  errorRetryInterval: 5000, // Wait 5 seconds before retrying on error
  errorRetryCount: 3, // Retry failed requests up to 3 times
  shouldRetryOnError: true, // Retry on error
  // Cache successful responses for 5 minutes by default
  // Individual hooks can override this
}

// Revalidation intervals for different data types
export const REVALIDATE_INTERVALS = {
  static: 60 * 60 * 1000, // 1 hour for rarely changing data (courses, lessons)
  dynamic: 5 * 60 * 1000, // 5 minutes for frequently changing data (enrollments, progress)
  realtime: 30 * 1000, // 30 seconds for near-realtime data (comments, likes)
} as const
