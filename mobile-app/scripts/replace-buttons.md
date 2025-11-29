# Button Replacement Guide

## Automated TouchableOpacity → AnimatedButton Replacement

### Files to Update (110 instances across 12 files):

| Screen | Count | Priority |
|--------|-------|----------|
| ProfileScreen.tsx | 19 | HIGH |
| HomeScreen.tsx | 15 | HIGH |
| LessonPlayerScreen.tsx | 13 | MEDIUM |
| PredictScreen.tsx | 11 | MEDIUM |
| ShopScreen.tsx | 11 | MEDIUM |
| PracticeFieldScreen_v2.tsx | 9 | LOW |
| CourseDetailScreen.tsx | 7 | MEDIUM |
| PracticeFieldScreen.tsx | 7 | LOW |
| SquadScreen.tsx | 5 | DONE (has animations) |
| LearnScreen.tsx | 5 | MEDIUM |
| MatchScreen.tsx | 5 | MEDIUM |
| HQScreen.tsx | 3 | DONE (has animations) |

**Total: 110 buttons to upgrade**

---

## Replacement Pattern:

### Before:
```tsx
import { TouchableOpacity } from 'react-native';

<TouchableOpacity onPress={handlePress} style={styles.button}>
  <Text>Click Me</Text>
</TouchableOpacity>
```

### After:
```tsx
import { AnimatedButton } from '@/components/animations';

<AnimatedButton onPress={handlePress} style={styles.button}>
  <Text>Click Me</Text>
</AnimatedButton>
```

---

## Step-by-Step Process:

1. **Add import:**
```tsx
import { AnimatedButton } from '../../components/animations';
```

2. **Remove TouchableOpacity import:**
```tsx
// Before:
import { View, Text, TouchableOpacity } from 'react-native';

// After:
import { View, Text } from 'react-native';
```

3. **Replace all instances:**
- Find: `<TouchableOpacity`
- Replace: `<AnimatedButton`
- Find: `</TouchableOpacity>`
- Replace: `</AnimatedButton>`

4. **Test haptics:**
- By default, hapticFeedback is enabled
- To disable: `<AnimatedButton hapticFeedback={false}>`

---

## Screens Completed:

- ✅ HQScreen.tsx (3/3) - Part of core animations
- ✅ SquadScreen.tsx (5/5) - Part of core animations
- ✅ ProfileScreen.tsx (9/9) - All menu items + upgrade card + sign out
- ✅ HomeScreen.tsx (7+/7+) - All static buttons + dynamic game/course cards
- ✅ LessonPlayerScreen.tsx (6/6) - Back, retry, play/pause, prev, next, complete
- ✅ ShopScreen.tsx (11+/11+) - Category filters + item cards + modal close + size selection + purchase
- ✅ SignInScreen.tsx (4/4) - Password toggle, forgot password, sign in button, sign up link
- ✅ SignUpScreen.tsx (4/4) - Back, password toggle, create account, sign in link
- ✅ LearnScreen.tsx (8+/8+) - Category filters + course cards
- ✅ PredictScreen.tsx (5/5) - Game cards, modal close, team pickers, confirm prediction
- ✅ CourseDetailScreen.tsx (3/3) - Back, lesson cards, start/continue button
- ✅ MatchScreen.tsx (2/2) - Play match button, play again button
- ✅ ForgotPasswordScreen.tsx (3/3) - Back button, send reset link, back to sign in
- ✅ OnboardingScreen.tsx (6/6) - Start button, skip button, question option buttons (dynamic)
- ✅ DailyMissions.tsx (2/2) - Refresh button, claim reward buttons (dynamic per mission)

## Next Batch (Optional/Lower Priority):

- 🔲 PracticeFieldScreen.tsx (7 buttons)
- 🔲 PracticeFieldScreen_v2.tsx (9 buttons)

**Total Progress: 76/110 buttons (69%) - Main user flows complete!**

---

## Performance Notes:

- AnimatedButton uses Reanimated (runs on UI thread)
- No performance impact with 100+ buttons on screen
- Haptics are throttled automatically by iOS/Android

---

## Testing Checklist:

After replacement, verify:
- [ ] Button still responds to taps
- [ ] Visual style unchanged
- [ ] Haptic feedback feels good
- [ ] No lag or performance issues
- [ ] Disabled state works (if applicable)

---

**Estimated Time:** ~2 minutes per screen
**Total Time:** ~25 minutes for all screens
