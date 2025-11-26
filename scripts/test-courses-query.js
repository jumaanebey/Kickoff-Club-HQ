const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    console.log('🔍 Testing Courses Query...\n');

    const { data: courses, error } = await supabase
        .from('courses')
        .select(`
            id, title, slug,
            lessons (id, title, duration_seconds, is_free, order_index)
        `)
        .eq('slug', 'football-fundamentals-101')
        .single();

    if (error) {
        console.error('❌ Error fetching course:', error.message);
        return;
    }

    console.log('Course:', courses.title);
    if (courses.lessons && courses.lessons.length > 0) {
        console.log(`✅ Found ${courses.lessons.length} lessons`);
        console.log('First lesson:', courses.lessons[0]);
    } else {
        console.log('❌ No lessons found in query result!');
        console.log('Structure:', JSON.stringify(courses, null, 2));
    }
})();
