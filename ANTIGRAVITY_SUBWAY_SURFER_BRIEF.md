# Antigravity Asset Brief: Subway Surfer Quality

**Project:** Blitz Rush 3D - Premium Mobile Endless Runner
**Target Quality:** Subway Surfers / Temple Run 2 level polish
**Priority:** CRITICAL - These assets will transform the game
**Date:** December 17, 2024

---

## Executive Summary

We've maxed out procedural graphics in code. The game now has:
- Post-processing (bloom, vignette, speed distortion)
- Animated crowds with wave effects
- Dynamic camera with speed-based FOV
- Snappy Subway Surfer-style controls
- Radial blur at high speeds

**What's missing:** Professional 3D models, textures, and audio that only skilled artists can create.

---

## SECTION 1: CHARACTER MODELS (HIGHEST PRIORITY)

### 1.1 Player Character - "The Runner"

**Style Reference:** Subway Surfer's Jake - stylized, not realistic

```
SPECIFICATIONS:
- Format: GLB (GLTF Binary)
- Poly Count: 4,000-6,000 triangles
- Texture: 1024x1024 diffuse + normal
- Rig: Full skeleton with IK
```

**Visual Design:**
| Part | Description | Color |
|------|-------------|-------|
| Helmet | Oversized, rounded, cartoonish | Team Orange #f97316 |
| Visor | Reflective, curved | Dark blue with glow |
| Face Mask | 3 horizontal bars | Dark metal |
| Jersey | Tight fit, number "20" | Blue #2563eb |
| Shoulder Pads | Exaggerated, heroic | Orange with gold trim |
| Pants | Athletic fit | White with blue stripe |
| Cleats | Detailed with spikes | Black/white |

**Character Proportions (Subway Surfer style):**
- Head: 30% of body height (oversized)
- Torso: 35% (athletic, broad shoulders)
- Legs: 35% (powerful, dynamic)
- Overall: Friendly, approachable, NOT intimidating

**REQUIRED ANIMATIONS (30fps, embedded in GLB):**

| Name | Frames | Loop | Description |
|------|--------|------|-------------|
| `idle` | 60 | Yes | Confident stance, slight bounce, breathing |
| `run` | 24 | Yes | High-energy sprint, arms pumping, knees up |
| `run_fast` | 20 | Yes | Faster cycle for speed boost |
| `jump` | 40 | No | Crouch → explosive leap → arms up → tuck → land |
| `slide` | 30 | No | Quick drop → slide on knees → smooth recovery |
| `strafe_left` | 12 | No | Snappy sidestep with body lean |
| `strafe_right` | 12 | No | Mirror of strafe_left |
| `hit` | 30 | No | Impact reaction, stumble, recover |
| `death` | 50 | No | Dramatic tackle, spin, fall (cartoonish, not violent) |
| `celebrate` | 90 | No | Touchdown dance - fist pump, shimmy, point to crowd |

**Animation Quality Notes:**
- Run cycle must feel FAST and POWERFUL
- Jump needs satisfying hang time
- All animations must blend smoothly
- Celebrate should be memorable and shareable

---

### 1.2 Defender Character - "The Blocker"

**Style:** Menacing but cartoonish (think Team Rocket, not scary)

```
SPECIFICATIONS:
- Format: GLB
- Poly Count: 3,000-4,000 triangles
- Texture: 512x512
```

**Visual Design:**
| Part | Description | Color |
|------|-------------|-------|
| Helmet | Aggressive shape, face visible | Dark Red #7f1d1d |
| Jersey | "X" on chest | Red #dc2626 |
| Size | 20% larger than player | - |
| Stance | Arms wide, ready to tackle | - |

**REQUIRED ANIMATIONS:**

| Name | Frames | Description |
|------|--------|-------------|
| `idle` | 40 | Menacing sway, ready stance |
| `lunge_left` | 15 | Quick dive to left |
| `lunge_right` | 15 | Quick dive to right |
| `miss` | 30 | Whiff, stumble, face plant (comedic) |
| `tackle` | 25 | Successful tackle impact |

---

### 1.3 Character Skins (5 variants)

Each skin = texture swap + minor mesh changes

| Skin Name | Theme | Premium |
|-----------|-------|---------|
| Classic | Default orange/blue | Free |
| Gold Rush | All gold metallic | Premium |
| Neon Night | Glowing neon edges | Premium |
| Retro | Leather helmet, vintage | Premium |
| All-Star | Stars, sparkles | Premium |

**Deliverables per skin:**
- Diffuse texture variant (1024x1024)
- Preview icon (256x256)
- Optional: emission map for glow effects

---

## SECTION 2: ENVIRONMENT MODELS

### 2.1 Stadium Section (Tileable)

**Purpose:** Repeating backdrop that creates infinite stadium feel

```
SPECIFICATIONS:
- Format: GLB
- Length: 50 units (tiles seamlessly)
- Width: 40 units (both sides of field)
- Poly Count: 8,000-10,000 total
```

