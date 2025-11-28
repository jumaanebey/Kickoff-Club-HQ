# Kickoff Club HQ - Mobile Game PRD (Unified)

**Version:** 2.0 (Unified Antigravity + Development Plan)
**Date:** November 28, 2025
**Status:** Active Development - Phase 1 MVP
**Platform:** iOS & Android (React Native + Expo)

---

## Executive Summary

**Kickoff Club HQ** is a mobile-first football management simulation game that combines base-building mechanics with team management and match simulation. Think **"Clash of Clans meets Madden"** - players build their franchise headquarters, train units, and simulate matches to climb the leaderboard.

### Core Distinction
- **Mobile App:** **Game-First** - Resource management, base building, match simulation
- **Website:** **Education-First** - Video courses, quizzes, community learning

### Success Criteria (Phase 1 Launch)
- ✅ Playable core loop: Build → Train → Match → Earn
- ✅ 10-minute average session length
- ✅ 3+ matches played per user per day
- ✅ Clean, polished UI with premium 2.5D graphics
- 🎯 Day 7 retention: 35%+

---

## Product Vision & Strategy

### The Core Loop (30-Second Pitch)
1. **Build** your HQ by placing and upgrading buildings
2. **Train** your squad units to increase team rating
3. **Play** simulated matches against AI opponents
4. **Earn** coins and XP to unlock more content
5. Repeat - climbing the leaderboard

### Differentiation from Competitors
| Game | Their Approach | Our Advantage |
|------|---------------|---------------|
| **Retro Bowl** | Arcade gameplay, manual controls | We focus on strategy/management over twitch skills |
| **Clash of Clans** | Fantasy/medieval theme | Football theme with real NFL concepts |
| **Madden Mobile** | Complex mechanics, steep learning curve | Casual-friendly, 5-minute sessions |

### Monetization (Future - Not Phase 1)
- **Option A:** Free-to-play with cosmetic IAP (stadium skins, team colors)
- **Option B:** Premium unlock ($4.99) removes energy limits
- **Option C:** Cross-sell to website subscription (10% conversion goal)

---

## Technical Foundation - Current State

### ✅ What's Already Built (Database & Backend)

**Supabase Tables:**
- ✅ `profiles` - User accounts (coins, xp, energy, level, knowledge_points)
- ✅ `user_buildings` - Building ownership with production mechanics
- ✅ `user_squad` - Unit ownership and levels
- ✅ `games` - NFL matchups (5 sample games seeded)
- ✅ `predictions` - User predictions on games
- ✅ `mission_templates` - 11 daily mission templates
- ✅ `user_missions` - User mission progress

**Functions & Logic:**
- ✅ `assign_daily_missions(user_id)` - Auto-assigns 3 random missions daily
- ✅ `update_mission_progress(user_id, mission_type, increment)` - Tracks completion
- ✅ `claim_mission_reward(mission_id)` - Awards coins/XP/KP
- ✅ `finalize_game_predictions(game_id)` - Determines prediction winners
- ✅ Energy regeneration (1 per 5 minutes, max 100)
- ✅ User authentication & profiles

**React Native Components:**
- ✅ HQScreen - Grid-based building layout
- ✅ BuildingDetailsModal - Shows stats, upgrades, production
- ✅ DailyMissions - Displays missions with progress
- ✅ PredictScreen - NFL game predictions
- ✅ ProfileScreen - User stats
- ✅ Bottom tab navigation (HQ, Squad, Predict, Profile)

**Assets Integrated:**
- ✅ 60 PNG files (21MB) - Units (5 types × 3 states × 2 resolutions)
- ✅ Stadium building (Level 1 & Level 5 only)

---

### ⚠️ What's Partially Built (Needs Completion)

| Feature | Current Status | What's Missing |
|---------|---------------|----------------|
| **Squad Training** | UI exists, DB ready | Timer logic, energy depletion, training flow |
| **Building Production** | Functions exist | Collection UI, visual indicators, notifications |
| **Match Simulation** | DB schema ready | Entire match screen, simulation algorithm, rewards |
| **Building Upgrades** | Modal UI exists | Full integration with all 5+ buildings |

---

## Asset Inventory & Handoff

### ✅ Assets We Have (In Codebase)

**Location:** `/mobile-app/assets/`

