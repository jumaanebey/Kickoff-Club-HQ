# Antigravity - Blitz Rush 3D Full Asset Push

**Date:** December 18, 2024
**Priority:** CRITICAL - Game is LIVE
**Status:** Playable with procedural graphics, needs visual polish

---

## Game Status

Blitz Rush 3D is **live and playable** at: https://kickoffclubhq.com/games/blitz-rush

Current visuals are code-generated Three.js shapes. The gameplay is solid but we need Subway Surfer-quality assets to make it shine.

---

## TIER 1: BLOCKING (Need This Week)

These assets are blocking features that are already built in code.

### 1.1 Tutorial Step Cards (8 images)

**Dimensions:** 800 x 500 PNG with transparency
**Location:** `/public/images/blitz-rush/tutorial/`

| Filename | Content | Visual Direction |
|----------|---------|------------------|
| `step-1-welcome.png` | Welcome screen | Player waving, "Welcome to Blitz Rush!" |
| `step-2-movement.png` | Lane switching | 3-lane field diagram, swipe arrows left/right |
| `step-3-jump.png` | Jump over obstacles | Player mid-jump over hurdle, "SWIPE UP" text |
| `step-4-slide.png` | Slide under bars | Player sliding, "SWIPE DOWN" text |
| `step-5-obstacles.png` | Obstacle types | Grid: Defender (red), Hurdle (orange), High Bar |
| `step-6-coins.png` | Coin collection | Gold coins with sparkles, coin counter UI |
| `step-7-powerups.png` | Power-up showcase | 4 power-ups: Magnet, Shield, Speed, 2X |
| `step-8-ready.png` | Ready to play | Player in stance, "TAP TO START" button |