**Components:**
1. **Bleachers** - Tiered seating (can be low-poly)
2. **Crowd** - Billboard sprites or instanced simple meshes
3. **Stadium Lights** - Tall towers with glow fixtures
4. **Banners** - Team color flags (animated cloth optional)
5. **Roof Canopy** - Partial coverage

**Crowd Notes:**
- Can be 2D billboard sprites for performance
- Variety of shirt colors (team colors + randoms)
- Some with raised arms (10-20%)
- Animated UV scroll for "wave" effect (optional)

### 2.2 Field Section (Ground Tiles)

```
SPECIFICATIONS:
- Format: GLB or just textures
- Size: 100 units length, 14 units wide
```

**Textures Needed:**
| File | Size | Description |
|------|------|-------------|
| `field_grass.png` | 1024x1024 | Tileable grass with subtle stripes |
| `field_lines.png` | 1024x256 | Yard line overlay (transparent) |
| `field_hash.png` | 512x512 | Hash marks |
| `endzone.png` | 1024x512 | End zone with "TOUCHDOWN" text |

### 2.3 Goal Posts

```
SPECIFICATIONS:
- Format: GLB
- Poly Count: 500-800
```

**Design:** Classic yellow goal posts, slightly stylized/chunky

---

## SECTION 3: OBSTACLES

### 3.1 Defender Obstacle (Barrier)
Already covered in 1.2

### 3.2 Hurdle
**Purpose:** Low obstacle - player must JUMP

```
Visual: Orange/white striped bar on two posts
Size: 2m wide, 1.2m tall, 0.3m deep
File: hurdle.glb
Poly: 500
```

### 3.3 High Bar
**Purpose:** Tall obstacle - player must SLIDE

```
Visual: Padded blocking dummy on stand
Size: 2m wide, 3m tall
File: high_bar.glb
Poly: 800
```

### 3.4 Blocker (Bust Through)
**Purpose:** Can be destroyed by spending coins

```
Visual: Training sled or foam wall
Size: 2.5m wide, 2m tall
File: blocker.glb
Poly: 600
Effect: Needs "break apart" animation or particles
```

---

## SECTION 4: COLLECTIBLES

### 4.1 Coin

```
SPECIFICATIONS:
- File: coin.glb
- Poly: 200-300
- Size: 0.8m diameter
```

**Design:**
- Shiny gold with subtle football symbol
- Slight beveled edge
- Reflective material
- Embedded spin animation (or we animate in code)

### 4.2 Mega Coin
Same as coin but 1.5x size, extra glow

### 4.3 Power-Ups (4 types)

| Type | Shape | Color | Icon |
|------|-------|-------|------|
| Magnet | Horseshoe | Pink #ec4899 | Magnet icon |
| Shield | Sphere/bubble | Blue #3b82f6 | Shield icon |
| Speed | Flame/bolt | Green #22c55e | Lightning icon |
| 2x Coins | Star | Gold #f59e0b | "2X" text |

```
Each power-up:
- File: powerup_[type].glb
- Poly: 300-400
- Should float and glow
- Pulsing animation helpful
```

---

## SECTION 5: SOUND EFFECTS (CRITICAL)

**Format:** MP3, 44.1kHz, Mono, Normalized
**Location:** `/public/sounds/blitz-rush/`

### Player Sounds
| File | Duration | Description |
|------|----------|-------------|
| `footstep_grass.mp3` | 0.1s | Single footstep on turf |
| `jump.mp3` | 0.3s | Athletic "hup" + whoosh |
| `land.mp3` | 0.2s | Solid thud on landing |
| `slide.mp3` | 0.5s | Sliding on turf sound |
| `lane_change.mp3` | 0.15s | Quick swoosh for lane switch |

### Collectible Sounds
| File | Duration | Description |
|------|----------|-------------|
| `coin.mp3` | 0.3s | Satisfying "cha-ching" |
| `coin_mega.mp3` | 0.5s | Bigger, more rewarding |
| `powerup_collect.mp3` | 0.5s | Magical activation |
| `shield_activate.mp3` | 0.4s | Bubble forming |
| `shield_break.mp3` | 0.4s | Glass shatter |
| `speed_boost.mp3` | 0.5s | Whoooosh acceleration |
| `magnet_hum.mp3` | Loop | Subtle magnetic hum |

### Game Event Sounds
| File | Duration | Description |
|------|----------|-------------|
| `near_miss.mp3` | 0.3s | Tense "phew" whoosh |
| `collision.mp3` | 0.4s | Impact/tackle |
| `game_start.mp3` | 1s | Whistle + "hut hut" |
| `game_over.mp3` | 1.5s | Dramatic failure sting |
| `touchdown.mp3` | 2s | Crowd roar + horn |
| `high_score.mp3` | 2s | Victory fanfare |
| `combo.mp3` | 0.4s | Combo achieved ding |
| `level_up.mp3` | 1s | Level complete jingle |

