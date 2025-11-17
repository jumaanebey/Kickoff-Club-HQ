const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/youtube-token.json');

// Videos to check (from app/api/video-url/route.ts)
const YOUTUBE_VIDEOS = {
  "how-downs-work": "2Crk_DZ0TDE",
  "field-layout-basics": "KEOxIkQxMDI",
  "scoring-touchdowns": "2F_yl0lWj40"
};

async function checkVideoHealth() {
  console.log('🏥 VIDEO HEALTH CHECK\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    const results = {
      total: 0,
      healthy: 0,
      issues: [],
    };

    for (const [lessonId, videoId] of Object.entries(YOUTUBE_VIDEOS)) {
      results.total++;

      try {
        const response = await youtube.videos.list({
          part: 'status,snippet,contentDetails,statistics',
          id: videoId,
        });

        if (!response.data.items || response.data.items.length === 0) {
          results.issues.push({
            lessonId,
            videoId,
            issue: 'VIDEO_NOT_FOUND',
            severity: 'CRITICAL',
            message: 'Video does not exist or has been deleted',
          });
          console.log(`❌ ${lessonId} (${videoId})`);
          console.log(`   Issue: Video not found or deleted\n`);
          continue;
        }

        const video = response.data.items[0];
        const status = video.status;
        const snippet = video.snippet;

        // Check privacy status
        if (status.privacyStatus === 'private') {
          results.issues.push({
            lessonId,
            videoId,
            issue: 'PRIVATE_VIDEO',
            severity: 'CRITICAL',
            message: 'Video is private and not accessible to users',
          });
          console.log(`🔒 ${lessonId} (${videoId})`);
          console.log(`   Issue: Video is PRIVATE\n`);
        } else if (status.privacyStatus === 'unlisted') {
          results.issues.push({
            lessonId,
            videoId,
            issue: 'UNLISTED_VIDEO',
            severity: 'WARNING',
            message: 'Video is unlisted (accessible by link only)',
          });
          console.log(`🔗 ${lessonId} (${videoId})`);
          console.log(`   Warning: Video is UNLISTED\n`);
        } else if (status.uploadStatus !== 'processed') {
          results.issues.push({
            lessonId,
            videoId,
            issue: 'NOT_PROCESSED',
            severity: 'WARNING',
            message: `Video upload status: ${status.uploadStatus}`,
          });
          console.log(`⚠️  ${lessonId} (${videoId})`);
          console.log(`   Warning: Upload status is ${status.uploadStatus}\n`);
        } else if (status.embeddable === false) {
          results.issues.push({
            lessonId,
            videoId,
            issue: 'NOT_EMBEDDABLE',
            severity: 'CRITICAL',
            message: 'Video cannot be embedded on other websites',
          });
          console.log(`🚫 ${lessonId} (${videoId})`);
          console.log(`   Issue: Video is NOT EMBEDDABLE\n`);
        } else {
          results.healthy++;
          console.log(`✅ ${lessonId} (${videoId})`);
          console.log(`   Status: ${status.privacyStatus.toUpperCase()}`);
          console.log(`   Embeddable: Yes`);
          console.log(`   Views: ${video.statistics?.viewCount || 0}`);
          console.log(`   Duration: ${video.contentDetails.duration}\n`);
        }

      } catch (error) {
        results.issues.push({
          lessonId,
          videoId,
          issue: 'API_ERROR',
          severity: 'ERROR',
          message: error.message,
        });
        console.log(`💥 ${lessonId} (${videoId})`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    // Print summary
    console.log('══════════════════════════════════════════════════════');
    console.log('\n📊 SUMMARY\n');
    console.log(`Total Videos: ${results.total}`);
    console.log(`Healthy: ${results.healthy} ✅`);
    console.log(`Issues: ${results.issues.length} ⚠️\n`);

    if (results.issues.length > 0) {
      console.log('🚨 ISSUES FOUND:\n');

      const critical = results.issues.filter(i => i.severity === 'CRITICAL');
      const warnings = results.issues.filter(i => i.severity === 'WARNING');
      const errors = results.issues.filter(i => i.severity === 'ERROR');

      if (critical.length > 0) {
        console.log(`CRITICAL (${critical.length}):`);
        critical.forEach(issue => {
          console.log(`  - ${issue.lessonId}: ${issue.message}`);
        });
        console.log('');
      }

      if (warnings.length > 0) {
        console.log(`WARNINGS (${warnings.length}):`);
        warnings.forEach(issue => {
          console.log(`  - ${issue.lessonId}: ${issue.message}`);
        });
        console.log('');
      }

      if (errors.length > 0) {
        console.log(`ERRORS (${errors.length}):`);
        errors.forEach(issue => {
          console.log(`  - ${issue.lessonId}: ${issue.message}`);
        });
        console.log('');
      }
    }

    // Save results to file
    const resultsPath = path.join(__dirname, '../../logs/video-health-results.json');
    fs.mkdirSync(path.dirname(resultsPath), {recursive: true});
    fs.writeFileSync(resultsPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      ...results,
    }, null, 2));

    console.log(`📁 Results saved to: logs/video-health-results.json\n`);

    // Exit with error code if critical issues found
    const critical = results.issues.filter(i => i.severity === 'CRITICAL');
    if (critical.length > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

checkVideoHealth();
