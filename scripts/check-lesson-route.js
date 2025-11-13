const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRoute() {
  const courseSlug = 'how-downs-work';
  const lessonId = 'a7f758d0-bb50-4f0f-960a-3a7f0ef9878e';

  // Check course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, slug, title')
    .eq('slug', courseSlug)
    .single();

  console.log('Course:', course ? '✅ Found' : '❌ Not found');
  if (course) {
    console.log('  Slug:', course.slug);
    console.log('  Title:', course.title);
    console.log('  ID:', course.id);
  }
  if (courseError) {
    console.log('  Error:', courseError.message);
  }

  // Check lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, course_id, is_published')
    .eq('id', lessonId)
    .single();

  console.log('\nLesson:', lesson ? '✅ Found' : '❌ Not found');
  if (lesson) {
    console.log('  ID:', lesson.id);
    console.log('  Title:', lesson.title);
    console.log('  Course ID:', lesson.course_id);
    console.log('  Published:', lesson.is_published);
    console.log('  Matches course:', lesson.course_id === course?.id ? '✅ Yes' : '❌ No');
  }
  if (lessonError) {
    console.log('  Error:', lessonError.message);
  }

  // Suggest correct URL
  if (course && lesson) {
    console.log('\n✅ Correct URL:');
    console.log(`   https://kickoff-club-hq.vercel.app/courses/${course.slug}/lessons/${lesson.id}`);
  }
}

checkRoute();
