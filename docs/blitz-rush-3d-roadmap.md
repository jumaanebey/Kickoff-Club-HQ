# Blitz Rush 3D - Product Roadmap

## Epic 1: Core Gameplay
### Feature 1.1: Player Movement
- **Story 1.1.1**: As a player, I can switch lanes smoothly
  - [ ] Task: Lane switching animation (current: works)
  - [ ] Task: Reduce input latency
  - [ ] Task: Add swipe controls for mobile
- **Story 1.1.2**: As a player, I can jump over obstacles
  - [ ] Task: Jump physics (current: works)
  - [ ] Task: Double jump powerup
  - [ ] Task: Jump animation polish
- **Story 1.1.3**: As a player, I can slide under obstacles
  - [ ] Task: Slide mechanic
  - [ ] Task: Slide animation
  - [ ] Task: Low obstacle types

### Feature 1.2: Obstacles & Hazards
- **Story 1.2.1**: As a player, I encounter varied obstacles
  - [ ] Task: Defender obstacles (current: works)
  - [ ] Task: Hurdle obstacles (jump over)
  - [ ] Task: Low barriers (slide under)
  - [ ] Task: Moving defenders
- **Story 1.2.2**: As a player, I see warning indicators
  - [ ] Task: Warning circles (current: works)
  - [ ] Task: Audio cues for incoming obstacles

### Feature 1.3: Powerups
- **Story 1.3.1**: As a player, I can collect powerups
  - [ ] Task: Shield powerup (current: works)
  - [ ] Task: Speed boost (current: works)
  - [ ] Task: Magnet (current: works)
  - [ ] Task: Score multiplier (current: works)
  - [ ] Task: Powerup stacking (current: works)
- **Story 1.3.2**: As a player, speed boost makes me invincible
  - [ ] Task: Smash through defenders (current: works)
  - [ ] Task: Visual feedback for smashing

### Feature 1.4: Scoring & Progression
- **Story 1.4.1**: As a player, I earn points
  - [ ] Task: Distance-based scoring (current: works)
  - [ ] Task: Coin collection (current: works)
  - [ ] Task: Combo system (current: works)
  - [ ] Task: Fever mode (current: works)

---

## Epic 2: Visual Polish & Environment
### Feature 2.1: Stadium Environment
- **Story 2.1.1**: As a player, I see an immersive stadium
  - [ ] Task: Grass field with yard lines (current: works)
  - [ ] Task: Stadium walls with crowd (current: works)
  - [ ] Task: Stadium lights (current: works)
  - [ ] Task: Infinite track scrolling (current: fixed)
  - [ ] Task: Endzone visuals
- **Story 2.1.2**: As a player, I see dynamic lighting
  - [ ] Task: Day/night cycle
  - [ ] Task: Fever mode golden lighting (current: works)

### Feature 2.2: Character & Animations
- **Story 2.2.1**: As a player, my character looks like a football player
  - [ ] Task: Player model (current: basic)
  - [ ] Task: Running animation
  - [ ] Task: Jump animation
  - [ ] Task: Slide animation
  - [ ] Task: Hit/collision animation
- **Story 2.2.2**: As a player, I can unlock different skins
  - [ ] Task: Mascot skin
  - [ ] Task: Classic skin
  - [ ] Task: Skin selection UI

### Feature 2.3: Visual Effects
- **Story 2.3.1**: As a player, I see particle effects
  - [ ] Task: Dust particles when running (current: works)
  - [ ] Task: Coin collection sparkles
  - [ ] Task: Speed boost trail (current: works)
  - [ ] Task: Shield bubble effect (current: works)

---

## Epic 3: Audio & Sound
### Feature 3.1: Sound Effects
- **Story 3.1.1**: As a player, I hear game sounds
  - [ ] Task: Footstep sounds
  - [ ] Task: Jump sound
  - [ ] Task: Coin pickup sound
  - [ ] Task: Powerup pickup sound
  - [ ] Task: Collision sound
  - [ ] Task: Near miss sound

### Feature 3.2: Music
- **Story 3.2.1**: As a player, I hear background music
  - [ ] Task: Menu music
  - [ ] Task: Gameplay music
  - [ ] Task: Game over music
  - [ ] Task: Fever mode music change

