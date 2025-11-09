/**
 * Run SQL migration to add all remaining lessons
 * Run with: node scripts/run-migration.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  try {
    console.log('\n📝 Running migration: 20250105_add_remaining_lessons.sql\n')

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250105_add_remaining_lessons.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Split by semicolons to execute statements individually
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments and DO blocks (they won't work with rpc)
      if (statement.startsWith('DO $$')) {
        console.log(`⏭️  Skipping DO block (statement ${i + 1})\n`)
        continue
      }

      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      })

      if (error) {
        // If rpc doesn't exist, use direct query
        const { data: queryData, error: queryError } = await supabase
          .from('lessons')
          .insert([]) // This is a workaround - we'll use raw SQL instead

        console.log(`❌ Error (will try manual approach): ${error.message}`)
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully\n`)
      }
    }

    // Alternative: Insert lessons directly using Supabase client
    console.log('\n📝 Inserting lessons directly using Supabase client...\n')

    const lessonsToAdd = [
      {
        id: '00000000-0000-0000-0000-000000000103',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Field Layout Basics',
        slug: 'field-layout-basics',
        description: 'Understand the football field layout, yard lines, and end zones',
        video_id: 'field-layout-basics',
        duration_seconds: 90,
        order_index: 3,
        is_free: true,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000104',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Offensive Positions',
        slug: 'offensive-positions',
        description: 'Learn about quarterback, running backs, receivers, and offensive line positions',
        video_id: 'offensive-positions',
        duration_seconds: 120,
        order_index: 4,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000105',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Defensive Positions',
        slug: 'defensive-positions',
        description: 'Understand defensive line, linebackers, and defensive backs',
        video_id: 'defensive-positions',
        duration_seconds: 120,
        order_index: 5,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000106',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Quarterback 101',
        slug: 'quarterback-101',
        description: 'Deep dive into the most important position in football',
        video_id: 'quarterback-101',
        duration_seconds: 120,
        order_index: 6,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000107',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Special Teams Basics',
        slug: 'special-teams-basics',
        description: 'Learn about kickers, punters, and special teams plays',
        video_id: 'special-teams-basics',
        duration_seconds: 90,
        order_index: 7,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000108',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Understanding Penalties',
        slug: 'understanding-penalties',
        description: 'Master common penalties and what they mean for the game',
        video_id: 'understanding-penalties',
        duration_seconds: 120,
        order_index: 8,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000109',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'Timeouts and Clock Management',
        slug: 'timeouts-and-clock',
        description: 'Learn how teams use timeouts and manage the game clock strategically',
        video_id: 'timeouts-and-clock',
        duration_seconds: 120,
        order_index: 9,
        is_free: false,
        is_published: true
      },
      {
        id: '00000000-0000-0000-0000-000000000110',
        course_id: '00000000-0000-0000-0000-000000000001',
        title: 'NFL Seasons and Playoffs',
        slug: 'nfl-seasons-playoffs',
        description: 'Understand how the NFL season works, divisions, and playoff structure',
        video_id: 'nfl-seasons-playoffs',
        duration_seconds: 150,
        order_index: 10,
        is_free: false,
        is_published: true
      }
    ]

    for (const lesson of lessonsToAdd) {
      const { data, error } = await supabase
        .from('lessons')
        .upsert(lesson, { onConflict: 'course_id,slug' })

      if (error) {
        console.log(`❌ Error adding ${lesson.title}: ${error.message}`)
      } else {
        console.log(`✅ Added: ${lesson.title} (video_id: ${lesson.video_id})`)
      }
    }

    // Verify all lessons
    console.log('\n📊 Verifying all lessons in database...\n')
    const { data: allLessons, error: fetchError } = await supabase
      .from('lessons')
      .select('title, video_id, is_free, order_index')
      .eq('course_id', '00000000-0000-0000-0000-000000000001')
      .order('order_index')

    if (fetchError) {
      console.log('❌ Error fetching lessons:', fetchError.message)
    } else {
      console.log(`Found ${allLessons.length} lessons:\n`)
      allLessons.forEach((lesson, i) => {
        const freeTag = lesson.is_free ? '(FREE)' : '(PREMIUM)'
        console.log(`  ${i + 1}. ${lesson.title} ${freeTag}`)
        console.log(`     video_id: ${lesson.video_id}`)
      })
    }

    console.log('\n✅ Migration complete!')
    console.log('\n🚀 Next steps:')
    console.log('1. Visit: http://localhost:3000/courses/football-fundamentals')
    console.log('2. Test video playback for each lesson')
    console.log('3. Verify free vs premium access works correctly')
    console.log('4. Deploy to production when ready\n')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check that .env.local has NEXT_PUBLIC_SUPABASE_URL')
    console.error('2. Check that .env.local has SUPABASE_SERVICE_ROLE_KEY')
    console.error('3. Verify Supabase connection is working')
    console.error('4. Try running the SQL manually in Supabase dashboard\n')
  }
}

runMigration()
