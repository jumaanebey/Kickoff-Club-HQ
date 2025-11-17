const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../config/youtube-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/youtube-token.json');
const WEBSITE_URL = 'https://kickoffclubhq.com';

// The 3 main videos to promote
const VIDEOS = {
  "how-downs-work": {
    videoId: "2Crk_DZ0TDE",
    title: "What are DOWNS in Football? Complete Beginner's Guide",
    tags: [
      "football basics",
      "how football works",
      "what are downs",
      "football for beginners",
      "NFL explained",
      "learn football",
      "football 101",
      "kickoff club hq",
      "football tutorial",
      "first down explained"
    ],
  },
  "field-layout-basics": {
    videoId: "KEOxIkQxMDI",
    title: "Football Field Layout - Understanding Yard Lines, End Zones & More",
    tags: [
      "football field",
      "yard lines explained",
      "end zone",
      "football basics",
      "NFL field",
      "learn football",
      "football for beginners",
      "kickoff club hq",
      "football field diagram",
      "100 yard field"
    ],
  },
  "scoring-touchdowns": {
    videoId: "2F_yl0lWj40",
    title: "How to Score in Football - Touchdowns, Field Goals & More",
    tags: [
      "how to score in football",
      "touchdown explained",
      "field goal",
      "football scoring",
      "NFL scoring",
      "football basics",
      "learn football",
      "kickoff club hq",
      "football for beginners",
      "extra point"
    ],
  },
};

const DESCRIPTION_TEMPLATE = (currentDesc, videoTitle) => `${currentDesc}

━━━━━━━━━━━━━━━━━━━━━━━━━━

🏈 Ready to Master Football?

Join Kickoff Club HQ for step-by-step lessons that take you from "what's a down?" to superfan status!

✅ No judgment, no gatekeeping
✅ Bite-sized lessons that make sense
✅ From complete beginner to confident fan

🎓 Start Your Free Training: ${WEBSITE_URL}

━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 More Free Lessons:
• How Downs Work: https://kickoffclubhq.com/courses/how-downs-work
• Field Layout Basics: https://kickoffclubhq.com/courses/field-layout-basics
• Scoring & Touchdowns: https://kickoffclubhq.com/courses/scoring-touchdowns

━━━━━━━━━━━━━━━━━━━━━━━━━━

#Football #NFL #LearnFootball #FootballForBeginners #KickoffClubHQ #FootballBasics #NFLExplained`;

async function promoteVideos() {
  console.log('🚀 VIDEO PROMOTION SUITE\n');
  console.log(`📅 ${new Date().toLocaleString()}\n`);
  console.log('══════════════════════════════════════════════════════\n');

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

    const {client_id, client_secret, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const youtube = google.youtube({version: 'v3', auth: oAuth2Client});

    console.log('📝 STEP 1: Updating Video Descriptions & Tags\n');

    for (const [key, video] of Object.entries(VIDEOS)) {
      console.log(`Processing: ${video.title}`);

      // Get current video details
      const videoResponse = await youtube.videos.list({
        part: 'snippet',
        id: video.videoId,
      });

      if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
        console.log(`   ⚠️  Video not found\n`);
        continue;
      }

      const currentVideo = videoResponse.data.items[0];
      const currentDescription = currentVideo.snippet.description;

      // Check if already updated
      if (currentDescription.includes(WEBSITE_URL)) {
        console.log(`   ⏭️  Already optimized\n`);
        continue;
      }

      // Update video
      await youtube.videos.update({
        part: 'snippet',
        requestBody: {
          id: video.videoId,
          snippet: {
            ...currentVideo.snippet,
            title: video.title,
            description: DESCRIPTION_TEMPLATE(currentDescription, video.title),
            tags: video.tags,
            categoryId: '17', // Sports category
          },
        },
      });

      console.log(`   ✅ Updated description, title, and tags\n`);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('══════════════════════════════════════════════════════\n');
    console.log('📚 STEP 2: Creating "Getting Started" Playlist\n');

    // Check if playlist already exists
    const playlistsResponse = await youtube.playlists.list({
      part: 'snippet',
      mine: true,
      maxResults: 50,
    });

    let playlistId = null;
    const existingPlaylist = playlistsResponse.data.items?.find(
      p => p.snippet.title === 'Football Basics - Getting Started'
    );

    if (existingPlaylist) {
      playlistId = existingPlaylist.id;
      console.log(`✅ Playlist already exists: ${playlistId}\n`);
    } else {
      // Create playlist
      const createPlaylistResponse = await youtube.playlists.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: 'Football Basics - Getting Started',
            description: `Start your football journey here! These beginner-friendly lessons cover the fundamentals you need to understand and enjoy the game.

Perfect for:
✅ Complete beginners
✅ New NFL fans
✅ Anyone who feels lost watching games

Learn more at ${WEBSITE_URL}`,
          },
          status: {
            privacyStatus: 'public',
          },
        },
      });

      playlistId = createPlaylistResponse.data.id;
      console.log(`✅ Created playlist: ${playlistId}\n`);
    }

    // Add videos to playlist in order
    const playlistOrder = ['how-downs-work', 'field-layout-basics', 'scoring-touchdowns'];

    for (const key of playlistOrder) {
      const video = VIDEOS[key];

      try {
        await youtube.playlistItems.insert({
          part: 'snippet',
          requestBody: {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: video.videoId,
              },
            },
          },
        });

        console.log(`   ✅ Added "${key}" to playlist`);
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.log(`   ⏭️  "${key}" already in playlist`);
        } else {
          console.log(`   ⚠️  Error adding "${key}": ${error.message}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n══════════════════════════════════════════════════════\n');
    console.log('🎬 STEP 3: Setting Channel Trailer\n');

    const channelResponse = await youtube.channels.list({
      part: 'brandingSettings,snippet',
      mine: true,
    });

    if (channelResponse.data.items && channelResponse.data.items.length > 0) {
      const channel = channelResponse.data.items[0];

      await youtube.channels.update({
        part: 'brandingSettings',
        requestBody: {
          id: channel.id,
          brandingSettings: {
            channel: {
              ...channel.brandingSettings?.channel,
              unsubscribedTrailer: VIDEOS['how-downs-work'].videoId,
            },
          },
        },
      });

      console.log(`✅ Set "How Downs Work" as channel trailer\n`);
    }

    console.log('══════════════════════════════════════════════════════\n');
    console.log('✅ PROMOTION COMPLETE!\n');
    console.log('📊 Summary:\n');
    console.log(`   • 3 videos optimized with descriptions & tags`);
    console.log(`   • "Getting Started" playlist created`);
    console.log(`   • Channel trailer set`);
    console.log(`   • Playlist: https://youtube.com/playlist?list=${playlistId}\n`);

  } catch (error) {
    console.error('❌ Promotion failed:', error.message);
    if (error.response && error.response.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

promoteVideos();
