const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLesson() {
  const lessonId = 'a7f758d0-bb50-4f0f-960a-3a7f0ef9878e';

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!lesson) {
    console.log('❌ Lesson not found');
    return;
  }

  console.log('✅ Lesson found:');
  console.log('   Title:', lesson.title);
  console.log('   Course ID:', lesson.course_id);
  console.log('   Video ID:', lesson.video_id);
  console.log('   Video URL:', lesson.video_url);
  console.log('   Is Free:', lesson.is_free);
  console.log('   Is Published:', lesson.is_published);
  console.log('   Duration:', lesson.duration_seconds, 'seconds');
}

checkLesson();
