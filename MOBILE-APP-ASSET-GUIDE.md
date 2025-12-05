# Quick Reference: Mobile App vs Website

## What You're Building

### ✅ THE MOBILE APP (What Gemini Should Work On)
**Location**: `/mobile-app/` folder
**Technology**: React Native + Expo
**Platforms**: iOS (iPhone/iPad) and Android
**How Users Access**: Download from App Store or Google Play
**What It Looks Like**: Native app like Clash of Clans, Madden Mobile, Candy Crush
**Current Features**:
- Authentication (sign up, login)
- Practice Field with unit training (NEW - just rebuilt!)
- HQ building overview
- Season progression system
- Match simulation (coming soon)
- Predictions, Learn, Shop, Profile screens

**Asset Requirements**:
- PNG files at @2x and @3x resolutions
- Optimized for mobile screens (iPhone, Android)
- Used in React Native `Image` components
- Examples: unit cards, building sprites, UI icons

---

### ❌ THE WEBSITE (What Gemini Should NOT Work On)
**Location**: Deployed at `https://kickoff-club-hq.vercel.app/`
**Technology**: Next.js web framework
**Platforms**: Desktop/mobile web browsers
**How Users Access**: Visit URL in Chrome, Safari, etc.
**Purpose**: Marketing, information, course content
**What It Looks Like**: Traditional website with pages

---

## For Gemini: Clear Instructions

### When You Ask Gemini to Generate Assets:

**SAY THIS**:
> "I need assets for my **NATIVE MOBILE APP** built with React Native. This is an iPhone/Android app downloaded from the App Store, NOT a website. Think Clash of Clans or Madden Mobile style assets. Here are the requirements..."
>
> [Paste GEMINI-ASSET-GENERATION-PROMPT.md]

**DON'T SAY**:
- "Create assets for my website"
- "Generate web graphics"
- "Build HTML/CSS components"

---

## Project Structure

```
Kickoff-Club-HQ/
├── mobile-app/              ← MOBILE APP (React Native)
│   ├── src/
│   │   ├── screens/
│   │   │   └── Main/
│   │   │       └── PracticeFieldScreen_v2.tsx  ← NEW!
│   │   ├── services/
│   │   ├── components/
│   │   └── types/
│   ├── assets/              ← WHERE GEMINI'S ASSETS GO
│   │   ├── units/           (to be created)
│   │   ├── buildings/       (to be created)
│   │   ├── icons/           (to be created)
│   │   └── backgrounds/     (to be created)
│   └── database/
│       └── migrations/
│           └── add_unit_training_system.sql  ← NEW!
│
└── website/                 ← WEBSITE (ignore for now)
    └── [marketing pages]
```

---

## Current Mobile App Status

### ✅ What's Built:
1. **Authentication** - Sign up, login, profiles
2. **Practice Field V2** - NEW! Unit-based training system
   - 5 position groups (O-Line, Skill, D-Line, Secondary, Special Teams)
   - Training sessions with timers
   - Readiness progression (0-100%)
   - Season tracking
3. **Database** - Supabase with unit training tables
4. **Navigation** - 5-tab layout (HQ, Predict, Learn, Shop, Profile)

### ⏳ What Needs Assets (Priority Order):
1. **Training Unit Images** - 5 units × 3 states = 15 images (HIGHEST PRIORITY)
2. **UI Icons** - Energy, coins, KP, actions (80+ icons)
3. **Building Sprites** - 5 buildings × 5 levels = 25 sprites
4. **Backgrounds** - 4 full-screen environments
5. **Everything else** from the asset prompt

### 🚫 What's Missing (Needs Gemini):
- NO visual assets yet (using placeholders/icons)
- Needs custom graphics to look premium
- Currently looks basic/generic

---

## How to Use Gemini's Assets in the Mobile App

Once Gemini generates assets, they'll be placed like this:

```typescript
// In PracticeFieldScreen_v2.tsx
import { Image } from 'react-native';

<Image
  source={require('../../assets/units/offensive-line-idle@2x.png')}
  style={{ width: 200, height: 250 }}
/>
```

React Native automatically picks @2x or @3x based on device screen density.

---

## Summary for Gemini

**Project**: Kickoff Club HQ Mobile App (iOS/Android)
**Framework**: React Native + Expo
**Current State**: Functional game mechanics, but using placeholder graphics
**What You Need**: Premium visual assets to make it look like a $10M game
**Reference Games**: Clash of Clans, Madden Mobile, Top Eleven (mobile versions)
**Asset Prompt**: Use `GEMINI-ASSET-GENERATION-PROMPT.md`

**Key Point**: This is downloaded from the App Store like any other mobile game. It's NOT a browser game or website.
