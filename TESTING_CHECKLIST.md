# Production Testing Checklist

## Critical User Flows

### 1. User Signup Flow ✓ READY TO TEST

**Steps to Test:**
1. Go to https://kickoff-club-hq.vercel.app
2. Click "Sign In" or "Start Training"
3. Click "Sign up now" on the auth page
4. Enter email and password
5. Verify email confirmation (check email inbox)
6. Confirm account activation works

**Expected Results:**
- ✅ User account created in Supabase `auth.users`
- ✅ Profile created in `public.profiles` table
- ✅ Email confirmation sent (if configured)
- ✅ User can log in after signup

**Files Involved:**
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- Supabase Auth (configured in `.env.local`)

---

### 2. Free Lesson Viewing Flow ✓ READY TO TEST

**Steps to Test:**
1. Click "Watch Free Lesson" button on homepage
2. Should navigate to `/courses/how-downs-work`
3. Click on a free lesson (how-downs-work, introduction-to-downs, ten-yard-rule, scoring-touchdowns, field-layout-basics)
4. Video should load from R2 storage

**Expected Results:**
- ✅ Free lessons accessible without authentication
- ✅ Video loads from Cloudflare R2
- ✅ Video player controls work (play, pause, fullscreen)
- ✅ No "Premium subscription required" error for free lessons

**Files Involved:**
- `app/courses/[courseSlug]/page.tsx`
- `app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx`
- `app/api/video-url/route.ts` (video access API)

**Videos in R2:**
- ✅ how-downs-work.mp4
- ✅ field-layout-basics.mp4
- ✅ scoring-touchdowns.mp4

---

### 3. Subscription Flow (Starter Pack - Free) ✓ READY TO TEST

**Steps to Test:**
1. Sign up for a new account
2. Navigate to `/pricing`
3. Click "Get Started" on Starter Pack (Free tier)
4. Should get access to free courses immediately

**Expected Results:**
- ✅ User `subscription_tier` set to 'free' in profiles table
- ✅ User `subscription_status` set to 'active'
- ✅ Can access all free tier courses and lessons

---

### 4. Subscription Flow (All-Access - $19.99/month) ⚠️ NEEDS MANUAL TEST

**Steps to Test:**
1. Sign in with test account
2. Navigate to `/pricing`
3. Click "Subscribe" on All-Access tier ($19.99/month)
4. Complete Stripe Checkout
5. Verify Stripe webhook processes payment
6. Check profile updated with subscription

**Expected Results:**
- ✅ Redirected to Stripe Checkout
- ✅ Payment processed successfully
- ✅ Stripe webhook fires `checkout.session.completed`
- ✅ Profile updated: `subscription_tier` = 'basic', `subscription_status` = 'active'
- ✅ Stripe Customer ID saved to profile
- ✅ Can access basic tier content

