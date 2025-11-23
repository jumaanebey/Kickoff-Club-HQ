// Test R2 video URL generation
const { S3Client, GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function testVideoUrl(videoId) {
    try {
        console.log(`\n🎬 Testing video: ${videoId}`);
        console.log(`📦 Bucket: ${process.env.R2_BUCKET_NAME}`);
        console.log(`🔗 Endpoint: ${process.env.R2_ENDPOINT}`);

        // Check if video exists
        const headCommand = new HeadObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `${videoId}.mp4`,
        });

        const headResult = await s3Client.send(headCommand);
        console.log(`✅ Video exists in R2`);
        console.log(`   Size: ${(headResult.ContentLength / 1024 / 1024).toFixed(2)} MB`);

        // Generate signed URL
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `${videoId}.mp4`,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 7200 });
        console.log(`✅ Signed URL generated successfully`);
        console.log(`   URL: ${signedUrl.substring(0, 100)}...`);

        return signedUrl;
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        throw error;
    }
}

// Test all 10 videos
const videos = [
    'how-downs-work',
    'scoring-touchdowns',
    'field-layout-basics',
    'offensive-positions',
    'defensive-positions',
    'understanding-penalties',
    'special-teams-basics',
    'timeouts-and-clock',
    'nfl-seasons-playoffs',
    'quarterback-101'
];

(async () => {
    console.log('🚀 Testing R2 Video URL Generation\n');
    console.log('='.repeat(60));

    for (const videoId of videos) {
        try {
            await testVideoUrl(videoId);
        } catch (error) {
            // Continue to next video
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test complete!');
})();
