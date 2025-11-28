# Kickoff Club Mobile App - Product Requirements Document

**Version:** 1.0
**Date:** November 28, 2025
**Status:** In Development
**Platform:** iOS & Android (React Native + Expo)

---

## Executive Summary

The Kickoff Club mobile app is a **football team management game** that teaches users football strategy through gameplay. Unlike the website (traditional e-learning platform), the mobile app is **game-first, education-second** - combining "Clash of Clans" style base-building with "Madden" team management to create an engaging football education experience.

**Core Loop:** Build HQ → Train Units → Play Matches → Earn Resources → Upgrade → Learn Football

---

## Product Vision

### What Makes This Different

**Website:** *"Learn to play football"* - Traditional courses, videos, quizzes
**Mobile App:** *"Play to learn football"* - Base building, team management, match simulation

### Target Audience
- Football enthusiasts who want to learn strategy
- Casual mobile gamers interested in football
- Fantasy football players looking to improve their knowledge
- Ages 16-35, mobile-first users

### Success Metrics
- Daily Active Users (DAU)
- Average session length: 10-15 minutes
- Day 7 retention: 40%+
- Matches played per user per day: 3-5
- Conversion to website courses: 15%+

---

## Current State Assessment

### ✅ What's Built & Working

**Backend (Supabase Database)**
- ✅ `profiles` table with coins, XP, energy, level, knowledge points
- ✅ `user_buildings` table with production mechanics
- ✅ `games` and `predictions` tables with 5 sample NFL games
- ✅ `mission_templates` and `user_missions` with 11 daily missions
- ✅ `user_squad` table for team units
- ✅ Functions: `assign_daily_missions()`, `update_mission_progress()`, `claim_mission_reward()`, `finalize_game_predictions()`

**Frontend Components**
- ✅ HQScreen - Grid-based building layout
- ✅ BuildingDetailsModal - Shows building stats, upgrade costs, production
- ✅ DailyMissions component - Displays 3 random daily missions
- ✅ PredictScreen - NFL game predictions with coin wagering
- ✅ ProfileScreen - User stats display
- ✅ Energy system - 100 max, refills 1 per 5 minutes
- ✅ Navigation - Bottom tab navigation (HQ, Squad, Predict, Profile)

**Assets (Premium Graphics from Gemini AI)**
- ✅ 60 PNG files (21MB total)
- ✅ 5 unit types × 3 states × 2 resolutions (@2x, @3x):
  - Offensive Line (idle, training, ready)
  - Running Back (idle, training, ready)
  - Wide Receiver (idle, training, ready)
  - Linebacker (idle, training, ready)
  - Defensive Back (idle, training, ready)
- ✅ Stadium building (Level 1 & Level 5)
- ✅ 2.5D isometric style (Clash of Clans aesthetic)
- ✅ Integrated into `mobile-app/src/constants/assets.ts`

### ⚠️ What's Partially Built

- ⚠️ Building production mechanics (functions exist, may not be fully wired)
- ⚠️ Squad screen (UI exists, training mechanics unclear)
- ⚠️ Match gameplay (referenced but not seen fully implemented)
- ⚠️ Practice Field "drill planting" (mentioned in code, not implemented)

### ❌ What's Missing

**Critical Missing Features**
- ❌ Match simulation system (core gameplay loop)
- ❌ Training system for units
- ❌ Practice Field mechanics
- ❌ Production/resource collection UI flows
- ❌ Building unlock progression
- ❌ Opponent generation/matchmaking
- ❌ Season/league progression system
- ❌ Tutorial/onboarding flow

**Missing Assets (High Priority)**
- ❌ Film Room building graphics (Levels 1-5)
- ❌ Practice Field building graphics (Levels 1-5)
- ❌ Locker Room building graphics (Levels 1-5)
- ❌ Draft Room building graphics (Levels 1-5)
- ❌ Concession Stand building graphics (Levels 1-5)
- ❌ Match screen UI (field, scoreboard, play-by-play)
- ❌ Opponent team graphics/avatars
- ❌ Resource icons (coins, KP, energy with polish)
- ❌ Mission completion animations
- ❌ Background graphics (HQ base, match field)

