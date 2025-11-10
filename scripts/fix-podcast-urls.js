const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixPodcastUrls() {
  console.log('🔧 Fixing podcast audio URLs...\n');

  // Correct R2 URLs without newlines
  const correctUrls = {
    1: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-01.m4a',
    2: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-02.m4a',
    3: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-03.m4a',
    4: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-04.m4a',
    5: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-05.m4a',
    6: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-06.m4a',
    7: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-07.m4a',
    8: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-08.m4a',
    9: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-09.m4a',
    10: 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-10.m4a',
  };

  let successCount = 0;
  let failCount = 0;

  for (const [episodeNum, correctUrl] of Object.entries(correctUrls)) {
    console.log(`Updating episode ${episodeNum}...`);

    const { data, error } = await supabase
      .from('podcasts')
      .update({ audio_url: correctUrl })
      .eq('episode_number', parseInt(episodeNum))
      .select();

    if (error) {
      console.error(`❌ Failed to update episode ${episodeNum}:`, error);
      failCount++;
    } else if (data && data.length > 0) {
      console.log(`✅ Updated episode ${episodeNum}`);
      successCount++;
    } else {
      console.log(`⚠️  No rows updated for episode ${episodeNum}`);
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  // Verify the updates
  console.log('\n🔍 Verifying updates...');
  const { data: podcasts, error: fetchError } = await supabase
    .from('podcasts')
    .select('episode_number, audio_url')
    .order('episode_number', { ascending: true });

  if (fetchError) {
    console.error('Error fetching podcasts:', fetchError);
  } else {
    podcasts.forEach(podcast => {
      const hasNewlines = podcast.audio_url.includes('\n');
      const isCorrect = podcast.audio_url === correctUrls[podcast.episode_number];
      console.log(`Episode ${podcast.episode_number}: ${isCorrect ? '✅' : '❌'} ${hasNewlines ? '(has newlines!)' : ''}`);
    });
  }
}

fixPodcastUrls().catch(console.error);
