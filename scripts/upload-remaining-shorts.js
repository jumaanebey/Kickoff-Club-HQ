const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');
const SHORTS_DIR = '/Users/jumaanebey/Downloads/kickoff-shorts';
const METADATA_PATH = path.join(SHORTS_DIR, 'shorts-metadata.json');

// The 8 Shorts that failed to upload due to quota
const REMAINING_SHORTS = [
  'qb-role',
  'qb-reads',
  'common-penalties',
  'false-start',
  'special-teams-intro',
  'clock-management',
  'playoff-format',
  'super-bowl-path',
];

async function getYouTubeClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

  const {client_id, client_secret, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);

  const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
  return youtube;
}

async function uploadShort(youtube, videoPath, metadata, publishAt = null) {
  const fileName = path.basename(videoPath);
  console.log(`📤 Uploading: ${metadata.title}`);
  console.log(`   File: ${fileName}`);
  if (publishAt) {
    console.log(`   Scheduled: ${new Date(publishAt).toLocaleString()}`);
  }

  const requestBody = {
    snippet: {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      categoryId: metadata.category,
    },
    status: {
      privacyStatus: publishAt ? 'private' : metadata.privacy,
      selfDeclaredMadeForKids: false,
    },
  };

  // Add publish time if scheduled
  if (publishAt) {
    requestBody.status.publishAt = publishAt;
  }

  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody,
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  return {
    videoId: response.data.id,
    url: `https://youtube.com/shorts/${response.data.id}`,
  };
}

async function uploadRemainingShorts(options = {}) {
  console.log('🎬 YouTube Shorts Upload Tool - Remaining Videos\n');

  // Load metadata
  const allMetadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));

  // Filter to only remaining shorts
  const metadata = {};
  REMAINING_SHORTS.forEach(shortName => {
    if (allMetadata[shortName]) {
      metadata[shortName] = allMetadata[shortName];
    }
  });

  const shortNames = Object.keys(metadata);

  console.log(`   Found ${shortNames.length} Shorts to upload\n`);

  if (options.schedule) {
    console.log(`📅 Scheduling enabled:`);
    console.log(`   Start date: ${options.startDate || 'Today'}`);
    console.log(`   Frequency: ${options.frequency || 'daily'} at ${options.time || '10:00 AM'}\n`);
  }

  const youtube = await getYouTubeClient();
  const results = [];

  let publishDate = options.startDate ? new Date(options.startDate) : new Date();

  for (const [index, shortName] of shortNames.entries()) {
    const videoPath = path.join(SHORTS_DIR, `${shortName}.mp4`);
    const meta = metadata[shortName];

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      console.log(`⚠️  Skipping ${shortName} (file not found)\n`);
      continue;
    }

    console.log(`══════════════════════════════════════════════════════`);
    console.log(`Short ${index + 1} of ${shortNames.length}\n`);

    try {
      let publishAt = null;

      if (options.schedule) {
        // Set publish time (default 10 AM)
        const [hours, minutes] = (options.time || '10:00').split(':');
        publishDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        publishAt = publishDate.toISOString();

        // Increment date based on frequency
        if (options.frequency === 'daily') {
          publishDate.setDate(publishDate.getDate() + 1);
        } else if (options.frequency === 'twice-daily') {
          publishDate.setHours(publishDate.getHours() + 12);
        } else if (options.frequency === 'weekly') {
          publishDate.setDate(publishDate.getDate() + 7);
        }
      }

      const result = await uploadShort(youtube, videoPath, meta, publishAt);

      console.log(`✅ Success!`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   URL: ${result.url}\n`);

      results.push({
        shortName,
        ...result,
        success: true,
      });

      // Wait 3 seconds between uploads to avoid rate limiting
      if (index < shortNames.length - 1) {
        console.log('⏳ Waiting 3 seconds before next upload...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    } catch (error) {
      console.log(`❌ Upload failed: ${error.message}\n`);
      results.push({
        shortName,
        success: false,
        error: error.message,
      });
    }
  }

  console.log(`══════════════════════════════════════════════════════`);
  console.log(`\n📊 UPLOAD SUMMARY\n`);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${shortNames.length}`);
  console.log(`❌ Failed: ${failed.length}/${shortNames.length}\n`);

  if (successful.length > 0) {
    console.log(`🎥 Uploaded Shorts:`);
    successful.forEach((s, i) => {
      const meta = metadata[s.shortName];
      console.log(`   ${i + 1}. ${meta.title}`);
      console.log(`      ${s.url}`);
    });
  }

  console.log('\n🎉 Upload complete!\n');
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--schedule') {
    options.schedule = true;
  } else if (args[i] === '--start-date') {
    options.startDate = args[++i];
  } else if (args[i] === '--frequency') {
    options.frequency = args[++i];
  } else if (args[i] === '--time') {
    options.time = args[++i];
  }
}

if (require.main === module) {
  uploadRemainingShorts(options).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = {uploadRemainingShorts};
