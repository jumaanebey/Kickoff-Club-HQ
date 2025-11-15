# YouTube Upload Instructions

## Videos to Upload to YouTube

Upload only the **3 free lesson videos** to YouTube for view tracking and shorts campaigns:

1. **how-downs-work.mp4** (8.3 MB)
2. **field-layout-basics.mp4** (8.2 MB)
3. **scoring-touchdowns.mp4** (8.3 MB)

Location: `/Users/jumaanebey/Downloads/kickoff-videos-clean/`

## Manual Upload Process

### Step 1: Access YouTube Studio

1. Go to https://studio.youtube.com
2. Click "Create" → "Upload videos"

### Step 2: Upload Each Video

For each of the 3 videos:

#### Video 1: How Downs Work

**File:** `how-downs-work.mp4`

**Title:** `How Downs Work in Football | Kickoff Club`

**Description:**
```
Learn the fundamentals of how downs work in American football! This beginner-friendly guide breaks down the four-down system that makes football unique.

🏈 What You'll Learn:
- What is a down?
- How the four-down system works
- Line of scrimmage explained
- Gaining a first down
- What happens on 4th down

Perfect for beginners who want to understand the game better!

📚 Want to learn more? Join Kickoff Club:
https://kickoffclubhq.com

#Football #NFL #FootballForBeginners #KickoffClub #HowToWatchFootball
```

**Key Moments (Timestamps):**
- 0:00 - Introduction
- 0:30 - What is a Down?
- 1:15 - The Four-Down System
- 2:00 - Gaining a First Down
- 3:30 - Fourth Down Options

**Settings:**
- Visibility: **Public**
- Category: **Education**
- Tags: football, NFL, downs, football basics, beginners guide
- Thumbnail: Create custom thumbnail with text "How Downs Work"

---

#### Video 2: Field Layout Basics

**File:** `field-layout-basics.mp4`

**Title:** `Football Field Layout Explained | Kickoff Club`

**Description:**
```
Master the football field layout! Learn about yard lines, end zones, hash marks, and everything you need to know about the 100-yard battlefield.

🏈 What You'll Learn:
- Football field dimensions
- Yard lines and markers
- End zones explained
- Hash marks and their purpose
- Sidelines and boundaries

Perfect for new football fans!

📚 Want to learn more? Join Kickoff Club:
https://kickoffclubhq.com

#Football #NFL #FootballField #FootballForBeginners #KickoffClub
```

**Key Moments (Timestamps):**
- 0:00 - Introduction
- 0:25 - Field Dimensions
- 1:00 - Yard Lines
- 2:10 - End Zones
- 3:30 - Hash Marks

**Settings:**
- Visibility: **Public**
- Category: **Education**
- Tags: football field, NFL, field layout, football basics, yard lines
- Thumbnail: Create custom thumbnail showing field diagram

---

#### Video 3: Scoring Touchdowns

**File:** `scoring-touchdowns.mp4`

**Title:** `How to Score a Touchdown in Football | Kickoff Club`

**Description:**
```
Learn how touchdowns work in football! Discover all the ways a team can score 6 points and cross the goal line.

🏈 What You'll Learn:
- What is a touchdown?
- Breaking the plane
- Rushing vs. passing touchdowns
- Celebration rules
- What happens after a touchdown

Perfect for new NFL fans!

📚 Want to learn more? Join Kickoff Club:
https://kickoffclubhq.com

#Football #NFL #Touchdown #FootballScoring #KickoffClub
```

**Key Moments (Timestamps):**
- 0:00 - Introduction
- 0:20 - What is a Touchdown?
- 1:00 - Breaking the Plane
- 2:15 - Types of Touchdowns
- 3:30 - After the Touchdown

**Settings:**
- Visibility: **Public**
- Category: **Education**
- Tags: touchdown, NFL, football scoring, football basics, how to score
- Thumbnail: Create custom thumbnail with player crossing goal line

---

## Step 3: After Uploading

After all 3 videos are uploaded:

1. **Copy the Video IDs** from each URL
   - URL format: `https://youtube.com/watch?v=VIDEO_ID`
   - Example: `loxPN81scvI` from `https://youtube.com/watch?v=loxPN81scvI`

2. **Save the mapping:**
   ```
   how-downs-work: [VIDEO_ID_1]
   field-layout-basics: [VIDEO_ID_2]
   scoring-touchdowns: [VIDEO_ID_3]
   ```

3. **Update website code:**
   - Edit `/Users/jumaanebey/Downloads/kickoff-club-hq/app/api/video-url/route.ts`
   - Replace the old video IDs with new ones
   - Deploy to production

---

## Alternative: Automated Upload with YouTube API

If you want to automate future uploads, I can help you set up the YouTube Data API:

### Requirements:
1. Google Cloud Project
2. YouTube Data API v3 enabled
3. OAuth 2.0 credentials

### Setup Steps:

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com
   - Create new project: "Kickoff Club YouTube"

2. **Enable YouTube Data API:**
   - APIs & Services → Library
   - Search "YouTube Data API v3"
   - Enable

3. **Create OAuth 2.0 Credentials:**
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application type: Desktop app
   - Download JSON credentials

4. **Run automated upload script:**
   ```bash
   node /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/upload-to-youtube.js
   ```

Would you like me to create the automated upload script? It will save time for future batches.

---

## Tips for Better YouTube Performance

### Thumbnails:
- Use Canva or Photoshop
- Size: 1280x720 pixels
- High contrast text
- Include Kickoff Club branding
- Show action or emotion

### Optimization:
- Upload during low-traffic hours (early morning US time)
- Add to playlist: "Football Basics"
- Create YouTube Shorts from clips
- Pin comment with course link
- Respond to comments quickly

### Promotion:
- Share to Twitter/X with #NFL hashtag
- Post to r/NFLNoobs on Reddit
- Cross-post to Instagram Reels
- Run YouTube Shorts campaign
- Embed on website

---

## Video Analytics to Track

Monitor these metrics in YouTube Studio:

- **Views** - Track organic discovery
- **Watch Time** - Indicates engagement
- **CTR** - Thumbnail effectiveness
- **Retention** - Where people drop off
- **Traffic Source** - How people find you
- **Audience Demographics** - Who's watching

Aim for:
- 50%+ retention rate
- 5%+ CTR
- 50%+ from YouTube search/suggestions

---

## Next Steps After Upload

1. ✅ Upload 3 videos to YouTube
2. ✅ Copy video IDs
3. ✅ Update website code
4. ✅ Create custom thumbnails
5. ✅ Add to "Football Basics" playlist
6. ✅ Share on social media
7. ✅ Monitor analytics
8. ✅ Respond to comments
