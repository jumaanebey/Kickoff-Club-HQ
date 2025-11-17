const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/youtube-token.json');
const HISTORY_PATH = path.join(__dirname, '../../logs/youtube-analytics-history.json');

async function getYouTubeAnalytics() {
  console.log('📊 YOUTUBE ANALYTICS REPORT\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
    const youtubeAnalytics = google.youtubeAnalytics({version: 'v2', auth: oAuth2Client});

    // Get channel info
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      process.exit(1);
    }

    const channel = channelResponse.data.items[0];
    const stats = channel.statistics;

    console.log(`📺 CHANNEL: ${channel.snippet.title}`);
    console.log(`   @${channel.snippet.customUrl || 'N/A'}`);
    console.log(`   ID: ${channel.id}\n`);

    // Current statistics
    console.log('📈 CURRENT STATS:\n');
    console.log(`   Subscribers: ${parseInt(stats.subscriberCount).toLocaleString()}`);
    console.log(`   Total Views: ${parseInt(stats.viewCount).toLocaleString()}`);
    console.log(`   Videos: ${parseInt(stats.videoCount).toLocaleString()}\n`);

    // Get analytics for last 28 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    const analyticsResponse = await youtubeAnalytics.reports.query({
      ids: 'channel==MINE',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost',
      dimensions: 'day',
      sort: 'day',
    });

    const rows = analyticsResponse.data.rows || [];

    // Calculate 28-day totals
    let totalViews = 0;
    let totalWatchTime = 0;
    let totalSubsGained = 0;
    let totalSubsLost = 0;

    rows.forEach(row => {
      totalViews += row[1];
      totalWatchTime += row[2];
      totalSubsGained += row[4];
      totalSubsLost += row[5];
    });

    console.log('📅 LAST 28 DAYS:\n');
    console.log(`   Views: ${totalViews.toLocaleString()}`);
    console.log(`   Watch Time: ${(totalWatchTime / 60).toFixed(1)} hours`);
    console.log(`   Avg View Duration: ${rows.length > 0 ? (rows[rows.length - 1][3] / 60).toFixed(1) : 0} minutes`);
    console.log(`   Subscribers Gained: +${totalSubsGained}`);
    console.log(`   Subscribers Lost: -${totalSubsLost}`);
    console.log(`   Net Subscribers: ${totalSubsGained - totalSubsLost >= 0 ? '+' : ''}${totalSubsGained - totalSubsLost}\n`);

    // Get top videos
    const topVideosResponse = await youtubeAnalytics.reports.query({
      ids: 'channel==MINE',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      metrics: 'views,estimatedMinutesWatched',
      dimensions: 'video',
      sort: '-views',
      maxResults: 5,
    });

    if (topVideosResponse.data.rows && topVideosResponse.data.rows.length > 0) {
      console.log('🏆 TOP 5 VIDEOS (Last 28 Days):\n');

      for (const row of topVideosResponse.data.rows) {
        const videoId = row[0];
        const views = row[1];
        const watchTime = row[2];

        // Get video title
        const videoResponse = await youtube.videos.list({
          part: 'snippet',
          id: videoId,
        });

        const title = videoResponse.data.items?.[0]?.snippet?.title || 'Unknown';

        console.log(`   ${title}`);
        console.log(`      Views: ${views.toLocaleString()} | Watch Time: ${(watchTime / 60).toFixed(1)} hrs\n`);
      }
    }

    // Load history
    let history = [];
    if (fs.existsSync(HISTORY_PATH)) {
      history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8'));
    }

    // Add current data point
    const dataPoint = {
      timestamp: new Date().toISOString(),
      subscribers: parseInt(stats.subscriberCount),
      totalViews: parseInt(stats.viewCount),
      videos: parseInt(stats.videoCount),
      last28Days: {
        views: totalViews,
        watchTimeMinutes: totalWatchTime,
        subsGained: totalSubsGained,
        subsLost: totalSubsLost,
      },
    };

    history.push(dataPoint);

    // Keep only last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    history = history.filter(point => new Date(point.timestamp) > ninetyDaysAgo);

    // Calculate growth trends
    if (history.length > 1) {
      const previousPoint = history[history.length - 2];
      const subGrowth = dataPoint.subscribers - previousPoint.subscribers;
      const viewGrowth = dataPoint.totalViews - previousPoint.totalViews;

      console.log('📊 GROWTH (Since Last Report):\n');
      console.log(`   Subscribers: ${subGrowth >= 0 ? '+' : ''}${subGrowth}`);
      console.log(`   Total Views: +${viewGrowth.toLocaleString()}\n`);
    }

    // Save history
    fs.mkdirSync(path.dirname(HISTORY_PATH), {recursive: true});
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));

    console.log('══════════════════════════════════════════════════════');
    console.log(`\n📁 Report saved to: logs/youtube-analytics-history.json`);
    console.log(`📊 Tracking ${history.length} data points\n`);

  } catch (error) {
    console.error('❌ Analytics failed:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

getYouTubeAnalytics();
