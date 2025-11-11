// Map existing thumbnails to database courses
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function mapThumbnails() {
  console.log('📸 Mapping existing thumbnails to database courses...\n')

  // Map database slugs to available thumbnail files
  const mappings = [
    { dbSlug: 'how-downs-work', thumbnail: '/images/courses/how-downs-work.png' },
    { dbSlug: 'scoring-touchdowns', thumbnail: '/images/courses/field-layout-scoring.png' }, // Best available
    { dbSlug: 'field-layout-basics', thumbnail: '/images/courses/field-layout-scoring.png' },
    { dbSlug: 'offensive-positions', thumbnail: '/images/courses/quarterback-fundamentals.png' }, // Offense
    { dbSlug: 'defensive-positions', thumbnail: '/images/courses/defensive-line-fundamentals.png' }, // Defense
    { dbSlug: 'quarterback-101', thumbnail: '/images/courses/quarterback-fundamentals.png' },
    { dbSlug: 'special-teams-basics', thumbnail: '/images/courses/special-teams-mastery.png' },
    { dbSlug: 'timeouts-and-clock', thumbnail: '/images/courses/field-layout-scoring.png' }, // Generic
    { dbSlug: 'understanding-penalties', thumbnail: '/images/courses/understanding-penalties.png' },
    { dbSlug: 'nfl-seasons-playoffs', thumbnail: '/images/courses/nfl-seasons-playoffs.png' },
  ]

  for (const mapping of mappings) {
    const { data, error } = await supabase
      .from('courses')
      .update({ thumbnail_url: mapping.thumbnail })
      .eq('slug', mapping.dbSlug)
      .select()

    if (error) {
      console.error(`❌ ${mapping.dbSlug}:`, error.message)
    } else if (!data || data.length === 0) {
      console.log(`⚠️  ${mapping.dbSlug}: Course not found`)
    } else {
      console.log(`✅ ${mapping.dbSlug} → ${mapping.thumbnail}`)
    }
  }

  // Verify
  console.log('\n🔍 Verifying...\n')
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, thumbnail_url')
    .order('order_index')

  courses?.forEach(c => {
    const status = c.thumbnail_url ? '✅' : '❌'
    console.log(`${status} ${c.slug}: ${c.thumbnail_url || 'NOT SET'}`)
  })
}

mapThumbnails()
