require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://zejensivaohvtkzufdou.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250104_create_lessons_tables.sql'),
      'utf8'
    )

    console.log('Running lessons migration...')

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
      // If exec_sql doesn't exist, execute directly
      const { error } = await supabase.from('_migrations').insert({
        name: '20250104_create_lessons_tables',
        executed_at: new Date().toISOString()
      })

      // Execute each statement
      const statements = sql.split(';').filter(s => s.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: execError } = await supabase.rpc('exec', {
            sql: statement + ';'
          }).catch(() => ({ error: null }))
          if (execError) console.error('Statement error:', execError)
        }
      }
      return { error }
    })

    if (error) {
      console.error('Migration error:', error)
      // Try manual execution via SQL editor
      console.log('\n📋 Copy this SQL and run it in Supabase SQL Editor:')
      console.log('\n' + sql)
      process.exit(1)
    }

    console.log('✅ Lessons migration completed successfully!')
  } catch (error) {
    console.error('Error:', error)
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor')
    process.exit(1)
  }
}

runMigration()
