# Blitz Rush 3D Rebuild - Implementation Plan

**Goal:** Rebuild Blitz Rush as a full 3D endless runner that competes with Subway Surfer in visual quality, animation smoothness, and game feel.

**Engine:** Three.js (best React/Next.js integration) with React Three Fiber
**Target:** 60fps on mid-range mobile devices

---

## Phase 1: Foundation Setup

### 1.1 Tech Stack

```bash
# Required packages
npm install three @react-three/fiber @react-three/drei @react-three/rapier
npm install @react-three/postprocessing  # For visual effects
npm install zustand  # Game state management
npm install howler  # Professional audio
```

**Architecture:**
```
components/games/blitz-rush-3d/
├── BlitzRush3D.tsx           # Main game component
├── Scene.tsx                  # Three.js scene setup
├── Player.tsx                 # 3D player with animations
├── Track.tsx                  # Infinite scrolling track
├── Obstacles.tsx              # Obstacle spawning system
├── Collectibles.tsx           # Coins, powerups
├── Environment.tsx            # Stadium, crowd, sky
├── Camera.tsx                 # Dynamic camera controller
├── Effects.tsx                # Post-processing effects
├── UI/
│   ├── HUD.tsx               # Score, coins, powerups
│   ├── StartScreen.tsx
│   ├── GameOverScreen.tsx
│   └── PauseMenu.tsx
├── hooks/
│   ├── useGameState.ts       # Zustand store
│   ├── useControls.ts        # Touch/keyboard input
│   └── useAudio.ts           # Sound management
├── models/                    # GLTF/GLB 3D models
│   ├── player.glb
│   ├── defender.glb
│   ├── hurdle.glb
│   └── stadium.glb
└── utils/
    ├── pooling.ts            # Object pooling for performance
    └── collision.ts          # Collision detection
```

### 1.2 Core Scene Setup

```tsx
// Scene.tsx - Basic Three.js scene with React Three Fiber
import { Canvas } from '@react-three/fiber'
import { Environment, Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function BlitzRushScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 12], fov: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Sky & Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="stadium" />

      {/* Physics World */}
      <Physics gravity={[0, -30, 0]}>
        <Track />
        <Player />
        <Obstacles />
        <Collectibles />
      </Physics>

      {/* Post-Processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} intensity={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
```

---

## Phase 2: 3D Models Required

### 2.1 Player Character

**Model Requirements:**
- **Style:** Stylized/cartoon football player (think Subway Surfer aesthetic)
- **Poly count:** 3,000-5,000 triangles (mobile optimized)
- **Rig:** Full skeleton with IK for procedural animation
- **Textures:** 512x512 diffuse, normal, emission maps

**Animations (baked into GLB):**
| Animation | Frames | Loop | Notes |
|-----------|--------|------|-------|
| `idle` | 30 | Yes | Breathing, slight bounce |
| `run` | 24 | Yes | Full sprint cycle |
| `jump` | 20 | No | Leap up, hang, land |
| `slide` | 16 | No | Drop and slide under |
| `strafe_left` | 12 | No | Quick dodge left |
| `strafe_right` | 12 | No | Quick dodge right |
| `stumble` | 24 | No | Near-miss recovery |
| `death` | 30 | No | Dramatic tackle/fall |
| `celebrate` | 40 | No | Victory dance |

**Customization slots:**
- Helmet (swappable mesh)
- Jersey (texture swap)
- Trail effect (particle attachment point)

### 2.2 Obstacles

| Obstacle | Description | Behavior |
|----------|-------------|----------|
| **Hurdle** | Low barrier | Jump over |
| **Defender** | AI player | Jump/slide, can move between lanes |
| **Tackle Dummy** | Training equipment | Static, slide under |
| **Gatorade Cooler** | Wide obstacle | Can't slide, must dodge |
| **Barrier Wall** | Full lane blocker | Must change lanes |
| **Ramp** | Jump boost | Auto-launches player |

**Model specs:** 1,000-2,000 triangles each, shared texture atlas

### 2.3 Environment

**Stadium Elements:**
- **Track:** Repeating football field sections (100 yard segments)
- **Sidelines:** Crowd silhouettes (billboard sprites, animated)
- **Stadium walls:** Low-poly stadium structure
- **Lights:** Volumetric stadium lights
- **Banners:** Team flags, sponsor boards
- **Sky dome:** Dynamic time of day

**Performance:** Use instancing for crowd, LOD for distant objects

### 2.4 Collectibles & Powerups

| Item | Model | Effect |
|------|-------|--------|
| **Coin** | Spinning gold coin | +1 coin, glow trail |
| **Coin Line** | 5 coins in arc | +5 coins |
| **Magnet** | Red horseshoe | Attracts coins for 8s |
| **Shield** | Blue bubble | Blocks 1 hit |
| **Speed Boost** | Orange flame | 2x speed for 5s |
| **2x Multiplier** | Purple star | Double points for 10s |
| **Mega Coin** | Large gold coin | +10 coins, burst particles |

---

## Phase 3: Game Systems

### 3.1 Infinite Track Generation

