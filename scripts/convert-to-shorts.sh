#!/bin/bash

# Convert horizontal videos to vertical YouTube Shorts format
# Usage: ./convert-to-shorts.sh input.mp4 output-name start-time duration

INPUT_VIDEO="$1"
OUTPUT_NAME="$2"
START_TIME="${3:-0}"      # Default: start at beginning
DURATION="${4:-45}"       # Default: 45 seconds

OUTPUT_DIR="/Users/jumaanebey/Downloads/kickoff-shorts"
mkdir -p "$OUTPUT_DIR"

OUTPUT_FILE="$OUTPUT_DIR/${OUTPUT_NAME}.mp4"

echo "🎬 Converting to YouTube Short..."
echo "   Input: $INPUT_VIDEO"
echo "   Output: $OUTPUT_FILE"
echo "   Start: ${START_TIME}s"
echo "   Duration: ${DURATION}s"
echo ""

# Convert to vertical format (9:16 ratio)
# - Scale to fit 1080 width, maintaining aspect ratio
# - Pad top and bottom with black bars to reach 1920 height
# - This keeps all content visible
/opt/homebrew/bin/ffmpeg -i "$INPUT_VIDEO" \
  -ss "$START_TIME" \
  -t "$DURATION" \
  -vf "scale=1080:-1,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,setsar=1" \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -y \
  "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Short created successfully!"
  echo "   Location: $OUTPUT_FILE"
  echo "   Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
  echo ""
  echo "📱 Ready for YouTube Shorts upload"
else
  echo ""
  echo "❌ Conversion failed"
  exit 1
fi
