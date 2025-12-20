# Blitz Rush Visual Asset Brief
## For Antigravity Design Team

---

## Overview

**Game:** Blitz Rush - Endless runner football game
**Platform:** Web (desktop + mobile)
**Engine:** Three.js (3D) / HTML Canvas
**Style:** Fun, inviting, mascot-like characters. Think Subway Surfers meets NFL.

---

## Creative Direction

### Mood & Feel
- **FUN FIRST** - Every element should make players smile
- **Inviting** - Characters should feel like friends, not athletes
- **Bouncy & Energetic** - Everything has life and personality
- **Colorful & Bold** - Vibrant colors that pop on mobile screens

### Style References
- Subway Surfers (character proportions, smooth animations)
- Stumble Guys (goofy, lovable, simple shapes)
- Fall Guys (expressive, bean-like characters)
- Crossy Road (charming, voxel-inspired simplicity)

### What We're NOT Going For
- Realistic football players
- Intimidating or aggressive looks
- Complex, detailed models
- Dark or gritty aesthetics

---

## Priority 1: Player Character (MASCOT)

### Design Requirements
- **Chibi/Cartoon Proportions**: Big head (40% of body), small body
- **Large Expressive Eyes**: Should convey emotion (happy while running, determined, excited)
- **Rounded, Chunky Shapes**: Friendly silhouette, no sharp edges
- **Football Gear**: Helmet, jersey, but stylized and cute
- **Color Variants**: 10 color schemes (see below)

### Character Color Variants
| Name | Primary Color | Helmet | Price |
|------|---------------|--------|-------|
| BLAZE | Orange #f97316 | Dark Orange #ea580c | Free |
| FROST | Blue #3b82f6 | Dark Blue #1d4ed8 | 50 coins |
| FURY | Red #dc2626 | Dark Red #991b1b | 100 coins |
| TITAN | Green #22c55e | Dark Green #15803d | 150 coins |
| STORM | Purple #a78bfa | Dark Purple #7c3aed | 200 coins |
| LEGEND | Gold #fbbf24 | Dark Gold #d97706 | 300 coins |
| PHANTOM | Silver #c0c0c0 | Gray #94a3b8 | 500 coins |
| SHADOW | Charcoal #1f2937 | Black #111827 | 500 coins |
| NOVA | Pink #ec4899 | Dark Pink #db2777 | 500 coins |
| BOLT | Cyan #06b6d4 | Dark Cyan #0891b2 | 500 coins |

### Required Animations (Sprite Sheet or 3D)
1. **Run Cycle** - Bouncy, energetic, arms pumping (loop, ~8-12 frames)
2. **Jump** - Anticipation squash, stretch in air, land squash
3. **Slide** - Low crouch, arms back, determined face
4. **Lane Switch** - Quick lean left/right with recovery
5. **Hit/Stumble** - Dizzy stars, recovers quickly
6. **Celebration/Touchdown** - Victory dance, fist pump, jump for joy
7. **Idle** - Slight bounce, looking around, ready stance

### Deliverables
- [ ] Character design sheet (front, side, 3/4 view)
- [ ] Sprite sheets for each animation OR 3D model with rigged animations
- [ ] All 10 color variants
- [ ] Preview icons for character select screen (128x128px)

---

## Priority 2: Collectibles & Power-ups

### Coin
- **Style**: Chunky 3D gold coin with football logo
- **Animation**: Spinning, slight float/bob
- **Size**: Easy to see and satisfying to collect
- **Particle**: Sparkle burst on collection

### Power-ups (Floating orbs/pickups)

| Power-up | Color | Icon Inside | Effect |
|----------|-------|-------------|--------|
| Magnet | Pink/Magenta | Horseshoe magnet | Attracts coins |
| Shield | Blue | Shield/bubble | Protects from 1 hit |
| Speed Boost | Green | Lightning bolt | Temporary speed up |
| 2x Coins | Gold | "x2" text | Double coin value |