**Missing Assets (Medium Priority)**
- ❌ Unit upgrade/evolution graphics (Levels 2-5 for each unit type)
- ❌ Special effects (level up, production ready, match victory)
- ❌ Tutorial overlay graphics
- ❌ Achievement badges
- ❌ Loading screens

---

## Feature Requirements

### Phase 1: Core Game Loop (MVP)

**Priority: CRITICAL - Must have for launch**

#### 1.1 HQ Building System ✅ 70% Complete

**Status:** Database ready, UI partial, production mechanics need wiring

**User Stories:**
- As a player, I can view my 6 building slots in a 3×2 grid
- As a player, I can tap a building to see its stats and upgrade cost
- As a player, I can upgrade buildings using coins
- As a player, I can collect production (KP/Coins) from buildings when ready

**Acceptance Criteria:**
- [x] Buildings display with correct graphics (stadium done, others need assets)
- [x] Upgrade costs scale exponentially (500 × 1.5^level)
- [ ] Production accumulates over time (Film Room = KP, Practice Field = Coins)
- [ ] Collection triggers haptic feedback and shows +X animation
- [ ] Buildings show production ready indicator (pulsing badge)
- [ ] Insufficient coins shows error alert

**Technical Requirements:**
- Buildings stored in `user_buildings` table
- `collectBuildingProduction()` function updates `production_current` to 0
- Award resources to user profile
- Update UI optimistically, revert on error

**Missing Assets:**
- Film Room (5 levels)
- Practice Field (5 levels)
- Locker Room (5 levels)
- Draft Room (5 levels)
- Concession Stand (5 levels)

---

#### 1.2 Squad Training System ❌ 10% Complete

**Status:** Database ready, UI exists, training mechanics missing

**User Stories:**
- As a player, I can view my 5 unit types and their current levels
- As a player, I can start training a unit using energy
- As a player, I can see training progress (timer countdown)
- As a player, I collect trained units to increase team readiness

**Acceptance Criteria:**
- [ ] Squad screen displays 5 units with correct idle graphics
- [ ] Tapping unit shows training cost (10 energy, 5 minutes)
- [ ] Training shows countdown timer and "training" graphic
- [ ] Completing training changes to "ready" graphic with pulsing indicator
- [ ] Collecting trained unit increases team readiness stat
- [ ] Energy depletes when starting training
- [ ] Cannot train if energy < 10

**Technical Requirements:**
- Units stored in `user_squad` table
- Training creates record in new `unit_training_sessions` table
- Background job checks for completed training
- Real-time updates via Supabase subscriptions

**Database Schema Needed:**
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

**Missing Assets:**
- None (have all unit graphics)

---

#### 1.3 Match Simulation ❌ 0% Complete

**Status:** Critical - Core gameplay missing

**User Stories:**
- As a player, I can tap "Play Match" to start a match
- As a player, I see my team readiness vs opponent's
- As a player, I watch a simulated match with play-by-play
- As a player, I see win/loss results with rewards earned

**Acceptance Criteria:**
- [ ] "Play Match" button costs 20 energy
- [ ] Match opponent generated based on user level ±2
- [ ] Simulation shows 4 quarters with scoring plays
- [ ] Win probability based on team_readiness stat
- [ ] Victory awards: 50 coins, 25 XP, 10 KP
- [ ] Defeat awards: 10 coins, 5 XP
- [ ] Match results update user stats immediately
- [ ] User can replay match or return to HQ

**Match Simulation Logic:**
```
1. Calculate win probability: (user_readiness / (user_readiness + opponent_readiness))
2. Simulate 4 quarters with 2-4 scoring plays per quarter
3. Each play references real football concepts (PA Pass, Draw, Blitz, etc.)
4. User wins if random() < win_probability
5. Award rewards based on outcome
```

**Technical Requirements:**
- New table: `match_history` (user_id, opponent_level, user_score, opponent_score, won, rewards)
- Function: `play_match(user_id)` - validates energy, creates opponent, simulates, awards rewards
- Screen: `MatchScreen.tsx` - Animated scoreboard, play-by-play text feed

**Missing Assets:**
- Match field background
- Scoreboard UI graphics
- Play-by-play card backgrounds
- Victory/defeat overlay graphics
- Opponent avatar placeholders

---

#### 1.4 Daily Missions ✅ 90% Complete

**Status:** Database ready, UI working, claim flow needs polish

