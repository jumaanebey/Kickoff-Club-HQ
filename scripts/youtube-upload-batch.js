const {uploadVideo} = require('./youtube-upload');
const {VIDEO_METADATA} = require('./youtube-video-metadata');

/**
 * Upload multiple videos in batch
 */
async function uploadBatch() {
  const freeVideos = ['how-downs-work', 'field-layout-basics', 'scoring-touchdowns'];

  console.log('🎬 Batch Upload: Free Lesson Videos\n');
  console.log(`   Uploading ${freeVideos.length} videos...\n`);

  const results = [];

  for (const videoSlug of freeVideos) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Video ${results.length + 1} of ${freeVideos.length}`);
      console.log('='.repeat(60) + '\n');

      const result = await uploadVideo(videoSlug);
      results.push({...result, slug: videoSlug, success: true});

      // Wait 2 seconds between uploads to avoid rate limiting
      if (results.length < freeVideos.length) {
        console.log('⏳ Waiting 2 seconds before next upload...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Failed to upload ${videoSlug}:`, error.message);
      results.push({slug: videoSlug, success: false, error: error.message});
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60) + '\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${freeVideos.length}`);
  console.log(`❌ Failed: ${failed.length}/${freeVideos.length}\n`);

  if (successful.length > 0) {
    console.log('Uploaded videos:');
    successful.forEach(r => {
      console.log(`  • ${r.slug}`);
      console.log(`    ID: ${r.videoId}`);
      console.log(`    URL: ${r.url}`);
    });
    console.log('');
  }

  if (failed.length > 0) {
    console.log('Failed videos:');
    failed.forEach(r => {
      console.log(`  • ${r.slug}: ${r.error}`);
    });
    console.log('');
  }

  // Next steps
  console.log('📝 Next Steps:');
  console.log('1. Update website with new video IDs (saved in config/youtube-video-ids.json)');
  console.log('2. Create custom thumbnails for each video');
  console.log('3. Add videos to "Football Basics" playlist');
  console.log('4. Share on social media');
  console.log('\nRun: node scripts/update-website-video-ids.js to update the website automatically\n');
}

// Run if called directly
if (require.main === module) {
  uploadBatch().catch(console.error);
}

module.exports = {uploadBatch};
