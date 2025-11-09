const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  // Get all courses with lessons
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      is_published,
      difficulty_level,
      lessons(id, title, slug, order_index, is_published)
    `)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total courses:', courses.length);
  console.log('Published courses:', courses.filter(c => c.is_published).length);
  console.log('');

  courses.forEach(course => {
    const lessonCount = course.lessons?.length || 0;
    const publishedLessons = course.lessons?.filter(l => l.is_published).length || 0;
    console.log(`📚 ${course.title}`);
    console.log(`   Published: ${course.is_published}`);
    console.log(`   Difficulty: ${course.difficulty_level}`);
    console.log(`   Lessons: ${lessonCount} (published: ${publishedLessons})`);
    if (lessonCount > 0) {
      course.lessons.forEach(lesson => {
        console.log(`     - ${lesson.title} (published: ${lesson.is_published}, order: ${lesson.order_index})`);
      });
    }
    console.log('');
  });
})();
