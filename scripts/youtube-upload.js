const fs = require('fs');
const path = require('path');
const {getYouTubeClient} = require('./youtube-client');
const {VIDEO_METADATA} = require('./youtube-video-metadata');

const VIDEO_DIR = '/Users/jumaanebey/Downloads/kickoff-videos-clean';

/**
 * Upload a video to YouTube
 */
async function uploadVideo(videoSlug) {
  const metadata = VIDEO_METADATA[videoSlug];

  if (!metadata) {
    console.error(`❌ No metadata found for: ${videoSlug}`);
    console.error('   Available videos:', Object.keys(VIDEO_METADATA).join(', '));
    process.exit(1);
  }

  const videoPath = path.join(VIDEO_DIR, `${videoSlug}.mp4`);

  // Check if video file exists
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video file not found: ${videoPath}`);
    process.exit(1);
  }

  console.log(`📤 Uploading: ${metadata.title}`);
  console.log(`   File: ${videoSlug}.mp4`);
  console.log(`   Size: ${(fs.statSync(videoPath).size / 1024 / 1024).toFixed(2)} MB\n`);

  try {
    const youtube = await getYouTubeClient();

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: metadata.category,
          defaultLanguage: metadata.language,
        },
        status: {
          privacyStatus: metadata.privacy,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    const videoId = response.data.id;
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;

    console.log('✅ Upload successful!');
    console.log(`   Video ID: ${videoId}`);
    console.log(`   URL: ${videoUrl}\n`);

    // Save video ID mapping
    const mapping = {
      slug: videoSlug,
      videoId: videoId,
      url: videoUrl,
      uploadedAt: new Date().toISOString(),
    };

    const mappingFile = path.join(__dirname, '../config/youtube-video-ids.json');
    let mappings = {};

    try {
      mappings = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    mappings[videoSlug] = mapping;
    fs.writeFileSync(mappingFile, JSON.stringify(mappings, null, 2));

    console.log('💾 Video ID saved to config/youtube-video-ids.json\n');

    return {videoId, videoUrl};

  } catch (error) {
    console.error('❌ Upload failed:', error.message);

    if (error.code === 403) {
      console.error('\n   Quota exceeded or API not enabled');
      console.error('   Check: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas\n');
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const videoSlug = process.argv[2];

  if (!videoSlug) {
    console.error('Usage: node youtube-upload.js <video-slug>');
    console.error('Available videos:', Object.keys(VIDEO_METADATA).join(', '));
    process.exit(1);
  }

  uploadVideo(videoSlug);
}

module.exports = {uploadVideo};
