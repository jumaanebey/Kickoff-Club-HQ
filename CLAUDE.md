# Kickoff Club HQ - Development Notes

## Project Status (Updated Nov 2024)
- Course pages are working for both authenticated and unauthenticated users
- Deployment: Vercel at kickoff-club-hq.vercel.app
- Database: Supabase PostgreSQL

## Recent Fixes Applied
1. **page.tsx** (`app/courses/[slug]/page.tsx`): Fixed serialization - only pass `{ tier, status }` not the full userSubscription object with functions
2. **course-detail-client.tsx**: Replaced `require()` inside render with proper ES6 import for UpgradePrompt
3. **Environment variables**: Fixed trailing newlines in SUPABASE_URL and ANON_KEY

## Critical Debugging Rules

### Next.js Server Components - Serialization Errors
When you see "An error occurred in the Server Components render":

1. **FIRST CHECK**: What data is being passed from Server Component to Client Component?
   - Functions CANNOT be serialized
   - Classes CANNOT be serialized
   - Only pass plain objects with primitive values

2. **Common pattern to fix**:
   ```typescript
   // BAD - passing object with function
   userSubscription={userSub}

   // GOOD - only pass serializable properties
   userSubscription={userSub ? { tier: userSub.tier, status: userSub.status } : null}
   ```

3. **If error happens only when logged in**: The authenticated code path is passing non-serializable data

### Client Component Issues
- NEVER use `require()` inside render functions - use ES6 imports at top
- Dynamic imports in client components must use `next/dynamic`

### Environment Variables
- Use `printf '%s' 'value' | vercel env add NAME production` to avoid trailing newlines
- Trailing newlines in Supabase URLs/keys cause auth failures

### Debugging Workflow (in order)
1. Check if error is auth-specific (works in incognito but not logged in?)
2. Look at what's passed from Server to Client components - find functions/classes
3. Check Vercel function logs: `vercel logs domain --since 2m`
4. Create debug API endpoint only if above fails

## Project Info
- Supabase URL: https://zejensivaohvtkzufdou.supabase.co
- Vercel domain: kickoff-club-hq.vercel.app

## Key Architecture Notes
- `getUserSubscription()` in `payments/subscriptions/server.ts` returns object with `canAccessCourse` function - NEVER pass this directly to client components
- Course pages use Server Components with Client Component children
- Database uses `is_published` column that can be NULL (treated as published)

## Future Recommendations
1. **Be fast and decisive** - user values time, don't iterate slowly
2. **Check serialization first** on Server Component errors - look at what's passed to client
3. **Test authenticated path** - if incognito works but logged-in fails, issue is in auth code
4. **Deploy and test** - don't ask multiple clarifying questions, make the fix and deploy
5. **Clean up background processes** - there are many stale background bash processes running
