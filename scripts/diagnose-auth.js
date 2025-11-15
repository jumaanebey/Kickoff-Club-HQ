const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

async function diagnose() {
  console.log('🔍 YouTube API Diagnostics\n');

  try {
    // Load credentials
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    console.log('✅ Credentials file loaded');
    console.log('✅ Token file loaded\n');

    console.log('📋 Token Info:');
    console.log(`   Scopes: ${token.scope}`);
    console.log(`   Token Type: ${token.token_type}`);
    console.log(`   Has Refresh Token: ${!!token.refresh_token}`);
    console.log(`   Expiry Date: ${new Date(token.expiry_date).toLocaleString()}\n`);

    // Create OAuth2 client
    const {client_id, client_secret, redirect_uris} = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    // Try to get user info
    console.log('📡 Testing OAuth2 authentication...\n');

    const oauth2 = google.oauth2({version: 'v2', auth: oAuth2Client});

    try {
      const userInfo = await oauth2.userinfo.get();
      console.log('✅ OAuth2 working!');
      console.log(`   Email: ${userInfo.data.email}`);
      console.log(`   Verified: ${userInfo.data.verified_email}\n`);
    } catch (error) {
      console.log('⚠️  Could not fetch user info:', error.message, '\n');
    }

    // Try YouTube API
    console.log('📡 Testing YouTube Data API v3...\n');

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    try {
      const channelResponse = await youtube.channels.list({
        part: 'snippet,statistics',
        mine: true,
      });

      if (channelResponse.data.items && channelResponse.data.items.length > 0) {
        const channel = channelResponse.data.items[0];
        console.log('✅ YouTube channel found!');
        console.log(`   Name: ${channel.snippet.title}`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   Subscribers: ${channel.statistics.subscriberCount}`);
        console.log(`   Videos: ${channel.statistics.videoCount}\n`);
      } else {
        console.log('⚠️  No YouTube channel found for this account\n');
        console.log('   Possible reasons:');
        console.log('   1. Channel was created after OAuth authorization');
        console.log('   2. Different Google account used during OAuth');
        console.log('   3. Channel needs time to propagate in API\n');
      }
    } catch (error) {
      console.log('❌ YouTube API Error:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', JSON.stringify(error.response.data, null, 2));
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    process.exit(1);
  }
}

diagnose();
