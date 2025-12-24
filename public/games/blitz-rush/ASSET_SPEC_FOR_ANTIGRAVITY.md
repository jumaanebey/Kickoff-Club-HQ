# Blitz Rush - Asset Specification for Antigravity

## Overview

Blitz Rush is a 3D endless runner web game where players dodge defenders and collect coins/power-ups. This document specifies all visual assets needed to replace the current procedural Three.js graphics with polished 2D/3D assets.

---

## Art Style Guidelines

**Style:** Isometric 3D (matching Antigravity's existing building assets)
**Format:** PNG with transparency
**Resolution:** 2x for retina displays
**Color Palette:** Vibrant football/sports theme with the Kickoff Club brand colors

---

## 1. Player Character

### Running Player
| Asset | Description | Size | States |
|-------|-------------|------|--------|
| `player_run_1.png` | Football player running (frame 1) | 256x384px | Normal |
| `player_run_2.png` | Football player running (frame 2) | 256x384px | Normal |
| `player_run_3.png` | Football player running (frame 3) | 256x384px | Normal |
| `player_run_4.png` | Football player running (frame 4) | 256x384px | Normal |
| `player_jump.png` | Player mid-jump, legs tucked | 256x384px | Jumping |
| `player_roll.png` | Player sliding/rolling under | 384x192px | Rolling |
| `player_tackled.png` | Player being tackled (game over) | 384x384px | Tackled |

**Notes:**
- Player wears a football uniform (helmet, jersey #7, pads)
- Should face toward the camera (running toward viewer)
- Dynamic pose showing movement/speed

---

## 2. Defenders (Obstacles)

| Asset | Description | Size |
|-------|-------------|------|
| `defender_lineman.png` | Large, bulky defensive lineman | 256x384px |
| `defender_linebacker.png` | Medium-sized linebacker | 224x352px |
| `defender_safety.png` | Fast, agile defensive back | 192x320px |

**Notes:**
- Defenders wear opposing team colors (red/black recommended)
- Menacing stance, arms out ready to tackle
- Should look like they're blocking the path

---

## 3. Collectibles

| Asset | Description | Size |
|-------|-------------|------|
| `coin.png` | Gold football-shaped coin | 64x64px |
| `coin_spin_1.png` to `coin_spin_8.png` | Spinning coin animation | 64x64px |

---

## 4. Power-ups

| Asset | Description | Size | Color |
|-------|-------------|------|-------|
| `powerup_shield.png` | Shield/barrier icon | 96x96px | Blue glow |
| `powerup_magnet.png` | Magnet attracting coins | 96x96px | Pink/magenta |
| `powerup_slowmo.png` | Clock/hourglass icon | 96x96px | Purple |
| `powerup_double.png` | 2x multiplier icon | 96x96px | Gold |

**Notes:**
- Each power-up should have a glowing aura
- Distinct silhouettes for quick recognition during gameplay

---

## 5. Environment

### Field Elements
| Asset | Description | Size |
|-------|-------------|------|
| `field_tile.png` | Football field grass texture (seamless) | 512x512px |
| `field_lines.png` | Yard line markings overlay | 512x256px |
| `endzone.png` | Endzone with "KICKOFF" text | 512x256px |

### Stadium Background
| Asset | Description | Size |
|-------|-------------|------|
| `stadium_crowd.png` | Distant crowd/stands (seamless horizontal) | 1024x384px |
| `stadium_lights.png` | Stadium lights at top | 512x128px |
| `scoreboard.png` | Stadium scoreboard | 384x256px |

---

## 6. UI Elements

### Start Screen
| Asset | Description | Size |
|-------|-------------|------|
| `logo_blitz_rush.png` | Game logo/title | 512x256px |
| `icon_endless.png` | Infinity symbol for endless mode | 64x64px |
| `icon_challenge.png` | Trophy for challenge mode | 64x64px |

### HUD
| Asset | Description | Size |
|-------|-------------|------|
| `hud_score_bg.png` | Score display background | 192x64px |
| `hud_coin_icon.png` | Small coin for HUD | 32x32px |
| `hud_yards_icon.png` | Football for yards display | 32x32px |

### Buttons
| Asset | Description | Size |
|-------|-------------|------|
| `btn_play.png` | Play/Start button | 256x80px |
| `btn_retry.png` | Retry/Play Again button | 256x80px |
| `btn_menu.png` | Back to Menu button | 256x80px |

---

## 7. Effects

| Asset | Description | Size |
|-------|-------------|------|
| `effect_confetti_1.png` to `effect_confetti_4.png` | Confetti pieces (various shapes) | 32x32px |
| `effect_speed_lines.png` | Speed/motion blur lines | 256x512px |
| `effect_shield_aura.png` | Shield power-up active effect | 384x384px |
| `effect_tackle_impact.png` | Impact burst when tackled | 256x256px |
| `effect_touchdown_burst.png` | Celebration burst effect | 512x512px |

---

## 8. Audio Assets (Optional)

| Sound | Description | Duration | Format |
|-------|-------------|----------|--------|
| `sfx_coin.mp3` | Coin collect sound | 0.3s | MP3 |
| `sfx_powerup.mp3` | Power-up collect sound | 0.5s | MP3 |
| `sfx_tackle.mp3` | Getting tackled/game over | 0.8s | MP3 |
| `sfx_touchdown.mp3` | Touchdown celebration | 1.5s | MP3 |
| `sfx_whoosh.mp3` | Lane switch/swipe sound | 0.2s | MP3 |
| `sfx_jump.mp3` | Jump sound | 0.3s | MP3 |
| `music_gameplay.mp3` | Background gameplay music (loop) | 60s | MP3 |

---

## File Organization

```
/public/games/blitz-rush/assets/
├── player/
│   ├── player_run_1.png
│   ├── player_run_2.png
│   ├── player_jump.png
│   └── ...
├── defenders/
│   ├── defender_lineman.png
│   ├── defender_linebacker.png
│   └── defender_safety.png
├── collectibles/
│   ├── coin.png
│   └── coin_spin_*.png
├── powerups/
│   ├── powerup_shield.png
│   └── ...
├── environment/
│   ├── field_tile.png
│   └── ...
├── ui/
│   ├── logo_blitz_rush.png
│   └── ...
├── effects/
│   └── ...
└── audio/
    └── ...
```

---

## Priority Order

1. **High Priority** (needed first):
   - Player running sprites
   - Defender sprites
   - Coin
   - Power-up icons

2. **Medium Priority**:
   - Field/environment textures
   - UI elements
   - Effects

3. **Lower Priority**:
   - Audio assets
   - Additional animations

---

## Integration Notes

- Assets will be loaded via Three.js TextureLoader
- Sprites should work well against a dark blue/green football field background
- All player/defender sprites should be rendered from a 3/4 isometric perspective (same as building assets)
- PNG transparency is essential for all sprites

---

## Questions for Antigravity

1. Should the player character match any specific NFL team aesthetic?
2. Preference for the stadium crowd - realistic or stylized?
3. Any existing Kickoff Club mascot/character to use as the player?

---

*Document created: December 24, 2025*
*For: Antigravity asset creation pipeline*
