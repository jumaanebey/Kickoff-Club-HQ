# Blitz Rush 2.0 - Project Backlog

## Open Requests

### Visual Polish
- [x] ~~Sprites look basic/flat~~ → Replaced with 3D model request
- [ ] Add pulsing/glowing animation to coins and power-ups
- [ ] Add particle effects (dust when running, sparkles on collection)
- [ ] Stadium crowd could use parallax scrolling effect
- [ ] Add visual feedback when switching lanes (trail effect)
- [ ] Speed power-up needs unique asset (currently using shield fallback)

### Gameplay Feel
- [ ] Tune player animation speed (currently 10 FPS)
- [ ] Add sound effects (collect, tackle, powerup, touchdown)
- [ ] Add background music
- [ ] Screen shake on tackle
- [ ] Haptic feedback on mobile (if supported)

### UI/UX
- [ ] Add Antigravity's logo.png to start screen
- [ ] Show challenge level progress bar
- [ ] Add high score persistence (localStorage)
- [ ] Add tutorial/instructions overlay for first-time players
- [ ] Add pause button during gameplay

### Technical
- [ ] Preload all assets before showing start screen
- [ ] Add loading indicator
- [ ] Test on various mobile devices
- [ ] Optimize sprite sizes for performance

---

## In Progress

*Nothing currently in progress*

---

## Completed (Archive)

### December 24, 2025

#### v2.0.0 - Initial Release
- [x] Created clean codebase at `/public/games/blitz-rush-2/`
- [x] Minimalist UI design (white start screen, dark game over)
- [x] Subway Surfers-style swipe controls (20px threshold)
- [x] Stable camera (no motion sickness)
- [x] 3-lane endless runner mechanics
- [x] Obstacle spawning and collision detection
- [x] Coin collection system
- [x] Power-up system (Shield, Magnet, Double, Speed)
- [x] Endless mode
- [x] Challenge mode (10 levels: Pee Wee -> Super Bowl)
- [x] Keyboard controls (WASD/Arrows)

#### Asset Integration
- [x] Integrated Antigravity player sprites (run 1-4, jump, roll, tackled)
- [x] Integrated defender_lineman sprite
- [x] Integrated coin sprite
- [x] Integrated power-up sprites (shield, magnet, double)
- [x] Integrated field_texture with seamless tiling
- [x] Integrated stadium_crowd background
- [x] Player sprite animation (cycles through run frames)
- [x] State-based sprite switching (jump/roll/tackled)

### December 25, 2025

#### 3D Model Integration (v2.1.0)
- [x] Received 3D GLB models from Antigravity
  - player.glb (with idle, run, jump, roll, tackled animations)
  - defender_lineman.glb, defender_linebacker.glb, defender_safety.glb
  - coin.glb
  - powerup_shield.glb, powerup_magnet.glb, powerup_double.glb, powerup_speed.glb
- [x] Integrated GLTFLoader for 3D model loading
- [x] Fixed 8 critical animation/display bugs:
  1. Reduced lighting intensity (total ~2.7 from ~4.2)
  2. Fixed player model cloning with clone(true)
  3. Fixed animation clip cloning for cloned models
  4. Added proper model centering (feet on ground)
  5. Added animation mixer for defenders
  6. Added animation mixer for coins
  7. Added animation mixer for powerups
  8. Added mixer.update(dt) calls in game loop for all objects

---

## Changelog

### v2.1.0 (2025-12-25)
- Integrated Antigravity's 3D GLB models (player, defenders, coins, powerups)
- Added GLTFLoader for Three.js model loading
- Fixed model scaling/positioning with bounding box calculations
- Fixed animation system with proper mixer setup and clip cloning
- Reduced lighting intensity for better visual contrast
- All 3D objects now properly animated

### v2.0.0 (2025-12-24)
- Complete rebuild from scratch
- Replaced v1 due to accumulated bugs (overflow, motion sickness, control issues)
- Integrated Antigravity's isometric 3D sprite assets
- Dual game modes: Endless and Challenge
- Power-up system with 4 types
- Clean, minimalist UI

---

## Notes

**Original Blitz Rush v1**: `/public/games/blitz-rush/` (preserved, not modified)
**Blitz Rush 2.0**: `/public/games/blitz-rush-2/` (this version)
**Asset Creator**: Antigravity (Gemini AI)
**Asset Spec**: `/public/games/blitz-rush/ASSET_SPEC_FOR_ANTIGRAVITY.md`