```typescript
// Track generation with object pooling
const SEGMENT_LENGTH = 100 // yards
const VISIBLE_SEGMENTS = 5
const POOL_SIZE = 10

interface TrackSegment {
  id: number
  position: Vector3
  obstacles: Obstacle[]
  collectibles: Collectible[]
}

function generateSegment(difficulty: number): TrackSegment {
  // Spawn patterns based on difficulty
  // Easy: Single obstacles, coin lines
  // Medium: Multiple obstacles, tighter spacing
  // Hard: Moving defenders, complex patterns
}
```

### 3.2 Player Controller

```typescript
// Subway Surfer-style controls
interface PlayerState {
  lane: -1 | 0 | 1
  isJumping: boolean
  isSliding: boolean
  isGrounded: boolean
  velocity: Vector3
  currentAnimation: string
}

// Physics constants (tuned for game feel)
const LANE_WIDTH = 3
const LANE_SWITCH_SPEED = 0.15 // seconds
const JUMP_FORCE = 18
const GRAVITY = 45
const SLIDE_DURATION = 0.8
const FORWARD_SPEED_BASE = 20
const FORWARD_SPEED_MAX = 40

// Swipe detection
const SWIPE_THRESHOLD = 50 // pixels
const SWIPE_TIME_MAX = 300 // ms
```

### 3.3 Camera System

```typescript
// Dynamic camera for cinematic feel
interface CameraState {
  offset: Vector3  // [0, 8, 12] default
  lookAhead: number // How far ahead to look
  shake: number // Screen shake intensity
  fov: number // Field of view (zoom)
}

// Camera behaviors:
// - Slight delay following player lane changes
// - Zoom out during jumps
// - Zoom in during speed boosts
// - Shake on collisions/near-misses
// - Dramatic slow-mo on death
```

### 3.4 Collision Detection

```typescript
// Using Rapier physics or custom AABB
interface Hitbox {
  type: 'player' | 'obstacle' | 'collectible'
  bounds: Box3
  layer: number // For filtering
}

// Collision responses:
// - Obstacle hit (no shield): Game Over + death animation
// - Obstacle hit (with shield): Shield break + continue
// - Near miss (<0.5 units): Bonus points + stumble animation + camera shake
// - Coin collect: +coins + particle burst + sound
// - Powerup collect: Activate effect + UI indicator
```

---

## Phase 4: Visual Polish

### 4.1 Particle Systems

| Effect | Trigger | Description |
|--------|---------|-------------|
| **Dust Trail** | Running | Small puffs behind feet |
| **Jump Dust** | Takeoff/landing | Burst from ground |
| **Slide Sparks** | Sliding | Sparks from ground contact |
| **Coin Burst** | Collect coin | Gold sparkles, float up |
| **Shield Bubble** | Shield active | Glowing sphere around player |
| **Speed Lines** | Speed boost | Radial blur lines |
| **Magnet Pull** | Magnet active | Coin trail lines |
| **Death Explosion** | Game over | Stars, items scatter |
| **Confetti** | High score | Victory celebration |

### 4.2 Post-Processing Effects

```tsx
<EffectComposer>
  {/* Always on */}
  <Bloom luminanceThreshold={0.9} intensity={0.3} />
  <Vignette offset={0.1} darkness={0.4} />

  {/* Conditional */}
  {isSpeedBoost && <MotionBlur intensity={0.5} />}
  {isDying && <ChromaticAberration offset={[0.02, 0.02]} />}
  {isSlowMo && <DepthOfField focusDistance={0.01} bokehScale={4} />}
</EffectComposer>
```

### 4.3 Lighting & Shadows

- **Main light:** Directional (sun), casts shadows
- **Fill light:** Ambient, soft shadows
- **Rim light:** Back light on player for pop
- **Stadium lights:** Point lights with volumetric glow
- **Dynamic:** Time of day cycle (optional)

---

## Phase 5: Audio Design

### 5.1 Sound Effects

| Sound | File | Notes |
|-------|------|-------|
| `footsteps_run.mp3` | Loop | Rhythmic running |
| `jump.mp3` | One-shot | Whoosh up |
| `land.mp3` | One-shot | Thud on landing |
| `slide.mp3` | One-shot | Scraping sound |
| `lane_switch.mp3` | One-shot | Quick swoosh |
| `coin_collect.mp3` | One-shot | Satisfying ding |
| `powerup_collect.mp3` | One-shot | Magic chime |
| `shield_break.mp3` | One-shot | Glass shatter |
| `near_miss.mp3` | One-shot | Tense whoosh |
| `collision.mp3` | One-shot | Impact thud |
| `death.mp3` | One-shot | Dramatic hit |
| `crowd_cheer.mp3` | Loop | Background ambience |
| `milestone_500.mp3` | One-shot | Score milestone |
| `milestone_1000.mp3` | One-shot | Bigger milestone |
| `game_over.mp3` | One-shot | Failure sting |
| `high_score.mp3` | One-shot | Celebration fanfare |

### 5.2 Music

- **Menu:** Upbeat, hype building
- **Gameplay:** Dynamic layers that intensify with speed
- **Game Over:** Dramatic drop, then uplifting "try again"

---

