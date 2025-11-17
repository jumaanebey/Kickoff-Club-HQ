const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

async function checkAccess() {
  console.log('🔍 Checking YouTube channel access...\n');

  try {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    // Get authenticated user info
    const oauth2 = google.oauth2({version: 'v2', auth: oAuth2Client});
    const userInfo = await oauth2.userinfo.get();

    console.log('📧 Authenticated as:', userInfo.data.email);
    console.log('👤 Name:', userInfo.data.name, '\n');

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    // Get all channels
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      console.log(`✅ Found ${response.data.items.length} channel(s):\n`);

      response.data.items.forEach((channel, index) => {
        console.log(`Channel ${index + 1}:`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   Title: ${channel.snippet.title}`);
        console.log(`   Handle: @${channel.snippet.customUrl || 'Not set'}`);
        console.log(`   Subscribers: ${channel.statistics?.subscriberCount || 0}`);
        console.log(`   Videos: ${channel.statistics?.videoCount || 0}`);
        console.log('');
      });

      // Check specifically for @KickoffClubHQ
      const kickoffChannel = response.data.items.find(
        ch => ch.snippet.customUrl === 'KickoffClubHQ' ||
              ch.snippet.title === 'Kickoff Club HQ'
      );

      if (kickoffChannel) {
        console.log('🎉 SUCCESS! @KickoffClubHQ is accessible!');
        console.log(`   Channel ID: ${kickoffChannel.id}`);
        console.log(`   Ready to upload Shorts to this channel.\n`);
      } else {
        console.log('⚠️  @KickoffClubHQ not found in accessible channels.');
        console.log('   Make sure kickoffclubhq@gmail.com is added as owner.\n');
      }
    } else {
      console.log('⚠️  No channels found for this account.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

checkAccess();