| Category | Files | Resolution | Status |
|----------|-------|------------|--------|
| **Units** | 30 files | @2x, @3x | ✅ Integrated |
| - Offensive Line | idle, training, ready | @2x, @3x | ✅ |
| - Running Back | idle, training, ready | @2x, @3x | ✅ |
| - Wide Receiver | idle, training, ready | @2x, @3x | ✅ |
| - Linebacker | idle, training, ready | @2x, @3x | ✅ |
| - Defensive Back | idle, training, ready | @2x, @3x | ✅ |
| **Buildings** | 4 files | @2x, @3x | ⚠️ Partial |
| - Stadium | Level 1, Level 5 | @2x, @3x | ✅ |
| - Film Room | - | - | ❌ Missing |
| - Practice Field | - | - | ❌ Missing |
| - Weight Room | - | - | ❌ Missing |
| - Medical Center | - | - | ❌ Missing |
| - Scouting Office | - | - | ❌ Missing |

**Style Confirmed:**
- 2.5D isometric perspective
- Clash of Clans aesthetic
- Vibrant football colors (greens, oranges, blues)
- PNG with transparency

---

### 🎨 ANTIGRAVITY RESPONSIBILITIES - Assets to Deliver

#### **Priority 1: MVP Core Buildings (Required for Launch)**

**Deadline:** Week 2 (December 12, 2025)

| Asset | Levels Needed | Specs | Notes |
|-------|--------------|-------|-------|
| **Film Room** | 1, 2, 3, 4, 5 | 256×256px @1x | Produces Knowledge Points |
| **Practice Field** | 1, 2, 3, 4, 5 | 256×256px @1x | Produces Coins, training area |
| **Weight Room** | 1, 2, 3, 4, 5 | 256×256px @1x | Boosts unit training speed |
| **Medical Center** | 1, 2, 3, 4, 5 | 256×256px @1x | Increases energy regeneration |
| **Scouting Office** | 1, 2, 3, 4, 5 | 256×256px @1x | Unlocks better units |

**Total Files:** 5 buildings × 5 levels × 2 resolutions = **50 PNG files**

**Naming Convention:**
```
building-{name}-level-{number}@{resolution}.png

Examples:
- building-film-room-level-1@2x.png
- building-practice-field-level-3@3x.png
```

**Visual Progression Guidelines:**
- **Level 1:** Simple, small structure
- **Level 3:** Medium size, added details (flags, signage)
- **Level 5:** Large, premium look (lights, effects, polish)
- Maintain consistent lighting (top-left light source)
- Match existing Stadium style exactly

---

#### **Priority 2: Match Screen UI Assets**

**Deadline:** Week 4 (December 26, 2025)

| Asset | Size | Format | Purpose |
|-------|------|--------|---------|
| **Football Field Background** | 1920×1080px @1x | PNG | Match screen backdrop |
| **Scoreboard Header** | 800×200px @1x | PNG | Shows score during match |
| **Play Result Cards** | 600×150px @1x | PNG | Background for play-by-play text |
| **Victory Overlay** | 1080×1920px @1x | PNG | Full-screen win celebration |
| **Defeat Overlay** | 1080×1920px @1x | PNG | Full-screen loss screen |

**Total Files:** 5 assets × 2 resolutions = **10 PNG files**

---

#### **Priority 3: UI Polish Assets**

**Deadline:** Week 6 (January 9, 2026)

| Asset | Size | Purpose | Variants |
|-------|------|---------|----------|
| **Resource Icons** | 128×128px @1x | Premium coins/XP/energy icons | 3 icons × 2 res = 6 files |
| **Production Badge** | 96×96px @1x | Pulsing "ready to collect" indicator | 1 × 2 res = 2 files |
| **Mission Card BG** | 400×120px @1x | Daily mission card background | 3 rarities × 2 res = 6 files |
| **Level Up Effect** | 512×512px @1x | Burst animation sprite sheet | 1 × 2 res = 2 files |

**Total Files:** **16 PNG files**

---

#### **Priority 4: Decor Items (Phase 2 - Post-MVP)**

**Deadline:** TBD

| Asset | Purpose |
|-------|---------|
| Team Bus | Decoration, no gameplay function |
| Tailgate Tent | Decoration |
| Statue of Legends | Decoration, boosts morale (cosmetic stat) |
| Club Fountain | Decoration |
| Merch Stand | Decoration, future revenue source |
| Parking Lot | Road/path decoration |
| Roads (Straight, Corner, T-Junction) | Connects buildings visually |
| Trees & Hedges | Natural beautification |

