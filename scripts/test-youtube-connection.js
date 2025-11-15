const {getYouTubeClient} = require('./youtube-client');

async function testConnection() {
  console.log('🔍 Testing YouTube API connection...\n');

  try {
    const youtube = await getYouTubeClient();

    // Try a simple request
    console.log('📡 Making test API call...\n');

    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('✅ Connection successful!');
      console.log(`📺 Channel: ${channel.snippet.title}`);
      console.log(`👥 Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`🎬 Videos: ${channel.statistics.videoCount}\n`);
    } else {
      console.log('⚠️  No YouTube channel found for this account');
      console.log('   You may need to create a YouTube channel first.\n');
      console.log('   Visit: https://www.youtube.com/create_channel\n');
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nFull error:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

testConnection();
