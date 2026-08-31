require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkFreeLesson(courseSlug, lessonVideoId) {
  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', courseSlug)
    .single();

  if (!course) {
    console.log(`❌ Course not found: ${courseSlug}\n`);
    return;
  }

  // Get lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .single();

  console.log(`\n📚 Course: ${course.title} (${course.slug})`);

  if (!lesson) {
    console.log(`❌ No lesson found for this course`);
    return;
  }

  console.log(`✅ Lesson: ${lesson.title}`);
  console.log(`   ID: ${lesson.id}`);
  console.log(`   Video ID in DB: ${lesson.video_id || lesson.video_url}`);
  console.log(`   Expected: ${lessonVideoId}`);
  console.log(`   Match: ${(lesson.video_id === lessonVideoId || lesson.video_url === lessonVideoId) ? '✅ YES' : '⚠️  NEEDS UPDATE'}`);
  console.log(`   Free: ${lesson.is_free ? '✅ Yes' : '❌ No'}`);
  console.log(`   Published: ${lesson.is_published ? '✅ Yes' : '❌ No'}`);
  console.log(`\n   🔗 Lesson URL: https://kickoff-club-hq.vercel.app/courses/${course.slug}/lessons/${lesson.id}`);
}

async function checkAll() {
  console.log('🔍 Checking Free Lesson Connections...\n');

  await checkFreeLesson('how-downs-work', 'how-downs-work');
  await checkFreeLesson('scoring-touchdowns', 'scoring-touchdowns');
  await checkFreeLesson('field-layout-basics', 'field-layout-basics');
}

checkAll();
