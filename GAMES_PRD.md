# Product Requirements Document: Kickoff Club Games
## Top 5 App Store Strategy

**Version**: 1.0
**Date**: November 24, 2025
**Owner**: Product Team
**Status**: Draft for Approval

---

## Executive Summary

**Mission**: Transform Kickoff Club from a football education platform into the #1 addictive football learning experience by making our 2 arcade games world-class and deeply integrated with our courses, podcasts, and progression systems.

**Vision**: Users come for the games, stay for the education. Every game session teaches football IQ while delivering arcade-level entertainment.

**Target**: Top 5 in Sports category on App Store within 6 months.

**Strategy**: Depth over breadth. Polish 2 flagship games (Blitz Rush + QB Precision) to Temple Run / Retro Bowl quality, then leverage our unique education moat (15 courses, 10 podcasts, certification system) that competitors can't copy.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [10 Additional Phase 1 Opportunities](#10-additional-phase-1-opportunities)
3. [Product Strategy](#product-strategy)
4. [Feature Requirements](#feature-requirements)
5. [Technical Architecture](#technical-architecture)
6. [Success Metrics](#success-metrics)
7. [Go-to-Market Strategy](#go-to-market-strategy)
8. [Roadmap](#roadmap)
9. [Risk & Mitigation](#risk--mitigation)

---

## Current State Analysis

### What We Have (Assets)

#### Games (2 flagship titles)
- **Blitz Rush**: 3D endless runner, 743 LOC, Temple Run-style with power-ups
- **QB Precision**: Physics-based QB throwing game, 390 LOC, Retro Bowl-inspired

#### Infrastructure
- Supabase backend with RLS
- Game progress tracking (localStorage + cloud sync)
- Leaderboard system (game_scores table)
- Achievement system (6 achievements, expandable)
- Sound system integrated
- Mobile responsive controls
- Premium UI (Framer Motion, shadcn/ui)

#### Platform Ecosystem
- **15 courses** (1 with 10 lessons, 14 ready for content)
- **10 podcast episodes** (stored in R2)
- **Dashboard** with unified stats (courses, games, achievements)
- **Subscription system** (Stripe integration)
- **Certificates** for course completion
- **Analytics** infrastructure ready

### What's Missing (Gaps)

#### Critical Gaps (Blocking Top 5)
1. ❌ No gameplay progression (flat difficulty)
2. ❌ No onboarding/tutorials
3. ❌ No daily engagement hooks (real daily challenges)
4. ❌ No social/viral features
5. ❌ No monetization beyond subscriptions
6. ❌ No analytics/tracking (blind to user behavior)
7. ❌ Limited juice/polish (good but not great)
8. ❌ No cross-platform leverage (games isolated from courses)

#### Competitive Gaps
- **vs Temple Run**: They have missions, characters, power-up upgrades
- **vs Retro Bowl**: They have team progression, seasons, draft mode
- **vs Duolingo**: They have streaks, leagues, friend challenges, stories
- **vs Candy Crush**: They have lives system, saga map, power-ups, social gifting
- **vs FarmVille**: They have daily collection, neighbor mechanics, time-gated rewards
- **vs Clash Royale**: They have seasons, battle pass, clan wars

---

## 10 Additional Phase 1 Opportunities

Beyond the core polish items (gameplay depth, onboarding, analytics), here are 10 more quick wins:

### 1. **Cross-Platform XP System**
**What**: Unified XP earned from games + courses + podcasts + quizzes
**Why**: Creates a flywheel. Players who watch "Quarterback 101" course perform better in QB Precision, earning more XP.
**Impact**: 30% increase in course engagement
**Effort**: 6 hours

### 2. **Game-to-Course Funnel**
**What**: After every game, show contextual course recommendation
- Died in Blitz Rush? → "Learn defensive positions to dodge better" (link to course)
- Missed throws in QB Precision? → "Master QB mechanics" (link to lesson)
**Why**: Converts casual players into learners
**Impact**: 15% course enrollment increase
**Effort**: 4 hours

### 3. **Podcast Integration During Games**
**What**: "Listen mode" - Play podcasts as background audio during games
**Why**: Multitask learning, increases podcast listens 3x
**Impact**: 200% podcast engagement
**Effort**: 3 hours

### 4. **Replay System with Highlights**
**What**: Auto-save last 10 seconds before death/big play, share as video clip
**Why**: Viral content ("Watch my epic 2000 run!"), Instagram/TikTok ready
**Impact**: 5x social shares
**Effort**: 10 hours

### 5. **AI Coach Commentary**
**What**: Real-time tips during gameplay ("Nice dodge! Try using shield power-up next time")
**Why**: Educational + engaging, teaches without interrupting
**Impact**: 25% skill improvement = longer sessions
**Effort**: 8 hours

### 6. **Season/Event Alignment**
**What**: Games sync with NFL calendar
- Week 1 NFL: "Kickoff Challenge" (2x XP all week)
- Playoffs: "Championship Mode" (harder difficulty, better rewards)
- Super Bowl: "Ultimate Challenge" (exclusive legendary skin)
**Why**: Timely relevance drives organic traffic
**Impact**: 3x engagement during NFL season
**Effort**: 6 hours

### 7. **Educational Pause Screens**
**What**: Pause menu shows quick football trivia or tips from courses
**Why**: Sneaks learning into entertainment
**Impact**: 10% knowledge retention improvement
**Effort**: 2 hours

### 8. **Progressive Unlock System**
**What**: Lock certain features until leveling up or course completion
- QB Precision "Playoffs Mode" unlocks at Level 10 OR complete "QB 101" course
- Blitz Rush "Night Stadium" unlocks at Level 15 OR complete "Field Layout" course
**Why**: Creates reason to engage with full platform
**Impact**: 40% cross-feature engagement
**Effort**: 5 hours

### 9. **Spectator/Ghost Mode**
**What**: Watch friend's best run as a "ghost" player, try to beat it in real-time
**Why**: Asynchronous multiplayer without server costs
**Impact**: 2x friend engagement
**Effort**: 12 hours

### 10. **Weekly Content Drops**
**What**: Every Monday: New challenge + New cosmetic + Featured course
**Why**: Creates "appointment gaming" (Fortnite model)
**Impact**: 50% increase weekly active users
**Effort**: 4 hours initial setup, 1 hour/week maintenance

---

## Product Strategy

### Core Hypothesis

**Most football games are either:**
- Too complex (Madden) - 10-hour learning curve
- Too shallow (endless clickers) - no educational value

**Our Unique Position:**
- **Easy to play** (arcade controls, 30-second sessions)
- **Impossible to master** (progressive difficulty, NFL knowledge gives edge)
- **Educational by design** (every mechanic teaches football concepts)

### Value Propositions

#### For Casual Players
- "Learn football without boring videos"
- 3-minute entertainment sessions
- No prior football knowledge needed

#### For Football Fans
- "Test your football IQ"
- Leaderboards with bragging rights
- Unlock exclusive football content

#### For Learners
- "Gamified football education"
- Earn certificates while playing
- Track progress across platform

### Competitive Advantages (Moats)

1. **Content Library**: 15 courses + 10 podcasts (competitors have 0)
2. **Certification System**: Real credentials (job/resume value)
3. **Educational Integration**: Games teach, courses deepen, podcasts entertain
4. **NFL Season Relevance**: Live sync with games (Madden can't due to licensing cost)

---

## Feature Requirements

### Phase 1: Foundation (Week 1-2) - 80 hours

#### 1.1 Gameplay Progression System
**Priority**: P0 (Critical)

**Requirements**:
- Progressive difficulty scaling every 250 points (10% speed increase, 15% obstacle density)
- Mini-objectives during gameplay:
  - "Collect 10 coins without lane switching" → +50 bonus
  - "Dodge 5 defenders in a row" → +100 bonus
  - "Hit 3 perfect throws" → +75 bonus
- Near-miss bonuses (< 50px from obstacle = +10 "Close Call" bonus)
- Combo multiplier system:
  - Consecutive actions build multiplier (2x, 3x, 5x)
  - Breaks on mistake
  - Visual "COMBO x3!" popup

**Acceptance Criteria**:
- [ ] Difficulty scales every 250 points (verified by playtest)
- [ ] At least 5 mini-objectives per game
- [ ] Near-miss detection accurate within 50px
- [ ] Combo multiplier persists until mistake
- [ ] All bonuses show visual feedback

**Technical Notes**:
- Store difficulty state in game component
- Use useCallback for performance
- Add bonus particle effects

---

#### 1.2 Onboarding & Tutorials
**Priority**: P0 (Critical)

**Requirements**:
- First-time user flow:
  1. Welcome modal: "Ready to learn football while having fun?"
  2. 15-second interactive tutorial for each game
  3. Practice mode (no score, just mechanics)
  4. First completion bonus: +500 coins + "First Victory" achievement
- Returning user: Skip button always visible
- Tutorial content:
  - **Blitz Rush**: "Swipe left/right to dodge. Swipe up to jump. Collect coins!"
  - **QB Precision**: "Drag to aim. Release to throw. Hit moving receivers!"

**Acceptance Criteria**:
- [ ] Modal shows on first visit (localStorage flag)
- [ ] Tutorial skippable after 3 seconds
- [ ] Practice mode accessible from pause menu
- [ ] Bonus awarded exactly once per user
- [ ] Tutorial completion tracked in analytics

**Design Specs**:
- Use Framer Motion for smooth transitions
- Overlay dimmed gameplay in background
- Large, friendly font (24px)
- Green "Got it!" button

---

#### 1.3 Analytics & Event Tracking
**Priority**: P0 (Critical)

**Tool**: PostHog (free tier: 1M events/month)

**Events to Track**:
```typescript
// Core Events
- game_started { game_id, user_id, source }
- game_ended { game_id, score, duration_seconds, death_cause, obstacles_dodged, coins_collected }
- level_reached { game_id, level, score_at_level }
- power_up_collected { type, game_id, timestamp }

// Engagement Events
- tutorial_started { game_id }
- tutorial_completed { game_id, duration }
- tutorial_skipped { game_id }
- achievement_unlocked { achievement_id, game_id }
- daily_challenge_started { challenge_id }
- daily_challenge_completed { challenge_id, score, time_taken }

// Social Events
- score_shared { platform, game_id, score }
- friend_challenged { friend_id, game_id }
- leaderboard_viewed { game_id, filter }

// Monetization Events
- cosmetic_viewed { item_id }
- cosmetic_purchased { item_id, currency_type, amount }
- battle_pass_purchased { tier }
- ad_watched { ad_type, reward }

// Cross-Platform Events
- course_clicked_from_game { course_id, game_id, context }
- podcast_started_during_game { podcast_id, game_id }
```

**Funnels to Monitor**:
1. First Session: Game Hub View → Game Start → 1st Death → 2nd Attempt → Share
2. Retention: D1 → D3 → D7 → D14 → D30
3. Monetization: Free User → View Shop → Purchase
4. Cross-Platform: Game Player → Course Viewer → Subscriber

**Acceptance Criteria**:
- [ ] PostHog SDK integrated
- [ ] All events firing correctly (test in dashboard)
- [ ] Funnels configured in PostHog
- [ ] User properties tracked (level, subscription tier, total_coins)
- [ ] Session replay enabled for 10% of users

---

#### 1.4 Juice & Polish Enhancements
**Priority**: P1 (High)

**Requirements**:
- Screen shake on collision (5px, 100ms)
- Slow-motion on near-death (0.5x speed for 200ms, then resume)
- Particle explosions:
  - Coin collect: Gold sparkles (20 particles)
  - Death: Red shards (50 particles)
  - Power-up collect: Blue/green glow (30 particles)
- Victory celebration:
  - Confetti animation (300 particles)
  - Scoreboard with fireworks
  - "New High Score!" animated text
- Sound improvements:
  - Deeper bass on collision
  - Satisfying "cha-ching" on coin (not just beep)
  - Epic music swell on milestone (500, 1000, 2000 points)

**Acceptance Criteria**:
- [ ] Screen shake feels impactful but not nauseating
- [ ] Slow-mo triggers within 100px of obstacle
- [ ] All particle effects use requestAnimationFrame
- [ ] Victory screen shows for 5 seconds before score screen
- [ ] Sounds play at proper volume (normalized)

**Design Reference**: Temple Run, Subway Surfers, Candy Crush (victory cascade)

---

#### 1.5 Cross-Platform XP System
**Priority**: P1 (High)

**Requirements**:
- Unified XP pool across platform:
  - Complete lesson: +100 XP
  - Complete course: +500 XP
  - Complete podcast: +50 XP
  - Play game: +10 XP per 100 points
  - Complete daily challenge: +200 XP
  - Unlock achievement: +XP (varies by rarity)
- Level progression:
  - Level 1-10: 1000 XP per level
  - Level 11-30: 2000 XP per level
  - Level 31+: 5000 XP per level
- Level rewards:
  - Level 5: Unlock QB Precision
  - Level 10: Unlock daily challenges
  - Level 15: Unlock leaderboards
  - Level 20: Unlock cosmetics shop
  - Level 25: Unlock battle pass
  - Every 5 levels: 500 bonus coins

**Database Schema**:
```sql
alter table profiles add column if not exists xp integer default 0;
alter table profiles add column if not exists level integer default 1;

create table xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  amount integer not null,
  source text not null, -- 'game', 'course', 'podcast', 'achievement'
  source_id text, -- game_id, course_id, etc
  created_at timestamp with time zone default now()
);
```

**Acceptance Criteria**:
- [ ] XP awarded immediately after action
- [ ] Level up triggers confetti animation
- [ ] XP bar always visible in top nav
- [ ] Level rewards granted automatically
- [ ] XP transactions logged for audit

---

#### 1.6 Game-to-Course Funnel
**Priority**: P1 (High)

**Requirements**:
- After game ends, show contextual recommendation card:
  ```
  [Image: Course Thumbnail]
  "Want to improve your dodging skills?"
  → "Learn Defensive Positions" course
  [Watch Lesson] [Skip]
  ```
- Logic mapping:
  - Blitz Rush deaths < 500 points → "Football Fundamentals 101"
  - Blitz Rush deaths 500-1000 → "Defensive Positions"
  - QB Precision completion% < 40% → "Quarterback 101"
  - QB Precision completion% 40-70% → "Passing Mechanics"
- Show recommendation 50% of the time (not annoying)
- Track clicks in analytics: `course_recommended` → `course_clicked` → `lesson_started`

**Acceptance Criteria**:
- [ ] Recommendation shows 50% of game ends
- [ ] Correct course shown based on performance
- [ ] Clicking opens course page with deep link to specific lesson
- [ ] Dismissing remembers for 24 hours (don't spam)
- [ ] Analytics funnel working

**A/B Test Ideas**:
- Variant A: Show after every game
- Variant B: Show only on bad performance
- Variant C: Show only on good performance ("Level up your skills!")

---

#### 1.7 Podcast Integration (Listen Mode)
**Priority**: P2 (Medium)

**Requirements**:
- "Listen Mode" toggle in game settings
- When enabled, select podcast from library
- Podcast plays as background audio during game
- Game sounds duck to 30% volume when podcast playing
- Podcast progress saved (resume from where you left off)
- UI indicator: Small podcast thumbnail in corner with pause button

**Technical Implementation**:
- Use existing player-provider context
- Add `backgroundMode: boolean` flag
- Modify game sound hook to check mode
- Save podcast position to user_progress table

**Acceptance Criteria**:
- [ ] Podcast plays without interrupting gameplay
- [ ] Game sounds ducked but still audible
- [ ] Progress saved on game exit
- [ ] Can pause/resume podcast during game
- [ ] Analytics: Track podcast_listens_during_game

**Impact**: Doubles podcast engagement

---

#### 1.8 Daily Challenge System (Real)
**Priority**: P0 (Critical)

**Requirements**:
- One daily challenge per day (resets midnight UTC)
- Rotates between 2 games
- Challenge types:
  - **Score Target**: "Score 1000 in Blitz Rush"
  - **Constraint**: "Score 500 without using shield power-up"
  - **Skill**: "Hit 8/10 receivers in QB Precision"
  - **Speedrun**: "Score 500 in under 90 seconds"
- Rewards:
  - 2x coins earned during challenge
  - Exclusive "Daily Warrior" cosmetic currency (10 per day)
  - After 7 days: Legendary helmet skin
- UI:
  - Countdown timer: "Expires in 14:32:15"
  - Progress bar if multi-step
  - Badge on games hub: "DAILY CHALLENGE"

**Database Schema**:
```sql
create table daily_challenges (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  game_id text not null,
  challenge_type text not null,
  description text not null,
  requirement jsonb not null, -- {score: 1000} or {constraint: 'no_shield'}
  reward_coins integer default 100,
  reward_currency integer default 10
);

create table user_daily_completions (
  user_id uuid references auth.users,
  challenge_id uuid references daily_challenges,
  completed_at timestamp with time zone default now(),
  score integer,
  primary key (user_id, challenge_id)
);
```

**Acceptance Criteria**:
- [ ] Challenge changes daily at midnight UTC
- [ ] Completion tracked per user
- [ ] Can't complete same challenge twice
- [ ] Countdown timer accurate
- [ ] Rewards granted immediately on completion

**Inspiration**: Wordle (daily ritual), Candy Crush (daily spin wheel)

---

#### 1.9 Enhanced Leaderboards
**Priority**: P1 (High)

**Requirements**:
- User profiles visible:
  - Avatar (from profiles.avatar_url)
  - Name
  - Level badge
  - Ranking change (↑5, ↓2, NEW, ---)
- Filters:
  - Time: Today / This Week / All Time
  - Scope: Global / Friends Only
- Top 3 get special styling (gold/silver/bronze)
- Click user → View profile modal:
  - Recent scores
  - Achievements unlocked
  - "Challenge [Name]" button
- Real-time updates (refresh every 30s)

**Acceptance Criteria**:
- [ ] Avatars load with fallback (first letter of name)
- [ ] Ranking changes calculated correctly
- [ ] Filters work without page reload
- [ ] Top 3 have crown icons
- [ ] Profile modal opens with correct data
- [ ] Real-time updates without full refresh

**Design Reference**: Duolingo leaderboards, Candy Crush episode rankings

---

#### 1.10 Login Streak System
**Priority**: P1 (High)

**Requirements**:
- Track consecutive days logged in
- Calendar UI showing 30-day history
- Rewards:
  - Day 1: 50 coins
  - Day 3: 100 coins
  - Day 7: Rare helmet skin
  - Day 14: 500 coins
  - Day 30: Legendary jersey
- Streak protection:
  - Option 1: Watch ad to recover broken streak (1x per week)
  - Option 2: Spend 500 coins to recover
- Push notification: "Don't lose your 15-day streak!"

**Database Schema**:
```sql
alter table profiles add column if not exists login_streak integer default 0;
alter table profiles add column if not exists last_login_date date;
alter table profiles add column if not exists longest_streak integer default 0;
```

**Acceptance Criteria**:
- [ ] Streak increments on first action of day (not just page load)
- [ ] Calendar shows green checkmarks for login days
- [ ] Rewards granted automatically
- [ ] Streak protection works once per week
- [ ] Notification sent at 10pm if not logged in today

**Inspiration**: Duolingo (streaks), FarmVille (daily collection)

---

### Phase 2: Engagement Loops (Week 3-4) - 60 hours

#### 2.1 Weekly Tournaments
**Priority**: P0 (Critical)

**Requirements**:
- Weekly leaderboard competition (Monday-Sunday)
- Top 100 get rewards:
  - 1st place: 5000 coins + Exclusive legendary skin + Trophy badge
  - 2nd-3rd: 2500 coins + Rare skin
  - 4th-10th: 1000 coins
  - 11th-50th: 500 coins
  - 51st-100th: 250 coins
- Entry: Free (unlimited attempts, best score counts)
- UI:
  - Tournament banner on games hub
  - Live ranking during play
  - "You're #47! Beat 3 more players for better rewards"
- Reset and payout every Monday 12:00 UTC
- Winner spotlight:
  - Feature on homepage
  - Social media callout
  - "Defend Your Title" badge next week

**Database Schema**:
```sql
create table tournaments (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  game_id text not null,
  status text default 'active', -- active, ended, paid_out
  unique(start_date, game_id)
);

create table tournament_entries (
  tournament_id uuid references tournaments,
  user_id uuid references auth.users,
  best_score integer default 0,
  attempts integer default 0,
  last_played_at timestamp with time zone,
  primary key (tournament_id, user_id)
);
```

**Acceptance Criteria**:
- [ ] Tournament auto-creates every Monday
- [ ] Best score per user tracked
- [ ] Real-time ranking updates
- [ ] Rewards distributed automatically on Monday
- [ ] Winner featured on homepage

**Impact**: 3x competitive engagement
**Inspiration**: Clash Royale tournaments, Candy Crush leaderboards

---

#### 2.2 Social Sharing with Open Graph
**Priority**: P0 (Critical)

**Requirements**:
- "Share Score" button after every game
- Dynamic Open Graph card generation:
  ```
  🏈 I scored 2,450 in Blitz Rush!
  Can you beat it?
  [Image: Score + player avatar + game screenshot]
  👉 Play now at kickoffclub.com/games
  ```
- Share to:
  - Twitter (pre-filled tweet)
  - Facebook
  - Instagram Stories (download image)
  - Copy link (with challenge parameter)
- Challenge link tracking:
  - URL: `kickoffclub.com/games/blitz-rush?challenge=user123_2450`
  - Friend who clicks gets "Beat [Name]'s 2450 score!" banner
  - Bonus reward if they beat it

**Technical Implementation**:
- Next.js API route: `/api/og/score`
- Use Vercel OG Image generation
- Template: User avatar + score + game logo + background
- Store challenge in URL params

**Acceptance Criteria**:
- [ ] Share button visible on game over screen
- [ ] OG image generates in <2 seconds
- [ ] Image shows correct score + user info
- [ ] Twitter/Facebook posts work correctly
- [ ] Challenge links track referrals in analytics
- [ ] Bonus awarded when friend beats score

**Impact**: 5x social shares, 0.3 viral coefficient
**Inspiration**: Wordle sharing, FarmVille neighbor invites

---

#### 2.3 Friend System & Challenges
**Priority**: P1 (High)

**Requirements**:
- Search users by username/email
- Send friend request
- Friend list (max 100 friends)
- Friend activity feed:
  - "John scored 1800 in QB Precision" (2 min ago)
  - "Sarah completed daily challenge" (1 hour ago)
  - "Mike unlocked 'Blitz Master' achievement" (yesterday)
- "Challenge Friend" feature:
  - Select friend from list
  - They get notification: "[Your Name] challenged you in Blitz Rush!"
  - Bonus: +50% coins if you beat their score
- Friend leaderboard filter (show only friends)

**Database Schema**:
```sql
create table friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  friend_id uuid references auth.users,
  status text default 'pending', -- pending, accepted, blocked
  created_at timestamp with time zone default now(),
  unique(user_id, friend_id)
);

create table friend_challenges (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid references auth.users,
  challenged_id uuid references auth.users,
  game_id text not null,
  challenger_score integer not null,
  challenged_score integer,
  status text default 'pending', -- pending, completed, expired
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone -- 48 hours
);
```

**Acceptance Criteria**:
- [ ] Friend search works by partial username
- [ ] Friend requests send notification
- [ ] Activity feed shows last 50 actions
- [ ] Challenge notification appears immediately
- [ ] Bonus awarded correctly
- [ ] Friends-only leaderboard filters correctly

**Impact**: 4x retention for users with 3+ friends
**Inspiration**: FarmVille neighbors, Candy Crush friend requests

---

#### 2.4 Spectator/Ghost Mode
**Priority**: P2 (Medium)

**Requirements**:
- Record player inputs during best runs
- Store as JSON: `[{t: 1.2, action: 'jump'}, {t: 2.5, action: 'left'}, ...]`
- "Watch Friend's Best Run" button
- Ghost appears as semi-transparent player
- Shows their actions in real-time
- Race against ghost to beat their score
- "You beat [Friend]'s ghost!" notification

**Technical Implementation**:
- Record inputs with timestamps
- Store in game_scores.replay_data (jsonb)
- Limit to 1000 actions per replay (storage)
- Playback engine replays actions at timestamps

**Acceptance Criteria**:
- [ ] Replay data recorded for top score
- [ ] Ghost appears semi-transparent (50% opacity)
- [ ] Ghost actions match original timing
- [ ] Can race against ghost
- [ ] Storage limited to 100KB per replay

**Impact**: 2x friend engagement
**Inspiration**: Mario Kart time trials, racing game ghosts

---

#### 2.5 Educational AI Coach
**Priority**: P2 (Medium)

**Requirements**:
- Real-time tips during gameplay:
  - "Nice dodge! Your reaction time is improving"
  - "Try using the shield before tricky sections"
  - "Tip: Swipe early to change lanes faster"
  - "You're on fire! 5 perfect catches in a row!"
- Contextual based on performance:
  - Dying often → Defensive tips
  - Missing throws → QB mechanics tips
  - High score → Encouragement
- Educational facts:
  - "Did you know? Linebackers are the 'quarterbacks' of defense"
  - After game: "Learn more in our Defensive Positions course"
- Frequency: 1 tip every 20 seconds (not annoying)
- Can disable in settings

**Acceptance Criteria**:
- [ ] Tips appear as toast notifications
- [ ] Tips contextual to gameplay
- [ ] Educational facts accurate
- [ ] Can be disabled
- [ ] Analytics track tip helpfulness (survey)

**Impact**: 25% skill improvement, 10% course click-through
**Inspiration**: Duolingo coach, fitness app motivators

---

#### 2.6 Season/Event System
**Priority**: P1 (High)

**Requirements**:
- Seasons aligned with NFL calendar:
  - **Week 1 (Sept)**: "Kickoff Season" - 2x XP all week
  - **Weeks 2-17**: Regular season - Weekly themes
  - **Playoffs (Jan)**: "Championship Mode" - Harder difficulty, better rewards
  - **Super Bowl (Feb)**: "Ultimate Challenge" - Exclusive legendary skins
  - **Off-season (Mar-Aug)**: "Training Camp" - Unlock old exclusive items
- Event-specific content:
  - Special background music
  - Themed obstacles (playoff banners, confetti)
  - Limited-time cosmetics
  - Bonus challenges
- Event pass (similar to battle pass but time-limited):
  - 20 tiers, 2 weeks to complete
  - Free track + Premium track ($4.99)
  - Exclusive items only available during event

**Database Schema**:
```sql
create table seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  theme text, -- 'kickoff', 'playoffs', 'superbowl'
  multipliers jsonb, -- {xp: 2, coins: 1.5}
  is_active boolean default false
);
```

**Acceptance Criteria**:
- [ ] Season auto-activates on start_date
- [ ] Multipliers apply correctly
- [ ] Event pass tracks progress
- [ ] Themed content displays correctly
- [ ] Exclusive items locked after event ends

**Impact**: 3x engagement during NFL season, 50% event pass conversion
**Inspiration**: Fortnite seasons, Clash Royale events, FarmVille holiday events

---

### Phase 3: Monetization (Week 5-6) - 50 hours

#### 3.1 Cosmetics Shop
**Priority**: P0 (Critical)

**Requirements**:
- Two currencies:
  - **Coins**: Earned through gameplay (soft currency)
  - **Gems**: Purchased with real money (hard currency)
  - Conversion: 100 gems = $0.99
- Shop categories:
  - **Helmets**: 30 designs (Common → Legendary)
  - **Jerseys**: 20 designs
  - **Trails**: 15 designs (particle effects behind player)
  - **Celebrations**: 10 animations (victory dance)
  - **Stadiums**: 5 backgrounds
- Rarity tiers:
  - Common: 500 coins or 50 gems ($0.49)
  - Rare: 2000 coins or 200 gems ($1.99)
  - Epic: 5000 coins or 400 gems ($3.99)
  - Legendary: Cannot buy with coins, 1000 gems ($9.99)
- Featured item rotates daily (24-hour sale, 20% off)
- "Try Before You Buy" preview mode

**Database Schema**:
```sql
create table cosmetic_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- helmet, jersey, trail, celebration, stadium
  rarity text not null, -- common, rare, epic, legendary
  price_coins integer,
  price_gems integer,
  image_url text,
  is_exclusive boolean default false,
  available_from date,
  available_until date
);

create table user_cosmetics (
  user_id uuid references auth.users,
  cosmetic_id uuid references cosmetic_items,
  purchased_at timestamp with time zone default now(),
  primary key (user_id, cosmetic_id)
);

alter table profiles add column if not exists gems integer default 0;
alter table profiles add column if not exists equipped_cosmetics jsonb default '{}'::jsonb;
```

**Gem Bundles** (IAP):
- Starter: 100 gems - $0.99
- Popular: 550 gems - $4.99 (10% bonus)
- Best Value: 1200 gems - $9.99 (20% bonus)
- Ultimate: 6500 gems - $49.99 (30% bonus)

**Acceptance Criteria**:
- [ ] Shop displays all items with correct pricing
- [ ] Can filter by category/rarity
- [ ] Preview shows item on player
- [ ] Purchase flow works (Stripe integration)
- [ ] Gems added to account immediately
- [ ] Equipped items show in-game
- [ ] Featured item rotates daily

**Impact**: $2-5 ARPU, 5-8% conversion
**Inspiration**: Candy Crush (boosters), FarmVille (decorations), Fortnite (skins)

---

#### 3.2 Battle Pass
**Priority**: P0 (Critical)

**Requirements**:
- Seasonal battle pass (4 weeks per season)
- 50 tiers, ~500 XP per tier (achievable by casual players)
- Two tracks:
  - **Free Track**: 20 rewards (coins, common cosmetics)
  - **Premium Track**: 50 rewards (gems, rare/epic cosmetics, exclusive items)
- Premium pass: $4.99 (one-time per season)
- Rewards:
  - Tier 5: Common helmet
  - Tier 10: 500 coins
  - Tier 15: Rare jersey
  - Tier 20: 100 gems
  - Tier 25: Epic trail
  - Tier 30: 1000 coins
  - Tier 35: Rare celebration
  - Tier 40: Epic stadium
  - Tier 45: 200 gems
  - Tier 50: Legendary exclusive skin
- "Buy tiers" option: 100 gems per tier (for whales)
- XP sources count toward battle pass (games, courses, challenges)

**Database Schema**:
```sql
create table battle_passes (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references seasons,
  start_date date not null,
  end_date date not null,
  is_active boolean default false
);

create table battle_pass_tiers (
  pass_id uuid references battle_passes,
  tier integer not null,
  xp_required integer not null,
  free_reward jsonb,
  premium_reward jsonb,
  primary key (pass_id, tier)
);

create table user_battle_pass (
  user_id uuid references auth.users,
  pass_id uuid references battle_passes,
  tier integer default 1,
  xp integer default 0,
  has_premium boolean default false,
  purchased_at timestamp with time zone,
  primary key (user_id, pass_id)
);
```

**Acceptance Criteria**:
- [ ] Battle pass UI shows current tier + progress
- [ ] XP from all sources counts toward pass
- [ ] Rewards unlock automatically
- [ ] Buying premium retroactively grants all earned rewards
- [ ] "Buy tiers" works correctly
- [ ] Pass expires on end_date

**Impact**: 20% premium conversion, $3-5K/month with 1000 users
**Inspiration**: Fortnite (gold standard), Clash Royale, Brawl Stars

---

#### 3.3 Rewarded Video Ads
**Priority**: P2 (Medium)

**Requirements**:
- Google AdMob integration
- Ad placements (opt-in only):
  - **Continue Run**: Watch ad to get 1 extra life in Blitz Rush
  - **Double Coins**: Watch ad after game for 2x coins
  - **Unlock Preview**: Watch ad to try cosmetic for 1 game
  - **Streak Recovery**: Watch ad to save broken login streak
- Ad frequency limit: Max 3 ads per hour (not annoying)
- Always optional (never forced)
- "Remove Ads" IAP: $2.99 (disables all ads)

**Technical Implementation**:
- Use react-native-google-mobile-ads (if React Native)
- For web: Partner with Playwire or similar
- Test ads in sandbox mode first
- GDPR compliance (consent banner)

**Acceptance Criteria**:
- [ ] Ads load reliably (>95% fill rate)
- [ ] Rewards granted after full video view
- [ ] Frequency cap enforced
- [ ] "Remove Ads" purchase disables ads
- [ ] GDPR consent collected

**Revenue Estimate**: $0.10 per ad view, 1000 DAU × 2 ads/day = $200/month

**Impact**: $500-2K/month passive revenue
**Inspiration**: Candy Crush (rewarded ads), Subway Surfers

---

#### 3.4 Premium Subscriptions v2
**Priority**: P1 (High)

**Requirements**:
- Update existing subscription to include game perks:
  - **Free Tier**: Access to all courses, 2 games, leaderboards
  - **Premium Tier ($9.99/month or $79.99/year)**:
    - All Free tier features
    - 500 bonus gems per month
    - Exclusive premium cosmetics (5 items)
    - Battle pass included (save $4.99)
    - Priority support
    - Ad-free experience
    - Early access to new content
    - 2x XP multiplier
- "Try Premium Free for 7 Days" trial
- Cancel anytime

**Acceptance Criteria**:
- [ ] Subscription page updated with game perks
- [ ] Gems granted monthly
- [ ] Premium cosmetics unlocked
- [ ] 2x XP multiplier applies
- [ ] Trial converts to paid after 7 days
- [ ] Cancellation works correctly

**Impact**: Increase subscription conversion 2-3x (from 2% to 6%)
**Inspiration**: Duolingo Plus, YouTube Premium

---

### Phase 4: Scaling (Week 7-8) - 40 hours

#### 4.1 Replay System
#### 4.2 Progressive Unlock System
#### 4.3 Weekly Content Drops
#### 4.4 A/B Testing Framework
#### 4.5 Localization (Spanish + Portuguese)

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React + Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Game Engine**: Canvas API + React hooks
- **State Management**: React Context + Zustand (for complex game state)

### Backend Stack
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (JWT)
- **Storage**: Cloudflare R2 (videos, audio, assets)
- **API**: Next.js API routes
- **Real-time**: Supabase Realtime (for leaderboards)

### Analytics Stack
- **Product Analytics**: PostHog
- **Performance Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry
- **A/B Testing**: PostHog Experiments

### Infrastructure
- **Hosting**: Vercel (Edge Functions)
- **CDN**: Cloudflare
- **Database**: Supabase (hosted PostgreSQL)
- **Monitoring**: Supabase Dashboard + Vercel

### Mobile Strategy
- **Phase 1**: PWA (Progressive Web App)
  - Installable on iOS/Android
  - Offline gameplay (service worker)
  - Push notifications (web push)
- **Phase 2** (Month 6): Native apps (React Native)
  - iOS App Store
  - Google Play Store
  - Share 80% codebase with web

---

## Success Metrics

### North Star Metric
**Weekly Active Users (WAU)** - Our primary success indicator

### KPI Dashboard

#### Acquisition
- **Target Month 1**: 1,000 users
- **Target Month 3**: 10,000 users
- **Target Month 6**: 100,000 users
- **Virality (K-factor)**: 0.3 (each user brings 0.3 more users)

#### Engagement
- **D1 Retention**: 35% → 45% → 55%
- **D7 Retention**: 15% → 25% → 35%
- **D30 Retention**: 5% → 15% → 25%
- **Avg Session Length**: 3 min → 7 min → 12 min
- **Sessions per User per Day**: 1.2 → 2.5 → 4.0
- **Daily Active Users / MAU**: 20% → 30% → 40%

#### Monetization
- **ARPU (Monthly)**: $0.50 → $2.00 → $5.00
- **Conversion to Paid**: 2% → 5% → 8%
- **LTV (Lifetime Value)**: $5 → $20 → $50
- **CAC (Customer Acquisition Cost)**: $10 → $8 → $5
- **LTV/CAC Ratio**: 0.5 → 2.5 → 10 (Target: >3)

#### Cross-Platform
- **Game Players → Course Viewers**: 5% → 15% → 30%
- **Game Players → Subscribers**: 1% → 3% → 7%
- **Course Viewers → Game Players**: 20% → 40% → 60%

### Analytics Events Volume (Expected)
- Month 1: 100K events
- Month 3: 1M events
- Month 6: 10M events

---

## Go-to-Market Strategy

### Target Audiences

#### Primary: Casual Football Fans (18-35)
- Watch NFL but don't play Madden (too complex)
- Want to understand the game better
- Mobile-first lifestyle
- Channels: TikTok, Instagram, Reddit (r/NFL)

#### Secondary: Fantasy Football Players
- Already engaged with football stats
- Competitive by nature
- Will love leaderboards
- Channels: FantasyPros, Sleeper, Discord

#### Tertiary: Educators & Coaches
- Looking for teaching tools
- Will share with teams/students
- B2B opportunity (team subscriptions)
- Channels: LinkedIn, Coach conferences

### Launch Strategy

#### Pre-Launch (Month -1)
- [ ] Build waitlist landing page
- [ ] Start TikTok account (@kickoffclubgames)
- [ ] Post 30 short clips of gameplay
- [ ] Target: 1,000 email signups

#### Launch Week (Week 1)
- [ ] Product Hunt launch (aim for #1 of the day)
- [ ] Reddit posts (r/NFL, r/NFLNoobs, r/gaming)
- [ ] Reach out to NFL Twitter influencers
- [ ] Press release to sports blogs
- [ ] Target: 500 DAU

#### Growth Phase (Month 1-3)
- [ ] TikTok ads ($5K budget)
- [ ] Instagram influencer partnerships (10 micro-influencers)
- [ ] Reddit ads targeting NFL subs
- [ ] Content marketing: "How games teach football IQ"
- [ ] Target: 10,000 MAU

#### Scale Phase (Month 4-6)
- [ ] App Store Optimization (ASO)
- [ ] Submit to App Store "Games We Love"
- [ ] Partnership with NFL media (stretch goal)
- [ ] User-generated content campaign
- [ ] Target: 100,000 MAU

### Content Marketing Strategy

**Blog Posts**:
1. "Why Arcade Games Are Better Teachers Than Textbooks"
2. "The Science of Gamification in Sports Education"
3. "How Blitz Rush Teaches Defensive Awareness"
4. "QB Precision: Learn Passing Windows Like Mahomes"

**Video Content** (YouTube + TikTok):
- Weekly challenge highlights
- Leaderboard spotlights
- Tips & tricks from top players
- Behind-the-scenes of game development

**Social Strategy**:
- Daily: Share top scores + highlights
- Weekly: Feature community member
- Monthly: Announce new features + content drops

---

## Roadmap

### Timeline Overview

```
Month 1 (Weeks 1-4): Foundation
├─ Week 1: Gameplay polish + Onboarding
├─ Week 2: Analytics + Daily challenges
├─ Week 3: XP system + Cross-platform integration
└─ Week 4: Leaderboards + Streaks

Month 2 (Weeks 5-8): Engagement
├─ Week 5: Social sharing + Tournaments
├─ Week 6: Friend system + Ghost mode
├─ Week 7: AI coach + Educational integration
└─ Week 8: Season events + Content drops

Month 3 (Weeks 9-12): Monetization
├─ Week 9: Cosmetics shop + Currency system
├─ Week 10: Battle pass
├─ Week 11: Ads integration
└─ Week 12: Premium features + Launch

Month 4-6: Scale & Iterate
├─ Mobile app (React Native)
├─ Advanced features (clan system, live events)
├─ Partnerships & PR
└─ Series A fundraising (if applicable)
```

### Detailed Sprint Breakdown

#### Sprint 1 (Week 1): Core Polish
**Goal**: Make games feel 10x better

**Tickets**:
- [ ] GAME-001: Progressive difficulty system (8h) [@dev]
- [ ] GAME-002: Mini-objectives & combos (6h) [@dev]
- [ ] GAME-003: Juice enhancements (screen shake, particles) (8h) [@dev]
- [ ] GAME-004: Sound improvements (4h) [@audio]
- [ ] GAME-005: Onboarding modals (6h) [@dev]
- [ ] GAME-006: Tutorial mode (4h) [@dev]
- [ ] GAME-007: Victory celebrations (4h) [@dev]

**Sprint Goal Metrics**:
- [ ] Avg session length: 3 min → 5 min
- [ ] D1 retention: 30% → 40%

---

#### Sprint 2 (Week 2): Data & Engagement
**Goal**: Understand users + Daily hooks

**Tickets**:
- [ ] GAME-008: PostHog integration (6h) [@dev]
- [ ] GAME-009: Event tracking implementation (8h) [@dev]
- [ ] GAME-010: Analytics dashboard setup (2h) [@pm]
- [ ] GAME-011: Daily challenge system (DB + API) (8h) [@backend]
- [ ] GAME-012: Daily challenge UI (6h) [@frontend]
- [ ] GAME-013: Challenge countdown timer (2h) [@frontend]
- [ ] GAME-014: Login streak system (6h) [@fullstack]

**Sprint Goal Metrics**:
- [ ] Analytics coverage: 80% of user actions
- [ ] Daily challenge completion rate: >30%
- [ ] 7-day streak rate: >15% of users

---

#### Sprint 3 (Week 3): Cross-Platform Integration
**Goal**: Leverage our education moat

**Tickets**:
- [ ] GAME-015: Unified XP system (DB schema) (4h) [@backend]
- [ ] GAME-016: XP transactions & level-up logic (6h) [@backend]
- [ ] GAME-017: XP UI (progress bar, level badge) (4h) [@frontend]
- [ ] GAME-018: Level rewards system (4h) [@fullstack]
- [ ] GAME-019: Game-to-course funnel (logic + UI) (6h) [@fullstack]
- [ ] GAME-020: Podcast listen mode integration (8h) [@fullstack]
- [ ] GAME-021: Educational pause screen (2h) [@frontend]
- [ ] GAME-022: Progressive unlock gates (4h) [@fullstack]

**Sprint Goal Metrics**:
- [ ] Game → Course conversion: >10%
- [ ] Podcast listens during games: >100
- [ ] Level 10 reached: >20% of users

---

#### Sprint 4 (Week 4): Social Features
**Goal**: Make it competitive & viral

**Tickets**:
- [ ] GAME-023: Enhanced leaderboard (avatars, filters) (8h) [@fullstack]
- [ ] GAME-024: Profile modal (6h) [@frontend]
- [ ] GAME-025: Ranking change calculations (4h) [@backend]
- [ ] GAME-026: Weekly tournament system (8h) [@fullstack]
- [ ] GAME-027: Social sharing (Open Graph cards) (6h) [@fullstack]
- [ ] GAME-028: Dynamic share images (8h) [@backend]
- [ ] GAME-029: "Challenge Friend" links (4h) [@fullstack]

**Sprint Goal Metrics**:
- [ ] Shares per 100 games: >5
- [ ] Viral coefficient: >0.1
- [ ] Tournament participation: >40%

---

## Risk & Mitigation

### Technical Risks

#### Risk 1: Performance Issues on Low-End Devices
**Probability**: Medium
**Impact**: High (50% of mobile users)
**Mitigation**:
- Use `requestAnimationFrame` for all animations
- Implement LOD (Level of Detail) for 3D elements
- Add "Low Graphics" mode in settings
- Test on iPhone SE, Android budget phones

#### Risk 2: Canvas API Compatibility
**Probability**: Low
**Impact**: High
**Mitigation**:
- Polyfills for older browsers
- Fallback to HTML5 elements for unsupported features
- Clear browser requirements (Chrome 90+, Safari 14+)

#### Risk 3: Database Scaling (Leaderboards)
**Probability**: Medium (if viral)
**Impact**: Medium
**Mitigation**:
- Use Supabase real-time with connection pooling
- Cache leaderboard data (5-minute TTL)
- Implement pagination (show top 100 only)
- Use Redis for high-traffic scenarios

---

### Product Risks

#### Risk 1: Low Retention After Initial Novelty
**Probability**: High
**Impact**: Critical
**Mitigation**:
- Phase 1 focuses on retention (daily challenges, streaks)
- Weekly content drops keep it fresh
- Cross-platform integration (courses) adds depth
- A/B test different engagement mechanics

#### Risk 2: Monetization Too Aggressive
**Probability**: Medium
**Impact**: High (reputation damage)
**Mitigation**:
- All games free to play forever
- Cosmetics only (no pay-to-win)
- Battle pass optional (free track still rewarding)
- Ads are opt-in (rewarded video only)

#### Risk 3: Not Differentiated Enough from Temple Run / Retro Bowl
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Education integration is unique moat
- NFL season alignment (timely events)
- Certificate credentials (real-world value)
- Community & social features (friend challenges)

---

### Market Risks

#### Risk 1: NFL Licensing Issues
**Probability**: Low
**Impact**: Critical
**Mitigation**:
- Don't use NFL trademarks/logos
- Generic football terms only (quarterback, touchdown)
- Legal review before launch
- Have EA's Madden doesn't own "football games"

#### Risk 2: Saturated Sports Game Market
**Probability**: High
**Impact**: Medium
**Mitigation**:
- Positioning: "Educational gaming" not "sports game"
- Target NFL noobs, not hardcore gamers
- Emphasize arcade fun + learning
- Go-to-market through education channels (not gaming)

---

## Appendix

### A. Competitor Analysis

| Competitor | Strength | Weakness | Our Advantage |
|------------|----------|----------|---------------|
| **Madden Mobile** | NFL licensed, realistic | Too complex, P2W, 10hr learning curve | Casual, educational, 30-second sessions |
| **Retro Bowl** | Addictive, simple gameplay | No education, single-player only | Courses + certificates + social |
| **Temple Run** | Polished, viral, 1B downloads | No sports theme, no learning | Football + education + NFL season tie-ins |
| **Duolingo** | Gamification expert, streaks | Not sports, text-heavy | Sports vertical + video content + arcade fun |
| **Candy Crush** | Addictive puzzle loops, 270M MAU | No education, P2W reputation | Educational value + sports theme + no energy system |
| **FarmVille** | Daily engagement, neighbor mechanics | Dated, energy walls | Modern UI + faster gameplay + no energy limits |

**Key Learnings from FarmVille/Candy Crush**:
- ✅ Daily collection rituals (we'll do: login streaks, daily challenges)
- ✅ Social gifting/helping (we'll do: friend challenges, share scores)
- ✅ Time-gated rewards (we'll do: tournament cycles, event passes)
- ✅ Multiple currency system (we'll do: coins + gems)
- ❌ Energy systems (we WON'T do: unlimited play)
- ❌ Aggressive monetization (we WON'T do: all cosmetics, no pay-to-win)

### B. Tech Stack Alternatives Considered

| Category | Chosen | Alternatives Considered | Reason |
|----------|--------|------------------------|---------|
| Game Engine | Canvas + React | Three.js, Phaser, Unity | Performance + React integration |
| Database | Supabase | Firebase, PlanetScale | RLS, PostgreSQL, real-time |
| Analytics | PostHog | Amplitude, Mixpanel | Open source, session replay |
| Hosting | Vercel | Netlify, Railway | Best Next.js support |

### C. Open Questions

1. **Mobile app timing**: Launch PWA first or go straight to native?
   - **Recommendation**: PWA first (faster, test demand), native in Month 6

2. **Monetization split**: Subscriptions vs IAP vs Ads?
   - **Recommendation**: 60% subscriptions (recurring), 30% IAP (cosmetics), 10% ads

3. **Live ops team**: When to hire someone for content drops?
   - **Recommendation**: After 10K MAU (Month 3)

4. **Partnerships**: Should we approach NFL teams/players early?
   - **Recommendation**: Wait until 100K users (credibility)

---

## Sign-Off

**Prepared by**: Product Team
**Reviewed by**: Engineering, Design, Marketing
**Approved by**: [Pending]

**Next Steps**:
1. [ ] Review PRD with stakeholders
2. [ ] Prioritize features (MoSCoW method)
3. [ ] Assign engineering resources
4. [ ] Kick off Sprint 1
5. [ ] Set up project tracking (Linear / Jira)

---

**Questions or feedback?** Contact the product team or comment on this document.

**Last Updated**: November 24, 2025
**Version**: 1.0
