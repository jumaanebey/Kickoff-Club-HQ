# Video Integration Guide

Your Cloudflare R2 bucket is already configured! Here's how to integrate your videos with the new HQ platform.

## Current Configuration

✅ **R2 Bucket**: `kickoff-club-videos`
✅ **Bucket Region**: Configured in Cloudflare
✅ **API Credentials**: Already in `.env.local`
✅ **Video Player**: Built and ready (`EnhancedVideoPlayer` component)
✅ **API Route**: `/api/video-url` generates signed URLs

## Step 1: List Your Videos in R2

Go to your Cloudflare dashboard:
1. Navigate to: https://dash.cloudflare.com/823743a9ea649b7611fbc9b83a1de4c1/r2/buckets/kickoff-club-videos
2. Note down the filenames of all your videos

Example video names (update with your actual files):
- `how-downs-work.mp4`
- `quarterback-basics.mp4`
- `defensive-formations.mp4`

## Step 2: Update Database with Video IDs

For each video in R2, you need to create or update lessons in your Supabase database.

### Important: Video ID Must Match Filename

The `video_id` in the database **must match** the R2 filename (without `.mp4`).

Example:
- R2 file: `how-downs-work.mp4`
- Database video_id: `how-downs-work`

### SQL to Update Lessons

Run this in your Supabase SQL Editor for each video:

```sql
-- Check existing lessons
SELECT id, title, video_id, course_id
FROM lessons
ORDER BY course_id, order_index;

-- Update a lesson with video_id
UPDATE lessons
SET video_id = 'how-downs-work'  -- Must match R2 filename (without .mp4)
WHERE id = 'YOUR_LESSON_ID';

-- Or create a new lesson with video
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_id,  -- Must match R2 filename
  duration_minutes,
  order_index,
  is_free
) VALUES (
  gen_random_uuid(),
  'YOUR_COURSE_ID',
  'Introduction to Downs',
  'Learn the basics of how downs work in football',
  'how-downs-work',  -- Must match R2 filename
  12,
  1,
  true  -- Set to false for premium content
);
```

## Step 3: Test Videos Locally

1. Start your dev server (if not running):
```bash
npm run dev
```

2. Navigate to a course with a video:
```
http://localhost:3000/courses/[course-slug]/lessons/[lesson-id]
```

3. Check that:
   - ✅ Video player loads
   - ✅ Video plays from R2
   - ✅ Progress tracking works
   - ✅ No console errors

## Step 4: Configure Free vs Premium Videos

Edit `app/api/video-url/route.ts` to control which lessons are free:

```typescript
// Line 15-19
const FREE_LESSONS = [
  'introduction-to-downs',  // Add your free video IDs here
  'basic-rules',
  // Add more free lesson video_ids...
]
```

## Video Naming Convention

**Best Practice**: Use kebab-case (lowercase with hyphens) for video filenames

Good examples:
- `how-downs-work.mp4`
- `quarterback-basics.mp4`
- `offensive-line-techniques.mp4`

Bad examples:
- `How Downs Work.mp4` (spaces and caps)
- `QB_basics.mp4` (underscores and caps)

## Troubleshooting

### Video won't load
1. Check R2 bucket - does the file exist?
2. Check filename matches exactly (case-sensitive)
3. Check browser console for errors
4. Verify lesson's `video_id` matches R2 filename (without .mp4)

### "Access Denied" error
1. Verify R2 credentials in `.env.local`
2. Check R2 bucket permissions
3. Ensure API route is generating signed URLs correctly

### Video plays but progress doesn't save
1. Check user is authenticated
2. Verify Supabase connection
3. Check browser console for API errors

## Next Steps

1. **List all videos in R2** - Note down filenames
2. **Map videos to lessons** - Decide which lesson gets which video
3. **Update database** - Run SQL to set `video_id` for each lesson
4. **Test each video** - Click through and verify playback
5. **Deploy to production** - Once all working locally

## Production Deployment

After testing locally, deploy to Vercel:

1. Add R2 credentials to Vercel environment variables:
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add all R2_* variables from `.env.local`

2. Deploy:
```bash
git add .
git commit -m "Add video integration"
git push
vercel --prod
```

## Video File Size Recommendations

- **Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **Format**: MP4 (H.264 codec)
- **File size**: 50-200MB per video (depends on length)
- **Bitrate**: 2-5 Mbps for good quality

## Cost Estimates

Cloudflare R2 pricing:
- Storage: $0.015/GB/month
- Bandwidth: FREE (Class A operations only)

Example costs for 50 videos @ 100MB each:
- Total storage: 5GB
- Monthly cost: ~$0.08/month

## Support

If you need help:
1. Check browser console for errors
2. Check Vercel logs: `vercel logs`
3. Check Supabase logs in dashboard
4. Review `VIDEO_SETUP_GUIDE.md` for detailed implementation

---

**Status**: R2 is configured ✅ | Videos uploaded ✅ | Database needs updating ⏳
