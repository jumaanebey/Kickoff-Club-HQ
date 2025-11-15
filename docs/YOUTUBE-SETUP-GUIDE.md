# YouTube API Setup Guide

Complete guide to set up YouTube API automation for Kickoff Club.

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account (use the same one that owns the YouTube channel)

2. **Create New Project**
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Project name: `Kickoff Club YouTube`
   - Click "CREATE"
   - Wait for project creation (~30 seconds)

3. **Select Your Project**
   - Click "Select a project" again
   - Choose "Kickoff Club YouTube"

## Step 2: Enable YouTube Data API v3

1. **Navigate to API Library**
   - In the left sidebar, go to: **APIs & Services** → **Library**
   - Or visit: https://console.cloud.google.com/apis/library

2. **Search for YouTube API**
   - In the search box, type: `YouTube Data API v3`
   - Click on "YouTube Data API v3" from the results

3. **Enable the API**
   - Click the blue "ENABLE" button
   - Wait for confirmation (~10 seconds)

## Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - Left sidebar: **APIs & Services** → **Credentials**
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Configure OAuth Consent Screen** (First Time Only)
   - Click "CONFIGURE CONSENT SCREEN"
   - Select **External** (unless you have Google Workspace)
   - Click "CREATE"

3. **Fill Out OAuth Consent Screen**
   - **App name:** `Kickoff Club Video Manager`
   - **User support email:** Your email
   - **Developer contact:** Your email
   - Click "SAVE AND CONTINUE"

4. **Add Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Search for: `YouTube Data API v3`
   - Select these scopes:
     - `https://www.googleapis.com/auth/youtube.upload`
     - `https://www.googleapis.com/auth/youtube`
     - `https://www.googleapis.com/auth/youtube.readonly`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

5. **Add Test Users**
   - Click "ADD USERS"
   - Add your email (the YouTube channel owner)
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

6. **Review and Submit**
   - Review the summary
   - Click "BACK TO DASHBOARD"

## Step 4: Create OAuth 2.0 Client ID

1. **Create Credentials**
   - Go back to: **APIs & Services** → **Credentials**
   - Click "CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"

2. **Configure OAuth Client**
   - Application type: **Desktop app**
   - Name: `Kickoff Club Desktop Client`
   - Click "CREATE"

3. **Download Credentials**
   - A dialog will appear with your Client ID and Secret
   - Click "DOWNLOAD JSON"
   - Save the file as: `client_secret.json`
   - **IMPORTANT:** Keep this file secure, never commit to git

## Step 5: Move Credentials to Project

1. **Save the downloaded file:**
   ```bash
   # Move the downloaded file to your project
   mv ~/Downloads/client_secret_*.json /Users/jumaanebey/Downloads/kickoff-club-hq/config/youtube-credentials.json
   ```

2. **Verify the file:**
   ```bash
   ls -la /Users/jumaanebey/Downloads/kickoff-club-hq/config/youtube-credentials.json
   ```

## Step 6: Install Dependencies

```bash
cd /Users/jumaanebey/Downloads/kickoff-club-hq
npm install googleapis @google-cloud/local-auth
```

## Step 7: Authenticate (First Time)

Run the authentication script I've created:

```bash
node scripts/youtube-auth.js
```

This will:
1. Open a browser window
2. Ask you to sign in to Google
3. Request permission to access your YouTube channel
4. Save the authentication token locally

**IMPORTANT:** You'll see a warning "This app isn't verified" - Click "Advanced" → "Go to Kickoff Club Video Manager (unsafe)" - This is safe because it's your own app.

## Step 8: Test the Setup

```bash
# Test authentication
node scripts/youtube-test.js

# Should output:
# ✅ Authentication successful!
# Channel: [Your Channel Name]
# Subscribers: [Count]
```

## Step 9: Upload Your First Videos

```bash
# Upload all 3 free videos
node scripts/youtube-upload-batch.js

# Or upload one at a time
node scripts/youtube-upload.js how-downs-work
node scripts/youtube-upload.js field-layout-basics
node scripts/youtube-upload.js scoring-touchdowns
```

## Available Commands After Setup

```bash
# Upload videos
npm run youtube:upload              # Upload all pending videos
npm run youtube:upload how-downs-work  # Upload specific video

# Analytics
npm run youtube:analytics           # View channel analytics
npm run youtube:video-stats         # Stats for specific videos

# Comment management
npm run youtube:comments            # View recent comments
npm run youtube:comments:reply      # Reply to comments

# Playlist management
npm run youtube:playlist:create     # Create new playlist
npm run youtube:playlist:add        # Add videos to playlist

# Monitoring
npm run youtube:monitor             # Real-time comment/view monitoring
```

## Troubleshooting

### "Invalid client_secret.json"
- Make sure you downloaded the OAuth Desktop credentials, not API key
- Re-download from Google Cloud Console

### "The app isn't verified"
- This is normal for personal projects
- Click "Advanced" → "Go to [app name] (unsafe)"
- It's safe because you created the app

### "Quota exceeded"
- YouTube API has daily limits: 10,000 units/day
- Video upload: 1,600 units each
- You can upload ~6 videos per day
- Resets at midnight Pacific Time

### "Authentication failed"
- Delete `config/youtube-token.json`
- Run `node scripts/youtube-auth.js` again

### "Permission denied"
- Make sure you're signed in with the YouTube channel owner account
- Check that you added your email as a test user

## Security Best Practices

1. **Never commit credentials to git:**
   ```bash
   # Already in .gitignore:
   config/youtube-credentials.json
   config/youtube-token.json
   ```

2. **Keep credentials secure:**
   - Don't share `client_secret.json`
   - Don't share `youtube-token.json`
   - Store backups in secure location (password manager)

3. **Rotate credentials if compromised:**
   - Delete credentials in Google Cloud Console
   - Create new OAuth client
   - Re-authenticate

## Quota Management

YouTube API quota allocation:
- **Daily limit:** 10,000 units
- **Upload video:** 1,600 units
- **Update video:** 50 units
- **List videos:** 1 unit
- **Get comments:** 1 unit
- **Insert comment:** 50 units

With 10,000 units/day you can:
- Upload 6 videos/day, OR
- Upload 3 videos + 200 updates/day, OR
- Just query data (10,000 operations/day)

## Next Steps After Setup

1. ✅ Complete Google Cloud setup (above)
2. ✅ Authenticate your app
3. ✅ Upload the 3 free videos
4. 📊 Set up analytics monitoring
5. 💬 Configure comment notifications
6. 📝 Create content calendar
7. 🎬 Plan YouTube Shorts strategy

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check quota usage in Google Cloud Console
4. Verify OAuth consent screen configuration

---

**Ready to start?** Follow Step 1 above and let me know when you've created the Google Cloud project!
