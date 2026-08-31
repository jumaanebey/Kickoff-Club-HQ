require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findAllFreeLessons() {
  console.log('🔍 Finding all FREE lessons...\n');

  // Get all free lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, course_id, video_id, video_url, is_free, is_published, order_index')
    .eq('is_free', true)
    .eq('is_published', true)
    .order('title');

  if (!lessons || lessons.length === 0) {
    console.log('❌ No free lessons found');
    return;
  }

  console.log(`Found ${lessons.length} free lessons:\n`);

  for (const lesson of lessons) {
    // Get course info
    const { data: course } = await supabase
      .from('courses')
      .select('slug, title')
      .eq('id', lesson.course_id)
      .single();

    console.log(`📚 ${lesson.title}`);
    console.log(`   Course: ${course?.title} (${course?.slug})`);
    console.log(`   Lesson ID: ${lesson.id}`);
    console.log(`   Video: ${lesson.video_id || lesson.video_url}`);
    console.log(`   URL: https://kickoff-club-hq.vercel.app/courses/${course?.slug}/lessons/${lesson.id}`);
    console.log('');
  }
}

findAllFreeLessons();
