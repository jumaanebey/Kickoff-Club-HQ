#!/usr/bin/env node

/**
 * Apply new migrations using Supabase REST API
 * No DATABASE_URL required - uses service role key
 */

import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Get this from your Supabase Dashboard → Settings → API')
  process.exit(1)
}

// Migrations to apply
const migrations = [
  '20250120_add_discussion_system.sql',
  '20250121_add_learning_paths.sql',
  '20250122_add_notes_streaks_leaderboards.sql',
  '20250123_add_practice_drills.sql',
  '20250124_add_study_groups.sql',
  '20250125_add_tags_activity_feed.sql',
  '20251122_add_is_featured_to_courses.sql',
  '20251122_reseed_golden_courses_v2.sql',
]

async function executeSQLQuery(sql) {
  // Use Supabase Management API
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ query: sql })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`HTTP ${response.status}: ${text}`)
  }

  return response
}

async function runMigrationSQL(filename) {
  console.log(`\n📝 Applying: ${filename}`)

  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename)
    const sql = await readFile(migrationPath, 'utf-8')

    // Try to execute the full migration
    await executeSQLQuery(sql)

    console.log(`✅ Success: ${filename}`)
    return true

  } catch (error) {
    //Check if error is about already existing objects
    if (
      error.message.includes('already exists') ||
      error.message.includes('42710') ||
      error.message.includes('duplicate')
    ) {
      console.log(`⚠️  Skipped (already exists): ${filename}`)
      return true
    }

    console.error(`❌ Failed: ${filename}`)
    console.error(`   Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Starting migration process...\n')
  console.log(`📊 Supabase: ${SUPABASE_URL}`)
  console.log(`📦 Migrations: ${migrations.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const migration of migrations) {
    const result = await runMigrationSQL(migration)
    if (result) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Successful: ${successCount}/${migrations.length}`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${migrations.length}`)
  }
  console.log('='.repeat(60))

  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed.')
    console.log('   Please apply them manually in Supabase Dashboard')
    console.log('   Go to: https://supabase.com/dashboard → SQL Editor')
    process.exit(1)
  } else {
    console.log('\n🎉 All migrations applied!')
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error.message)
  process.exit(1)
})
