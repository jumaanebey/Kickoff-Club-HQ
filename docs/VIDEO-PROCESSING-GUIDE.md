# Kickoff Club Video Processing Guide

Complete guide for processing NotebookLM videos with watermark removal for the Kickoff Club platform.

## Overview

This guide documents the workflow for removing NotebookLM watermarks from lesson videos and preparing them for upload to YouTube and Cloudflare R2.

## Prerequisites

### Required Software

1. **FFmpeg** - Video processing tool
   ```bash
   # Install via Homebrew (macOS)
   brew install ffmpeg
   ```

2. **bc** - Calculator for bash (usually pre-installed on macOS)

### Directory Structure

```
/Users/jumaanebey/Downloads/
├── kickoff-club-v2/dist/assets/lessons/  # Source videos (with watermarks)
├── kickoff-videos-clean/                  # Processed videos (watermark removed)
└── kickoff-club-hq/scripts/               # Processing scripts
```

## Watermark Removal Script

### Location
`/Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh`

### Features
- Batch processes all `.mp4` files in input directory
- Removes NotebookLM watermark (bottom-right corner)
- Trims last 3 seconds (removes NotebookLM outro)
- Color-matched fill (#F5F5F5 light gray)
- Preserves audio quality (copy codec, no re-encoding)
- Maintains video quality while reducing file size

### Watermark Configuration

```bash
WATERMARK_WIDTH=180      # Width of watermark overlay (pixels)
WATERMARK_HEIGHT=35      # Height of watermark overlay (pixels)
WATERMARK_Y_OFFSET=70    # Distance from bottom edge (pixels)
WATERMARK_X_OFFSET=190   # Distance from right edge (pixels)
```

### Usage

#### Process all videos (default directories)
```bash
bash /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh
```

#### Process specific directory
```bash
bash /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh \
  "/path/to/input" \
  "/path/to/output"
```

### Processing Time
- Approximately 10-30 seconds per minute of video
- 5-minute video: ~1-2 minutes
- 10 videos (total ~45 minutes): ~15-20 minutes

## Step-by-Step Workflow

### 1. Export Videos from NotebookLM

1. Create your lesson content in NotebookLM
2. Export as video (1280x720, 24fps recommended)
3. Download to your local machine
4. Place in source directory

### 2. Organize Source Videos

```bash
# Place videos in source directory
cp ~/Downloads/new-lesson.mp4 /Users/jumaanebey/Downloads/kickoff-club-v2/dist/assets/lessons/

# Verify videos are present
ls -lh /Users/jumaanebey/Downloads/kickoff-club-v2/dist/assets/lessons/
```

### 3. Run Watermark Removal

```bash
# Process all videos
bash /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh

# Output will show progress for each video:
# 🎬 Removing watermarks from videos...
# Processing: lesson-name.mp4
# ✅ Completed: lesson-name.mp4
```

### 4. Review Processed Videos

```bash
# Open output directory
open /Users/jumaanebey/Downloads/kickoff-videos-clean/

# Check file sizes (should be ~30-40% smaller)
ls -lh /Users/jumaanebey/Downloads/kickoff-videos-clean/
```

**Quality Check:**
- Watermark should be covered with subtle gray overlay
- No visible distortion or artifacts
- Audio should be clear and synchronized
- Video should end before NotebookLM outro

### 5. Upload to YouTube (Free Lessons Only)

For free preview lessons that you want to promote:

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Select processed video from `/Users/jumaanebey/Downloads/kickoff-videos-clean/`
4. Fill in metadata:
   - **Title**: Match lesson title from database
   - **Description**: Include timestamps and key points
   - **Visibility**: Public
   - **Category**: Education
5. Copy the video ID from the URL (e.g., `loxPN81scvI`)
6. Update website code with new video ID

### 6. Upload to Cloudflare R2 (All Lessons)

For all lesson videos (both free and paid):

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 → kickoff-club-videos bucket
3. Click "Upload"
4. Select video from `/Users/jumaanebey/Downloads/kickoff-videos-clean/`
5. Use consistent naming: `lesson-slug.mp4`
6. Update database with R2 video URL

### 7. Update Website Code

#### For YouTube videos (free lessons)

Edit `/Users/jumaanebey/Downloads/kickoff-club-hq/app/api/video-url/route.ts`:

```typescript
const YOUTUBE_VIDEOS: Record<string, string> = {
  'how-downs-work': 'loxPN81scvI',
  'field-layout-basics': 'Ak66qEQmuqo',
  'scoring-touchdowns': 'Ko91qse8GjQ',
  // Add new video IDs here
}
```

#### For R2 videos (all lessons)

Update Supabase database:

```bash
# Run update script
node /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/update-lesson-video.js \
  --lesson-id "uuid-here" \
  --video-url "https://r2.kickoffclub.com/lesson-slug.mp4"
```

### 8. Test and Deploy

1. Test locally:
   ```bash
   cd /Users/jumaanebey/Downloads/kickoff-club-hq
   npm run dev
   ```

2. Navigate to lesson page and verify:
   - Video loads correctly
   - No watermark visible
   - Audio/video in sync
   - Controls work properly

3. Deploy to production:
   ```bash
   git add .
   git commit -m "Update lesson videos with watermark removal"
   git push
   ```

## Troubleshooting

### Watermark Still Visible

If the watermark is still visible after processing:

1. **Adjust position** - Watermark may be in different location:
   ```bash
   # Edit script and adjust these values:
   WATERMARK_X_OFFSET=190  # Increase to move left, decrease to move right
   WATERMARK_Y_OFFSET=70   # Increase to move up, decrease to move down
   ```

2. **Adjust size** - Watermark may be larger/smaller:
   ```bash
   WATERMARK_WIDTH=180   # Increase to cover wider area
   WATERMARK_HEIGHT=35   # Increase to cover taller area
   ```

3. **Change color** - Background may be different shade:
   ```bash
   # In the ffmpeg command, change color:
   color=#F5F5F5  # Light gray (current)
   color=#FFFFFF  # Pure white
   color=#E8E8E8  # Slightly darker gray
   ```

### Video Quality Issues

If processed video looks degraded:

1. **Increase quality** - Adjust FFmpeg quality settings:
   ```bash
   # Add these flags to ffmpeg command:
   -crf 18  # Lower = better quality (default is 23, range 0-51)
   -preset slow  # Slower encoding = better quality
   ```

2. **Avoid re-encoding audio**:
   ```bash
   # Already implemented in script:
   -c:a copy  # Copy audio without re-encoding
   ```

### Processing Fails

1. **Check FFmpeg installation**:
   ```bash
   which ffmpeg
   /opt/homebrew/bin/ffmpeg --version
   ```

2. **Check file permissions**:
   ```bash
   chmod +x /Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh
   ```

3. **Check input files exist**:
   ```bash
   ls -la /Users/jumaanebey/Downloads/kickoff-club-v2/dist/assets/lessons/*.mp4
   ```

### Large File Sizes

If output files are too large:

1. **Adjust compression**:
   ```bash
   # Add to ffmpeg command:
   -crf 25  # Higher = smaller file (but lower quality)
   ```

2. **Reduce resolution** (if acceptable):
   ```bash
   # Add to -vf filter:
   -vf "scale=1280:720,drawbox=..."  # Ensure 720p
   ```

## Current Lesson Videos

List of all lesson videos in the Kickoff Club platform:

| Lesson Name | File | Size | Duration | Status |
|-------------|------|------|----------|--------|
| How Downs Work | how-downs-work.mp4 | 25M | ~5min | Free |
| Field Layout Basics | field-layout-basics.mp4 | 24M | ~5min | Free |
| Scoring Touchdowns | scoring-touchdowns.mp4 | 22M | ~4.5min | Free |
| Defensive Positions | defensive-positions.mp4 | 39M | ~7min | Paid |
| Offensive Positions | offensive-positions.mp4 | 43M | ~8min | Paid |
| Quarterback 101 | quarterback-101.mp4 | 30M | ~6min | Paid |
| Special Teams Basics | special-teams-basics.mp4 | 25M | ~5min | Paid |
| Understanding Penalties | understanding-penalties.mp4 | 36M | ~7min | Paid |
| Timeouts and Clock | timeouts-and-clock.mp4 | 48M | ~9min | Paid |
| NFL Seasons & Playoffs | nfl-seasons-playoffs.mp4 | 62M | ~12min | Paid |

## File Size Expectations

After processing with watermark removal:

- **Before**: 22-62 MB (average ~35 MB)
- **After**: 7-25 MB (average ~12 MB)
- **Reduction**: ~65-70% file size reduction
- **Quality**: Minimal visible quality loss

## Best Practices

1. **Always keep original videos** - Don't delete source files
2. **Review before upload** - Manually check each processed video
3. **Consistent naming** - Use slug format: `lesson-name.mp4`
4. **Batch process** - Process all videos at once for consistency
5. **Version control** - Commit script changes to git
6. **Document changes** - Update this guide with any modifications
7. **Test locally first** - Verify videos work before deploying
8. **Backup processed videos** - Keep copies of clean versions

## Quick Reference Commands

```bash
# Process all videos
bash ~/Downloads/kickoff-club-hq/scripts/remove-watermark.sh

# Check processing progress
ls -lh ~/Downloads/kickoff-videos-clean/

# Open output directory
open ~/Downloads/kickoff-videos-clean/

# Test single video with custom settings
/opt/homebrew/bin/ffmpeg -i input.mp4 -t 297 \
  -vf "drawbox=x=iw-190:y=ih-70:w=180:h=35:color=#F5F5F5:t=fill" \
  -c:a copy output.mp4 -y

# Check video details
/opt/homebrew/bin/ffprobe -v error -show_entries format=duration,format=size,stream=width,height input.mp4
```

## Support and Resources

- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **FFmpeg Filters**: https://ffmpeg.org/ffmpeg-filters.html
- **Video Codecs**: https://trac.ffmpeg.org/wiki/Encode/H.264
- **This Script**: `/Users/jumaanebey/Downloads/kickoff-club-hq/scripts/remove-watermark.sh`

## Changelog

### 2025-11-13
- Initial guide created
- Documented watermark removal workflow
- Added troubleshooting section
- Listed all 10 current lesson videos
