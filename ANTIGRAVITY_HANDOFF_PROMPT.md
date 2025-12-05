# Antigravity Session Handoff Prompt

## Project: Kickoff Club HQ

### Quick Context
**Kickoff Club HQ** is a dual-platform EdTech SaaS for professional football training:
- **Web Platform**: Next.js 14 + TypeScript + Supabase + Stripe (production-ready)
- **Mobile App**: React Native Expo 54 + TypeScript (active development)

**Current Branch**: `claude/antigravity-query-prompt-01FLoreWiU34LdzuHh642nqQ`

---

## Recent Completed Work (Last Session)

1. ✅ **Toast Integration in HQScreen** - Replaced 7 Alert.alert calls with branded Toast notifications
2. ✅ **Toast Integration in MatchScreen** - Replaced 3 Alert.alert calls
3. ✅ **Toast Integration in SignInScreen** - Replaced 2 Alert.alert calls
4. ✅ **Fixed LearnScreen syntax errors** - Corrected style props and state variables
5. ✅ **Fixed FontAwesome5 icon** - Changed "football" to "football-ball" in MatchScreen

---

## Immediate Priority Tasks

### 1. Continue Alert.alert → Toast Migration (11 screens remaining)

**Pattern to follow** (established in HQScreen/MatchScreen/SignInScreen):
```tsx
// 1. Import Toast component
import Toast from '../../components/Toast';

// 2. Add toast state
const [toasts, setToasts] = useState<Array<{id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'}>>([]);

// 3. Add showToast function
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  const id = Date.now().toString();
  setToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 3000);
};

// 4. Replace Alert.alert calls:
// Before: Alert.alert('Error', 'Something went wrong');
// After: showToast('Something went wrong', 'error');

// 5. Add Toast rendering in return (include in all conditional returns!)
{toasts.map(toast => (
  <Toast
    key={toast.id}
    message={toast.message}
    type={toast.type}
    onDismiss={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
  />
))}
```

**Remaining screens** (priority order):
1. `mobile-app/src/screens/Auth/SignUpScreen.tsx`
2. `mobile-app/src/screens/Auth/ForgotPasswordScreen.tsx`
3. `mobile-app/src/screens/Main/ProfileScreen.tsx`
4. `mobile-app/src/screens/Main/ShopScreen.tsx`
5. `mobile-app/src/screens/Main/LessonPlayerScreen.tsx`
6. `mobile-app/src/screens/Main/CourseDetailScreen.tsx`
7. `mobile-app/src/screens/Main/PracticeFieldScreen.tsx`
8. `mobile-app/src/screens/Main/PracticeFieldScreen_v2.tsx`
9. `mobile-app/src/screens/Main/PracticeFieldScreen_Farmville.tsx`
10. `mobile-app/src/screens/Main/SquadScreen.tsx`
11. `mobile-app/src/screens/Main/PredictScreen.tsx`

---

### 2. Phase 3 Integration - Resolve Blockers

**BuildingConstructionOverlay** (blocked on DB schema):
- Needs `upgrade_started_at` timestamp column in `user_buildings` table
- Once added, integrate into HQScreen building upgrade flow

**AchievementCelebration** (blocked on achievement system):
- Needs `achievements` and `user_achievements` tables
- Trigger celebration when user unlocks achievement

---

### 3. Phase 4 Premium Features (Ready for Development)

From `PHASE_4_TASKS.md`:
1. **LevelUpCelebration** - 6-second epic animation with confetti
2. **InteractiveBuildingCard** - 3D tilt effects + radial progress fill
3. **PremiumShopModal** - IAP shop with shimmer cards
4. **VideoPlayer Components** - Custom playback controls
5. **Audio Assets** - 10 sound effects (44.1kHz, 16-bit, MP3)
6. **Illustration Assets** - 6 SVG illustrations for empty states
7. **Micro-Interactions** - PullToRefresh, SwipeToDelete, HeartLikeButton

---

## Key File Locations

### Mobile App
- **Screens**: `mobile-app/src/screens/`
- **Components**: `mobile-app/src/components/`
- **Animations**: `mobile-app/src/components/animations/`
- **Toast Component**: `mobile-app/src/components/Toast.tsx`

### Progress Tracking
- `TODO.md` - Overall task list
- `INTEGRATION_PROGRESS.md` - Mobile component integration status
- `PHASE_3_TASKS.md` - Phase 3 detailed tasks
- `PHASE_4_TASKS.md` - Phase 4 detailed tasks
- `FEATURES-PROGRESS.md` - Feature implementation status

---

## Development Notes

1. **Always commit and push** to branch `claude/antigravity-query-prompt-01FLoreWiU34LdzuHh642nqQ`
2. **Test in Expo Go** after changes
3. **Update INTEGRATION_PROGRESS.md** when completing integrations
4. **Use existing patterns** - check HQScreen for established conventions

---

## Suggested Session Flow

1. Start with **SignUpScreen + ForgotPasswordScreen** Toast migration (auth flow consistency)
2. Move to **ProfileScreen + ShopScreen** (high-traffic screens)
3. Document progress in `INTEGRATION_PROGRESS.md`
4. If time permits, tackle Phase 4 components

Good luck! 🚀
