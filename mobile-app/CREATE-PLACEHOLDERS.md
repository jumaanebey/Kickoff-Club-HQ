# Creating Placeholder Assets

## ⚠️ Important: Temporary Placeholders

Until you save Gemini's assets, you need placeholder images to prevent app crashes.

## Quick Solution

Run these commands to create 1x1 transparent PNG placeholders:

```bash
# Navigate to mobile app directory
cd /home/user/Kickoff-Club-HQ/mobile-app

# Create a simple 1x1 transparent PNG (base64 encoded)
# This creates a minimal valid PNG file

# For each unit type
for unit in offensive-line skill-positions defensive-line secondary special-teams; do
  for state in idle training ready; do
    # Create @2x version
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/units/$unit/${state}@2x.png"
    # Create @3x version
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/units/$unit/${state}@3x.png"
  done
done

# For resource icons
for icon in coins energy knowledge-points xp; do
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/resources/${icon}@2x.png"
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/resources/${icon}@3x.png"
done

# For action icons
for icon in train upgrade play-match collect speed-up; do
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/actions/${icon}@2x.png"
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/actions/${icon}@3x.png"
done

# For status icons
for icon in training ready locked complete; do
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/status/${icon}@2x.png"
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/icons/status/${icon}@3x.png"
done

# For buildings
for building in practice-field film-room weight-room stadium headquarters; do
  for level in 1 2 3 4 5; do
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/buildings/$building/level-${level}@2x.png"
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/buildings/$building/level-${level}@3x.png"
  done
done

# For backgrounds
for bg in hq-overview practice-field match-day match-night menu; do
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "assets/backgrounds/${bg}@3x.png"
done

echo "✅ Placeholder assets created!"
echo "Replace these with Gemini's real assets when ready."
```

## After Creating Placeholders

Your app will:
- ✅ Run without crashing
- ✅ Show image components (currently transparent 1x1 pixels)
- ⏳ Display Ionicons as fallbacks (still visible)

When you save Gemini's real assets in the same locations, they'll automatically replace the placeholders!

## Verify Placeholders

```bash
# Check if placeholders exist
ls -la assets/units/offensive-line/
ls -la assets/icons/resources/
ls -la assets/buildings/practice-field/
```

You should see all the PNG files listed.
