require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixThumbnail() {
  const { data, error } = await supabase
    .from('courses')
    .update({ thumbnail_url: '/images/courses/defensive-positions.jpg' })
    .eq('slug', 'defensive-positions')
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Updated defensive-positions thumbnail');
    console.log('   New URL:', data[0].thumbnail_url);
  }
}

fixThumbnail();
