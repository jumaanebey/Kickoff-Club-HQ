#!/bin/bash

# Create placeholder PNG assets to prevent app crashes
# Replace these with real assets from Gemini when ready

echo "Creating placeholder assets..."

# Base64 encoded 1x1 transparent PNG
PLACEHOLDER="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Function to create placeholder
create_placeholder() {
  echo "$PLACEHOLDER" | base64 -d > "$1"
}

# Units
for unit in offensive-line skill-positions defensive-line secondary special-teams; do
  for state in idle training ready; do
    create_placeholder "assets/units/$unit/${state}@2x.png"
    create_placeholder "assets/units/$unit/${state}@3x.png"
  done
done

# Resource icons
for icon in coins energy knowledge-points xp; do
  create_placeholder "assets/icons/resources/${icon}@2x.png"
  create_placeholder "assets/icons/resources/${icon}@3x.png"
done

# Action icons
for icon in train upgrade play-match collect speed-up; do
  create_placeholder "assets/icons/actions/${icon}@2x.png"
  create_placeholder "assets/icons/actions/${icon}@3x.png"
done

# Status icons
for icon in training ready locked complete; do
  create_placeholder "assets/icons/status/${icon}@2x.png"
  create_placeholder "assets/icons/status/${icon}@3x.png"
done

# Buildings
for building in practice-field film-room weight-room stadium headquarters; do
  for level in 1 2 3 4 5; do
    create_placeholder "assets/buildings/$building/level-${level}@2x.png"
    create_placeholder "assets/buildings/$building/level-${level}@3x.png"
  done
done

# Backgrounds
for bg in hq-overview practice-field match-day match-night menu; do
  create_placeholder "assets/backgrounds/${bg}@3x.png"
done

echo "✅ Created $(find assets -name '*.png' | wc -l) placeholder PNG files"
echo ""
echo "📁 Assets created in:"
echo "   - assets/units/ (30 files)"
echo "   - assets/icons/ (36 files)"
echo "   - assets/buildings/ (50 files)"
echo "   - assets/backgrounds/ (5 files)"
echo ""
echo "🎨 Replace these placeholders with Gemini's real assets!"
echo "   Just copy Gemini's PNGs to the same filenames."
