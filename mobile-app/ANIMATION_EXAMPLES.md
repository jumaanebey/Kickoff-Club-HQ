# FarmVille-Style Animation Examples

This guide shows you how to add polished, FarmVille-style animations to Kickoff Club HQ.

## 📦 What's Installed

- **Lottie** - For complex After Effects animations
- **React Native Reanimated** - For performant native animations
- **Expo Haptics** - For tactile feedback

## 🎨 Animation Components

### 1. Animated Coin Collection

Shows coins flying from a building to the coin counter with a parabolic arc.

```tsx
import { AnimatedCoinCollect } from '@/components/animations';

function BuildingCard() {
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const handleCollect = () => {
    setShowCoinAnimation(true);
    // Update coin balance in database
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCollect}>
        <Text>Collect 50 Coins</Text>
      </TouchableOpacity>

      {showCoinAnimation && (
        <AnimatedCoinCollect
          amount={50}
          startX={100}
          startY={200}
          onComplete={() => setShowCoinAnimation(false)}
        />
      )}
    </View>
  );
}
```

### 2. Animated Building Upgrade

Flashes, scales, and crossfades between building levels.

```tsx
import { AnimatedBuildingUpgrade } from '@/components/animations';

function UpgradeButton() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    // Deduct coins in database
  };

  return (
    <View>
      {isUpgrading ? (
        <AnimatedBuildingUpgrade
          buildingType="practice_field"
          fromLevel={1}
          toLevel={2}
          onComplete={() => {
            setIsUpgrading(false);
            // Refresh building data
          }}
        />
      ) : (
        <Image source={getBuildingAsset('practice_field', 1)} />
      )}
    </View>
  );
}
```

### 3. Animated Button

Every button should have juice! Scale down on press, spring back on release.

```tsx
import { AnimatedButton } from '@/components/animations';

function UpgradeScreen() {
  return (
    <AnimatedButton
      onPress={() => console.log('Upgrade!')}
      hapticFeedback={true}
      style={styles.upgradeButton}
    >
      <Text style={styles.buttonText}>Upgrade Building</Text>
      <Image source={require('@/assets/icons/actions/upgrade@3x.png')} />
    </AnimatedButton>
  );
}
```

## 🛠 Custom Animations

Use the animation utilities for custom effects:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SpringPresets } from '@/utils/animations';

function CustomAnimation() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // Use preset spring config
    scale.value = withSpring(1.2, SpringPresets.bouncy);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Text>Tap me!</Text>
    </Animated.View>
  );
}
```

## 🎯 Where to Add Animations

### High Priority (Max FarmVille Juice)

1. **Collecting from Buildings**
   - Coin fly animation
   - Building bounce
   - Haptic feedback

2. **Upgrading Buildings**
   - Flash effect
   - Crossfade levels
   - Celebration haptic

3. **Training Units**
   - Progress bar fill
   - Character animations
   - Completion burst

4. **Match Simulations**
   - Score count-up
   - Team movement
   - Touchdown celebrations

5. **Mission Completion**
   - Checkmark animation
   - Reward reveal
   - Confetti burst

### Medium Priority

6. **Button Presses** - All buttons should scale/bounce
7. **Screen Transitions** - Slide/fade between screens
8. **Card Reveals** - Flip animation for new items
9. **Stat Changes** - Count-up animations for numbers
10. **Energy Refill** - Fill animation with particles

### Low Priority (Polish)

11. **Idle Animations** - Subtle breathing on characters
12. **Background Parallax** - Depth effect on HQ view
13. **Weather Effects** - Rain/snow on match days
14. **Ambient Animations** - Clouds moving, flags waving

## 📊 Performance Tips

1. **Use `useSharedValue`** - Runs on UI thread (60fps)
2. **Avoid re-renders** - Don't use `useState` for animation values
3. **Limit particles** - Max 20-30 particles at once
4. **Preload images** - Use `Image.prefetch()` for smoother animations
5. **Test on real devices** - Simulators lie about performance

## 🎬 Lottie Animations

For complex animations from After Effects:

1. Export from After Effects as Lottie JSON
2. Place in `/assets/animations/`
3. Use LottieView component:

```tsx
import LottieView from 'lottie-react-native';

function CelebrationAnimation() {
  return (
    <LottieView
      source={require('@/assets/animations/confetti.json')}
      autoPlay
      loop={false}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## 🔊 Sound Effects

Pair animations with sounds for maximum impact:

```tsx
import { Audio } from 'expo-av';

async function playCollectSound() {
  const { sound } = await Audio.Sound.createAsync(
    require('@/assets/sounds/coin_collect.mp3')
  );
  await sound.playAsync();
}
```

## 🎮 Haptics Reference

```tsx
import * as Haptics from 'expo-haptics';

// Light tap (button press)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium impact (coin collect)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy impact (building upgrade)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success notification (mission complete)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error notification (not enough coins)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

**Now go make this app compete with FarmVille! 🚀**
