# Antigravity Asset Request: Blitz Rush 3D

**Project:** Kickoff Club - Blitz Rush 3D Endless Runner
**Priority:** HIGH - Critical for game launch
**Style Reference:** Subway Surfer, Temple Run, Crossy Road
**Date:** December 2024

---

## Overview

We need 3D assets for our flagship endless runner game "Blitz Rush 3D". The game is built with Three.js/React Three Fiber and needs stylized, mobile-optimized 3D models that match the quality of Subway Surfer.

**Art Style:** Stylized/cartoon - NOT realistic. Think Subway Surfer meets American Football.

---

## SECTION 1: 3D MODELS (GLB/GLTF FORMAT)

### 1.1 PLAYER CHARACTER (PRIORITY: P0 - CRITICAL)

**Description:** Stylized football player - the main character the user controls.

**Style Reference:**
- Body proportions similar to Subway Surfer characters (slightly exaggerated, not realistic)
- Friendly, approachable look - NOT aggressive or scary
- Bright, saturated colors
- Clean, low-poly style with smooth shading

**Technical Specs:**
- **Poly count:** 3,000 - 5,000 triangles
- **Rig:** Full skeleton with IK (for procedural animation support)
- **Texture size:** 512x512 (diffuse, normal, emission)
- **Format:** GLB (single file with embedded textures)
- **File path:** `/public/models/blitz-rush/player.glb`

**Visual Design:**
```
- HELMET: Bright yellow/gold, rounded shape, face mask visible
- JERSEY: Blue (#2563eb) with white number "20" on chest/back
- SHOULDER PADS: Slightly oversized for cartoon effect
- PANTS: White with blue stripe
- CLEATS: Black with small spikes
- SKIN TONE: Medium brown (inclusive default)
- BUILD: Athletic but not bulky, youthful
```

**REQUIRED ANIMATIONS (embedded in GLB):**

| Animation Name | Frames | Loop | Description |
|---------------|--------|------|-------------|
| `idle` | 60 | Yes | Slight bounce, breathing, ready stance |
| `run` | 24 | Yes | Full sprint cycle, arms pumping, knees high |
| `jump` | 30 | No | Crouch → leap → arms up → tuck → land prep |
| `slide` | 20 | No | Drop to knees → slide forward → recovery |
| `strafe_left` | 15 | No | Quick sidestep left, body leans |
| `strafe_right` | 15 | No | Quick sidestep right, body leans |
| `stumble` | 20 | No | Near-miss recovery, arms flail briefly |
| `death` | 40 | No | Gets tackled, dramatic fall, lies down |
| `celebrate` | 60 | No | Touchdown celebration, fist pump, dance |

**Animation Notes:**
- All animations should be smooth and snappy (Subway Surfer quality)
- Run cycle should feel fast and energetic
- Jump should have good hang time feel
- Death animation should be dramatic but not violent (cartoonish)

---

### 1.2 DEFENDER (OBSTACLE) (PRIORITY: P0 - CRITICAL)

**Description:** Enemy football player that blocks the way.

