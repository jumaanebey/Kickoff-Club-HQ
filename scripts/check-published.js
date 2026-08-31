require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPublished() {
  const { data, error } = await supabase
    .from('courses')
    .select('slug, title, is_published, difficulty_level, order_index')
    .order('order_index');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total courses:', data.length);
  console.log('\nCourse Status:\n');

  data.forEach(course => {
    const status = course.is_published ? '✅ PUBLISHED' : '❌ DRAFT';
    console.log(`${status} | ${course.difficulty_level?.padEnd(12)} | ${course.slug}`);
  });

  const published = data.filter(c => c.is_published);
  const drafts = data.filter(c => !c.is_published);

  console.log(`\n📊 Summary:`);
  console.log(`   Published: ${published.length}`);
  console.log(`   Drafts: ${drafts.length}`);
}

checkPublished();
