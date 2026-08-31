require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkThumbnails() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('slug, title, thumbnail_url')
    .order('order_index');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Course thumbnails:\n');
  courses.forEach(course => {
    console.log(`${course.slug}:`);
    console.log(`  ${course.thumbnail_url}\n`);
  });
}

checkThumbnails();
