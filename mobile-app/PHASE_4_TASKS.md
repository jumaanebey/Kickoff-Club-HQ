# Phase 4: Premium Features & Advanced Assets

Excellent work on all previous phases! The components are production-ready and well-architected. Phase 4 focuses on premium features, advanced animations, and comprehensive asset creation.

## My Integration Status (Claude)

**Phase 3 Completed:**
- ✅ Toast System - Replaced all Alert.alert calls
- ✅ AnimatedResourceCounter - Smooth number animations
- ✅ EnergyRefillAnimation - Lightning bolt effect

**Phase 3 In Progress:**
- 🔄 AnimatedButton - Integrating next
- ⏳ BuildingConstructionOverlay - Scheduled
- ⏳ AchievementCelebration - Scheduled

---

## Antigravity's Phase 4 Tasks

Focus on premium features that significantly enhance user engagement and visual appeal.

### Priority 1: Level Up Celebration Animation

**Location:** `/mobile-app/src/components/LevelUpCelebration.tsx` (create new file)

**What to Build:**
Epic full-screen level up celebration with multiple animation layers and particle effects.

**Requirements:**
- Full-screen modal overlay (rgba(0,0,0,0.85))
- Starburst rays expanding from center
- Level number scaling in with elastic bounce
- Multiple particle layers (sparkles, stars, light beams)
- Streak counter if consecutive daily logins
- New unlock preview cards sliding in
- Sound trigger integration points
- Tap to dismiss or auto-dismiss after 5 seconds

**Props Interface:**
```typescript
interface LevelUpCelebrationProps {
  visible: boolean;
  oldLevel: number;
  newLevel: number;
  unlocksEarned: Array<{
    type: 'building' | 'feature' | 'reward';
    name: string;
    icon: string; // FontAwesome5 icon name
    description: string;
  }>;
  onDismiss: () => void;
}
```

**Animation Sequence (6 seconds total):**

1. **Opening (0-800ms):**
   - Overlay fades in (300ms)
   - Starburst rays shoot out from center (8 rays, golden gradient)
   - Scale from 0 to screen width
   - Rotate continuously during celebration

2. **Level Number (800-1500ms):**
   - Giant level number appears
   - Scale: 0 → 1.5 → 1.0 with elastic bounce
   - Glow pulse effect (golden halo)
   - Rotate slightly (-5deg to 5deg wobble)

3. **Particle Burst (1000-4000ms):**
   - Layer 1: 50 golden sparkles from center (random trajectories)
   - Layer 2: 30 star shapes rotating while moving outward
   - Layer 3: 20 light beam streaks (fast, linear paths)
   - All particles fade out after 3s

4. **Unlocks Preview (2000-4500ms):**
   - Cards slide in from bottom (stagger by 200ms)
   - Each card: icon + name + description
   - Cards have subtle float animation (up/down 10px)
   - Maximum 3 unlocks shown (if more, show "+ X more")

5. **Dismiss Prompt (4500-5000ms):**
   - "Tap to continue" text fades in at bottom
   - Pulsing animation (opacity 0.7 → 1.0)

**Visual Design:**

```typescript
const COLORS = {
  starburst: ['#FFD700', '#FFA500', '#FF8C00'], // Golden gradient
  particle1: '#FFFF00', // Bright yellow sparkles
  particle2: '#FFA500', // Orange stars
  particle3: '#FFFFFF', // White light beams
  levelText: '#FFD700',
  levelGlow: 'rgba(255, 215, 0, 0.5)',
};
```

**Unlock Card Component:**
```typescript
const UnlockCard: React.FC<{ unlock: Unlock; delay: number }> = ({ unlock, delay }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in from bottom with delay
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1500 }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500 }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }, { translateY: floatAnim }] }}>
      {/* Card content */}
    </Animated.View>
  );
};
```

**Integration Note:**
```typescript
// TODO (Integration): Trigger when user levels up
// Location: src/context/AuthContext.tsx - after XP update causes level up
// Example: if (newLevel > oldLevel) setShowLevelUpCelebration(true)
```

---

### Priority 2: Interactive Building Card Component

**Location:** `/mobile-app/src/components/InteractiveBuildingCard.tsx` (create new file)

**What to Build:**
Enhanced building card with 3D-like tilt effect, glow animations, and interactive states.

