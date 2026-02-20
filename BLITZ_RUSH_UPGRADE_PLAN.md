# Blitz Rush 3D - Sellable Game Upgrade Plan

## Overview
Transform Blitz Rush 3D from a polished demo into a compelling, monetizable endless runner with strong retention mechanics.

---

## Current State Analysis

### What Already Exists ✅
- **Character System**: 6 characters unlocked by score/games (localStorage)
- **Powerups**: Magnet, Shield, Speed, Multiplier (stackable)
- **Leaderboard**: Supabase real-time integration
- **Achievement System**: `AchievementPopup` component + `use-game-progress.ts`
- **Educational Elements**: Football facts on game over, obstacle labels
- **Polished 3D Graphics**: React Three Fiber with procedural animations
- **Audio & Haptics**: Howler.js integration with haptic feedback

### What's Missing ❌
- Coin shop to spend earned coins
- Daily missions for retention
- Character abilities/upgrades
- In-run milestones with celebrations
- Premium currency for IAP hooks
- Revive system

---

## Implementation Plan

### Phase 1: Coin Shop & Economy (Core)
**Priority: HIGH | Impact: Retention + Monetization Foundation**

#### 1.1 Create Shop UI Component
- New file: `components/games/blitz-rush-3d/ui/Shop.tsx`
- Tabs: "Head Starts", "Upgrades", "Cosmetics"
- Coin balance display with animated counter
- Purchase confirmation dialog

#### 1.2 Shop Items - Head Starts
Spend coins to start with active powerups:

| Item | Cost | Effect |
|------|------|--------|
| Shield Start | 100 coins | Start game with shield active |
| Magnet Start | 150 coins | Start with 8s magnet |
| Speed Start | 200 coins | Start with 5s speed boost |
| Double Combo | 300 coins | Start with 2x multiplier |

#### 1.3 Shop Items - Upgrades (Persistent)
Permanent upgrades that persist across runs:

| Upgrade | Cost | Effect | Max Level |
|---------|------|--------|-----------|
| Coin Magnet+ | 500/1000/2000 | +25% magnet range per level | 3 |
| Powerup Duration | 500/1000/2000 | +2s powerup duration per level | 3 |
| Fever Boost | 750/1500/3000 | +10% fever meter gain per level | 3 |
| Lucky Coins | 1000/2000 | +10% chance for mega coins | 2 |

#### 1.4 State Management
- Add to `useGameStore.ts`:
  - `headStarts: { shield: boolean, magnet: boolean, speed: boolean, multiplier: boolean }`
  - `upgrades: { magnetRange: number, powerupDuration: number, feverBoost: number, luckyCoins: number }`
- New store: `useShopStore.ts` for shop state and purchases
- Persist to localStorage + sync to Supabase when logged in

---

### Phase 2: Daily Missions (Retention)
**Priority: HIGH | Impact: D1/D7 Retention**

#### 2.1 Mission System
- New file: `components/games/blitz-rush-3d/ui/Missions.tsx`
- 3 daily missions that reset at midnight UTC
- Missions persist to localStorage + Supabase

#### 2.2 Mission Types
```typescript
type MissionType =
  | 'collect_coins'      // Collect X coins in total today
  | 'distance'           // Run X meters in a single run
  | 'dodge_obstacles'    // Dodge X obstacles in a single run
  | 'fever_time'         // Spend X seconds in fever mode
  | 'no_hit_run'         // Run 200m without getting hit
  | 'powerup_collect'    // Collect X powerups in total today
  | 'play_games'         // Play X games today
```

#### 2.3 Mission Rewards
- Easy missions: 50-100 coins
- Medium missions: 150-250 coins
- Hard missions: 300-500 coins
- Bonus for completing all 3: 200 coins

#### 2.4 Mission UI
- Mission panel on start screen (between KICKOFF and CHARACTERS)
- Progress bars for each mission
- Animated completion celebration
- "New missions in X hours" countdown

---

### Phase 3: Character Abilities (Differentiation)
**Priority: MEDIUM | Impact: Strategic Depth**

#### 3.1 Update Character System
Each character gets a unique passive ability:

