# Video Processing Workflow Improvements

Suggestions for improving the current NotebookLM watermark removal workflow for Kickoff Club.

## Current Workflow Assessment

### Strengths
- Simple bash script, easy to maintain
- Batch processing capability
- Fast processing (20x speed)
- Good file size reduction (~65%)
- Preserves audio quality
- Customizable via command-line arguments

### Limitations
- Manual color matching required
- No preview before full batch processing
- Single watermark position/size for all videos
- No automatic watermark detection
- Manual review needed for each video
- Cannot handle videos with different watermark positions

## Recommended Improvements

### 1. Enhanced FFmpeg Script (Quick Win)

#### Add Preview Mode
```bash
# Add to script before main processing loop
if [ "$PREVIEW" = "true" ]; then
  echo "🔍 Preview mode: Processing first 10 seconds only"
  PREVIEW_DURATION=10
fi
```

**Benefits:**
- Quick preview before committing to full batch
- Test positioning/color without waiting 20+ minutes
- Iterate faster on watermark settings

#### Video-Specific Configuration
```bash
# watermark-config.json
{
  "how-downs-work.mp4": {
    "width": 180,
    "height": 35,
    "x_offset": 190,
    "y_offset": 70,
    "color": "#F5F5F5"
  },
  "nfl-seasons-playoffs.mp4": {
    "width": 200,
    "height": 40,
    "x_offset": 180,
    "y_offset": 65,
    "color": "#ECECEC"
  }
}
```

**Benefits:**
- Different settings per video
- Handle varying watermark positions
- Easy to maintain and update

#### Parallel Processing
```bash
# Process multiple videos simultaneously
for video in "$INPUT_DIR"/*.mp4; do
  process_video "$video" &
done
wait
```

**Benefits:**
- Reduce total processing time by 75%
- Utilize all CPU cores
- 45 minutes of video → ~5 minutes total processing

**Estimated Implementation:** 2-3 hours

---

### 2. Simple Web Interface (Medium Effort)

Build a basic Next.js app for watermark removal with preview capability.

#### Features
- Drag-and-drop video upload
- Real-time preview with adjustable overlay
- Live position/size/color controls
- Before/after comparison
- Batch processing queue
- Download processed videos

#### Tech Stack
```typescript
// Frontend: Next.js + shadcn/ui
// Video player: video.js or react-player
// Processing: FFmpeg.wasm (browser-based) or API endpoint
// Storage: Local filesystem or Cloudflare R2
```

#### User Flow
1. Upload video or select from library
2. Adjust watermark overlay (position, size, color, opacity)
3. Preview in real-time (no processing yet)
4. Once satisfied, process video
5. Download or automatically upload to R2/YouTube

**Benefits:**
- Visual interface for non-technical users
- Instant feedback without processing
- Easier to get positioning right
- Can process videos from anywhere
- Sharable tool

**Estimated Implementation:** 1-2 days

---

### 3. Advanced AI-Based Solution (Best Quality)

#### Overview
Use machine learning models to intelligently remove watermarks with inpainting.

#### Recommended Models

**Option A: LaMa (Large Mask Inpainting)**
- Best quality for static watermarks
- Fast processing (~30 seconds per frame)
- Open source, self-hostable
```bash
git clone https://github.com/advimman/lama
python inference.py --input video.mp4 --mask watermark_mask.png
```

**Option B: ProPainter**
- Specifically designed for video inpainting
- Handles motion well
- Slower but better temporal consistency
```bash
python inference.py --video input.mp4 --mask mask.png
```

**Option C: Rife + LaMa Hybrid**
- Use Rife for frame interpolation
- LaMa for inpainting
- Best quality but slowest

#### Architecture
```
[Upload] → [Queue] → [AI Processing] → [Storage] → [Notify]
    ↓           ↓            ↓              ↓          ↓
  R2/S3    Bull/Redis   GPU Server    R2/YouTube   Email/SMS
```

#### Estimated Costs
- **Self-hosted GPU:** $0.50-$1.00/hour (RunPod, Vast.ai)
- **Per video:** $0.05-$0.20 (5-10 minutes processing)
- **Monthly (100 videos):** $5-$20

**Benefits:**
- Professional quality removal
- No visible overlay or artifacts
- Handles complex backgrounds
- Future-proof solution
- Can be monetized as SaaS product

**Estimated Implementation:** 1 week

---

### 4. Automated Upload Pipeline (Time Saver)

#### Current Manual Process
1. Process videos locally
2. Manually upload to YouTube
3. Copy video IDs
4. Update code with IDs
5. Commit and deploy

#### Proposed Automation
```bash
#!/bin/bash
# automated-pipeline.sh

# 1. Process videos
bash remove-watermark.sh

# 2. Upload to YouTube via API
for video in "$OUTPUT_DIR"/*.mp4; do
  video_id=$(youtube-upload \
    --title "$(basename $video .mp4)" \
    --description "..." \
    --privacy public \
    "$video")

  echo "$video → $video_id" >> video-mapping.txt
done

# 3. Update code automatically
node scripts/update-video-ids.js video-mapping.txt

# 4. Deploy
git add .
git commit -m "chore: update video IDs [automated]"
git push
```

#### YouTube API Integration
```javascript
// scripts/youtube-upload.js
const { google } = require('googleapis');
const fs = require('fs');

async function uploadVideo(filePath, metadata) {
  const youtube = google.youtube('v3');

  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: metadata,
      status: { privacyStatus: 'public' }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  return res.data.id;
}
```

**Benefits:**
- Save 30-60 minutes per batch
- Reduce human error
- Consistent metadata
- Easy rollback

