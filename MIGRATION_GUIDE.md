# Database Migration Guide

## Quick Migration Options

You have **2 options** to apply the database migrations:

---

## Option A: Automatic via Supabase CLI (Recommended)

### Step 1: Get Your Supabase Access Token

1. Go to [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens)
2. Click **"Generate New Token"**
3. Give it a name (e.g., "CLI Access")
4. Copy the token

### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```bash
# Personal access token from https://supabase.com/dashboard/account/tokens
SUPABASE_ACCESS_TOKEN=sbp_your_access_token_here
```

### Step 3: Link and Push Migrations

```bash
# Link your project
export SUPABASE_ACCESS_TOKEN=sbp_your_token_here
npx supabase link --project-ref zejensivaohvtkzufdou

# Push migrations
npx supabase db push
```

That's it! All 6 migrations will be applied automatically.

---

## Option B: Manual via Supabase Dashboard (5 minutes)

### Step 1: Copy the Combined Migration

The file `/tmp/combined_migration.sql` contains all 6 migrations in one file (1110 lines).

### Step 2: Execute in Dashboard

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new)
2. Click **"New Query"**
3. Paste the contents of `/tmp/combined_migration.sql`
4. Click **"Run"**

Done! All features will be added to your database.

---

## What Gets Migrated

All 6 migrations add these features:
- **Discussion System** (comments, replies, likes)
- **Learning Paths** (curated course sequences, prerequisites)
- **Notes & Streaks** (personal notes, daily streaks, leaderboards)
- **Practice Drills** (interactive exercises with scoring)
- **Study Groups** (team collaboration, invitations)
- **Tags & Activity Feed** (social features, following)

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
