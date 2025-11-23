const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk'
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
