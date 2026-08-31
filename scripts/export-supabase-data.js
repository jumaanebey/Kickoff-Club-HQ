require('dotenv').config({ path: '.env.local' });
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    const report = {
        timestamp: new Date().toISOString(),
        database: 'zejensivaohvtkzufdou.supabase.co',
        tables: {}
    };

    console.log('📊 Exporting Supabase Data...\n');

    // 1. Courses
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .order('created_at');

    report.tables.courses = {
        count: courses?.length || 0,
        data: courses
    };
    console.log(`✅ Courses: ${courses?.length || 0}`);

    // 2. Lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .order('course_id, order_index');

    report.tables.lessons = {
        count: lessons?.length || 0,
        data: lessons
    };
    console.log(`✅ Lessons: ${lessons?.length || 0}`);

    // 3. Podcast Episodes
    const { data: episodes } = await supabase
        .from('podcast_episodes')
        .select('*')
        .order('episode_number');

    report.tables.podcast_episodes = {
        count: episodes?.length || 0,
        data: episodes
    };
    console.log(`✅ Podcast Episodes: ${episodes?.length || 0}`);

    // 4. Games
    const { data: games } = await supabase
        .from('games')
        .select('*')
        .order('created_at');

    report.tables.games = {
        count: games?.length || 0,
        data: games
    };
    console.log(`✅ Games: ${games?.length || 0}`);

    // Save to file
    const filename = 'supabase_data_export.json';
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));

    console.log(`\n📁 Full export saved to: ${filename}`);
    console.log('\n' + '='.repeat(60));
    console.log('DETAILED BREAKDOWN');
    console.log('='.repeat(60) + '\n');

    // Courses breakdown
    console.log('📚 COURSES:\n');
    courses?.forEach((c, i) => {
        console.log(`${i + 1}. ${c.title}`);
        console.log(`   Slug: ${c.slug}`);
        console.log(`   Category: ${c.category}`);
        console.log(`   Tier: ${c.tier_required}`);
        console.log(`   Published: ${c.is_published}`);
        console.log(`   Thumbnail: ${c.thumbnail_url || 'NONE'}`);
        console.log('');
    });

    // Lessons breakdown by course
    console.log('\n📖 LESSONS:\n');
    const courseMap = {};
    courses?.forEach(c => {
        courseMap[c.id] = c.title;
    });

    const lessonsByCourse = {};
    lessons?.forEach(l => {
        const courseTitle = courseMap[l.course_id] || 'Unknown Course';
        if (!lessonsByCourse[courseTitle]) {
            lessonsByCourse[courseTitle] = [];
        }
        lessonsByCourse[courseTitle].push(l);
    });

    Object.entries(lessonsByCourse).forEach(([courseTitle, courseLessons]) => {
        console.log(`\n📘 ${courseTitle} (${courseLessons.length} lessons):`);
        courseLessons.forEach(l => {
            const hasVideo = l.video_id || l.video_url;
            const videoIcon = hasVideo ? '✅' : '❌';
            const freeIcon = l.is_free ? '🆓' : '🔒';
            console.log(`  ${l.order_index}. ${videoIcon} ${freeIcon} ${l.title}`);
            if (l.video_id) console.log(`     video_id: ${l.video_id}`);
            if (l.video_url) console.log(`     video_url: ${l.video_url}`);
        });
    });

    // Podcast episodes
    if (episodes && episodes.length > 0) {
        console.log('\n\n🎙️ PODCAST EPISODES:\n');
        episodes.forEach(e => {
            console.log(`${e.episode_number}. ${e.title}`);
            console.log(`   Audio: ${e.audio_url || 'NONE'}`);
            console.log(`   Published: ${e.is_published}`);
            console.log('');
        });
    }

    // Games
    if (games && games.length > 0) {
        console.log('\n🎮 GAMES:\n');
        games.forEach(g => {
            console.log(`- ${g.title} (${g.slug})`);
            console.log(`  Description: ${g.description}`);
            console.log(`  Published: ${g.is_published}`);
            console.log('');
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Export complete!');
    console.log('='.repeat(60));
})();
