const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

async function listAllChannels() {
  console.log('🔍 Searching for ALL YouTube channels accessible to this account...\n');

  try {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    // Get authenticated account info
    const oauth2 = google.oauth2({version: 'v2', auth: oAuth2Client});
    const userInfo = await oauth2.userinfo.get();

    console.log('📧 Authenticated as:', userInfo.data.email);
    console.log('👤 Account name:', userInfo.data.name, '\n');

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Method 1: Checking channels with mine=true...\n');

    try {
      const response1 = await youtube.channels.list({
        part: 'snippet,contentDetails,statistics,brandingSettings',
        mine: true,
      });

      if (response1.data.items && response1.data.items.length > 0) {
        console.log(`✅ Found ${response1.data.items.length} channel(s):\n`);

        response1.data.items.forEach((channel, index) => {
          console.log(`Channel ${index + 1}:`);
          console.log(`   ID: ${channel.id}`);
          console.log(`   Title: ${channel.snippet.title}`);
          console.log(`   Custom URL: @${channel.snippet.customUrl || 'Not set'}`);
          console.log(`   Description: ${channel.snippet.description?.substring(0, 100) || 'None'}...`);
          console.log(`   Published: ${new Date(channel.snippet.publishedAt).toLocaleDateString()}`);
          console.log(`   Subscribers: ${channel.statistics?.subscriberCount || 0}`);
          console.log(`   Videos: ${channel.statistics?.videoCount || 0}`);
          console.log(`   Views: ${channel.statistics?.viewCount || 0}`);

          if (channel.brandingSettings?.channel?.keywords) {
            console.log(`   Keywords: ${channel.brandingSettings.channel.keywords}`);
          }

          console.log('');
        });
      } else {
        console.log('⚠️  No channels found with mine=true\n');
      }
    } catch (error) {
      console.log(`❌ Error with mine=true: ${error.message}\n`);
    }

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Method 2: Checking channels by account ID...\n');

    try {
      const response2 = await youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        id: userInfo.data.id, // Using the Google account ID
      });

      if (response2.data.items && response2.data.items.length > 0) {
        console.log(`✅ Found ${response2.data.items.length} channel(s) by ID:\n`);
        response2.data.items.forEach((channel) => {
          console.log(`   ${channel.snippet.title} (${channel.id})`);
        });
      } else {
        console.log('⚠️  No channels found by account ID\n');
      }
    } catch (error) {
      console.log(`❌ Error with account ID: ${error.message}\n`);
    }

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Method 3: Checking channel by handle @KickoffClubHQ...\n');

    try {
      const response3 = await youtube.channels.list({
        part: 'snippet,statistics',
        forHandle: 'KickoffClubHQ',
      });

      if (response3.data.items && response3.data.items.length > 0) {
        console.log('✅ Found channel by handle:\n');
        const channel = response3.data.items[0];
        console.log(`   Title: ${channel.snippet.title}`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   Subscribers: ${channel.statistics?.subscriberCount || 0}`);
        console.log('');

        console.log('⚠️  IMPORTANT: Channel exists but is not accessible via OAuth!');
        console.log('   This suggests the channel is a Brand Account not linked to');
        console.log('   the authenticated Google account (kickoffclubhq@gmail.com).\n');
      } else {
        console.log('⚠️  Channel @KickoffClubHQ not found\n');
      }
    } catch (error) {
      console.log(`❌ Error searching by handle: ${error.message}\n`);
    }

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📋 DIAGNOSIS:\n');
    console.log('If no channels were found with "mine=true" but the channel exists');
    console.log('on YouTube when you\'re logged in, this indicates a Brand Account issue.\n');
    console.log('Solution:');
    console.log('1. Go to: https://www.youtube.com/account');
    console.log('2. Check "Channel status and features"');
    console.log('3. Verify the channel ownership settings');
    console.log('4. You may need to manage the Brand Account at:');
    console.log('   https://myaccount.google.com/brandaccounts\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

listAllChannels();