**Requirements:**
- Responds to press/hold with scale and tilt
- Production ready glow pulse (animated border)
- Collection ready bounce animation
- Upgrade available shimmer effect
- Level badge with pop-in animation
- Production progress radial fill
- Gesture-based rotation (optional advanced feature)

**Props Interface:**
```typescript
interface InteractiveBuildingCardProps {
  buildingType: 'film-room' | 'practice-field' | 'stadium' | 'locker-room';
  level: number;
  isProducing: boolean;
  isUpgrading: boolean;
  canCollect: boolean;
  canUpgrade: boolean;
  productionProgress: number; // 0-100
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}
```

**Interactive States:**

1. **Idle State:**
   - Subtle float animation (±5px vertical, 3s loop)
   - Production glow pulse if producing (2s loop)

2. **Press State:**
   - Scale to 0.95 immediately
   - Slight rotation tilt toward touch point (3D effect simulation)
   - Shadow depth increases

3. **Collection Ready:**
   - Aggressive glow pulse (green/gold)
   - Bounce animation every 3s
   - Particle sparkles around border

4. **Upgrade Available:**
   - Shimmer wave moving across card (3s loop)
   - Corner badge "UPGRADE!" with bounce
   - Blue glow pulse

5. **Upgrading State:**
   - Construction overlay (semi-transparent)
   - Progress spinner
   - Reduced opacity (0.7)

**Tilt Effect Implementation:**
```typescript
const handlePressIn = (event: GestureResponderEvent) => {
  const { locationX, locationY } = event.nativeEvent;
  const centerX = cardWidth / 2;
  const centerY = cardHeight / 2;

  // Calculate tilt based on touch position
  const tiltX = ((locationY - centerY) / centerY) * 10; // Max ±10deg
  const tiltY = ((locationX - centerX) / centerX) * -10;

  Animated.parallel([
    Animated.spring(scale, { toValue: 0.95 }),
    Animated.spring(rotateX, { toValue: `${tiltX}deg` }),
    Animated.spring(rotateY, { toValue: `${tiltY}deg` }),
  ]).start();
};
```

**Radial Progress Fill:**
```typescript
// Use react-native-svg for circular progress
import Svg, { Circle } from 'react-native-svg';

const radius = 50;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference - (productionProgress / 100) * circumference;

<Svg>
  <Circle
    cx={radius}
    cy={radius}
    r={radius}
    stroke={COLORS.primary}
    strokeWidth={4}
    strokeDasharray={circumference}
    strokeDashoffset={strokeDashoffset}
    fill="transparent"
  />
</Svg>
```

---

### Priority 3: Premium Currency Shop Modal

**Location:** `/mobile-app/src/components/PremiumShopModal.tsx` (create new file)

**What to Build:**
Beautiful shop interface for premium currency (KP) purchases with shimmer cards and purchase animations.

**Requirements:**
- Full-screen modal with gradient background
- Grid of purchase packages (2 columns)
- "Best Value" badge on featured package
- Shimmer effect on package cards
- Purchase button with loading state
- Success animation after purchase
- Restore purchases button (iOS)

**Props Interface:**
```typescript
interface PremiumShopModalProps {
  visible: boolean;
  packages: Array<{
    id: string;
    kpAmount: number;
    priceUSD: string;
    bonusPercent?: number; // e.g., 20 for 20% bonus
    isFeatured?: boolean;
    icon: string; // FontAwesome5 icon
  }>;
  onPurchase: (packageId: string) => Promise<void>;
  onClose: () => void;
}
```

**Package Card Design:**
```typescript
const PackageCard: React.FC<{ package: Package }> = ({ package: pkg }) => {
  return (
    <LinearGradient
      colors={pkg.isFeatured ? ['#FFD700', '#FFA500'] : ['#4A90E2', '#357ABD']}
      style={styles.packageCard}
    >
      {/* Best Value Badge */}
      {pkg.isFeatured && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BEST VALUE</Text>
        </View>
      )}

      {/* Icon */}
      <FontAwesome5 name={pkg.icon} size={40} color="#FFF" />

      {/* Amount */}
      <Text style={styles.amount}>{pkg.kpAmount.toLocaleString()} KP</Text>

      {/* Bonus */}
      {pkg.bonusPercent && (
        <Text style={styles.bonus}>+{pkg.bonusPercent}% BONUS</Text>
      )}

      {/* Price */}
      <Text style={styles.price}>{pkg.priceUSD}</Text>

      {/* Purchase Button */}
      <AnimatedButton
        variant="success"
        onPress={() => onPurchase(pkg.id)}
      >
        Purchase
      </AnimatedButton>
    </LinearGradient>
  );
};
```

