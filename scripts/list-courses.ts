// List all courses to see their actual slugs
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('slug, title, thumbnail_url')
    .order('order_index')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\n📚 All Courses:\n')
  courses?.forEach(c => {
    console.log(`Slug: ${c.slug}`)
    console.log(`Title: ${c.title}`)
    console.log(`Thumbnail: ${c.thumbnail_url || 'NOT SET'}`)
    console.log('---')
  })
}

main()
