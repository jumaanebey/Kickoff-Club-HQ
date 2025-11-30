# Phase 3: Advanced Animations & Game Feel

Excellent work on Energy Refill, Resource Counter, and Particle System! These look great.

## My Integration Work (Claude)

I'll integrate your latest components:
1. ✅ AnimatedResourceCounter - Replace static numbers in top resource bar
2. ✅ EnergyRefillAnimation - Add to energy refill action
3. ⏳ ParticleSystem - May enhance coin fountain or other effects

---

## Antigravity's Phase 3 Tasks

Focus on the remaining high-impact visual features from Phase 2.

### Priority 1: Achievement Celebration Animation

**Location:** `/mobile-app/src/components/AchievementCelebration.tsx` (create new file)

**What to Build:**
Full-screen achievement unlock celebration with trophy zoom and confetti.

**Requirements:**
- Full-screen semi-transparent overlay (rgba(0,0,0,0.7))
- Trophy/medal icon that zooms in with bounce effect
- Confetti particles raining from top
- Achievement title and description fade in
- Rarity-based visual effects (glow colors)
- Tap anywhere to dismiss

**Props Interface:**
```typescript
interface AchievementCelebrationProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string; // FontAwesome5 icon name
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  visible: boolean;
  onDismiss: () => void;
}
```

**Animation Sequence:**
1. Overlay fades in (300ms)
2. Trophy scales from 0 to 1.2 with spring bounce (500ms)
3. Confetti bursts from top (100 particles, 2s duration)
4. Title fades + slides up (400ms delay)
5. Description fades + slides up (600ms delay)
6. Continuous glow pulse based on rarity

**Rarity Visual Effects:**
```typescript
const rarityColors = {
  common: COLORS.primary,
  rare: '#9333EA', // Purple
  epic: '#EAB308', // Gold
  legendary: ['#FF0080', '#7928CA', '#FF0080'], // Rainbow gradient
};
```

**Integration Note:**
```typescript
// TODO (Integration): Trigger when user unlocks achievement
// Location: src/screens/Main/HQScreen.tsx - after achievement unlock
// Example: setShowAchievement({ achievement: data, visible: true })
```

---

### Priority 2: Building Construction Animation

**Location:** `/mobile-app/src/components/BuildingConstructionOverlay.tsx` (create new file)

**What to Build:**
Animated overlay shown on building slots during construction.

**Requirements:**
- Semi-transparent overlay matching building card size
- Animated construction crane swinging back and forth
- Dust cloud particles rising from bottom
- Circular progress ring
- Time remaining countdown
- "Under Construction" label

**Props Interface:**
```typescript
interface BuildingConstructionOverlayProps {
  buildingType: string;
  constructionTimeSeconds: number;
  constructionStartedAt: string; // ISO timestamp
  onComplete: () => void;
}
```

**Visual Elements:**
1. **Crane Animation:**
   - Use FontAwesome5 "hard-hat" or "hammer" icon
   - Rotate between -15deg and 15deg
   - 1.5s duration, infinite repeat

2. **Dust Particles:**
   - 5-8 small gray circles
   - Rise from bottom with random X offset
   - Fade out as they rise
   - Continuous emission

3. **Progress Ring:**
   - Circular progress indicator
   - Fills clockwise from 0 to 360 degrees
   - Updates every second based on time remaining

4. **Timer Text:**
   - Format: "2m 30s" or "45s"
   - Updates every second
   - Positioned below progress ring

**Animation Logic:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const start = new Date(constructionStartedAt).getTime();
    const elapsed = now - start;
    const total = constructionTimeSeconds * 1000;
    const remaining = Math.max(0, total - elapsed);

    if (remaining === 0) {
      onComplete();
    }

    setProgress((elapsed / total) * 100);
    setTimeRemaining(formatTime(remaining));
  }, 1000);

  return () => clearInterval(interval);
}, [constructionStartedAt, constructionTimeSeconds]);
```

---

### Priority 3: Daily Reward Chest Animation

**Location:** `/mobile-app/src/components/DailyRewardChest.tsx` (create new file)

**What to Build:**
Interactive treasure chest that opens to reveal daily login rewards.

**Requirements:**
- Closed chest state with gentle pulse
- Opening animation (lid swings open)
- Light rays burst from chest
- Reward icons fly out and orbit chest
- Summary card shows total rewards
- "Claim" button to collect

**Props Interface:**
```typescript
interface DailyRewardChestProps {
  rewards: Array<{
    type: 'coin' | 'kp' | 'energy';
    amount: number;
  }>;
  visible: boolean;
  onClaim: () => void;
}
```

**Animation Sequence:**

1. **Closed State (Initial):**
   - Show chest icon (FontAwesome5 "treasure-chest" or "gift")
   - Gentle scale pulse: 1.0 → 1.05 → 1.0 (2s loop)
   - Glow effect around chest
   - "Tap to Open!" text below

2. **Opening Animation (On Tap):**
   - Lid rotation: 0deg → -60deg (hinge at top)
   - Duration: 600ms with spring easing
   - Sound cue: play `soundManager.playSound('chest_open')`

3. **Reward Burst:**
   - Light rays shoot outward (5-6 rays, golden color)
   - Reward icons appear from chest center
   - Each icon moves to orbit position
   - Icons: coin (💰), KP (⭐), energy (⚡)
   - Orbital motion around chest (circular path)

4. **Summary Card:**
   - Slides up from bottom
   - Shows total rewards with icons
   - Animated numbers counting up
   - "Claim" button appears with bounce

5. **Claim Action:**
   - Particle burst on button press
   - Icons fly to top bar (their destinations)
   - Fade out chest and summary
   - Call onClaim()

**Visual Structure:**
```typescript
<Modal visible={visible} transparent>
  <View style={styles.overlay}>
    {/* Closed chest with pulse */}
    {!isOpen && (
      <TouchableOpacity onPress={handleOpen}>
        <PulsingChest />
      </TouchableOpacity>
    )}

    {/* Open chest with rewards */}
    {isOpen && (
      <>
        <OpenChest />
        <LightRays />
        <OrbitingRewards rewards={rewards} />
        <SummaryCard rewards={rewards} onClaim={handleClaim} />
      </>
    )}
  </View>