## Phase 6: Performance Optimization

### 6.1 Mobile Performance Targets

- **FPS:** 60fps on iPhone 12+, 30fps on older devices
- **Draw calls:** <100 per frame
- **Triangles:** <100K visible
- **Memory:** <200MB total

### 6.2 Optimization Techniques

```typescript
// 1. Object Pooling - Reuse obstacles/coins
const obstaclePool = new ObjectPool(Obstacle, 50)
const coinPool = new ObjectPool(Coin, 100)

// 2. LOD (Level of Detail)
<mesh>
  <LOD distances={[0, 20, 50]}>
    <HighPolyMesh />
    <MedPolyMesh />
    <LowPolyMesh />
  </LOD>
</mesh>

// 3. Instancing for repeated objects
<InstancedMesh count={1000}>
  <CoinGeometry />
  <CoinMaterial />
</InstancedMesh>

// 4. Frustum culling (automatic in Three.js)
// 5. Texture atlasing
// 6. Compressed textures (KTX2/Basis)
// 7. GLTF Draco compression
```

### 6.3 Quality Settings

```typescript
const QUALITY_PRESETS = {
  low: {
    shadows: false,
    particles: 50,
    postProcessing: false,
    textureQuality: 256,
    crowdDetail: 'billboard',
  },
  medium: {
    shadows: true,
    particles: 100,
    postProcessing: true,
    textureQuality: 512,
    crowdDetail: 'lowpoly',
  },
  high: {
    shadows: true,
    particles: 200,
    postProcessing: true,
    textureQuality: 1024,
    crowdDetail: 'animated',
  },
}
```

---

## Phase 7: Implementation Roadmap

### Week 1: Core Engine
- [ ] Set up React Three Fiber scene
- [ ] Basic player movement (lane switching, jump, slide)
- [ ] Infinite track generation
- [ ] Placeholder cube models

### Week 2: 3D Models & Animation
- [ ] Source/create player model with animations
- [ ] Import obstacles models
- [ ] Animation state machine
- [ ] Basic collision detection

### Week 3: Game Feel
- [ ] Camera system (follow, shake, zoom)
- [ ] Particle effects (dust, coins, impacts)
- [ ] Sound integration
- [ ] Touch controls (swipe)

### Week 4: Polish & Environment
- [ ] Stadium environment
- [ ] Lighting and shadows
- [ ] Post-processing effects
- [ ] UI/HUD overlay

### Week 5: Systems & Content
- [ ] Powerup system
- [ ] Difficulty progression
- [ ] Score/coin saving
- [ ] Leaderboard integration

### Week 6: Optimization & Testing
- [ ] Performance profiling
- [ ] Mobile testing
- [ ] Quality settings
- [ ] Bug fixes

---

## Asset Requirements Summary

### 3D Models (GLB/GLTF)

| Asset | Priority | Est. Cost | Source Option |
|-------|----------|-----------|---------------|
| Player (rigged, animated) | P0 | $200-500 | Sketchfab / Custom |
| Defender (rigged) | P0 | $100-200 | Sketchfab |
| Hurdle | P1 | $20-50 | Sketchfab |
| Tackle Dummy | P1 | $20-50 | Sketchfab |
| Barrier | P1 | $20-50 | Simple geometry |
| Coin | P0 | Free | Procedural |
| Powerups (5) | P1 | $50 each | Sketchfab |
| Stadium environment | P2 | $200-400 | Sketchfab |
| **Total** | | **$600-1500** | |

### Textures

- Player diffuse, normal (512x512)
- Stadium atlas (2048x2048)
- Particle sprite sheet (256x256)
- UI elements (vector/PNG)

### Audio

- 15-20 sound effects
- 2-3 music tracks
- **Source:** Freesound.org, Epidemic Sound, custom

---

## Comparison: Before vs After

| Aspect | Current (CSS) | Target (3D) |
|--------|---------------|-------------|
| Graphics | CSS divs | 3D models w/ textures |
| Animation | Framer Motion | Skeletal animation |
| FPS | Variable (React) | Locked 60fps |
| Perspective | Fake 3D (scaling) | Real 3D camera |
| Particles | DOM elements | GPU particles |
| Shadows | CSS shadows | Real-time shadows |
| Environment | Gradient bg | Full stadium |
| Mobile | Poor | Optimized |
| File size | ~50KB | ~5-10MB |
| Dev time | 1 week | 6 weeks |

---

## Next Steps

1. **Approve this plan** - Confirm scope and timeline
2. **Source 3D assets** - Player model is critical path
3. **Set up R3F boilerplate** - Basic scene with physics
4. **Prototype player movement** - Core game feel
5. **Iterate on game feel** - The most important part

---

## Questions to Resolve

1. **Art style:** Realistic or stylized/cartoon?
2. **Character design:** Generic player or customizable avatar?
3. **Budget for assets:** Buy vs create vs AI-generate?
4. **Timeline priority:** Fast prototype or polished release?
5. **Platform focus:** Web-first or mobile-first?

---

*This document outlines the full scope of rebuilding Blitz Rush as a 3D game. The effort is significant but necessary to compete with top-tier mobile runners.*
