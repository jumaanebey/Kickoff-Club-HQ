const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

async function checkAuthenticatedAccount() {
  console.log('🔍 Checking which Google account is authenticated...\n');

  try {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    // Get user info using People API
    const oauth2 = google.oauth2({version: 'v2', auth: oAuth2Client});

    try {
      const userInfo = await oauth2.userinfo.get();
      console.log('✅ Authenticated Account:');
      console.log(`   📧 Email: ${userInfo.data.email}`);
      console.log(`   ✓  Verified: ${userInfo.data.verified_email}`);
      console.log(`   👤 Name: ${userInfo.data.name || 'N/A'}\n`);

      if (userInfo.data.email === 'kickoffclubhq@gmail.com') {
        console.log('✅ CORRECT ACCOUNT! You\'re authenticated with kickoffclubhq@gmail.com\n');
      } else {
        console.log('❌ WRONG ACCOUNT!');
        console.log(`   You\'re authenticated with: ${userInfo.data.email}`);
        console.log(`   You need to be authenticated with: kickoffclubhq@gmail.com\n`);
        console.log('💡 Solution:');
        console.log('   When the OAuth browser window opens, you MUST:');
        console.log('   1. Look carefully at which account Google is showing');
        console.log('   2. If it\'s NOT kickoffclubhq@gmail.com, click "Switch account"');
        console.log('   3. Select kickoffclubhq@gmail.com from the list');
        console.log('   4. Authorize the app\n');
        process.exit(1);
      }
    } catch (error) {
      console.log('⚠️  Could not fetch account email');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check YouTube channel
    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('📺 YouTube Channel Found:');
      console.log(`   Name: ${channel.snippet.title}`);
      console.log(`   Handle: @${channel.snippet.customUrl || 'Not set'}`);
      console.log(`   Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`   Videos: ${channel.statistics.videoCount}\n`);
      console.log('🎉 Success! Ready to upload videos!');
    } else {
      console.log('⚠️  No YouTube channel found for this account');
      console.log('   Possible reasons:');
      console.log('   1. The YouTube channel hasn\'t been created yet');
      console.log('   2. The channel was just created and needs time to propagate');
      console.log('   3. You\'re still using the wrong Google account\n');
      console.log('   Please verify at: https://www.youtube.com/');
      console.log('   Make sure you\'re signed in as kickoffclubhq@gmail.com');
      console.log('   and that a channel exists.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAuthenticatedAccount();
