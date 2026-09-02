// Comprehensive database schema audit
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://goypzelcadgjjkkznzwu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) { console.error('Set SUPABASE_KEY (publishable or secret key) in the environment'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditTables() {
  console.log('\n🔍 Auditing All Database Tables...\n');

  const tests = [
    {
      name: 'profiles',
      columns: 'id, username, email, coins, knowledge_points, energy, last_energy_update'
    },
    {
      name: 'courses',
      columns: 'id, title, slug, is_published'
    },
    {
      name: 'lessons',
      columns: 'id, title, course_id, video_id'
    },
    {
      name: 'games',
      columns: 'id, home_team, away_team, game_time'
    },
    {
      name: 'user_buildings',
      columns: 'id, user_id, building_type, level, unlocked'
    },
    {
      name: 'mission_templates',
      columns: 'id, title, description, mission_type, rarity'
    },
    {
      name: 'user_missions',
      columns: 'id, user_id, title, description, mission_type, target_value, current_progress, completed, claimed, expires_at'
    },
    {
      name: 'knowledge_point_transactions',
      columns: 'id, user_id, amount, reason'
    }
  ];

  let passCount = 0;
  let failCount = 0;

  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}...`);

    const { data, error } = await supabase
      .from(test.name)
      .select(test.columns)
      .limit(1);

    if (error) {
      console.log(` ❌ FAILED`);
      console.log(`   Error: ${error.message}`);
      failCount++;
    } else {
      console.log(` ✅ PASSED`);
      passCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed\n`);

  if (failCount > 0) {
    console.log('💡 Run the SQL fixes in database/fix-all-columns.sql\n');
  } else {
    console.log('🎉 All tables are properly configured!\n');
  }
}

auditTables().catch(console.error);