**Estimated Implementation:** 4-6 hours

---

### 5. Quality Assurance Tools (Prevent Issues)

#### Automated Checks
```bash
#!/bin/bash
# check-video-quality.sh

for video in "$OUTPUT_DIR"/*.mp4; do
  echo "Checking: $video"

  # Check for audio sync
  ffmpeg -i "$video" -af "silencedetect=n=-50dB:d=1" -f null - 2>&1 | grep silence

  # Check for visual artifacts
  ffmpeg -i "$video" -vf "blackdetect=d=0.1:pix_th=0.00" -f null - 2>&1 | grep black

  # Check resolution
  resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$video")
  if [ "$resolution" != "1280,720" ]; then
    echo "⚠️  Resolution mismatch: $resolution"
  fi

  # Check duration (should be original - 3 seconds)
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$video")
  echo "✓ Duration: $duration seconds"
done
```

#### Visual Diff Tool
```bash
# Compare before/after frames
ffmpeg -i original.mp4 -i processed.mp4 -filter_complex \
  "[0:v][1:v]blend=all_mode=difference" \
  diff-output.mp4
```

**Benefits:**
- Catch issues before upload
- Automated quality control
- Reduce manual review time
- Document expected differences

**Estimated Implementation:** 2-3 hours

---

## Recommended Roadmap

### Phase 1: Quick Wins (This Week)
- [ ] Add preview mode to script
- [ ] Implement parallel processing
- [ ] Create video-specific configuration
- [ ] Add quality check script

**Time:** 4-6 hours
**Impact:** High
**Cost:** $0

### Phase 2: Automation (Next Week)
- [ ] YouTube API integration
- [ ] Automated upload pipeline
- [ ] Code auto-update script
- [ ] CI/CD integration

**Time:** 1 day
**Impact:** High
**Cost:** $0 (using existing YouTube API quota)

### Phase 3: Web Interface (Month 1)
- [ ] Build Next.js watermark removal app
- [ ] Real-time preview with controls
- [ ] Batch processing queue
- [ ] R2/YouTube integration

**Time:** 2-3 days
**Impact:** Medium
**Cost:** ~$5/month (hosting)

### Phase 4: AI Solution (Future)
- [ ] Research and test AI models
- [ ] Set up GPU infrastructure
- [ ] Build processing pipeline
- [ ] Consider SaaS offering

**Time:** 1 week
**Impact:** High (if pursuing SaaS)
**Cost:** $20-50/month + development time

---

## Alternative: Use Existing Services

### Commercial Watermark Removal Tools

#### Option 1: Unscreen (Kaleido)
- **URL:** https://www.unscreen.com
- **Pricing:** $0.99-$4.99 per video
- **Quality:** High
- **Speed:** Fast (cloud-based)

#### Option 2: Hitpaw Watermark Remover
- **URL:** https://www.hitpaw.com/watermark-remover.html
- **Pricing:** $35.99 one-time
- **Quality:** Good
- **Speed:** Fast (desktop app)

#### Option 3: Video Watermark Remover Online
- **URL:** https://www.watermarkremover.io
- **Pricing:** Free for small files
- **Quality:** Medium
- **Speed:** Moderate

#### Cost Analysis
- **Current:** $0 (but 30-60 min manual work per batch)
- **Commercial tool:** $10-50/month
- **Your time value:** Likely higher than tool cost

**Recommendation:** If processing < 50 videos/month, consider commercial tool.

---

## Immediate Action Items

Based on your needs, I recommend starting with:

### 1. Add Preview Mode (30 min)
```bash
# Usage:
bash remove-watermark.sh --preview
# Process only first 10 seconds for quick testing
```

### 2. Parallel Processing (1 hour)
```bash
# Reduce 20 min processing → 5 min
bash remove-watermark.sh --parallel
```

### 3. Quality Check Script (1 hour)
```bash
# Automated verification after processing
bash check-video-quality.sh
```

These three improvements will save you 15-30 minutes per batch and reduce errors, with minimal development time.

---

## Long-Term Vision: SaaS Product

If you process videos regularly, consider building this as a product:

### Market Opportunity
- NotebookLM users (growing rapidly)
- Educators creating courses
- Content creators
- Course platforms (Udemy, Coursera competitors)

### Potential Offering
- **Free tier:** 3 videos/month, basic overlay
- **Pro tier:** $19/month, unlimited videos, AI removal
- **Business tier:** $49/month, white-label, API access

### Revenue Potential
- 100 paying users = $1,900/month
- 500 paying users = $9,500/month
- Low CAC if you target NotebookLM community

---

## Questions to Consider

1. **Frequency:** How often will you process videos?
   - Weekly → Automate
   - Monthly → Current approach is fine
   - Daily → Build web interface

2. **Volume:** How many videos?
   - < 10/batch → Current approach
   - 10-50/batch → Add parallel processing
   - 50+/batch → Web interface or SaaS

3. **Quality requirements:** How perfect must it be?
   - Good enough → Current overlay approach
   - Perfect → AI-based solution

4. **Time value:** What's your hourly rate?
   - If > $50/hour, strongly consider automation or paid tools

---

## Conclusion

Your current FFmpeg-based approach is solid for occasional batches. For regular processing, I recommend:

**Short term (this week):**
- Add preview mode
- Implement parallel processing
- Create quality checks

**Medium term (this month):**
- Automate YouTube uploads
- Build simple web interface

**Long term (next quarter):**
- Consider AI-based solution if quality isn't perfect
- Evaluate SaaS opportunity if you enjoy the product

The key is balancing development time vs. time saved. Start with the quick wins, then evaluate if further investment is worthwhile based on your usage patterns.
