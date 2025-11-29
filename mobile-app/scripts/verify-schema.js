// Quick script to verify database schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://goypzelcadgjjkkznzwu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveXB6ZWxjYWRnampra3puend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzIxODIsImV4cCI6MjA3OTAwODE4Mn0.BivpRWtQ_IodYANlg5KnGdT16_8YjbMiCfRmCOXfJFE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
  console.log('\n🔍 Verifying Database Schema...\n');

  // Test 1: Check if user_buildings table exists
  console.log('1. Testing user_buildings table...');
  const { data: buildings, error: buildingsError } = await supabase
    .from('user_buildings')
    .select('*')
    .limit(1);

  if (buildingsError) {
    console.log('   ❌ FAILED:', buildingsError.message);
  } else {
    console.log('   ✅ SUCCESS: user_buildings table exists');
  }

  // Test 2: Check if mission_templates table exists
  console.log('\n2. Testing mission_templates table...');
  const { data: templates, error: templatesError } = await supabase
    .from('mission_templates')
    .select('*')
    .limit(1);

  if (templatesError) {
    console.log('   ❌ FAILED:', templatesError.message);
  } else {
    console.log('   ✅ SUCCESS: mission_templates table exists');
  }

  // Test 3: Check if user_missions table exists
  console.log('\n3. Testing user_missions table...');
  const { data: missions, error: missionsError } = await supabase
    .from('user_missions')
    .select('*')
    .limit(1);

  if (missionsError) {
    console.log('   ❌ FAILED:', missionsError.message);
  } else {
    console.log('   ✅ SUCCESS: user_missions table exists');
  }

  // Test 4: Check profiles table for new columns
  console.log('\n4. Testing profiles table columns...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('knowledge_points, energy, last_energy_update')
    .limit(1);

  if (profileError) {
    console.log('   ❌ FAILED:', profileError.message);
  } else {
    console.log('   ✅ SUCCESS: profiles table has new columns');
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n💡 If tests failed, the schema cache needs refresh.');
  console.log('   Go to Supabase Dashboard → API Settings → Click "Reload Schema"');
  console.log('   Or wait a few minutes for automatic cache refresh.\n');
}

verifySchema().catch(console.error);
