# Football HQ Game Mechanics - Product Requirements Document

## Vision
Transform Kickoff Club HQ from a learning app into an **addictive football knowledge empire builder** that combines education with engaging game mechanics inspired by Farmville, My Cafe, and mobile RPGs.

---

## Core Game Loop

```
Learn Lessons → Earn Knowledge Points (KP) → Build/Upgrade HQ
       ↓                                              ↓
   Get Coins ← Complete Predictions ← Stadium Unlocked
       ↓                                              ↓
  Buy Merch ← Daily Tasks/Drills ← Practice Field Active
```

---

## 1. THE HQ (Your Home Base)

### Concept
Users build and manage their own "Football Headquarters" - a customizable space that grows as they learn.

### Buildings & Their Functions

#### 1.1 Film Room (Starter Building)
- **Purpose**: Where you watch video lessons
- **Mechanics**:
  - Watch lesson → Fills "knowledge meter"
  - Full meter → Produces 1 KP per hour (max 24 KP stored)
  - Upgrade levels:
    - Level 1: 1 KP/hour, max 24 storage
    - Level 2: 2 KP/hour, max 48 storage
    - Level 3: 3 KP/hour, max 72 storage
- **Visual**: Video screen showing highlights, chairs, notepads
- **Upgrade Cost**:
  - L1→L2: 500 coins + 50 KP
  - L2→L3: 1000 coins + 100 KP

#### 1.2 Practice Field (Unlocked at Level 5)
- **Purpose**: Complete mini-games/drills to earn coins
- **Mechanics**:
  - Tap-based drills (catch the ball, identify the play)
  - Each drill costs 5 energy
  - Success → 20-50 coins
  - Perfect score → 2x coins
  - Energy refills: 1 per 10 minutes (max 50)
- **Drills**:
  - **Route Runner**: Trace the receiver's route
  - **Play Caller**: Identify the offensive formation
  - **Field General**: Spot the open receiver
  - **Down Detective**: Guess the down & distance
- **Visual**: Green turf field with cones, players practicing
- **Upgrade Cost**:
  - L1→L2: More drills available
  - L2→L3: Higher coin rewards

#### 1.3 Stadium (Unlocked at Level 10)
- **Purpose**: Host prediction games with multipliers
- **Mechanics**:
  - Every prediction made here gets +10% coin bonus
  - Upgrade increases bonus (L2: +25%, L3: +50%)
  - Can "host" weekly tournaments
  - Attracts "fans" (cosmetic counter)
- **Visual**: Mini stadium with scoreboard, stands
- **Unlock Cost**: 2000 coins + 200 KP

#### 1.4 Draft Room (Unlocked at Level 15)
- **Purpose**: Collect "player cards" of NFL stars
- **Mechanics**:
  - Open "draft packs" (cost: 100 coins)
  - Cards have rarities: Common, Rare, Epic, Legendary
  - Completing sets → Bonus rewards
  - Cards teach you about players (educational)
- **Visual**: War room with draft board
- **Unlock Cost**: 3000 coins + 300 KP

#### 1.5 Locker Room (Unlocked at Level 8)
- **Purpose**: Display achievements, badges, trophies
- **Mechanics**:
  - Purely cosmetic/collection
  - Visiting friends can see your collection
  - Each achievement gives permanent small bonuses
- **Visual**: Lockers with jerseys, helmets, cleats
- **Unlock Cost**: 1500 coins + 150 KP

#### 1.6 Concession Stand (Unlocked at Level 12)
- **Purpose**: Buy items with coins (shop integration)
- **Mechanics**:
  - Direct link to shop
  - Level up → Unlock exclusive merch
  - "Daily special" items at discount
- **Visual**: Food stand with hot dogs, popcorn, merch
- **Unlock Cost**: 2500 coins + 250 KP

---

## 2. DUAL CURRENCY SYSTEM

### Knowledge Points (KP)
- **How to Earn**:
  - Complete lesson: 10 KP
  - Complete course: 50 KP
  - Film Room production: 1-3 KP/hour
  - Daily quiz: 5 KP
  - Achievement unlock: 10-50 KP
- **What It's For**:
  - Unlock buildings
  - Upgrade buildings
  - Speed up timers (5 KP = skip 1 hour)
  - Unlock premium courses

### Coins (Existing)
- **How to Earn**: (Keep existing + add new)
  - Watch lesson: 10 coins
  - Correct prediction: 2x wager
  - Practice drills: 20-50 coins
  - Daily challenges: 20 coins
  - Watch ads: 20 coins
  - Film Room production: 10 coins/hour (at max level)
- **What It's For**:
  - Predictions (existing)
  - Shop purchases (existing)
  - Upgrade buildings
  - Draft packs
  - Speed up timers (50 coins = skip 1 hour)

---

## 3. MINI-GAMES / DRILLS

### 3.1 Route Runner
- **Mechanic**: Swipe to trace the WR's route on field
- **Difficulty**: Route complexity increases
- **Reward**: 20-40 coins, teaches route concepts
- **Energy Cost**: 5

