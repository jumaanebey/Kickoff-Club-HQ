const fs = require('fs').promises;
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// Paths
const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

// YouTube API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
];

/**
 * Authenticate with YouTube API
 */
async function authenticateYouTube() {
  console.log('🔐 Starting YouTube authentication...\n');

  try {
    // Check if credentials file exists
    try {
      await fs.access(CREDENTIALS_PATH);
    } catch (error) {
      console.error('❌ Credentials file not found!');
      console.error('   Please download OAuth credentials from Google Cloud Console');
      console.error(`   Save as: ${CREDENTIALS_PATH}\n`);
      console.error('   See: /docs/YOUTUBE-SETUP-GUIDE.md for instructions');
      process.exit(1);
    }

    // Authenticate
    console.log('📂 Opening browser for authentication...');
    console.log('   Please sign in and authorize the app\n');

    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    // Save the token
    const tokens = auth.credentials;
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('✅ Authentication successful!');
    console.log(`   Token saved to: ${TOKEN_PATH}\n`);

    // Test the connection
    const youtube = google.youtube({version: 'v3', auth});
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('📺 Connected to YouTube channel:');
      console.log(`   Name: ${channel.snippet.title}`);
      console.log(`   Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`   Videos: ${channel.statistics.videoCount}`);
      console.log(`   Views: ${channel.statistics.viewCount}\n`);
    }

    console.log('🎉 Setup complete! You can now use YouTube automation commands.');
    console.log('\nNext steps:');
    console.log('  node scripts/youtube-upload-batch.js  # Upload all 3 videos');
    console.log('  npm run youtube:analytics              # View analytics');
    console.log('  npm run youtube:comments               # Check comments\n');

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);

    if (error.message.includes('invalid_client')) {
      console.error('\n   Make sure you downloaded OAuth Desktop credentials');
      console.error('   Re-download from Google Cloud Console\n');
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  authenticateYouTube();
}

module.exports = {authenticateYouTube};
