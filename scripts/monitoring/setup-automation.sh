#!/bin/bash

# Setup script for Kickoff Club HQ automation
# This configures all cron jobs for monitoring and automation

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 KICKOFF CLUB HQ - AUTOMATION SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 Project Root: $PROJECT_ROOT"
echo "📂 Scripts: $SCRIPT_DIR"
echo ""

# Make all scripts executable
echo "🔧 Making scripts executable..."
chmod +x "$SCRIPT_DIR/run-all-checks.sh"
chmod +x "$SCRIPT_DIR/../auto-upload-remaining.sh" 2>/dev/null || true
echo "✅ Scripts are now executable"
echo ""

# Create logs directory
mkdir -p "$PROJECT_ROOT/logs"
echo "✅ Logs directory created"
echo ""

# Setup cron jobs
echo "⏰ Setting up cron jobs..."
echo ""

# Create temporary cron file
CRON_FILE=$(mktemp)

# Preserve existing cron jobs (except our old ones)
crontab -l 2>/dev/null | grep -v "kickoff-club-hq" | grep -v "auto-upload-remaining.sh" | grep -v "run-all-checks.sh" > "$CRON_FILE" || true

# Add new cron jobs
cat >> "$CRON_FILE" <<EOF

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Kickoff Club HQ Automation
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Run all monitoring checks every 2 hours
0 */2 * * * cd "$PROJECT_ROOT" && bash "$SCRIPT_DIR/run-all-checks.sh" >> "$PROJECT_ROOT/logs/automation.log" 2>&1

# Uptime monitor every 5 minutes
*/5 * * * * cd "$PROJECT_ROOT" && node "$SCRIPT_DIR/uptime-monitor.js" >> "$PROJECT_ROOT/logs/uptime.log" 2>&1

# Daily pre-launch checklist at 8 AM
0 8 * * * cd "$PROJECT_ROOT" && node "$SCRIPT_DIR/pre-launch-checklist.js" >> "$PROJECT_ROOT/logs/pre-launch.log" 2>&1

# Remaining Shorts upload (Nov 17 at 10 AM)
0 10 17 11 * cd "$PROJECT_ROOT" && bash "$SCRIPT_DIR/../auto-upload-remaining.sh" >> "$PROJECT_ROOT/logs/auto-upload.log" 2>&1

EOF

# Install cron jobs
crontab "$CRON_FILE"
rm "$CRON_FILE"

echo "✅ Cron jobs installed!"
echo ""

# Show installed cron jobs
echo "📋 INSTALLED CRON JOBS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
crontab -l | grep -A 20 "Kickoff Club HQ"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AUTOMATION SETUP COMPLETE!"
echo ""
echo "📊 Monitoring includes:"
echo "   • Uptime monitoring (every 5 minutes)"
echo "   • Full checks (every 2 hours)"
echo "   • Pre-launch checklist (daily 8 AM)"
echo "   • YouTube Shorts upload (Nov 17, 10 AM)"
echo ""
echo "📁 Logs will be written to: $PROJECT_ROOT/logs/"
echo ""
echo "💡 Manual Commands:"
echo "   • Run all checks:        bash $SCRIPT_DIR/run-all-checks.sh"
echo "   • Video health:          node $SCRIPT_DIR/video-health-check.js"
echo "   • YouTube analytics:     node $SCRIPT_DIR/youtube-analytics.js"
echo "   • Comment monitor:       node $SCRIPT_DIR/comment-monitor.js"
echo "   • Uptime check:          node $SCRIPT_DIR/uptime-monitor.js"
echo "   • Pre-launch checklist:  node $SCRIPT_DIR/pre-launch-checklist.js"
echo "   • Update descriptions:   node $SCRIPT_DIR/update-video-descriptions.js --dry-run"
echo ""
echo "🎉 You're all set!"
echo ""
