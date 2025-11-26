#!/bin/bash

# Configuration
SOURCE_DIR="./public/kickoff-club-assets"
# UPDATE THIS PATH to your actual React Native project's asset folder
# Assuming a standard monorepo or sibling folder structure
DEST_DIR="../kickoff-club-mobile/assets/kickoff-club-assets"

echo "🚀 Starting Asset Copy Process..."
echo "📂 Source: $SOURCE_DIR"
echo "📂 Destination: $DEST_DIR"

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory $SOURCE_DIR does not exist!"
    exit 1
fi

# Create destination if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    echo "⚠️  Destination directory does not exist. Creating it..."
    mkdir -p "$DEST_DIR"
fi

# Copy files
echo "📦 Copying assets..."
cp -R "$SOURCE_DIR/"* "$DEST_DIR/"

echo "✅ Assets copied successfully!"
echo "📱 You can now use these assets in your React Native app."
