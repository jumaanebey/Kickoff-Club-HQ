# SUPER PROMPT: Football Club HQ - Complete Asset Generation

## PROJECT OVERVIEW

You are creating ALL visual assets, textures, objects, and images for **Kickoff Club HQ** - a premium mobile football (American football) club management simulation game for iOS/Android built in React Native.

**Game Style**: Premium mobile simulation combining Farmville's progression mechanics + Top Eleven's football authenticity + Clash of Clans' visual polish

**Target Quality**: AAA mobile game assets that compete with EA Sports, Supercell, and Zynga titles

**Platform**: React Native mobile app (iOS/Android)
- Screen sizes: iPhone 13-15 Pro (390x844 to 430x932), Android flagships
- Assets must be crisp on retina displays (@2x, @3x)

---

## CRITICAL REQUIREMENTS

### Technical Specifications
- **Format**: PNG with transparency (alpha channel) for all game objects
- **Resolution**: Provide @2x (standard) and @3x (retina) versions
- **Color Mode**: RGB, 8-bit per channel
- **Size Guidelines**:
  - Icons: 64x64px to 128x128px (@2x base)
  - Unit Cards: 400x500px (@2x base)
  - Buildings: 512x512px to 1024x1024px (@2x base)
  - Backgrounds: 1290x2796px (@3x iPhone 15 Pro Max)
  - UI Elements: Varies by component

### Visual Style Guidelines
- **Art Direction**: Modern, premium 2.5D isometric style
- **Color Palette**:
  - Primary Orange: #FF6A00 (brand color)
  - Primary Green: #1F6A3E (success, field)
  - Red: #C41E3A (defense, alerts)
  - Navy: #13274F (secondary)
  - Gold: #FFB81C (rewards, special)
- **Lighting**: Soft ambient with subtle shadows (15-20% opacity)
- **Details**: High detail but optimized for mobile viewing
- **Football Authenticity**: Must look like real NFL/college football, not generic sports

---

## ASSET CATEGORIES & REQUIREMENTS

## 1. TRAINING UNIT VISUALS

Create premium character art for 5 position groups. These are the CORE game assets.

