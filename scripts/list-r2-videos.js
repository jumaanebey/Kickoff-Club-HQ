const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://823743a9ea649b7611fbc9b83a1de4c1.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '3570f7697bff4d45926f8677113058c0',
    secretAccessKey: '88e048e3a1815c1e9ae1e754576a07b1e63c662066f22b3a8b8653df96c1b7db'
  }
});

async function listVideos() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: 'kickoff-club-videos',
      MaxKeys: 100
    });
    const response = await client.send(command);
    console.log('Videos in R2 bucket:');
    if (response.Contents) {
      response.Contents.forEach(item => {
        const sizeMB = (item.Size / (1024 * 1024)).toFixed(2);
        console.log(`  ${item.Key} (${sizeMB} MB)`);
      });
      console.log(`\nTotal: ${response.Contents.length} files`);
    } else {
      console.log('  No files found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listVideos();
