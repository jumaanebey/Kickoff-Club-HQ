const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

// "How Downs Work" Short video ID (newly uploaded)
const TRAILER_VIDEO_ID = 'Eft5riaye88';

async function setChannelTrailer() {
  console.log('🎬 Setting Channel Trailer...\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    // Get current channel info
    const channelResponse = await youtube.channels.list({
      part: 'brandingSettings,snippet',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      return;
    }

    const channel = channelResponse.data.items[0];
    console.log(`📺 Channel: ${channel.snippet.title}`);
    console.log(`   ID: ${channel.id}\n`);

    // Update channel with trailer
    const updateResponse = await youtube.channels.update({
      part: 'brandingSettings',
      requestBody: {
        id: channel.id,
        brandingSettings: {
          channel: {
            ...channel.brandingSettings?.channel,
            unsubscribedTrailer: TRAILER_VIDEO_ID,
          },
        },
      },
    });

    console.log('✅ Channel trailer set successfully!');
    console.log(`   Video: How Downs Work`);
    console.log(`   Video ID: ${TRAILER_VIDEO_ID}`);
    console.log(`   URL: https://youtube.com/watch?v=${TRAILER_VIDEO_ID}\n`);
    console.log('🎉 Homepage visitors will now see "How Downs Work" as the featured video!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

setChannelTrailer();