**Total Files:** ~30 PNG files (can be delayed)

---

### 📦 ASSET DELIVERY FORMAT

**Antigravity to provide:**
1. **Organized ZIP file** with folder structure:
   ```
   kickoff-club-assets-v1/
   ├── buildings/
   │   ├── film-room/
   │   │   ├── building-film-room-level-1@2x.png
   │   │   ├── building-film-room-level-1@3x.png
   │   │   └── ...
   │   ├── practice-field/
   │   └── ...
   ├── match-ui/
   │   ├── field-background@2x.png
   │   └── ...
   └── ui-polish/
       ├── icon-coins@2x.png
       └── ...
   ```

2. **Asset manifest** (CSV or JSON):
   ```json
   {
     "building-film-room-level-1": {
       "files": ["@2x.png", "@3x.png"],
       "size": "256x256",
       "created": "2025-12-10"
     }
   }
   ```

3. **Style guide** (1-page PDF):
   - Color palette swatches
   - Lighting reference
   - Visual hierarchy notes

**Development team will:**
- Integrate assets into `/mobile-app/assets/` directory
- Update `assets.ts` with new imports
- Verify @2x/@3x resolutions display correctly
- Report any issues within 24 hours

---

## 💻 DEVELOPMENT RESPONSIBILITIES - Code Implementation

### Phase 1: MVP Core Loop (Weeks 1-8)

---

#### **Week 1-2: Building System Completion**

**Owner:** Development Team

**Tasks:**
- [ ] **Building Integration**
  - Wait for Antigravity assets (5 buildings × 5 levels)
  - Update `assets.ts` with new building imports
  - Add building metadata (production types, costs, unlock levels)

- [ ] **Production Mechanics**
  - Wire up `collectBuildingProduction()` function to UI
  - Add visual indicator when production is ready (pulsing badge)
  - Show "+X Coins" or "+X KP" animation on collection
  - Background job to accumulate production over time

- [ ] **Building Upgrade Flow**
  - Validate coin requirements before upgrade
  - Show "Upgrading..." state (could add 5-second timer)
  - Swap building graphic to next level on completion
  - Deduct coins from user profile

- [ ] **Database Optimization**
  - Add index on `user_buildings(user_id, building_type)`
  - Cache building metadata in memory (reduce DB reads)

**Acceptance Criteria:**
- ✅ All 5 buildings display with correct graphics (Level 1-5)
- ✅ Tapping building shows production amount and "Collect" button
- ✅ Collecting production awards resources with haptic feedback
- ✅ Upgrading costs scale correctly (base_cost × 1.5^level)
- ✅ User cannot upgrade without sufficient coins

**Blockers:**
- ⚠️ Waiting on Antigravity building assets (50 files)

---

#### **Week 3-4: Squad Training System**

**Owner:** Development Team

**Tasks:**
- [ ] **Training UI**
  - Update SquadScreen to show all 5 unit types
  - Add "Train" button (costs 10 energy, 5 minutes)
  - Show countdown timer for active training
  - Change unit graphic: idle → training → ready

- [ ] **Training Database**
  ```sql
  CREATE TABLE unit_training_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    unit_type VARCHAR(50),
    started_at TIMESTAMPTZ,
    completes_at TIMESTAMPTZ,
    energy_cost INTEGER DEFAULT 10,
    completed BOOLEAN DEFAULT FALSE
  );
  ```

- [ ] **Training Logic**
  - `startTraining(user_id, unit_type)` - Deducts energy, creates session
  - Background job checks `completes_at`, marks completed
  - `collectTrainedUnit(session_id)` - Increases `team_readiness` stat

- [ ] **Energy System Integration**
  - Display energy bar in header (X / 100)
  - Show "Next +1 in 4:23" countdown
  - Prevent training if energy < 10
  - Add energy refill with Medical Center building

**Acceptance Criteria:**
- ✅ Squad screen shows 5 units with idle graphics
- ✅ Tapping "Train" starts 5-minute countdown
- ✅ Unit graphic changes to "training" state
- ✅ After 5 minutes, shows "ready" state with collect button
- ✅ Collecting trained unit increases team_readiness by 5 points
- ✅ Energy depletes and regenerates correctly

**Blockers:**
- None (all assets already exist)

---

#### **Week 5-6: Match Simulation**

**Owner:** Development Team

