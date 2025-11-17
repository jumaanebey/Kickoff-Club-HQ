const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/youtube-token.json');
const SEEN_COMMENTS_PATH = path.join(__dirname, '../../logs/seen-comments.json');

async function monitorComments() {
  console.log('💬 YOUTUBE COMMENT MONITOR\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    // Load seen comments
    let seenComments = [];
    if (fs.existsSync(SEEN_COMMENTS_PATH)) {
      seenComments = JSON.parse(fs.readFileSync(SEEN_COMMENTS_PATH, 'utf-8'));
    }

    // Get channel ID
    const channelResponse = await youtube.channels.list({
      part: 'id,snippet',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error('❌ No channel found');
      process.exit(1);
    }

    const channel = channelResponse.data.items[0];
    console.log(`📺 Monitoring: ${channel.snippet.title}\n`);

    // Get comment threads
    const commentsResponse = await youtube.commentThreads.list({
      part: 'snippet',
      allThreadsRelatedToChannelId: channel.id,
      maxResults: 50,
      order: 'time',
    });

    if (!commentsResponse.data.items || commentsResponse.data.items.length === 0) {
      console.log('📭 No comments yet\n');
      return;
    }

    const newComments = [];

    for (const thread of commentsResponse.data.items) {
      const comment = thread.snippet.topLevelComment;
      const commentId = comment.id;

      if (!seenComments.includes(commentId)) {
        newComments.push({
          id: commentId,
          author: comment.snippet.authorDisplayName,
          text: comment.snippet.textDisplay,
          videoId: comment.snippet.videoId,
          publishedAt: comment.snippet.publishedAt,
          likeCount: comment.snippet.likeCount,
        });

        seenComments.push(commentId);
      }
    }

    if (newComments.length > 0) {
      console.log(`🔔 ${newComments.length} NEW COMMENT${newComments.length > 1 ? 'S' : ''}!\n`);

      for (const comment of newComments) {
        // Get video title
        const videoResponse = await youtube.videos.list({
          part: 'snippet',
          id: comment.videoId,
        });

        const videoTitle = videoResponse.data.items?.[0]?.snippet?.title || 'Unknown Video';

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`\n📹 Video: ${videoTitle}`);
        console.log(`👤 ${comment.author}`);
        console.log(`💬 ${comment.text.replace(/<[^>]*>/g, '')}`); // Strip HTML
        console.log(`⏰ ${new Date(comment.publishedAt).toLocaleString()}`);
        console.log(`👍 ${comment.likeCount} likes`);
        console.log(`\n🔗 https://youtube.com/watch?v=${comment.videoId}&lc=${comment.id}\n`);
      }

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    } else {
      console.log(`✅ No new comments since last check\n`);
    }

    // Save seen comments (keep last 1000)
    seenComments = seenComments.slice(-1000);
    fs.mkdirSync(path.dirname(SEEN_COMMENTS_PATH), {recursive: true});
    fs.writeFileSync(SEEN_COMMENTS_PATH, JSON.stringify(seenComments, null, 2));

    console.log(`📊 Total Comments Tracked: ${commentsResponse.data.items.length}`);
    console.log(`📝 Seen Comments Database: ${seenComments.length} entries\n`);

  } catch (error) {
    console.error('❌ Comment monitoring failed:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

monitorComments();
