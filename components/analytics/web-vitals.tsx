'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics endpoint
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })

    // Send to your analytics endpoint
    if (typeof window !== 'undefined' && navigator.sendBeacon) {
      const url = '/api/analytics/vitals'
      navigator.sendBeacon(url, body)
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, metric.value, metric.rating)
    }
  })

  return null
}
