# Antigravity - Execute Now

**Priority:** IMMEDIATE
**Task:** Generate and save Blitz Rush game assets

---

## TASK 1: Tutorial Step Cards (8 images)

Generate 8 PNG images (800x500 pixels each) and save to:
`/public/images/blitz-rush/tutorial/`

### Image 1: step-1-welcome.png
- **Content:** Football player character waving, friendly pose
- **Text:** "Welcome to Blitz Rush!" (bold, white)
- **Background:** Dark blue gradient (#0f172a to #1e293b)
- **Style:** Subway Surfer cartoon aesthetic, bright and inviting

### Image 2: step-2-movement.png
- **Content:** Top-down view of 3 lanes on football field
- **Text:** "Swipe Left or Right to Change Lanes"
- **Visual:** Left/right arrow indicators on the lanes
- **Background:** Dark blue with green field strip

### Image 3: step-3-jump.png
- **Content:** Player mid-jump over an orange hurdle
- **Text:** "Swipe UP to Jump" (with up arrow icon)
- **Style:** Dynamic action pose, motion lines

### Image 4: step-4-slide.png
- **Content:** Player sliding under a high bar obstacle
- **Text:** "Swipe DOWN to Slide" (with down arrow icon)
- **Style:** Low angle, speed effect

### Image 5: step-5-obstacles.png
- **Content:** Grid showing 3 obstacle types:
  - Red defender (football player blocking)
  - Orange hurdle (jump over)
  - High bar (slide under)
- **Text:** "Avoid These Obstacles!"
- **Layout:** 3 icons in a row with labels

### Image 6: step-6-coins.png
- **Content:** Golden coins floating with sparkle effects
- **Text:** "Collect Coins for Points!"
- **Visual:** Coin counter UI element showing "+100"

### Image 7: step-7-powerups.png
- **Content:** 4 power-up icons in a 2x2 grid:
  - Red magnet icon - "Magnet"
  - Blue shield icon - "Shield"
  - Orange lightning bolt - "Speed"
  - Purple "2X" - "Multiplier"
- **Text:** "Grab Power-Ups!"

### Image 8: step-8-ready.png
- **Content:** Player in ready stance, determined expression
- **Text:** "You're Ready!"
- **Button:** Orange "TAP TO PLAY" button graphic
- **Style:** Energetic, exciting

---

## TASK 2: Gesture Icons (4 images)

Generate 4 PNG images (128x128 pixels each) and save to:
`/public/images/blitz-rush/tutorial/`

### swipe-left.png
- White hand/finger icon with left-pointing arrow
- Transparent background
- Clean, minimal style

### swipe-right.png
- White hand/finger icon with right-pointing arrow
- Transparent background

### swipe-up.png
- White hand/finger icon with up-pointing arrow
- Transparent background

### swipe-down.png
- White hand/finger icon with down-pointing arrow
- Transparent background

---

## TASK 3: Celebration Graphics (2 images)

Save to: `/public/images/blitz-rush/celebration/`

### juked-text.png (600x200 pixels)
- **Text:** "JUKED!" in bold, aggressive sports font
- **Style:** Fire/energy effects around text
- **Colors:** Orange (#f97316) to red gradient with yellow highlights
- **Transparent background**

### touchdown-text.png (800x250 pixels)
- **Text:** "TOUCHDOWN!" in celebratory font
- **Style:** Gold with confetti/sparkle effects
- **Colors:** Gold (#fbbf24) with white glow
- **Transparent background**

---

## TASK 4: Power-Up Icons for HUD (5 images)

Generate 5 PNG images (64x64 pixels each) and save to:
`/public/images/blitz-rush/`

### icon-coin.png
- Gold coin with dollar sign or football
- Shiny, 3D-ish appearance
- Transparent background

### icon-magnet.png
- Red horseshoe magnet
- Glowing effect
- Transparent background

### icon-shield.png
- Blue shield or bubble
- Energy/protection visual
- Transparent background

### icon-speed.png
- Orange lightning bolt
- Speed lines/energy
- Transparent background

### icon-multiplier.png
- Purple star with "2X" text
- Sparkle effects
- Transparent background

---

## File Structure When Complete

```
public/images/blitz-rush/
├── tutorial/
│   ├── step-1-welcome.png
│   ├── step-2-movement.png
│   ├── step-3-jump.png
│   ├── step-4-slide.png
│   ├── step-5-obstacles.png
│   ├── step-6-coins.png
│   ├── step-7-powerups.png
│   ├── step-8-ready.png
│   ├── swipe-left.png
│   ├── swipe-right.png
│   ├── swipe-up.png
│   └── swipe-down.png
├── celebration/
│   ├── juked-text.png
│   └── touchdown-text.png
├── icon-coin.png
├── icon-magnet.png
├── icon-shield.png
├── icon-speed.png
└── icon-multiplier.png
```

---

## Style Guide Summary

| Element | Style |
|---------|-------|
| Overall | Subway Surfer / Temple Run cartoon quality |
| Colors | Orange #f97316, Blue #2563eb, Gold #fbbf24, Green #22c55e |
| Background | Dark blue #0f172a |
| Text | Bold, white or orange, highly readable |
| Characters | Friendly, athletic, not aggressive |

---

## After Generation

Once all images are created and saved to the correct paths:

```bash
git add public/images/blitz-rush/
git commit -m "Add Blitz Rush tutorial, celebration, and icon assets"
git push origin main
```

---

**Total Assets to Generate: 19 images**

| Category | Count | Dimensions |
|----------|-------|------------|
| Tutorial steps | 8 | 800x500 |
| Gesture icons | 4 | 128x128 |
| Celebration text | 2 | 600x200, 800x250 |
| HUD icons | 5 | 64x64 |

Execute now.
