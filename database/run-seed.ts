import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSeed() {
    console.log('🌱 Running database seed...')

    try {
        // Read the seed file
        const seedPath = path.join(__dirname, 'seeds', 'seed.sql')
        const seedSQL = fs.readFileSync(seedPath, 'utf-8')

        // Split by semicolons to get individual statements
        const statements = seedSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'))

        console.log(`📝 Found ${statements.length} SQL statements`)

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i]
            console.log(`\n[${i + 1}/${statements.length}] Executing...`)

            const { error } = await supabase.rpc('exec_sql', { sql: statement })

            if (error) {
                console.error(`❌ Error executing statement ${i + 1}:`, error)
                // Continue with other statements
            } else {
                console.log(`✅ Statement ${i + 1} executed successfully`)
            }
        }

        console.log('\n✨ Seed completed!')

    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    }
}

runSeed()