**Tasks:**
- [ ] **Match Algorithm (Simple Formula)**
  ```javascript
  function simulateMatch(userId) {
    const user = getUserProfile(userId);
    const opponent = generateOpponent(user.level);

    // Win probability based on team ratings
    const userPower = user.team_readiness + strategyBonus;
    const opponentPower = opponent.team_readiness + Math.random() * 20;
    const userWins = userPower > opponentPower;

    // Generate score (football-appropriate: 0-35 range)
    const userScore = userWins ? randomInt(21, 35) : randomInt(0, 20);
    const opponentScore = userWins ? randomInt(0, 20) : randomInt(21, 35);

    return {
      won: userWins,
      userScore,
      opponentScore,
      coinsEarned: userWins ? 50 : 10,
      xpEarned: userWins ? 25 : 5,
      kpEarned: userWins ? 10 : 0
    };
  }
  ```

- [ ] **Match Screen UI**
  - Wait for Antigravity match UI assets (field, scoreboard)
  - Build animated scoreboard component
  - Show 4 quarters with 2-3 scoring plays each
  - Display play-by-play text (e.g., "TD Pass to WR!")
  - Victory/defeat overlay with rewards summary

- [ ] **Database Integration**
  ```sql
  CREATE TABLE match_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    opponent_level INTEGER,
    user_score INTEGER,
    opponent_score INTEGER,
    won BOOLEAN,
    coins_earned INTEGER,
    xp_earned INTEGER,
    kp_earned INTEGER,
    played_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Match Flow**
  - "Play Match" button on HQ screen (costs 20 energy)
  - Navigate to MatchScreen
  - Show 10-second simulation animation
  - Award rewards immediately
  - Return to HQ with updated stats

**Acceptance Criteria:**
- ✅ Match button costs 20 energy
- ✅ Opponent level is user level ±2
- ✅ Win probability feels fair (60% if evenly matched)
- ✅ Scores look realistic (21-28, not 3-2)
- ✅ Victory awards 50 coins, 25 XP, 10 KP
- ✅ Defeat awards 10 coins, 5 XP
- ✅ Match history stores all results

**Blockers:**
- ⚠️ Waiting on Antigravity match UI assets (10 files)

---

#### **Week 7: Onboarding & Tutorial**

**Owner:** Development Team

**Tasks:**
- [ ] **First-Time User Experience (FTUE)**
  - Detect first launch (check `user.has_completed_tutorial`)
  - Show 5-step guided tutorial:
    1. "Welcome! This is your HQ"
    2. "Tap to upgrade Stadium (FREE!)"
    3. "Train a unit"
    4. "Play your first match" (guaranteed win)
    5. "Collect daily missions"
  - Overlay "Tap here" indicators
  - Disable other UI during tutorial

- [ ] **Starter Bonuses**
  - First building upgrade: Free (0 coins)
  - First match: Always wins (rigged algorithm)
  - Starting resources: 500 coins, 100 energy

- [ ] **Tutorial Skip**
  - "Skip Tutorial" button for returning users
  - Mark tutorial complete in database

**Acceptance Criteria:**
- ✅ New users see tutorial automatically
- ✅ Tutorial is skippable
- ✅ First upgrade is free
- ✅ First match always wins
- ✅ Tutorial completion persists across sessions

---

#### **Week 8: Polish, Testing, Bug Fixes**

**Owner:** Development Team

**Tasks:**
- [ ] **Performance Optimization**
  - Profile React Native rendering
  - Optimize image loading (use `FastImage`)
  - Reduce database queries (batch reads)
  - Add loading states for all async operations

- [ ] **Haptic Feedback**
  - Upgrade success: Medium impact
  - Collection: Light impact
  - Match victory: Success notification
  - Match defeat: Error notification

- [ ] **Animations**
  - Building upgrade: Fade in new level
  - Coin collection: Float up with "+X" text
  - Level up: Burst effect (sprite sheet animation)

- [ ] **Bug Fixes**
  - Test all user flows end-to-end
  - Fix TypeScript warnings
  - Handle edge cases (no energy, no coins)
  - Test offline mode (queue actions)

- [ ] **Internal Beta**
  - Deploy to TestFlight (iOS)
  - Distribute to 10 internal testers
  - Collect feedback via Google Form
  - Iterate on critical issues

**Acceptance Criteria:**
- ✅ No critical bugs
- ✅ App loads in <3 seconds
- ✅ Smooth 60fps animations
- ✅ 5/10 beta testers complete tutorial
- ✅ Beta feedback: Average 4/5 stars

---

### Phase 2: Retention Features (Weeks 9-12)

**Owner:** Development Team

#### **Week 9-10: Progression & Leveling**

**Tasks:**
- [ ] Level up system (XP thresholds, rewards)
- [ ] Building unlock gates (Locker Room @ Level 5, etc.)
- [ ] Achievement system (50 badges)

#### **Week 11-12: Daily Missions Polish**

**Tasks:**
- [ ] Enable daily missions feature (already built)
- [ ] Add mission completion animations
- [ ] Integrate with match/training systems
- [ ] Push notifications for mission reset

**Note:** Daily Missions are already 90% complete (DB + UI exist). This phase just enables and polishes them.

---

### Phase 3: Social & Competition (Weeks 13-18)

**Owner:** Development Team

#### **Week 13-14: Leaderboards**
- [ ] Global leaderboard by XP
- [ ] Friends leaderboard
- [ ] Weekly match wins leaderboard

#### **Week 15-16: Seasons & Ranks**
- [ ] 4-week competitive seasons
- [ ] Rank tiers (Bronze → Platinum)
- [ ] Season pass rewards

#### **Week 17-18: Clubs/Alliances**
- [ ] Club creation and joining
- [ ] Club chat
- [ ] Club vs Club events

---

## Feature Toggle Strategy

### "Hidden Features" (Already Built, Can Enable Anytime)

These features exist in the database and have UI, but are **disabled by default** for MVP launch:

| Feature | Status | Toggle Location | Enable When |
|---------|--------|----------------|-------------|
| **Daily Missions** | 90% complete | `FeatureFlags.DAILY_MISSIONS` | If Day 7 retention < 30% |
| **NFL Predictions** | 80% complete | `FeatureFlags.PREDICTIONS` | Super Bowl season (Feb 2026) |
| **Achievements** | DB ready | `FeatureFlags.ACHIEVEMENTS` | Post-launch retention boost |

**Implementation:**
```typescript
// mobile-app/src/constants/featureFlags.ts
export const FeatureFlags = {
  DAILY_MISSIONS: false, // Enable in Phase 2
  PREDICTIONS: false,     // Enable for special events
  ACHIEVEMENTS: false,    // Enable in Phase 3
  DECOR_PLACEMENT: false, // Enable when assets ready
};
```

**Benefits:**
- Launch lean MVP (just core loop)
- Enable features remotely without app update
- A/B test feature impact on retention
- Keep codebase ready for rapid iteration

---

## Technical Architecture

### Database Schema (Simplified Overview)

**Core Tables (Already Created):**
```
profiles
├── id (UUID)
├── coins (Integer)
├── xp (Integer)
├── energy (Integer)
├── level (Integer)
├── team_readiness (Integer) ← New field needed
└── last_energy_update (Timestamp)