### Feature 3.3: Audio Controls
- **Story 3.3.1**: As a player, I can control audio
  - [x] Task: Mute button on start screen
  - [x] Task: Mute button during gameplay
  - [x] Task: Start game muted by default
  - [ ] Task: Separate SFX/Music volume controls

---

## Epic 4: UI/UX
### Feature 4.1: Start Screen
- **Story 4.1.1**: As a player, I see an attractive start screen
  - [ ] Task: Game logo (current: works)
  - [ ] Task: Start button (current: works)
  - [ ] Task: High score display (current: works)
  - [ ] Task: How to play button (current: works)

### Feature 4.2: HUD
- **Story 4.2.1**: As a player, I see my progress during gameplay
  - [ ] Task: Score display (current: works)
  - [ ] Task: Coin counter (current: works)
  - [ ] Task: Distance meter (current: works)
  - [ ] Task: Active powerup indicator (current: works)
  - [ ] Task: Fever meter (current: works)
  - [ ] Task: Combo display (current: works)

### Feature 4.3: Game Over Screen
- **Story 4.3.1**: As a player, I see my results
  - [ ] Task: Final score (current: works)
  - [ ] Task: Coins collected (current: works)
  - [ ] Task: Distance traveled (current: works)
  - [ ] Task: New high score celebration
  - [ ] Task: Replay button (current: works)
  - [ ] Task: Share button (current: works)

---

## Epic 5: Performance Optimization
### Feature 5.1: Rendering Performance
- **Story 5.1.1**: As a player, the game runs smoothly
  - [ ] Task: Fix INP (Input to Next Paint) issues
  - [ ] Task: Optimize Three.js render loop
  - [ ] Task: Reduce draw calls
  - [ ] Task: Object pooling for obstacles
  - [ ] Task: LOD (Level of Detail) for distant objects

### Feature 5.2: Loading Performance
- **Story 5.2.1**: As a player, the game loads quickly
  - [ ] Task: Asset preloading
  - [ ] Task: Loading progress indicator
  - [ ] Task: Lazy load non-critical assets

---

## Epic 6: Mobile Support
### Feature 6.1: Touch Controls
- **Story 6.1.1**: As a mobile player, I can play with touch
  - [ ] Task: Swipe left/right for lane change
  - [ ] Task: Swipe up for jump
  - [ ] Task: Swipe down for slide
  - [ ] Task: Tap to start

### Feature 6.2: Responsive Design
- **Story 6.2.1**: As a mobile player, the game fits my screen
  - [ ] Task: Responsive canvas sizing
  - [ ] Task: Mobile-friendly HUD sizing (current: partial)
  - [ ] Task: Touch-friendly button sizes

---

## Epic 7: Progression & Retention
### Feature 7.1: Unlockables
- **Story 7.1.1**: As a player, I can unlock content
  - [ ] Task: Character skins
  - [ ] Task: Trail effects
  - [ ] Task: Coin shop

### Feature 7.2: Challenges
- **Story 7.2.1**: As a player, I have goals to achieve
  - [ ] Task: Daily challenges
  - [ ] Task: Achievement system
  - [ ] Task: Milestone rewards

---

## Priority Order (MVP)
1. **P0 - Critical Bugs**: Fix any game-breaking issues
2. **P1 - Core Loop**: Ensure run/jump/dodge/collect works perfectly
3. **P2 - Audio**: Sound effects and music with mute option
4. **P3 - Mobile**: Touch controls for mobile players
5. **P4 - Polish**: Animations, effects, and visual improvements
6. **P5 - Retention**: Unlockables and progression

---

## Current Status
- Core gameplay: **Working**
- Obstacles: **Working**
- Powerups: **Working**
- Track/environment: **Working** (fixed disappearing issue)
- Audio: **Muted by default, mute button added**
- Mobile: **Not implemented**

## Known Issues
- [ ] INP (Input responsiveness) rated "poor"
- [ ] LCP (Largest Contentful Paint) needs improvement
- [ ] Need to verify mute button doesn't break game
