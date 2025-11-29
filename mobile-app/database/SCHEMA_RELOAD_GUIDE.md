# Supabase Schema Cache Reload Guide

## Current Status

All database tables have been created successfully:
- ✅ `user_buildings`
- ✅ `mission_templates`
- ✅ `user_missions`
- ✅ `knowledge_point_transactions`
- ✅ `profiles` (3 new columns added)

However, the **PostgREST API cache** hasn't refreshed yet, so the mobile app can't access these tables.

## Quick Manual Reload (Recommended)

Follow these steps to manually reload the schema cache:

### Option 1: SQL Editor Method (Fastest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/zejensivaohvtkzufdou)
2. Click **SQL Editor** in the left sidebar
3. Paste this SQL command:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
4. Click **Run** button
5. You should see "Success. No rows returned"
6. Wait 10-30 seconds, then refresh your mobile app

### Option 2: Wait for Automatic Reload

The cache will automatically refresh within 5-10 minutes after we terminated the PostgREST backends. Just wait a bit longer and try refreshing your app.

### Option 3: Restart PostgREST (If Available)

If you have access to Supabase project settings:
1. Go to **Settings** → **API**
2. Look for a "Restart API" or "Reload Schema" button
3. Click it and wait for the reload to complete

## Verification

After reloading, run this command to verify:

```bash
node scripts/verify-schema.js
```

You should see all ✅ SUCCESS messages.

## Troubleshooting

### Still Getting Errors After 10 Minutes?

Try this alternative SQL command:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE application_name = 'postgrest';
```

This forces a complete PostgREST restart and should refresh the cache immediately.

### App Still Shows Errors?

1. Close the mobile app completely
2. Clear app data/cache if needed
3. Restart the app
4. The tables should now be accessible

## What We've Already Tried

- ✅ Created all tables and columns
- ✅ Ran `NOTIFY pgrst` command
- ✅ Terminated PostgREST backends
- ⏳ Waiting for automatic cache refresh

## Sources

- [Supabase PostgREST Schema Reload Documentation](https://supabase.com/docs/guides/troubleshooting/refresh-postgrest-schema)
- [PostgREST Schema Cache Reference](https://docs.postgrest.org/en/latest/references/schema_cache.html)

---

**Last Updated:** 2025-11-29
**Status:** Waiting for cache refresh
