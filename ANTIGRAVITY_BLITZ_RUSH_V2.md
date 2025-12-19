# Antigravity Asset Brief V2: Prime Time Night Game

**Project:** Blitz Rush 3D - Premium Mobile Endless Runner
**Visual Direction:** Monday Night Football meets NFL Blitz
**Date:** December 18, 2024
**Status:** UPDATED DIRECTION

---

## Creative Direction

### The Vision
**"Prime Time Night Game with a Mascot Hero"**

Imagine the electricity of Monday Night Football - stadium lights blazing against the night sky, dramatic shadows on the field, the roar of the crowd. Now put a larger-than-life mascot hero on that field - oversized helmet, heroic proportions, personality that pops.

**Reference Games:**
- NFL Blitz (character style - exaggerated, fun)
- Madden (stadium atmosphere - broadcast quality)
- Subway Surfers (proportions - approachable mascot)

**Reference Broadcasts:**
- ESPN Monday Night Football (lighting, atmosphere)
- NFL Films (cinematic quality)
- Super Bowl halftime (spectacle)

---

## SECTION 1: PLAYER CHARACTER - "THE STAR"

### 1.1 Design Philosophy

**NOT:** Realistic athlete, serious competitor
**YES:** Mascot hero, larger-than-life, fun personality

Think: If an NFL team mascot became the star player

### 1.2 Specifications

```
Format: GLB (GLTF Binary)
Poly Count: 5,000-7,000 triangles
Texture: 1024x1024 (diffuse + normal + emissive)
Rig: Full skeleton with IK
```

### 1.3 Visual Design

| Part | Description | Notes |
|------|-------------|-------|
| **Helmet** | OVERSIZED (35% of body height) | Glossy finish, catches stadium lights |
| **Visor** | Gold mirror reflective | Hides face = mystery/cool factor |
| **Face Mask** | Chrome bars | Premium metallic look |
| **Jersey** | Fitted, number "1" | Deep blue #1e3a8a with orange accents |
| **Shoulder Pads** | HEROIC, exaggerated | Orange #f97316 with gold trim |
| **Pants** | Athletic white | Blue stripe down sides |
| **Cleats** | Chunky, detailed | Black with orange accents |
| **Gloves** | Receiver gloves | Orange, grippy texture |

### 1.4 Proportions (Mascot Style)

```
Total Height: 2.5 units

Head/Helmet: 35% (0.875 units) - OVERSIZED, iconic
Torso: 30% (0.75 units) - Broad shoulders, heroic
Legs: 35% (0.875 units) - Powerful, athletic

Width: Shoulder pads extend 20% beyond normal
Stance: Confident, ready to run
```

### 1.5 Color Palette

| Element | Hex | Name |
|---------|-----|------|
| Primary | #f97316 | Kickoff Orange |
| Secondary | #1e3a8a | Deep Blue |
| Accent | #fbbf24 | Gold |
| Helmet Shine | #ffffff | Stadium Light Reflection |
| Jersey Shadow | #1e40af | Blue Shadow |

### 1.6 Required Animations

| Name | Frames | Loop | Description | Feel |
|------|--------|------|-------------|------|
| `idle` | 60 | Yes | Confident stance, chest breathing, slight bounce | "I own this field" |
| `run` | 24 | Yes | Powerful sprint, knees HIGH, arms pumping | Explosive power |
| `run_fast` | 18 | Yes | Overdrive mode, blur-fast cycle | Superhuman speed |
| `jump` | 45 | No | Crouch → EXPLOSIVE leap → hang time → land | Satisfying airtime |
| `slide` | 35 | No | Quick drop → baseball slide → pop up | Smooth and cool |
| `dodge_left` | 15 | No | Juke move with shoulder fake | Quick and snappy |
| `dodge_right` | 15 | No | Mirror of dodge_left | Quick and snappy |
| `hit` | 35 | No | Big impact, stumble, helmet wobble | Dramatic but not violent |
| `tackle_dodge` | 40 | No | Matrix-style slow-mo dodge | The signature move |
| `touchdown` | 120 | No | Spike ball → point to crowd → dance | Iconic celebration |

