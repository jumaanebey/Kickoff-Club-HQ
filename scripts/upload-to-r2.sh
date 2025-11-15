#!/bin/bash

# Upload all processed videos to Cloudflare R2
# This script uses the AWS CLI with R2 endpoints

VIDEO_DIR="/Users/jumaanebey/Downloads/kickoff-videos-clean"
R2_BUCKET="kickoff-club-videos"
R2_ACCOUNT_ID="823743a9ea649b7611fbc9b83a1de4c1"
R2_ACCESS_KEY_ID="3570f7697bff4d45926f8677113058c0"
R2_SECRET_ACCESS_KEY="88e048e3a1815c1e9ae1e754576a07b1e63c662066f22b3a8b8653df96c1b7db"
R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

echo "📤 Uploading videos to Cloudflare R2..."
echo "Bucket: $R2_BUCKET"
echo "Directory: $VIDEO_DIR"
echo ""

# Configure AWS CLI for R2
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

# Use full path to aws
AWS_CLI="/opt/homebrew/bin/aws"

# Check if AWS CLI is installed
if [ ! -f "$AWS_CLI" ]; then
    echo "❌ AWS CLI not found. Please install: brew install awscli"
    exit 1
fi

# Upload each video
for video in "$VIDEO_DIR"/*.mp4; do
    filename=$(basename "$video")
    echo "Uploading: $filename"

    # Upload to R2 with correct content type
    "$AWS_CLI" s3 cp "$video" \
        "s3://${R2_BUCKET}/${filename}" \
        --endpoint-url "$R2_ENDPOINT" \
        --content-type "video/mp4"

    if [ $? -eq 0 ]; then
        echo "✅ Uploaded: $filename"
        echo "   URL: https://pub-${R2_ACCOUNT_ID}.r2.dev/${filename}"
    else
        echo "❌ Failed: $filename"
    fi
    echo ""
done

echo "🎉 All videos uploaded to Cloudflare R2!"
echo ""
echo "Next steps:"
echo "1. Verify videos are accessible in Cloudflare dashboard"
echo "2. Update website database with new R2 URLs"
echo "3. Test video playback on website"
