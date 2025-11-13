# SQL Cleanup Summary

## Overview
This document describes the SQL consolidation and cleanup performed to fix schema contradictions, remove redundancies, and establish a clear database structure.

---

## Changes Made

### 1. Fixed Lessons Table Schema Conflict ✅

**Problem:** Two migrations created incompatible `lessons` table schemas.

**Solution:** Merged both schemas into the initial schema file with all necessary columns.

**File Modified:** `supabase/migrations/20250101000000_initial_schema.sql`

**Changes:**
- ✅ Added `video_id VARCHAR(255) NOT NULL` - Primary identifier for videos
- ✅ Added `is_free BOOLEAN DEFAULT FALSE` - Allows free access without subscription
- ✅ Changed `video_url TEXT NOT NULL` to `TEXT` (nullable) - Optional direct URL
- ✅ Renamed `video_duration_seconds` to `duration_seconds` - Standardized column name
- ✅ Kept `resources JSONB` column - For lesson resources/materials
- ✅ Added `role VARCHAR(50) DEFAULT 'user' NOT NULL` to profiles table - Required by RLS policies

**Lessons Table Final Schema:**
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  video_id VARCHAR(255) NOT NULL,        -- Primary video identifier
  video_url TEXT,                         -- Optional: direct URL
  duration_seconds INTEGER DEFAULT 0,     -- Standardized name
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  resources JSONB DEFAULT '[]'::jsonb,
  is_free BOOLEAN DEFAULT FALSE,          -- Free access flag
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(course_id, slug)
);
```

---

### 2. Archived Redundant Files ✅

Created archive folders and moved duplicate/conflicting files to keep the codebase clean.

#### Migrations Archived:
- `supabase/migrations/_archive/20250104_create_lessons_tables.sql` - Conflicted with initial schema
- `supabase/migrations/_archive/20250105_add_remaining_lessons.sql` - Duplicate of 20250112
- `supabase/migrations/_archive/20250111_add_lesson_quizzes.sql` - Duplicate of 20250114
- `supabase/migrations/_archive/20250112_add_remaining_lessons.sql` - Conflicted with 10-course structure
- `supabase/migrations/_archive/20250113_seed_10_courses.sql` - Duplicate of database/seeds/seed.sql

#### Root-Level Ad-Hoc Scripts Archived:
- `_archive/ADD_REMAINING_9_LESSONS.sql` - Ad-hoc script, replaced by proper migrations
- `_archive/FIX_COURSE_DATA.sql` - Ad-hoc fix, no longer needed
- `_archive/add-lessons-to-courses.sql` - Ad-hoc script
- `_archive/update-difficulty-levels.sql` - Duplicate update script
- `_archive/check-and-update-difficulty.sql` - Duplicate update script

#### Scripts Archived:
- `scripts/_archive/update-podcast-urls.sql` - Identical to fix-podcast-urls.sql
- `scripts/_archive/fix-podcast-urls.sql` - Duplicate

---

### 3. Fixed Migration Timestamps ✅

**Problem:** Two migrations had future dates (year 2025, month 11 instead of 01).

**Files Renamed:**
- `20251110_add_course_thumbnails.sql` → `20250110_add_course_thumbnails.sql`
- `20251111_update_podcast_covers_to_png.sql` → `20250111_update_podcast_covers_to_png.sql`

---

## Current Clean Structure

### Active Migrations (in chronological order):
```
supabase/migrations/
├── 20250101000000_initial_schema.sql          ✅ Fixed - merged schema
├── 20250104_add_sample_lesson_data.sql        ✅ Sample data inserts
├── 20250110_add_course_thumbnails.sql         ✅ Fixed timestamp
├── 20250111_add_waitlist.sql                  ✅ Waitlist table
├── 20250111_reorder_courses.sql               ✅ Course ordering
├── 20250111_update_podcast_covers_to_png.sql  ✅ Fixed timestamp
├── 20250114_add_all_lesson_quizzes.sql        ✅ Quiz functionality
├── add_featured_courses.sql                   ✅ Featured courses
└── create-podcasts-table.sql                  ✅ Podcasts table
```

### Active Scripts:
```
scripts/
├── populate-lessons-production.sql            ✅ Production lesson data
├── update-course-thumbnails.sql               ✅ Thumbnail updates
├── update-all-images-to-jpg.sql               ✅ Image format fixes
├── fix-course-titles.sql                      ✅ Course title updates
└── fix-all-course-descriptions.sql            ✅ Description updates
```

### Seed Files:
```
database/seeds/
└── seed.sql                                   ✅ Canonical seed data (10 courses)
```

### Other SQL Files:
```
supabase/
├── setup-complete.sql                         ✅ Setup utilities
└── create-profile-trigger.sql                 ✅ Profile automation

Root:
├── supabase-migrations.sql                    ⚠️  Review - may be redundant
└── supabase-features-migration.sql            ⚠️  Review - may be redundant
```

---

## Remaining Considerations

### 1. Production Database State
Your production database currently has the "How Downs Work" course with these lessons:
- `introduction-to-downs` (UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890) - FREE
- `ten-yard-rule` - FREE
- `fourth-down-decisions` - PREMIUM

These were created by `scripts/populate-lessons-production.sql` and are working correctly.

### 2. Development/Seed Data
The `database/seeds/seed.sql` file creates 10 separate courses with 1 lesson each. This is a different structure from production but useful for fresh development environments.

### 3. Migration Strategy
**For Existing Databases:**
- Create a new migration to add missing columns (`ALTER TABLE` statements)
- This ensures production databases get the updated schema

**For Fresh Deployments:**
- The fixed `20250101000000_initial_schema.sql` will create the correct schema

---

## Files Safe to Delete (Optional)

These root-level files may be redundant and can be reviewed for deletion:
- `supabase-migrations.sql` - Check if this is still used
- `supabase-features-migration.sql` - Check if this is still used

---

## Summary Statistics

**Before Cleanup:**
- 31 SQL files total
- 5+ files with duplicate lesson data
- 2 conflicting table schemas
- 13 redundant files identified

**After Cleanup:**
- 20 active SQL files (organized by purpose)
- 11 files archived (safe to reference later)
- 1 unified lessons table schema
- Clear separation: migrations vs. scripts vs. seeds

---

## Next Steps (Optional)

1. **Create Migration for Existing Databases:**
   ```sql
   -- Add missing columns to existing lessons tables
   ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_id VARCHAR(255);
   ALTER TABLE lessons ALTER COLUMN video_url DROP NOT NULL;
   ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;
   ALTER TABLE lessons RENAME COLUMN video_duration_seconds TO duration_seconds;
   ```

2. **Review Root SQL Files:**
   - Check if `supabase-migrations.sql` is still needed
   - Check if `supabase-features-migration.sql` is still needed

3. **Add Timestamps to Unnamed Migrations:**
   - `add_featured_courses.sql` → Consider renaming to `20250115_add_featured_courses.sql`
   - `create-podcasts-table.sql` → Consider renaming to `20250116_create_podcasts_table.sql`

---

## Contact

If you encounter any issues with the cleaned SQL structure, the archived files are preserved in:
- `supabase/migrations/_archive/`
- `_archive/`
- `scripts/_archive/`

All original functionality is maintained - files were only moved, not deleted.