</Modal>
```

---

### Priority 4: Loading State Improvements

**Location:** `/mobile-app/src/components/SkeletonLoader.tsx` (create new file)

**What to Build:**
Generic reusable skeleton loader component with shimmer effect.

**Requirements:**
- Configurable width, height, borderRadius
- Shimmer animation (light wave moving across)
- Can be composed for complex layouts
- Matches theme colors

**Props Interface:**
```typescript
interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}
```

**Shimmer Effect:**
```typescript
// Gradient moves from left to right
const shimmer = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(shimmer, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();
}, []);

const translateX = shimmer.interpolate({
  inputRange: [0, 1],
  outputRange: [-width, width],
});
```

**Usage Examples:**
```typescript
// Simple rectangle
<SkeletonLoader width={100} height={20} borderRadius={4} />

// Complex layout (user profile card)
<View>
  <SkeletonLoader width={60} height={60} borderRadius={30} />
  <SkeletonLoader width={120} height={16} borderRadius={4} style={{ marginTop: 8 }} />
  <SkeletonLoader width={80} height={12} borderRadius={4} style={{ marginTop: 4 }} />
</View>
```

---

### Priority 5: Button Press Effects

**Location:** `/mobile-app/src/components/AnimatedButton.tsx` (create new file)

**What to Build:**
Enhanced button with scale, ripple, and haptic feedback.

**Requirements:**
- Scale down on press (0.95)
- Ripple effect from touch point
- Haptic feedback on press
- Disabled state styling
- Loading state with spinner

**Props Interface:**
```typescript
interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
```

**Features:**
1. **Scale Animation:**
   - PressIn: scale to 0.95
   - PressOut: spring back to 1.0

2. **Ripple Effect:**
   - Circle expands from touch point
   - Fades out as it expands
   - Color based on variant

3. **Haptic:**
   - Use `haptics.impact()` on press
   - No haptic when disabled/loading

4. **Loading State:**
   - Show ActivityIndicator
   - Disable press while loading
   - Maintain button size (don't collapse)

---

### Priority 6: Success/Error Toast System

**Location:** `/mobile-app/src/components/Toast.tsx` (create new file)

**What to Build:**
Lightweight toast notification system for user feedback.

**Requirements:**
- Slide in from top
- Auto-dismiss after 3 seconds
- Success (green), Error (red), Info (blue) variants
- Icon + message
- Swipe up to dismiss early

**Props Interface:**
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  duration?: number; // ms, default 3000
  onDismiss: () => void;
}
```

**Animation:**
```typescript
const slideAnim = useRef(new Animated.Value(-100)).current;

useEffect(() => {
  if (visible) {
    Animated.sequence([
      Animated.spring(slideAnim, { toValue: 0 }),
      Animated.delay(duration),
      Animated.timing(slideAnim, { toValue: -100 }),
    ]).start(onDismiss);
  }
}, [visible]);
```

**Swipe Gesture:**
```typescript
// Use PanGestureHandler to dismiss on swipe up
const onSwipeUp = () => {
  Animated.timing(slideAnim, {
    toValue: -100,
    duration: 200,
  }).start(onDismiss);
};
```

---

## General Guidelines (Same as Phase 2)

**Development Standards:**
- Use TypeScript for all files
- Use react-native-reanimated for smooth animations
- Use theme constants from `src/constants/theme.ts`
- Test on both iOS and Android when possible
- Keep components reusable and well-documented

**Git Workflow:**
1. Pull latest: `git pull origin main`
2. Make changes
3. Test thoroughly
4. Commit: Clear messages describing what was built
5. Push: `git push origin main`

**Integration Comments:**
Add TODO comments showing where/how to integrate:
```typescript
// TODO (Integration): Use in HQScreen when achievement unlocks
// Trigger: src/screens/Main/HQScreen.tsx - handleAchievementUnlock()
```

---

## Recommended Order

For maximum impact and progressive enhancement:

1. **AnimatedButton** - Quick win, used everywhere
2. **SkeletonLoader** - Improves loading states across app
3. **Toast** - Essential for user feedback
4. **Achievement Celebration** - High visibility, memorable moments
5. **Building Construction** - Nice visual polish
6. **Daily Reward Chest** - Advanced feature, may need design iteration

---

## Questions or Blockers?

If you need clarification:
1. Check existing components for patterns
2. Test animations in isolation first
3. Add TODO comments for uncertainties
4. I'll handle all integration and state management

Great work so far! These animations are bringing the game to life.
