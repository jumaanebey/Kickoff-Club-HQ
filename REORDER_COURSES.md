# Reorder Courses: Make "How Downs Work" First

## Option 1: Run via Supabase Dashboard (Easiest)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the SQL from `supabase/migrations/20250111_reorder_courses.sql`
6. Click "Run" to execute

## Option 2: Run via Script (if you have env vars set up)

```bash
npx tsx scripts/reorder-courses.ts
```

## What This Does

✅ Makes "How Downs Work" the first course (order_index = 1)
✅ Ensures all free courses are at beginner difficulty level
✅ Orders free courses first:
   1. How Downs Work
   2. Field Layout & Scoring
   3. NFL Seasons & Playoffs

## Manual SQL (Quick Copy-Paste)

If you prefer, just run this SQL in your Supabase dashboard:

```sql
-- Set "How Downs Work" to first position
UPDATE courses
SET order_index = 1, difficulty_level = 'beginner'
WHERE slug = 'how-downs-work';

-- Set other free courses to beginner level
UPDATE courses
SET difficulty_level = 'beginner'
WHERE tier_required = 'free';
```

## Verify It Worked

After running, check the courses page at http://localhost:3001/courses
"How Downs Work" should appear first, and all free courses should show as beginner level.
