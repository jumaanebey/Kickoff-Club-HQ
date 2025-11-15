const {getYouTubeClient} = require('./youtube-client');

/**
 * Get channel analytics
 */
async function getAnalytics() {
  console.log('📊 YouTube Channel Analytics\n');

  try {
    const youtube = await getYouTubeClient();

    // Get channel info
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      return;
    }

    const channel = channelResponse.data.items[0];
    const stats = channel.statistics;

    console.log('📺 Channel Overview');
    console.log(`   Name: ${channel.snippet.title}`);
    console.log(`   Subscribers: ${Number(stats.subscriberCount).toLocaleString()}`);
    console.log(`   Total Videos: ${Number(stats.videoCount).toLocaleString()}`);
    console.log(`   Total Views: ${Number(stats.viewCount).toLocaleString()}\n`);

    // Get recent videos
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const playlistResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    });

    console.log('📹 Recent Videos (Last 10)\n');

    for (const item of playlistResponse.data.items) {
      const videoId = item.snippet.resourceId.videoId;

      // Get video statistics
      const videoResponse = await youtube.videos.list({
        part: 'statistics,contentDetails',
        id: videoId,
      });

      if (videoResponse.data.items && videoResponse.data.items.length > 0) {
        const video = videoResponse.data.items[0];
        const videoStats = video.statistics;

        console.log(`   ${item.snippet.title}`);
        console.log(`   ID: ${videoId}`);
        console.log(`   Views: ${Number(videoStats.viewCount || 0).toLocaleString()}`);
        console.log(`   Likes: ${Number(videoStats.likeCount || 0).toLocaleString()}`);
        console.log(`   Comments: ${Number(videoStats.commentCount || 0).toLocaleString()}`);
        console.log(`   Published: ${new Date(item.snippet.publishedAt).toLocaleDateString()}`);
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Failed to fetch analytics:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  getAnalytics();
}

module.exports = {getAnalytics};
