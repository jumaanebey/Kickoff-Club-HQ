#!/usr/bin/env node

/**
 * Execute migrations using Supabase Management API
 * This API allows direct SQL execution with proper authentication
 */

import { readFile } from 'fs/promises'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_PROJECT_REF = 'zejensivaohvtkzufdou'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function executeSQLViaAPI(sql) {
  // Use Supabase's PostgREST query endpoint with service role auth
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'params=single-object'
    },
    body: JSON.stringify({
      query: sql
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`HTTP ${response.status}: ${text}`)
  }

  return response.json()
}

async function runMigrations() {
  console.log('🚀 Executing database migrations...\n')

  const migrations = [
    '20250120_add_discussion_system.sql',
    '20250121_add_learning_paths.sql',
    '20250122_add_notes_streaks_leaderboards.sql',
    '20250123_add_practice_drills.sql',
    '20250124_add_study_groups.sql',
    '20250125_add_tags_activity_feed.sql',
  ]

  for (const filename of migrations) {
    console.log(`\n📝 Processing: ${filename}`)

    try {
      const sql = await readFile(`supabase/migrations/${filename}`, 'utf-8')

      // Execute the SQL directly using Supabase connection
      const result = await executeSQLViaAPI(sql)

      console.log(`✅ Success: ${filename}`)

    } catch (error) {
      // Check if it's an "already exists" error
      if (error.message.includes('already exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('42710')) {
        console.log(`⚠️  Skipped (already exists): ${filename}`)
      } else {
        console.error(`❌ Failed: ${filename}`)
        console.error(`   ${error.message}`)
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Migration process complete!')
  console.log('='.repeat(60))
}

runMigrations().catch(error => {
  console.error('\n💥 Fatal error:', error.message)
  process.exit(1)
})
