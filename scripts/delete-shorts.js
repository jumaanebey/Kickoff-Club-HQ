const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

// The 10 Shorts that were uploaded
const UPLOADED_SHORTS = [
  'downs-intro',
  'first-down-explained',
  'field-zones',
  'end-zone-explained',
  'touchdown-basics',
  'extra-point-explained',
  'field-goal-basics',
  'safety-explained',
  'two-point-conversion',
  'offensive-positions',
];

async function deleteShorts() {
  console.log('🗑️  YOUTUBE SHORTS DELETION\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    // Get channel uploads
    const channelResponse = await youtube.channels.list({
      part: 'contentDetails',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      process.exit(1);
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Get all uploaded videos
    let allVideos = [];
    let nextPageToken = null;

    console.log('📹 Fetching uploaded videos...\n');

    do {
      const playlistResponse = await youtube.playlistItems.list({
        part: 'contentDetails,snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      allVideos = allVideos.concat(playlistResponse.data.items);
      nextPageToken = playlistResponse.data.nextPageToken;
    } while (nextPageToken);

    console.log(`Found ${allVideos.length} total videos on channel\n`);

    // Filter for Shorts (videos under 60 seconds with #Shorts in title/description)
    const shorts = [];

    for (const video of allVideos) {
      const videoId = video.contentDetails.videoId;

      // Get video details to check duration
      const videoResponse = await youtube.videos.list({
        part: 'contentDetails,snippet',
        id: videoId,
      });

      if (videoResponse.data.items && videoResponse.data.items.length > 0) {
        const videoDetails = videoResponse.data.items[0];
        const duration = videoDetails.contentDetails.duration;
        const title = videoDetails.snippet.title;
        const description = videoDetails.snippet.description;

        // Parse ISO 8601 duration (e.g., PT45S = 45 seconds)
        const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
        const minutes = parseInt(match[1] || 0);
        const seconds = parseInt(match[2] || 0);
        const totalSeconds = minutes * 60 + seconds;

        // Check if it's a Short (under 60 seconds or has #Shorts tag)
        const isShort = totalSeconds <= 60 || title.includes('#Shorts') || description.includes('#Shorts');

        if (isShort) {
          shorts.push({
            videoId,
            title,
            duration: totalSeconds,
          });
        }
      }
    }

    console.log(`🎬 Found ${shorts.length} Shorts:\n`);

    shorts.forEach((short, index) => {
      console.log(`   ${index + 1}. ${short.title} (${short.duration}s)`);
      console.log(`      ID: ${short.videoId}`);
    });

    console.log('\n══════════════════════════════════════════════════════\n');

    if (shorts.length === 0) {
      console.log('✅ No Shorts found to delete\n');
      return;
    }

    console.log('⚠️  WARNING: You are about to DELETE these videos!\n');
    console.log('   This action CANNOT be undone.\n');
    console.log('   Press Ctrl+C now to cancel, or wait 10 seconds to proceed...\n');

    // Wait 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('🗑️  Starting deletion...\n');

    let deleted = 0;
    let errors = 0;

    for (const [index, short] of shorts.entries()) {
      try {
        console.log(`Deleting ${index + 1}/${shorts.length}: ${short.title}`);

        await youtube.videos.delete({
          id: short.videoId,
        });

        console.log(`   ✅ Deleted\n`);
        deleted++;

        // Wait 1 second between deletions
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
        errors++;
      }
    }

    console.log('══════════════════════════════════════════════════════');
    console.log('\n📊 DELETION SUMMARY\n');
    console.log(`Total Shorts: ${shorts.length}`);
    console.log(`Deleted: ${deleted} ✅`);
    console.log(`Errors: ${errors} ❌\n`);

    if (deleted > 0) {
      console.log('🎉 Shorts deleted successfully!\n');
    }

  } catch (error) {
    console.error('❌ Deletion failed:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

deleteShorts();