user_buildings
├── id (UUID)
├── user_id (FK → profiles)
├── building_type (String: "film-room", "stadium", etc.)
├── level (Integer: 1-5)
├── position_x, position_y (Grid coordinates)
├── production_current (Integer)
└── last_collected (Timestamp)

user_squad
├── user_id (FK → profiles)
├── unit_type (String: "offensive-line", etc.)
├── count (Integer)
└── level (Integer)
```

**New Table Needed (Week 3):**
```sql
CREATE TABLE unit_training_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  unit_type VARCHAR(50),
  started_at TIMESTAMPTZ,
  completes_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE
);
```

**New Table Needed (Week 5):**
```sql
CREATE TABLE match_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  opponent_level INTEGER,
  user_score INTEGER,
  opponent_score INTEGER,
  won BOOLEAN,
  coins_earned INTEGER,
  xp_earned INTEGER,
  played_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### API Endpoints (Supabase Edge Functions)

**Critical Functions:**
- ✅ `assign_daily_missions(user_id)` - Already exists
- ✅ `claim_mission_reward(mission_id)` - Already exists
- 🆕 `start_training(user_id, unit_type)` - Week 3
- 🆕 `collect_training(session_id)` - Week 3
- 🆕 `play_match(user_id)` - Week 5
- 🆕 `collect_production(building_id)` - Week 2

---

## Success Metrics & KPIs

