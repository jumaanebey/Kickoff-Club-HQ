# 🎬 Lesson Setup Guide

This guide will help you add lesson data to your production Supabase database and fix the "Watch Free Lesson" button.

## 📋 Quick Overview

**Problem:** "Watch Free Lesson" button shows 404 because no lessons exist in database
**Solution:** Run SQL script to create lessons, then update button with lesson UUID
**Time:** ~5 minutes

---

## Step 1: Run SQL in Supabase Dashboard

1. **Open your Supabase project**
   - Go to https://supabase.com/dashboard
   - Select your Kickoff Club HQ project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy & Paste the SQL**
   - Open `scripts/populate-lessons-production.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor

4. **Run the Query**
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for success message

5. **Copy the Lesson UUID**
   - Look for this line in the output:
   ```
   ✅ Lesson created with ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
   - Copy the UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## Step 2: Update Watch Free Lesson Button

Tell Claude Code:

```
Update the Watch Free Lesson button in components/sections/hero-section.tsx
to link to: /courses/how-downs-work/lessons/a1b2c3d4-e5f6-7890-abcd-ef1234567890

Change line 55 from:
  href="/courses/how-downs-work"
To:
  href="/courses/how-downs-work/lessons/a1b2c3d4-e5f6-7890-abcd-ef1234567890"

Then commit and deploy to production.
```

---

## Step 3: Verify It Works

1. Visit your production site
2. Click "Watch Free Lesson" on homepage
3. Should load the lesson page (may show placeholder if video not uploaded yet)

---

## 📝 What Gets Created

### 3 Lessons for "How Downs Work" Course:

1. **Introduction to Downs** (FREE)
   - UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - Duration: 7 minutes
   - This is the lesson the button will link to

2. **The 10-Yard Rule** (FREE)
   - Duration: 6 minutes

3. **What Happens on 4th Down** (PREMIUM)
   - Duration: 8 minutes
   - Requires subscription

---

## 🎥 Video Upload (Optional - For Later)

Once lessons are in the database, you'll need to upload actual video files:

### Where to Upload:
- Cloudflare R2 bucket (if configured)
- OR YouTube (embed links)
- OR any video hosting service

### Video IDs to Match:
```
introduction-to-downs.mp4
ten-yard-rule.mp4
fourth-down-decisions.mp4
```

**Note:** The lesson page will work even without videos uploaded yet. It will show a placeholder or error message until videos are added.

---

## ✅ Success Checklist

- [ ] SQL script ran successfully in Supabase
- [ ] Got lesson UUID from output
- [ ] Updated hero-section.tsx with lesson UUID
- [ ] Committed and deployed to production
- [ ] "Watch Free Lesson" button no longer gives 404
- [ ] Button takes you to lesson page

---

## 🆘 Troubleshooting

### "Course 'how-downs-work' not found"
**Fix:** Your course doesn't exist. Run this first:
```sql
INSERT INTO courses (title, slug, description, is_published, tier_required)
VALUES ('How Downs Work', 'how-downs-work', 'Master the fundamental concept of football', true, 'free');
```

### "Unique violation on slug"
**Fix:** Lessons already exist. That's fine! Just copy the lesson ID from your database:
```sql
SELECT id, title FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'how-downs-work') ORDER BY order_index LIMIT 1;
```

### Button still gives 404 after update
**Fix:**
1. Clear Vercel build cache
2. Verify deployment succeeded
3. Check lesson ID is correct UUID format
4. Verify lesson `is_published = true` in database

---

## 📚 Additional Resources

- **Lesson Migrations:** `supabase/migrations/20250104_add_sample_lesson_data.sql`
- **Lesson Queries:** `database/queries/lessons.ts`
- **Lesson Page:** `app/courses/[slug]/lessons/[lessonId]/page.tsx`

---

**Ready?** Run the SQL script in Supabase, then tell Claude Code to update the button! 🚀
