# Featured Courses Setup Guide

## What We Built

Your homepage now pulls **real course data** from Supabase with the ability to control which courses are featured!

## Step 1: Run the Migration in Supabase

1. Go to your Supabase dashboard: https://zejensivaohvtkzufdou.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add featured columns to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_order INTEGER;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured, featured_order) WHERE is_featured = true;
```

5. Click **Run** (or press Cmd/Ctrl + Enter)

## Step 2: Mark Courses as Featured

Now you can mark any 4 courses as featured. You have two options:

### Option A: Using SQL (Quick)

In the same SQL Editor, run this query (replace the slugs with your actual course slugs):

```sql
-- Example: Mark 4 courses as featured
UPDATE courses SET is_featured = true, featured_order = 1 WHERE slug = 'your-first-course-slug';
UPDATE courses SET is_featured = true, featured_order = 2 WHERE slug = 'your-second-course-slug';
UPDATE courses SET is_featured = true, featured_order = 3 WHERE slug = 'your-third-course-slug';
UPDATE courses SET is_featured = true, featured_order = 4 WHERE slug = 'your-fourth-course-slug';
```

### Option B: Using Table Editor (Visual)

1. Go to **Table Editor** in Supabase
2. Select the **courses** table
3. Find a course you want to feature
4. Click on the row to edit it
5. Set `is_featured` to `true`
6. Set `featured_order` to a number (1-4, where 1 shows first)
7. Repeat for 3 more courses

## Step 3: Verify It's Working

1. Go to http://localhost:3000/homepage-preview
2. The Featured Courses section should now show:
   - The 4 courses you marked as featured
   - In the order you specified (by `featured_order`)
   - With their actual thumbnails (if `thumbnail_url` is set)
   - With their actual instructor names and avatars

## How It Works

The system automatically:
- ✅ Fetches only courses where `is_featured = true`
- ✅ Sorts them by `featured_order` (1, 2, 3, 4)
- ✅ Displays up to 4 courses
- ✅ Falls back to the first 4 published courses if no featured courses are set
- ✅ Uses real course thumbnails from `thumbnail_url`
- ✅ Shows real instructor data from the `instructors` table

## Managing Featured Courses

To change which courses are featured:

1. **Remove a course from featured**:
   ```sql
   UPDATE courses SET is_featured = false WHERE slug = 'course-slug';
   ```

2. **Add a new featured course**:
   ```sql
   UPDATE courses SET is_featured = true, featured_order = 3 WHERE slug = 'new-course-slug';
   ```

3. **Change the order**:
   ```sql
   UPDATE courses SET featured_order = 1 WHERE slug = 'make-this-first';
   UPDATE courses SET featured_order = 2 WHERE slug = 'make-this-second';
   ```

## Updating Course Thumbnails

To make courses show the correct topic-related images:

### Option 1: Update `thumbnail_url` in Supabase

1. Go to **Table Editor** > **courses**
2. Find your course
3. Update the `thumbnail_url` column with your image URL
4. You can use:
   - Supabase Storage URLs
   - External URLs (Unsplash, Cloudinary, etc.)
   - `/public/images/` paths if you add images locally

### Option 2: Upload to Supabase Storage

1. Go to **Storage** in Supabase
2. Create a bucket called `course-thumbnails` (make it public)
3. Upload your course images
4. Copy the public URL
5. Update the `thumbnail_url` in your courses table

## What's Next?

Your homepage is now fully dynamic! When you're ready to go live:

1. ✅ Set 4 courses as featured
2. ✅ Add real course thumbnails
3. ✅ Add real instructor photos (update `profile_image_url` in `instructors` table)
4. Replace `/app/page.tsx` with the content from `/app/homepage-preview/page.tsx`

## Files Changed

- ✅ `lib/db/queries.ts` - Added `getFeaturedCourses()` function
- ✅ `components/sections/featured-courses-section-dynamic.tsx` - Dynamic featured courses component
- ✅ `app/homepage-preview/page.tsx` - Preview page using dynamic component
- ✅ `supabase/migrations/add_featured_courses.sql` - Migration file (for reference)

## Need Help?

If courses aren't showing up:
1. Check that courses have `is_published = true`
2. Verify `is_featured = true` on at least one course
3. Check browser console for any errors
4. Ensure your Supabase connection is working

Enjoy your dynamic homepage! 🎉
