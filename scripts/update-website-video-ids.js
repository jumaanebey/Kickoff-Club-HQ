const fs = require('fs');
const path = require('path');

/**
 * Update website code with new YouTube video IDs
 */
async function updateWebsiteVideoIds() {
  console.log('🔄 Updating website with new YouTube video IDs...\n');

  // Load video ID mappings
  const mappingFile = path.join(__dirname, '../config/youtube-video-ids.json');

  if (!fs.existsSync(mappingFile)) {
    console.error('❌ No video ID mappings found.');
    console.error('   Please upload videos first: node scripts/youtube-upload-batch.js\n');
    process.exit(1);
  }

  const mappings = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
  const videoRouteFile = path.join(__dirname, '../app/api/video-url/route.ts');

  // Read current route file
  let routeContent = fs.readFileSync(videoRouteFile, 'utf-8');

  // Update YouTube video mappings
  const youtubeVideos = {};
  for (const [slug, data] of Object.entries(mappings)) {
    youtubeVideos[slug] = data.videoId;
  }

  // Create the new mapping string
  const newMapping = `const YOUTUBE_VIDEOS: Record<string, string> = ${JSON.stringify(youtubeVideos, null, 2)}`;

  // Replace the existing mapping
  const youtubeVideoRegex = /const YOUTUBE_VIDEOS: Record<string, string> = \{[^}]*\}/s;

  if (routeContent.match(youtubeVideoRegex)) {
    routeContent = routeContent.replace(youtubeVideoRegex, newMapping);
  } else {
    console.error('❌ Could not find YOUTUBE_VIDEOS mapping in route file');
    console.error('   Please update manually\n');
    process.exit(1);
  }

  // Write updated file
  fs.writeFileSync(videoRouteFile, routeContent);

  console.log('✅ Website updated successfully!\n');
  console.log('Updated video IDs:');
  for (const [slug, data] of Object.entries(mappings)) {
    console.log(`  ${slug}: ${data.videoId}`);
  }
  console.log('');

  console.log('📝 Next Steps:');
  console.log('1. Review changes: git diff app/api/video-url/route.ts');
  console.log('2. Test locally: npm run dev');
  console.log('3. Commit changes: git add . && git commit -m "Update YouTube video IDs"');
  console.log('4. Deploy: git push\n');
}

// Run if called directly
if (require.main === module) {
  updateWebsiteVideoIds();
}

module.exports = {updateWebsiteVideoIds};
