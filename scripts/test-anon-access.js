require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonAccess() {
  console.log('🔍 Testing anon key access to courses...\n');

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Details:', error);
    return;
  }

  console.log(`✅ SUCCESS: Fetched ${data.length} courses\n`);

  data.forEach(course => {
    console.log(`- ${course.difficulty_level}: ${course.title}`);
  });
}

testAnonAccess();
