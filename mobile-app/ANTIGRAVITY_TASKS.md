# Antigravity - Next Priority Tasks

Great work on the polish enhancements! I've successfully integrated CoinFountain, SoundManager, and screen shake into the HQ screen. The game feel is significantly improved.

## Current Status

**Successfully Integrated:**
- ✅ CoinFountain.tsx - Physics-based coin burst animation
- ✅ SoundManager.ts - Enhanced sound system with preloading
- ✅ screenShake.ts - Screen shake hook with haptic feedback
- ✅ BuildingUpgradeTimer.tsx - Animated upgrade countdown

**Built but Not Yet Integrated:**
- ⏳ TutorialOverlay.tsx - Tutorial system component
- ⏳ BuildingCard.tsx - Enhanced building card component

---

## Priority 1: Sound Effect Files (CRITICAL - BLOCKING)

The SoundManager is integrated and working, but needs actual MP3 files to enable audio.

### Task: Create or Source Sound Effects

**Location:** `/mobile-app/assets/sounds/` (create this directory)

**Required Sound Files:**
1. `collect_coin.mp3` - Played when collecting coins from buildings
2. `xp_gain.mp3` - Played when collecting KP (knowledge points)
3. `upgrade_start.mp3` - Played when starting a building upgrade
4. `upgrade_complete.mp3` - Played when upgrade finishes
5. `button_tap.mp3` - Generic button tap feedback
6. `error.mp3` - Error or invalid action sound

**Requirements:**
- Short duration (0.2s - 1s max)
- Small file size (< 50KB each preferred)
- Mobile-friendly format (MP3, 44.1kHz, mono is fine)
- Pleasant, game-appropriate tones (not jarring)

**Resources:**
- Free game sound effects: https://freesound.org/
- AI-generated sounds: https://soundraw.io/
- Game audio packs: https://itch.io/game-assets/free/tag-sound-effects

**Implementation:**
1. Create directory: `mobile-app/assets/sounds/`
2. Add the 6 MP3 files listed above
3. Update `SoundManager.ts` by uncommenting lines 4-11:
```typescript
const SOUND_FILES = {
    collect_coin: require('../../assets/sounds/collect_coin.mp3'),
    xp_gain: require('../../assets/sounds/xp_gain.mp3'),
    upgrade_start: require('../../assets/sounds/upgrade_start.mp3'),
    upgrade_complete: require('../../assets/sounds/upgrade_complete.mp3'),
    button_tap: require('../../assets/sounds/button_tap.mp3'),
    error: require('../../assets/sounds/error.mp3'),
};
```
4. Test all sounds work in the app

---

## Priority 2: Tutorial Content System

The TutorialOverlay component exists but needs content and integration planning.

### Task: Create Tutorial Step Definitions

**Location:** `/mobile-app/src/data/tutorialSteps.ts` (create new file)

**What to Build:**
Create a structured data file defining all tutorial steps for the onboarding flow.

**Tutorial Flow Outline:**
1. Welcome to Kickoff Club HQ
2. This is your football field - build facilities here
3. Tap a building to see details
4. Collect coins when ready (point to building with ready collection)
5. Use coins to upgrade buildings
6. Higher level buildings produce more resources
7. Build your empire and become a football legend!

**Data Structure:**
```typescript
export interface TutorialStep {
  id: string;
  title: string;
  message: string;
  position?: { x: number; y: number }; // Highlight position
  highlightTarget?: string; // Building ID or UI element to highlight
  action?: 'tap' | 'collect' | 'upgrade'; // Required action to proceed
  order: number;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kickoff Club HQ!',
    message: 'Build and upgrade facilities to grow your football empire.',
    order: 1,
  },
  // ... add remaining steps
];
```

**Deliverable:**
- New file: `src/data/tutorialSteps.ts`
- At least 7 tutorial steps covering basic gameplay
- Clear, concise messages (1-2 sentences each)
- Proper TypeScript types

---

## Priority 3: Loading Skeletons

Add skeleton loaders for better UX during data fetches.

### Task: Create BuildingCardSkeleton Component

**Location:** `/mobile-app/src/components/BuildingCardSkeleton.tsx` (create new file)

**What to Build:**
A skeleton loader that matches the BuildingCard layout, shown while building data is loading.

**Requirements:**
- Match BuildingCard dimensions and layout
- Use react-native-reanimated for shimmer animation
- Should show placeholders for:
  - Building image area
  - Building name
  - Level indicator
  - Stats (coins, KP)
  - Action button area

**Animation:**
- Subtle shimmer effect (light to slightly lighter gray)
- 1.5s animation duration
- Infinite repeat

**Reference:**
Look at how BuildingUpgradeTimer uses Reanimated for smooth animations.

---

## Priority 4: Enhanced Tutorial Popovers

Create tutorial tooltip components for pointing to specific UI elements.

### Task: Create TutorialTooltip Component

**Location:** `/mobile-app/src/components/TutorialTooltip.tsx` (create new file)

**What to Build:**
A pointing tooltip that can highlight and annotate any UI element.

**Features:**
- Arrow/pointer that points to target element
- Animated entrance (fade + slide)
- Pulsing highlight on target element
- "Got it" or "Next" button
- Support for 4 arrow positions: top, bottom, left, right

**Props Interface:**
```typescript
interface TutorialTooltipProps {
  message: string;
  targetPosition: { x: number; y: number };
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
  onDismiss: () => void;
  visible: boolean;
}
```

---

## Priority 5: Building Drag-and-Drop (Phase 2)

Add ability to rearrange buildings on the field.

### Task: Create DraggableBuilding Wrapper

**Location:** `/mobile-app/src/components/DraggableBuilding.tsx` (create new file)

**What to Build:**
A wrapper component using react-native-gesture-handler that makes buildings draggable.

**Requirements:**
- Use `PanGestureHandler` from react-native-gesture-handler
- Snap to grid positions (GRID_SIZE = 120)
- Visual feedback: scale up slightly while dragging
- Haptic feedback on drop
- Cannot overlap other buildings
- Smooth animation to final position

**Resources:**
- React Native Gesture Handler docs: https://docs.swmansion.com/react-native-gesture-handler/
- React Native Reanimated for smooth animations

**Props Interface:**
```typescript
interface DraggableBuildingProps {
  children: React.ReactNode;
  buildingId: string;
  initialPosition: { x: number; y: number };
  onDragEnd: (newPosition: { x: number; y: number }) => void;
  gridSize: number;
}
```

---

## General Guidelines

**Development Standards:**
- Use TypeScript for all new files
- Follow existing code style (check other components)
- Use react-native-reanimated for animations (NOT Animated API)
- Use existing theme constants from `src/constants/theme.ts`
- Test on both iOS and Android if possible
- Keep components performant (avoid unnecessary re-renders)

**Git Workflow:**
1. Pull latest changes before starting: `git pull origin main`
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push to remote: `git push origin main`

**File Organization:**
- Components go in `/src/components/`
- Utilities go in `/src/utils/`
- Data/content goes in `/src/data/`
- Types go in `/src/types/` or inline with components

**Communication:**
- Commit and push your work regularly
- Add TODO comments for things you're unsure about
- Reference file paths when describing your work
- Create this same type of task document for me if you need specific integration work

---

## Questions or Blockers?

If you encounter any issues:
1. Check existing components for examples
2. Review TypeScript errors carefully
3. Test incrementally (don't build everything before testing)
4. Leave clear comments about any uncertainties

Good luck! Start with Priority 1 (sound files) as it's blocking full audio functionality.
