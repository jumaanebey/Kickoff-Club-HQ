const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

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
