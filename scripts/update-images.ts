// Script to update podcast covers and course thumbnails in the database
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updatePodcastCovers() {
  console.log('\n📻 Updating podcast covers...')

  for (let i = 1; i <= 10; i++) {
    const coverUrl = `/images/podcast-covers/episode-${String(i).padStart(2, '0')}.png`

    const { data, error } = await supabase
      .from('podcasts')
      .update({ cover_image_url: coverUrl })
      .eq('episode_number', i)
      .select()

    if (error) {
      console.error(`❌ Episode ${i}:`, error.message)
    } else {
      console.log(`✅ Episode ${i}: ${coverUrl}`)
    }
  }
}

async function updateCourseThumbnails() {
  console.log('\n🎓 Updating course thumbnails...')

  const courses = [
    { slug: 'how-downs-work', thumbnail: '/images/courses/how-downs-work.png' },
    { slug: 'field-layout-scoring', thumbnail: '/images/courses/field-layout-scoring.png' },
    { slug: 'quarterback-fundamentals', thumbnail: '/images/courses/quarterback-fundamentals.png' },
    { slug: 'wide-receiver-routes', thumbnail: '/images/courses/wide-receiver-routes.png' },
    { slug: 'defensive-line-fundamentals', thumbnail: '/images/courses/defensive-line-fundamentals.png' },
    { slug: 'offensive-line-blocking', thumbnail: '/images/courses/offensive-line-blocking.png' },
    { slug: 'running-back-vision', thumbnail: '/images/courses/running-back-vision.png' },
    { slug: 'special-teams-mastery', thumbnail: '/images/courses/special-teams-mastery.png' },
    { slug: 'nfl-seasons-playoffs', thumbnail: '/images/courses/nfl-seasons-playoffs.png' },
    { slug: 'understanding-penalties', thumbnail: '/images/courses/understanding-penalties.png' },
  ]

  for (const course of courses) {
    const { data, error } = await supabase
      .from('courses')
      .update({ thumbnail_url: course.thumbnail })
      .eq('slug', course.slug)
      .select()

    if (error) {
      console.error(`❌ ${course.slug}:`, error.message)
    } else if (!data || data.length === 0) {
      console.log(`⚠️  ${course.slug}: Course not found`)
    } else {
      console.log(`✅ ${course.slug}: ${course.thumbnail}`)
    }
  }
}

async function verifyUpdates() {
  console.log('\n🔍 Verifying updates...')

  // Check podcasts
  const { data: podcasts, error: podcastError } = await supabase
    .from('podcasts')
    .select('episode_number, cover_image_url')
    .order('episode_number')

  if (podcastError) {
    console.error('❌ Error fetching podcasts:', podcastError.message)
  } else {
    console.log('\n📻 Podcast Covers:')
    podcasts?.forEach(p => {
      const status = p.cover_image_url ? '✅' : '❌'
      console.log(`${status} Episode ${p.episode_number}: ${p.cover_image_url || 'NOT SET'}`)
    })
  }

  // Check courses
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('slug, thumbnail_url')
    .order('order_index')

  if (courseError) {
    console.error('❌ Error fetching courses:', courseError.message)
  } else {
    console.log('\n🎓 Course Thumbnails:')
    courses?.forEach(c => {
      const status = c.thumbnail_url ? '✅' : '❌'
      console.log(`${status} ${c.slug}: ${c.thumbnail_url || 'NOT SET'}`)
    })
  }
}

async function main() {
  console.log('🚀 Starting image URL updates...')
  console.log(`📡 Supabase URL: ${supabaseUrl}`)

  await updatePodcastCovers()
  await updateCourseThumbnails()
  await verifyUpdates()

  console.log('\n✅ All done!')
}

main().catch(console.error)
