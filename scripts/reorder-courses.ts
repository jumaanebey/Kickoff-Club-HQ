/**
 * Reorder courses to make "How Downs Work" first
 * and ensure all free courses are at beginner level
 *
 * Run with: npx tsx scripts/reorder-courses.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

async function reorderCourses() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('Starting course reordering...\n')

  try {
    // Step 1: Update "How Downs Work" to be first
    console.log('1. Setting "How Downs Work" as first course...')
    const { error: error1 } = await supabase
      .from('courses')
      .update({
        order_index: 1,
        difficulty_level: 'beginner'
      })
      .eq('slug', 'how-downs-work')

    if (error1) throw error1
    console.log('   ✓ "How Downs Work" is now first\n')

    // Step 2: Update "Field Layout & Scoring" to be second
    console.log('2. Setting "Field Layout & Scoring" as second...')
    const { error: error2 } = await supabase
      .from('courses')
      .update({
        order_index: 2,
        difficulty_level: 'beginner'
      })
      .eq('slug', 'field-layout-scoring')

    if (error2) throw error2
    console.log('   ✓ "Field Layout & Scoring" is now second\n')

    // Step 3: Update "NFL Seasons & Playoffs" to be third
    console.log('3. Setting "NFL Seasons & Playoffs" as third...')
    const { error: error3 } = await supabase
      .from('courses')
      .update({
        order_index: 3,
        difficulty_level: 'beginner'
      })
      .eq('slug', 'nfl-seasons-playoffs')

    if (error3) throw error3
    console.log('   ✓ "NFL Seasons & Playoffs" is now third\n')

    // Step 4: Ensure all free courses are beginner level
    console.log('4. Ensuring all free courses are beginner level...')
    const { error: error4 } = await supabase
      .from('courses')
      .update({ difficulty_level: 'beginner' })
      .eq('tier_required', 'free')

    if (error4) throw error4
    console.log('   ✓ All free courses are now beginner level\n')

    // Step 5: Verify the changes
    console.log('5. Verifying course order...\n')
    const { data: courses, error: error5 } = await supabase
      .from('courses')
      .select('title, slug, order_index, difficulty_level, tier_required')
      .order('order_index', { ascending: true })
      .limit(10)

    if (error5) throw error5

    console.log('Current course order:')
    console.log('━'.repeat(80))
    courses?.forEach((course, index) => {
      const tierBadge = course.tier_required === 'free' ? '🆓' : '💰'
      const diffBadge = course.difficulty_level === 'beginner' ? '🟢' :
                       course.difficulty_level === 'intermediate' ? '🟡' : '🔴'
      console.log(`${index + 1}. ${tierBadge} ${diffBadge} ${course.title}`)
      console.log(`   Order: ${course.order_index} | Tier: ${course.tier_required} | Difficulty: ${course.difficulty_level}`)
    })
    console.log('━'.repeat(80))

    console.log('\n✅ Course reordering completed successfully!')
    console.log('\n📋 Summary:')
    console.log('   • "How Downs Work" is now the first course')
    console.log('   • All free courses are at beginner level')
    console.log('   • Free courses appear first in the list')

  } catch (error) {
    console.error('\n❌ Error reordering courses:', error)
    process.exit(1)
  }
}

reorderCourses()