### Music
| File | Duration | Description |
|------|----------|-------------|
| `music_menu.mp3` | Loop | Upbeat, energetic menu |
| `music_gameplay.mp3` | Loop | Intense running music |
| `crowd_ambience.mp3` | Loop | Stadium crowd background |

---

## SECTION 6: UI ASSETS

### Icons (64x64 PNG, transparent)
- `icon_coin.png` - Gold coin
- `icon_magnet.png` - Magnet power-up
- `icon_shield.png` - Shield power-up
- `icon_speed.png` - Speed boost
- `icon_2x.png` - Score multiplier

### Backgrounds (1920x1080 PNG)
- `bg_menu.png` - Stadium at sunset
- `bg_gameover.png` - Dramatic field view
- `bg_loading.png` - Loading screen

### Tutorial Assets
Already specified in ANTIGRAVITY_BLITZ_RUSH_UPDATE.md

---

## SECTION 7: PARTICLE TEXTURES

**Location:** `/public/textures/blitz-rush/particles/`

| File | Size | Description |
|------|------|-------------|
| `sparkle.png` | 64x64 | White star sparkle |
| `dust.png` | 64x64 | Brown dust puff |
| `speed_line.png` | 32x128 | Horizontal speed streak |
| `confetti.png` | 256x256 | 4x4 spritesheet of confetti |
| `coin_trail.png` | 32x64 | Golden trail |

---

## SECTION 8: PRIORITY ORDER

### PHASE 1 (Week 1) - Game-Changers
1. Player character with all animations
2. Core sound effects (coin, jump, collision)
3. Coin model
4. Touchdown/crowd roar sounds

### PHASE 2 (Week 2) - Polish
5. Defender character with animations
6. All 4 obstacles
7. All 4 power-ups
8. Music tracks

### PHASE 3 (Week 3) - Environment
9. Stadium section (tileable)
10. Field textures
11. Goal posts
12. Particle textures

### PHASE 4 (Week 4) - Extras
13. Character skins (5)
14. UI assets
15. Tutorial assets
16. Remaining sounds

---

## SECTION 9: TECHNICAL REQUIREMENTS

### 3D Models
- **Format:** GLB (GLTF Binary) - single file with textures
- **Compression:** Draco if > 1MB
- **Origin:** Centered, Y-up
- **Scale:** 1 unit = 1 meter
- **Materials:** PBR (roughness/metallic workflow)

### Animations
- **FPS:** 30fps baked
- **Naming:** lowercase_with_underscores
- **Root Motion:** None (handled in code)
- **Blending:** Must blend smoothly

### Textures
- **Format:** PNG
- **Size:** Power of 2 (256, 512, 1024)
- **Compression:** TinyPNG before delivery

### Audio
- **Format:** MP3 (128kbps minimum)
- **Normalization:** All sounds same loudness
- **Trim:** No silence at start/end

---

## SECTION 10: FILE STRUCTURE

```
public/
├── models/
│   └── blitz-rush/
│       ├── player.glb ⭐
│       ├── defender.glb ⭐
│       ├── hurdle.glb
│       ├── high_bar.glb
│       ├── blocker.glb
│       ├── coin.glb ⭐
│       ├── powerup_magnet.glb
│       ├── powerup_shield.glb
│       ├── powerup_speed.glb
│       ├── powerup_2x.glb
│       ├── stadium_section.glb
│       ├── goal_posts.glb
│       └── skins/
│           ├── skin_gold.png
│           ├── skin_neon.png
│           └── ...
├── textures/
│   └── blitz-rush/
│       ├── field_grass.png
│       ├── field_lines.png
│       ├── endzone.png
│       └── particles/
│           ├── sparkle.png
│           └── ...
├── sounds/
│   └── blitz-rush/
│       ├── coin.mp3 ⭐
│       ├── jump.mp3 ⭐
│       ├── touchdown.mp3 ⭐
│       └── ...
└── images/
    └── blitz-rush/
        ├── icon_coin.png
        └── ...
```

---

## SECTION 11: REFERENCE GAMES

Study these for quality benchmarks:

| Game | What to Study |
|------|---------------|
| **Subway Surfers** | Character design, animation quality, colors, game feel |
| **Temple Run 2** | Environment design, obstacle variety, camera work |
| **Crossy Road** | Low-poly charm, satisfying sounds, juice |
| **Minion Rush** | Character personality, celebration animations |

---

## Questions?

Create `ANTIGRAVITY_QUESTIONS.md` or comment directly.

**Key Success Metrics:**
1. Player character feels as alive as Jake from Subway Surfers
2. Sounds are satisfying and memorable
3. Environment creates sense of speed and excitement
4. Everything feels polished, not placeholder

---

*Let's make Blitz Rush a top 10 mobile game!*

**Kickoff Club - Learn Football, Have Fun**
