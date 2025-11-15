#!/usr/bin/env node

/**
 * Execute migrations directly using Supabase SQL execution
 * Uses a workaround: create a function that can execute SQL, then call it
 */

import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQLDirect(sql) {
  // Split SQL into individual statements and execute via Supabase
  // This uses the service role key which has full access

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      query: sql
    })
  })

  return response
}

async function runMigrations() {
  console.log('🚀 Executing combined migration file...\n')

  try {
    // Read the combined migration
    const sqlPath = '/tmp/combined_migration.sql'
    console.log(`📖 Reading: ${sqlPath}`)

    const sql = await readFile(sqlPath, 'utf-8')
    console.log(`✅ Loaded ${sql.length} characters of SQL\n`)

    console.log('⚡ Executing via raw SQL query...')

    // Try direct execution via PostgREST
    const { data, error } = await supabase.rpc('query', { sql })

    if (error) {
      console.error('❌ Error:', error.message)
      console.log('\n💡 This method requires a custom RPC function.')
      console.log('   Trying alternative approach...\n')

      // Alternative: execute via HTTP POST to SQL endpoint
      throw error
    }

    console.log('✅ Migration executed successfully!')
    console.log('\n🎉 Database updated with all new features!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 Please run migrations manually via Supabase Dashboard:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql')
    console.log('   2. Copy contents of: /tmp/combined_migration.sql')
    console.log('   3. Paste and execute in SQL Editor')
    process.exit(1)
  }
}

runMigrations()