**Purchase Success Animation:**
- Coin burst from package card center
- Package card scales up then fades out
- Success toast slides in
- KP counter in header animates up

**Integration Note:**
```typescript
// TODO (Integration): Connect to in-app purchase system
// Location: src/services/iap.ts (to be created)
// Example: await purchasePackage(packageId) then update user KP
```

---

### Priority 4: Video Asset Components & Placeholders

**Location:** Create multiple files in `/mobile-app/src/components/media/`

**What to Build:**
Video player components and beautiful video placeholders for lesson content.

#### File 1: `VideoPlayer.tsx`

**Requirements:**
- expo-av video player wrapper
- Custom controls overlay
- Progress bar with scrubbing
- Play/pause button with animation
- Fullscreen toggle
- Playback speed controls (0.5x, 1x, 1.5x, 2x)
- Picture-in-picture support hint
- Quality selector placeholder

**Props Interface:**
```typescript
interface VideoPlayerProps {
  videoUri: string;
  thumbnailUri?: string;
  title?: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void; // 0-100
  autoPlay?: boolean;
  initialPlaybackSpeed?: number;
}
```

**Controls Overlay:**
```typescript
const ControlsOverlay: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (visible && isPlaying) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
        }).start(() => setVisible(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, isPlaying]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Play/Pause */}
      {/* Progress Bar */}
      {/* Fullscreen */}
      {/* Speed */}
    </Animated.View>
  );
};
```

#### File 2: `VideoThumbnail.tsx`

**Requirements:**
- Beautiful thumbnail with gradient overlay
- Play button with pulse animation
- Duration badge (bottom right)
- Lock icon if not unlocked
- Progress bar if partially watched
- Hover/press state with scale

**Props Interface:**
```typescript
interface VideoThumbnailProps {
  thumbnailUri: string;
  duration: number; // seconds
  isLocked: boolean;
  watchProgress?: number; // 0-100
  onPress: () => void;
  style?: ViewStyle;
}
```

---

### Priority 5: Audio Assets & Sound Effects

**Location:** `/mobile-app/assets/sounds/`

**What to Create:**
High-quality sound effects for enhanced game feel. If you can't create actual audio files, provide detailed specifications for sound design.

**Required Sound Effects:**

1. **collect_coin.mp3** (200-300ms)
   - Bright, metallic chime
   - Frequency: Start at 800Hz, glide to 1200Hz
   - Amplitude envelope: Quick attack, short sustain, medium decay
   - Effect: Light reverb, slight pitch variation for randomness
   - Reference: Mario coin sound but more modern

2. **upgrade_start.mp3** (400-500ms)
   - Ascending synth whoosh
   - Start: 200Hz bass rumble
   - End: 1500Hz bright tone
   - Layer: Mechanical "clunk" at beginning
   - Effect: Filter sweep (low-pass to high-pass)

3. **upgrade_complete.mp3** (800ms-1s)
   - Triumphant fanfare
   - Three-note melody: C5 → E5 → G5
   - Bright brass/synth timbre
   - Accompanied by sparkle layer
   - Effect: Slight reverb, stereo widening

4. **drill_plant.mp3** (300ms)
   - Earthy impact sound
   - Frequencies: 100-400Hz
   - Texture: Short, punchy
   - Layer: Subtle "sprout" sound (high frequency pop)

5. **drill_harvest.mp3** (500ms)
   - Satisfying collection sound
   - Combine: Rustle (200-800Hz) + chime (1000Hz+)
   - Effect: Pan slightly left to right

6. **button_tap.mp3** (100-150ms)
   - Crisp, clean tap
   - Single sine wave at 800Hz
   - Very short decay
   - Effect: Tiny bit of saturation

7. **error.mp3** (400ms)
   - Descending "denied" sound
   - Start: 600Hz
   - End: 200Hz (quick glide down)
   - Texture: Slightly harsh/buzzy
   - Effect: Brief distortion