### Phase 1 Launch Targets (Week 8)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Crashless Sessions** | >99% | Firebase Crashlytics |
| **Tutorial Completion** | >70% | Analytics event |
| **Average Session Length** | >10 minutes | Analytics |
| **Matches Per User Per Day** | >3 | Database query |
| **Day 1 Retention** | >60% | Analytics cohort |
| **Day 7 Retention** | >35% | Analytics cohort |

### Phase 2 Targets (Week 12)

| Metric | Target |
|--------|--------|
| **Day 30 Retention** | >20% |
| **Daily Active Users / Monthly Active Users** | >0.25 |
| **Average Revenue Per User (if monetized)** | >$0.50 |

---

## Open Questions & Decisions Required

### Product Decisions (Need Answers by Week 1)

1. **Building Unlock Progression:**
   - Should all 5 buildings start at Level 1? OR
   - Lock Medical/Scouting behind user level gates (Lvl 5, Lvl 10)?
   - **Recommendation:** Start with 3 buildings (Stadium, Film Room, Practice Field), unlock others at Lvl 5/10

2. **Energy Regeneration Rate:**
   - Current: 1 energy per 5 minutes (100 max = 8.3 hours to full)
   - Is this too slow? Too fast?
   - **Recommendation:** Test with beta users, adjust if needed

3. **Match Difficulty Curve:**
   - Should opponents get harder as user levels up?
   - Should there be "boss matches" every 5 levels?
   - **Recommendation:** Keep it simple for MVP (same difficulty), add curve in Phase 2

### Technical Decisions (Need Answers by Week 2)

1. **Real-time Updates:**
   - Use Supabase Realtime for training/production updates? OR
   - Poll database every 30 seconds?
   - **Recommendation:** Polling for MVP (simpler), Realtime in Phase 2

2. **Offline Mode:**
   - Allow offline play with sync later? OR
   - Require internet connection?
   - **Recommendation:** Require internet for MVP (avoid sync conflicts)

3. **Push Notifications:**
   - When to notify users?
     - Energy full (100/100)
     - Training complete
     - Production ready to collect
     - Daily missions reset
   - **Recommendation:** Enable all 4 types, let users opt-in

---

## Risk Assessment & Mitigation

### High Risk Items

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Antigravity assets delayed** | Blocks Week 1-2 development | Medium | Start with placeholder graphics, parallel development |
| **Match simulation not fun** | Users churn after 1-2 matches | Medium | Beta test with 20+ users, iterate formula |
| **Training timers too long** | Users quit before seeing value | Low | Make first training 1 minute (tutorial), normal = 5 min |
| **Database performance** | Slow load times at scale | Low | Index all foreign keys, use connection pooling |

### Medium Risk Items

| Risk | Mitigation |
|------|------------|
| **Energy system frustrating** | Add Medical Center to boost regen, test different rates |
| **Upgrade costs too expensive** | Balance testing with 10 beta users |
| **Tutorial too long** | Make skippable, track drop-off rates |

---

## Timeline & Milestones

### Phase 1: MVP (8 Weeks)

```
Week 1-2: Building System ──┐
Week 3-4: Training System   ├──> DEPENDS ON ANTIGRAVITY ASSETS
Week 5-6: Match Simulation ─┘
Week 7:   Onboarding
Week 8:   Polish & Beta Test ──> LAUNCH READY
```

**Critical Path:**
1. Antigravity delivers building assets (Week 2 deadline)
2. Development integrates buildings (Week 2)
3. Development builds training system (Week 3-4)
4. Antigravity delivers match UI (Week 4 deadline)
5. Development builds match simulation (Week 5-6)
6. Combined polish & testing (Week 7-8)

**Launch Date:** January 23, 2026 (Week 8 end)

---

### Phase 2: Retention (4 Weeks)

```
Week 9-10:  Progression & Achievements
Week 11-12: Daily Missions Polish
```

**Milestone:** Soft launch to 1,000 users

---

### Phase 3: Social (6 Weeks)

```
Week 13-14: Leaderboards
Week 15-16: Seasons
Week 17-18: Clubs
```

**Milestone:** Public launch, App Store feature request

---

## Team Responsibilities Summary

### 🎨 Antigravity Design Team

**Deliverables:**
1. **Week 2 (Dec 12):** 50 building PNG files (5 buildings × 5 levels × 2 res)
2. **Week 4 (Dec 26):** 10 match UI PNG files (field, scoreboard, overlays)
3. **Week 6 (Jan 9):** 16 UI polish PNG files (icons, badges, effects)
4. **Post-MVP:** 30 decor PNG files (optional, Phase 2)

