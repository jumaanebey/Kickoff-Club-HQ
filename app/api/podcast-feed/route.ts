import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/supabase'

export const dynamic = 'force-dynamic'

interface Podcast {
  id: string
  episode_number: number
  title: string
  slug: string
  description: string
  audio_url: string
  duration: string
  guest: string | null
  publish_date: string
  category: string | null
  transcript: string | null
  shownotes: any
  cover_image_url: string | null
  is_published: boolean
  created_at: string
}

export async function GET() {
  try {
    // Fetch all published podcasts from database
    const { data: podcasts, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('is_published', true)
      .order('episode_number', { ascending: false })

    if (error) {
      console.error('Error fetching podcasts:', error)
      return new NextResponse('Error fetching podcasts', { status: 500 })
    }

    // Generate RSS feed
    const rss = generateRSSFeed(podcasts || [])

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('RSS Feed generation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function generateRSSFeed(podcasts: Podcast[]): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kickoffclubhq.com'
  const podcastEmail = process.env.PODCAST_EMAIL || 'podcast@kickoffclubhq.com'

  const buildDate = new Date().toUTCString()
  const lastBuildDate = podcasts.length > 0
    ? new Date(podcasts[0].publish_date).toUTCString()
    : buildDate

  // Escape XML special characters
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  // Generate episode items
  const items = podcasts.map((podcast) => {
    const pubDate = new Date(podcast.publish_date).toUTCString()
    // Clean audio URL - remove newlines and whitespace
    const cleanedAudioUrl = podcast.audio_url.replace(/\s+/g, '')
    const audioUrl = cleanedAudioUrl.startsWith('http')
      ? cleanedAudioUrl
      : `${siteUrl}${cleanedAudioUrl}`

    // Convert duration from MM:SS to seconds for iTunes
    const [minutes, seconds] = podcast.duration.split(':').map(Number)
    const durationInSeconds = (minutes || 0) * 60 + (seconds || 0)

    return `
    <item>
      <title>${escapeXml(podcast.title)}</title>
      <description>${escapeXml(podcast.description)}</description>
      <link>${siteUrl}/podcast/${podcast.slug}</link>
      <guid isPermaLink="true">${siteUrl}/podcast/${podcast.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${audioUrl}" length="0" type="audio/mpeg"/>
      <itunes:title>${escapeXml(podcast.title)}</itunes:title>
      <itunes:summary>${escapeXml(podcast.description)}</itunes:summary>
      <itunes:subtitle>${escapeXml(podcast.description.substring(0, 100))}</itunes:subtitle>
      <itunes:author>Kickoff Club</itunes:author>
      <itunes:duration>${durationInSeconds}</itunes:duration>
      <itunes:episode>${podcast.episode_number}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      ${podcast.cover_image_url ? `<itunes:image href="${podcast.cover_image_url.startsWith('http') ? podcast.cover_image_url : siteUrl + podcast.cover_image_url}"/>` : ''}
      ${podcast.guest ? `<itunes:author>${escapeXml(podcast.guest)}</itunes:author>` : ''}
      <content:encoded><![CDATA[${podcast.description}]]></content:encoded>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kickoff Club: Football for Complete Beginners</title>
    <link>${siteUrl}/podcast</link>
    <atom:link href="${siteUrl}/api/podcast-feed" rel="self" type="application/rss+xml"/>
    <description>The #1 podcast for people who want to understand football but don't know where to start. We break down the fundamentals in plain English, no prior knowledge required. Perfect for partners, friends, or anyone who wants to finally "get" the game.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Kickoff Club HQ. All rights reserved.</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <managingEditor>${podcastEmail} (Kickoff Club)</managingEditor>
    <webMaster>${podcastEmail} (Kickoff Club)</webMaster>

    <!-- iTunes Specific Tags -->
    <itunes:author>Kickoff Club</itunes:author>
    <itunes:summary>The #1 podcast for people who want to understand football but don't know where to start. We break down the fundamentals in plain English, no prior knowledge required.</itunes:summary>
    <itunes:subtitle>Learn football from scratch - no experience needed</itunes:subtitle>
    <itunes:owner>
      <itunes:name>Kickoff Club</itunes:name>
      <itunes:email>${podcastEmail}</itunes:email>
    </itunes:owner>
    <itunes:image href="${siteUrl}/images/podcast-cover.jpg"/>
    <itunes:category text="Sports">
      <itunes:category text="Football"/>
    </itunes:category>
    <itunes:category text="Education">
      <itunes:category text="How To"/>
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>
    <itunes:type>episodic</itunes:type>

    <!-- Channel Image -->
    <image>
      <url>${siteUrl}/images/podcast-cover.jpg</url>
      <title>Kickoff Club: Football for Complete Beginners</title>
      <link>${siteUrl}/podcast</link>
    </image>
    ${items}
  </channel>
</rss>`
}