**User Stories:**
- As a player, I see 3 random daily missions on login
- As a player, I track progress on each mission
- As a player, I claim rewards when missions complete

**Acceptance Criteria:**
- [x] 3 missions assigned on first login of the day
- [x] Missions show progress (e.g., "2/3 trainings")
- [ ] Completing mission shows checkmark and "Claim" button
- [ ] Claiming triggers confetti animation and award popup
- [ ] Missions reset daily at midnight UTC

**Technical Requirements:**
- Uses existing `assign_daily_missions()` function
- Call `update_mission_progress(user_id, mission_type, 1)` after actions
- Call `claim_mission_reward(mission_id)` on claim button

**Missing Assets:**
- Mission card background graphics
- Claim button animation
- Confetti/celebration effect

---

#### 1.5 NFL Predictions ✅ 80% Complete

**Status:** Database seeded, UI working, finalization flow needed

**User Stories:**
- As a player, I see upcoming NFL games
- As a player, I wager coins on game outcomes
- As a player, I win 2× coins if my prediction is correct

**Acceptance Criteria:**
- [x] 5 upcoming games displayed from `games` table
- [x] User selects home/away winner and wager amount (10-100 coins)
- [x] Prediction saved to `predictions` table
- [ ] Admin dashboard to finalize games (enter scores)
- [ ] `finalize_game_predictions()` runs to award winners
- [ ] Push notification sent when prediction wins

**Technical Requirements:**
- Existing tables work: `games`, `predictions`
- Need admin screen to update game scores
- Call `finalize_game_predictions(game_id)` when game ends

**Missing Assets:**
- Team logos (32 NFL teams) - could use emojis or icons initially

---

### Phase 2: Progression & Retention

**Priority: HIGH - Needed for 30-day retention**

#### 2.1 Leveling System
- XP thresholds for levels 1-50
- Level up rewards (coins, energy refill, building unlocks)
- Visual level-up animation

#### 2.2 Building Unlocks
- Film Room: Level 1 (starter)
- Practice Field: Level 1 (starter)
- Stadium: Level 1 (starter)
- Locker Room: Unlocks at Level 5
- Draft Room: Unlocks at Level 10
- Concession Stand: Unlocks at Level 15

#### 2.3 Tutorial/Onboarding
- 5-step guided tutorial on first launch
- "Tap here" overlays for key actions
- First building upgrade is free
- First match is guaranteed win

#### 2.4 Achievements
- 50 achievements across categories (builder, trainer, champion, predictor)
- Badge graphics for each achievement
- One-time coin/XP rewards

---

### Phase 3: Social & Competition

**Priority: MEDIUM - Post-launch enhancements**

#### 3.1 Leaderboards
- Global leaderboard by level/XP
- Friends leaderboard
- Weekly match wins leaderboard

#### 3.2 Seasons
- 4-week competitive seasons
- Season pass rewards
- Rank tiers (Bronze → Silver → Gold → Platinum)

#### 3.3 Alliance/Clubs
- Join clubs with other players
- Club chat
- Club vs Club match events
- Shared rewards

---

## Technical Architecture

### Tech Stack
- **Frontend:** React Native 0.74, Expo SDK 51
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management:** React Context API
- **Navigation:** React Navigation v6
- **Animations:** Expo Haptics, React Native Reanimated
- **Assets:** PNG sprites @2x/@3x for retina displays

### Database Schema Summary

**Existing Tables:**
- `profiles` - User accounts with resources
- `user_buildings` - Building ownership and production
- `user_squad` - Unit ownership and levels
- `games` - NFL matchups
- `predictions` - User predictions on games
- `mission_templates` - Predefined missions
- `user_missions` - User mission progress

**Tables Needed:**
- `unit_training_sessions` - Active training timers
- `match_history` - Past match results
- `achievements` - Achievement definitions
- `user_achievements` - User achievement progress

### APIs & Integrations
- Supabase RLS for security
- Real-time subscriptions for training/production updates
- Push notifications (Expo Notifications)
- Analytics (Expo Application Services or Mixpanel)

---

## Assets Inventory & Requirements

### ✅ Assets We Have (60 files, 21MB)