**Total Assets:** ~106 PNG files for full MVP

**Specifications:**
- Style: 2.5D isometric, match existing Stadium
- Format: PNG with transparency
- Resolution: @2x and @3x for all files
- Naming: `{category}-{name}-{variant}@{res}.png`

---

### 💻 Development Team (Claude + Engineers)

**Deliverables:**
1. **Week 2:** Building system (production, collection, upgrades)
2. **Week 4:** Training system (timers, energy, unit progression)
3. **Week 6:** Match simulation (algorithm, UI, rewards)
4. **Week 7:** Tutorial & onboarding
5. **Week 8:** Polish, testing, beta launch

**Infrastructure:**
- Supabase backend (already configured)
- React Native + Expo (already set up)
- Asset integration pipeline
- Analytics & crash reporting
- TestFlight deployment

---

## Appendix

### Building Metadata Reference

For development team to implement:

```typescript
// mobile-app/src/constants/buildings.ts
export const BUILDINGS = {
  'stadium': {
    name: 'Stadium',
    produces: null, // No production
    baseCost: 0, // Starter building
    unlockLevel: 1,
    description: 'Your home field. Upgrade to increase fan capacity.'
  },
  'film-room': {
    name: 'Film Room',
    produces: 'kp', // Knowledge Points
    productionRate: 5, // 5 KP per hour
    baseCost: 500,
    unlockLevel: 1,
    description: 'Study plays to gain Knowledge Points.'
  },
  'practice-field': {
    name: 'Practice Field',
    produces: 'coins',
    productionRate: 25, // 25 coins per hour
    baseCost: 500,
    unlockLevel: 1,
    description: 'Train your squad. Produces coins over time.'
  },
  'weight-room': {
    name: 'Weight Room',
    produces: null,
    baseCost: 1000,
    unlockLevel: 5,
    description: 'Reduces training time by 20%.'
  },
  'medical-center': {
    name: 'Medical Center',
    produces: null,
    baseCost: 1500,
    unlockLevel: 5,
    description: 'Increases energy regeneration rate.'
  },
  'scouting-office': {
    name: 'Scouting Office',
    produces: null,
    baseCost: 2000,
    unlockLevel: 10,
    description: 'Unlocks elite unit upgrades.'
  }
};
```

---

### Match Simulation Reference

```typescript
// Simplified match algorithm for Week 5 implementation
function simulateMatch(userId: string) {
  const user = getUserProfile(userId);
  const opponentLevel = user.level + randomInt(-2, 2);
  const opponent = {
    level: opponentLevel,
    team_readiness: opponentLevel * 10 + randomInt(0, 20)
  };

  // Calculate win probability
  const totalPower = user.team_readiness + opponent.team_readiness;
  const winChance = user.team_readiness / totalPower;
  const userWins = Math.random() < winChance;

  // Generate realistic football scores
  const quarters = simulateQuarters(userWins);
  const userScore = quarters.reduce((sum, q) => sum + q.userScore, 0);
  const opponentScore = quarters.reduce((sum, q) => sum + q.opponentScore, 0);

  // Award rewards
  const rewards = {
    coins: userWins ? 50 : 10,
    xp: userWins ? 25 : 5,
    kp: userWins ? 10 : 0
  };

  return {
    won: userWins,
    userScore,
    opponentScore,
    quarters,
    rewards
  };
}
```

---

**Document Maintained By:** Product Team
**Last Updated:** November 28, 2025
**Next Review:** December 5, 2025 (after Antigravity asset delivery)

---

## Quick Reference - Who Does What

| Task | Owner | Deadline |
|------|-------|----------|
| Building graphics (50 files) | **Antigravity** | Week 2 (Dec 12) |
| Building integration code | **Development** | Week 2 |
| Training system code | **Development** | Week 4 |
| Match UI graphics (10 files) | **Antigravity** | Week 4 (Dec 26) |
| Match simulation code | **Development** | Week 6 |
| UI polish graphics (16 files) | **Antigravity** | Week 6 (Jan 9) |
| Tutorial flow | **Development** | Week 7 |
| Beta testing | **Both teams** | Week 8 |
| Launch! | **Both teams** | Week 8 (Jan 23, 2026) |
