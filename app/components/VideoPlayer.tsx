'use client'

interface VideoPlayerProps {
  videoId: string // YouTube video ID
  title?: string
  className?: string
}

export function VideoPlayer({
  videoId,
  title = "Video",
  className = ""
}: VideoPlayerProps) {
  return (
    <div className={`relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

// Alternative: Cloudflare Stream Player
interface CloudflareVideoPlayerProps {
  videoId: string // Cloudflare Stream video ID
  title?: string
  className?: string
}

export function CloudflareVideoPlayer({
  videoId,
  title = "Video",
  className = ""
}: CloudflareVideoPlayerProps) {
  return (
    <div className={`relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <iframe
        src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${videoId}/iframe`}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

// Usage Example:
/*
// For YouTube:
<VideoPlayer
  videoId="YOUR_YOUTUBE_VIDEO_ID"
  title="Kickoff Club HQ Trailer"
/>

// For Cloudflare Stream:
<CloudflareVideoPlayer
  videoId="YOUR_CLOUDFLARE_VIDEO_ID"
  title="Welcome to Kickoff Club HQ"
/>

// In your homepage:
<section className="py-20">
  <div className="container mx-auto px-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Platform Overview
      </h2>
      <p className="text-xl text-gray-600 text-center mb-8">
        See what Kickoff Club HQ has to offer
      </p>
      <VideoPlayer videoId="YOUR_VIDEO_ID" />
    </div>
  </div>
</section>
*/
