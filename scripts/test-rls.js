const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use ANON key to simulate client-side fetch (RLS applies)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
    console.log('🔍 Testing RLS policies for Lessons...\n');

    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id, title, course_id')
        .limit(5);

    if (error) {
        console.error('❌ Error fetching lessons (RLS likely blocking):', error.message);
        console.error('   Code:', error.code);
        console.error('   Details:', error.details);
    } else {
        console.log(`✅ Successfully fetched ${lessons.length} lessons with Anon key.`);
        if (lessons.length > 0) {
            console.log('   Sample:', lessons[0].title);
        } else {
            console.log('   ⚠️  Fetched 0 lessons. Table might be empty or RLS hides all rows.');
        }
    }
})();
