const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize R2 client (S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Mapping of episode numbers to local audio files
const episodeFileMapping = {
  1: 'episode-01-four-downs.m4a',
  2: 'episode-02-fantasy-football.m4a',
  3: 'episode-03-game-clock.m4a',
  4: 'episode-04-penalties.m4a',
  5: 'episode-05-scoring.m4a',
  6: 'episode-06-touchdown-rules.m4a',
  7: 'episode-07-strategy-blueprint.m4a',
  8: 'episode-08-coaching-strategy.m4a',
  9: 'episode-09-super-bowl.m4a',
  10: 'episode-10-penalty-cost.m4a',
};

// Get audio duration from file metadata
function getAudioDuration(filePath) {
  // For now, return null - duration will be handled by the client when playing
  // Or you can use a library like 'music-metadata' to extract duration
  return null;
}

async function uploadPodcastToR2(episodeNumber, fileName) {
  const localFilePath = path.join(__dirname, '..', 'public', 'podcasts', fileName);

  if (!fs.existsSync(localFilePath)) {
    console.error(`❌ File not found: ${localFilePath}`);
    return null;
  }

  const fileContent = fs.readFileSync(localFilePath);
  const fileStats = fs.statSync(localFilePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

  // R2 object key (path in bucket)
  const r2Key = `podcasts/episode-${String(episodeNumber).padStart(2, '0')}.m4a`;

  console.log(`📤 Uploading Episode ${episodeNumber}: ${fileName} (${fileSizeMB} MB)...`);

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: 'audio/x-m4a',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);

    // Construct public URL
    const publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${r2Key}`;

    console.log(`✅ Uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading episode ${episodeNumber}:`, error);
    return null;
  }
}

async function updatePodcastInDatabase(episodeNumber, audioUrl, duration = null) {
  console.log(`💾 Updating database for episode ${episodeNumber}...`);

  const updateData = { audio_url: audioUrl };
  if (duration) {
    updateData.duration = duration;
  }

  const { data, error } = await supabase
    .from('podcasts')
    .update(updateData)
    .eq('episode_number', episodeNumber);

  if (error) {
    console.error(`❌ Database update failed for episode ${episodeNumber}:`, error);
    return false;
  }

  console.log(`✅ Database updated for episode ${episodeNumber}`);
  return true;
}

async function main() {
  console.log('🚀 Starting podcast upload to Cloudflare R2...\n');

  // Check environment variables
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
    console.error('❌ Missing R2 environment variables. Please check .env.local');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (const [episodeNumber, fileName] of Object.entries(episodeFileMapping)) {
    const episodeNum = parseInt(episodeNumber);

    // Upload to R2
    const audioUrl = await uploadPodcastToR2(episodeNum, fileName);

    if (audioUrl) {
      // Update database with R2 URL
      const dbUpdated = await updatePodcastInDatabase(episodeNum, audioUrl);

      if (dbUpdated) {
        successCount++;
      } else {
        failCount++;
      }
    } else {
      failCount++;
    }

    console.log(''); // Empty line for readability
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total: ${Object.keys(episodeFileMapping).length}`);

  if (successCount === Object.keys(episodeFileMapping).length) {
    console.log('\n🎉 All podcasts uploaded successfully!');
    console.log('\n📡 Next steps:');
    console.log('1. Test the RSS feed: http://localhost:3000/api/podcast-feed');
    console.log('2. Submit RSS feed to podcast platforms (see PODCAST_DISTRIBUTION_GUIDE.md)');
  }
}

main().catch(console.error);
