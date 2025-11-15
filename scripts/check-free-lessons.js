const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

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
