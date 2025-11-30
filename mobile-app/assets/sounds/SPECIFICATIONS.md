# Sound Asset Specifications

This document defines the technical specifications and sound design requirements for the Kickoff Club HQ mobile app.

## Technical Requirements

- **Format:** MP3
- **Sample Rate:** 44.1kHz
- **Bit Depth:** 16-bit
- **Bitrate:** 192kbps (CBR preferred)
- **Channels:** Stereo (Mono acceptable for simple UI sounds)
- **Normalization:** -3dB peak
- **File Size Target:** < 50KB per file (where possible)

## Sound List & Design Notes

### 1. collect_coin.mp3
- **Duration:** 200-300ms
- **Description:** Bright, metallic chime indicating currency collection.
- **Design:** Start at 800Hz, glide to 1200Hz. Quick attack, short sustain, medium decay. Light reverb.
- **Reference:** Classic coin collection sounds (Mario, Sonic) but modernized.

### 2. upgrade_start.mp3
- **Duration:** 400-500ms
- **Description:** Mechanical/sci-fi whoosh indicating the start of a construction process.
- **Design:** Ascending synth whoosh (200Hz -> 1500Hz). Layered with a mechanical "clunk" at the start. Low-pass to high-pass filter sweep.

### 3. upgrade_complete.mp3
- **Duration:** 800ms - 1s
- **Description:** Triumphant fanfare for completing a building upgrade.
- **Design:** Three-note melody (C5 -> E5 -> G5). Bright brass or synth timbre. Sparkle layer on top. Slight reverb and stereo widening.

### 4. drill_plant.mp3
- **Duration:** 300ms
- **Description:** Earthy impact sound for starting a drill/planting.
- **Design:** 100-400Hz frequencies. Short, punchy texture. Subtle high-frequency "sprout" pop.

### 5. drill_harvest.mp3
- **Duration:** 500ms
- **Description:** Satisfying collection sound for finishing a drill.
- **Design:** Rustle (200-800Hz) combined with a chime (1000Hz+). Pan slightly left to right.

### 6. button_tap.mp3
- **Duration:** 100-150ms
- **Description:** Crisp, clean UI tap sound.
- **Design:** Single sine wave at 800Hz with very short decay. Tiny bit of saturation.

### 7. error.mp3
- **Duration:** 400ms
- **Description:** Descending "denied" sound for invalid actions.
- **Design:** 600Hz -> 200Hz quick glide down. Slightly harsh/buzzy texture. Brief distortion.

### 8. level_up.mp3
- **Duration:** 2s
- **Description:** Epic fanfare for leveling up the user profile.
- **Design:** Multi-layer orchestral hit. Full frequency spectrum (80Hz bass to 8kHz shimmer). Impact -> Swell -> Sparkle tail. Large hall reverb.

### 9. achievement_unlock.mp3
- **Duration:** 1.5s
- **Description:** Magical sound for unlocking an achievement.
- **Design:** Bell tree cascade (descending pitches). 2000Hz -> 500Hz. Subtle "unlock" mechanism click. Stereo spread with long reverb tail.

### 10. energy_refill.mp3
- **Duration:** 600ms
- **Description:** Electric charging sound for energy replenishment.
- **Design:** Rising frequency sweep (300Hz -> 1500Hz). Pulsing rhythm (3 pulses). Subtle electric crackle layer. Phaser/flanger effect for motion.
