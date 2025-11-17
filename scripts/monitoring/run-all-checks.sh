#!/bin/bash

# Master automation script - runs all monitoring checks
# Can be run manually or via cron

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_DIR="$SCRIPT_DIR/../../logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "🤖 KICKOFF CLUB HQ - AUTOMATION SUITE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ $TIMESTAMP"
echo ""

# 1. Uptime Monitor (quick check)
echo "1️⃣  Running Uptime Monitor..."
node "$SCRIPT_DIR/uptime-monitor.js" || echo "⚠️  Uptime check failed"
echo ""

# 2. Video Health Check (daily)
echo "2️⃣  Running Video Health Check..."
node "$SCRIPT_DIR/video-health-check.js" || echo "⚠️  Video health check failed"
echo ""

# 3. Comment Monitor (check for new comments)
echo "3️⃣  Checking for New Comments..."
node "$SCRIPT_DIR/comment-monitor.js" || echo "⚠️  Comment monitoring failed"
echo ""

# 4. YouTube Analytics (daily report)
if [ "$(date +%H)" == "09" ]; then
  echo "4️⃣  Generating YouTube Analytics Report..."
  node "$SCRIPT_DIR/youtube-analytics.js" || echo "⚠️  Analytics failed"
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Automation suite completed at $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
