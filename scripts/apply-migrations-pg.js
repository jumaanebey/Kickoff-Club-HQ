const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const migrations = [
    '20250120_add_discussion_system.sql',
    '20250121_add_learning_paths.sql',
    '20250122_add_notes_streaks_leaderboards.sql',
    '20250123_add_practice_drills.sql',
    '20250124_add_study_groups.sql',
    '20250125_add_tags_activity_feed.sql',
    '20251122_add_is_featured_to_courses.sql',
    '20251122_reseed_golden_courses_v2.sql',
    '20251126_create_lesson_comments.sql',
    '20251127_create_user_hq.sql'
];

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.error('❌ Error: DATABASE_URL or POSTGRES_URL not found in .env.local');
        console.error('   Please add your Supabase connection string to .env.local');
        console.error('   Format: postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        await client.connect();
        console.log('✅ Connected to database via Postgres protocol');

        for (const migration of migrations) {
            console.log(`\n📝 Applying: ${migration}`);
            const filePath = path.join(__dirname, '..', 'supabase', 'migrations', migration);
            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                await client.query(sql);
                console.log(`✅ Success: ${migration}`);
            } catch (err) {
                if (err.message.includes('already exists') || err.code === '42P07') {
                    console.log(`⚠️  Skipped (already exists): ${migration}`);
                } else {
                    console.error(`❌ Failed: ${migration}`);
                    console.error(`   Error: ${err.message}`);
                }
            }
        }

        console.log('\n🎉 All migrations processed!');
    } catch (err) {
        console.error('💥 Fatal error:', err);
    } finally {
        await client.end();
    }
}

runMigrations();
