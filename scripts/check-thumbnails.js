const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

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
