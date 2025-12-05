const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzE0NSwiZXhwIjoyMDc3NzczMTQ1fQ.mjfA8YykX6P9qH_WP6ExdTPIK6kzsfjt6-ay2lqBELk'
);

const episodes = [
    {
        episode_number: 1,
        title: 'The Kickoff - Introduction to Football',
        slug: 'the-kickoff-intro',
        description: 'Welcome to Kickoff Club HQ! In this first episode, we break down the absolute basics of American Football. Perfect for total beginners.',
        audio_url: 'podcasts/episode-01.m4a',
        duration: '15:30',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 2,
        title: 'The Quarterback Mindset',
        slug: 'quarterback-mindset',
        description: 'What goes through a QBs mind before the snap? We discuss the mental side of the most important position in sports.',
        audio_url: 'podcasts/episode-02.m4a',
        duration: '18:45',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 3,
        title: 'Defense Wins Championships',
        slug: 'defense-wins-championships',
        description: 'Why do they say defense wins championships? We explore defensive strategies and key positions.',
        audio_url: 'podcasts/episode-03.m4a',
        duration: '22:10',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 4,
        title: 'The Art of the Catch',
        slug: 'art-of-the-catch',
        description: 'Wide receivers are some of the most athletic players on the field. We talk about route running and making the big play.',
        audio_url: 'podcasts/episode-04.m4a',
        duration: '19:20',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 5,
        title: 'Offensive Line: The Unsung Heroes',
        slug: 'offensive-line-unsung-heroes',
        description: 'They don\'t get the glory, but the game is won in the trenches. Learn about the offensive line.',
        audio_url: 'podcasts/episode-05.m4a',
        duration: '25:00',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 6,
        title: 'Special Teams Strategy',
        slug: 'special-teams-strategy',
        description: 'Field goals, punts, and kickoffs. The third phase of the game is often overlooked but crucial.',
        audio_url: 'podcasts/episode-06.m4a',
        duration: '16:45',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 7,
        title: 'Coaching Philosophy',
        slug: 'coaching-philosophy',
        description: 'How do coaches prepare for a game? We discuss game planning and adjustments.',
        audio_url: 'podcasts/episode-07.m4a',
        duration: '28:15',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 8,
        title: 'NFL vs College Rules',
        slug: 'nfl-vs-college-rules',
        description: 'One foot in or two? We break down the major differences between Saturday and Sunday football.',
        audio_url: 'podcasts/episode-08.m4a',
        duration: '21:30',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 9,
        title: 'Fantasy Football Basics',
        slug: 'fantasy-football-basics',
        description: 'Want to join your office league? Here is what you need to know to draft a winning team.',
        audio_url: 'podcasts/episode-09.m4a',
        duration: '24:50',
        publish_date: new Date().toISOString(),
        is_published: true
    },
    {
        episode_number: 10,
        title: 'Super Bowl History',
        slug: 'super-bowl-history',
        description: 'The biggest game in sports. We look back at the most memorable moments in Super Bowl history.',
        audio_url: 'podcasts/episode-10.m4a',
        duration: '30:00',
        publish_date: new Date().toISOString(),
        is_published: true
    }
];

(async () => {
    console.log('🎙️ Inserting 10 Podcast Episodes...\n');

    // Delete existing podcasts to avoid conflicts
    const { error: deleteError } = await supabase.from('podcasts').delete().neq('episode_number', 0); // Delete all
    if (deleteError) {
        console.log('⚠️ Warning deleting podcasts:', deleteError.message);
    } else {
        console.log('🗑️ Cleared existing podcasts');
    }

    const { data, error } = await supabase
        .from('podcasts')
        .upsert(episodes, { onConflict: 'slug' })
        .select();

    if (error) {
        console.error('❌ Error inserting podcasts:', error.message);
        process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} episodes!`);

    data.forEach(ep => {
        console.log(`   Ep ${ep.episode_number}: ${ep.title} (${ep.audio_url})`);
    });
})();
