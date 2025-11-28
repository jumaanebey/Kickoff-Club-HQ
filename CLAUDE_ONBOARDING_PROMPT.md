# Claude Code Onboarding Prompt for Kickoff Club HQ

Copy and paste this entire prompt to get Claude Code up to speed on the project.

---

## Project Context

I'm working on **Kickoff Club HQ** - a football education platform with courses, lessons, games, and podcasts. You're joining mid-project and need to understand the current state.

## Tech Stack
- **Framework**: Next.js 14 with App Router (TypeScript/React)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Storage**: Cloudflare R2 for video/audio files (using AWS S3 SDK with presigner)
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Database Schema Overview

### Key Tables:
1. **courses** - 15 published courses with thumbnails
   - Fields: id, title, slug, description, thumbnail_url, difficulty_level, tier_required, category, is_published

2. **lessons** - Video lessons linked to courses
   - Fields: id, title, course_id, video_id, duration_seconds, is_free, order_index
   - **IMPORTANT**: Only "Football Fundamentals 101" has 10 lessons. Other 14 courses have 0 lessons.

3. **podcasts** - 10 podcast episodes stored in R2
   - Fields: id, title, description, audio_url, episode_number, duration_seconds

4. **user_progress** - Tracks user lesson completion
   - Fields: user_id, lesson_id, completed, progress_percentage, last_position_seconds

5. **enrollments** - Tracks course enrollments
   - Fields: user_id, course_id, enrolled_at, progress_percentage, completed_at

6. **lesson_comments** - User comments on lessons
   - Setup script: `node scripts/setup-lesson-comments.js`

## R2 Storage (Cloudflare)

### Videos (10 total):
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

### Podcasts (10 total):
Located in `podcasts/episode-01.m4a` through `podcasts/episode-10.m4a`

### R2 Signed URL Pattern:
```typescript
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

## Environment Variables

Check `.env.local` for:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side key
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` - Cloudflare R2 credentials
- `R2_BUCKET_NAME=kickoff-club-videos`
- `R2_ENDPOINT` - Cloudflare R2 endpoint
- `SUPABASE_ACCESS_TOKEN` - Personal access token for MCP server

## MCP Configuration

The project has `.mcp.json` configured with two Model Context Protocol servers:

### 1. Supabase MCP
- **Purpose**: Direct database access and management
- **Configuration**: Uses project ref `zejensivaohvtkzufdou`
- **Authentication**: `SUPABASE_ACCESS_TOKEN` in `.env.local`
- **Capabilities**:
  - Query database tables directly
  - Inspect schemas and table structures
  - Manage data (CRUD operations)
  - Access Edge Functions
  - View RLS policies

### 2. Playwright MCP
- **Purpose**: Browser automation and testing
- **Configuration**: No additional setup needed
- **Capabilities**:
  - Automate browser interactions
  - Take screenshots of pages
  - Perform E2E testing
  - Debug web UI issues
  - Test responsive designs