8. **level_up.mp3** (2s) **NEW**
   - Epic fanfare
   - Multi-layer orchestral hit
   - Frequencies: Full spectrum (80Hz bass to 8kHz shimmer)
   - Progression: Impact → Swell → Sparkle tail
   - Effect: Large hall reverb

9. **achievement_unlock.mp3** (1.5s) **NEW**
   - Magical unlock sound
   - Bell tree cascade (descending pitches)
   - Frequencies: 2000Hz → 500Hz
   - Layer: Subtle "unlock" mechanism click
   - Effect: Stereo spread, long reverb tail

10. **energy_refill.mp3** (600ms) **NEW**
    - Electric charging sound
    - Rising frequency sweep: 300Hz → 1500Hz
    - Pulsing rhythm (3 pulses)
    - Layer: Subtle electric crackle
    - Effect: Phaser/flanger for motion

**Sound Specifications File:**
If creating actual audio, also create `/mobile-app/assets/sounds/SPECIFICATIONS.md` documenting:
- Sample rate: 44.1kHz
- Bit depth: 16-bit
- Format: MP3, 192kbps
- Channels: Stereo (mono acceptable for short SFX)
- Normalization: -3dB peak
- File size target: <50KB each

---

### Priority 6: Illustration Assets

**Location:** `/mobile-app/assets/illustrations/`

**What to Create:**
SVG illustrations for empty states, onboarding, and error screens.

**Required Illustrations:**

1. **empty_achievements.svg**
   - Trophy on pedestal with question marks
   - Subtle dust particles around it
   - Muted colors (grays with hints of gold)
   - Size: 300x300px artboard
   - Message: "No achievements yet!"

2. **empty_buildings.svg**
   - Construction blueprint with dotted lines
   - Hard hat and tools nearby
   - Optimistic colors (blues and oranges)
   - Size: 300x300px artboard
   - Message: "Build your football empire!"

3. **connection_error.svg**
   - Broken wifi symbol
   - Sad cloud character
   - Friendly, not alarming
   - Size: 300x300px artboard
   - Message: "Connection lost"

4. **onboarding_welcome.svg**
   - Football field aerial view
   - Stadium lights shining
   - Excited crowd silhouettes
   - Vibrant colors (greens, blues, golds)
   - Size: 400x400px artboard
   - Message: Welcome screen

5. **onboarding_buildings.svg**
   - Isometric building icons
   - Arrows showing upgrade paths
   - Growth metaphor
   - Size: 400x400px artboard
   - Message: "Build & Upgrade"

6. **onboarding_learn.svg**
   - Film reel with play button
   - Brain with light bulb
   - Knowledge theme
   - Size: 400x400px artboard
   - Message: "Learn from legends"

**Style Guidelines:**
- Flat illustration style with subtle gradients
- Consistent color palette from theme.ts
- Rounded, friendly shapes
- 2-3 colors max per illustration
- Export as optimized SVG (<50KB each)

If you can't create actual SVGs, provide detailed descriptions and dimensions for each asset, noting they should be created by a designer.

---

### Priority 7: Micro-Interaction Components

**Location:** `/mobile-app/src/components/microinteractions/`

Create small, delightful interaction components.

#### File 1: `PullToRefresh.tsx`

**Requirements:**
- Custom pull-to-refresh animation
- Football spinning while loading
- Grass growing/shrinking during pull
- Completion checkmark animation

**Props Interface:**
```typescript
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}
```

#### File 2: `SwipeToDelete.tsx`

**Requirements:**
- Swipe gesture to reveal delete action
- Red background slides in
- Trash icon grows as swipe progresses
- Haptic feedback at delete threshold
- Bounce back if not swiped far enough

**Props Interface:**
```typescript
interface SwipeToDeleteProps {
  onDelete: () => void;
  children: React.ReactNode;
  threshold?: number; // Default 0.7 (70% of width)
}
```

#### File 3: `HeartLikeButton.tsx`

**Requirements:**
- Heart icon that pops when liked
- Particle burst on like
- Color transition (gray → red)
- Scale animation with overshoot
- Saves liked state

**Props Interface:**
```typescript
interface HeartLikeButtonProps {
  initialLiked: boolean;
  onLikeChange: (liked: boolean) => void;
  size?: number;
}
```

---

## Development Standards

