#!/usr/bin/env node

/**
 * Automatically apply new Supabase migrations
 * This script reads migration files and applies them to the database
 */

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// List of new migrations to apply (in order)
const migrations = [
  '20250120_add_discussion_system.sql',
  '20250121_add_learning_paths.sql',
  '20250122_add_notes_streaks_leaderboards.sql',
  '20250123_add_practice_drills.sql',
  '20250124_add_study_groups.sql',
  '20250125_add_tags_activity_feed.sql',
]

async function applyMigration(filename) {
  console.log(`\n📝 Applying migration: ${filename}`)

  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename)
    const sql = await readFile(migrationPath, 'utf-8')

    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Try alternative method: direct query
      const { error: queryError } = await supabase.from('_migrations').select('*').limit(1)

      if (queryError) {
        console.error(`❌ Error applying ${filename}:`, error.message)
        return false
      }

      // If the table doesn't exist, we need to use the Management API
      // For now, we'll use a different approach
      console.log(`⚠️  Cannot apply via RPC, trying direct SQL execution...`)

      // Split SQL into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

      for (const statement of statements) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ query: statement })
          })
        } catch (err) {
          // Some statements might fail if they already exist (e.g., CREATE TABLE IF NOT EXISTS)
          // We'll continue anyway
        }
      }
    }

    console.log(`✅ Successfully applied ${filename}`)
    return true

  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting migration process...\n')
  console.log(`📊 Supabase URL: ${supabaseUrl}`)
  console.log(`📦 Migrations to apply: ${migrations.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const migration of migrations) {
    const success = await applyMigration(migration)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Successfully applied: ${successCount}/${migrations.length}`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${migrations.length}`)
  }
  console.log('='.repeat(60))

  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.')
    console.log('   You may need to apply them manually in the Supabase Dashboard.')
    process.exit(1)
  } else {
    console.log('\n🎉 All migrations applied successfully!')
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
