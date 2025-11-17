const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/youtube-token.json');

// Website link to add to all descriptions
const WEBSITE_URL = 'https://kickoffclubhq.com';
const DESCRIPTION_FOOTER = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🏈 Learn More at Kickoff Club HQ!\n${WEBSITE_URL}\n\n✅ Step-by-step football lessons\n✅ From beginner to superfan\n✅ No judgment, no gatekeeping\n\n#Football #NFL #LearnFootball #KickoffClubHQ`;

async function updateVideoDescriptions(options = {}) {
  console.log('📝 VIDEO DESCRIPTION UPDATER\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  const dryRun = options.dryRun || false;

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    // Get channel
    const channelResponse = await youtube.channels.list({
      part: 'id,snippet,contentDetails',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      process.exit(1);
    }

    const channel = channelResponse.data.items[0];
    console.log(`📺 Channel: ${channel.snippet.title}\n`);

    // Get all videos
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    let allVideos = [];
    let nextPageToken = null;

    do {
      const playlistResponse = await youtube.playlistItems.list({
        part: 'contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      allVideos = allVideos.concat(playlistResponse.data.items.map(item => item.contentDetails.videoId));
      nextPageToken = playlistResponse.data.nextPageToken;
    } while (nextPageToken);

    console.log(`📹 Found ${allVideos.length} videos\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const [index, videoId] of allVideos.entries()) {
      try {
        // Get current video details
        const videoResponse = await youtube.videos.list({
          part: 'snippet',
          id: videoId,
        });

        if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
          console.log(`⚠️  Video ${videoId} not found\n`);
          skipped++;
          continue;
        }

        const video = videoResponse.data.items[0];
        const currentDescription = video.snippet.description;
        const title = video.snippet.title;

        // Check if description already has website link
        if (currentDescription.includes(WEBSITE_URL)) {
          console.log(`⏭️  ${index + 1}/${allVideos.length}: ${title}`);
          console.log(`   Already has website link, skipping\n`);
          skipped++;
          continue;
        }

        // Create new description
        const newDescription = currentDescription + DESCRIPTION_FOOTER;

        console.log(`📝 ${index + 1}/${allVideos.length}: ${title}`);
        console.log(`   Current length: ${currentDescription.length} chars`);
        console.log(`   New length: ${newDescription.length} chars`);

        if (!dryRun) {
          // Update video
          await youtube.videos.update({
            part: 'snippet',
            requestBody: {
              id: videoId,
              snippet: {
                ...video.snippet,
                description: newDescription,
              },
            },
          });

          console.log(`   ✅ Updated\n`);
          updated++;

          // Wait to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.log(`   🔍 Would update (dry run)\n`);
        }

      } catch (error) {
        console.log(`❌ Error updating video ${videoId}: ${error.message}\n`);
        errors++;
      }
    }

    console.log('══════════════════════════════════════════════════════');
    console.log('\n📊 SUMMARY\n');
    console.log(`Total Videos: ${allVideos.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}\n`);

    if (dryRun) {
      console.log('🔍 This was a dry run. Re-run without --dry-run to apply changes.\n');
    }

  } catch (error) {
    console.error('❌ Bulk update failed:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
};

updateVideoDescriptions(options);