**Units (30 files)**
- Offensive Line: idle@2x/3x, training@2x/3x, ready@2x/3x
- Running Back: idle@2x/3x, training@2x/3x, ready@2x/3x
- Wide Receiver: idle@2x/3x, training@2x/3x, ready@2x/3x
- Linebacker: idle@2x/3x, training@2x/3x, ready@2x/3x
- Defensive Back: idle@2x/3x, training@2x/3x, ready@2x/3x

**Buildings (4 files)**
- Stadium: Level 1 @2x/3x, Level 5 @2x/3x

**Style:**
- 2.5D isometric perspective
- Clash of Clans aesthetic
- Vibrant football colors (greens, oranges, blues)

---

### ❌ Assets Needed

#### **Critical - Phase 1 (MVP)**

**Buildings (40 files minimum)**
- Film Room: Levels 1-5 @2x/3x (10 files)
- Practice Field: Levels 1-5 @2x/3x (10 files)
- Locker Room: Levels 1-5 @2x/3x (10 files)
- Draft Room: Levels 1-5 @2x/3x (10 files)
- Concession Stand: Levels 1-5 @2x/3x (10 files)

**Match Screen (10 files)**
- Football field background @2x/3x (2 files)
- Scoreboard UI graphic @2x/3x (2 files)
- Play result card backgrounds @2x/3x (2 files)
- Victory overlay @2x/3x (2 files)
- Defeat overlay @2x/3x (2 files)

**UI Elements (20 files)**
- Coin icon (polished) @2x/3x
- KP icon (polished) @2x/3x
- Energy icon (polished) @2x/3x
- Production ready badge @2x/3x
- Mission card background @2x/3x
- Claim button states (normal/pressed) @2x/3x
- Level up burst effect @2x/3x
- Confetti animation sprite sheet @2x/3x

**Total Critical Assets Needed:** ~70 files

---

#### **High Priority - Phase 2**

**Unit Upgrades (60 files)**
- Each unit type (5) × Levels 2-5 (4) × 3 states (idle/training/ready) × 2 resolutions
- Visually distinct from Level 1 (better gear, effects)

**Achievements (50 files)**
- 50 badge designs @2x/3x (100 files total)
- Categories: Builder, Trainer, Champion, Predictor, Collector

**Tutorial Overlays (10 files)**
- "Tap here" finger pointer animation
- Spotlight/dimmed background overlay
- Tutorial dialog box background

**Total High Priority:** ~170 files

---

#### **Medium Priority - Phase 3**

**Backgrounds**
- HQ base background variations (3 themes)
- Match field variations (grass, turf, night game)

**Social Features**
- Club/alliance logos (user-uploadable + templates)
- Rank tier badges (Bronze, Silver, Gold, Platinum)

**Seasonal Content**
- Holiday-themed building skins
- Seasonal match backgrounds

---

## Asset Specification Guide

### For Antigravity Design Team

**File Format:** PNG with transparency
**Resolution:** Provide @2x (standard) and @3x (retina) for all assets
**Color Palette:** Match existing Gemini assets
**Naming Convention:** `{category}-{name}-{variant}@{resolution}.png`

**Examples:**
- `building-film-room-level-1@2x.png`
- `building-practice-field-level-3@3x.png`
- `ui-coin-icon@2x.png`

**Size Guidelines:**
- Buildings: 256×256px @1x (512px @2x, 768px @3x)
- Units: 128×128px @1x (256px @2x, 384px @3x)
- Icons: 64×64px @1x (128px @2x, 192px @3x)
- Backgrounds: 1920×1080px @1x (3840×2160 @2x)

**Style Requirements:**
- Match existing 2.5D isometric style
- Consistent lighting (top-left light source)
- Football-themed colors (greens, oranges, blues, whites)
- Crisp edges, no anti-aliasing artifacts
- Transparent backgrounds for all sprites

---

## Development Phases & Timeline

### Phase 1: MVP (6-8 weeks)
**Goal:** Functional core loop - Build, Train, Play, Earn

**Week 1-2: Foundation**
- [ ] Design review with Antigravity (receive building graphics)
- [ ] Implement production mechanics and collection flow
- [ ] Wire up building upgrade costs and validation

**Week 3-4: Training System**
- [ ] Create `unit_training_sessions` table
- [ ] Build training UI with countdown timers
- [ ] Implement energy depletion and refill logic

**Week 5-6: Match Simulation**
- [ ] Design match simulation algorithm
- [ ] Create `match_history` table
- [ ] Build MatchScreen with play-by-play
- [ ] Implement reward distribution

