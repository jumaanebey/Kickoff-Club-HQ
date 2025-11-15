const {getYouTubeClient} = require('./youtube-client');

/**
 * Get recent comments from all videos
 */
async function getRecentComments(maxResults = 20) {
  console.log(`💬 Recent Comments (Last ${maxResults})\n`);

  try {
    const youtube = await getYouTubeClient();

    // Get all comment threads
    const response = await youtube.commentThreads.list({
      part: 'snippet',
      allThreadsRelatedToChannelId: (await youtube.channels.list({
        part: 'id',
        mine: true,
      })).data.items[0].id,
      maxResults: maxResults,
      order: 'time',
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log('   No comments yet!\n');
      return;
    }

    for (const item of response.data.items) {
      const comment = item.snippet.topLevelComment.snippet;
      const videoId = item.snippet.videoId;

      // Get video title
      const videoResponse = await youtube.videos.list({
        part: 'snippet',
        id: videoId,
      });

      const videoTitle = videoResponse.data.items[0]?.snippet.title || 'Unknown Video';

      console.log(`   📹 ${videoTitle}`);
      console.log(`   👤 ${comment.authorDisplayName}`);
      console.log(`   💬 ${comment.textDisplay}`);
      console.log(`   📅 ${new Date(comment.publishedAt).toLocaleString()}`);
      console.log(`   👍 ${comment.likeCount} likes`);

      if (item.snippet.totalReplyCount > 0) {
        console.log(`   💭 ${item.snippet.totalReplyCount} replies`);
      }

      console.log('');
    }

    console.log(`📊 Total comments shown: ${response.data.items.length}\n`);

  } catch (error) {
    console.error('❌ Failed to fetch comments:', error.message);
    process.exit(1);
  }
}

/**
 * Reply to a comment
 */
async function replyToComment(commentId, replyText) {
  console.log('💬 Replying to comment...\n');

  try {
    const youtube = await getYouTubeClient();

    const response = await youtube.comments.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          parentId: commentId,
          textOriginal: replyText,
        },
      },
    });

    console.log('✅ Reply posted successfully!\n');
    return response.data;

  } catch (error) {
    console.error('❌ Failed to post reply:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const action = process.argv[2];

  if (action === 'reply') {
    const commentId = process.argv[3];
    const replyText = process.argv.slice(4).join(' ');

    if (!commentId || !replyText) {
      console.error('Usage: node youtube-comments.js reply <commentId> <reply text>');
      process.exit(1);
    }

    replyToComment(commentId, replyText);
  } else {
    const maxResults = parseInt(action) || 20;
    getRecentComments(maxResults);
  }
}

module.exports = {getRecentComments, replyToComment};