### MCP Setup Details:
```json
// .mcp.json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=zejensivaohvtkzufdou"],
      "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Token Generated**: November 12, 2025
**Token Location**: `.env.local` as `SUPABASE_ACCESS_TOKEN`
**Security**: Token is gitignored via `.env*.local` pattern

You should have access to these MCPs for enhanced capabilities when working on the project.

## Key Features & Current State

### ✅ Working Features:
1. **Video Player** - Canvas-based custom controls with R2 signed URLs
   - API route: `/api/video-url` generates signed URLs
   - Free lessons list in API route

2. **Course Cards** - Display with progress tracking
   - Component: `components/courses/course-card.tsx`
   - Shows CourseProgressTracker when lessons exist

3. **Progress Tracking** - Animated progress bars with motivational messages
   - Component: `components/ui/course-progress-tracker.tsx`

4. **Podcasts** - All 10 episodes in database with R2 audio URLs

5. **Games Hub** - Located at `/games` (Antigravity's work)
   - 13 interactive football games with component-based architecture
   - Featured games: Blitz Rush (3D runner), QB Precision (throwing game)
   - Includes: Formation Frenzy, Guess the Penalty, Play Caller, Route Runner, Signal Caller, Snap Reaction, Clock Manager
   - Features: Leaderboards, achievements, sound effects, mobile controls, progress tracking

### ⚠️ Known Issues:

1. **Empty Courses** - 14 of 15 courses have 0 lessons
   - Only "Football Fundamentals 101" has content
   - UI is ready but needs lesson content

2. **Games Architecture** - Two different implementations exist
   - **Antigravity's approach**: Separate component files in `components/games/`
   - **Previous approach**: Inline implementations in page files
   - **Git conflict**: A force-push occurred that may have caused conflicts
   - **Current state**: Antigravity's component-based approach is in place

## Recent Work

### Antigravity's Contributions:
Antigravity (another AI assistant) has been working on this project and made significant improvements:

1. **Game Components Architecture** - Created 13 separate game components in `components/games/`:
   - `blitz-rush.tsx` - 3D Temple Run-style endless runner (37KB, most complex)
   - `qb-precision.tsx` - Retro Bowl-style QB throwing game
   - `formation-frenzy.tsx` - Formation recognition game
   - `guess-the-penalty.tsx` - Penalty identification game
   - `play-caller.tsx` - Play calling strategy game
   - `route-runner.tsx` - Route running game
   - `signal-caller.tsx` - Signal recognition game
   - `snap-reaction.tsx` - Reaction time game
   - `clock-manager.tsx` - Clock management game
   - `interactive-playbook.tsx` - Playbook learning tool
   - `leaderboard.tsx` - Shared leaderboard component
   - `game-pause-menu.tsx` - Shared pause menu
   - `achievement-popup.tsx` - Achievement notification system

2. **Latest Fix (Commit 05ee0b0)** - Nov 23, 2025:
   - Fixed courses page query to include nested lessons
   - Fixed Blitz Rush sound bug
   - Added migration scripts for database management

3. **Game Features Added**:
   - Local progress tracking
   - Sound effects and settings
   - Leaderboards with real user profiles
   - Achievement system
   - Supabase integration for game progress
   - Mobile responsive controls
   - Premium start screens

### My Previous Work:
1. Set up lesson comments system with migration and script
2. Inserted all 10 podcast episodes into database
3. Fixed video URL generation with R2 signed URLs
4. Configured MCP servers (Supabase + Playwright)

### Git Conflict History:
- **Issue**: I previously force-pushed and overwrote some of Antigravity's work
- **Resolution**: Antigravity's component-based approach is now in place
- **Lesson**: Never force-push; always pull and merge properly

### File Structure:
```
/app
  /courses
    - page.tsx (server component with Supabase query)
    - courses-client.tsx (client component with filters/UI)
    - /[slug]
      /lessons/[lessonId]
        - page.tsx (lesson player page)
  /games
    - page.tsx (games hub)
    /blitz-rush
      - page.tsx
    /qb-precision
      - page.tsx
  /podcasts
    - page.tsx (podcast listing)
  /api
    /video-url
      - route.ts (R2 signed URL generation)

