const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zejensivaohvtkzufdou.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk'
);

async function addCourses() {
  // Course 1: How Downs Work
  const { data: course1, error: e1 } = await supabase.from('courses').insert({
    slug: 'how-downs-work',
    title: 'What are DOWNS in Football?',
    description: 'Finally understand the most confusing part of football. Learn what downs are, why teams get 4 chances, and what it all means for the game.',
    instructor_name: 'Kickoff Club HQ',
    category: 'general',
    difficulty_level: 'beginner',
    duration_minutes: 5,
    tier_required: 'free',
    is_published: true,
    order_index: 1
  }).select().single();

  if (e1) console.log('Course 1 error:', e1.message);
  else console.log('Added:', course1.title);

  // Course 2: Field Layout
  const { data: course2, error: e2 } = await supabase.from('courses').insert({
    slug: 'field-layout-basics',
    title: 'Football Field Layout',
    description: 'Learn how the football field works. Understand yard lines, end zones, and everything between in simple terms.',
    instructor_name: 'Kickoff Club HQ',
    category: 'general',
    difficulty_level: 'beginner',
    duration_minutes: 5,
    tier_required: 'free',
    is_published: true,
    order_index: 2
  }).select().single();

  if (e2) console.log('Course 2 error:', e2.message);
  else console.log('Added:', course2.title);

  // Course 3: Scoring
  const { data: course3, error: e3 } = await supabase.from('courses').insert({
    slug: 'scoring-touchdowns',
    title: 'How to Score in Football',
    description: 'Learn all the ways to score in football. Touchdowns, field goals, safeties, and everything in between explained simply.',
    instructor_name: 'Kickoff Club HQ',
    category: 'general',
    difficulty_level: 'beginner',
    duration_minutes: 4,
    tier_required: 'free',
    is_published: true,
    order_index: 3
  }).select().single();

  if (e3) console.log('Course 3 error:', e3.message);
  else console.log('Added:', course3.title);

  // Add lessons
  if (course1) {
    await supabase.from('lessons').insert({
      course_id: course1.id,
      title: 'What are DOWNS in Football?',
      slug: 'intro',
      description: 'The most confusing part of football, explained.',
      video_id: '2Crk_DZ0TDE',
      duration_seconds: 289,
      order_index: 1,
      is_free: true,
      is_published: true
    });
    console.log('Added lesson for:', course1.title);
  }

  if (course2) {
    await supabase.from('lessons').insert({
      course_id: course2.id,
      title: 'Football Field Layout',
      slug: 'intro',
      description: 'Understanding the field.',
      video_id: 'KEOxIkQxMDI',
      duration_seconds: 302,
      order_index: 1,
      is_free: true,
      is_published: true
    });
    console.log('Added lesson for:', course2.title);
  }

  if (course3) {
    await supabase.from('lessons').insert({
      course_id: course3.id,
      title: 'How to Score in Football',
      slug: 'intro',
      description: 'All the ways to score.',
      video_id: '2F_yl0lWj40',
      duration_seconds: 271,
      order_index: 1,
      is_free: true,
      is_published: true
    });
    console.log('Added lesson for:', course3.title);
  }

  // Check total courses
  const { data: all } = await supabase.from('courses').select('title, is_published');
  console.log('\nAll courses now:', all);
}

addCourses();
