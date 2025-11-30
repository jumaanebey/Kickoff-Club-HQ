# Phase 2: Parallel Development Tasks

Great work completing Phase 1 polish enhancements! All components are built and ready for integration.

## My Integration Work (Claude)

I'll handle integrating your components into the main app flow:

### Integration Tasks:
1. ✅ Load and test SoundManager with new MP3 files
2. ✅ Integrate tutorial system with user progress tracking
3. ✅ Add BuildingCardSkeleton during data loading
4. ⏳ Consider drag-and-drop for edit mode (Phase 3)

### Tutorial System Integration Plan:
- Add tutorial state to user profile in Supabase
- Create TutorialManager context/hook
- Overlay tutorial tooltips on HQScreen
- Track completion and allow replay
- Show on first login only

---

## Antigravity's Next Visual Polish Tasks

Focus on high-impact visual enhancements that make the game feel premium.

### Priority 1: Energy Refill Animation

**Location:** `/mobile-app/src/components/EnergyRefillAnimation.tsx` (create new file)

**What to Build:**
A satisfying energy refill animation shown when the user refills energy.

**Requirements:**
- Lightning bolt particles bursting outward from energy icon
- Glow/pulse effect on energy bar
- Counter animating from old value to new value
- Sound effect trigger point (you don't need to add sound, just call soundManager.playSound('energy_refill'))
- 1-2 second duration total

**Props Interface:**
```typescript
interface EnergyRefillAnimationProps {
  startValue: number;
  endValue: number;
  onComplete: () => void;
  visible: boolean;
}
```

**Animation Details:**
- Use react-native-reanimated for smooth 60fps animation
- Lightning particles: 8-12 small lightning icons radiating outward
- Energy bar: pulsing glow effect (scale + opacity)
- Number counter: animated Text using interpolation

---

### Priority 2: Building Construction Animation

**Location:** `/mobile-app/src/components/BuildingConstructionAnimation.tsx` (create new file)

**What to Build:**
Construction animation overlay for newly placed buildings.

**Requirements:**
- Crane icon or construction sign
- Dust cloud particles at base
- Progress bar filling up over time
- "Under Construction" label
- Hammer sound effect on placement

**Props Interface:**
```typescript
interface BuildingConstructionAnimationProps {
  buildingId: string;
  constructionTimeSeconds: number;
  onComplete: () => void;
}
```

**Visual Elements:**
- Semi-transparent overlay on building slot
- Animated crane swinging back and forth
- Dust particles floating up from bottom
- Circular progress indicator
- Time remaining text (e.g., "2m 30s")

---

### Priority 3: Achievement Celebration Animation

**Location:** `/mobile-app/src/components/AchievementCelebration.tsx` (create new file)

**What to Build:**
Full-screen achievement unlock celebration.

**Requirements:**
- Trophy/medal icon zooming in
- Confetti or sparkles raining down
- Achievement title and description
- "Tap to continue" prompt
- Triumphant sound effect

**Props Interface:**
```typescript
interface AchievementCelebrationProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onDismiss: () => void;
  visible: boolean;
}
```

**Animation Sequence:**
1. Screen dims with semi-transparent overlay
2. Trophy icon scales in with bounce
3. Confetti bursts from top
4. Title fades in
5. Description slides up
6. Glow/shimmer effect based on rarity
7. User taps anywhere to dismiss

**Rarity Effects:**
- Common: Blue glow
- Rare: Purple glow
- Epic: Gold glow
- Legendary: Rainbow shimmer

---

### Priority 4: Resource Counter Animation

**Location:** `/mobile-app/src/components/AnimatedResourceCounter.tsx` (create new file)

**What to Build:**
Smooth number counter that animates when resource values change.

**Requirements:**
- Counts up or down smoothly (not instant jump)
- Highlights in green when increasing, red when decreasing
- Small bounce effect on change
- Works for coins, KP, and energy

**Props Interface:**
```typescript
interface AnimatedResourceCounterProps {
  value: number;
  previousValue?: number;
  fontSize?: number;
  color?: string;
  suffix?: string; // e.g., "K" for thousands
}
```

**Features:**
- Interpolates between old and new value over 300ms
- Flashes green/red briefly on change
- Scales up slightly then back down (spring animation)
- Formats large numbers (e.g., 1.2K, 5.3M)

---

### Priority 5: Daily Reward Chest Animation

**Location:** `/mobile-app/src/components/DailyRewardChest.tsx` (create new file)

**What to Build:**
Animated treasure chest that opens to reveal daily rewards.

**Requirements:**
- Closed chest state (pulsing to attract attention)
- Opening animation (lid swings open)
- Rewards burst out (coins, XP icons)
- Summary of rewards earned
- "Claim" button

**Props Interface:**
```typescript
interface DailyRewardChestProps {
  rewards: Array<{
    type: 'coin' | 'kp' | 'energy';
    amount: number;
  }>;
  onClaim: () => void;
  visible: boolean;
}
```

**Animation Sequence:**
1. Chest appears with gentle pulse
2. User taps chest
3. Lid swings open with creak sound
4. Light rays burst out
5. Reward icons fly out and orbit
6. Numbers count up
7. "Claim" button appears
8. Rewards added to totals on claim

---

### Priority 6: Particle Effects System

**Location:** `/mobile-app/src/utils/ParticleSystem.tsx` (create new file)

**What to Build:**
Reusable particle effect system for various animations.

**Requirements:**
- Configurable particle types (sparkle, coin, star, smoke, etc.)
- Emission patterns (burst, fountain, rain, orbit)
- Physics simulation (gravity, velocity, friction)
- Pooling for performance
- Easy integration with existing components

**Usage Example:**
```typescript
<ParticleSystem
  type="sparkle"
  pattern="burst"
  count={20}
  origin={{ x: 100, y: 100 }}
  duration={1000}
  onComplete={() => console.log('done')}
/>
```

**Particle Types to Support:**
- `sparkle` - Small glowing stars
- `coin` - Coin icons
- `smoke` - Gray cloud puffs
- `confetti` - Colored rectangles
- `lightning` - Electric bolts
- `heart` - Heart shapes

**Emission Patterns:**
- `burst` - Explode outward from origin
- `fountain` - Arc upward then fall
- `rain` - Fall from top
- `orbit` - Circle around origin

---

## General Guidelines (Same as Before)

**Development Standards:**
- Use TypeScript for all new files
- Use react-native-reanimated for animations
- Use existing theme constants from `src/constants/theme.ts`
- Test performance (should maintain 60fps)
- Keep components reusable

**Git Workflow:**
1. Pull latest: `git pull origin main`
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push: `git push origin main`

**File Organization:**
- Components go in `/src/components/`
- Utilities go in `/src/utils/`
- Keep components focused (single responsibility)

**Performance Tips:**
- Use `useNativeDriver: true` when possible
- Avoid re-renders with `React.memo` and `useCallback`
- Pool objects for particle systems
- Clean up animations on unmount

---

## Integration Notes for Me

When you complete each component:
1. Commit and push to main
2. Leave a comment in the component about where it should be used
3. I'll integrate them into the appropriate screens

**Example:**
```typescript
// TODO (Integration): Use this component when user taps "Refill Energy" button
// Trigger: src/screens/Main/HQScreen.tsx - handleRefillEnergy function
export const EnergyRefillAnimation = ...
```

---

## Priority Order

I recommend working in this order for maximum impact:

1. **Energy Refill Animation** - Quick win, frequently seen
2. **Animated Resource Counter** - Used everywhere, big UX improvement
3. **Particle Effects System** - Foundation for other animations
4. **Achievement Celebration** - High visibility, memorable moments
5. **Building Construction** - Nice-to-have polish
6. **Daily Reward Chest** - Advanced feature, may need design discussion

---

## Questions?

If you need clarification on any animation behavior or integration points:
- Check existing components for reference
- Add a TODO comment with your question
- Test animations in isolation first
- I'll handle all Supabase and state management

Let's make this game feel amazing! Start with Priority 1 (Energy Refill Animation).
