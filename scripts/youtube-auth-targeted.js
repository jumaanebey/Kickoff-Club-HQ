const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');
const http = require('http');
const {URL} = require('url');
const {exec} = require('child_process');

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
    const {client_id, client_secret} = credentials.installed;

    // Use a dynamic redirect URI that matches what we'll listen on
    const redirectUri = 'http://localhost:3000';

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirectUri
    );

    // Generate auth URL with authuser=7 to target kickoffclubhq@gmail.com
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'select_account',
    });

    // Add authuser=7 to force the correct Google account
    const targetedAuthUrl = authUrl + '&authuser=7&login_hint=kickoffclubhq@gmail.com';

    console.log('🎯 Opening authentication for kickoffclubhq@gmail.com (account #7)...\n');
    console.log('⚠️  IMPORTANT: If Google shows the wrong account, click "Switch account"\n');
    console.log('Opening browser...\n');

    // Open the auth URL
    exec(`open "${targetedAuthUrl}"`);

    // Set up local server to receive the code
    const code = await new Promise((resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        if (req.url && req.url.indexOf('/?code=') > -1) {
          const qs = new URL(req.url, 'http://localhost:3000').searchParams;
          const code = qs.get('code');

          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(`
            <html>
              <body style="font-family: system-ui; padding: 40px; text-align: center;">
                <h1 style="color: #10b981;">✅ Authentication Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);

          server.close();
          resolve(code);
        }
      });

      server.on('error', (err) => {
        reject(err);
      });

      server.listen(3000, () => {
        console.log('🌐 Local server listening on port 3000...');
        console.log('   Waiting for OAuth callback...\n');
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        server.close();
        reject(new Error('Authentication timeout after 5 minutes'));
      }, 5 * 60 * 1000);
    });

    console.log('🔄 Exchanging authorization code for access tokens...\n');

    // Exchange code for tokens
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('✅ Authentication successful!');
    console.log(`   Token saved to: ${TOKEN_PATH}\n`);

    // Test the connection
    console.log('🧪 Testing YouTube API connection...\n');
    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('✅ Successfully connected to YouTube channel:');
      console.log(`   📺 Name: ${channel.snippet.title}`);
      console.log(`   👥 Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`   🎬 Videos: ${channel.statistics.videoCount}\n`);
      console.log('🎉 Success! You\'re all set to upload videos!');
      console.log('\nNext steps:');
      console.log('  node scripts/youtube-upload-batch.js  # Upload all 3 videos\n');
    } else {
      console.log('⚠️  No YouTube channel found for this account');
      console.log('   This means you signed in with the wrong Google account.');
      console.log('   Please run this script again and choose kickoffclubhq@gmail.com\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);

    if (error.code === 'EADDRINUSE') {
      console.error('\n   Port 3000 is already in use.');
      console.error('   Run: lsof -ti:3000 | xargs kill -9');
      console.error('   Then try again.\n');
    }

    process.exit(1);
  }
}

if (require.main === module) {
  authenticateYouTube();
}

module.exports = {authenticateYouTube};
