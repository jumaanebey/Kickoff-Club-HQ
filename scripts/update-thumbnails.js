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

const updates = [
    { slug: 'understanding-downs-distance', thumbnail_url: '/images/courses/downs.jpg' },
    { slug: 'field-positions-masterclass', thumbnail_url: '/images/courses/positions.jpg' },
    { slug: 'offensive-strategy-guide', thumbnail_url: '/images/courses/offense.jpg' },
    { slug: 'defensive-schemes-explained', thumbnail_url: '/images/courses/defense.jpg' },
    { slug: 'special-teams-third-phase', thumbnail_url: '/images/courses/special-teams.jpg' },
    { slug: 'quarterback-elite-training', thumbnail_url: '/images/courses/qb.jpg' },
    { slug: 'linebacker-captain-defense', thumbnail_url: '/images/courses/lb.jpg' },
    { slug: 'wide-receiver-route-tree', thumbnail_url: '/images/courses/wr.jpg' },
    { slug: 'common-penalties-explained', thumbnail_url: '/images/courses/penalties.jpg' },
    { slug: 'clock-management-mastery', thumbnail_url: '/images/courses/clock.jpg' },
    { slug: 'offensive-formations-101', thumbnail_url: '/images/courses/formations.jpg' },
    { slug: 'defensive-coverages-cover-1-4', thumbnail_url: '/images/courses/coverages.jpg' },
    { slug: 'history-of-football', thumbnail_url: '/images/courses/history.jpg' },
    { slug: 'football-equipment-guide', thumbnail_url: '/images/courses/equipment.jpg' }
];

(async () => {
    console.log('🖼️ Updating course thumbnails...\n');

    for (const update of updates) {
        const { error } = await supabase
            .from('courses')
            .update({ thumbnail_url: update.thumbnail_url })
            .eq('slug', update.slug);

        if (error) {
            console.error(`❌ Error updating ${update.slug}:`, error.message);
        } else {
            console.log(`✅ Updated ${update.slug}`);
        }
    }

    console.log('\n✨ All thumbnails updated!');
})();