### 1.7 Animation Quality Notes

- Run cycle should feel POWERFUL - this is a star player
- Jump needs hang time - player should feel floaty at apex
- Touchdown celebration should be MEMORABLE - something players want to see
- All transitions must be buttery smooth
- Helmet should have secondary motion (slight wobble/bounce)

---

## SECTION 2: STADIUM ENVIRONMENT

### 2.1 Design Philosophy

**Prime Time Night Game Atmosphere**

The stadium should feel like a MASSIVE spectacle:
- Towering light structures
- Sea of fans
- Night sky backdrop
- Broadcast-quality presentation

### 2.2 Stadium Section (Tileable)

```
Format: GLB
Length: 60 units (seamless tile)
Width: 50 units (field + both sidelines)
Poly Count: 12,000-15,000 total
```

### 2.3 Components

#### Stands/Bleachers
- 3 tiers of seating
- Concrete structure with metal railings
- Warm stadium lighting hitting surfaces
- Depth through LOD (detailed near, simple far)

#### Crowd
- Mix of seated and standing fans
- Team colors dominant (orange/blue)
- 10-15% with raised arms
- Subtle animation (sway, wave)
- Billboard sprites acceptable for performance

#### Stadium Lights
- MASSIVE light towers (4 per section)
- Visible light beams cutting through atmosphere
- Lens flare on direct view
- Warm color temperature (3200K feel)

#### Press Box / Luxury Suites
- Glass-fronted boxes above stands
- Interior lights visible
- Adds vertical interest

#### Scoreboard (Background)
- Large video board showing game
- "KICKOFF CLUB" branding
- Animated content (optional)

### 2.4 Field Surface

```
Format: Textures (can be applied to simple geometry)
```

| Texture | Size | Description |
|---------|------|-------------|
| `field_turf.png` | 2048x2048 | Realistic grass with subtle stripe pattern |
| `field_lines.png` | 2048x512 | Yard lines, numbers, hash marks (overlay) |
| `endzone_home.png` | 1024x512 | "KICKOFF" in end zone |
| `endzone_away.png` | 1024x512 | "CLUB" in end zone |
| `field_worn.png` | 1024x1024 | Worn grass overlay for center field |

### 2.5 Night Sky / Backdrop

- Deep blue-black gradient sky
- NO stars (light pollution from stadium)
- Subtle clouds catching stadium light glow
- City skyline silhouette (optional)

### 2.6 Atmosphere Elements

| Element | Description |
|---------|-------------|
| Fog/Haze | Light atmospheric haze for depth |
| Light beams | Visible light rays from stadium lights |
| Dust particles | Subtle floating particles in light beams |
| Heat shimmer | Optional distortion near lights |

---

## SECTION 3: OBSTACLES

### 3.1 Defender - "The Blocker"

**Style:** Intimidating but still stylized (villain mascot)

```
Format: GLB
Poly Count: 4,000-5,000
```

| Part | Description |
|------|-------------|
| Helmet | Aggressive, angular, dark visor |
| Jersey | Red #dc2626 with black accents |
| Number | "99" or "XX" |
| Size | 25% larger than player |
| Stance | Wide, arms ready |

**Animations:**
- `idle` - Menacing sway
- `lunge_left` - Dive tackle left
- `lunge_right` - Dive tackle right
- `miss` - Whiff and face plant (comedic)
- `tackle` - Successful hit

### 3.2 Hurdle (Jump Over)

```
Visual: Training hurdle with padding
Color: Orange with white stripes
Size: 2m wide, 1m tall
```

### 3.3 High Bar (Slide Under)

```
Visual: Padded blocking dummy on stand
Color: Blue with orange padding
Size: 2m wide, 2.5m tall
```

### 3.4 Tackle Dummy (Bust Through)

```
Visual: Traditional tackle sled
Color: Red padding, metal frame
Effect: Breaks apart when hit
```

---

## SECTION 4: COLLECTIBLES & POWER-UPS

### 4.1 Coin

```
Format: GLB
Poly Count: 300-400
Size: 0.8m diameter
```

