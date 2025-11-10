import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Temporary YouTube video mappings for launch (until R2 videos are uploaded)
const YOUTUBE_VIDEOS: Record<string, string> = {
  'how-downs-work': 'dQw4w9WgXcQ', // Replace with actual YouTube video IDs
  'scoring-touchdowns': 'dQw4w9WgXcQ',
  'field-layout-basics': 'dQw4w9WgXcQ',
}

// Configure R2 client (only if credentials exist)
const r2Enabled = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY

const s3Client = r2Enabled ? new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
}) : null

// Free lessons that don't require premium subscription
const FREE_LESSONS = [
  'how-downs-work',
  'scoring-touchdowns',
  'field-layout-basics'
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Check if lesson is premium
    const isPremium = !FREE_LESSONS.includes(videoId)

    // If premium, verify user has access
    if (isPremium) {
      const supabase = createRouteHandlerClient({ cookies })

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check if user has active subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single()

      if (!profile || profile.subscription_status !== 'active' || profile.subscription_tier === 'free') {
        return NextResponse.json(
          { error: 'Premium subscription required' },
          { status: 403 }
        )
      }
    }

    // Try YouTube first (for quick launch)
    if (YOUTUBE_VIDEOS[videoId]) {
      return NextResponse.json({
        url: `https://www.youtube.com/embed/${YOUTUBE_VIDEOS[videoId]}`,
        type: 'youtube',
        videoId: YOUTUBE_VIDEOS[videoId],
        expiresIn: null, // YouTube embeds don't expire
      })
    }

    // Fall back to R2 if configured
    if (r2Enabled && s3Client) {
      try {
        // Check if video exists in R2
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: `${videoId}.mp4`,
        })
        await s3Client.send(headCommand)

        // Generate signed URL for the video
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: `${videoId}.mp4`,
        })

        // URL expires in 2 hours (7200 seconds)
        const expiresIn = parseInt(process.env.VIDEO_URL_EXPIRATION || '7200')
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })

        return NextResponse.json({
          url: signedUrl,
          type: 'r2',
          expiresIn,
          videoId,
        })
      } catch (r2Error) {
        console.warn(`Video not found in R2: ${videoId}`, r2Error)
      }
    }

    // No video source available
    return NextResponse.json(
      { error: 'Video not available. Please upload to YouTube or R2.' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error generating video URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate video URL' },
      { status: 500 }
    )
  }
}
