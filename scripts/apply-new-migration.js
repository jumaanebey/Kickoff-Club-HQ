#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const filename = '20251128_add_energy_and_units.sql'

async function main() {
    console.log(`\n📝 Applying migration: ${filename}`)
    try {
        const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename)
        const sql = await readFile(migrationPath, 'utf-8')

        // Try executing via REST API directly if RPC fails or as a fallback
        // Note: The original script used a custom RPC 'exec_sql'. 
        // If that doesn't exist, we can't run DDL via the JS client easily without it.
        // However, we can try to use the `pg` library if we had the connection string.
        // Since we don't, we rely on the RPC.

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

        if (error) {
            console.error('RPC exec_sql failed:', error)
            console.log('Attempting to run via raw SQL query is not supported by Supabase JS client for DDL without a helper function.')
            process.exit(1)
        }

        console.log(`✅ Successfully applied ${filename}`)
    } catch (error) {
        console.error(`❌ Error:`, error)
        process.exit(1)
    }
}

main()