**Design:**
- Gold with football texture embossed
- Metallic material (catches stadium lights)
- Subtle spin animation baked in
- Emissive edge glow

### 4.2 Power-Ups

| Type | Shape | Color | Icon |
|------|-------|-------|------|
| Magnet | Horseshoe | Pink #ec4899 | Magnet symbol |
| Shield | Sphere/Bubble | Blue #3b82f6 | Shield icon |
| Speed | Flame/Bolt | Orange #f97316 | Lightning bolt |
| 2x Score | Star | Gold #fbbf24 | "2X" text |

Each power-up:
- Floating animation
- Pulsing glow
- Particle trail
- 400-500 polys

---

## SECTION 5: AUDIO - BROADCAST QUALITY

### 5.1 Philosophy

Sound like you're IN the stadium watching a real game.
Mix of:
- Crisp player sounds (footsteps, hits)
- Ambient crowd atmosphere
- Broadcast-style stingers

### 5.2 Player Sounds

| File | Duration | Description |
|------|----------|-------------|
| `footstep_turf_01.mp3` | 0.1s | Single cleat on turf |
| `footstep_turf_02.mp3` | 0.1s | Variation |
| `footstep_turf_03.mp3` | 0.1s | Variation |
| `jump_grunt.mp3` | 0.3s | Athletic effort sound |
| `land_turf.mp3` | 0.2s | Landing impact |
| `slide_turf.mp3` | 0.6s | Sliding on grass |
| `dodge_swoosh.mp3` | 0.2s | Quick movement air |
| `hit_impact.mp3` | 0.4s | Collision with defender |
| `helmet_crack.mp3` | 0.3s | Helmet contact |

### 5.3 Collectible Sounds

| File | Duration | Description |
|------|----------|-------------|
| `coin_collect.mp3` | 0.25s | Satisfying metallic ding |
| `coin_combo.mp3` | 0.3s | Rising pitch for combos |
| `powerup_collect.mp3` | 0.5s | Magical whoosh + chime |
| `powerup_active.mp3` | Loop | Subtle hum while active |
| `shield_hit.mp3` | 0.4s | Force field deflection |
| `shield_break.mp3` | 0.5s | Shield shattering |
| `magnet_pull.mp3` | 0.3s | Coins being attracted |
| `speed_boost.mp3` | 0.6s | Acceleration whoosh |

### 5.4 Game Events

| File | Duration | Description |
|------|----------|-------------|
| `game_start.mp3` | 1.5s | Whistle + crowd surge |
| `near_miss.mp3` | 0.3s | Tension release swoosh |
| `juke_success.mp3` | 0.5s | Crowd "OHHH!" reaction |
| `touchdown.mp3` | 3s | MASSIVE crowd roar + horn |
| `game_over.mp3` | 2s | Crowd disappointment + whistle |
| `new_record.mp3` | 2.5s | Triumphant fanfare |
| `level_up.mp3` | 1.5s | Achievement sound |

### 5.5 Ambient / Music

| File | Duration | Description |
|------|----------|-------------|
| `crowd_idle.mp3` | Loop (30s) | Ambient crowd murmur |
| `crowd_excited.mp3` | Loop (30s) | Intense crowd energy |
| `crowd_chant.mp3` | 5s | "DE-FENSE" style chant |
| `stadium_organ.mp3` | Loop | Classic stadium organ riff |
| `music_menu.mp3` | Loop | Hype intro music |
| `music_gameplay.mp3` | Loop | Driving action music |

### 5.6 Audio Specs

```
Format: MP3 (128kbps minimum, 192kbps preferred)
Sample Rate: 44.1kHz
Channels: Mono (effects), Stereo (music/ambient)
Normalization: -3dB peak, consistent loudness
```

---

## SECTION 6: UI ASSETS

### 6.1 Icons (64x64 PNG, transparent)

- `icon_coin.png` - Gold coin
- `icon_magnet.png` - Magnet power-up
- `icon_shield.png` - Shield power-up
- `icon_speed.png` - Speed boost
- `icon_2x.png` - Score multiplier
- `icon_pause.png` - Pause button
- `icon_sound_on.png` - Sound enabled
- `icon_sound_off.png` - Sound muted

