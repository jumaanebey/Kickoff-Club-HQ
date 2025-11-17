#!/bin/bash

# Automated upload script for remaining 8 Shorts
# This will run automatically tomorrow at 10 AM

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🤖 Auto-upload starting at $(date)"
echo "📍 Running from: $SCRIPT_DIR"
echo ""

# Upload remaining shorts with November 23 schedule
node "$SCRIPT_DIR/upload-remaining-shorts.js" \
  --schedule \
  --frequency daily \
  --time "10:00" \
  --start-date "2025-11-23"

echo ""
echo "✅ Auto-upload complete at $(date)"
