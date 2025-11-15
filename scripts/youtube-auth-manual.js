const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');
const http = require('http');
const {URL} = require('url');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
];

async function authenticateYouTube() {
  console.log('🔐 Starting YouTube authentication...\n');

  try {
    // Load credentials
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const {client_id, client_secret, redirect_uris} = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth URL with account selection prompt
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'select_account',  // Force account selection
      login_hint: 'kickoffclubhq@gmail.com'  // Suggest the correct account
    });

    console.log('📂 Opening browser for authentication...\n');
    console.log('⚠️  IMPORTANT: When Google asks you to choose an account,');
    console.log('   SELECT: kickoffclubhq@gmail.com\n');
    console.log('Opening: ' + authUrl + '\n');

    // Open the auth URL
    const open = require('child_process').exec;
    open(`open "${authUrl}"`);

    // Set up local server to receive the code
    const code = await new Promise((resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        if (req.url.indexOf('/?code=') > -1) {
          const qs = new URL(req.url, 'http://localhost:3000').searchParams;
          const code = qs.get('code');

          res.end('Authentication successful! You can close this window.');
          server.close();
          resolve(code);
        }
      });
      server.listen(3000);
    });

    // Exchange code for tokens
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('✅ Authentication successful!');
    console.log(`   Token saved to: ${TOKEN_PATH}\n`);

    // Test the connection
    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('📺 Connected to YouTube channel:');
      console.log(`   Name: ${channel.snippet.title}`);
      console.log(`   Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`   Videos: ${channel.statistics.videoCount}\n`);
      console.log('🎉 Success! You\'re all set to upload videos!');
    } else {
      console.log('⚠️  No YouTube channel found');
      console.log('   This means you signed in with the wrong Google account.');
      console.log('   Please run this script again and choose kickoffclubhq@gmail.com\n');
    }

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  authenticateYouTube();
}

module.exports = {authenticateYouTube};