**Code Quality:**
- TypeScript strict mode compliance
- All props interfaces exported
- Comprehensive JSDoc comments
- Error boundary wrapping for complex components
- Performance: Use React.memo for expensive renders
- Accessibility: Add accessible labels and hints

**Animation Performance:**
- Always use `useNativeDriver: true` when possible
- Avoid animating layout properties (use transform instead)
- Implement shouldComponentUpdate for list items
- Use LayoutAnimation for simple layouts

**Testing Preparation:**
- Add test IDs to all interactive elements
- Structure components for easy unit testing
- Keep business logic separate from presentation

**File Organization:**
```
src/components/
├── media/
│   ├── VideoPlayer.tsx
│   └── VideoThumbnail.tsx
├── microinteractions/
│   ├── PullToRefresh.tsx
│   ├── SwipeToDelete.tsx
│   └── HeartLikeButton.tsx
├── LevelUpCelebration.tsx
├── InteractiveBuildingCard.tsx
└── PremiumShopModal.tsx

assets/
├── sounds/
│   ├── *.mp3 (10 files)
│   └── SPECIFICATIONS.md
└── illustrations/
    └── *.svg (6 files)
```

---

## Git Workflow (IMPORTANT)

**Before Starting:**
```bash
git pull origin main
```

**While Working:**
- Commit after each component is complete
- Test each component in isolation if possible
- Clear commit messages describing the feature

**Example Commit:**
```bash
git add .
git commit -m "feat(mobile): Add LevelUpCelebration with multi-layer particle effects

- Full-screen celebration with starburst rays
- Elastic bounce level number animation
- Three particle layers (sparkles, stars, beams)
- Unlock preview cards with float animation
- Auto-dismiss after 5s or tap to continue
- Integration points documented for user level up

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

**When Finished:**
Push all changes and I'll handle the integration into HQScreen and other screens.

---

## Integration TODOs (For Me - Claude)

When you complete components, I will:

1. **LevelUpCelebration:**
   - Integrate into AuthContext when XP causes level up
   - Add sound trigger for level_up.mp3
   - Store unlocks earned per level in database

2. **InteractiveBuildingCard:**
   - Replace current building cards in HQScreen
   - Connect production progress from database
   - Wire up upgrade/collect handlers

3. **PremiumShopModal:**
   - Create IAP service wrapper
   - Add shop button to header
   - Implement purchase flow with Supabase

4. **Video Components:**
   - Integrate into FilmRoomModal
   - Track watch progress in database
   - Implement unlock logic

5. **Micro-interactions:**
   - Add pull-to-refresh to HQScreen
   - Implement swipe-to-delete in mission lists
   - Add like buttons to lesson content

---

## Questions or Blockers?

**For Clarification:**
1. Reference existing components for patterns (Toast, AnimatedButton)
2. Check theme.ts for color constants
3. Use react-native-reanimated for all animations
4. Add TODO comments for integration points

**For Assets:**
- Sounds: If you can't create actual audio, detailed specs are perfect
- Illustrations: Detailed descriptions work if SVG creation isn't possible
- I'll coordinate with designers for final assets if needed

**Communication:**
- Add clear TODO comments showing where to integrate
- Document all props and expected behavior
- Note any external dependencies needed

---

## Success Metrics

By the end of Phase 4, we'll have:
- ✅ Premium-quality celebration animations
- ✅ Interactive building cards with production visualization
- ✅ Complete sound library (10 effects)
- ✅ Full illustration set (6 screens)
- ✅ Video playback infrastructure
- ✅ Micro-interactions for polish
- ✅ Foundation for IAP system

This phase will transform the app from functional to premium, creating a delightful user experience that drives engagement.

---

## Recommended Build Order

**Day 1-2:**
1. LevelUpCelebration (most complex, high impact)
2. Sound effect specifications (or actual files)

**Day 3-4:**
3. InteractiveBuildingCard (core feature enhancement)
4. Micro-interactions (HeartLikeButton, SwipeToDelete)

**Day 5-6:**
5. Video components (VideoPlayer, VideoThumbnail)
6. PremiumShopModal

**Day 7:**
7. Illustration assets (or detailed specs)
8. PullToRefresh
9. Final testing and documentation

Take your time with each component - quality over speed. Each piece should be production-ready and well-tested.

Looking forward to these amazing features! 🚀
