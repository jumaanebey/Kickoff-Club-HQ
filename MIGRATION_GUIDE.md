# Database Migration Guide

## Automatic Migration Setup

Follow these steps to automatically apply the new database migrations:

### Step 1: Get Your Service Role Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/zejensivaohvtkzufdou/settings/api)
2. Navigate to: **Settings → API**
3. Copy the **service_role** key (NOT the anon key!)

### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```bash
# Get this from Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Run Migrations

```bash
npm run migrate
```

That's it! The script will automatically apply all 6 new migrations:
- Discussion System (comments, replies, likes)
- Learning Paths (curated course sequences)
- Notes & Streaks (personal notes, daily streaks, leaderboards)
- Practice Drills (interactive exercises)
- Study Groups (team collaboration)
- Tags & Activity Feed (social features)

## What Gets Created

### New Tables (23 total)
- `lesson_comments`, `comment_replies`, `comment_likes`
- `learning_paths`, `learning_path_courses`, `user_learning_paths`, `course_prerequisites`
- `lesson_notes`, `user_streaks`, `daily_activity_log`, `leaderboard_entries`
- `practice_drills`, `drill_attempts`, `drill_scores`
- `study_groups`, `group_members`, `group_progress`, `group_invitations`
- `tags`, `course_tags`, `lesson_tags`, `activity_feed`, `activity_likes`, `user_follows`

### Updated Tables
- `profiles` table: Added `follower_count` and `following_count` fields

## Troubleshooting

If you see "already exists" errors, that's okay! The script skips those automatically.

If migrations fail, you can apply them manually in Supabase Dashboard:
1. Go to **SQL Editor**
2. Copy/paste each migration file from `supabase/migrations/`
3. Run them in order (20250120 through 20250125)
