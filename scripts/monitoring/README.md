# Kickoff Club HQ - Automation & Monitoring Suite

Complete automation suite for monitoring and managing your Kickoff Club HQ launch.

## 🚀 Quick Start

```bash
# Install all automation (sets up cron jobs)
bash scripts/monitoring/setup-automation.sh

# Run all checks manually
bash scripts/monitoring/run-all-checks.sh
```

## 📊 Available Scripts

### 1. Video Health Check
**File**: `video-health-check.js`

Verifies all YouTube videos are accessible and properly configured.

**Checks:**
- Video exists and is not deleted
- Privacy status (public/unlisted/private)
- Embeddable status
- Upload processing status
- View counts and duration

**Usage:**
```bash
node scripts/monitoring/video-health-check.js
```

**Output**: `logs/video-health-results.json`

---

### 2. YouTube Analytics Reporter
**File**: `youtube-analytics.js`

Daily analytics report tracking channel growth and performance.

**Metrics:**
- Subscribers, views, video count
- Last 28 days: views, watch time, subscriber growth
- Top 5 performing videos
- Growth trends over time

**Usage:**
```bash
node scripts/monitoring/youtube-analytics.js
```

**Output**: `logs/youtube-analytics-history.json`

---

### 3. Pre-Launch Checklist
**File**: `pre-launch-checklist.js`

Comprehensive launch readiness verification.

**Checks:**
- Homepage accessibility
- Critical routes (/auth, /courses)
- Environment variables
- Video system configuration
- Free lessons setup
- Security headers
- SEO metadata

**Usage:**
```bash
node scripts/monitoring/pre-launch-checklist.js
```

**Output**: `logs/pre-launch-results.json`

---

### 4. Uptime Monitor
**File**: `uptime-monitor.js`

Continuous website availability monitoring.

**Features:**
- Response time tracking
- Consecutive failure alerts
- 24-hour uptime percentage
- 7-day history

**Usage:**
```bash
node scripts/monitoring/uptime-monitor.js
```

**Output**:
- `logs/uptime-history.json`
- `logs/uptime-alerts.log`

---

### 5. Comment Monitor
**File**: `comment-monitor.js`

Monitors YouTube for new comments requiring responses.

**Features:**
- Tracks all channel comments
- Detects new comments since last check
- Shows video title, author, timestamp
- Direct links to respond

**Usage:**
```bash
node scripts/monitoring/comment-monitor.js
```

**Output**: `logs/seen-comments.json`

---

### 6. Video Description Bulk Updater
**File**: `update-video-descriptions.js`

Adds website link and branding to all video descriptions.

**Features:**
- Bulk update all channel videos
- Adds Kickoff Club HQ footer
- Skips already-updated videos
- Dry-run mode for testing

**Usage:**
```bash
# Test run (no changes)
node scripts/monitoring/update-video-descriptions.js --dry-run

# Actually update
node scripts/monitoring/update-video-descriptions.js
```

**What it adds:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━

🏈 Learn More at Kickoff Club HQ!
https://kickoffclubhq.com

✅ Step-by-step football lessons
✅ From beginner to superfan
✅ No judgment, no gatekeeping

#Football #NFL #LearnFootball #KickoffClubHQ
```

---

## ⏰ Automated Schedule (Cron Jobs)

Once you run `setup-automation.sh`, these checks run automatically:

| Frequency | Script | Purpose |
|-----------|--------|---------|
| Every 5 min | Uptime Monitor | Catch downtime immediately |
| Every 2 hours | All Checks | Comprehensive health check |
| Daily 8 AM | Pre-Launch Checklist | Daily readiness verification |
| Nov 17 10 AM | Auto-Upload Shorts | Upload remaining 8 Shorts |

## 📁 Log Files

All monitoring data is saved to `/logs/`:

```
logs/
├── automation.log              # Master automation log
├── uptime.log                  # Uptime checks
├── uptime-history.json         # Uptime data points
├── uptime-alerts.log           # Downtime alerts
├── video-health-results.json   # Video status
├── youtube-analytics-history.json  # Channel growth
├── seen-comments.json          # Comment tracker
├── pre-launch-results.json     # Launch readiness
└── auto-upload.log             # Shorts upload logs
```

## 🔧 Manual Commands

```bash
# Run specific checks
node scripts/monitoring/video-health-check.js
node scripts/monitoring/youtube-analytics.js
node scripts/monitoring/comment-monitor.js
node scripts/monitoring/uptime-monitor.js
node scripts/monitoring/pre-launch-checklist.js

# Update video descriptions
node scripts/monitoring/update-video-descriptions.js --dry-run

# Run all checks
bash scripts/monitoring/run-all-checks.sh

# View cron jobs
crontab -l

# Remove all cron jobs
crontab -r
```

## 🚨 Alerts

**Critical Issues:**
- Site down for 3+ consecutive checks → Exit code 1
- Videos private/deleted → Logged in results
- Pre-launch failures → Prevents launch

**Check logs** if you receive email alerts (if your system sends cron emails).

## 📊 Growth Tracking

The analytics script builds a historical database:
- Tracks daily subscriber growth
- Monitors video view trends
- Calculates growth rates
- Identifies top-performing content

Perfect for:
- Monthly reports
- Identifying what content works
- Measuring launch success

## 🎯 Pre-Launch Workflow

```bash
# 1. Run pre-launch checklist
node scripts/monitoring/pre-launch-checklist.js

# 2. Fix any critical issues

# 3. Test video health
node scripts/monitoring/video-health-check.js

# 4. Update video descriptions (optional)
node scripts/monitoring/update-video-descriptions.js --dry-run
node scripts/monitoring/update-video-descriptions.js

# 5. Setup automation
bash scripts/monitoring/setup-automation.sh

# 6. Launch! 🚀
```

## 💡 Tips

1. **Test Before Launch**: Run all scripts manually first
2. **Check Logs Daily**: Monitor `/logs/` for issues
3. **Respond to Comments**: Check comment monitor daily
4. **Track Growth**: Review analytics weekly
5. **Update Descriptions**: Run bulk updater for new uploads

## 🔐 Requirements

- YouTube API credentials configured
- Node.js installed
- Cron access (for automation)
- Environment variables set

## 🤝 Support

If scripts fail:
1. Check logs in `/logs/`
2. Verify YouTube credentials
3. Test API access with `scripts/test-youtube-api.js`
4. Ensure environment variables are set

---

Built with ❤️ for Kickoff Club HQ
