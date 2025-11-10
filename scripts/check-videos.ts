import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkVideos() {
  // Get courses with their lessons
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, slug, title, tier_required, difficulty_level, order_index')
    .order('order_index')
    .limit(10)

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
    return
  }

  console.log('\n📹 Course & Lesson Videos Status:\n')
  console.log('=' .repeat(80))

  let totalLessons = 0
  let lessonsWithVideos = 0
  let freeTierLessons = 0
  let freeTierWithVideos = 0

  for (const course of courses!) {
    const accessLevel = course.tier_required === 'free' ? '🟢 FREE' : '🔒 PAID'

    // Get lessons for this course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, slug, video_url, order_index, is_published')
      .eq('course_id', course.id)
      .order('order_index')

    if (lessonsError) {
      console.error(`Error fetching lessons for ${course.title}:`, lessonsError)
      continue
    }

    const lessonCount = lessons?.length || 0
    const videoCount = lessons?.filter(l => l.video_url && l.video_url.trim() !== '').length || 0

    console.log(`\n${course.order_index}. ${course.title}`)
    console.log(`   Slug: ${course.slug}`)
    console.log(`   Access: ${accessLevel}`)
    console.log(`   Difficulty: ${course.difficulty_level}`)
    console.log(`   Lessons: ${lessonCount} (${videoCount} with videos)`)

    if (lessons && lessons.length > 0) {
      for (const lesson of lessons) {
        const hasVideo = lesson.video_url && lesson.video_url.trim() !== ''
        const publishStatus = lesson.is_published ? '' : ' [UNPUBLISHED]'
        console.log(`      ${lesson.order_index}. ${lesson.title}${publishStatus}`)
        console.log(`         Video: ${hasVideo ? '✅ ' + lesson.video_url : '❌ NO VIDEO'}`)

        totalLessons++
        if (hasVideo) lessonsWithVideos++
        if (course.tier_required === 'free') {
          freeTierLessons++
          if (hasVideo) freeTierWithVideos++
        }
      }
    } else {
      console.log(`      ⚠️  No lessons found`)
    }
  }

  console.log('\n' + '='.repeat(80))

  const totalCourses = courses!.length
  const freeCourses = courses!.filter(c => c.tier_required === 'free').length

  console.log(`\n📊 Summary:`)
  console.log(`   Total Courses: ${totalCourses}`)
  console.log(`   Free Courses: ${freeCourses}`)
  console.log(`   Total Lessons: ${totalLessons}`)
  console.log(`   Lessons with Videos: ${lessonsWithVideos}/${totalLessons}`)
  console.log(`   Free Tier Lessons: ${freeTierLessons}`)
  console.log(`   Free Tier with Videos: ${freeTierWithVideos}/${freeTierLessons}`)
  console.log('\n')
}

checkVideos()