### 1.1 Offensive Line Unit
**Concept**: 3-5 massive linemen in formation, powerful stance
**Color Scheme**: Orange (#FF6A00) jerseys, white pants
**Composition**: Isometric view showing:
- Center snapping ball
- Guards in 3-point stance
- Tackles protecting edge
**Props**: Helmet with facemask, shoulder pads, football
**Background**: Subtle field turf texture
**Mood**: Powerful, immovable, dominant
**File Names**:
- `unit-offensive-line-idle@2x.png` (default state)
- `unit-offensive-line-training@2x.png` (animated sparkles/sweat)
- `unit-offensive-line-ready@2x.png` (glowing, pumped up)

### 1.2 Skill Positions Unit
**Concept**: QB, RB, WR, TE in dynamic action poses
**Color Scheme**: Green (#1F6A3E) jerseys, white pants
**Composition**:
- QB in throwing motion (center)
- RB cutting with ball (left)
- WR reaching for catch (right)
- TE blocking (background)
**Props**: Football in motion, route markers
**Background**: Field hash marks
**Mood**: Speed, agility, explosiveness
**File Names**: Same pattern as Offensive Line

### 1.3 Defensive Line Unit
**Concept**: 4 D-linemen in aggressive pass rush
**Color Scheme**: Red (#C41E3A) jerseys, white pants
**Composition**:
- DEs speed rushing edge
- DTs bull rushing interior
- All leaning forward, explosive
**Props**: Helmets with dark visors, arm bands
**Background**: Turf with cleat marks
**Mood**: Aggressive, intimidating, relentless
**File Names**: Same pattern as Offensive Line

### 1.4 Secondary Unit
**Concept**: DBs in coverage - corners and safeties
**Color Scheme**: Navy (#13274F) jerseys, silver pants
**Composition**:
- Corners in press coverage stance
- Safety reading QB (center, elevated)
- Backpedaling technique
**Props**: Gloves, headbands, football incoming
**Background**: End zone perspective
**Mood**: Alert, intelligent, lock-down defense
**File Names**: Same pattern as Offensive Line

### 1.5 Special Teams Unit
**Concept**: Kicker, punter, returner in action
**Color Scheme**: Gold (#FFB81C) jerseys, white pants
**Composition**:
- Kicker mid-swing (center)
- Holder catching snap (ground)
- Football spiraling toward uprights
**Props**: Tee, football, uprights in background
**Background**: Stadium with goal posts
**Mood**: Precision, clutch, game-changing
**File Names**: Same pattern as Offensive Line

---

## 2. BUILDING ASSETS

Create isometric building sprites for the HQ overview screen.

### 2.1 Practice Field Building
**Concept**: Outdoor football practice field with equipment
**Levels**: Create 5 upgrade levels (Level 1 = basic, Level 5 = elite)
**Level 1**:
- Single field with basic sideline markers
- Small equipment shed
- Chain-link fence
**Level 5**:
- Multi-field complex
- Professional equipment building
- Stadium seating, lights
**Size**: 512x512px @2x
**Perspective**: 30° isometric
**File Names**: `building-practice-field-level-1@2x.png` through `building-practice-field-level-5@2x.png`

### 2.2 Film Room Building
**Concept**: Building where coaches analyze game footage
**Levels**: 5 upgrade levels
**Level 1**:
- Small trailer with projector
- Folding chairs
**Level 5**:
- Modern theater with multiple screens
- Comfortable seating
- Server racks
**Size**: 512x512px @2x
**File Names**: `building-film-room-level-1@2x.png` through level 5

### 2.3 Weight Room Building
**Concept**: Strength and conditioning facility
**Levels**: 5 upgrade levels
**Level 1**:
- Garage gym with basic weights
- Squat rack, bench
**Level 5**:
- State-of-the-art facility
- Olympic platforms, turf area
- Recovery equipment
**Size**: 512x512px @2x
**File Names**: `building-weight-room-level-1@2x.png` through level 5

### 2.4 Stadium Building
**Concept**: Main stadium for matches
**Levels**: 5 upgrade levels
**Level 1**:
- High school bleachers
- Basic press box
**Level 5**:
- NFL-caliber stadium
- Luxury suites, jumbotron
- Full lighting rig
**Size**: 1024x1024px @2x (larger, focal point)
**File Names**: `building-stadium-level-1@2x.png` through level 5

### 2.5 Headquarters Building
**Concept**: Main office/coach building
**Levels**: 5 upgrade levels
**Level 1**:
- Mobile trailer
- Small parking lot
**Level 5**:
- Multi-story facility
- Glass windows, modern architecture
**Size**: 512x512px @2x
**File Names**: `building-headquarters-level-1@2x.png` through level 5

---

## 3. UI ICONS & ELEMENTS

### 3.1 Resource Icons
Create clean, readable icons for in-game currencies and resources.

**Required Icons** (128x128px @2x):
- `icon-coins@2x.png` - Gold coin stack with dollar sign
- `icon-knowledge-points@2x.png` - Brain with football laces, glowing
- `icon-energy@2x.png` - Lightning bolt, electric blue
- `icon-xp@2x.png` - Star burst with upward arrow
- `icon-level@2x.png` - Shield with number

**Style**:
- Flat design with subtle gradient
- White stroke outline (2px) for visibility on any background
- Drop shadow (4px blur, 30% opacity)

### 3.2 Action Button Icons
Icons for various in-game actions (64x64px @2x):

- `icon-train@2x.png` - Whistle
- `icon-upgrade@2x.png` - Upward arrow with wrench
- `icon-play-match@2x.png` - Play button with football
- `icon-collect@2x.png` - Hand collecting coins
- `icon-speed-up@2x.png` - Fast-forward with clock
- `icon-info@2x.png` - Information (i) button
- `icon-settings@2x.png` - Gear icon
- `icon-leaderboard@2x.png` - Trophy with rankings
- `icon-shop@2x.png` - Shopping bag with football
- `icon-season@2x.png` - Calendar with football

### 3.3 Status Indicators
Small icons showing training/building states (48x48px @2x):

- `status-training@2x.png` - Animated dots or spinner
- `status-ready@2x.png` - Green checkmark, glowing
- `status-locked@2x.png` - Padlock
- `status-complete@2x.png` - Gold star burst

---

## 4. BACKGROUND & ENVIRONMENT ASSETS

### 4.1 HQ Overview Background
**Concept**: Aerial view of football facility grounds
**Composition**:
- Natural grass field texture
- Parking lot sections
- Concrete walkways
- Stadium lights in distance
- Subtle cloud shadows
**Size**: 1290x2796px @3x (full screen, scrollable)
**Style**: Semi-realistic, painterly
**File Name**: `background-hq-overview@3x.png`

### 4.2 Practice Field Background
**Concept**: On-field perspective during practice
**Composition**:
- Field turf close-up
- Yard line markers
- Sideline with equipment
- Sky with stadium lights
**Size**: 1290x2796px @3x
**File Name**: `background-practice-field@3x.png`

### 4.3 Match Day Background
**Concept**: Stadium game day atmosphere
**Composition**:
- Field from sideline view
- Packed stands (blurred)
- Scoreboard visible
- Dramatic stadium lighting
- Day and night versions
**Size**: 1290x2796px @3x
**File Names**:
- `background-match-day@3x.png`
- `background-match-night@3x.png`

### 4.4 Menu Background
**Concept**: Locker room or coach's office
**Composition**:
- Lockers with jerseys
- Whiteboard with plays
- Trophies on shelf
- Soft depth of field blur
**Size**: 1290x2796px @3x
**File Name**: `background-menu@3x.png`

---

## 5. PARTICLE EFFECTS & ANIMATIONS

Create sprite sheets for particle effects.

### 5.1 Training Complete Effect
**Concept**: Burst of energy when training finishes
**Frames**: 12 frames
**Size per frame**: 256x256px @2x
**Elements**: Sparkles, light rays, confetti
**File Name**: `particle-training-complete@2x.png` (sprite sheet)

### 5.2 Coin Collect Effect
**Concept**: Coins flying into UI counter
**Frames**: 8 frames
**Size per frame**: 128x128px @2x
**Elements**: Spinning coins, trail effect
**File Name**: `particle-coin-collect@2x.png`

### 5.3 Level Up Effect
**Concept**: Explosion of celebration
**Frames**: 16 frames
**Size per frame**: 512x512px @2x
**Elements**: Stars, ribbons, fireworks
**File Name**: `particle-level-up@2x.png`

### 5.4 Match Win Effect
**Concept**: Confetti and celebration
**Frames**: 20 frames
**Size per frame**: 512x512px @2x
**Elements**: Paper confetti, streamers, glitter
**File Name**: `particle-match-win@2x.png`

---

## 6. UI COMPONENTS & FRAMES

### 6.1 Card Frames
Decorative frames for unit cards and modals.

**Card Frame - Common** (400x500px @2x):
- Gray border with subtle gradient
- Corner decoration (football laces pattern)
- File: `frame-card-common@2x.png`

**Card Frame - Rare** (400x500px @2x):
- Blue border with glow
- Animated shimmer overlay
- File: `frame-card-rare@2x.png`

**Card Frame - Epic** (400x500px @2x):
- Purple border with strong glow
- Particle effects on edges
- File: `frame-card-epic@2x.png`

**Card Frame - Legendary** (400x500px @2x):
- Gold border with rainbow shimmer
- Animated light beams
- File: `frame-card-legendary@2x.png`

### 6.2 Button Variations
Standard game buttons in multiple states.

**Primary Button** (300x80px @2x):
- Default state: Orange gradient
- Pressed state: Darker orange
- Disabled state: Gray
- Files: `button-primary-default@2x.png`, `button-primary-pressed@2x.png`, `button-primary-disabled@2x.png`

**Secondary Button** (300x80px @2x):
- Default: Green gradient
- Files: Same naming pattern

**Danger Button** (300x80px @2x):
- Default: Red gradient
- Files: Same naming pattern

### 6.3 Progress Bars
Progress bar components with fill states.

**Energy Bar**:
- Empty container: `progressbar-energy-empty@2x.png` (400x40px)
- Fill: `progressbar-energy-fill@2x.png` (horizontal slice)
- Cap: `progressbar-energy-cap@2x.png` (end decorations)

**Readiness Bar**:
- Same pattern as energy bar
- Green color scheme

**XP Bar**:
- Same pattern
- Gold color scheme

---

## 7. MATCH SIMULATION ASSETS

### 7.1 Team Formations
Tactical view showing player positions.

**Formation - Offensive** (800x600px @2x):
- 11 player markers (circles with numbers)
- Lines showing routes
- Ball position
- File: `formation-offensive-[formation-name]@2x.png`
- Create: I-Formation, Shotgun, Spread, Trips

**Formation - Defensive** (800x600px @2x):
- 11 defender markers
- Coverage zones shaded
- File: `formation-defensive-[formation-name]@2x.png`
- Create: 4-3, 3-4, Nickel, Dime

### 7.2 Play Result Animations
Simple illustrations for play outcomes.

- `play-result-touchdown@2x.png` - Player spiking ball
- `play-result-sack@2x.png` - QB tackled
- `play-result-interception@2x.png` - DB catching ball
- `play-result-fumble@2x.png` - Ball loose
- `play-result-field-goal@2x.png` - Ball through uprights
- `play-result-incomplete@2x.png` - Pass falling

Size: 512x512px @2x
Style: Dynamic action poses, comic book style

---

## 8. ONBOARDING & TUTORIAL ASSETS

### 8.1 Tutorial Coach Character
**Concept**: Friendly coach character who guides player
**Poses Needed**:
- `coach-welcome@2x.png` - Waving, welcoming
- `coach-pointing@2x.png` - Pointing at UI element
- `coach-explaining@2x.png` - Holding clipboard
- `coach-celebrating@2x.png` - Fist pump, excited
- `coach-thinking@2x.png` - Hand on chin

**Style**:
- Cartoon but realistic proportions
- Wearing team colors (orange polo, khakis)
- Whistle around neck
- Friendly, approachable face
- Size: 512x512px @2x

### 8.2 Tutorial Arrows & Pointers
Animated arrows pointing to UI elements:
- `tutorial-arrow-down@2x.png`
- `tutorial-arrow-up@2x.png`
- `tutorial-arrow-left@2x.png`
- `tutorial-arrow-right@2x.png`
- `tutorial-finger-tap@2x.png` - Finger tapping motion

Size: 128x128px @2x
Style: Bold, high contrast, subtle animation frames

---

## 9. SEASONAL & EVENT ASSETS

### 9.1 Season Badges
Icons representing different season phases.

- `season-offseason@2x.png` - Calendar, training equipment
- `season-preseason@2x.png` - Practice jersey
- `season-regular-season@2x.png` - Game ball, stadium
- `season-playoffs@2x.png` - Trophy silhouette
- `season-championship@2x.png` - Lombardi Trophy style

Size: 256x256px @2x
Style: Badge/emblem design with metallic finish

### 9.2 Weather Effects
Overlays for match conditions.

- `weather-rain@2x.png` - Rain streaks (full screen)
- `weather-snow@2x.png` - Falling snowflakes
- `weather-sunny@2x.png` - Sun rays, lens flare
- `weather-fog@2x.png` - Fog gradient overlay

Size: 1290x2796px @3x
Format: PNG with transparency (overlay blend)

---

## 10. SPECIAL EFFECTS & POLISH

### 10.1 Glow Effects
Reusable glow overlays for highlighting.

- `glow-orange@2x.png` - Soft orange glow (512x512px)
- `glow-green@2x.png` - Success glow
- `glow-blue@2x.png` - Information glow
- `glow-gold@2x.png` - Legendary glow
- `glow-red@2x.png` - Alert glow

Format: Radial gradient, transparent PNG

### 10.2 Shadow Overlays
Drop shadows for UI elements.

- `shadow-card@2x.png` - Soft shadow for cards
- `shadow-button@2x.png` - Button depth shadow
- `shadow-building@2x.png` - Isometric building shadow

Size: Match corresponding element + 20% margin
Opacity: 20-30% black

### 10.3 Sparkle Effects
Small decorative sparkles.

- `sparkle-small@2x.png` - 32x32px
- `sparkle-medium@2x.png` - 64x64px
- `sparkle-large@2x.png` - 128x128px

Style: 4-point star with glow
Animation: 4 frames (rotation sprite sheet)

---

## 11. LOADING & TRANSITION ASSETS

### 11.1 Loading Spinner
Branded loading animation.

**Concept**: Football spinning with team logo
**Frames**: 24 frames
**Size**: 256x256px @2x
**File**: `loading-spinner@2x.png` (sprite sheet)

### 11.2 Splash Screen
App launch screen.

**Composition**:
- Kickoff Club HQ logo (center)
- Stadium silhouette (background)
- Tagline: "Build Your Legacy"
**Size**: 1290x2796px @3x (iPhone 15 Pro Max)
**File**: `splash-screen@3x.png`

---

## 12. ACHIEVEMENT & BADGE ASSETS

Create 30+ achievement badges (128x128px @2x):

**Training Achievements**:
- `achievement-first-training@2x.png` - "First Practice"
- `achievement-100-training@2x.png` - "Gym Rat"
- `achievement-all-units-max@2x.png` - "Dream Team"

**Match Achievements**:
- `achievement-first-win@2x.png` - "First Victory"
- `achievement-undefeated-season@2x.png` - "Perfect Season"
- `achievement-championship@2x.png` - "Champion"

**Progression Achievements**:
- `achievement-level-10@2x.png` - "Rising Star"
- `achievement-level-50@2x.png` - "Veteran Coach"
- `achievement-max-level@2x.png` - "Legend"

Style: Circular badge with metallic border (bronze, silver, gold, platinum tiers)

---

## DELIVERY FORMAT

Please organize assets into the following folder structure:

```
kickoff-club-assets/
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
│   ├── resources/
│   ├── actions/
│   └── status/
├── backgrounds/
├── particles/
├── ui-components/
│   ├── buttons/
│   ├── frames/
│   └── progress-bars/
├── match-simulation/
│   ├── formations/
│   └── play-results/
├── tutorial/
├── seasonal/
├── effects/
└── achievements/
```

Each asset should include:
- @2x and @3x versions
- JSON metadata file with dimensions, description, usage notes
- Preview composite image showing all variations

---

## QUALITY CHECKLIST

Before delivering, verify each asset meets:

✅ **Technical**:
- [ ] Correct resolution (@2x and @3x)
- [ ] PNG format with transparency where needed
- [ ] Optimized file size (use TinyPNG or similar)
- [ ] No white/black halos around edges

✅ **Visual**:
- [ ] Matches brand colors exactly
- [ ] Football elements are authentic (not generic)
- [ ] Readable on both light and dark backgrounds
- [ ] Consistent lighting direction (top-left)
- [ ] Professional quality matching AAA mobile games

✅ **Consistency**:
- [ ] Art style consistent across all assets
- [ ] Shadow depth/opacity uniform
- [ ] Icon line weights match
- [ ] Color palette adhered to

---

## REFERENCE INSPIRATION

Study these games for quality benchmarks:
- **Clash of Clans** - Building isometric style, UI polish
- **Farmville 2** - Progression mechanics, warm aesthetic
- **Madden NFL Mobile** - Football authenticity
- **Top Eleven** - Sports management UI
- **Brawl Stars** - Character design, readability

---

## FINAL NOTES

This is a PREMIUM mobile game competing with EA and Supercell titles. Every asset should feel polished, professional, and worth paying for.

**Priority Order**:
1. Training Unit visuals (core gameplay)
2. UI icons and buttons (constant visibility)
3. Building assets (meta progression)
4. Backgrounds and environments
5. Particle effects and polish
6. Everything else

If you need to ask questions or need clarification on any asset, create a placeholder with a clear note of what information you need.

**Target Delivery**: Complete asset pack ready for React Native implementation with proper naming conventions and folder organization.

Generate all assets with the understanding that they will be viewed on mobile screens, need to load quickly, and must maintain visual clarity at small sizes while still looking impressive when featured prominently.

Let's create something players will love! 🏈🔥