/components
  /courses
    - course-card.tsx
  /games (Antigravity's work - 13 game components)
    - blitz-rush.tsx (37KB - main 3D runner)
    - qb-precision.tsx
    - formation-frenzy.tsx
    - guess-the-penalty.tsx
    - play-caller.tsx
    - route-runner.tsx
    - signal-caller.tsx
    - snap-reaction.tsx
    - clock-manager.tsx
    - interactive-playbook.tsx
    - leaderboard.tsx (shared)
    - game-pause-menu.tsx (shared)
    - achievement-popup.tsx (shared)
  /ui
    - course-progress-tracker.tsx
    - video-player.tsx

/scripts
  - insert-podcasts.js
  - setup-lesson-comments.js

/database/migrations
  - 004_create_lesson_comments.sql
```

## Git Context

- **Current Branch**: Check with `git branch`
- **Recent Conflict**: I previously force-pushed and overwrote another developer's work
- **Important**: Always pull and merge properly, never force-push to main

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run scripts
node scripts/setup-lesson-comments.js
node scripts/insert-podcasts.js

# Database queries (with Supabase MCP, you can query directly)
```

## Immediate Next Steps (If Asked)

1. **Add Lessons to Empty Courses** - Create 3-5 lessons per course
   - Can be placeholders with "Coming Soon" if no videos
   - Script: `scripts/generate-all-course-lessons.js` (needs creation)

2. **Test Video Playback** - Verify R2 signed URLs working for all 10 videos

3. **Verify Games** - Check if games are working properly after git conflict

4. **Progress Tracking** - Test that CourseProgressTracker updates correctly

## Important Notes

- **Never force-push** - This project has multiple developers
- **Supabase Project**: zejensivaohvtkzufdou.supabase.co
- **R2 Bucket**: kickoff-club-videos
- **Dev Server**: Usually runs on port 3000 (or 3001 if 3000 is taken)
- **Free Lessons**: 10 lessons are marked as free (is_free=true) for preview

## Questions to Ask Me

Before starting work, you might want to ask:
1. What specific feature should we work on?
2. Should we prioritize adding lessons to empty courses?
3. Are there any bugs or issues to fix first?
4. Should we test the existing features?

---

**You're now up to speed! Ask me what you should work on first.**

---

## ⚠️ CRITICAL: Your Working Directory

**STOP! Read this carefully before doing ANYTHING:**

### Your Active Working Directory
```
~/Projects/Kickoff-Club/kickoff-club-hq/
```

This is where you should read and write code files.

### Project Structure Context

The project lives in an umbrella folder structure:
```
~/Projects/Kickoff-Club/               # Umbrella folder (DO NOT code here)
├── kickoff-club-hq/                   # ✅ YOUR WORKING DIRECTORY
│   ├── app/                           # ✅ Edit these
│   ├── components/                     # ✅ Edit these
│   ├── scripts/                       # ✅ Edit these
│   └── ...                            # ✅ This is the active project
├── mobile-app/                         # ❌ Read-only reference
├── content/                            # ❌ Static content files
├── assets/                             # ❌ Images, docs (read-only)
└── archive/                            # ❌ Old versions (never touch)
```

### Rules for File Operations

**✅ DO:**
- Write/edit files in `~/Projects/Kickoff-Club/kickoff-club-hq/`
- Use paths like `app/`, `components/`, `scripts/` when editing
- Run `npm run dev` from `kickoff-club-hq/` directory
- Git operations from `kickoff-club-hq/` directory

**❌ DON'T:**
- Write to `~/Projects/Kickoff-Club/mobile-app/` (planning docs, reference only)
- Write to `~/Projects/Kickoff-Club/content/` (static video/content files)
- Write to `~/Projects/Kickoff-Club/assets/` (logos, images, docs)
- Write to `~/Projects/Kickoff-Club/archive/` (old versions, historical only)
- Confuse the umbrella folder with your working directory

### Why This Matters

The user consolidated ALL Kickoff Club files into one umbrella location. There are:
- Old archived projects
- Planning documents  
- Static content
- **ONE active project** - `kickoff-club-hq/`

When you see "Projects/Kickoff-Club" mentioned, remember:
- It's the umbrella folder containing everything
- You only work in the `kickoff-club-hq/` subdirectory
- Other folders are reference/archive

### Example Scenarios

**Scenario 1: User says "add a new feature"**
- ✅ Edit files in `~/Projects/Kickoff-Club/kickoff-club-hq/app/`
- ❌ Don't create files in `~/Projects/Kickoff-Club/`

**Scenario 2: User mentions "mobile app docs"**
- ✅ Read from `~/Projects/Kickoff-Club/mobile-app/docs/`
- ❌ Don't edit them (they're planning docs, not code)

**Scenario 3: User says "check the videos"**
- ✅ Reference `~/Projects/Kickoff-Club/content/kickoff-videos-clean/`
- ❌ Don't move or edit (they're static content)

**Scenario 4: User says "look at archived code"**
- ✅ Read from `~/Projects/Kickoff-Club/archive/`
- ❌ Never edit (historical reference only)

### When In Doubt

If you're unsure where to create/edit a file, ASK:
- "Should this go in the main kickoff-club-hq app, or is it a reference document?"
- Your default should ALWAYS be `~/Projects/Kickoff-Club/kickoff-club-hq/`

---

**Summary**: Code in `kickoff-club-hq/`, reference everything else.

