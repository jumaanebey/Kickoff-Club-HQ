# Kickoff Club HQ - Asset Pipeline

This project includes an automated pipeline for generating and processing game assets.

## Directory Structure

- `kickoff-club-assets/`: The source directory for all generated assets.
  - `units/`: Character sprites (Offensive Line, Skill Positions, etc.)
  - `buildings/`: Isometric building sprites
  - `icons/`: UI icons
  - `backgrounds/`: Full-screen backgrounds
- `scripts/process-assets.js`: Node.js script to process raw AI images into game-ready assets.
- `scripts/assets-config.json`: Configuration mapping asset IDs to destination folders.

## How to Generate New Assets

1. **Generate Images**: Use the AI assistant to generate images. The assistant will save them to the `brain` directory.
2. **Move to Temp**: The assistant or you should move the raw PNGs to a `temp_assets` folder in the root.
3. **Run Processor**:
   ```bash
   node scripts/process-assets.js
   ```
   This script will:
   - Resize images to `@2x` (Standard) and `@3x` (Retina) resolutions.
   - Generate a JSON metadata file for each asset.
   - Move them to the correct subfolder in `public/kickoff-club-assets/`.

## Viewing Assets

Visit `/hq` in the application to view the Asset Verification Dashboard.

## Current Asset Status

| Category | Asset | Status |
|----------|-------|--------|
| **Units** | Offensive Line | ✅ Complete (Idle, Training, Ready) |
| **Units** | Skill Positions | ✅ Complete (Idle, Training, Ready) |
| **Units** | Defensive Line | ✅ Complete (Idle, Training, Ready) |
| **Units** | Secondary | ✅ Complete (Idle, Training, Ready) |
| **Units** | Special Teams | ✅ Complete (Idle, Training, Ready) |
| **Buildings** | Stadium (Level 1) | ✅ Complete |
| **Buildings** | Stadium (Level 5) | ✅ Complete |
| **Buildings** | Others | ⏳ Pending |
| **Icons** | Resources | ⏳ Pending |

*Note: Asset generation is currently paused due to API quota limits. Will resume automatically when quota resets.*