### 3.2 Play Caller
- **Mechanic**: Multiple choice - identify the formation
- **Difficulty**: More complex formations at higher levels
- **Reward**: 30 coins, teaches offensive schemes
- **Energy Cost**: 5

### 3.3 Field General
- **Mechanic**: Tap the open receiver in 3 seconds
- **Difficulty**: More defenders, tighter windows
- **Reward**: 25-50 coins, teaches reading defenses
- **Energy Cost**: 5

### 3.4 Down Detective
- **Mechanic**: Given field position, guess down & distance
- **Difficulty**: Tricky situations
- **Reward**: 20 coins, teaches game situations
- **Energy Cost**: 5

### 3.5 Snap Count (Rhythm Game)
- **Mechanic**: Tap when QB says "hike" (timing game)
- **Difficulty**: False starts, hard counts
- **Reward**: 15-30 coins, teaches snap cadence
- **Energy Cost**: 3

---

## 4. PROGRESSION SYSTEM

### User Levels (Separate from Account Level)
- **XP Sources**:
  - Complete lesson: 50 XP
  - Complete course: 200 XP
  - Win prediction: 25 XP
  - Perfect drill: 30 XP
  - Daily login: 10 XP

### Level Milestones
- **Level 5**: Unlock Practice Field
- **Level 8**: Unlock Locker Room
- **Level 10**: Unlock Stadium
- **Level 12**: Unlock Concession Stand
- **Level 15**: Unlock Draft Room
- **Level 20**: Unlock "Coach Mode" (create own drills)
- **Level 25**: Unlock "GM Mode" (advanced predictions)

---

## 5. SOCIAL FEATURES

### Visit Friends' HQs
- **Mechanic**:
  - See how friends designed their HQ
  - "Help" them by tapping their Film Room → +5 KP for both
  - Daily limit: Help 5 friends
- **Rewards**:
  - Helping friends: 5 KP + 10 coins
  - Friend visits you: 3 KP

### Leaderboards
- **Categories**:
  - Highest HQ level
  - Most prediction wins
  - Most drills completed
  - Most cards collected
- **Rewards**: Weekly prizes for top 10

### Guilds / Teams (Future)
- Create or join teams
- Team challenges
- Shared resources

---

## 6. DAILY/WEEKLY EVENTS

### Daily Missions
1. "Morning Film Session" - Watch 1 lesson (20 coins)
2. "Practice Makes Perfect" - Complete 3 drills (30 coins)
3. "Scout Report" - Make 1 prediction (10 coins)
4. "Team Spirit" - Help 3 friends (15 KP)

### Weekly Tournaments
- **Prediction Tournaments**: Most correct picks wins
- **Drill Championships**: Highest combined drill scores
- **Collection Events**: Find specific player cards
- **Prizes**: Exclusive badges, rare cards, bonus coins

---

## 7. TIME-GATED MECHANICS (Farmville Style)

### Building Upgrades
- Take real time to complete
- Example: Film Room L1→L2 = 2 hours
- Can speed up with KP or coins
- Notification when complete

### Film Room Production
- Produces KP passively while you're away
- Max storage limit (encourages returning)
- Collect with satisfying animation

### Energy System
- Practice drills cost energy
- 1 energy = 10 minutes
- Max 50 energy
- Premium users: Max 75 energy

---

## 8. MONETIZATION INTEGRATION

### Free to Play
- All features accessible
- Slower progression
- Ad-supported (watch ad for energy refill)

### Pro ($9.99/mo)
- 2x Film Room production
- 50% faster building upgrades
- Max 75 energy
- 1 free draft pack daily
- No ads

### Captain ($19.99/mo)
- Everything in Pro
- 3x Film Room production
- Instant building upgrades
- Max 100 energy
- 3 free draft packs daily
- Exclusive cosmetics

---

## 9. RETENTION HOOKS

### Daily Login Streaks
- Day 1: 50 coins
- Day 3: 100 coins
- Day 7: 1 rare draft pack
- Day 14: 500 coins + 50 KP
- Day 30: Legendary player card

### Push Notifications
- "Your Film Room is full! Collect now"
- "Energy refilled - time for practice"
- "New weekly tournament started"
- "Your friend helped you - return the favor"

### Limited Time Offers
- "Super Bowl Special Pack" during playoffs
- "Draft Day Deals" in April
- "Rookie of the Year Event" end of season

---

## 10. EDUCATIONAL TIE-IN

Every game mechanic teaches football:

- **Route Runner** → Learn route trees
- **Play Caller** → Understand formations
- **Field General** → Read defenses
- **Draft Room** → Learn player positions & stats
- **Stadium** → Understand game flow
- **Film Room** → Reinforce video lessons

**The game IS the curriculum.**

---

## 11. UI/UX DESIGN PRINCIPLES

### Visual Style
- **Isometric view** of HQ (like Farmville)
- **Vibrant colors**: Orange, green, gold
- **Animations**: Everything bounces, sparkles, celebrates
- **Particle effects**: Coins rain down, confetti on achievements

