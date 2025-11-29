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
<<<<<<< HEAD
| **Decor** | Statue of Legends | ⏳ Pending Processing |
| **Decor** | Club Fountain | ⏳ Pending Processing |
| **Decor** | Merch Stand | ⏳ Pending Processing |
| **Decor** | Parking Lot | ⏳ Pending Processing |
| **Buildings** | Stadium (Level 3) | ⏳ Pending Processing |
| **Buildings** | Film Room (Level 3) | ⏳ Pending Processing |
| **Buildings** | Weight Room (Level 3) | ⏳ Pending Processing |
| **Buildings** | Practice Field (Level 3) | ✅ Complete |
| **Buildings** | Headquarters (Level 3) | ✅ Complete |
| **Buildings** | Stadium (Level 2) | ✅ Complete |
| **Buildings** | Headquarters (Level 2) | ⚠️ Quota Limit Reached |
| **Buildings** | Practice Field (Level 2) | ⚠️ Quota Limit Reached |
| **Buildings** | Film Room (Level 2) | ⚠️ Quota Limit Reached |
| **Buildings** | Weight Room (Level 2) | ⚠️ Quota Limit Reached |
| **Buildings** | All Buildings (Level 4) | ⚠️ Quota Limit Reached |
| **UI** | Match UI (Field, Scoreboard) | ⚠️ Quota Limit Reached |

*Note: Asset generation is currently paused due to API quota limits. Will resume automatically when quota resets.*

## Mobile App Integration

To copy assets to your React Native mobile project:

1. Ensure your mobile project is located at `../kickoff-club-mobile` (or update the script).
2. Run the copy script:
   ```bash
   ./copy-assets-to-mobile.sh
   ```
3. Assets will be available in your mobile app's `assets/kickoff-club-assets/` directory.

## Asset Generation Guides

- **Mobile App Prompt**: See `GEMINI-ASSET-GENERATION-PROMPT.md` for the specific prompt to use with Gemini.
- **Quick Guide**: See `MOBILE-APP-ASSET-GUIDE.md` for a summary of the mobile app context.
=======

*Note: Asset generation is currently paused due to API quota limits. Will resume automatically when quota resets.*
>>>>>>> origin/main
