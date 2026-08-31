require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLesson() {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, video_id, video_url, is_free, is_published')
    .eq('id', 'a7f758d0-bb50-4f0f-960a-3a7f0ef9878e')
    .single();

  console.log('📹 How Downs Work Lesson:');
  console.log('   Title:', lesson.title);
  console.log('   Video ID:', lesson.video_id);
  console.log('   Video URL:', lesson.video_url);
  console.log('   Is Free:', lesson.is_free);
  console.log('   Is Published:', lesson.is_published);
  console.log('\n✅ Video field should be: "how-downs-work"');
  console.log('   Current value:', lesson.video_id || lesson.video_url);
  console.log('   Match:', (lesson.video_id === 'how-downs-work' || lesson.video_url === 'how-downs-work') ? '✅ YES' : '⚠️ NEEDS UPDATE');
}

checkLesson();
