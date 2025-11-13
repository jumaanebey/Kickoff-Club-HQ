#!/usr/bin/env node

/**
 * Simple migration runner that executes SQL files against Supabase
 */

import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get database connection string
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL environment variable')
  console.error('   Set it in your .env.local file')
  process.exit(1)
}

// Migrations to run
const migrations = [
  '20250120_add_discussion_system.sql',
  '20250121_add_learning_paths.sql',
  '20250122_add_notes_streaks_leaderboards.sql',
  '20250123_add_practice_drills.sql',
  '20250124_add_study_groups.sql',
  '20250125_add_tags_activity_feed.sql',
]

async function runMigration(client, filename) {
  console.log(`\n📝 Running: ${filename}`)

  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename)
    const sql = await readFile(migrationPath, 'utf-8')

    await client.query(sql)

    console.log(`✅ Success: ${filename}`)
    return true
  } catch (error) {
    // Some errors are OK (like "already exists")
    if (error.message.includes('already exists') || error.code === '42710') {
      console.log(`⚠️  Skipped (already exists): ${filename}`)
      return true
    }

    console.error(`❌ Failed: ${filename}`)
    console.error(`   Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Starting migration runner...\n')

  const client = new Client({
    connectionString: DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    let successCount = 0
    let skipCount = 0
    let failCount = 0

    for (const migration of migrations) {
      const result = await runMigration(client, migration)
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
      console.log('   Check the errors above for details.')
      process.exit(1)
    } else {
      console.log('\n🎉 All migrations completed successfully!')
    }

  } catch (error) {
    console.error('💥 Connection error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