### 6.2 Backgrounds (1920x1080 PNG)

- `bg_menu.png` - Stadium at night, dramatic lighting
- `bg_gameover.png` - Field view, slightly blurred
- `bg_victory.png` - Celebration confetti

### 6.3 Character Select Portraits (512x512 PNG)

- Portrait for each unlockable character
- Consistent lighting and pose
- Stadium background blur

---

## SECTION 7: DELIVERY PRIORITIES

### Phase 1 - CRITICAL (Week 1)
1. Player character model + all animations
2. Core sound effects (footsteps, coin, hit, touchdown)
3. Coin model
4. Field textures

### Phase 2 - HIGH (Week 2)
5. Defender model + animations
6. Stadium section (tileable)
7. All power-up models
8. Remaining sound effects

### Phase 3 - POLISH (Week 3)
9. Obstacle models (hurdle, high bar, dummy)
10. Music tracks
11. UI assets
12. Character skins (3-5 variants)

### Phase 4 - EXTRAS (Week 4+)
13. Additional characters
14. Animated backgrounds
15. Special effects textures
16. Seasonal variants

---

## SECTION 8: TECHNICAL REQUIREMENTS

### 3D Models
- **Format:** GLB (GLTF Binary)
- **Compression:** Draco for files > 1MB
- **Origin:** Centered, Y-up
- **Scale:** 1 unit = 1 meter
- **Materials:** PBR (metallic/roughness workflow)

### Animations
- **FPS:** 30fps baked keyframes
- **Naming:** lowercase_with_underscores
- **Root Motion:** None (handled in code)
- **Blending:** Ensure smooth transitions

### Textures
- **Format:** PNG
- **Sizes:** Power of 2 (512, 1024, 2048)
- **Compression:** TinyPNG before delivery

### Audio
- **Format:** MP3 (128-192kbps)
- **Normalization:** -3dB peak
- **Trim:** No silence padding

---

## SECTION 9: FILE STRUCTURE

```
public/
├── models/
│   └── blitz-rush/
│       ├── player.glb          ⭐ CRITICAL
│       ├── defender.glb        ⭐ HIGH
│       ├── coin.glb            ⭐ CRITICAL
│       ├── powerup_magnet.glb
│       ├── powerup_shield.glb
│       ├── powerup_speed.glb
│       ├── powerup_2x.glb
│       ├── hurdle.glb
│       ├── high_bar.glb
│       ├── tackle_dummy.glb
│       ├── stadium_section.glb ⭐ HIGH
│       └── skins/
│           └── [character variants]
├── textures/
│   └── blitz-rush/
│       ├── field_turf.png      ⭐ CRITICAL
│       ├── field_lines.png     ⭐ CRITICAL
│       ├── endzone_home.png
│       ├── endzone_away.png
│       └── field_worn.png
├── sounds/
│   └── blitz-rush/
│       ├── footstep_turf_01.mp3
│       ├── coin_collect.mp3    ⭐ CRITICAL
│       ├── touchdown.mp3       ⭐ CRITICAL
│       ├── crowd_idle.mp3      ⭐ HIGH
│       └── [all other sounds]
└── images/
    └── blitz-rush/
        ├── icons/
        └── backgrounds/
```

---

## SECTION 10: SUCCESS CRITERIA

The assets are successful when:

1. **Player Character**
   - Instantly recognizable silhouette
   - Animations feel responsive and satisfying
   - Helmet catches light beautifully

2. **Stadium**
   - Feels like a REAL night game
   - Crowd creates atmosphere without distraction
   - Lighting is dramatic and cinematic

3. **Audio**
   - Sounds like being in the stadium
   - Every action has satisfying feedback
   - Touchdown moment gives chills

4. **Overall**
   - Screenshots look like a premium game
   - First-time players say "wow"
   - Feels like Monday Night Football

---

## Questions?

Create `ANTIGRAVITY_QUESTIONS.md` or message directly.

**Let's make Blitz Rush the best football runner on mobile.**

---

*Kickoff Club HQ - Learn Football, Have Fun*
