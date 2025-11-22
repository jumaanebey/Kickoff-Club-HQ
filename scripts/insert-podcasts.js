const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const podcasts = [
  {
    episode_number: 1,
    title: 'What\'s Even Happening? Understanding the Basics',
    slug: 'episode-01-whats-even-happening',
    description: 'A beginner-friendly introduction to football fundamentals - breaking down the game for complete newcomers.',
    audio_url: 'podcasts/episode-01', // This will be converted to R2 signed URL
    duration: '15:00',
    publish_date: '2024-01-01',
    is_published: true
  },
  {
    episode_number: 2,
    title: 'Downs and Distance Explained',
    slug: 'episode-02-downs-and-distance',
    description: 'Deep dive into how downs work, why teams have four attempts, and what the yellow line really means.',
    audio_url: 'podcasts/episode-02',
    duration: '18:30',
    publish_date: '2024-01-08',
    is_published: true
  },
  {
    episode_number: 3,
    title: 'Offensive Positions Breakdown',
    slug: 'episode-03-offensive-positions',
    description: 'From quarterback to offensive line - understanding every position on offense and what they do.',
    audio_url: 'podcasts/episode-03',
    duration: '22:00',
    publish_date: '2024-01-15',
    is_published: true
  },
  {
    episode_number: 4,
    title: 'Defensive Schemes 101',
    slug: 'episode-04-defensive-schemes',
    description: 'Learn about 3-4 vs 4-3 defenses, zone vs man coverage, and how defenses try to stop the offense.',
    audio_url: 'podcasts/episode-04',
    duration: '20:15',
    publish_date: '2024-01-22',
    is_published: true
  },
  {
    episode_number: 5,
    title: 'Special Teams: The Third Phase',
    slug: 'episode-05-special-teams',
    description: 'Punts, field goals, kickoffs, and why special teams can win or lose games.',
    audio_url: 'podcasts/episode-05',
    duration: '16:45',
    publish_date: '2024-01-29',
    is_published: true
  },
  {
    episode_number: 6,
    title: 'Understanding Penalties',
    slug: 'episode-06-understanding-penalties',
    description: 'The most common penalties explained - from holding to pass interference and why refs throw flags.',
    audio_url: 'podcasts/episode-06',
    duration: '19:30',
    publish_date: '2024-02-05',
    is_published: true
  },
  {
    episode_number: 7,
    title: 'Clock Management and Two-Minute Drill',
    slug: 'episode-07-clock-management',
    description: 'How teams use timeouts, spike the ball, and manage the clock in crucial situations.',
    audio_url: 'podcasts/episode-07',
    duration: '17:20',
    publish_date: '2024-02-12',
    is_published: true
  },
  {
    episode_number: 8,
    title: 'The Quarterback Position Explained',
    slug: 'episode-08-quarterback-position',
    description: 'Why QBs get paid the most, what they do pre-snap, and how they read defenses.',
    audio_url: 'podcasts/episode-08',
    duration: '21:00',
    publish_date: '2024-02-19',
    is_published: true
  },
  {
    episode_number: 9,
    title: 'NFL Seasons, Playoffs, and the Super Bowl',
    slug: 'episode-09-nfl-seasons-playoffs',
    description: 'How the NFL season works, playoff structure, wild cards, and the road to the Super Bowl.',
    audio_url: 'podcasts/episode-09',
    duration: '23:15',
    publish_date: '2024-02-26',
    is_published: true
  },
  {
    episode_number: 10,
    title: 'Fantasy Football and Watching Games Like a Pro',
    slug: 'episode-10-fantasy-football-watching',
    description: 'Tips for watching games, understanding announcers, and getting started with fantasy football.',
    audio_url: 'podcasts/episode-10',
    duration: '25:00',
    publish_date: '2024-03-04',
    is_published: true
  }
]

async function insertPodcasts() {
  console.log('Inserting podcast episodes into database...\n')

  try {
    // Check if podcasts table exists
    const { data: existingPodcasts, error: checkError } = await supabase
      .from('podcasts')
      .select('episode_number')
      .limit(1)

    if (checkError) {
      console.error('Error checking podcasts table:', checkError.message)
      console.log('The podcasts table may not exist yet. Please create it first.')
      return
    }

    // Delete existing podcasts first (clean slate)
    const { error: deleteError } = await supabase
      .from('podcasts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.log('Note: Could not clear existing podcasts:', deleteError.message)
    }

    // Insert all podcasts
    for (const podcast of podcasts) {
      console.log(`Inserting Episode ${podcast.episode_number}: ${podcast.title}...`)

      const { data, error } = await supabase
        .from('podcasts')
        .insert([podcast])
        .select()

      if (error) {
        console.error(`  ❌ Error:`, error.message)
      } else {
        console.log(`  ✅ Inserted successfully`)
      }
    }

    // Verify all podcasts were inserted
    const { data: allPodcasts, error: verifyError } = await supabase
      .from('podcasts')
      .select('episode_number, title')
      .order('episode_number', { ascending: true })

    if (verifyError) {
      console.error('\nError verifying podcasts:', verifyError.message)
    } else {
      console.log(`\n✅ Successfully inserted ${allPodcasts.length} podcast episodes!`)
      console.log('\nPodcasts in database:')
      allPodcasts.forEach(p => {
        console.log(`  ${p.episode_number}. ${p.title}`)
      })
    }

    console.log('\n✅ Done! Visit http://localhost:3001/podcast to see them.')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

insertPodcasts()
