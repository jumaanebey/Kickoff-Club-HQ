const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');

/**
 * Get authenticated YouTube client
 */
async function getYouTubeClient() {
  try {
    // Load credentials
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    // Create OAuth2 client
    const {client_id, client_secret, redirect_uris} = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(token);

    // Set up automatic token refresh
    oAuth2Client.on('tokens', async (tokens) => {
      if (tokens.refresh_token) {
        token.refresh_token = tokens.refresh_token;
      }
      token.access_token = tokens.access_token;
      token.expiry_date = tokens.expiry_date;

      // Save updated token
      await fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2));
    });

    // Create YouTube client
    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    return youtube;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Authentication required. Please run:');
      console.error('   node scripts/youtube-auth.js\n');
    } else {
      console.error('❌ Failed to create YouTube client:', error.message);
    }
    process.exit(1);
  }
}

module.exports = {getYouTubeClient};
