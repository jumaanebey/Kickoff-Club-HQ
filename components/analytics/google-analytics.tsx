'use client'

import Script from 'next/script'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Event tracking helper functions
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Common events
export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('play', 'Video', videoTitle)
}

export const trackCourseEnroll = (courseTitle: string) => {
  trackEvent('enroll', 'Course', courseTitle)
}

export const trackSubscription = (plan: string) => {
  trackEvent('subscribe', 'Subscription', plan)
}

export const trackPodcastPlay = (episodeTitle: string) => {
  trackEvent('play', 'Podcast', episodeTitle)
}
