# SUPER PROMPT: Fix Kickoff Club HQ - Complete Implementation

## CONTEXT
This is a Next.js 14 football education SaaS platform with:
- Supabase database (PostgreSQL)
- Cloudflare R2 for video storage
- Stripe payments
- 10 video lessons already uploaded to R2
- 10 podcast episodes already uploaded to R2
- Live at: https://kickoff-club-hq.vercel.app
- Dev server: http://localhost:3000

## CURRENT STATE (from supabase_data_export.json)

### DATABASE
- ✅ 15 courses in database (all published)
- ✅ 10 lessons in "Football Fundamentals 101" course
- ✅ All lessons have `video_id` pointing to R2 files
- ❌ Podcast episodes NOT in database (but 10 exist in R2)
- ❌ Games table empty

### CLOUDFLARE R2 (from scripts/list-r2-videos.js output)
**Videos (10 files):**
1. how-downs-work.mp4
2. scoring-touchdowns.mp4
3. field-layout-basics.mp4
4. offensive-positions.mp4
5. defensive-positions.mp4
6. understanding-penalties.mp4
7. special-teams-basics.mp4
8. timeouts-and-clock.mp4
9. nfl-seasons-playoffs.mp4
10. quarterback-101.mp4

**Podcast Episodes (10 files):**
1. podcasts/episode-01.m4a
2. podcasts/episode-02.m4a
3. podcasts/episode-03.m4a
4. podcasts/episode-04.m4a
5. podcasts/episode-05.m4a
6. podcasts/episode-06.m4a
7. podcasts/episode-07.m4a
8. podcasts/episode-08.m4a
9. podcasts/episode-09.m4a
10. podcasts/episode-10.m4a

### R2 CREDENTIALS (in .env.local)
```
R2_ACCOUNT_ID=823743a9ea649b7611fbc9b83a1de4c1
R2_ACCESS_KEY_ID=3570f7697bff4d45926f8677113058c0
R2_SECRET_ACCESS_KEY=88e048e3a1815c1e9ae1e754576a07b1e63c662066f22b3a8b8653df96c1b7db
R2_BUCKET_NAME=kickoff-club-videos
R2_ENDPOINT=https://823743a9ea649b7611fbc9b83a1de4c1.r2.cloudflarestorage.com
```

## CRITICAL ISSUES TO FIX

### 1. GAMES ARE WRONG ❌
**Problem:** The user asked for:
- **Blitz Rush** → 3D endless runner like Temple Run/Subway Surfers
- **QB Precision** → Retro Bowl-style hold-and-drag throwing

**What was delivered instead:**
- Blitz Rush → Changed to Flappy Bird clone (WRONG)
- QB Precision → Changed to target-clicking game (WRONG)

**Action Required:**
- Revert games to what the user actually requested
- Blitz Rush: 3D perspective, dodge obstacles, lane switching, jump/slide
- QB Precision: Hold mouse/touch, drag to aim, release to throw with arc

### 2. VIDEO PLAYER NOT WORKING ❌
**Problem:** Videos aren't loading/playing correctly

**Likely causes:**
- Video component not generating signed URLs from R2
- Missing video player configuration
- Incorrect video_id → R2 URL conversion

**Files to check:**
- `components/courses/video-player.tsx`
- `lib/r2.ts` (or similar R2 helper)
- `hooks/use-video-url.ts` (if exists)

**Action Required:**
- Verify video player component generates signed URLs from video_id
- Test actual video playback in browser
- Check console for errors

### 3. PODCAST EPISODES NOT IN DATABASE ❌
**Problem:** 10 podcast audio files exist in R2 but `podcasts` table is empty

**Action Required:**
- Create script to insert 10 podcast episodes into database
- Link to R2 audio files: `podcasts/episode-01.m4a` through `podcasts/episode-10.m4a`
- Use episode metadata from `podcast-episodes/` folder (if exists)
- Verify podcast page displays episodes

### 4. COURSE THUMBNAILS MISSING ❌
**Problem:** Only "Football Fundamentals 101" has a thumbnail

**Courses needing thumbnails:**
1. ✅ Football Fundamentals 101 (`/images/courses/fundamentals.jpg`)
2. ❌ Understanding Downs & Distance
3. ❌ Field Positions Masterclass
4. ❌ Offensive Strategy Guide
5. ❌ Defensive Schemes Explained
6. ❌ Special Teams: The Third Phase
7. ❌ Quarterback Elite Training
8. ❌ Linebacker: Captain of Defense
9. ❌ Wide Receiver Route Tree
10. ❌ Common Penalties Explained
11. ❌ Clock Management Mastery
12. ❌ Offensive Formations 101
13. ❌ Defensive Coverages: Cover 1-4
14. ❌ History of Football
15. ❌ Football Equipment Guide