### Onboarding
1. "Welcome to your HQ!"
2. Tour of empty lot
3. Build first building (Film Room) - instant
4. Watch first lesson - earn first KP
5. Unlock Practice Field early (Level 1) for tutorial
6. Complete first drill - earn coins
7. "Now you're ready! Keep learning and building"

### Feedback Loops
- **Instant gratification**: Tap → Animation → Reward
- **Progress bars**: Always show progress to next unlock
- **Sound effects**: Satisfying dings, chimes, whooshes
- **Haptics**: Vibrate on success

---

## 12. TECHNICAL IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] HQ main screen with grid layout
- [ ] Film Room building (visual only)
- [ ] KP currency integration
- [ ] Basic tap interactions
- [ ] Simple animations (fade, slide)

### Phase 2: Core Loop (Week 3-4)
- [ ] Film Room production mechanic
- [ ] Practice Field with 2 drills
- [ ] Energy system
- [ ] Upgrade system
- [ ] Time-gated mechanics

### Phase 3: Progression (Week 5-6)
- [ ] XP/level system
- [ ] Building unlocks
- [ ] All 5 drills implemented
- [ ] Achievement system

### Phase 4: Social (Week 7-8)
- [ ] Friend system
- [ ] Visit friends' HQs
- [ ] Help mechanic
- [ ] Leaderboards

### Phase 5: Content (Week 9-10)
- [ ] Draft Room + card system
- [ ] Weekly tournaments
- [ ] More drills
- [ ] Seasonal events

### Phase 6: Polish (Week 11-12)
- [ ] Advanced animations
- [ ] Sound effects
- [ ] Push notifications
- [ ] Monetization optimization

---

## 13. SUCCESS METRICS

### Engagement
- Daily Active Users (DAU)
- Session length: Target 15+ min
- Sessions per day: Target 3+
- 7-day retention: Target 40%+
- 30-day retention: Target 20%+

### Monetization
- Conversion to Pro: Target 5-8%
- Average Revenue Per User (ARPU): Target $2/month
- Lifetime Value (LTV): Target $50+

### Learning
- Lessons completed per user: Target 10+
- Course completion rate: Target 30%+
- Prediction accuracy improvement: Track over time

---

## 14. EXAMPLE USER JOURNEY

**Sarah - Day 1**
1. Signs up, completes onboarding quiz (Rookie level)
2. Sees her empty HQ lot
3. Builds Film Room (instant)
4. Watches "What is Football?" lesson
5. Earns 10 KP, 10 coins, 50 XP
6. Film Room starts producing KP (1/hour)
7. Unlocks Practice Field at Level 1
8. Completes Route Runner drill - earns 25 coins
9. Gets notification: "Come back in 1 hour!"

**Sarah - Day 2**
1. Push notification: "Film Room is full!"
2. Opens app, collects 24 KP
3. Watches another lesson (20 KP total)
4. Completes daily challenge (50 coins earned)
5. Starts upgrading Film Room (2 hour timer)
6. Completes 3 drills while waiting
7. Upgrade completes - now 2 KP/hour

**Sarah - Week 1**
1. Reached Level 10
2. Unlocked Stadium
3. Completed first course
4. Made 5 predictions (2 correct)
5. Collected 15 player cards
6. Helped 10 friends
7. Feeling: "I'm learning AND having fun!"

---

## 15. COMPETITIVE ANALYSIS

### Similar Apps
- **Duolingo**: Streak system, XP, lessons
- **Farmville**: Buildings, timers, social visits
- **My Cafe**: Serve customers, collect items, upgrade
- **Clash of Clans**: Builder mechanics, social raids
- **Pokémon Go**: Collection, daily tasks, events

### Our Unique Angle
- **Only app** that gamifies football education
- **Passive + Active** gameplay (film room + drills)
- **Real rewards** (merch with coins)
- **Prediction integration** (real games matter)
- **Educational outcomes** (actually learn football)

---

## 16. RISKS & MITIGATION

### Risk: Too complex for beginners
- **Mitigation**: Gradual unlock system, simple onboarding

### Risk: Energy system feels limiting
- **Mitigation**: Generous energy cap, multiple refill options

### Risk: Pay-to-win perception
- **Mitigation**: Cosmetic advantages only, skill matters in drills

### Risk: Content burnout
- **Mitigation**: Weekly new drills, seasonal events, community content

---

## NEXT STEPS

1. ✅ Review and approve PRD
2. Create wireframes for HQ screen
3. Design building sprites
4. Implement core KP system
5. Build Film Room mechanic
6. Test with beta users
7. Iterate based on feedback
8. Launch Phase 1

---

**Target Launch**: 8-12 weeks from approval
**Estimated Dev Time**: 300-400 hours
**Team Needed**: 1 developer (you + AI), 1 designer (for sprites)

---

This transforms Kickoff Club HQ from a learning app into a **football knowledge game** that users can't put down.