**Webhook Endpoint:**
- URL: `https://kickoff-club-hq.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Files Involved:**
- `app/api/stripe/webhook/route.ts`
- `app/api/stripe/create-checkout-session/route.ts`
- `.env.local` (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)

---

### 5. Premium Content Access ⚠️ NEEDS MANUAL TEST

**Steps to Test:**
1. Sign in with free tier account
2. Try to access a premium lesson (not in FREE_LESSONS list)
3. Should see "Premium subscription required" error
4. Subscribe to All-Access or Coaching Cohort
5. Try accessing premium lesson again
6. Should play successfully

**Expected Results:**
- ✅ Free users blocked from premium content
- ✅ Error message: "Premium subscription required"
- ✅ Paid users can access all content
- ✅ Video playback works with R2 signed URLs

**Premium Lessons (require subscription):**
- defensive-positions
- offensive-positions
- quarterback-101
- nfl-seasons-playoffs
- special-teams-basics
- timeouts-and-clock
- understanding-penalties
- fourth-down-decisions

---

### 6. Video Playback Testing ✓ READY TO TEST

**Videos to Test:**
1. how-downs-work.mp4
2. field-layout-basics.mp4
3. scoring-touchdowns.mp4

**Test Each Video:**
- ✅ Video loads without errors
- ✅ Play/pause works
- ✅ Seek/scrub timeline works
- ✅ Fullscreen works
- ✅ Volume controls work
- ✅ Video quality acceptable
- ✅ R2 signed URL expires correctly (after 2 hours)

**Files Involved:**
- `app/api/video-url/route.ts`
- `components/video-player.tsx` (if exists)

---

### 7. Dashboard Access ✓ READY TO TEST

**Steps to Test:**
1. Sign in with test account
2. Navigate to `/dashboard`
3. Test all dashboard pages:
   - `/dashboard` (main)
   - `/dashboard/analytics`
   - `/dashboard/certificates`
   - `/dashboard/my-courses`
   - `/dashboard/progress`
   - `/dashboard/saved`
   - `/dashboard/settings`
   - `/dashboard/subscription`

**Expected Results:**
- ✅ All pages load without errors
- ✅ User data displays correctly
- ✅ Progress tracking works
- ✅ Settings can be updated
- ✅ Subscription info displays correctly

---

## Environment Variables Verification

### Required in Vercel Production:

**Supabase:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Cloudflare R2:**
- ✅ `R2_ENDPOINT`
- ✅ `R2_ACCESS_KEY_ID`
- ✅ `R2_SECRET_ACCESS_KEY`
- ✅ `R2_BUCKET_NAME`
- ✅ `VIDEO_URL_EXPIRATION` (default: 7200)

**Stripe:**
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ⚠️ `STRIPE_WEBHOOK_SECRET` (NEEDS VERIFICATION)
- ✅ `STRIPE_PRICE_ID_BASIC`
- ✅ `STRIPE_PRICE_ID_PREMIUM`

**Resend (Email):**
- ✅ `RESEND_API_KEY`

**Google OAuth:**
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`

---

## Stripe Webhook Configuration

### Webhook Setup Steps:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://kickoff-club-hq.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Testing Stripe Webhooks:

```bash
# Use Stripe CLI to test webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## Database Verification

### Courses & Lessons:
- ✅ 10 courses exist
- ✅ 13 lessons exist
- ✅ Videos mapped correctly

### Tables Created:
- ✅ profiles
- ✅ courses
- ✅ lessons
- ✅ lesson_script_sections
- ✅ user_progress
- ✅ quiz_questions
- ✅ quiz_options
- ✅ quiz_attempts
- ✅ course_reviews
- ✅ bookmarks
- ✅ certificates
- ✅ achievements
- ✅ user_achievements
- ✅ lesson_comments (new)
- ✅ comment_replies (new)
- ✅ comment_likes (new)
- ✅ learning_paths (new)
- ✅ learning_path_courses (new)
- ✅ user_learning_paths (new)
- ✅ course_prerequisites (new)
- ✅ lesson_notes (new)
- ✅ user_streaks (new)
- ✅ daily_activity_log (new)
- ✅ leaderboard_entries (new)
- ✅ practice_drills (new)
- ✅ drill_attempts (new)
- ✅ drill_scores (new)

---

## Post-Launch Monitoring

### Errors to Watch For:
- 401 Unauthorized (auth issues)
- 403 Forbidden (RLS policy issues)
- 404 Not Found (video not in R2)
- 500 Server Error (check Vercel logs)
- Stripe webhook failures (check Stripe dashboard)

### Success Metrics to Track:
- User signups
- Free lesson views
- Subscription conversions
- Video playback completion rates
- Course completion rates

---

## Known Issues (Non-Critical):

- ⚠️ Course `tier` field is undefined (set to free/basic/premium later)
- ⚠️ Lesson script sections not populated (nice-to-have for enhanced UX)
- ⚠️ Some database features have schemas but no UI (comments, paths, groups - future features)

---

## Test Accounts (Create These):

1. **Free Tier Test Account**
   - Email: test-free@example.com
   - Test free lesson access only

2. **Paid Tier Test Account**
   - Email: test-paid@example.com
   - Subscribe to All-Access
   - Test all premium content

3. **Admin Test Account**
   - Email: admin@kickoff-club-hq.com
   - Test dashboard admin features
