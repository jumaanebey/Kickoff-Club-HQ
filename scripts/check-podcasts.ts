// Check podcast cover URLs in database
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: podcasts, error } = await supabase
    .from('podcasts')
    .select('episode_number, title, cover_image_url')
    .order('episode_number')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\n📻 Podcast Episodes:\n')
  podcasts?.forEach(p => {
    console.log(`Episode ${p.episode_number}: ${p.title}`)
    console.log(`Cover: ${p.cover_image_url || 'NOT SET'}`)
    console.log('---')
  })
}

main()