**Style:**
- Opposing team colors (red/dark red #dc2626)
- Menacing but cartoonish (not scary)
- Arms spread in blocking stance
- Slightly larger than player (intimidating)

**Technical Specs:**
- **Poly count:** 2,000 - 3,000 triangles
- **Texture size:** 512x512
- **Format:** GLB
- **File path:** `/public/models/blitz-rush/defender.glb`

**Visual Design:**
```
- HELMET: Dark red (#7f1d1d), similar style to player
- JERSEY: Red (#dc2626) with white "X" on chest
- SHOULDER PADS: Larger than player (boss-like)
- STANCE: Arms spread wide, knees bent, blocking
- EXPRESSION: Determined (visible through face mask)
```

**REQUIRED ANIMATIONS:**

| Animation Name | Frames | Loop | Description |
|---------------|--------|------|-------------|
| `idle` | 30 | Yes | Subtle menacing sway, ready to tackle |
| `lunge` | 20 | No | Quick forward lunge (for near-miss feedback) |
| `tackle` | 30 | No | Full tackle animation (when hitting player) |

---

### 1.3 OBSTACLES (PRIORITY: P1 - HIGH)

#### 1.3.1 Hurdle
**Description:** Low barrier player must jump over.

**Visual:** Orange/white striped bar between two metal posts.

**Specs:**
- Poly count: 500-800
- File: `/public/models/blitz-rush/hurdle.glb`
- No animation needed (static)

**Dimensions:** Width: 2m, Height: 1.2m, Depth: 0.3m

---

#### 1.3.2 Barrier Wall
**Description:** Tall wall that blocks entire lane.

**Visual:** Orange construction barrier with warning stripes.

**Specs:**
- Poly count: 300-500
- File: `/public/models/blitz-rush/barrier.glb`
- No animation needed

**Dimensions:** Width: 2.5m, Height: 3m, Depth: 0.5m

---

#### 1.3.3 Tackle Dummy
**Description:** Training equipment player must slide under.

**Visual:** Blue padded dummy on a base (tall obstacle).

**Specs:**
- Poly count: 800-1000
- File: `/public/models/blitz-rush/tackle-dummy.glb`
- No animation needed

**Dimensions:** Width: 1.2m, Height: 3.5m (forces slide)

---

#### 1.3.4 Gatorade Cooler (Optional)
**Description:** Wide obstacle that forces lane change.

**Visual:** Large orange/green Gatorade-style cooler on wheels.

**Specs:**
- Poly count: 500-700
- File: `/public/models/blitz-rush/cooler.glb`

---

### 1.4 COLLECTIBLES (PRIORITY: P0 - CRITICAL)

#### 1.4.1 Coin
**Description:** Spinning gold coin - primary collectible.

**Visual:**
- Classic gold coin design
- Dollar sign or football symbol in center
- Shiny, reflective material
- Slight glow effect

**Specs:**
- Poly count: 200-300
- File: `/public/models/blitz-rush/coin.glb`
- Include spin animation (or we'll animate in code)

**Dimensions:** Diameter: 0.8m, Thickness: 0.1m

---

#### 1.4.2 Mega Coin
**Description:** Larger, more valuable coin.

**Visual:** Same as coin but 1.5x size with extra glow/particles.

**Specs:**
- File: `/public/models/blitz-rush/mega-coin.glb`

---

#### 1.4.3 Power-up: Magnet
**Description:** Magnet power-up that attracts coins.

**Visual:**
- Red horseshoe magnet shape
- Glowing, floating
- Particle effects around it

**Specs:**
- Poly count: 300-400
- File: `/public/models/blitz-rush/powerup-magnet.glb`
- Color: Red (#ef4444)

---

#### 1.4.4 Power-up: Shield
**Description:** Shield power-up that protects from one hit.

**Visual:**
- Blue energy sphere/bubble
- Transparent with energy lines
- Pulsing glow

**Specs:**
- Poly count: 300-400
- File: `/public/models/blitz-rush/powerup-shield.glb`
- Color: Blue (#3b82f6)

---

#### 1.4.5 Power-up: Speed Boost
**Description:** Speed power-up.

**Visual:**
- Orange flame/lightning bolt shape
- Energy effect, glowing

**Specs:**
- File: `/public/models/blitz-rush/powerup-speed.glb`
- Color: Orange (#f97316)

---

#### 1.4.6 Power-up: Multiplier
**Description:** Score multiplier power-up.

**Visual:**
- Purple star shape
- "2X" text or symbol
- Sparkle effect

**Specs:**
- File: `/public/models/blitz-rush/powerup-multiplier.glb`
- Color: Purple (#8b5cf6)

---

### 1.5 ENVIRONMENT (PRIORITY: P2 - MEDIUM)

#### 1.5.1 Stadium Section
**Description:** Repeating stadium environment piece.

**Visual:**
- Stadium seating/bleachers (can be low-poly/billboard)
- Stadium lights
- Banners and flags
- Night game atmosphere

**Specs:**
- File: `/public/models/blitz-rush/stadium-section.glb`
- Should tile seamlessly
- Crowd can be 2D billboards for performance

---

#### 1.5.2 Field Section
**Description:** Football field ground tile.

**Visual:**
- Green turf texture
- White yard lines every 10 yards
- Lane markers (subtle)

**Specs:**
- File: `/public/models/blitz-rush/field-section.glb`
- Length: 100m (one football field)

---

## SECTION 2: TEXTURES

All textures should be provided separately for flexibility:

### Required Textures:
```
/public/textures/blitz-rush/
├── player-diffuse.png (512x512)
├── player-normal.png (512x512)
├── player-emission.png (512x512) - for helmet shine
├── defender-diffuse.png (512x512)
├── field-diffuse.png (1024x1024) - tileable grass
├── field-lines.png (1024x1024) - yard line overlay
├── crowd-billboard.png (512x256) - animated crowd sprite
└── stadium-diffuse.png (1024x1024)
```

---

## SECTION 3: AUDIO/SOUND EFFECTS

**Format:** MP3, 44.1kHz, Mono
**Location:** `/public/sounds/blitz-rush/`

### Player Sounds:
| File | Duration | Description |
|------|----------|-------------|
| `footstep.mp3` | 0.1s | Single footstep on turf |
| `jump.mp3` | 0.3s | Whoosh sound on jump |
| `land.mp3` | 0.2s | Thud on landing |
| `slide.mp3` | 0.5s | Sliding on turf |
| `lane-switch.mp3` | 0.2s | Quick swoosh for lane change |

### Collectible Sounds:
| File | Duration | Description |
|------|----------|-------------|
| `coin.mp3` | 0.3s | Satisfying "cha-ching" coin collect |
| `mega-coin.mp3` | 0.5s | Bigger, more rewarding coin sound |
| `powerup.mp3` | 0.5s | Magical power-up activation |
| `shield-activate.mp3` | 0.4s | Shield bubble forming |
| `shield-break.mp3` | 0.4s | Glass shatter (shield used) |
| `speed-boost.mp3` | 0.5s | Whoosh/acceleration sound |
| `magnet.mp3` | 0.4s | Magnetic hum activation |

### Game Event Sounds:
| File | Duration | Description |
|------|----------|-------------|
| `near-miss.mp3` | 0.3s | Tense "phew" near-miss |
| `collision.mp3` | 0.4s | Impact/tackle sound |
| `game-start.mp3` | 1s | Whistle blow / "hut hut" |
| `game-over.mp3` | 1.5s | Dramatic failure sound |
| `high-score.mp3` | 2s | Celebration fanfare |
| `milestone.mp3` | 0.8s | Score milestone (500, 1000, etc.) |
| `combo.mp3` | 0.4s | Combo achieved |
| `button-click.mp3` | 0.1s | UI button tap |

### Ambient/Music:
| File | Duration | Description |
|------|----------|-------------|
| `crowd-ambience.mp3` | Loop | Stadium crowd background |
| `music-menu.mp3` | Loop | Upbeat menu music |
| `music-gameplay.mp3` | Loop | Energetic gameplay music |
| `music-gameover.mp3` | 10s | Game over music sting |

---

## SECTION 4: PARTICLE TEXTURES

**Location:** `/public/textures/blitz-rush/particles/`

| File | Size | Description |
|------|------|-------------|
| `sparkle.png` | 64x64 | White sparkle for coins |
| `dust.png` | 64x64 | Brown dust cloud |
| `energy.png` | 64x64 | Blue/orange energy particle |
| `confetti.png` | 128x128 | Spritesheet of confetti pieces |
| `trail.png` | 32x128 | Speed trail texture |

---

## SECTION 5: UI ASSETS (2D)

**Location:** `/public/images/blitz-rush/`

### Icons (64x64 PNG with transparency):
- `icon-coin.png` - Gold coin icon
- `icon-magnet.png` - Magnet powerup icon
- `icon-shield.png` - Shield powerup icon
- `icon-speed.png` - Speed powerup icon
- `icon-multiplier.png` - 2X multiplier icon

### Backgrounds:
- `bg-menu.png` (1920x1080) - Menu background
- `bg-gameover.png` (1920x1080) - Game over background

---

## SECTION 6: TECHNICAL REQUIREMENTS

### Model Requirements:
1. **Format:** GLB (GLTF Binary) - single file with embedded textures
2. **Optimization:** Use Draco compression if file size > 1MB
3. **Origin:** All models centered at origin, Y-up
4. **Scale:** 1 unit = 1 meter
5. **Materials:** PBR materials (roughness/metallic workflow)

### Animation Requirements:
1. **FPS:** 30fps baked animations
2. **Naming:** Lowercase with underscores (e.g., `run`, `jump_start`)
3. **Root motion:** None (we handle movement in code)
4. **Blending:** Animations should blend smoothly

### Texture Requirements:
1. **Format:** PNG with transparency where needed
2. **Power of 2:** All dimensions must be power of 2 (256, 512, 1024)
3. **Compression:** Use TinyPNG or similar before delivery

### Audio Requirements:
1. **Format:** MP3 (128kbps minimum)
2. **Normalization:** All sounds normalized to same loudness
3. **No silence:** Trim silence from start/end

---

## SECTION 7: FILE STRUCTURE

```
public/
├── models/
│   └── blitz-rush/
│       ├── player.glb (CRITICAL)
│       ├── defender.glb (CRITICAL)
│       ├── hurdle.glb
│       ├── barrier.glb
│       ├── tackle-dummy.glb
│       ├── coin.glb (CRITICAL)
│       ├── mega-coin.glb
│       ├── powerup-magnet.glb
│       ├── powerup-shield.glb
│       ├── powerup-speed.glb
│       ├── powerup-multiplier.glb
│       ├── stadium-section.glb
│       └── field-section.glb
├── textures/
│   └── blitz-rush/
│       ├── player-diffuse.png
│       ├── field-diffuse.png
│       └── particles/
│           ├── sparkle.png
│           ├── dust.png
│           └── ...
├── sounds/
│   └── blitz-rush/
│       ├── footstep.mp3
│       ├── coin.mp3
│       ├── music-gameplay.mp3
│       └── ...
└── images/
    └── blitz-rush/
        ├── icon-coin.png
        └── ...
```

---

## SECTION 8: PRIORITY ORDER

### Phase 1 (CRITICAL - Need immediately):
1. ⭐ Player character with all animations
2. ⭐ Defender with animations
3. ⭐ Coin model
4. ⭐ Core sound effects (coin, jump, collision)

### Phase 2 (HIGH - Need soon):
5. Hurdle, Barrier, Tackle Dummy obstacles
6. All 4 power-up models
7. Mega coin
8. Remaining sound effects

### Phase 3 (MEDIUM - Nice to have):
9. Stadium environment
10. Field textures
11. Music tracks
12. Particle textures

---

## SECTION 9: STYLE GUIDE SUMMARY

| Element | Style | Colors |
|---------|-------|--------|
| Player | Friendly, heroic | Blue #2563eb, Yellow #eab308 |
| Defender | Menacing but cartoonish | Red #dc2626, Dark red #7f1d1d |
| Coins | Shiny, rewarding | Gold #fbbf24 |
| Powerups | Glowing, magical | Red/Blue/Orange/Purple |
| Environment | Night game atmosphere | Dark with bright lights |
| Overall | Subway Surfer quality | Saturated, clean, fun |

---

## SECTION 10: REFERENCE IMAGES

Please study these games for style reference:
1. **Subway Surfer** - Character design, animation quality, colors
2. **Temple Run** - Environment, obstacle design
3. **Crossy Road** - Low-poly but charming aesthetic
4. **NFL Rivals** - Football-specific design elements

---

## Questions?

If anything is unclear, please ask before starting. The player character is the most important asset - we need it to feel as polished as Subway Surfer's Jake.

**Key priorities:**
1. Animation quality (smooth, snappy, satisfying)
2. Mobile optimization (low poly, compressed textures)
3. Consistent art style across all assets
4. Subway Surfer level of polish

---

*Kickoff Club - Learn Football, Have Fun*
