# Mobile App Database Migration Guide

## Overview
This migration adds all missing database features required by the mobile app:
- ✅ Knowledge Points system
- ✅ User Buildings (HQ management)
- ✅ Daily Missions system
- ✅ Squad Units & Training system
- ✅ User Seasons & Match simulations

## How to Apply

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Migration
1. Open the file: `consolidated_mobile_app_schema.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** or press `Cmd/Ctrl + Enter`

### Step 3: Verify Success
The migration will automatically run a verification query at the end showing the tables created:
```
table_name                      | row_count
--------------------------------|----------
knowledge_point_transactions    | 0
user_buildings                  | 0
mission_templates               | 17
user_missions                   | 0
user_squad_units                | 0
training_sessions               | 0
user_seasons                    | 0
user_match_results              | 0
```

## What This Migration Includes

### 1. Knowledge Points System
- **Tables**: `knowledge_point_transactions`, `user_buildings`
- **Functions**: `add_knowledge_points()`, `subtract_knowledge_points()`, `refill_energy()`
- **Features**: Energy system (refills 1 per 5 minutes, max 100)

### 2. Daily Missions System
- **Tables**: `mission_templates`, `user_missions`
- **Functions**: `assign_daily_missions()`, `update_mission_progress()`, `claim_mission_reward()`
- **Features**: 17 pre-populated mission templates with different rarities (common, rare, epic, legendary)

### 3. Squad Units & Training
- **Tables**: `user_squad_units`, `training_sessions`
- **Functions**: `initialize_user_squad()`, `start_training_session()`, `complete_training_session()`
- **Features**: 8 different unit types (QB, RB, WR, etc.), FarmVille-style training timers

### 4. Seasons & Matches
- **Tables**: `user_seasons`, `user_match_results`
- **Functions**: `simulate_match()`
- **Features**: Season tracking, AI match simulation with rewards

## After Migration

### Initialize Squad for Existing Users
For any existing users, you can initialize their squad by running:
```sql
SELECT initialize_user_squad(id) FROM profiles;
```

### Assign Daily Missions
To assign daily missions to users:
```sql
SELECT assign_daily_missions('user-uuid-here');
```

## Troubleshooting

### If migration fails with "table already exists"
The migration uses `CREATE TABLE IF NOT EXISTS` so it's safe to re-run. Tables that already exist will be skipped.

### If functions fail with "already exists"
The migration uses `CREATE OR REPLACE FUNCTION` so functions will be updated to the latest version.

### To rollback (if needed)
```sql
DROP TABLE IF EXISTS user_match_results CASCADE;
DROP TABLE IF EXISTS user_seasons CASCADE;
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS user_squad_units CASCADE;
DROP TABLE IF EXISTS user_missions CASCADE;
DROP TABLE IF EXISTS mission_templates CASCADE;
DROP TABLE IF EXISTS user_buildings CASCADE;
DROP TABLE IF EXISTS knowledge_point_transactions CASCADE;

DROP FUNCTION IF EXISTS simulate_match CASCADE;
DROP FUNCTION IF EXISTS complete_training_session CASCADE;
DROP FUNCTION IF EXISTS start_training_session CASCADE;
DROP FUNCTION IF EXISTS initialize_user_squad CASCADE;
DROP FUNCTION IF EXISTS claim_mission_reward CASCADE;
DROP FUNCTION IF EXISTS update_mission_progress CASCADE;
DROP FUNCTION IF EXISTS assign_daily_missions CASCADE;
DROP FUNCTION IF EXISTS refill_energy CASCADE;
DROP FUNCTION IF EXISTS subtract_knowledge_points CASCADE;
DROP FUNCTION IF EXISTS add_knowledge_points CASCADE;
```

## Mobile App Errors This Fixes

This migration resolves the following errors in your mobile app:
- ❌ `Could not find the function public.assign_daily_missions(p_user_id)` → ✅ Fixed
- ❌ `Could not find the table 'public.user_buildings'` → ✅ Fixed
- ❌ `Could not find the function public.initialize_user_squad` → ✅ Fixed
- ❌ Missing Knowledge Points system → ✅ Added
- ❌ Missing Training/Drills system → ✅ Added
- ❌ Missing Seasons system → ✅ Added

## Next Steps

After applying this migration:
1. Restart your mobile app (it's already running on Expo)
2. The database errors should be resolved
3. Test the following features:
   - Daily Missions screen
   - Squad/Training screen
   - Knowledge Points/Buildings
   - Season/Match simulation

## Questions?

If you encounter any issues, check:
1. Supabase logs in the Dashboard → Logs section
2. Mobile app console for any remaining errors
3. Ensure Row Level Security (RLS) policies are working correctly
