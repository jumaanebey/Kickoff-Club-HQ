# 🎨 Asset Creation Guide for Antigravity

## Mission: Create Production-Ready Visual & Audio Assets

This guide provides detailed specifications for creating all visual and audio assets needed for the mobile app. Each asset has exact dimensions, color specifications, and export requirements.

---

## 🖼️ Image Assets Priority List

### Priority 1: Building Images (3D Isometric Style)

**Location:** `/mobile-app/assets/images/buildings/`

Create 3D-style building illustrations for each building type at 3 upgrade levels.

#### Building Types & Level Progression:

**1. Film Room (Study/Learning Building)**
- **Level 1** (`film-room-1.png`) - Small screening room
  - Single projector screen
  - 2-3 theater seats
  - Film reels scattered around
  - Warm lighting (amber/orange glow)
  - Dimensions: 512x512px

- **Level 2** (`film-room-2.png`) - Professional theater
  - Larger curved screen
  - 10+ tiered seats
  - Professional sound system speakers
  - Better lighting fixtures
  - Trophy cabinet in corner
  - Dimensions: 512x512px

- **Level 3** (`film-room-3.png`) - IMAX-style cinema
  - Massive wraparound screen
  - 30+ luxury recliners
  - Dolby Atmos speaker array
  - VIP section
  - Awards wall with golden trophies
  - Premium finishes (wood paneling, carpet)
  - Dimensions: 512x512px

**2. Practice Field (Training Ground)**
- **Level 1** (`practice-field-1.png`) - Basic grass field
  - Simple grass rectangle
  - Basic yard line markers
  - 2 orange cones
  - Single wooden bench
  - Basic goal posts
  - Dimensions: 512x512px

- **Level 2** (`practice-field-2.png`) - Semi-pro facility
  - Lined field with hash marks
  - Multiple drill stations (cones, sleds, dummies)
  - Metal bleachers (3 rows)
  - Coach tower
  - Better goal posts (NFL style)
  - Water station
  - Dimensions: 512x512px

- **Level 3** (`practice-field-3.png`) - Elite training complex
  - Perfect turf with detailed markings
  - Full drill circuit setup
  - Covered bleachers (10+ rows)
  - Electronic scoreboard
  - Professional lighting towers
  - Equipment shed
  - Medical tent
  - Dimensions: 512x512px

**3. Stadium (Main Building)**
- **Level 1** (`stadium-1.png`) - Small community stadium
  - 500-seat capacity
  - Basic stands on one side
  - Simple scoreboard
  - Chain-link fence
  - Field with minimal features
  - Dimensions: 512x512px

- **Level 2** (`stadium-2.png`) - College stadium
  - 10,000-seat capacity
  - Stands on both sides
  - Press box
  - Electronic scoreboard with video
  - Concession stands visible
  - Parking lot
  - Stadium lights (4 towers)
  - Dimensions: 512x512px

- **Level 3** (`stadium-3.png`) - NFL-style stadium
  - 60,000+ seat capacity
  - Full bowl design
  - Massive video boards (4 corners)
  - Luxury suites
  - Retractable roof (half-open)
  - Surrounding plazas
  - Dramatic lighting
  - Team banners/flags
  - Dimensions: 512x512px

#### Style Guidelines for Buildings:

**Visual Style:**
- **Isometric 3D perspective** (45-degree angle, looking down)
- **Cartoony but detailed** - Think Clash of Clans / Hay Day style
- **Vibrant colors** - Use theme colors from `theme.ts`
  - Film Room: Blues and purples (#4A90E2, #7B68EE)
  - Practice Field: Greens and browns (#2ECC71, #8B4513)
  - Stadium: Reds and golds (#E74C3C, #FFD700)
- **Soft shadows** underneath buildings
- **Rim lighting** to make buildings pop
- **Glossy highlights** on modern surfaces (glass, metal)
- **Warm ambient lighting** (golden hour feel)

**Technical Specs:**
- Format: PNG with transparency
- Dimensions: 512x512px artboard (building centered, 400x400px actual)
- DPI: 144 (2x for retina displays)
- Color space: sRGB
- Compression: Medium (file size < 150KB per image)
- No text in images (we'll add level numbers programmatically)

**Animation Preparation:**
Each building should have:
- Clean background separation (for parallax effects)
- Organized layers if possible (base, walls, roof, details)
- Glow-ready highlights (we'll add pulsing glows in code)

---

### Priority 2: Resource Icons (High-Res)

**Location:** `/mobile-app/assets/images/resources/`

Create crisp, shiny icons for in-game currencies and resources.

**Required Icons:**

1. **Coin** (`coin.png`)
   - Classic golden coin
   - Slight 3D depth (see the edge)
   - Shiny metallic finish
   - Highlights on top-left
   - Shadow on bottom-right
   - Optional: Dollar sign or football emblem
   - Size: 256x256px
   - Export at 2x (512x512px actual)

2. **Knowledge Point** (`kp.png`)
   - Brain with sparkles around it
   - OR: Lightbulb glowing
   - OR: Graduation cap with stars
   - Color: Purple/blue gradient (#7B68EE → #4A90E2)
   - Glowing effect
   - Size: 256x256px
   - Export at 2x (512x512px actual)

3. **Energy Bolt** (`energy.png`)
   - Lightning bolt
   - Electric yellow/orange (#FFD700, #FFA500)
   - Glow effect around it
   - Crackling energy particles
   - Size: 256x256px
   - Export at 2x (512x512px actual)

4. **Trophy** (`trophy.png`)
   - Classic championship trophy
   - Gold with shiny highlights
   - Football on top
   - Base with engraving space
   - Size: 256x256px
   - Export at 2x (512x512px actual)

5. **Star** (`star.png`)
   - Five-pointed star
   - Golden yellow with glow
   - Used for ratings/achievements
   - Size: 256x256px
   - Export at 2x (512x512px actual)

**Style Guidelines:**
- Vibrant, saturated colors
- Strong highlights (top-left)
- Soft shadows (bottom-right)
- Slight 3D depth (not flat)
- Glow/shine effects
- Transparent background

---

### Priority 3: Achievement Badges (Rarity System)

**Location:** `/mobile-app/assets/images/achievements/`

Create badge frames for achievements with 4 rarity levels.

**Rarity Tiers:**

1. **Common Badge** (`badge-common.png`)
   - Silver/gray metallic frame
   - Simple circular border
   - Subtle shine
   - Size: 400x400px
   - Center: 300x300px transparent area (for icon)

2. **Rare Badge** (`badge-rare.png`)
   - Purple metallic frame
   - Ornate circular border with details
   - Pulsing purple glow
   - Small stars around edge
   - Size: 400x400px
   - Center: 300x300px transparent area

3. **Epic Badge** (`badge-epic.png`)
   - Gold metallic frame
   - Elaborate border with rays
   - Bright golden glow
   - Animated sparkles (we'll add in code)
   - Size: 400x400px
   - Center: 300x300px transparent area

4. **Legendary Badge** (`badge-legendary.png`)
   - Rainbow/prismatic frame
   - Extremely ornate border
   - Multi-color glow effect
   - Rays shooting out
   - Crown or wings decoration
   - Size: 400x400px
   - Center: 300x300px transparent area

**Color References:**
- Common: #C0C0C0 (Silver)
- Rare: #9333EA (Purple)
- Epic: #FFD700 (Gold)
- Legendary: Rainbow gradient (#FF0080 → #7928CA → #FFD700)

---

### Priority 4: UI Elements

**Location:** `/mobile-app/assets/images/ui/`

**Required Elements:**

1. **Button Shine** (`button-shine.png`)
   - White-to-transparent gradient
   - Horizontal streak
   - For animated shine effect across buttons
   - Size: 200x100px

2. **Particle Star** (`particle-star.png`)
   - Small 4-point star
   - White/yellow glow
   - Used in particle systems
   - Size: 64x64px

3. **Particle Sparkle** (`particle-sparkle.png`)
   - Cross/plus shape with glow
   - White with rainbow rim
   - Size: 64x64px

4. **Confetti Pieces** (6 files: `confetti-1.png` to `confetti-6.png`)
   - Small rectangular strips
   - Different colors (red, blue, green, yellow, purple, orange)
   - Slight 3D curl
   - Size: 32x64px each

5. **Progress Bar Fill** (`progress-fill.png`)
   - Horizontal gradient (left to right)
   - Colors: #2ECC71 → #27AE60
   - With highlights
   - Size: 400x40px
   - 9-slice ready (stretchable)

---

## 🎵 Audio Assets Specifications

### Priority 1: Core Sound Effects

**Location:** `/mobile-app/assets/sounds/`

If you can create actual audio files, here are the specs. If not, these detailed descriptions will help a sound designer.

**Required Sounds:**

1. **collect_coin.mp3**
   - **Duration:** 250ms
   - **Description:** Bright, pleasant chime when collecting coins
   - **Frequency:** Start at 800Hz, glide up to 1200Hz
   - **Waveform:** Sine wave with slight bell harmonic
   - **Envelope:**
     - Attack: 10ms
     - Sustain: 150ms
     - Release: 90ms
   - **Effects:**
     - Light reverb (room size, 15% wet)
     - Slight pitch variation (+/- 2 cents for randomness)
   - **Reference:** Mario coin sound but more modern/refined

2. **upgrade_complete.mp3**
   - **Duration:** 1200ms
   - **Description:** Triumphant fanfare for completed upgrades
   - **Melody:** Three ascending notes (C5 → E5 → G5)
   - **Instrumentation:**
     - Layer 1: Bright brass/synth lead
     - Layer 2: Sparkle layer (high-freq bells)
     - Layer 3: Bass hit at start (C2)
   - **Envelope:**
     - Attack: 50ms
     - Sustain: 800ms
     - Release: 350ms
   - **Effects:**
     - Medium hall reverb
     - Stereo widening
     - Compression for punch
   - **Reference:** Zelda treasure chest opening

3. **level_up.mp3** ⭐ **NEW**
   - **Duration:** 2000ms
   - **Description:** Epic celebration for player level up
   - **Structure:**
     - 0-200ms: Orchestral hit (all frequencies)
     - 200-1200ms: Rising swell (strings + choir)
     - 1200-2000ms: Sparkle tail (bells cascading down)
   - **Frequencies:** Full spectrum (80Hz bass to 8kHz sparkle)
   - **Dynamics:** Start at -6dB, swell to 0dB, decay to -12dB
   - **Effects:**
     - Large hall reverb (cathedral preset)
     - Chorus on the swell
     - Stereo spread (90% width)
   - **Reference:** Final Fantasy level up fanfare

4. **achievement_unlock.mp3** ⭐ **NEW**
   - **Duration:** 1500ms
   - **Description:** Magical unlock sound for achievements
   - **Structure:**
     - Bell tree cascade (8 notes descending)
     - Frequencies: 2000Hz → 1500Hz → 1200Hz → 1000Hz → 800Hz → 600Hz → 450Hz → 300Hz
     - Timing: 150ms between each note
   - **Layer 2:** Subtle "unlock" mechanism click (100Hz, 50ms)
   - **Effects:**
     - Long reverb tail (3 seconds)
     - Stereo spread (notes pan left to right)
     - Shimmer reverb
   - **Reference:** Hearthstone card unlock

5. **energy_refill.mp3** ⭐ **NEW**
   - **Duration:** 600ms
   - **Description:** Electric charging sound
   - **Structure:**
     - 3 pulses (200ms each)
     - Rising frequency sweep: 300Hz → 1500Hz on each pulse
   - **Waveform:** Saw wave with filter sweep
   - **Modulation:** LFO at 12Hz for electric crackle
   - **Effects:**
     - Phaser (slow sweep)
     - Slight distortion (5%)
     - Stereo flanger
   - **Reference:** Mega Man energy refill

6. **error.mp3**
   - **Duration:** 400ms
   - **Description:** "Denied" or "Can't do that" sound
   - **Frequency:** Descending buzz (600Hz → 200Hz)
   - **Waveform:** Square wave (harsh tone)
   - **Envelope:**
     - Attack: 20ms
     - Sustain: 280ms
     - Release: 100ms
   - **Effects:**
     - Slight distortion (10%)
     - No reverb (dry)
   - **Reference:** Negative beep from ATMs

**Technical Specs (All Sounds):**
- **Format:** MP3, 192kbps CBR
- **Sample Rate:** 44.1kHz
- **Bit Depth:** 16-bit (before MP3 encoding)
- **Channels:** Stereo (mono acceptable for short SFX)
- **Normalization:** Peak at -3dB (leave headroom)
- **File Size:** Target < 50KB each
- **Fade Out:** All sounds end with 50ms fade to prevent clicks

**Delivery:**
If you can't create actual audio, provide:
1. This specifications document
2. Reference links to similar sounds (YouTube, Freesound.org)
3. Note any tools you'd need (DAW, synth plugins)

---

### Priority 2: Ambient Sounds (Lower Priority)

**Optional atmospheric loops:**

1. **stadium_ambience.mp3** (looping)
   - Crowd murmur
   - Occasional cheers
   - Duration: 30 seconds loop
   - Volume: -20dB (background)

2. **menu_music.mp3** (looping)
   - Calm, motivational background music
   - 60-90 BPM
   - Instruments: Piano, strings, light percussion
   - Duration: 60 seconds loop
   - Volume: -24dB (very subtle)

---

## 📐 Export Settings Summary

### For PNG Images:
```
- Resolution: As specified (usually 512x512px or 256x256px)
- Format: PNG-24 (with alpha transparency)
- Color Space: sRGB
- Compression: Medium (Balance quality vs file size)
- Target: < 150KB per building image, < 50KB per icon
```

### For Audio Files:
```
- Format: MP3
- Bitrate: 192 kbps CBR (Constant Bit Rate)
- Sample Rate: 44.1 kHz
- Channels: Stereo (mono for short SFX okay)
- Normalization: Peak at -3dB
- Fade Out: 50ms on all sounds
- Target: < 50KB per sound effect
```

---

## 🎯 Delivery Checklist

When submitting assets, include:

### For Images:
- ✅ All files in correct folders (`/assets/images/buildings/`, etc.)
- ✅ Files named exactly as specified
- ✅ Transparency working correctly
- ✅ No text embedded in images
- ✅ Color spaces correct (sRGB)
- ✅ File sizes within limits

### For Audio:
- ✅ All files in `/assets/sounds/`
- ✅ Files named exactly as specified
- ✅ Proper fade-outs (no clicks/pops)
- ✅ Volume normalized
- ✅ File sizes within limits
- ✅ **OR** Detailed specifications if unable to create files

### Documentation:
- ✅ List of what you created vs specifications
- ✅ Any deviations from specs (with reasons)
- ✅ Notes on tools used
- ✅ Source files (PSD, AI, etc.) if available
- ✅ Any attribution needed (if using stock assets)

---

## 🛠️ Recommended Tools

### Image Creation:
- **Affinity Designer** (affordable, professional)
- **Adobe Illustrator** + **Photoshop** (industry standard)
- **Blender** (for 3D isometric renders)
- **Figma** (for UI elements)
- **GIMP** (free alternative)

### Audio Creation:
- **Audacity** (free, basic editing)
- **FL Studio** (beat making, sound design)
- **Ableton Live** (professional DAW)
- **Vital** (free synthesizer plugin)
- **Freesound.org** (royalty-free sound library)
- **BFXR** (simple game sound effect generator)

### Online Tools:
- **TinyPNG.com** (image compression)
- **CloudConvert.com** (audio format conversion)
- **Remove.bg** (background removal)

---

## 📝 Notes & Tips

### For Image Assets:
1. **Consistency is key** - All buildings should look like they're from the same game
2. **Save source files** - Keep your .PSD/.AI files for future edits
3. **Test at small sizes** - View at 100x100px to ensure details are visible
4. **Color contrast** - Make sure elements stand out even on bright backgrounds
5. **Avoid gradients in small icons** - They don't scale well

### For Audio Assets:
1. **Listen at multiple volumes** - Test at 20%, 50%, 100% device volume
2. **Check on mobile speaker** - Don't just test with headphones
3. **Avoid harsh high frequencies** - Mobile speakers can make them piercing
4. **Layer sounds** - Combine simple waveforms for richer effects
5. **Reference professional games** - Study sound design from top mobile games

### General:
- **Ask questions** - If any spec is unclear, ask before creating
- **Iterate** - First pass doesn't have to be perfect
- **Share WIP** - Show progress so we can provide feedback early
- **Have fun** - Let your creativity shine within the guidelines!

---

## 🚀 Integration

Once you deliver assets:
1. Commit all files to the repo
2. I'll integrate them into the app
3. We'll test together in Expo Go
4. Iterate based on feedback

All assets will be loaded and displayed programmatically - you focus on making them look amazing! 🎨

---

## Priority Order for Creation

**Week 1 (High Impact):**
1. Film Room buildings (all 3 levels)
2. Practice Field buildings (all 3 levels)
3. Stadium buildings (all 3 levels)
4. Resource icons (coin, KP, energy)

**Week 2 (Polish):**
5. Achievement badges (all 4 rarities)
6. UI elements (particles, confetti)
7. Progress bar fills

**Week 3 (Audio):**
8. Core sound effects (6 sounds)
9. Optional: Ambient sounds

**Total Estimated Assets:**
- Images: 25+ files
- Audio: 6-8 files
- All production-ready for mobile deployment

Let's make this app look and sound absolutely premium! 🚀
