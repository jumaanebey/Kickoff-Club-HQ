import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Configure R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

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
      expiresIn,
      videoId,
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate video URL' },
      { status: 500 }
    )
  }
}
