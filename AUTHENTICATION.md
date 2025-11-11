# Authentication Setup Guide

## Overview

Kickoff Club HQ now has full authentication implemented using Supabase Auth. Users can sign up, sign in, and have their progress tracked across the platform.

## What's Implemented

### 1. Authentication Infrastructure ✅

- **Supabase Auth** integration with SSR support
- **Middleware** for automatic session refresh
- **Server/Client** Supabase clients for different contexts
- **Auth helpers** for Next.js App Router

### 2. Authentication Pages ✅

- **Sign In** (`/auth/sign-in`)
  - Email/password authentication
  - Google OAuth (ready but needs configuration)
  - Redirect to dashboard on success

- **Sign Up** (`/auth/sign-up`)
  - User registration with name, email, password
  - Email confirmation flow
  - Google OAuth (ready but needs configuration)

- **OAuth Callback** (`/auth/callback`)
  - Handles OAuth redirects
  - Exchanges code for session

### 3. User Interface ✅

- **Header Navigation**
  - Shows "Sign In" and "Sign Up" buttons for guests
  - Shows user menu with avatar for authenticated users
  - Dropdown menu with Dashboard, Progress, Settings, Sign Out

- **Protected Features**
  - Enrollment requires authentication
  - Video progress tracking requires authentication
  - Dashboard pages work with authenticated users

### 4. Database Integration ✅

- **Profile Auto-Creation**
  - Trigger creates profile when user signs up
  - Syncs name and avatar from auth metadata

- **Row Level Security**
  - Users can only access their own data
  - Courses and lessons are publicly viewable
  - Progress and enrollments are private

## Setup Instructions

### Step 1: Run the Profile Trigger (Required)

This trigger automatically creates a profile for new users:

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new
2. Copy and run `/supabase/create-profile-trigger.sql`
3. Verify it was created successfully

### Step 2: Configure Email Settings (Optional but Recommended)

For production, configure your email settings in Supabase:

1. Go to Authentication → Email Templates
2. Customize the confirmation email
3. Set up a custom SMTP provider (optional)

### Step 3: Enable Google OAuth (Optional)

To enable "Sign in with Google":

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Set authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## How Authentication Works

### Sign Up Flow

1. User fills out sign-up form
2. Supabase creates auth user
3. Trigger automatically creates profile
4. Confirmation email sent
5. User clicks link to verify email
6. User can now sign in

### Sign In Flow

1. User enters email/password
2. Supabase validates credentials
3. Session created and stored in cookies
4. User redirected to dashboard
5. Middleware keeps session fresh

### Session Management

- **Middleware** (`middleware.ts`) runs on every request
- Automatically refreshes expired sessions
- Works with Server Components
- Cookies manage session state

### Authentication in Components

**Server Components:**
```typescript
import { getUser } from '@/app/actions/auth'

const user = await getUser()
if (user) {
  // User is authenticated
}
```

**Client Components:**
```typescript
import { createClientComponentClient } from '@/database/supabase/client'

const supabase = createClientComponentClient()
const { data: { user } } = await supabase.auth.getUser()
```

## Testing Authentication

### Test Sign Up

1. Go to http://localhost:3000/auth/sign-up
2. Create an account with a test email
3. Check your email for confirmation link
4. Click link to verify account

**Note:** In development, check Supabase Dashboard → Authentication → Users to see the confirmation link if emails aren't being sent.

### Test Sign In

1. Go to http://localhost:3000/auth/sign-in
2. Enter your credentials
3. Should redirect to `/dashboard/my-courses`
4. Header should show your user menu

### Test Protected Features

1. **While Signed Out:**
   - Try to enroll in a course
   - Should redirect to sign-in page

2. **While Signed In:**
   - Enroll in a course
   - Watch a lesson (progress auto-saves)
   - Mark lesson complete
   - Check dashboard for progress

## Current Limitations

### Email Confirmation Required

By default, Supabase requires email confirmation. To disable for testing:

1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"
3. Users can sign in immediately after registration

### No Password Reset

Password reset flow is not yet implemented. To add:

1. Create `/auth/forgot-password` page
2. Create `/auth/reset-password` page
3. Use `supabase.auth.resetPasswordForEmail()`

### No Social Providers

Google OAuth is ready but not configured. Other providers (GitHub, Twitter, etc.) can be added in Supabase Dashboard → Authentication → Providers.

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with these policies:

- **Profiles:** Users can read/update their own profile only
- **Courses:** Anyone can read published courses
- **Lessons:** Anyone can read published lessons
- **User Progress:** Users can read/update their own progress only
- **Enrollments:** Users can read/create their own enrollments only

### Authentication Checks

- Server Actions validate `auth.uid()` from session
- Client components check user before API calls
- Middleware ensures session is valid on every request

### Environment Variables

Sensitive keys are in `.env.local` (not committed to git):

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The anon key is safe to expose publicly - it's restricted by RLS policies.

## Next Steps

### Immediate Improvements

1. **Get User Progress**
   - Load actual progress from database
   - Show completion status in lesson sidebar
   - Display watch position when video loads

2. **Dashboard Data**
   - Replace placeholder data with real enrollments
   - Calculate actual statistics
   - Show real achievements based on progress

3. **Password Reset**
   - Add forgot password flow
   - Add reset password page
   - Send recovery emails

### Future Enhancements

1. **Profile Management**
   - Allow users to upload avatars
   - Edit profile information
   - View learning statistics

2. **Social Authentication**
   - Configure Google OAuth
   - Add GitHub authentication
   - Add Discord authentication

3. **Email Notifications**
   - Course completion emails
   - New lesson notifications
   - Weekly progress reports

4. **Account Management**
   - Change email
   - Change password
   - Delete account
   - Export user data

## Troubleshooting

### "User already registered" error

This means the email is already in the auth.users table. Check Supabase Dashboard → Authentication → Users.

### No profile created after sign up

1. Check if the trigger was created: `/supabase/create-profile-trigger.sql`
2. Check Supabase logs for trigger errors
3. Manually insert profile if needed

### Session not persisting

1. Check browser cookies are enabled
2. Verify middleware is running (check logs)
3. Clear cookies and try again

### OAuth redirect issues

1. Verify redirect URL matches exactly in Google Console
2. Check callback route exists at `/auth/callback`
3. Ensure NEXT_PUBLIC_SUPABASE_URL is correct

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js SSR Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
