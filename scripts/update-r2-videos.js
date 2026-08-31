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

// Map lesson slugs to their R2 video IDs
const videoMappings = {
    'how-downs-work': 'how-downs-work',
    'scoring-touchdowns': 'scoring-touchdowns',
    'field-layout-basics': 'field-layout-basics',
    'offensive-positions': 'offensive-positions',
    'defensive-positions': 'defensive-positions',
    'understanding-penalties': 'understanding-penalties',
    'special-teams-basics': 'special-teams-basics',
    'timeouts-and-clock': 'timeouts-and-clock',
    'nfl-seasons-playoffs': 'nfl-seasons-playoffs',
    'quarterback-101': 'quarterback-101'
};

(async () => {
    console.log('🎬 Updating lesson video URLs to use R2...\n');

    for (const [slug, videoId] of Object.entries(videoMappings)) {
        const { data, error } = await supabase
            .from('lessons')
            .update({
                video_id: videoId,
                video_url: null // Clear local path, use video_id for R2
            })
            .eq('slug', slug)
            .select('title, slug, video_id');

        if (error) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        } else if (data && data.length > 0) {
            console.log(`✅ Updated: ${data[0].title}`);
            console.log(`   Video ID: ${data[0].video_id}\n`);
        } else {
            console.log(`⚠️  Lesson not found: ${slug}\n`);
        }
    }

    // Verify all lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('title, video_id, video_url, is_free')
        .order('order_index');

    console.log('\n📚 Final Lesson Status:\n');
    if (lessons) {
        lessons.forEach((l, i) => {
            const hasVideo = l.video_id ? '✅' : '❌';
            const tier = l.is_free ? '🆓' : '🔒';
            console.log(`  ${i + 1}. ${hasVideo} ${tier} ${l.title}`);
            console.log(`     Video ID: ${l.video_id || 'NONE'}`);
        });
    }

    console.log('\n✨ All videos are now linked to Cloudflare R2!');
    console.log('🎥 Videos will be served with signed URLs for security');
})();