### Deliverables
- [ ] Coin design + spin animation
- [ ] 4 power-up orb designs
- [ ] Collection particle effects (sparkles, bursts)

---

## Priority 3: Obstacles

### Defender (Dodge Left/Right)
- **Style**: Cartoon football defender, arms spread wide
- **Feel**: Goofy but blocky - an obstacle, not a villain
- **Animation**: Slight side-to-side sway, ready stance
- **Note**: Should be clearly readable as "go around me"

### Hurdle (Jump Over)
- **Style**: Simple orange/white striped barrier
- **Height**: Clearly "jump height"
- **Feel**: Classic track hurdle but chunky

### Blocker (Bust Through with Coins)
- **Style**: Big lineman or blocking dummy
- **Feel**: Solid, but breakable - shows coin cost
- **Animation**: Slight wobble, shatter effect when busted

### Cone/Barrier (Slide Under)
- **Style**: Tall barrier or training equipment
- **Feel**: Obviously "slide under me"
- **Animation**: None needed, static obstacle

### Deliverables
- [ ] Defender design + idle animation
- [ ] Hurdle design (static)
- [ ] Blocker design + break animation
- [ ] Slide barrier design (static)

---

## Priority 4: Environment

### Football Field
- **Grass**: Vibrant green with alternating stripe pattern
- **Yard Lines**: Clean white lines every 10 yards
- **Numbers**: Large yard numbers (10, 20, 30... etc)
- **Sidelines**: White boundary lines

### End Zone
- **Style**: Celebratory! Painted end zone with team colors
- **Elements**: Goal post, "TOUCHDOWN" painted on ground
- **Feel**: The reward zone - should feel exciting to reach

### Background/Stadium (Optional - Lower Priority)
- Blurred crowd in stands
- Stadium lights creating atmosphere
- Simple sky gradient

### Deliverables
- [ ] Repeating grass/field texture tile
- [ ] Yard line and number assets
- [ ] End zone design
- [ ] Optional: Stadium background elements

---

## Priority 5: UI Elements

### Logo
- "BLITZ RUSH" title treatment
- Bold, sporty, but fun (not aggressive)
- Works on dark backgrounds

### Celebration Graphics
- "TOUCHDOWN!" explosion text (already have SVG, may need refresh)
- "JUKED!" text for dodging defenders
- "NEW HIGH SCORE!" celebration

### HUD Elements
- Coin counter icon
- Score display styling
- Progress bar (yards to go)
- Power-up timer indicators

### Menu/Buttons
- Play button
- Easy/Hard mode selector
- Character select cards

### Deliverables
- [ ] Logo design (SVG + PNG)
- [ ] Celebration text graphics
- [ ] HUD icon set
- [ ] Button/UI kit

---

## Technical Specifications

### File Formats
- **Sprites**: PNG with transparency (2x for retina)
- **Vectors**: SVG for scalable UI elements
- **3D Models**: GLTF/GLB format (if going 3D route)
- **Textures**: PNG, power-of-2 dimensions (512x512, 1024x1024)

### Animation Specs
- **Frame Rate**: 12-24 FPS for sprite animations
- **Sprite Sheets**: Horizontal strip format preferred
- **Looping**: Seamless loops for run cycle, idle

### Color Space
- sRGB for all assets
- Test on both light and dark backgrounds

---

## Inspiration Board

Create assets that would fit alongside:
- Subway Surfers characters
- Crossy Road animals
- Among Us crewmates
- Fall Guys beans

The player should look at our character and think: "That little guy is adorable, I want to help him score!"

---

## Questions for Antigravity

1. **2D Sprites vs 3D Models?** - What's your recommendation for web performance + visual quality?
2. **Animation Complexity** - How many frames per animation is realistic?
3. **Timeline** - What's achievable in [X timeframe]?
4. **Character Customization** - Should we plan for accessories (hats, trails, etc.) in the future?

---

## Contact

Project: Kickoff Club HQ
Game: Blitz Rush
URL: kickoffclubhq.com/games/blitz-rush

---

*Let's make this game look as fun as it plays!*
