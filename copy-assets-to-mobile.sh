#!/bin/bash

<<<<<<< HEAD
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
=======
# Copy assets from website public folder to mobile app assets folder
# Run this after saving Gemini's assets to public/kickoff-club-assets/

SOURCE="/home/user/Kickoff-Club-HQ/public/kickoff-club-assets"
DEST="/home/user/Kickoff-Club-HQ/mobile-app/assets"

echo "🎨 Copying assets from website to mobile app..."
echo ""
echo "Source: $SOURCE"
echo "Destination: $DEST"
echo ""

# Check if source directory exists and has content
if [ ! -d "$SOURCE" ] || [ -z "$(ls -A $SOURCE)" ]; then
  echo "❌ Error: Source directory is empty or doesn't exist"
  echo "Please save Gemini's assets to: $SOURCE"
  exit 1
fi

# Copy units
if [ -d "$SOURCE/units" ]; then
  echo "📦 Copying training units..."
  cp -r $SOURCE/units/* $DEST/units/ 2>/dev/null
  UNIT_COUNT=$(find $DEST/units -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $UNIT_COUNT unit images"
fi

# Copy buildings
if [ -d "$SOURCE/buildings" ]; then
  echo "🏗️  Copying buildings..."
  cp -r $SOURCE/buildings/* $DEST/buildings/ 2>/dev/null
  BUILDING_COUNT=$(find $DEST/buildings -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $BUILDING_COUNT building sprites"
fi

# Copy icons
if [ -d "$SOURCE/icons" ]; then
  echo "🎯 Copying icons..."
  # Try to intelligently place icons in subdirectories
  if [ -d "$SOURCE/icons/resources" ]; then
    cp -r $SOURCE/icons/resources/* $DEST/icons/resources/ 2>/dev/null
  fi
  if [ -d "$SOURCE/icons/actions" ]; then
    cp -r $SOURCE/icons/actions/* $DEST/icons/actions/ 2>/dev/null
  fi
  if [ -d "$SOURCE/icons/status" ]; then
    cp -r $SOURCE/icons/status/* $DEST/icons/status/ 2>/dev/null
  fi
  # If icons aren't organized, copy everything to icons root
  cp $SOURCE/icons/*.png $DEST/icons/ 2>/dev/null
  ICON_COUNT=$(find $DEST/icons -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $ICON_COUNT icons"
fi

# Copy backgrounds
if [ -d "$SOURCE/backgrounds" ]; then
  echo "🖼️  Copying backgrounds..."
  cp -r $SOURCE/backgrounds/* $DEST/backgrounds/ 2>/dev/null
  BG_COUNT=$(find $DEST/backgrounds -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $BG_COUNT backgrounds"
fi

# Copy UI components
if [ -d "$SOURCE/ui-components" ]; then
  echo "🎨 Copying UI components..."
  cp -r $SOURCE/ui-components/* $DEST/ui-components/ 2>/dev/null
  UI_COUNT=$(find $DEST/ui-components -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $UI_COUNT UI components"
fi

# Copy achievements
if [ -d "$SOURCE/achievements" ]; then
  echo "🏆 Copying achievements..."
  mkdir -p $DEST/achievements
  cp -r $SOURCE/achievements/* $DEST/achievements/ 2>/dev/null
  ACH_COUNT=$(find $DEST/achievements -type f -name "*.png" | wc -l)
  echo "   ✓ Copied $ACH_COUNT achievement badges"
fi

echo ""
echo "✅ Asset copy complete!"
echo ""

# Count total assets
TOTAL_ASSETS=$(find $DEST -type f -name "*.png" | wc -l)
echo "📊 Total assets in mobile app: $TOTAL_ASSETS PNG files"

# Show file sizes
TOTAL_SIZE=$(du -sh $DEST | cut -f1)
echo "💾 Total size: $TOTAL_SIZE"

echo ""
echo "🚀 Next steps:"
echo "   1. Verify assets copied correctly"
echo "   2. Run your mobile app to see the new graphics"
echo "   3. React Native will auto-reload with new assets"
>>>>>>> origin/main
