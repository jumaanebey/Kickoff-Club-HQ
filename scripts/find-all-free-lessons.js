const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

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