**Action Required:**
- Generate 14 missing course thumbnails (AI-generated images)
- Save to `public/images/courses/` with appropriate filenames
- Update database `thumbnail_url` column for each course

## IMPLEMENTATION PRIORITY

### PHASE 1: VIDEO PLAYBACK (HIGHEST PRIORITY)
1. Verify R2 signed URL generation works
2. Test video player on course lesson page
3. Ensure all 10 videos play correctly
4. Check mobile video playback

### PHASE 2: FIX GAMES
1. Revert to original game implementations
2. Implement Temple Run/Subway Surfers mechanics for Blitz Rush
3. Implement Retro Bowl throwing mechanics for QB Precision
4. Test on desktop and mobile
5. Ensure pause menu works

### PHASE 3: PODCAST EPISODES
1. Insert 10 podcast episodes into database
2. Link to R2 audio files
3. Test podcast page shows all episodes
4. Test audio player works

### PHASE 4: COURSE THUMBNAILS
1. Generate 14 remaining thumbnails
2. Save to correct locations
3. Update database
4. Verify courses page displays all thumbnails

## TESTING CHECKLIST

After implementation, verify:

### Video Playback ✓
- [ ] Visit `/courses/football-fundamentals-101`
- [ ] Click on "How Downs Work" lesson
- [ ] Video player loads and displays video
- [ ] Video plays when click play button
- [ ] All 10 lessons have working videos
- [ ] Test on mobile browser

### Games ✓
- [ ] Visit `/games/blitz-rush`
- [ ] Game loads with 3D perspective
- [ ] Can move between lanes
- [ ] Can jump/slide to avoid obstacles
- [ ] Scoring works
- [ ] Visit `/games/qb-precision`
- [ ] Can hold and drag to aim
- [ ] Ball throws with parabolic arc
- [ ] Scoring works for completions
- [ ] Both games work on mobile

### Podcasts ✓
- [ ] Visit `/podcast`
- [ ] All 10 episodes display
- [ ] Audio player loads
- [ ] Audio plays when click play
- [ ] Podcast page looks professional

### Course Thumbnails ✓
- [ ] Visit `/courses`
- [ ] All 15 courses have unique thumbnails
- [ ] Thumbnails are visually appealing
- [ ] No placeholder images

## IMPORTANT NOTES

### Video URL Generation Pattern
```typescript
// Example of correct R2 signed URL generation
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function getVideoUrl(video_id: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${video_id}.mp4`,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 7200 });
}
```

### Database Schema Reference
```sql
-- courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  thumbnail_url TEXT,
  category TEXT,
  tier_required TEXT, -- 'free', 'basic', 'premium'
  is_published BOOLEAN DEFAULT true
);

-- lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title TEXT,
  slug TEXT,
  video_id TEXT, -- R2 filename without extension
  video_url TEXT, -- deprecated, should be NULL
  is_free BOOLEAN DEFAULT false,
  order_index INTEGER
);

-- podcasts table (may need to be created)
CREATE TABLE podcasts (
  id UUID PRIMARY KEY,
  episode_number INTEGER,
  title TEXT,
  slug TEXT,
  audio_id TEXT, -- R2 path like "podcasts/episode-01"
  duration TEXT,
  publish_date DATE,
  is_published BOOLEAN DEFAULT true
);
```

## SUCCESS CRITERIA

The implementation is complete when:

1. ✅ All 10 videos play correctly in the course
2. ✅ Blitz Rush is a 3D endless runner (NOT Flappy Bird)
3. ✅ QB Precision has Retro Bowl-style throwing (NOT target clicking)
4. ✅ All 10 podcast episodes are in database and playable
5. ✅ All 15 courses have unique, professional thumbnails
6. ✅ Everything works on mobile
7. ✅ No console errors
8. ✅ User is satisfied

## FILES TO CHECK/MODIFY

Likely files that need work:
- `components/courses/video-player.tsx` - Video playback
- `lib/r2.ts` or `lib/video.ts` - R2 URL generation
- `components/games/blitz-rush.tsx` - Game implementation
- `components/games/qb-precision.tsx` - Game implementation
- `app/podcast/page.tsx` - Podcast listing
- `scripts/insert-podcast-episodes.js` - NEW: Create this
- `scripts/generate-course-thumbnails.js` - NEW: Create this

## FINAL NOTES

- **DO NOT** make assumptions about what the user wants
- **DO NOT** simplify or change requirements without asking
- **DO** verify each fix actually works before moving on
- **DO** test in the browser, not just assume code is correct
- **DO** show screenshots of working features

The user is frustrated because previous attempts:
1. Changed games to something completely different than requested
2. Didn't verify videos actually work
3. Made assumptions instead of following exact requirements

**Be thorough. Be precise. Test everything.**