**Week 7-8: Polish & Testing**
- [ ] Add haptic feedback and animations
- [ ] Mission claim flow with celebrations
- [ ] Bug fixes and performance optimization
- [ ] Internal beta testing

**Deliverable:** Playable app with complete core loop

---

### Phase 2: Retention Features (4 weeks)
**Goal:** Keep users coming back daily

**Week 9-10: Progression**
- [ ] Level up system with rewards
- [ ] Building unlock gates
- [ ] Achievement system

**Week 11-12: Onboarding**
- [ ] 5-step tutorial flow
- [ ] First-time user experience optimization
- [ ] Push notification setup

**Deliverable:** App ready for soft launch

---

### Phase 3: Social & Scale (6 weeks)
**Goal:** Viral growth and competition

**Week 13-14: Leaderboards**
- [ ] Global and friends leaderboards
- [ ] Weekly competitions

**Week 15-16: Seasons**
- [ ] Season pass system
- [ ] Rank tiers and rewards

**Week 17-18: Clubs**
- [ ] Club creation and joining
- [ ] Club chat
- [ ] Club events

**Deliverable:** Full-featured social game

---

## Open Questions & Decisions Needed

### Product Questions
1. **Monetization Strategy:**
   - Free-to-play with IAP (buy coins/energy)?
   - Premium subscription (unlimited energy)?
   - Cosmetic purchases only?

2. **Connection to Website:**
   - Should completing mobile matches unlock website courses?
   - Cross-platform currency sharing?
   - Use mobile to drive website subscriptions?

3. **Content Pipeline:**
   - How often to add new units/buildings?
   - Seasonal content cadence?
   - Real NFL schedule integration?

### Technical Decisions
1. **Real-time Updates:**
   - Use Supabase Realtime subscriptions?
   - Polling interval for training/production?
   - Background task handling on iOS/Android?

2. **Offline Mode:**
   - Allow offline play with sync later?
   - Queue actions for when connection returns?

3. **Analytics:**
   - What events to track for product insights?
   - Expo Application Services vs third-party?

---

## Success Criteria

### Launch (End of Phase 1)
- ✅ App builds and runs on iOS + Android
- ✅ Core loop playable end-to-end
- ✅ No critical bugs
- ✅ Average session length > 8 minutes
- ✅ 100 beta testers providing feedback

### 30 Days Post-Launch (End of Phase 2)
- 🎯 1,000+ total downloads
- 🎯 Day 7 retention > 40%
- 🎯 Day 30 retention > 20%
- 🎯 Average DAU/MAU > 0.3
- 🎯 5+ matches played per user per day

### 90 Days Post-Launch (End of Phase 3)
- 🎯 10,000+ total downloads
- 🎯 500+ DAU
- 🎯 10% conversion to website courses
- 🎯 4.0+ star rating on App Store
- 🎯 Active clubs with 50+ members

---

## Appendix

### Competitor Analysis
- **Retro Bowl:** Simple football simulation, retro graphics, highly addictive
- **Clash of Clans:** Base building benchmark, excellent progression pacing
- **Madden Mobile:** Deep football mechanics but complex onboarding
- **Fantasy Football Apps:** Prediction mechanics, real NFL integration

### Key Differentiators
1. **Educational Value:** Learn real football strategy through gameplay
2. **Casual Accessibility:** 5-minute sessions vs 30-minute matches
3. **Cross-Platform Synergy:** Mobile drives website engagement
4. **No Pay-to-Win:** Fair competition, cosmetic monetization only

---

## Contact & Collaboration

**For Antigravity Design:**
- Assets needed: See "Assets Needed" section above
- Style guide: Match existing Gemini graphics (samples in `mobile-app/assets/`)
- Timeline: Phase 1 critical assets needed by Week 2

**For Development Team:**
- Codebase: `/mobile-app/` directory
- Database: Supabase migrations in `/supabase/migrations/`
- Current build status: Database ready, core screens built, gameplay loop incomplete

**For Product Team:**
- Open questions require decisions by end of Week 1
- Weekly demos every Friday to validate progress
- User testing feedback loop starting Week 6

---

**Document Owner:** Kickoff Club Product Team
**Last Updated:** November 28, 2025
**Next Review:** December 5, 2025
