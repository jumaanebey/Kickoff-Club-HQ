const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    console.log('🔍 Verifying Lesson Video Configuration...\n');

    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('title, slug, video_id, video_url')
        .order('order_index');

    if (error) {
        console.error('❌ Error fetching lessons:', error.message);
        return;
    }

    console.log('Title | Video ID (R2) | Video URL (Local)');
    console.log('--- | --- | ---');

    lessons.forEach(l => {
        const r2Status = l.video_id ? '✅ ' + l.video_id : '❌ MISSING';
        const localStatus = l.video_url ? '⚠️ ' + l.video_url : '✅ NULL';
        console.log(`${l.title.padEnd(30)} | ${r2Status.padEnd(25)} | ${localStatus}`);
    });

    const allCorrect = lessons.every(l => l.video_id && !l.video_url);

    console.log('\n' + '='.repeat(50));
    if (allCorrect) {
        console.log('✅ VERIFICATION PASSED: All lessons are using R2 and have no local URL.');
    } else {
        console.log('❌ VERIFICATION FAILED: Some lessons have incorrect configuration.');
    }
})();
