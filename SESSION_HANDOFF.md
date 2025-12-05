# Session Handoff: Mobile App Squad & Match Features

**Date:** 2025-11-28
**Branch:** `claude/kickoff-club-app-build-01YUGEsf1KeQnKQHFqPuroHS`
**User:** jumaanebey@gmail.com (ID: fc3f9983-76dc-4e37-bb2f-87663c8f941d)

## 🎯 Session Goal
Build Squad (training) and Match (simulation) features for the mobile football management game.

## ✅ Completed Work

### 1. Navigation Integration
- ✅ Added Squad tab (people icon) to bottom navigation
- ✅ Added Match tab (football icon) to bottom navigation
- ✅ Updated `MainTabParamList` types
- ✅ App now shows 7 tabs total

### 2. Database Schema Created
All tables created in Supabase:

**unit_training_sessions:**
```sql
- id, user_id, unit_type, started_at, completes_at
- energy_cost (5), completed, collected
- RLS policies enabled
```

**match_history:**
```sql
- id, user_id, opponent_level, opponent_team_readiness
- user_score, opponent_score, won
- coins_earned, xp_earned, kp_earned
- RLS policies enabled
```

**profiles updates:**
- Added `team_readiness` column (default 50)

### 3. Database Functions Created

**start_training(user_id, unit_type):**
- Costs 5 energy (reduced from 10)
- Creates 5-minute training session
- Returns session_id and completes_at

**collect_training(session_id):**
- Awards +5 team readiness
- Marks session as collected

**play_match(user_id):**
- Costs 10 energy (reduced from 20)
- Generates opponent based on user level
- Simulates match with realistic scores
- Awards 50 coins + 25 XP (win) or 10 coins + 5 XP (loss)

### 4. UI Screens Built

**SquadScreen.tsx:**
- Shows 5 unit types with icon placeholders
- Real-time countdown timers (updates every 1 second)
- "Train (5 Energy)" buttons
- "Collect (+5 Readiness)" buttons when ready
- Team readiness progress bar
- Energy display at top

**MatchScreen.tsx:**
- Match stats dashboard (wins, losses, win rate)
- "Play Match (10 Energy)" button
- 3-second loading animation
- Victory/defeat results screen with gradients
- Scoreboard with realistic scores
- Rewards breakdown (coins, XP, KP)
- "Play Again" functionality

### 5. Energy System Adjustments
- Training: 10 → **5 energy**
- Match: 20 → **10 energy**
- Target: 10-15 sessions per day
- Regen rate: 1 per 2 minutes (documented for future implementation)

### 6. Asset Management
- Disabled all building/unit asset imports (waiting for Antigravity)
- Using icon placeholders instead of images
- Squad screen uses Ionicons with state-based colors

## ❌ Critical Issue: Energy Not Displaying

### The Problem
- Database shows user has `energy: 100`
- App consistently shows `0 / 100` energy
- Profile not refreshing after database updates

### What We Tried
1. ✅ Direct SQL UPDATE to set energy = 100
2. ✅ Reload Supabase schema cache (NOTIFY pgrst)
3. ✅ Sign out/sign in
4. ✅ Completely close and reopen Expo Go
5. ✅ Grant proper permissions to authenticated role
6. ❌ None worked - app still shows 0

### Verified Working
- `SELECT * FROM profiles WHERE id = 'fc3f9983-76dc-4e37-bb2f-87663c8f941d'` returns energy = 100
- Tables exist and are accessible
- RLS policies are correct
- Schema cache reloaded multiple times

### Hypothesis for Next Session
Possible causes to investigate:
1. **getProfile() function bug** - May not be selecting energy field
2. **Client-side caching** - AsyncStorage or React state holding stale data
3. **RLS policy edge case** - Something blocking energy field specifically
4. **Database trigger** - Unknown trigger resetting energy on read
5. **Supabase client configuration** - PostgREST not exposing energy field

## 📋 Next Session Tasks

### Priority 1: Fix Energy Display (CRITICAL)
1. Check `getProfile()` in `mobile-app/src/services/supabase.ts`
2. Verify it selects the `energy` field explicitly
3. Test direct Supabase query from app vs SQL editor
4. Check for AsyncStorage caching issues
5. Add console.log to see what data getProfile() actually returns

### Priority 2: Test Core Gameplay Loop
Once energy displays correctly:
1. Train a unit (costs 5 energy)
2. Wait 5 minutes, collect training (+5 readiness)
3. Play a match (costs 10 energy)
4. Verify rewards awarded
5. Test multiple sessions

### Priority 3: Schema Cache Issues
- Match stats still showing schema cache errors
- Need to ensure `match_history` table is fully visible to PostgREST
- May need to restart Supabase project if NOTIFY doesn't work

## 🔧 Quick Debug Commands for Next Session

**Check user's current energy:**
```sql
SELECT id, email, energy, last_energy_update, team_readiness
FROM profiles
WHERE id = 'fc3f9983-76dc-4e37-bb2f-87663c8f941d';
```

**Refill energy for testing:**
```sql
UPDATE profiles
SET energy = 100, last_energy_update = NOW()
WHERE id = 'fc3f9983-76dc-4e37-bb2f-87663c8f941d';
```

**Check if tables are visible to PostgREST:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('unit_training_sessions', 'match_history');
```

**Reload schema cache:**
```sql
NOTIFY pgrst, 'reload schema';
```

## 📁 Key Files Modified

**Mobile App:**
- `mobile-app/src/navigation/index.tsx` - Added Squad/Match tabs
- `mobile-app/src/types/index.ts` - Updated MainTabParamList
- `mobile-app/src/screens/Main/SquadScreen.tsx` - NEW
- `mobile-app/src/screens/Main/MatchScreen.tsx` - NEW
- `mobile-app/src/constants/assets.ts` - Disabled asset imports
- `mobile-app/src/services/supabase.ts` - Added training/match functions

**Database:**
- `supabase/migrations/20251128_create_training_and_match_systems.sql`
- `supabase/migrations/20251128_adjust_energy_costs.sql`

## 🎨 Waiting on Antigravity

**106 PNG files needed:**
- 15 unit graphics (5 types × 3 states)
- 50 building graphics (5 buildings × 5 levels × 2 resolutions)
- 15 resource/action icons
- 16 match UI elements
- 10 background images

Once delivered, update `mobile-app/src/constants/assets.ts` to import them.

## 🚀 User Can See
- 7 tabs in navigation (HQ, Squad, Match, Predict, Learn, Shop, Profile)
- Squad screen with 5 units (text only, no graphics)
- Match screen (can't test - no energy displaying)
- Expected errors: Daily Missions, HQ Buildings (not implemented yet)

## 🐛 User Cannot Do
- Train units (shows 0 energy)
- Play matches (shows 0 energy)
- Test the core gameplay loop

## 💡 Success Criteria for Next Session
1. Energy displays as **100 / 100** in app
2. User can tap "Train (5 Energy)" and see countdown timer
3. User can collect training after 5 minutes
4. User can play a match and see victory/defeat screen
5. Energy depletes correctly (100 → 95 → 85 after 1 train + 1 match)

---

**Start next session by debugging `getProfile()` to see why energy returns as 0.**