**Style Notes:**
- Dark blue gradient background (#0f172a → #1e293b)
- Bold white text, orange (#f97316) accents
- Subway Surfer tutorial aesthetic
- Must be readable on mobile screens

---

### 1.2 Gesture Icons (4 images)

**Dimensions:** 128 x 128 PNG with transparency
**Location:** `/public/images/blitz-rush/tutorial/`

| Filename | Content |
|----------|---------|
| `swipe-left.png` | Hand/finger with left arrow |
| `swipe-right.png` | Hand/finger with right arrow |
| `swipe-up.png` | Hand/finger with up arrow |
| `swipe-down.png` | Hand/finger with down arrow |

**Style:** White icons with subtle glow, clean and simple

---

### 1.3 Celebration Graphics (4 images)

**Location:** `/public/images/blitz-rush/celebration/`

| Filename | Dimensions | Content |
|----------|------------|---------|
| `juked-text.png` | 600 x 200 | "JUKED!" with fire/energy effects |
| `touchdown-text.png` | 800 x 250 | "TOUCHDOWN!" celebration style |
| `victory-burst.png` | 512 x 512 | Radial gold/orange burst effect |
| `confetti-spritesheet.png` | 512 x 512 | 4x4 grid of confetti pieces |

**Context:** When player beats the final defender, we show "JUKED!" with slow-motion. Then "TOUCHDOWN!" when they cross the goal line.

**Style:**
- "JUKED!" = aggressive, fiery, triumphant (think sports highlight graphics)
- "TOUCHDOWN!" = celebratory, gold confetti, stadium lights feel
- Bold, impactful, reads well at speed

---

## TIER 2: HIGH PRIORITY (Need Next Week)

### 2.1 End Zone Textures

**Location:** `/public/textures/blitz-rush/`

| Filename | Dimensions | Content |
|----------|------------|---------|
| `endzone-surface.png` | 512 x 512 | Orange end zone turf (tileable) |
| `endzone-text.png` | 1024 x 256 | "TOUCHDOWN" painted on field |
| `goal-line-glow.png` | 512 x 64 | White goal line with glow |
| `pylon-texture.png` | 128 x 256 | Orange pylon with stripes |

---

### 2.2 Power-Up Icons (HUD)

**Dimensions:** 64 x 64 PNG with transparency
**Location:** `/public/images/blitz-rush/`

| Filename | Color | Symbol |
|----------|-------|--------|
| `icon-coin.png` | Gold #fbbf24 | Dollar sign or football |
| `icon-magnet.png` | Red #ef4444 | Horseshoe magnet |
| `icon-shield.png` | Blue #3b82f6 | Shield/bubble |
| `icon-speed.png` | Orange #f97316 | Lightning bolt |
| `icon-multiplier.png` | Purple #8b5cf6 | "2X" text |

---

### 2.3 Sound Effects

**Format:** MP3, 44.1kHz, Mono, < 100KB each
**Location:** `/public/sounds/blitz-rush/`

| Filename | Duration | Description |
|----------|----------|-------------|
| `coin.mp3` | 0.3s | Satisfying coin collect "cha-ching" |
| `powerup.mp3` | 0.5s | Magical power-up activation |
| `jump.mp3` | 0.3s | Whoosh on jump |
| `slide.mp3` | 0.4s | Turf slide sound |
| `juke-success.mp3` | 0.5s | Triumphant whoosh when dodging defender |
| `collision.mp3` | 0.4s | Tackle/hit sound |
| `near-miss.mp3` | 0.3s | Tense "phew" near-miss |
| `touchdown.mp3` | 1.5s | Crowd roar + celebration |
| `game-over.mp3` | 1s | Failure sound (not harsh) |
| `countdown-beep.mp3` | 0.2s | 3-2-1 countdown beep |

---

## TIER 3: VISUAL POLISH (2+ Weeks)

### 3.1 3D Player Model

**File:** `/public/models/blitz-rush/player.glb`
**Poly Count:** 3,000 - 5,000 triangles
**Texture:** 512 x 512

**Design:**
- Helmet: Yellow/gold, rounded, friendly
- Jersey: Blue #2563eb, white "20"
- Build: Athletic, youthful, not bulky
- Style: Subway Surfer proportions (slightly exaggerated)

**Animations (embedded):**

| Name | Frames | Loop | Description |
|------|--------|------|-------------|
| `idle` | 60 | Yes | Slight bounce, ready stance |
| `run` | 24 | Yes | Sprint cycle, arms pumping |
| `jump` | 30 | No | Leap with arms up |
| `slide` | 20 | No | Knee slide |
| `strafe_left` | 15 | No | Quick sidestep left |
| `strafe_right` | 15 | No | Quick sidestep right |
| `death` | 40 | No | Gets tackled, falls |
| `celebrate` | 60 | No | Touchdown dance |

---

### 3.2 3D Defender Model

**File:** `/public/models/blitz-rush/defender.glb`
**Poly Count:** 2,000 - 3,000 triangles

**Design:**
- Helmet: Dark red #7f1d1d
- Jersey: Red #dc2626, white "X"
- Stance: Arms spread, blocking
- Menacing but cartoonish

**Animations:**

| Name | Frames | Loop | Description |
|------|--------|------|-------------|
| `idle` | 30 | Yes | Menacing sway |
| `lunge` | 20 | No | Forward lunge |
| `miss` | 30 | No | Dive and miss (for JUKE moment) |

---

### 3.3 3D Obstacles

| Model | File | Poly Count |
|-------|------|------------|
| Hurdle | `/public/models/blitz-rush/hurdle.glb` | 500-800 |
| Barrier | `/public/models/blitz-rush/barrier.glb` | 300-500 |
| Tackle Dummy | `/public/models/blitz-rush/tackle-dummy.glb` | 800-1000 |

---

### 3.4 3D Collectibles

| Model | File | Poly Count | Notes |
|-------|------|------------|-------|
| Coin | `/public/models/blitz-rush/coin.glb` | 200-300 | Gold, spinning |
| Mega Coin | `/public/models/blitz-rush/mega-coin.glb` | 300 | 1.5x size, extra glow |
| Magnet | `/public/models/blitz-rush/powerup-magnet.glb` | 300-400 | Red horseshoe |
| Shield | `/public/models/blitz-rush/powerup-shield.glb` | 300-400 | Blue energy sphere |
| Speed | `/public/models/blitz-rush/powerup-speed.glb` | 300-400 | Orange flame |
| Multiplier | `/public/models/blitz-rush/powerup-multiplier.glb` | 300-400 | Purple star |

---

### 3.5 Character Skins (Revenue Feature)

**Location:** `/public/models/blitz-rush/skins/`

| Skin | Theme | Colors |
|------|-------|--------|
| Gold Rush | Premium gold | All gold helmet/jersey |
| Neon Nights | Electric | Glowing neon accents |
| Retro Classic | Vintage | Leather helmet look |
| All-Star | Special | Star patterns, sparkles |
| Blitz Mode | Electric | Lightning bolts, blue |

Each skin needs:
- Texture variants (helmet, jersey)
- Preview icon (256 x 256)

---

## TIER 4: NICE TO HAVE (Ongoing)

### 4.1 Lottie Animations

| File | Description |
|------|-------------|
| `juked-animation.json` | "JUKED!" bounce + fire particles |
| `touchdown-celebration.json` | Full TD celebration sequence |
| `coin-collect.json` | Coin burst effect |

### 4.2 Music Tracks

| File | Duration | Description |
|------|----------|-------------|
| `music-menu.mp3` | Loop | Upbeat menu music |
| `music-gameplay.mp3` | Loop | Energetic gameplay music |
| `crowd-ambience.mp3` | Loop | Stadium crowd background |

---

## Delivery Instructions

### File Structure:
```
public/
├── images/blitz-rush/
│   ├── tutorial/
│   │   ├── step-1-welcome.png
│   │   ├── step-2-movement.png
│   │   └── ... (all 8 steps + 4 gestures)
│   ├── celebration/
│   │   ├── juked-text.png
│   │   ├── touchdown-text.png
│   │   └── ...
│   ├── icon-coin.png
│   └── icon-*.png
├── textures/blitz-rush/
│   ├── endzone-surface.png
│   └── ...
├── sounds/blitz-rush/
│   ├── coin.mp3
│   └── ...
└── models/blitz-rush/
    ├── player.glb
    └── ...
```

### Technical Requirements:
- **Images:** PNG with transparency, optimized (TinyPNG)
- **Audio:** MP3, 44.1kHz, normalized loudness
- **3D Models:** GLB format, Draco compressed if > 1MB
- **All textures:** Power of 2 dimensions (256, 512, 1024)

---

## Priority Summary

| Tier | Assets | Count | Urgency |
|------|--------|-------|---------|
| 1 | Tutorial + Celebration graphics | 16 | THIS WEEK |
| 2 | End zone textures + Icons + Sounds | 19 | NEXT WEEK |
| 3 | 3D Models (player, defender, obstacles) | 12 | 2+ WEEKS |
| 4 | Lottie + Music + Skins | 8+ | ONGOING |

---

## Style Reference Recap

| Element | Reference | Our Style |
|---------|-----------|-----------|
| Overall | Subway Surfer | Cartoon, saturated, friendly |
| Player | Jake from Subway Surfer | Athletic football player |
| Obstacles | Temple Run | Red defenders, orange barriers |
| Environment | Stadium at night | Dark field, bright lights |
| Effects | Crossy Road | Chunky, satisfying particles |

**Color Palette:**
- Primary: Orange #f97316, Blue #2563eb
- Accent: Gold #fbbf24, Green #22c55e
- Danger: Red #ef4444
- Background: Dark blue #0f172a

---

## Questions?

Create `ANTIGRAVITY_QUESTIONS.md` in the repo or leave comments here.

**The game plays great - let's make it LOOK great!**

---

*Kickoff Club - Learn Football, Have Fun*
