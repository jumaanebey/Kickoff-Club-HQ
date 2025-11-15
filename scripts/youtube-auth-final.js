const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');
const http = require('http');
const {URL} = require('url');
const {exec} = require('child_process');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

// Include userinfo scope to verify which account is authenticated
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.email', // Added to identify account
  'https://www.googleapis.com/auth/userinfo.profile', // Added to identify account
];

async function authenticateYouTube() {
  console.log('🔐 YouTube Authentication - Final Attempt\n');
  console.log('══════════════════════════════════════════════════════════\n');

  try {
    // Load credentials
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const {client_id, client_secret} = credentials.installed;

    const redirectUri = 'http://localhost:3000';

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirectUri
    );

    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'select_account consent', // Force account selection and show all permissions
    });

    // Add authuser=7 and login_hint
    const targetedAuthUrl = authUrl + '&authuser=7&login_hint=kickoffclubhq@gmail.com';

    console.log('📱 IMPORTANT INSTRUCTIONS - READ CAREFULLY:\n');
    console.log('   Your browser will open to a Google sign-in page.');
    console.log('   You MUST pay close attention to which account is shown.\n');
    console.log('   ✅ CORRECT ACCOUNT: kickoffclubhq@gmail.com');
    console.log('   ❌ WRONG ACCOUNT: Any other email (like jumaanebey@gmail.com)\n');
    console.log('   If you see the WRONG account:');
    console.log('   1. Click "Switch account" or "Use another account"');
    console.log('   2. Select: kickoffclubhq@gmail.com');
    console.log('   3. Click "Allow" to authorize\n');
    console.log('══════════════════════════════════════════════════════════\n');
    console.log('Opening browser in 3 seconds...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

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
                <h1 style="color: #10b981;">✅ Authorization Code Received!</h1>
                <p>Processing... please wait...</p>
                <p style="color: #666;">Do not close this window yet.</p>
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
        console.log('🌐 Waiting for authorization...\n');
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        server.close();
        reject(new Error('Authentication timeout after 5 minutes'));
      }, 5 * 60 * 1000);
    });

    console.log('🔄 Exchanging authorization code for tokens...\n');

    // Exchange code for tokens
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('✅ Token saved successfully!\n');

    // Verify which account was authenticated
    console.log('🔍 Verifying authenticated account...\n');
    const oauth2 = google.oauth2({version: 'v2', auth: oAuth2Client});

    let authenticatedEmail = 'Unknown';
    try {
      const userInfo = await oauth2.userinfo.get();
      authenticatedEmail = userInfo.data.email;
      console.log('══════════════════════════════════════════════════════════');
      console.log(`📧 AUTHENTICATED AS: ${authenticatedEmail}`);
      console.log('══════════════════════════════════════════════════════════\n');

      if (authenticatedEmail !== 'kickoffclubhq@gmail.com') {
        console.log('❌ ERROR: Wrong account authenticated!\n');
        console.log(`   Expected: kickoffclubhq@gmail.com`);
        console.log(`   Got: ${authenticatedEmail}\n`);
        console.log('   Please run this script again and carefully select');
        console.log('   kickoffclubhq@gmail.com when the browser opens.\n');
        process.exit(1);
      }

      console.log('✅ CORRECT ACCOUNT! Proceeding...\n');
    } catch (error) {
      console.log(`⚠️  Could not verify email: ${error.message}\n`);
    }

    // Test YouTube API connection
    console.log('📡 Testing YouTube API connection...\n');
    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('══════════════════════════════════════════════════════════');
      console.log('✅ SUCCESS! YouTube channel found:');
      console.log('══════════════════════════════════════════════════════════');
      console.log(`   📺 Channel: ${channel.snippet.title}`);
      console.log(`   👥 Subscribers: ${channel.statistics.subscriberCount}`);
      console.log(`   🎬 Videos: ${channel.statistics.videoCount}`);
      console.log(`   📊 Views: ${channel.statistics.viewCount}`);
      console.log('══════════════════════════════════════════════════════════\n');
      console.log('🎉 All set! You can now upload videos!\n');
      console.log('Next step:');
      console.log('   node scripts/youtube-upload-batch.js\n');
    } else {
      console.log('══════════════════════════════════════════════════════════');
      console.log('❌ NO YOUTUBE CHANNEL FOUND');
      console.log('══════════════════════════════════════════════════════════\n');
      console.log(`   Account authenticated: ${authenticatedEmail}\n`);
      console.log('   This means either:');
      console.log('   1. No YouTube channel exists for this account yet');
      console.log('   2. The channel was just created and needs time to propagate (wait 5-10 min)\n');
      console.log('   Please verify:');
      console.log('   1. Go to: https://www.youtube.com/');
      console.log('   2. Make sure you\'re signed in as kickoffclubhq@gmail.com');
      console.log('   3. Check if a channel exists');
      console.log('   4. If no channel exists, create one\n');
      console.log('   After verifying, run: node scripts/check-authenticated-account.js\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Authentication failed:', error.message);

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
