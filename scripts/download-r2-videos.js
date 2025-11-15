const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const FREE_VIDEOS = [
  'how-downs-work.mp4',
  'scoring-touchdowns.mp4',
  'field-layout-basics.mp4',
];

async function downloadVideo(videoKey, outputPath) {
  try {
    const command = new GetObjectCommand({
      Bucket: 'kickoff-club-videos',
      Key: videoKey,
    });

    const response = await client.send(command);
    const writeStream = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      response.Body.pipe(writeStream);
      writeStream.on('finish', () => {
        const stats = fs.statSync(outputPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Downloaded: ${videoKey} (${sizeMB} MB)`);
        resolve();
      });
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Error downloading ${videoKey}:`, error.message);
  }
}

async function downloadAllFreeVideos() {
  const outputDir = '/Users/jumaanebey/Downloads/kickoff-youtube-uploads';

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('📥 Downloading free lesson videos from R2...\n');

  for (const videoKey of FREE_VIDEOS) {
    const outputPath = path.join(outputDir, videoKey);
    await downloadVideo(videoKey, outputPath);
  }

  console.log(`\n✅ All videos downloaded to: ${outputDir}`);
  console.log('\n📤 Next steps:');
  console.log('1. Open the folder (opening now...)');
  console.log('2. Upload each video to YouTube');
  console.log('3. Enable "Allow embedding" in YouTube settings');
  console.log('4. Copy the video IDs and paste them here');
}

downloadAllFreeVideos();
