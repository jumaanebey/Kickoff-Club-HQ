#!/usr/bin/env node

/**
 * Verify that lesson data from 20250104_add_sample_lesson_data.sql exists in production
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔍 Verifying lesson data in production database...\n')

async function checkData() {
  let allExists = true

  // Check for the sample course
  console.log('1️⃣  Checking for "Football Fundamentals" course...')
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', 'football-fundamentals')
    .single()

  if (courseError || !course) {
    console.log('❌ Course "football-fundamentals" not found')
    allExists = false
  } else {
    console.log(`✅ Course found: "${course.title}" (${course.slug})`)
  }

  // Check for the "How Downs Work" lesson
  console.log('\n2️⃣  Checking for "How Downs Work" lesson...')
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, slug, video_id, is_free')
    .eq('slug', 'how-downs-work')
    .single()

  if (lessonError || !lesson) {
    console.log('❌ Lesson "how-downs-work" not found')
    allExists = false
  } else {
    console.log(`✅ Lesson found: "${lesson.title}" (${lesson.slug})`)
    console.log(`   Video ID: ${lesson.video_id}`)
    console.log(`   Is Free: ${lesson.is_free}`)
  }

  // Check for lesson script sections
  console.log('\n3️⃣  Checking for lesson script sections...')
  if (lesson) {
    const { data: sections, error: sectionsError } = await supabase
      .from('lesson_script_sections')
      .select('title, timestamp, order_index')
      .eq('lesson_id', lesson.id)
      .order('order_index')

    if (sectionsError || !sections || sections.length === 0) {
      console.log('❌ No script sections found for lesson')
      allExists = false
    } else {
      console.log(`✅ Found ${sections.length} script sections:`)
      sections.forEach(s => console.log(`   ${s.order_index + 1}. ${s.title} (${s.timestamp})`))
    }
  }

  // Check all courses
  console.log('\n4️⃣  Checking all courses in database...')
  const { data: allCourses, error: allCoursesError } = await supabase
    .from('courses')
    .select('id, title, slug, is_published, tier')
    .order('title')

  if (allCoursesError || !allCourses) {
    console.log('❌ Failed to fetch courses')
  } else {
    console.log(`✅ Found ${allCourses.length} total courses:`)
    allCourses.forEach(c => console.log(`   - ${c.title} (${c.slug}) [${c.tier}, ${c.is_published ? 'published' : 'draft'}]`))
  }

  // Check all lessons
  console.log('\n5️⃣  Checking all lessons in database...')
  const { data: allLessons, error: allLessonsError } = await supabase
    .from('lessons')
    .select('id, title, slug, video_id, is_free, is_published')
    .order('title')

  if (allLessonsError || !allLessons) {
    console.log('❌ Failed to fetch lessons')
  } else {
    console.log(`✅ Found ${allLessons.length} total lessons:`)
    allLessons.forEach(l => console.log(`   - ${l.title} (${l.slug}) [video: ${l.video_id}, free: ${l.is_free}]`))
  }

  console.log('\n' + '='.repeat(60))
  if (allExists) {
    console.log('🎉 All lesson data verified! Migration was applied successfully.')
  } else {
    console.log('⚠️  Some lesson data is missing. The migration may need to be applied.')
  }
  console.log('='.repeat(60))
}

checkData().catch(error => {
  console.error('\n💥 Error checking data:', error.message)
  process.exit(1)
})
