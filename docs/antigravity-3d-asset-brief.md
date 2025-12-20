# Blitz Rush 3D Asset Brief
## For Antigravity - 3D Models

---

## Overview

The 2D assets look great! Now we need **3D models** to match the mascot character in the logo. These will be used directly in the Three.js game engine.

---

## Technical Requirements

### File Format
- **GLTF (.glb)** - Binary GLTF format (preferred)
- Single file with embedded textures
- Optimized for web (low poly, compressed textures)

### Polygon Budget
- Player character: 2,000-5,000 triangles
- Obstacles: 500-2,000 triangles each
- Keep it low-poly but smooth (stylized, not realistic)

### Scale
- 1 unit = 1 meter in Three.js
- Player height: ~2.5 units
- Obstacles: proportional to player

---

## Priority 1: Mascot Player Character

### Design Reference
Use the character from `logo.png` as the reference - the cute chibi football player with:
- Oversized helmet with face mask
- Big expressive eyes visible through mask
- Chunky rounded body (bean/pill shape)
- Small stubby arms and legs
- Football tucked under arm

### Required Model: `player-mascot.glb`

**Geometry:**
- Big spherical helmet (40% of total height)
- Rounded pill-shaped body
- Stubby cylinder arms and legs
- Simple hand/foot shapes

**Materials:**
- Helmet: Glossy orange with stripe detail
- Face mask: Dark gray metallic
- Jersey: Team color (we'll swap via code)
- Pants: White
- Shoes: Black with cleats implied

**Rigging (Simple):**
- Root bone at feet
- Spine bone for body lean
- Left/Right leg bones for run cycle
- Left/Right arm bones for pumping
- Head bone for slight bob

**Animations (embedded in GLB):**
| Name | Frames | Description |
|------|--------|-------------|
| `idle` | 30 | Slight bounce, looking forward |
| `run` | 24 | Bouncy run cycle, arms pumping |
| `jump` | 20 | Crouch → spring up → arms up |
| `slide` | 15 | Drop low, legs forward |
| `hit` | 20 | Stumble back, dizzy stars |
| `celebrate` | 40 | Victory dance, fist pump |

### Color Variants
The model should use a simple color material that we can swap via code. Provide ONE model - we'll change the jersey color programmatically for:
- Orange (BLAZE) - default
- Blue (FROST)
- Red (FURY)
- Green (TITAN)
- Purple (STORM)
- Gold (LEGEND)

---

## Priority 2: Goofy Defender

### Design Reference
Match the mascot style - NOT realistic. Think training dummy meets cartoon villain.

### Required Model: `defender.glb`

**Geometry:**
- Similar chibi proportions to player
- Bigger/bulkier body (linebacker build)
- Arms spread wide in blocking stance
- Oversized helmet, maybe slightly menacing eyes

**Materials:**
- Red/maroon jersey (opposing team)
- Dark helmet
- Intimidating but goofy expression

**Animations:**
| Name | Frames | Description |
|------|--------|-------------|
| `idle` | 30 | Slight sway, arms spread |
| `lunge` | 15 | Quick grab motion (when player gets close) |

---

## Priority 3: Obstacles

### Hurdle: `hurdle.glb`
- Chunky training hurdle
- Orange/white striped bar
- Rounded corners (safe, not sharp)
- No animation needed

### Barrier/Slide: `barrier.glb`
- Tall padded training barrier
- Blue/yellow colors
- "SLIDE" text or arrow indicator
- No animation needed

### Training Dummy: `dummy.glb`
- Classic tackling dummy shape
- Red with target circle
- Wobble animation (optional)

---

## Priority 4: Collectibles (Optional 3D versions)

If the 2D sprites don't look right in 3D space, create:

### Coin: `coin.glb`
- Thick chunky coin (not flat)
- Football emblem embossed
- Gold metallic material
- Spin animation embedded

### Power-up Orbs: `powerup-{type}.glb`
- Glass/crystal sphere
- Glowing inner core
- Types: shield (blue), magnet (pink), speed (green), double (gold)
- Pulse/float animation embedded

---

## Export Settings

### For Blender:
```
Format: glTF Binary (.glb)
Include: Selected Objects
Transform: +Y Up
Geometry: Apply Modifiers, UVs, Normals
Animation: Export, Group by NLA Track
Compression: Draco (if available)
```

### For other software:
- Export as GLTF 2.0
- Embed textures (don't use separate files)
- Use PBR materials (metallic/roughness workflow)
- Keep texture resolution ≤ 512x512

---

## Save Location

Save all 3D models to:
```
/Users/jumaanebey/Desktop/Kickoff-Club-HQ/public/games/blitz-rush/models/
```

Create the `models/` folder if it doesn't exist.

### Expected Files:
```
models/
├── player-mascot.glb    (Priority 1)
├── defender.glb         (Priority 2)
├── hurdle.glb          (Priority 3)
├── barrier.glb         (Priority 3)
├── dummy.glb           (Priority 3)
├── coin.glb            (Priority 4 - optional)
└── powerup-shield.glb  (Priority 4 - optional)
```

---

## Quality Checklist

Before saving, verify:
- [ ] Model loads in https://gltf-viewer.donmccurdy.com/
- [ ] Animations play correctly
- [ ] File size under 1MB per model
- [ ] No console errors in viewer
- [ ] Scale looks correct (player ~2.5 units tall)

---

## Style Reference

The vibe we want:
- **Fall Guys** meets **NFL Blitz**
- Cute but athletic
- Bouncy and energetic
- Fun, not intimidating
- Appeals to all ages

The mascot in `logo.png` is PERFECT - match that energy in 3D!

---

*Create the player-mascot.glb first - that's the star of the show!*
