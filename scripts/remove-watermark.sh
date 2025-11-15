#!/bin/bash

# Script to remove watermark from videos by overlaying black rectangle
# Watermark location: bottom right corner

# Default directories (can be overridden with command line arguments)
INPUT_DIR="${1:-/Users/jumaanebey/Downloads/kickoff-club-v2/dist/assets/lessons}"
OUTPUT_DIR="${2:-/Users/jumaanebey/Downloads/kickoff-videos-clean}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Watermark dimensions - precise targeting of just the watermark text
# NotebookLM watermark is approximately 180x35 pixels, positioned higher and away from border
WATERMARK_WIDTH=180
WATERMARK_HEIGHT=35
WATERMARK_Y_OFFSET=70
WATERMARK_X_OFFSET=190

echo "🎬 Removing watermarks from videos..."
echo "Input: $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Process each video
for video in "$INPUT_DIR"/*.mp4; do
    filename=$(basename "$video")
    echo "Processing: $filename"

    # Get video duration and calculate trim point (duration - 3 seconds)
    duration=$(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$video")
    trim_duration=$(echo "$duration - 3" | bc)

    # Cover watermark with color-matched rectangle, trim last 3 seconds
    # Use light gray/white to match typical video background
    # Video is 1280x720, watermark in bottom-right corner
    /opt/homebrew/bin/ffmpeg -i "$video" -t "$trim_duration" \
        -vf "drawbox=x=iw-${WATERMARK_X_OFFSET}:y=ih-${WATERMARK_Y_OFFSET}:w=${WATERMARK_WIDTH}:h=${WATERMARK_HEIGHT}:color=#F5F5F5:t=fill" \
        -c:a copy \
        "$OUTPUT_DIR/$filename" \
        -y

    if [ $? -eq 0 ]; then
        echo "✅ Completed: $filename"
    else
        echo "❌ Failed: $filename"
    fi
    echo ""
done

echo "🎉 All videos processed!"
echo "Clean videos saved to: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review the videos to ensure watermark is covered"
echo "2. If watermark still visible, adjust WATERMARK position/dimensions in script"
echo "3. Upload clean versions to YouTube or Cloudflare R2"
