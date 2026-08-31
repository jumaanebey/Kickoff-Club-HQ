require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lessons = [
    {
        title: 'How Downs Work',
        slug: 'how-downs-work',
        description: 'The foundation of football - understanding the down system and how teams advance the ball',
        video_url: '/videos/how-downs-work.mp4',
        video_id: 'how-downs-work',
        duration_seconds: 60,
        order_index: 1,
        is_free: true,
        is_published: true
    },
    {
        title: 'Scoring Touchdowns',
        slug: 'scoring-touchdowns',
        description: 'Learn how teams score the most exciting plays in football - the touchdown and what happens after',
        video_id: 'scoring-touchdowns',
        duration_seconds: 90,
        order_index: 2,
        is_free: true,
        is_published: true
    },
    {
        title: 'Field Layout Basics',
        slug: 'field-layout-basics',
        description: 'Understanding the football field - yard lines, end zones, and where everything happens',
        video_id: 'field-layout-basics',
        duration_seconds: 120,
        order_index: 3,
        is_free: true,
        is_published: true
    },
    {
        title: 'Offensive Positions',
        slug: 'offensive-positions',
        description: 'Meet the offensive players - quarterbacks, running backs, receivers, and the offensive line',
        video_id: 'offensive-positions',
        duration_seconds: 180,
        order_index: 4,
        is_free: false,
        is_published: true
    },
    {
        title: 'Defensive Positions',
        slug: 'defensive-positions',
        description: 'Understanding defensive players - linemen, linebackers, and defensive backs',
        video_id: 'defensive-positions',
        duration_seconds: 180,
        order_index: 5,
        is_free: false,
        is_published: true
    },
    {
        title: 'Understanding Penalties',
        slug: 'understanding-penalties',
        description: 'Common penalties explained - holding, offsides, pass interference and what those flags mean',
        video_id: 'understanding-penalties',
        duration_seconds: 150,
        order_index: 6,
        is_free: false,
        is_published: true
    },
    {
        title: 'Special Teams Basics',
        slug: 'special-teams-basics',
        description: 'Kickoffs, punts, field goals - understanding the third phase of football',
        video_id: 'special-teams-basics',
        duration_seconds: 120,
        order_index: 7,
        is_free: false,
        is_published: true
    },
    {
        title: 'Timeouts and Clock Management',
        slug: 'timeouts-and-clock',
        description: 'How the game clock works, timeouts, and why clock management matters in crucial moments',
        video_id: 'timeouts-and-clock',
        duration_seconds: 150,
        order_index: 8,
        is_free: false,
        is_published: true
    },
    {
        title: 'NFL Seasons and Playoffs',
        slug: 'nfl-seasons-playoffs',
        description: 'Regular season, playoffs, and the road to the Super Bowl - understanding the NFL structure',
        video_id: 'nfl-seasons-playoffs',
        duration_seconds: 180,
        order_index: 9,
        is_free: false,
        is_published: true
    },
    {
        title: 'Quarterback 101',
        slug: 'quarterback-101',
        description: 'The most important position in football - what quarterbacks do and why they matter',
        video_id: 'quarterback-101',
        duration_seconds: 120,
        order_index: 10,
        is_free: false,
        is_published: true
    }
];

(async () => {
    // Get Football Fundamentals course ID
    const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', 'football-fundamentals-101')
        .single();

    if (!course) {
        console.error('❌ Course "football-fundamentals-101" not found!');
        process.exit(1);
    }

    console.log(`✅ Found course: ${course.id}`);
    console.log(`\n📝 Adding 10 lessons...\n`);

    // Add course_id to each lesson
    const lessonsWithCourse = lessons.map(l => ({ ...l, course_id: course.id }));

    // Insert lessons
    const { data, error } = await supabase
        .from('lessons')
        .upsert(lessonsWithCourse, { onConflict: 'course_id,slug' });

    if (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }

    console.log('✅ Successfully added 10 lessons!\n');

    // Verify
    const { data: inserted } = await supabase
        .from('lessons')
        .select('title, video_url, is_free')
        .eq('course_id', course.id)
        .order('order_index');

    console.log(`📚 Total lessons: ${inserted?.length || 0}\n`);
    if (inserted) {
        inserted.forEach((l, i) => {
            const hasVideo = l.video_url ? '✅' : '❌';
            const tier = l.is_free ? '🆓' : '🔒';
            console.log(`  ${i + 1}. ${hasVideo} ${tier} ${l.title}`);
        });
    }

    console.log('\n🎬 Video status:');
    console.log('  ✅ Lesson 1 has video: /videos/how-downs-work.mp4');
    console.log('  ❌ Lessons 2-10 need videos uploaded');
})();
