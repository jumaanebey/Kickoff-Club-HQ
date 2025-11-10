import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function updateVideoUrls() {
  console.log('\n🎬 Updating Video URLs for Free Tier Courses...\n')

  // Get the "How Downs Work" course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .eq('slug', 'how-downs-work')
    .single()

  if (courseError || !course) {
    console.error('Error finding course:', courseError)
    return
  }

  console.log(`Found course: ${course.title}`)

  // Get all lessons for this course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, video_url')
    .eq('course_id', course.id)

  if (lessonsError || !lessons) {
    console.error('Error finding lessons:', lessonsError)
    return
  }

  console.log(`\nFound ${lessons.length} lessons:`)

  // Update each lesson to point to the actual video
  for (const lesson of lessons) {
    console.log(`\n  📝 ${lesson.title}`)
    console.log(`     Old URL: ${lesson.video_url}`)

    const { error: updateError } = await supabase
      .from('lessons')
      .update({ video_url: '/videos/how-downs-work.mp4' })
      .eq('id', lesson.id)

    if (updateError) {
      console.error(`     ❌ Error updating: ${updateError.message}`)
    } else {
      console.log(`     ✅ Updated to: /videos/how-downs-work.mp4`)
    }
  }

  console.log('\n✨ Done!\n')
}

updateVideoUrls()
