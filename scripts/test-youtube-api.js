const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

async function testAPI() {
  console.log('🧪 Testing YouTube API Connection...\n');

  try {
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    console.log('✅ Credentials loaded');
    console.log('✅ Token loaded');
    console.log(`   Scopes: ${token.scope}\n`);

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    oAuth2Client.setCredentials(token);

    console.log('🔍 Testing API call...\n');

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client,
    });

    // Try to get channel list
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    console.log('✅ API call successful!\n');

    if (response.data.items && response.data.items.length > 0) {
      response.data.items.forEach((channel, i) => {
        console.log(`Channel ${i + 1}:`);
        console.log(`   Title: ${channel.snippet.title}`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   Handle: @${channel.snippet.customUrl || 'Not set'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No channels found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.code === 401) {
      console.error('\n🔧 OAuth Configuration Issue:');
      console.error('   The OAuth credentials may not be properly configured.');
      console.error('   Check: https://console.cloud.google.com/apis/credentials/consent?project=kickoff-club-hq-478302');
      console.error('   Make sure:');
      console.error('   1. OAuth consent screen is configured');
      console.error('   2. App is published OR kickoffclubhq@gmail.com is added as test user');
      console.error('   3. Scopes include YouTube Data API');
    }

    if (error.response && error.response.data) {
      console.error('\nAPI Response:', JSON.stringify(error.response.data, null, 2));
    }

    process.exit(1);
  }
}

testAPI();
