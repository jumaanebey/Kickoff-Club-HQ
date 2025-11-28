# Asset Integration Guide

## 📁 Folder Structure Created

Your mobile app now has this asset structure:

```
mobile-app/assets/
├── units/
│   ├── offensive-line/
│   ├── skill-positions/
│   ├── defensive-line/
│   ├── secondary/
│   └── special-teams/
├── buildings/
│   ├── practice-field/
│   ├── film-room/
│   ├── weight-room/
│   ├── stadium/
│   └── headquarters/
├── icons/
│   ├── resources/    (coins, energy, KP, XP)
│   ├── actions/      (train, upgrade, play, collect)
│   └── status/       (training, ready, locked)
├── backgrounds/      (full-screen environments)
├── ui-components/    (buttons, frames, progress bars)
├── particles/        (effects, animations)
└── effects/          (glows, shadows, sparkles)
```

---

## 📥 How to Save Assets from Gemini

### 1. Training Unit Assets
Save these in the respective unit folders:

**Offensive Line:**
- `units/offensive-line/idle@2x.png`
- `units/offensive-line/idle@3x.png`
- `units/offensive-line/training@2x.png`
- `units/offensive-line/training@3x.png`
- `units/offensive-line/ready@2x.png`
- `units/offensive-line/ready@3x.png`

**Repeat for:** skill-positions, defensive-line, secondary, special-teams

---

### 2. Icon Assets
Save in icons subdirectories:

**Resources:**
- `icons/resources/coins@2x.png`
- `icons/resources/coins@3x.png`
- `icons/resources/energy@2x.png`
- `icons/resources/energy@3x.png`
- `icons/resources/knowledge-points@2x.png`
- `icons/resources/knowledge-points@3x.png`
- `icons/resources/xp@2x.png`
- `icons/resources/xp@3x.png`

**Actions:**
- `icons/actions/train@2x.png`
- `icons/actions/upgrade@2x.png`
- `icons/actions/play-match@2x.png`
- `icons/actions/collect@2x.png`

**Status:**
- `icons/status/training@2x.png`
- `icons/status/ready@2x.png`
- `icons/status/locked@2x.png`

---

### 3. Building Assets
Save 5 levels for each building:

**Practice Field:**
- `buildings/practice-field/level-1@2x.png`
- `buildings/practice-field/level-1@3x.png`
- `buildings/practice-field/level-2@2x.png`
- ... (through level-5)

**Repeat for:** film-room, weight-room, stadium, headquarters

---

### 4. Backgrounds
Save full-screen backgrounds:

- `backgrounds/hq-overview@3x.png`
- `backgrounds/practice-field@3x.png`
- `backgrounds/match-day@3x.png`
- `backgrounds/match-night@3x.png`
- `backgrounds/menu@3x.png`

---

## 🚀 Quick Start

### Option A: Save All Assets at Once
1. Download all assets from Gemini to your computer
2. Use this command to copy them to the project:
   ```bash
   # From your downloads folder
   cp -r gemini-assets/* /home/user/Kickoff-Club-HQ/mobile-app/assets/
   ```

### Option B: Save Priority Assets First
**Start with these (most important):**
1. Unit cards (15 images: 5 units × 3 states)
2. Resource icons (coins, energy, KP, XP)
3. Action icons (train, play, collect)

---

## 📝 Naming Convention

Gemini should have created files with these names:

**Units:**
- `unit-offensive-line-idle@2x.png` → Save as `units/offensive-line/idle@2x.png`
- `unit-skill-positions-training@3x.png` → Save as `units/skill-positions/training@3x.png`

**Icons:**
- `icon-coins@2x.png` → Save as `icons/resources/coins@2x.png`
- `icon-train@2x.png` → Save as `icons/actions/train@2x.png`

**Buildings:**
- `building-practice-field-level-1@2x.png` → Save as `buildings/practice-field/level-1@2x.png`

---

## ✅ Verification

Once assets are saved, verify with:

```bash
# Check units
ls -la /home/user/Kickoff-Club-HQ/mobile-app/assets/units/offensive-line/

# Check icons
ls -la /home/user/Kickoff-Club-HQ/mobile-app/assets/icons/resources/

# Check buildings
ls -la /home/user/Kickoff-Club-HQ/mobile-app/assets/buildings/practice-field/
```

---

## 🎨 Next Step

After saving assets, I will:
1. Create an AssetManager component to organize all assets
2. Update PracticeFieldScreen to use real unit images
3. Update HQScreen to use building sprites
4. Replace all Ionicons with custom icons
5. Add proper image loading with fallbacks

**Tell me when assets are saved and I'll integrate them into the app!**