| Character | Ability | Effect |
|-----------|---------|--------|
| Rookie | Beginner's Luck | 10% more coins from all sources |
| Blue Thunder | Lightning Reflexes | Easier lane switches (15% wider hitbox) |
| Green Machine | Endurance | Shield lasts 25% longer |
| Purple Reign | Royal Presence | 15% faster fever meter fill |
| Gold Standard | Midas Touch | Mega coins appear 20% more often |
| Midnight | Shadow Step | 0.5s invincibility after lane switch |

#### 3.2 Implementation
- Add `ability` field to Character interface
- Add ability modifiers to game store calculations
- Show ability description in character select
- Ability indicator during gameplay (subtle icon)

---

### Phase 4: In-Run Milestones (Engagement)
**Priority: MEDIUM | Impact: Session Length**

#### 4.1 Milestone System
Trigger celebrations at key moments during gameplay:

| Milestone | Trigger | Reward |
|-----------|---------|--------|
| First 100m | Distance = 100 | +25 coins, small celebration |
| Coin Streak 10 | 10 coins without obstacle | +50 bonus coins |
| Dodge Master | 5 consecutive dodges | 3s shield, popup |
| Speed Demon | 500m in single run | Speed boost + 100 coins |
| Fever Chain | 3 fever modes in one run | Permanent 1.5x for run |

#### 4.2 Visual Feedback
- Milestone popup with confetti burst
- Screen flash with appropriate color
- Sound effect + haptic
- Bonus coins animated flying to counter

---

### Phase 5: Revive System (Monetization Hook)
**Priority: MEDIUM | Impact: Session Extension + IAP**

#### 5.1 Revive Mechanic
- On game over, offer 1 revive per run
- Cost: 50 coins OR 1 gem (premium currency)
- Revive with 3s shield, continue from where you died
- "Watch Ad for Free Revive" placeholder (for future ad integration)

#### 5.2 UI
- Revive prompt appears before game over screen
- 5-second countdown to decide
- Skip to go directly to game over

---

### Phase 6: Premium Currency - Gems (IAP Foundation)
**Priority: LOW (for now) | Impact: Future Monetization**

#### 6.1 Gem System
- Secondary currency for premium purchases
- Cannot be earned in-game (IAP only in future)
- For now: grant 10 gems to new players as "welcome bonus"

#### 6.2 Gem Uses
- Instant character unlock (skip grind)
- Revives (1 gem each)
- Premium cosmetic trails (future)

---

## File Structure

```
components/games/blitz-rush-3d/
├── ui/
│   ├── Shop.tsx           # NEW - Coin shop
│   ├── Missions.tsx        # NEW - Daily missions
│   ├── MilestonePopup.tsx  # NEW - In-run celebrations
│   ├── RevivePrompt.tsx    # NEW - Revive UI
│   ├── CharacterSelect.tsx # MODIFY - Add abilities
│   ├── StartScreen.tsx     # MODIFY - Add missions button
│   └── GameOverScreen.tsx  # MODIFY - Add revive
├── hooks/
│   ├── useGameStore.ts     # MODIFY - Add shop state
│   ├── useShopStore.ts     # NEW - Shop purchases
│   └── useMissions.ts      # NEW - Mission tracking
└── data/
    ├── shop-items.ts       # NEW - Shop item definitions
    ├── missions.ts         # NEW - Mission definitions
    └── milestones.ts       # NEW - Milestone definitions
```

---

## Implementation Order

1. **Phase 1.1-1.2**: Shop UI + Head Starts (quick win, uses existing coins)
2. **Phase 2**: Daily Missions (biggest retention impact)
3. **Phase 3**: Character Abilities (makes characters meaningful)
4. **Phase 1.3**: Upgrades (adds grind/progression)
5. **Phase 4**: In-Run Milestones (engagement polish)
6. **Phase 5**: Revive System (monetization hook)
7. **Phase 6**: Gems (future IAP foundation)

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Average session length | ~2 min | 5+ min |
| Games per session | 2-3 | 5+ |
| D1 retention | Unknown | 40%+ |
| D7 retention | Unknown | 20%+ |
| Coins spent | 0 | 500+/session |

---

## Questions for User

1. **Character Abilities**: Should abilities be unlocked with the character, or require additional coin investment?

2. **Mission Difficulty**: Should missions scale with player level, or stay fixed?

3. **Premium Currency**: Include gem system now (for future IAP), or keep pure coins for MVP?

4. **Scope**: Implement all phases, or start with Phases 1-2 for fastest impact?
