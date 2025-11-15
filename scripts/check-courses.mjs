#!/usr/bin/env node

/**
 * Check courses table in production
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔍 Checking courses table...\n')

async function checkCourses() {
  // Try to get all courses
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at')

  if (error) {
    console.error('❌ Error fetching courses:', error.message)
    console.error('   Code:', error.code)
    console.error('   Details:', error.details)
    console.error('   Hint:', error.hint)
  } else if (!data || data.length === 0) {
    console.log('⚠️  No courses found in database')
  } else {
    console.log(`✅ Found ${data.length} courses:\n`)
    data.forEach((course, i) => {
      console.log(`${i + 1}. ${course.title}`)
      console.log(`   Slug: ${course.slug}`)
      console.log(`   ID: ${course.id}`)
      console.log(`   Tier: ${course.tier}`)
      console.log(`   Published: ${course.is_published}`)
      console.log(`   Created: ${course.created_at}`)
      console.log('')
    })
  }
}

checkCourses().catch(error => {
  console.error('\n💥 Fatal error:', error.message)
  process.exit(1)
})
