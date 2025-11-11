// Update all thumbnail URLs to .jpg format
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixThumbnails() {
  console.log('🔧 Updating all thumbnails to .jpg format...\n')

  // Update courses
  const courses = [
    { slug: 'how-downs-work', thumbnail: '/images/courses/how-downs-work.jpg' },
    { slug: 'scoring-touchdowns', thumbnail: '/images/courses/field-layout-scoring.jpg' },
    { slug: 'field-layout-basics', thumbnail: '/images/courses/field-layout-scoring.jpg' },
    { slug: 'offensive-positions', thumbnail: '/images/courses/quarterback-fundamentals.jpg' },
    { slug: 'defensive-positions', thumbnail: '/images/courses/defensive-line-fundamentals.jpg' },
    { slug: 'quarterback-101', thumbnail: '/images/courses/quarterback-fundamentals.jpg' },
    { slug: 'special-teams-basics', thumbnail: '/images/courses/special-teams-mastery.jpg' },
    { slug: 'timeouts-and-clock', thumbnail: '/images/courses/field-layout-scoring.jpg' },
    { slug: 'understanding-penalties', thumbnail: '/images/courses/understanding-penalties.jpg' },
    { slug: 'nfl-seasons-playoffs', thumbnail: '/images/courses/nfl-seasons-playoffs.jpg' },
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
      console.log(`⚠️  ${course.slug}: Not found in database`)
    } else {
      console.log(`✅ ${course.slug} → ${course.thumbnail}`)
    }
  }

  // Verify
  console.log('\n🔍 Verification:\n')
  const { data: allCourses } = await supabase
    .from('courses')
    .select('slug, title, thumbnail_url, is_published')
    .order('order_index')

  allCourses?.forEach(c => {
    const status = c.thumbnail_url ? '✅' : '❌'
    const published = c.is_published ? '📗' : '📕'
    console.log(`${status} ${published} ${c.slug}: ${c.thumbnail_url || 'NOT SET'}`)
  })

  console.log('\n📊 Summary:')
  const withThumbnails = allCourses?.filter(c => c.thumbnail_url).length || 0
  const published = allCourses?.filter(c => c.is_published).length || 0
  console.log(`Total courses: ${allCourses?.length || 0}`)
  console.log(`With thumbnails: ${withThumbnails}`)
  console.log(`Published: ${published}`)
}

fixThumbnails()
