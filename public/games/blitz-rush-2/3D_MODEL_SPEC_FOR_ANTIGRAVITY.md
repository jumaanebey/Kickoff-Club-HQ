# Blitz Rush 2.0 - 3D Model Specification for Antigravity

## Overview

The current 2D isometric sprites look flat in the 3D game environment. We need actual 3D models (GLTF/GLB format) to give the game proper depth and dimension.

---

## Technical Requirements

**Format:** GLTF (.glb preferred - single binary file)
**Poly count:** Low-poly (under 5,000 triangles per model)
**Textures:** Embedded in GLB file
**Scale:** 1 unit = 1 meter
**Origin:** Center bottom (feet on ground plane)

---

## Models Needed

### 1. Player Character (Priority: HIGH)

| Model | Description | Animations |
|-------|-------------|------------|
| `player.glb` | Football player in uniform (#7 jersey, helmet, pads) | See below |

**Required Animations (embedded in GLB):**
- `run` - Running cycle (looping)
- `jump` - Jump animation
- `roll` - Slide/roll under obstacles
- `tackled` - Getting tackled (game over)
- `idle` - Standing idle (optional)

**Style Notes:**
- Stylized/cartoon proportions (not realistic)
- Team colors: Blue/white or match Kickoff Club branding
- Helmet with face mask visible
- Football tucked under arm while running

---

### 2. Defender - Lineman (Priority: HIGH)

| Model | Description | Animations |
|-------|-------------|------------|
| `defender_lineman.glb` | Large defensive lineman | See below |

**Required Animations:**
- `idle` - Ready stance, arms out (looping)
- `lunge` - Optional tackle attempt

**Style Notes:**
- Bulky, intimidating build
- Opposing team colors: Red/black
- Menacing stance blocking the path

---

### 3. Defender - Linebacker (Priority: MEDIUM)

| Model | Description | Animations |
|-------|-------------|------------|
| `defender_linebacker.glb` | Medium-sized linebacker | `idle` |

---

### 4. Defender - Safety (Priority: MEDIUM)

| Model | Description | Animations |
|-------|-------------|------------|
| `defender_safety.glb` | Fast, agile defensive back | `idle` |

---

### 5. Collectibles (Priority: HIGH)

| Model | Description | Animations |
|-------|-------------|------------|
| `coin.glb` | Football-shaped gold coin | `spin` (looping rotation) |

---

### 6. Power-ups (Priority: MEDIUM)

| Model | Description | Animations |
|-------|-------------|------------|
| `powerup_shield.glb` | Shield icon (blue glow) | `float` (bobbing) |
| `powerup_magnet.glb` | Magnet icon (pink) | `float` |
| `powerup_double.glb` | 2x multiplier (gold) | `float` |
| `powerup_speed.glb` | Lightning bolt (orange) | `float` |

---

## File Organization

```
/public/games/blitz-rush-2/models/
├── player.glb
├── defender_lineman.glb
├── defender_linebacker.glb
├── defender_safety.glb
├── coin.glb
└── powerups/
    ├── powerup_shield.glb
    ├── powerup_magnet.glb
    ├── powerup_double.glb
    └── powerup_speed.glb
```

---

## Priority Order

1. **Must Have (Game Playable):**
   - player.glb (with run, jump, roll, tackled animations)
   - defender_lineman.glb
   - coin.glb

2. **Should Have (Full Experience):**
   - All power-up models
   - Additional defender types

3. **Nice to Have:**
   - Extra animation polish
   - Particle effects baked in

---

## Reference

- Game camera: Chase view from behind/above player
- Art style: Match existing Antigravity isometric buildings (stylized, clean)
- Inspiration: Subway Surfers, Temple Run character style

---

## Testing

Once models are ready, place them in `/public/games/blitz-rush-2/models/` and notify for integration.

---

*Created: December 24, 2025*
*For: Antigravity 3D model pipeline*
